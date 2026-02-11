package com.pspdfkit.react.common;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.Promise;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.react.ToolbarMenuItemsAdapter;
import com.pspdfkit.views.PdfView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public final class NutrientPropsToolbarHelper {

    private NutrientPropsToolbarHelper() {}

    public static void applyToolbar(@NonNull final PdfView view, @NonNull ReadableMap toolbar) {
        if (toolbar.hasKey("toolbarMenuItems")) {
            ReadableMap toolbarMenuItems = toolbar.getMap("toolbarMenuItems");
            ArrayList buttons = toolbarMenuItems.getArray("buttons").toArrayList();
            WritableArray stockToolbarItems = new WritableNativeArray();
            ArrayList customToolbarItems = new ArrayList();
            for (int i = 0; i < buttons.size(); i++) {
                Object item = buttons.get(i);
                if (item instanceof String) {
                    String stockItem = (String) item;
                    // On Android, documentEditorButtonItem should behave like thumbnailsButtonItem.
                    if ("documentEditorButtonItem".equals(stockItem)) {
                        stockItem = "thumbnailsButtonItem";
                    }
                    stockToolbarItems.pushString(stockItem);
                } else if (item instanceof HashMap) {
                    ((HashMap<String, Integer>) item).put("index", i);
                    customToolbarItems.add(item);
                }
            }

            if (stockToolbarItems != null) {
                PdfActivityConfiguration currentConfiguration = view.getConfiguration();
                ToolbarMenuItemsAdapter newConfigurations = new ToolbarMenuItemsAdapter(currentConfiguration, stockToolbarItems, view.getInitialConfiguration());
                if (view.getInitialConfiguration() == null) {
                    view.setPendingToolbarItems(stockToolbarItems);
                } else {
                    view.setConfiguration(newConfigurations.build());
                }
            }
            view.setAllToolbarItems(stockToolbarItems.toArrayList(), customToolbarItems);
        }
    }

    public static void applyToolbarJSONString(@NonNull final PdfView view, @Nullable final String toolbarJSONString) {
        applyToolbarJSONString(view, toolbarJSONString, null);
    }

    public static void applyToolbarJSONString(@NonNull final PdfView view, @Nullable final String toolbarJSONString, @Nullable Promise promise) {
        if (toolbarJSONString == null || toolbarJSONString.isEmpty()) {
            if (promise != null) {
                promise.resolve(true);
            }
            return;
        }
        try {
            Map<String, Object> map = JsonHelpers.toMap(new org.json.JSONObject(toolbarJSONString));
            ReadableMap toolbar = Arguments.makeNativeMap(map);
            applyToolbar(view, toolbar);
            if (promise != null) {
                promise.resolve(true);
            }
        } catch (Exception e) {
            if (promise != null) {
                promise.reject("SET_TOOLBAR_ERROR", e.getMessage());
            }
        }
    }
}


