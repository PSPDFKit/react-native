package com.pspdfkit.react.common;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.views.PdfView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

/**
 * Helper to apply annotation-related props to {@link PdfView} in both Paper and Fabric managers.
 */
public final class NutrientPropsAnnotationsHelper {

    private NutrientPropsAnnotationsHelper() {}

    public static void applyAnnotationContextualMenu(@NonNull PdfView view, @Nullable ReadableMap annotationContextualMenu) {
        if (annotationContextualMenu == null) return;
        view.setAnnotationToolbarMenuButtonItems(annotationContextualMenu);
    }

    public static void applyAnnotationContextualMenuJSONString(@NonNull PdfView view, @Nullable String annotationContextualMenuJSONString) {
        if (annotationContextualMenuJSONString == null || annotationContextualMenuJSONString.isEmpty()) return;
        try {
            JSONObject jsonObject = new JSONObject(annotationContextualMenuJSONString);
            Map<String, Object> map = JsonHelpers.toMap(jsonObject);
            applyAnnotationContextualMenu(view, Arguments.makeNativeMap(map));
        } catch (JSONException ignored) {
        }
    }
}

