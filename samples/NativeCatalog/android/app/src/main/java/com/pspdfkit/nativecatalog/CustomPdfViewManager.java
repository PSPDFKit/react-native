package com.pspdfkit.nativecatalog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Paint;
import android.net.Uri;
import android.text.TextPaint;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.annotations.InkAnnotation;
import com.pspdfkit.annotations.WidgetAnnotation;
import com.pspdfkit.annotations.configuration.InkAnnotationConfiguration;
import com.pspdfkit.configuration.PdfConfiguration;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.forms.SignaturePickerOrientation;
import com.pspdfkit.configuration.signatures.SignatureSavingStrategy;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.processor.PageCanvas;
import com.pspdfkit.document.processor.PdfProcessor;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.forms.SignatureFormElement;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.nativecatalog.events.DocumentDigitallySignedEvent;
import com.pspdfkit.nativecatalog.events.DocumentWatermarkedEvent;
import com.pspdfkit.react.menu.ReactGroupingRule;
import com.pspdfkit.signatures.Signature;
import com.pspdfkit.signatures.SigningManager;
import com.pspdfkit.signatures.TrustedKeyStore;
import com.pspdfkit.signatures.listeners.OnSignaturePickedListener;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.signatures.SignatureOptions;
import com.pspdfkit.ui.signatures.SignaturePickerFragment;
import com.pspdfkit.utils.Size;
import com.pspdfkit.views.PdfView;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;


/**
 * Shows you how to leverage the {@link PdfView} to build your own react view.
 */
public class CustomPdfViewManager extends SimpleViewManager<PdfView> {

    private final ReactApplicationContext reactApplicationContext;

    public CustomPdfViewManager(ReactApplicationContext reactApplicationContext) {
        super();
        this.reactApplicationContext = reactApplicationContext;
    }

