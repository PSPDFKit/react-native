package com.pspdfkit.react.common;

import static java.util.Collections.emptyList;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ActivityEventListener;

import com.pspdfkit.Nutrient;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.image.CameraImagePickerFragment;
import com.pspdfkit.document.image.GalleryImagePickerFragment;
import com.pspdfkit.document.processor.PdfProcessor;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.exceptions.InvalidNutrientLicenseException;
import com.pspdfkit.exceptions.InvalidPasswordException;
import com.pspdfkit.initialization.CrossPlatformTechnology;
import com.pspdfkit.initialization.InitializationOptions;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.react.NutrientNotificationCenter;
import com.pspdfkit.react.R;
import com.pspdfkit.react.helper.ConversionHelpers;
import com.pspdfkit.react.ConfigurationAdapter;
import com.pspdfkit.react.helper.PSPDFKitUtils;
import com.pspdfkit.ui.PdfActivity;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.search.PdfSearchView;
import com.pspdfkit.ui.search.PdfSearchViewInline;
import com.pspdfkit.views.ReactMainToolbar;

import java.io.File;
import java.io.IOException;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

/**
 * Shared implementation for PSPDFKit React Native module APIs used by both classic and Turbo modules.
 */
public class NutrientModuleController implements Application.ActivityLifecycleCallbacks, ActivityEventListener {

    private static final String FILE_SCHEME = "file:///";
    private static final int REQUEST_CODE_TO_INDEX = 16;
    private static final int MASKED_REQUEST_CODE_TO_REAL_CODE = 0xffff;

    private final ReactApplicationContext reactContext;

    @Nullable
    private Activity resumedActivity;
    @Nullable
    private Runnable onPdfActivityOpenedTask;
    @Nullable
    private Promise lastPresentPromise;

    @NonNull
    private final Handler activityResultHandler = new Handler(Looper.getMainLooper());

    public NutrientModuleController(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    public void initialize() {
        reactContext.addActivityEventListener(this);
        NutrientNotificationCenter.INSTANCE.setReactContext(reactContext);
    }

    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("versionString", PSPDFKit.VERSION);
        return constants;
    }

    public void handleListenerAdded(String event, @Nullable Promise promise) {
        // No global state here; modules compute isLast via their own activeListeners sets
        if ("analytics".equals(event)) {
            NutrientNotificationCenter.INSTANCE.analyticsEnabled();
        }
        if (promise != null) {
            promise.resolve(1);
        }
    }

    public void handleListenerRemoved(@Nullable String event, boolean isLast, @Nullable Promise promise) {
        if (isLast) {
            NutrientNotificationCenter.INSTANCE.setIsNotificationCenterInUse(false);
        }
        if ("analytics".equals(event)) {
            NutrientNotificationCenter.INSTANCE.analyticsDisabled();
        }
        if (promise != null) {
            promise.resolve(1);
        }
    }

    public boolean setLicenseKey(@Nullable String licenseKey) {
        try {
            if (licenseKey == null) {
                licenseKey = "";
            }
            InitializationOptions options = new InitializationOptions(licenseKey, emptyList(), CrossPlatformTechnology.ReactNative, null);
            Nutrient.initialize(reactContext, options);
            return true;
        } catch (InvalidNutrientLicenseException e) {
            return false;
        }
    }

    public void present(@NonNull String document, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (PSPDFKitUtils.isValidPdf(document)) {
            lastPresentPromise = promise;
            presentPdf(document, configuration, promise);
        } else if (PSPDFKitUtils.isValidImage(document)) {
            lastPresentPromise = promise;
            presentImage(document, configuration, promise);
        } else {
            Throwable error = new Throwable("The document must be one of these file types: .pdf, .jpg, .png, .jpeg, .tif, .tiff");
            if (promise != null) {
                promise.reject(error);
            }
        }
    }

