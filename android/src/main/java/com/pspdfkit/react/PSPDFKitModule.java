/*
 * PSPDFKitModule.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

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

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
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
import com.pspdfkit.react.helper.ConversionHelpers;
import com.pspdfkit.react.helper.PSPDFKitUtils;
import com.pspdfkit.ui.PdfActivity;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.search.PdfSearchView;
import com.pspdfkit.ui.search.PdfSearchViewInline;
import com.pspdfkit.views.ReactMainToolbar;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class PSPDFKitModule extends ReactContextBaseJavaModule implements Application.ActivityLifecycleCallbacks, ActivityEventListener {

    /** Hybrid technology where the application is supposed to be working on. */
    private static final String HYBRID_TECHNOLOGY = "ReactNative";
    private static final String VERSION_KEY = "versionString";
    private static final String FILE_SCHEME = "file:///";

    private static final int REQUEST_CODE_TO_INDEX = 16;
    private static final int MASKED_REQUEST_CODE_TO_REAL_CODE = 0xffff;
    
    @Nullable
    private Activity resumedActivity;
    @Nullable
    private Runnable onPdfActivityOpenedTask;

    private static final Set<String> activeListeners = new HashSet<>();
    private static final Object lock = new Object();

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

    private final com.pspdfkit.react.common.NutrientModuleController controller;

    public PSPDFKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        controller = new com.pspdfkit.react.common.NutrientModuleController(reactContext);
        controller.initialize();
    }

    @Override
    public void initialize() {
        super.initialize();
        // Now handled inside controller.initialize()
    }

    @Override
    public String getName() {
        return "Nutrient";
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Required to support NativeEventEmitter
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Required to support NativeEventEmitter
    }

    @ReactMethod
    public void present(@NonNull String document, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        controller.present(document, configuration, promise);
    }

    @ReactMethod
    public void presentPdf(@NonNull String document, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        controller.presentPdf(document, configuration, promise);
    }

    @ReactMethod
    public void presentImage(@NonNull String imageDocument, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        controller.presentImage(imageDocument, configuration, promise);
    }

    @ReactMethod
    public void presentInstant(@NonNull ReadableMap documentData, @NonNull ReadableMap configuration, @Nullable Promise promise) {
        controller.presentInstant(documentData, configuration, promise);
    }
    
    @ReactMethod
    public synchronized void setPageIndex(final int pageIndex, final boolean animated) {
        controller.setPageIndex(pageIndex, animated);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean setLicenseKey(@Nullable String licenseKey) {
        return controller.setLicenseKey(licenseKey);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public WritableMap getDocumentProperties(@Nullable String documentPath) {
        return controller.getDocumentProperties(documentPath);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean setLicenseKeys(@Nullable String androidLicenseKey, @Nullable String iOSLicenseKey) {
        // Ignore the `iOSLicenseKey` parameter since we only need the `androidLicenseKey`.
        // `iOSLicenseKey` will be used to activate the license on iOS.
        return controller.setLicenseKey(androidLicenseKey);
    }


    @ReactMethod
    public void processAnnotations(@NonNull final String processingMode,
                                   @Nullable final ReadableArray annotationTypes,
                                   @NonNull final String sourceDocumentPath,
                                   @NonNull final String targetDocumentPath,
                                   @Nullable final String password,
                                   @NonNull final Promise promise) {
        controller.processAnnotations(processingMode, annotationTypes, sourceDocumentPath, targetDocumentPath, password, promise);
    }

    @ReactMethod
    public void handleListenerAdded(String event, Integer componentId, @Nullable Promise promise) {
        synchronized (lock) {
            String listenerKey = event + "_" + componentId.toString();
            activeListeners.add(listenerKey);

            // Only enable if this is the first listener globally
            if (activeListeners.size() == 1) {
                NutrientNotificationCenter.INSTANCE.setIsNotificationCenterInUse(true);
            }

            if (event.equals("analytics")) {
                NutrientNotificationCenter.INSTANCE.analyticsEnabled();
            }
        }

        if (promise != null) {
            promise.resolve(1);
        }
    }

    @ReactMethod
    public void handleListenerRemoved(String event, Integer componentId, @Nullable Promise promise) {
        synchronized (lock) {
            String listenerKey = event + "_" + componentId.toString();
            activeListeners.remove(listenerKey);

            // Only disable if NO listeners remain globally
            if (activeListeners.isEmpty()) {
                NutrientNotificationCenter.INSTANCE.setIsNotificationCenterInUse(false);
            }

            if (event.equals("analytics")) {
                NutrientNotificationCenter.INSTANCE.analyticsDisabled();
            }
        }

        if (promise != null) {
            promise.resolve(1);
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
        if (resumedActivity instanceof PdfActivity pdfActivity) {
            if (onPdfActivityOpenedTask != null) {
                // Run our queued up task when a PdfActivity is displayed.
                onPdfActivityOpenedTask.run();
                onPdfActivityOpenedTask = null;
            }

            try {
                ActionBar ab = pdfActivity.getSupportActionBar();
                ab.setDisplayHomeAsUpEnabled(true);
                ReactMainToolbar mainToolbar = pdfActivity.findViewById(R.id.pspdf__toolbar_main);
                mainToolbar.setNavigationOnClickListener(v -> {
                    pdfActivity.onBackPressed();
                });
                PdfSearchView searchView = pdfActivity.getPSPDFKitViews().getSearchView();
                if (searchView instanceof PdfSearchViewInline searchViewInline) {
                    searchViewInline.findViewById(com.pspdfkit.R.id.pspdf__search_btn_back).setVisibility(View.GONE);
                }
            } catch (Exception e) {
                // Could not add back button to main toolbar
            }

            // We notify the called as soon as the document is loaded or loading failed.
            if (lastPresentPromise != null) {
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
