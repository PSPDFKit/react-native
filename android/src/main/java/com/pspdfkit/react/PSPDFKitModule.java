/*
 * PSPDFKitModule.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2021 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.image.CameraImagePickerFragment;
import com.pspdfkit.document.image.GalleryImagePickerFragment;
import com.pspdfkit.document.processor.PdfProcessor;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.instant.ui.InstantPdfActivity;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.react.helper.ConversionHelpers;
import com.pspdfkit.ui.PdfActivity;
import com.pspdfkit.ui.PdfFragment;

import java.io.File;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public class PSPDFKitModule extends ReactContextBaseJavaModule implements Application.ActivityLifecycleCallbacks, ActivityEventListener {

    private static final String VERSION_KEY = "versionString";
    private static final String FILE_SCHEME = "file:///";

    private static final int REQUEST_CODE_TO_INDEX = 16;
    private static final int MASKED_REQUEST_CODE_TO_REAL_CODE = 0xffff;

    @Nullable
    private Activity resumedActivity;
    @Nullable
    private Runnable onPdfActivityOpenedTask;

    /**
     * Used to dispatch onActivityResult calls to our fragments.
     */
    @NonNull
    private Handler activityResultHandler = new Handler(Looper.getMainLooper());

    /**
     * The last promise we received when calling present. Used to notify once the document is loaded.
     */
    @Nullable
    private Promise lastPresentPromise;

    public PSPDFKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void initialize() {
        super.initialize();
        getReactApplicationContext().addActivityEventListener(this);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        getReactApplicationContext().removeActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "PSPDFKit";
    }

    @ReactMethod
    public void present(@NonNull String document, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (getCurrentActivity() != null) {
            if (resumedActivity == null) {
                // We register an activity lifecycle callback so we can get notified of the current activity.
                getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), configuration);
            // This is an edge case where file scheme is missing.
            if (Uri.parse(document).getScheme() == null) {
                document = FILE_SCHEME + document;
            }

            lastPresentPromise = promise;
            PdfActivity.showDocument(getCurrentActivity(), Uri.parse(document), configurationAdapter.build());
        }
    }

    @ReactMethod
    public void presentImage(@NonNull String imageDocument, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (getCurrentActivity() != null) {
            if (resumedActivity == null) {
                // We register an activity lifecycle callback so we can get notified of the current activity.
                getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), configuration);
            // This is an edge case where file scheme is missing.
            if (Uri.parse(imageDocument).getScheme() == null) {
                imageDocument = FILE_SCHEME + imageDocument;
            }

            lastPresentPromise = promise;
            PdfActivity.showImage(getCurrentActivity(), Uri.parse(imageDocument), configurationAdapter.build());
        }
    }

    @ReactMethod
    public void presentInstant(@NonNull String serverUrl, @NonNull String jwt, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        if (getCurrentActivity() != null) {
            if (resumedActivity == null) {
                // We register an activity lifecycle callback so we can get notified of the current activity.
                getCurrentActivity().getApplication().registerActivityLifecycleCallbacks(this);
            }
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), configuration);

            lastPresentPromise = promise;
            InstantPdfActivity.showInstantDocument(getCurrentActivity(), serverUrl, jwt, configurationAdapter.build());
        }
    }

    @ReactMethod
    public synchronized void setPageIndex(final int pageIndex, final boolean animated) {
        if (resumedActivity instanceof PdfActivity) {
            final PdfActivity activity = (PdfActivity) resumedActivity;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (activity.getDocument() != null) {
                        // If the document is loaded we can instantly set the page index.
                        activity.setPageIndex(pageIndex, animated);
                    } else {
                        activity.getPdfFragment().addDocumentListener(new SimpleDocumentListener() {
                            @Override
                            public void onDocumentLoaded(@NonNull PdfDocument document) {
                                // Once the document is loaded set the page index.
                                activity.setPageIndex(pageIndex, animated);
                                activity.getPdfFragment().removeDocumentListener(this);
                            }
                        });
                    }
                }
            });
        } else {
            // Queue up a runnable to set the page index as soon as a PdfActivity is available.
            onPdfActivityOpenedTask = new Runnable() {
                @Override
                public void run() {
                    setPageIndex(pageIndex, animated);
                }
            };
        }
    }

    @ReactMethod
    public void setLicenseKey(@Nullable String licenseKey) {
        PSPDFKit.initialize(getReactApplicationContext().getApplicationContext(), licenseKey);
    }

    @ReactMethod
    public void processAnnotations(@NonNull final String processingMode,
                                   @Nullable final String annotationType,
                                   @NonNull final String sourceDocumentPath,
                                   @NonNull final String targetDocumentPath,
                                   @NonNull final Promise promise) {
        PdfDocumentLoader.openDocumentAsync(getReactApplicationContext(), Uri.parse(sourceDocumentPath))
            .flatMapCompletable(document -> {
                PdfProcessorTask task = PdfProcessorTask.fromDocument(document);
                final EnumSet<AnnotationType> types = ConversionHelpers.getAnnotationTypeFromString(annotationType);
                final PdfProcessorTask.AnnotationProcessingMode mode = getProcessingModeFromString(processingMode);
                for (AnnotationType type : types) {
                    task.changeAnnotationsOfType(type, mode);
                }

                return PdfProcessor.processDocumentAsync(task, new File(targetDocumentPath)).ignoreElements();
            })
            .subscribe(() -> {
                promise.resolve(Boolean.TRUE);
            }, throwable -> {
                promise.reject(throwable);
            });
    }

    private static PdfProcessorTask.AnnotationProcessingMode getProcessingModeFromString(@NonNull final String mode) {
        if ("print".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.PRINT;
        } else if ("remove".equalsIgnoreCase(mode)) {
            // Called remove to match iOS.
            return PdfProcessorTask.AnnotationProcessingMode.DELETE;
        } else if ("flatten".equalsIgnoreCase(mode)) {
            return PdfProcessorTask.AnnotationProcessingMode.FLATTEN;
        } else if ("embed".equalsIgnoreCase(mode)) {
            // Called embed to match iOS.
            return PdfProcessorTask.AnnotationProcessingMode.KEEP;
        } else {
            return PdfProcessorTask.AnnotationProcessingMode.KEEP;
        }
    }

    @NonNull
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(VERSION_KEY, PSPDFKit.VERSION);
        return constants;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
    }

    @Override
    public void onActivityStarted(Activity activity) {
    }

    @Override
    public synchronized void onActivityResumed(Activity activity) {
        resumedActivity = activity;
        if (resumedActivity instanceof PdfActivity && onPdfActivityOpenedTask != null) {
            // Run our queued up task when a PdfActivity is displayed.
            onPdfActivityOpenedTask.run();
            onPdfActivityOpenedTask = null;
            
            // We notify the called as soon as the document is loaded or loading failed.
            if (lastPresentPromise != null) {
                PdfActivity pdfActivity = (PdfActivity) resumedActivity;
                pdfActivity.getPdfFragment().addDocumentListener(new SimpleDocumentListener() {
                    @Override
                    public void onDocumentLoaded(@NonNull PdfDocument document) {
                        super.onDocumentLoaded(document);
                        lastPresentPromise.resolve(Boolean.TRUE);
                        lastPresentPromise = null;
                    }

                    @Override
                    public void onDocumentLoadFailed(@NonNull Throwable exception) {
                        super.onDocumentLoadFailed(exception);
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
    public void onActivityStopped(Activity activity) {
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public synchronized void onActivityDestroyed(Activity activity) {
        if (activity == resumedActivity) {
            resumedActivity = null;
        }
    }

    @Override
    public void onActivityResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
        if (activity instanceof FragmentActivity) {
            // Forward the result to all our fragments.
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
            // When starting an intent from a fragment its request code is shifted to make it unique,
            // we undo it here manually since react by default eats all activity results.
            int requestIndex = requestCode >> REQUEST_CODE_TO_INDEX;
            if (requestIndex != 0) {
                // We need to wait until the next frame with delivering the result to the fragment,
                // otherwise the app will crash since the fragment won't be ready.
                activityResultHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        fragment.onActivityResult(requestCode & MASKED_REQUEST_CODE_TO_REAL_CODE, resultCode, data);
                    }
                });
            }
        }

        // Also send this to all child fragments so we ensure the result is handled.
        for (final Fragment childFragment : fragment.getChildFragmentManager().getFragments()) {
            handleFragment(childFragment, requestCode, resultCode, data);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Not required right now.
    }
}
