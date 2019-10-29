package com.pspdfkit.nativecatalog;

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
import com.pspdfkit.annotations.InkAnnotation;
import com.pspdfkit.annotations.WidgetAnnotation;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.forms.SignaturePickerOrientation;
import com.pspdfkit.configuration.signatures.SignatureCertificateSelectionMode;
import com.pspdfkit.configuration.signatures.SignatureSavingStrategy;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.processor.PageCanvas;
import com.pspdfkit.document.processor.PdfProcessor;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.forms.SignatureFormElement;
import com.pspdfkit.listeners.DocumentSigningListener;
import com.pspdfkit.nativecatalog.events.DocumentDigitallySignedEvent;
import com.pspdfkit.nativecatalog.events.DocumentWatermarkedEvent;
import com.pspdfkit.react.events.PdfViewAnnotationChangedEvent;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDataReturnedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSaveFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.react.events.PdfViewStateChangedEvent;
import com.pspdfkit.signatures.Signature;
import com.pspdfkit.signatures.SignatureManager;
import com.pspdfkit.signatures.signers.InteractiveSigner;
import com.pspdfkit.signatures.signers.Pkcs12Signer;
import com.pspdfkit.signatures.signers.Signer;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.signatures.SignatureOptions;
import com.pspdfkit.ui.signatures.SignaturePickerFragment;
import com.pspdfkit.ui.signatures.SignatureSignerDialog;
import com.pspdfkit.utils.Size;
import com.pspdfkit.views.PdfView;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.Map;

import io.reactivex.android.schedulers.AndroidSchedulers;

/**
 * Shows you how to leverage the {@link PdfView} to build your own react view.
 */
public class CustomPdfViewManager extends SimpleViewManager<PdfView> {

    private final ReactApplicationContext reactApplicationContext;

    public CustomPdfViewManager(ReactApplicationContext reactApplicationContext) {
        super();
        this.reactApplicationContext = reactApplicationContext;

        // Our test certificate is self-signed, so we need to add it to trusted certificate store for it to validate. Otherwise
        // the new signature won't validate. Since PSPDFKit and other readers (like Acrobat) will warn when using self-signed certificates
        // your app should use a CA issued certificate instead.
        addJohnAppleseedCertificateToTrustedCertificates(reactApplicationContext.getApplicationContext());

        // The signer is a named entity holding a certificate (usually a person) and has a display name shown in the app. Registration of the Signer instance
        // has to happen using a unique string identifier. The signer can be associated with a signature for signing the document.
        final Signer johnAppleseed = new Pkcs12Signer("John Appleseed", Uri.parse("file:///android_asset/JohnAppleseed.p12"));
        SignatureManager.addSigner("john_appleseed", johnAppleseed);
    }

    private void addJohnAppleseedCertificateToTrustedCertificates(@NonNull Context context) {
        try {
            final InputStream keystoreFile = context.getAssets().open("JohnAppleseed.p12");
            // Inside a p12 we have both the certificate and private key used for signing. We just need the certificate here.
            // Proper signatures should have a root CA approved certificate making this step unnecessary.
            KeyStore.PrivateKeyEntry key = SignatureManager.loadPrivateKeyPairFromStream(keystoreFile, "test", null, null);
            if (key.getCertificate().getType().equals("X.509")) {
                SignatureManager.addTrustedCertificate((X509Certificate) key.getCertificate());
            }
        } catch (IOException | GeneralSecurityException e) {
            Log.e("PSPDFKit", "Couldn't load and add John Appleseed certificate to trusted certificate list!");
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

            // You can create a PdfView in your own view manager and use all the work our wrapper already does.
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
        view.setDocument(document);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        // These are required for the PdfView to work.
        // You can see them in ReactPdfViewManager.java
        Map map = MapBuilder.of(PdfViewStateChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onStateChanged"),
            PdfViewDocumentSavedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentSaved"),
            PdfViewAnnotationTappedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onAnnotationTapped"),
            PdfViewAnnotationChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onAnnotationsChanged"),
            PdfViewDataReturnedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDataReturned"),
            PdfViewDocumentSaveFailedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentSaveFailed"),
            PdfViewDocumentLoadFailedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentLoadFailed")
        );
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
            case "startSigning":
                // The user clicked the signing button in react-native, start the native signing flow.
                performInkSigning(root);
                break;
            case "createWatermark":
                // The user clicked the create watermark button, start our watermarking process.
                performWatermarking(root);
                break;
        }
    }