    public void presentPdf(@NonNull String document, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (reactContext.getCurrentActivity() != null) {
            if (resumedActivity == null) {
                reactContext.getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(reactContext.getCurrentActivity(), configuration);
            if (Uri.parse(document).getScheme() == null) {
                document = FILE_SCHEME + document;
            }

            lastPresentPromise = promise;
            PdfActivity.showDocument(reactContext.getCurrentActivity(), Uri.parse(document), configurationAdapter.build());
        }
    }

    public void presentImage(@NonNull String imageDocument, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (reactContext.getCurrentActivity() != null) {
            if (resumedActivity == null) {
                reactContext.getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(reactContext.getCurrentActivity(), configuration);
            if (Uri.parse(imageDocument).getScheme() == null) {
                imageDocument = FILE_SCHEME + imageDocument;
            }

            lastPresentPromise = promise;
            PdfActivity.showImage(reactContext.getCurrentActivity(), Uri.parse(imageDocument), configurationAdapter.build());
        }
    }

    public void presentInstant(@NonNull ReadableMap documentData, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        String serverUrl = documentData.getString("serverUrl");
        String jwt = documentData.getString("jwt");
        if (serverUrl == null || jwt == null) {
            Throwable error = new Throwable("serverUrl and jwt are required");
            if (promise != null) promise.reject(error);
            return;
        }
        if (reactContext.getCurrentActivity() != null) {
            if (resumedActivity == null) {
                reactContext.getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(reactContext.getCurrentActivity(), configuration);

            lastPresentPromise = promise;
            Handler mainHandler = new Handler(reactContext.getMainLooper());
            Runnable runnable = new Runnable() {
                @Override
                public void run() {
                    try {
                        com.pspdfkit.react.RNInstantPdfActivity.showInstantDocument(reactContext.getCurrentActivity(), serverUrl, jwt, configurationAdapter.build());
                    } catch (Exception e) {
                        // ignore
                    }
                }
            };
            mainHandler.post(runnable);
        }
    }

    public synchronized void setPageIndex(final int pageIndex, final boolean animated) {
        if (resumedActivity instanceof PdfActivity) {
            final PdfActivity activity = (PdfActivity) resumedActivity;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (activity.getDocument() != null) {
                        activity.setPageIndex(pageIndex, animated);
                    } else {
                        activity.getPdfFragment().addDocumentListener(new SimpleDocumentListener() {
                            @Override
                            public void onDocumentLoaded(@NonNull PdfDocument document) {
                                activity.setPageIndex(pageIndex, animated);
                                activity.getPdfFragment().removeDocumentListener(this);
                            }
                        });
                    }
                }
            });
        } else {
            onPdfActivityOpenedTask = new Runnable() {
                @Override
                public void run() {
                    setPageIndex(pageIndex, animated);
                }
            };
        }
    }

    public WritableMap getDocumentProperties(@Nullable String documentPath) {
        WritableMap properties = Arguments.createMap();
        try {
            if (Uri.parse(documentPath).getScheme() == null) {
                try {
                    File file = new File(documentPath);
                    documentPath = Uri.fromFile(file).toString();
                } catch (Exception e) {
                    documentPath = FILE_SCHEME + documentPath;
                }
            }
            PdfDocument document = PdfDocumentLoader.openDocument(reactContext, Uri.parse(documentPath));
            properties.putString("documentId", document.getDocumentIdString());
            properties.putInt("pageCount", document.getPageCount());
            properties.putBoolean("isEncrypted", document.isEncrypted());
        } catch (IOException e) {
            if (e instanceof InvalidPasswordException) {
                properties.putInt("pageCount", 0);
                properties.putBoolean("isEncrypted", true);
            } else {
                properties.putString("documentId", null);
                properties.putInt("pageCount", 0);
                properties.putBoolean("isEncrypted", false);
            }
        }
        return properties;
    }

    public void processAnnotations(@NonNull final String processingMode,
                                   @Nullable final ReadableArray annotationTypes,
                                   @NonNull final String sourceDocumentPath,
                                   @NonNull final String targetDocumentPath,
                                   @Nullable final String password,
                                   @NonNull final Promise promise) {
        String documentPath = Uri.parse(sourceDocumentPath).getScheme() == null ? FILE_SCHEME + sourceDocumentPath : sourceDocumentPath;
        if (password != null) {
            PdfDocumentLoader.openDocumentAsync(reactContext, Uri.parse(documentPath), password)
                    .flatMapCompletable(document -> {
                        PdfProcessorTask task = setupProcessAnnotations(document, processingMode, annotationTypes);
                        return PdfProcessor.processDocumentAsync(task, new File(targetDocumentPath)).ignoreElements();
                    })
                    .subscribe(() -> promise.resolve(Boolean.TRUE), promise::reject);
        } else {
            PdfDocumentLoader.openDocumentAsync(reactContext, Uri.parse(documentPath))
                    .flatMapCompletable(document -> {
                        PdfProcessorTask task = setupProcessAnnotations(document, processingMode, annotationTypes);
                        return PdfProcessor.processDocumentAsync(task, new File(targetDocumentPath)).ignoreElements();
                    })
                    .subscribe(() -> promise.resolve(Boolean.TRUE), promise::reject);
        }
    }

