/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package io.nutrient.react.turbo;

import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;

// Generated spec for the TurboModule
import com.pspdfkit.react.NativeNutrientViewTurboModuleSpec;
import com.pspdfkit.views.PdfView;
import com.pspdfkit.react.NutrientViewRegistry;
import com.pspdfkit.react.common.NutrientPropsToolbarHelper;
import com.pspdfkit.react.common.NutrientPropsMeasurementConfigurationHelper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * TurboModule implementation for NutrientView.
 * This module is only used when New Architecture is enabled.
 */
@ReactModule(name = NutrientViewTurboModule.NAME)
public class NutrientViewTurboModule extends NativeNutrientViewTurboModuleSpec {
    
    private static final String TAG = "NutrientViewTurboModule";
    // Standard error codes (aligned with iOS)
    private static final class Errors {
        static final String VIEW_NOT_FOUND = "VIEW_NOT_FOUND";
        static final String ANNOTATION_ERROR = "ANNOTATION_ERROR";
        static final String MODE_ERROR = "MODE_ERROR";
        static final String OPERATION_FAILED = "OPERATION_FAILED";
        static final String CONFIGURATION_ERROR = "CONFIGURATION_ERROR";
        static final String TOOLBAR_ERROR = "TOOLBAR_ERROR";
        static final String MEASUREMENT_CONFIG_ERROR = "MEASUREMENT_CONFIG_ERROR";
        static final String INVALID_ARGS = "INVALID_ARGS";
    }
    
    public static final String NAME = "NutrientViewTurboModule";

