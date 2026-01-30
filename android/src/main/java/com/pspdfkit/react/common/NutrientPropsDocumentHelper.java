package com.pspdfkit.react.common;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.UIManagerType;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.preferences.PSPDFKitPreferences;
import com.pspdfkit.react.AnnotationConfigurationAdaptor;
import com.pspdfkit.react.ToolbarMenuItemsAdapter;
import com.pspdfkit.react.ConfigurationAdapter;
import com.pspdfkit.react.annotations.ReactAnnotationPresetConfiguration;
import com.pspdfkit.react.menu.ReactGroupingRule;
import com.pspdfkit.views.PdfView;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Helper to apply props to {@link PdfView} reusing the exact logic from {@link com.pspdfkit.react.ReactPdfViewManager}.
 */
public final class NutrientPropsDocumentHelper {

    private NutrientPropsDocumentHelper() {}

    // New Architecture: handle document and configuration separately
    public static void applyDocument(@NonNull PdfView view,
                                     @Nullable String document,
                                     @NonNull ReactApplicationContext reactApplicationContext,
                                     @Nullable Integer reference) {
        if (document == null) return;
        view.setDocument(document, reactApplicationContext, reference);
    }

    public static void applyConfiguration(@NonNull PdfView view, @NonNull ReadableMap configuration) {
        ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(view.getContext(), configuration);
        PdfActivityConfiguration configurationBuild = configurationAdapter.build();
        view.setInitialConfiguration(configurationBuild);
        if (view.getPendingToolbarItems() != null) {
            ToolbarMenuItemsAdapter newConfigurations = new ToolbarMenuItemsAdapter(configurationBuild, view.getPendingToolbarItems(), view.getInitialConfiguration());
            view.setConfiguration(newConfigurations.build());
        } else {
            view.setConfiguration(configurationBuild);
        }
        view.setDocumentPassword(configuration.getString("documentPassword"));
        view.setRemoteDocumentConfiguration(configuration.getMap("remoteDocumentConfiguration"));
        if (configuration.getArray("measurementValueConfigurations") != null) {
            view.setMeasurementValueConfigurations(configuration.getArray("measurementValueConfigurations"));
        }
        if (configuration.getMap("aiAssistantConfiguration") != null) {
            view.setAIAConfiguration(configuration.getMap("aiAssistantConfiguration"));
        }
        if (configuration.hasKey("androidRemoveStatusBarOffset")) {
            view.setIsStatusBarHidden(configuration.getBoolean("androidRemoveStatusBarOffset"));
        }
        if (configuration.hasKey("toolbarPosition")) {
            view.setToolbarPosition(configuration.getString("toolbarPosition"));
        }
        if (configuration.hasKey("supportedToolbarPositions")) {
            view.setSupportedToolbarPositions(configuration.getArray("supportedToolbarPositions"));
        }
    }

    public static void applyConfigurationJSONString(@NonNull PdfView view, @Nullable String configurationJSONString) {
        if (configurationJSONString == null || configurationJSONString.isEmpty()) return;
        try {
            JSONObject jsonObject = new JSONObject(configurationJSONString);
            Map<String, Object> map = JsonHelpers.toMap(jsonObject);
            // Arguments.makeNativeMap returns a WritableMap which implements ReadableMap
            applyConfiguration(view, Arguments.makeNativeMap(map));
        } catch (JSONException ignored) {
        }
    }

    public static void applyPageIndex(@NonNull PdfView view, int pageIndex) {
        view.setPageIndex(pageIndex);
    }

    public static void applyAnnotationAuthorName(@NonNull PdfView view, @Nullable String annotationAuthorName) {
        if (annotationAuthorName == null) return;
        PSPDFKitPreferences.get(view.getContext()).setAnnotationCreator(annotationAuthorName);
    }

    public static void applyImageSaveMode(@NonNull PdfView view, @Nullable String imageSaveMode) {
        if (imageSaveMode == null) return;
        view.setImageSaveMode(imageSaveMode);
    }

    public static void applyDisableAutomaticSaving(@NonNull PdfView view, boolean disableAutomaticSaving) {
        view.setDisableAutomaticSaving(disableAutomaticSaving);
    }

    public static void applyMenuItemGrouping(@NonNull PdfView view, @NonNull ReadableArray menuItemGrouping) {
        ReactGroupingRule groupingRule = new ReactGroupingRule(view.getContext(), menuItemGrouping);
        view.setMenuItemGroupingRule(groupingRule);
    }

    public static void applyMenuItemGroupingJSONString(@NonNull PdfView view, @Nullable String menuItemGroupingJSONString) {
        if (menuItemGroupingJSONString == null || menuItemGroupingJSONString.isEmpty()) return;
        try {
            JSONArray arr = new JSONArray(menuItemGroupingJSONString);
            // Convert to a React Native ReadableArray using existing helpers
            ReadableArray ra = Arguments.makeNativeArray(JsonHelpers.toList(arr));
            applyMenuItemGrouping(view, ra);
        } catch (JSONException ignored) {
        }
    }

    public static void applyAnnotationPresets(@NonNull PdfView view, @NonNull ReadableMap annotationPresets) {
        List<ReactAnnotationPresetConfiguration> annotationsConfiguration = AnnotationConfigurationAdaptor.convertAnnotationConfigurations(
                view.getContext(), annotationPresets
        );
        view.setAnnotationConfiguration(annotationsConfiguration);
    }

    public static void applyHideDefaultToolbar(@NonNull PdfView view, boolean hideDefaultToolbar) {
        view.setHideDefaultToolbar(hideDefaultToolbar);
    }

    public static void applyShowNavigationButtonInToolbar(@NonNull PdfView view, boolean showNavigationButtonInToolbar) {
        view.setShowNavigationButtonInToolbar(showNavigationButtonInToolbar);
    }

    public static void applyAvailableFontNames(@NonNull PdfView view, @Nullable ReadableArray availableFontNames) {
        if (availableFontNames != null) {
            view.setAvailableFontNames(availableFontNames);
        }
    }

    public static void applySelectedFontName(@NonNull PdfView view, @Nullable String selectedFontName) {
        if (selectedFontName != null) {
            view.setSelectedFontName(selectedFontName);
        }
    }
}

// Internal JSON conversion helpers
class JsonHelpers {
    static Map<String, Object> toMap(JSONObject json) throws JSONException {
        Map<String, Object> map = new HashMap<>();
        JSONArray keys = json.names();
        if (keys == null) return map;
        for (int i = 0; i < keys.length(); i++) {
            String key = keys.getString(i);
            Object value = json.get(key);
            map.put(key, unwrap(value));
        }
        return map;
    }

    static List<Object> toList(JSONArray array) throws JSONException {
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            list.add(unwrap(value));
        }
        return list;
    }

    private static Object unwrap(Object value) throws JSONException {
        if (value instanceof JSONObject) return toMap((JSONObject) value);
        if (value instanceof JSONArray) return toList((JSONArray) value);
        if (value.equals(JSONObject.NULL)) return null;
        return value;
    }
}