    private PdfProcessorTask setupProcessAnnotations(@NonNull final PdfDocument document,
                                                     @NonNull final String processingMode,
                                                     @Nullable final ReadableArray annotationTypes) {
        PdfProcessorTask task = PdfProcessorTask.fromDocument(document);
        final EnumSet<AnnotationType> types = ConversionHelpers.getAnnotationTypes(annotationTypes);
        final PdfProcessorTask.AnnotationProcessingMode mode = getProcessingModeFromString(processingMode);
        for (AnnotationType type : types) {
            task.changeAnnotationsOfType(type, mode);
        }
        return task;
    }

    private static PdfProcessorTask.AnnotationProcessingMode getProcessingModeFromString(@NonNull final String mode) {
        if ("print".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.PRINT;
        } else if ("remove".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.DELETE;
        } else if ("flatten".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.FLATTEN;
        } else if ("embed".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.KEEP;
        } else {
            return PdfProcessorTask.AnnotationProcessingMode.KEEP;
        }
    }

    // Activity lifecycle and result forwarding
    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) { }

    @Override
    public void onActivityStarted(Activity activity) { }

    @Override
    public synchronized void onActivityResumed(Activity activity) {
        resumedActivity = activity;
        if (resumedActivity instanceof PdfActivity pdfActivity) {
            if (onPdfActivityOpenedTask != null) {
                onPdfActivityOpenedTask.run();
                onPdfActivityOpenedTask = null;
            }
            try {
                ActionBar ab = pdfActivity.getSupportActionBar();
                if (ab != null) ab.setDisplayHomeAsUpEnabled(true);
                ReactMainToolbar mainToolbar = pdfActivity.findViewById(R.id.pspdf__toolbar_main);
                if (mainToolbar != null) {
                    mainToolbar.setNavigationOnClickListener(v -> pdfActivity.onBackPressed());
                }
                PdfSearchView searchView = pdfActivity.getPSPDFKitViews().getSearchView();
                if (searchView instanceof PdfSearchViewInline searchViewInline) {
                    View back = searchViewInline.findViewById(com.pspdfkit.R.id.pspdf__search_btn_back);
                    if (back != null) back.setVisibility(View.GONE);
                }
            } catch (Exception ignored) { }

            if (lastPresentPromise != null) {
                pdfActivity.getPdfFragment().addDocumentListener(new SimpleDocumentListener() {
                    @Override
                    public void onDocumentLoaded(@NonNull PdfDocument document) {
                        lastPresentPromise.resolve(Boolean.TRUE);
                        lastPresentPromise = null;
                    }

                    @Override
                    public void onDocumentLoadFailed(@NonNull Throwable exception) {
                        lastPresentPromise.reject(exception);
                        lastPresentPromise = null;
                    }
                });
            }
        }
    }

    @Override
    public synchronized void onActivityPaused(Activity activity) {
        if (activity == resumedActivity) {
            resumedActivity = null;
        }
    }

    @Override
    public void onActivityStopped(Activity activity) { }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) { }

    @Override
    public synchronized void onActivityDestroyed(Activity activity) {
        if (activity == resumedActivity) {
            resumedActivity = null;
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (activity instanceof FragmentActivity) {
            FragmentActivity fragmentActivity = (FragmentActivity) activity;
            for (final Fragment fragment : fragmentActivity.getSupportFragmentManager().getFragments()) {
                handleFragment(fragment, requestCode, resultCode, data);
            }
        }
    }

    private void handleFragment(@NonNull final Fragment fragment, final int requestCode, final int resultCode, @NonNull final Intent data) {
        if (fragment instanceof PdfFragment ||
                fragment instanceof GalleryImagePickerFragment ||
                fragment instanceof CameraImagePickerFragment) {
            int requestIndex = requestCode >> REQUEST_CODE_TO_INDEX;
            if (requestIndex != 0) {
                activityResultHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        fragment.onActivityResult(requestCode & MASKED_REQUEST_CODE_TO_REAL_CODE, resultCode, data);
                    }
                });
            }
        }
        for (final Fragment childFragment : fragment.getChildFragmentManager().getFragments()) {
            handleFragment(childFragment, requestCode, resultCode, data);
        }
    }

    @Override
    public void onNewIntent(Intent intent) { }
}