    private void performInkSigning(@NonNull PdfView pdfView) {
        pdfView.getFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfFragment -> {
                // We got our fragment.
                PdfDocument document = pdfFragment.getDocument();
                // We have a element with the name EMPLOYEE SIGNATURE in the document, grab a reference here.
                SignatureFormElement signatureFormElement = (SignatureFormElement) document.getFormProvider().getFormElementWithName("EMPLOYEE SIGNATURE");
                // Now we can display the signature picker.
                SignaturePickerFragment.show(pdfFragment.getFragmentManager(), new SignaturePickerFragment.OnSignaturePickedListener() {
                        @Override
                        public void onSignaturePicked(@NonNull Signature signature) {
                            // We want to place the ink annotation on top of the signature field. We retrieve the widget annotation to access its position.
                            final WidgetAnnotation formFieldAnnotation = signatureFormElement.getAnnotation();
                            // The signature object provides convenient conversion to ink annotations.
                            final InkAnnotation inkSignature = signature.toInkAnnotation(document, formFieldAnnotation.getPageIndex(), formFieldAnnotation.getBoundingBox());

                            // Add the annotation to the document.
                            pdfFragment.addAnnotationToPage(inkSignature, false);
                            try {
                                pdfFragment.getDocument().saveIfModified();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }

                            // Now digitally sign the document.
                            performDigitalSigning(pdfView, pdfFragment, signatureFormElement);
                        }

                        @Override
                        public void onDismiss() {
                            // User cancelled the picking.
                        }
                    }, new SignatureOptions.Builder()
                        // Keep the orientation the same as before.
                        .signaturePickerOrientation(SignaturePickerOrientation.UNLOCKED)
                        // Don't select a signature here, we'll manually digitally sign the document right afterwards.
                        .signatureCertificateSelectionMode(SignatureCertificateSelectionMode.NEVER)
                        .build(),
                    null);
            });
    }

    private void performDigitalSigning(@NonNull PdfView pdfView, @NonNull PdfFragment pdfFragment, @NonNull SignatureFormElement signatureFormElement) {
        // Retrieve the signer we've created in the constructor.
        Signer signer = SignatureManager.getSigners().get("john_appleseed");
        if (signer != null) {
            // Provide a password to the signer, which will be used to unlock its private key.
            if (signer instanceof InteractiveSigner) {
                ((InteractiveSigner) signer).unlockPrivateKeyWithPassword("test");
            }

            // Show the signer dialog that handles the signing process.
            SignatureSignerDialog.show(
                pdfFragment.getFragmentManager(),
                new SignatureSignerDialog.Options.Builder(
                    pdfFragment.getDocument(),
                    signatureFormElement.getFormField(),
                    signer
                ).build(),
                new DocumentSigningListener() {
                    @Override
                    public void onDocumentSigned(@NonNull Uri uri) {
                        // We successfully digitally signed the document, report the new URI to react-native.
                        reactApplicationContext
                            .getNativeModule(UIManagerModule.class)
                            .getEventDispatcher()
                            .dispatchEvent(new DocumentDigitallySignedEvent(pdfView.getId(), uri));
                    }

                    @Override
                    public void onDocumentSigningError(@Nullable Throwable throwable) {
                        // The signing failed.
                    }

                    @Override
                    public void onSigningCancelled() {
                        // User cancelled the signing.
                    }
                }
            );
        }
    }

    private void performWatermarking(@NonNull PdfView pdfView) {
        pdfView.getFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfFragment -> {
                PdfDocument document = pdfFragment.getDocument();
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
            });
    }

    @Override
    public void onDropViewInstance(@NonNull PdfView view) {
        super.onDropViewInstance(view);
        // We need to make sure to clean up everything when we are done with the view.
        view.removeFragment(true);
    }
}
