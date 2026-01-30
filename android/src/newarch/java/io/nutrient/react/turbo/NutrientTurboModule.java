/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package io.nutrient.react.turbo;

import com.pspdfkit.Nutrient;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.module.annotations.ReactModule;
import java.util.Map;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import static java.util.Collections.emptyList;

import androidx.annotation.Nullable;

import com.pspdfkit.react.common.NutrientModuleController;
import com.pspdfkit.react.NutrientNotificationCenter;

// Generated spec for the TurboModule
import com.pspdfkit.react.NativeNutrientModuleSpec;

@ReactModule(name = NutrientTurboModule.NAME)
public class NutrientTurboModule extends NativeNutrientModuleSpec {

    public static final String NAME = "Nutrient";
    private static final String TAG = "NutrientTurboModule";

    private final NutrientModuleController controller;
    private static final Set<String> activeListeners = new HashSet<>();
    private static final Object lock = new Object();

    public NutrientTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
        controller = new NutrientModuleController(reactContext);
        controller.initialize();
        // Register delegate for New Architecture event routing
        NutrientNotificationCenter.INSTANCE.setReactContext(reactContext);
        NutrientNotificationCenter.INSTANCE.setIsNewArchitectureEnabled(true);
        NutrientNotificationCenter.INSTANCE.setDelegate(new NutrientNotificationCenter.Delegate() {
            @Override
            public void onEvent(String eventName, WritableMap payload) {
                // Route to codegen emitters
                if ("documentLoaded".equals(eventName)) emitDocumentLoaded(payload);
                else if ("documentLoadFailed".equals(eventName)) emitDocumentLoadFailed(payload);
                else if ("documentPageChanged".equals(eventName)) emitDocumentPageChanged(payload);
                else if ("documentScrolled".equals(eventName)) emitDocumentScrolled(payload);
                else if ("documentTapped".equals(eventName)) emitDocumentTapped(payload);
                else if ("annotationsAdded".equals(eventName)) emitAnnotationsAdded(payload);
                else if ("annotationChanged".equals(eventName)) emitAnnotationChanged(payload);
                else if ("annotationsRemoved".equals(eventName)) emitAnnotationsRemoved(payload);
                else if ("annotationsSelected".equals(eventName)) emitAnnotationsSelected(payload);
                else if ("annotationsDeselected".equals(eventName)) emitAnnotationsDeselected(payload);
                else if ("annotationTapped".equals(eventName)) emitAnnotationTapped(payload);
                else if ("textSelected".equals(eventName)) emitTextSelected(payload);
                else if ("formFieldValuesUpdated".equals(eventName)) emitFormFieldValuesUpdated(payload);
                else if ("formFieldSelected".equals(eventName)) emitFormFieldSelected(payload);
                else if ("formFieldDeselected".equals(eventName)) emitFormFieldDeselected(payload);
                else if ("analytics".equals(eventName)) emitAnalytics(payload);
                else if ("bookmarksChanged".equals(eventName)) emitBookmarksChanged(payload);
            }
        });
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public String versionString() {
        return Nutrient.VERSION;
    }

    @Override
    public void present(String document, ReadableMap configuration, Promise promise) {
        controller.present(document, configuration, promise);
    }

    @Override
    public void presentInstant(ReadableMap documentData, ReadableMap configuration, Promise promise) {
        controller.presentInstant(documentData, configuration, promise);
    }

    @Override
    public void setPageIndex(double pageIndex, boolean animated) {
        controller.setPageIndex((int) pageIndex, animated);
    }

    @Override
    public boolean setLicenseKey(String licenseKey) {
        return controller.setLicenseKey(licenseKey);
    }

    @Override
    public WritableMap getDocumentProperties(String documentPath) {
        return controller.getDocumentProperties(documentPath);
    }

    @Override
    public boolean setLicenseKeys(String androidLicenseKey, String iOSLicenseKey) {
        // iOS key ignored on Android; keep signature parity
        return controller.setLicenseKey(androidLicenseKey);
    }

    @Override
    public void processAnnotations(String annotationChange, @Nullable ReadableArray annotationTypes, String sourceDocumentPath, String processedDocumentPath, @Nullable String password, Promise promise) {
        controller.processAnnotations(annotationChange, annotationTypes, sourceDocumentPath, processedDocumentPath, password, promise);
    }

    @Override
    public void dismiss(Promise promise) {
        // no-op on Android
        promise.resolve(null);
    }

    @Override
    public void handleListenerAdded(String event, double componentId, Promise promise) {
        boolean becameFirst = false;
        synchronized (lock) {
            if (event != null) {
                String listenerKey = event + "_" + ((int) componentId);
                int before = activeListeners.size();
                activeListeners.add(listenerKey);
                becameFirst = (before == 0 && !activeListeners.isEmpty());
            }
        }
        if (becameFirst) {
            NutrientNotificationCenter.INSTANCE.setIsNotificationCenterInUse(true);
        }
        controller.handleListenerAdded(event, promise);
    }

    @Override
    public void handleListenerRemoved(String event, double componentId, Promise promise) {
        boolean noneLeft;
        synchronized (lock) {
            if (event != null) {
                String listenerKey = event + "_" + ((int) componentId);
                activeListeners.remove(listenerKey);
            }
            noneLeft = activeListeners.isEmpty();
        }
        if (noneLeft) {
            NutrientNotificationCenter.INSTANCE.setIsNotificationCenterInUse(false);
        }
        controller.handleListenerRemoved(event, noneLeft, promise);
    }

    // Required for NativeEventEmitter compatibility (no-op in TurboModule)
    @Override
    public void addListener(String eventName) {
        // no-op
    }

    @Override
    public void removeListeners(double count) {
        // no-op
    }
}