    public NutrientViewTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(TAG, "NutrientViewTurboModule initialized");
    }

    @Override
    public void enterAnnotationCreationMode(String reference, String annotationType, Promise promise) {
        Log.d(TAG, "enterAnnotationCreationMode called with reference: " + reference + ", type: " + annotationType);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Use the same pattern as ReactPdfViewManager
            view.enterAnnotationCreationMode(annotationType, 
                () -> promise.resolve(true),
                throwable -> {
                    promise.reject(Errors.ANNOTATION_ERROR, throwable.getMessage());
                }
            );
        } catch (Exception e) {
            promise.reject(Errors.ANNOTATION_ERROR, e.getMessage());
        }
    }

    @Override
    public void exitCurrentlyActiveMode(String reference, Promise promise) {
        Log.d(TAG, "exitCurrentlyActiveMode called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            view.exitCurrentlyActiveMode(
                () -> promise.resolve(true),
                throwable -> {
                    promise.reject(Errors.MODE_ERROR, throwable.getMessage());
                }
            );
        } catch (Exception e) {
            promise.reject(Errors.MODE_ERROR, e.getMessage());
        }
    }

    @Override
    public void clearSelectedAnnotations(String reference, Promise promise) {
        Log.d(TAG, "clearSelectedAnnotations called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            view.clearSelectedAnnotations();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(Errors.OPERATION_FAILED, e.getMessage());
        }
    }

    @Override
    public void selectAnnotations(String reference, String annotationsJSONString, Boolean showContextualMenu, Promise promise) {
        Log.d(TAG, "selectAnnotations called with reference: " + reference + ", annotations: " + annotationsJSONString);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Convert JSON string to ReadableArray
            ReadableArray annotationsArray = jsonStringToReadableArray(annotationsJSONString);
            // Use Promise-based version for Fabric mode
            view.selectAnnotations(0, annotationsArray, showContextualMenu, promise);
        } catch (Exception e) {
            promise.reject(Errors.OPERATION_FAILED, e.getMessage());
        }
    }

    @Override
    public void setPageIndex(String reference, double pageIndex, boolean animated, Promise promise) {
        Log.d(TAG, "setPageIndex called with reference: " + reference + ", pageIndex: " + pageIndex + ", animated: " + animated);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            view.setPageIndex((int) pageIndex);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(Errors.MODE_ERROR, e.getMessage());
        }
    }

    @Override
    public void setToolbar(String reference, String toolbar) {
        Log.d(TAG, "setToolbar called with reference: " + reference + ", toolbar: " + toolbar);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            Log.w(TAG, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Use Promise-based version for Fabric mode (null promise for void method)
            NutrientPropsToolbarHelper.applyToolbarJSONString(view, toolbar, null);
        } catch (Exception e) {
            Log.e(TAG, "Error setting toolbar: " + e.getMessage());
        }
    }

    @Override
    public void getToolbar(String reference, String viewMode, Promise promise) {
        Log.d(TAG, "getToolbar called with reference: " + reference + ", viewMode: " + viewMode);
        
        // Not currently supported on Android.
        promise.resolve(null);
    }

    @Override
    public void setMeasurementValueConfigurations(String reference, ReadableArray configurations, Promise promise) {
        Log.d(TAG, "setMeasurementValueConfigurations called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Use Promise-based version for Fabric mode
            NutrientPropsMeasurementConfigurationHelper.setMeasurementValueConfigurations(view, configurations, promise);
        } catch (Exception e) {
            promise.reject(Errors.MEASUREMENT_CONFIG_ERROR, e.getMessage());
        }
    }

    @Override
    public void getMeasurementValueConfigurations(String reference, Promise promise) {
        Log.d(TAG, "getMeasurementValueConfigurations called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Use Promise-based version for Fabric mode
            NutrientPropsMeasurementConfigurationHelper.getMeasurementValueConfigurations(view, promise);
        } catch (Exception e) {
            promise.reject(Errors.MEASUREMENT_CONFIG_ERROR, e.getMessage());
        }
    }

    @Override
    public void getConfiguration(String reference, Promise promise) {
        Log.d(TAG, "getConfiguration called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            JSONObject result = view.convertConfiguration();
            java.util.Map<String, Object> objMap = com.pspdfkit.react.helper.JsonUtilities.jsonObjectToMap(result);
            com.facebook.react.bridge.WritableMap map = com.facebook.react.bridge.Arguments.makeNativeMap(objMap);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(Errors.CONFIGURATION_ERROR, e.getMessage());
        }
    }

    @Override
    public void setExcludedAnnotations(String reference, ReadableArray annotations) {
        Log.d(TAG, "setExcludedAnnotations called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            Log.w(TAG, "No view found for reference: " + reference);
            return;
        }
        
        try {
            view.setExcludedAnnotations(annotations);
        } catch (Exception e) {
            Log.e(TAG, "Error setting excluded annotations: " + e.getMessage());
        }
    }

    @Override
    public void setUserInterfaceVisible(String reference, boolean visible, Promise promise) {
        Log.d(TAG, "setUserInterfaceVisible called with reference: " + reference + ", visible: " + visible);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            promise.reject(Errors.VIEW_NOT_FOUND, "No view found for reference: " + reference);
            return;
        }
        
        try {
            view.setUserInterfaceVisible(visible);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(Errors.OPERATION_FAILED, e.getMessage());
        }
    }

    @Override
    public void destroyView(String reference) {
        Log.d(TAG, "destroyView called with reference: " + reference);
        
        PdfView view = NutrientViewRegistry.getInstance().getViewForId(reference);
        if (view == null) {
            Log.w(TAG, "No view found for reference: " + reference);
            return;
        }
        
        try {
            // Call removeFragment(true) to destroy the view
            view.removeFragment(true);
        } catch (Exception e) {
            Log.e(TAG, "Error destroying view: " + e.getMessage());
        }
    }

    // Helper: parse a JSON array string into a ReadableArray
    private ReadableArray jsonStringToReadableArray(String jsonString) throws JSONException {
        org.json.JSONArray jsonArray = new org.json.JSONArray(jsonString);
        com.facebook.react.bridge.WritableArray array = com.facebook.react.bridge.Arguments.createArray();
        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            pushJsonValueToArray(array, value);
        }
        return array;
    }

    // Helper: push a JSON value into a WritableArray, converting objects/arrays recursively
    private void pushJsonValueToArray(com.facebook.react.bridge.WritableArray array, Object value) throws JSONException {
        if (value == null || value == org.json.JSONObject.NULL) {
            array.pushNull();
        } else if (value instanceof Boolean) {
            array.pushBoolean((Boolean) value);
        } else if (value instanceof Number) {
            array.pushDouble(((Number) value).doubleValue());
        } else if (value instanceof String) {
            array.pushString((String) value);
        } else if (value instanceof org.json.JSONObject) {
            java.util.Map<String, Object> map = com.pspdfkit.react.helper.JsonUtilities.jsonObjectToMap((org.json.JSONObject) value);
            array.pushMap(com.facebook.react.bridge.Arguments.makeNativeMap(map));
        } else if (value instanceof org.json.JSONArray) {
            array.pushArray(jsonArrayToWritableArray((org.json.JSONArray) value));
        } else {
            // Fallback to string representation
            array.pushString(String.valueOf(value));
        }
    }

    // Helper: convert JSONArray to WritableArray recursively
    private com.facebook.react.bridge.WritableArray jsonArrayToWritableArray(org.json.JSONArray jsonArray) throws JSONException {
        com.facebook.react.bridge.WritableArray array = com.facebook.react.bridge.Arguments.createArray();
        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            pushJsonValueToArray(array, value);
        }
        return array;
    }
}
