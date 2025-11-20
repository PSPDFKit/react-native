package com.pspdfkit.react.common;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Promise;
import com.pspdfkit.views.PdfView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

/**
 * Helper to apply measurement configuration props to {@link PdfView} in both Paper and Fabric managers.
 */
public final class NutrientPropsMeasurementConfigurationHelper {

    private NutrientPropsMeasurementConfigurationHelper() {}

    public static void setMeasurementValueConfigurations(@NonNull PdfView view, @Nullable ReadableArray configurations) {
        setMeasurementValueConfigurations(view, configurations, null);
    }

    public static void setMeasurementValueConfigurations(@NonNull PdfView view, @Nullable ReadableArray configurations, @Nullable Promise promise) {
        try {
            if (configurations != null) {
                view.setMeasurementValueConfigurations(configurations);
            }
            if (promise != null) {
                promise.resolve(true);
            }
        } catch (Exception e) {
            if (promise != null) {
                promise.reject("SET_MEASUREMENT_CONFIG_ERROR", e.getMessage());
            }
        }
    }

    public static JSONObject getMeasurementValueConfigurations(@NonNull PdfView view) throws JSONException {
        return view.getMeasurementValueConfigurations();
    }

    public static void getMeasurementValueConfigurations(@NonNull PdfView view, @Nullable Promise promise) {
        try {
            JSONObject result = view.getMeasurementValueConfigurations();
            Object payload = result != null ? result.opt("measurementValueConfigurations") : null;
            if (promise != null) {
                if (payload instanceof java.util.List) {
                    // Convert Java List (ArrayList) to WritableArray for RN bridge
                    WritableArray array = Arguments.makeNativeArray((java.util.List) payload);
                    promise.resolve(array);
                } else if (payload instanceof java.util.Map) {
                    WritableMap map = Arguments.makeNativeMap((java.util.Map) payload);
                    promise.resolve(map);
                } else {
                    // Fallback: resolve as-is (primitives) or null
                    promise.resolve(payload);
                }
            }
        } catch (Exception e) {
            if (promise != null) {
                promise.reject("GET_MEASUREMENT_CONFIG_ERROR", e.getMessage());
            }
        }
    }
}
