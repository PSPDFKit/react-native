/*
 * PSPDFKitModule.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2018 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.app.Activity;
import android.app.Application;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.ui.PdfActivity;

import java.util.HashMap;
import java.util.Map;

public class PSPDFKitModule extends ReactContextBaseJavaModule implements Application.ActivityLifecycleCallbacks {

    private static final String VERSION_KEY = "versionString";
    private static final String FILE_SCHEME = "file:///";

    @Nullable
    private Activity currentActivity;
    @Nullable
    private Runnable onPdfActivityOpenedTask;

    public PSPDFKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
        if (reactContext.getApplicationContext() instanceof Application) {
            Application application = (Application) reactContext.getApplicationContext();
            // We register an activity lifecycle callback so we can get notified of the current activity.
            application.registerActivityLifecycleCallbacks(this);
        }
    }

    @Override
    public String getName() {
        return "PSPDFKit";
    }

    @ReactMethod
    public void present(@NonNull String document, @NonNull ReadableMap configuration) {
        if (getCurrentActivity() != null) {
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), configuration);
            // This is an edge case where file scheme is missing.
            if (Uri.parse(document).getScheme() == null) {
                document = FILE_SCHEME + document;
            }

            PdfActivity.showDocument(getCurrentActivity(), Uri.parse(document), configurationAdapter.build());
        }
    }

    @ReactMethod
    public void setPageIndex(final int pageIndex, final boolean animated) {
        if (currentActivity instanceof PdfActivity) {
            final PdfActivity activity = (PdfActivity) currentActivity;
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
    public void onActivityResumed(Activity activity) {
        currentActivity = activity;
        if (currentActivity instanceof PdfActivity && onPdfActivityOpenedTask != null) {
            // Run our queued up task when a PdfActivity is displayed.
            onPdfActivityOpenedTask.run();
            onPdfActivityOpenedTask = null;
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        if (activity == currentActivity) {
            currentActivity = null;
        }
    }

    @Override
    public void onActivityStopped(Activity activity) {
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        if (activity == currentActivity) {
            currentActivity = null;
        }
    }
}