    private void addJohnAppleseedCertificateToTrustedCertificates(@NonNull Context context) {
        InputStream keystoreFile = null;
        try {
            keystoreFile = context.getAssets().open("JohnAppleseed.p12");

            KeyStore key = KeyStore.getInstance("pkcs12");
            key.load(new FileInputStream("JohnAppleseed.p12"), null);
            // Inside a p12 we have both the certificate and private key used for signing. We just need the certificate here.
            // Proper signatures should have a root CA approved certificate making this step unnecessary.
            Enumeration e = key.aliases();
            while (e.hasMoreElements()) {
                String alias = (String) e.nextElement();
                if (key.getCertificate(alias).getType().equals("X.509")) {
                    TrustedKeyStore.INSTANCE.addTrustedCertificates(List.of((X509Certificate) key.getCertificate(alias)));
                }
            }
        } catch (IOException | GeneralSecurityException e) {
            Log.e("PSPDFKit", "Couldn't load and add John Appleseed certificate to trusted certificate list!");
        } finally {
            if (keystoreFile != null) {
                try {
                    keystoreFile.close();
                } catch (IOException e) {
                    Log.e("PSPDFKit", "Couldn't load and add John Appleseed certificate to trusted certificate list!");
                }
            }
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomPdfView";
    }

    @NonNull
    @Override
    protected PdfView createViewInstance(@NonNull ThemedReactContext reactContext) {
        Activity currentActivity = reactContext.getCurrentActivity();
        if (currentActivity instanceof FragmentActivity) {
            FragmentActivity fragmentActivity = (FragmentActivity) currentActivity;

            // You can create a PdfView in your own view manager to reuse all the work our wrapper already does.
            PdfView pdfView = new PdfView(reactContext);

            // Make sure to inject all the classes the view needs to function.
            pdfView.inject(fragmentActivity.getSupportFragmentManager(),
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher());

            // Setup any configuration you want, you could even make this a prop.
            PdfActivityConfiguration config = new PdfActivityConfiguration.Builder(reactContext)
                .setSignaturePickerOrientation(SignaturePickerOrientation.UNLOCKED)
                .signatureSavingStrategy(SignatureSavingStrategy.NEVER_SAVE)
                .autosaveEnabled(false)
                .build();
            pdfView.setConfiguration(config);

            // The pdf view needs a fragment tag to function, make sure this is unique inside your app.
            pdfView.setFragmentTag("pdfView");

            // Finally return it to react-native.
            return pdfView;
        }

        throw new IllegalStateException("CustomPdfView can only be used in FragmentActivity subclasses.");
    }

    // This will allow us to set the document via react-native.
    @ReactProp(name = "document")
    public void setDocument(PdfView view, @NonNull String document) {
        if (document.contains("|ADD_WATERMARK")) {
            // Get the path without our tag in it.
            String documentPath = document.substring(0, document.length() - "|ADD_WATERMARK".length());
            // Then load the document.
            PdfDocumentLoader.openDocumentAsync(view.getContext(), Uri.parse(documentPath))
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(pdfDocument -> {
                    // Once we have the document apply our watermark.
                    applyWatermark(view, pdfDocument);
                });
        } else {
            view.setDocument(document, this.reactApplicationContext);
        }

        view.getPdfFragment()
                .take(1)
                .firstOrError()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe((pdfFragment, throwable) -> {
                    pdfFragment.addDocumentListener(new SimpleDocumentListener() {
                        @Override
                        public void onDocumentLoaded(@NonNull PdfDocument document) {
                            // When the document is loaded we configure a custom annotation configuration for ink annotations.
                            // While this is applied in all examples, the DefaultAnnotationSettingsScreen example is
                            // the reason this was added.
                            applyCustomAnnotationConfiguration(view);
                        }
                    });
                });
    }

    @SuppressLint("CheckResult")
    private void applyCustomAnnotationConfiguration(@NonNull final PdfView view) {
        // You first need to grab the current PdfFragment.
        view.getPdfFragment()
            .take(1)
            .firstOrError()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe((pdfFragment, throwable) -> {
                // Then you can apply your AnnotationConfiguration.
                if (pdfFragment != null) {
                    // See https://pspdfkit.com/guides/android/current/annotations/annotation-configuration/#customizing-annotation-configuration
                    // for more information about this.
                    pdfFragment.getAnnotationConfiguration().put(AnnotationType.INK,
                        InkAnnotationConfiguration.builder(view.getContext())
                            // We always want red ink, with a thick stroke.
                            .setDefaultColor(Color.RED)
                            .setDefaultThickness(15)
                            // If this is set, even when the user changes the options
                            // the next time they use the tool the defaults configured here will be applied again.
                            .setForceDefaults(true)
                            .build());
                }
            });
    }

    @SuppressLint("CheckResult")
    @ReactProp(name = "menuItemGrouping")
    public void setMenuItemGrouping(PdfView view, @NonNull ReadableArray menuItemGrouping) {
        ReactGroupingRule groupingRule = new ReactGroupingRule(view.getContext(), menuItemGrouping);
        view.setMenuItemGroupingRule(groupingRule);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        // Get the default events exposed by the PdfView.
        Map map = PdfView.createDefaultEventRegistrationMap();
        // This is the event that is sent after digitally signing.
        map.put(DocumentDigitallySignedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentDigitallySigned"));
        // This is the event that is sent after watermarking.
        map.put(DocumentWatermarkedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentWatermarked"));
        return map;
    }

    @Override
    public void receiveCommand(@NonNull PdfView root, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        switch (commandId) {
            case "createWatermark":
                // The user clicked the create watermark button, start our watermarking process.
                performWatermarking(root);
                break;
        }
    }

    private void performWatermarking(@NonNull PdfView pdfView) {
        pdfView.getActivePdfFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfFragment -> {
                PdfDocument document = pdfFragment.getDocument();
                applyWatermark(pdfView, document);
            });
    }

    private void applyWatermark(@NonNull PdfView pdfView, @NonNull PdfDocument document) throws IOException {
        // Create our task we'll use for watermarking.
        PdfProcessorTask task = PdfProcessorTask.fromDocument(document);

        // Now we'll add a text on each page.
        TextPaint textPaint = new TextPaint();
        textPaint.setColor(Color.argb(128, 255, 0, 255));
        textPaint.setTextSize(72);
        textPaint.setTextAlign(Paint.Align.CENTER);
        for (int i = 0; i < document.getPageCount(); i++) {
            Size pageSize = document.getPageSize(i);
            PageCanvas pageCanvas = new PageCanvas(pageSize, canvas -> {
                // Move the text to the center.
                canvas.translate(pageSize.width / 2, pageSize.height / 2);
                // Then rotate the text 45°.
                canvas.rotate(45);

                // Now draw it at 0/0 since we already applied the correct translation.
                canvas.drawText("My Watermark", 0f, 0f, textPaint);
            });
            task.addCanvasDrawingToPage(pageCanvas, i);
        }

        // Perform the watermarking.
        File watermarkedFile = new File(pdfView.getContext().getCacheDir(), "watermarked.pdf");
        PdfProcessor.processDocument(task, watermarkedFile);

        // We successfully watermarked the document, report the new URI to react-native.
        reactApplicationContext
            .getNativeModule(UIManagerModule.class)
            .getEventDispatcher()
            .dispatchEvent(new DocumentWatermarkedEvent(pdfView.getId(), watermarkedFile.getCanonicalPath()));
    }

    @Override
    public void onDropViewInstance(@NonNull PdfView view) {
        super.onDropViewInstance(view);
        // We need to make sure to clean up everything when we are done with the view.
        view.removeFragment(true);
    }
}
