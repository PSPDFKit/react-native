/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * TurboModule for NutrientInstantView (New Architecture only). Delegates to InstantPdfView.
 */

package io.nutrient.react.turbo;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.pspdfkit.react.NativeNutrientInstantViewTurboModuleSpec;
import com.pspdfkit.react.NutrientInstantViewRegistry;
import com.pspdfkit.views.InstantPdfView;
import kotlin.Unit;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;

/**
 * TurboModule implementation for NutrientInstantView.
 * Only used when New Architecture is enabled. APIs not supported by Instant are no-op or reject.
 */
@ReactModule(name = NutrientInstantViewTurboModule.NAME)
public class NutrientInstantViewTurboModule extends NativeNutrientInstantViewTurboModuleSpec {

    private static final String VIEW_NOT_FOUND = "VIEW_NOT_FOUND";
    private static final String NOT_SUPPORTED = "NOT_SUPPORTED";

    public static final String NAME = "NutrientInstantViewTurboModule";

    public NutrientInstantViewTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private InstantPdfView getView(String reference) {
        return NutrientInstantViewRegistry.getInstance().getViewForId(reference);
    }

    @Override
    public void enterAnnotationCreationMode(String reference, String annotationType, Promise promise) {
        InstantPdfView view = getView(reference);
        if (view == null) {
            promise.reject(VIEW_NOT_FOUND, "No Instant view found for reference: " + reference);
            return;
        }
        view.enterAnnotationCreationMode(
            annotationType,
            new Function0<Unit>() {
                @Override
                public Unit invoke() {
                    promise.resolve(true);
                    return Unit.INSTANCE;
                }
            },
            new Function1<Throwable, Unit>() {
                @Override
                public Unit invoke(Throwable e) {
                    promise.reject("ANNOTATION_ERROR", e.getMessage());
                    return Unit.INSTANCE;
                }
            }
        );
    }

    @Override
    public void exitCurrentlyActiveMode(String reference, Promise promise) {
        InstantPdfView view = getView(reference);
        if (view == null) {
            promise.reject(VIEW_NOT_FOUND, "No Instant view found for reference: " + reference);
            return;
        }
        view.exitCurrentlyActiveMode(
            new Function0<Unit>() {
                @Override
                public Unit invoke() {
                    promise.resolve(true);
                    return Unit.INSTANCE;
                }
            },
            new Function1<Throwable, Unit>() {
                @Override
                public Unit invoke(Throwable e) {
                    promise.reject("MODE_ERROR", e.getMessage());
                    return Unit.INSTANCE;
                }
            }
        );
    }

    @Override
    public void enterContentEditingMode(String reference, Promise promise) {
        promise.reject(NOT_SUPPORTED, "enterContentEditingMode is not supported on NutrientInstantView");
    }

    @Override
    public void setPageIndex(String reference, double pageIndex, boolean animated, Promise promise) {
        InstantPdfView view = getView(reference);
        if (view == null) {
            promise.reject(VIEW_NOT_FOUND, "No Instant view found for reference: " + reference);
            return;
        }
        view.setPageIndex((int) pageIndex);
        promise.resolve(true);
    }

    @Override
    public void executeAction(String reference, String requestId, boolean allow, Promise promise) {
        promise.reject(NOT_SUPPORTED, "executeAction is not supported on NutrientInstantView");
    }

    @Override
    public void setToolbar(String reference, String toolbar) {
        // No-op: Instant toolbar is driven by configuration
    }

    @Override
    public void getToolbar(String reference, String viewMode, Promise promise) {
        promise.resolve(null);
    }

    @Override
    public void setMeasurementValueConfigurations(String reference, ReadableArray configurations, Promise promise) {
        promise.reject(NOT_SUPPORTED, "setMeasurementValueConfigurations is not supported on NutrientInstantView");
    }

    @Override
    public void getMeasurementValueConfigurations(String reference, Promise promise) {
        promise.reject(NOT_SUPPORTED, "getMeasurementValueConfigurations is not supported on NutrientInstantView");
    }

    @Override
    public void getConfiguration(String reference, Promise promise) {
        promise.reject(NOT_SUPPORTED, "getConfiguration is not supported on NutrientInstantView");
    }

    @Override
    public void setExcludedAnnotations(String reference, ReadableArray annotations) {
        // No-op on Instant
    }

    @Override
    public void setUserInterfaceVisible(String reference, boolean visible, Promise promise) {
        InstantPdfView view = getView(reference);
        if (view == null) {
            promise.reject(VIEW_NOT_FOUND, "No Instant view found for reference: " + reference);
            return;
        }
        view.setUserInterfaceVisible(visible);
        promise.resolve(true);
    }

    @Override
    public void destroyView(String reference) {
        InstantPdfView view = getView(reference);
        if (view != null) {
            view.removeFragment(true);
        }
    }
}
