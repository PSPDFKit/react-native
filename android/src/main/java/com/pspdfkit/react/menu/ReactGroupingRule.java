/*
 * ReactGroupingRule.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.menu;

import android.content.Context;
import androidx.annotation.IdRes;
import androidx.annotation.IntRange;
import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.pspdfkit.react.R;
import com.pspdfkit.ui.toolbar.ContextualToolbar;
import com.pspdfkit.ui.toolbar.grouping.presets.MenuItem;
import com.pspdfkit.ui.toolbar.grouping.presets.PresetMenuItemGroupingRule;

import java.util.ArrayList;
import java.util.List;

/**
 * A menu item grouping rule that displays only the menu items configured via the menuItemGrouping prop.
 */
public class ReactGroupingRule extends PresetMenuItemGroupingRule {

    private static final String TAG = "ReactGroupingRule";
    private static final int INVALID_ID = -1;

    private final List<MenuItem> items = new ArrayList<>();

    public ReactGroupingRule(@NonNull Context context, @NonNull ReadableArray menuItems) {
        super(context);
        for (int i = 0; i < menuItems.size(); i++) {
            Dynamic menuItem = menuItems.getDynamic(i);
            if (menuItem.getType() == ReadableType.Map) {
                ReadableMap groupItem = menuItem.asMap();
                int key = getIdFromName(groupItem.getString("key"));
                if (key == INVALID_ID) {
                    continue;
                }

                ReadableArray subItems = groupItem.getArray("items");
                items.add(new MenuItem(key, collectItemIds(subItems)));
            } else {
                int id = getIdFromName(menuItem.asString());
                if (id == INVALID_ID) {
                    continue;
                }
                items.add(new MenuItem(id));
            }
        }
    }

    private int[] collectItemIds(ReadableArray items) {
        List<Integer> itemIds = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            int id = getIdFromName(items.getString(i));
            if (id == INVALID_ID) {
                continue;
            }
            itemIds.add(id);
        }

        int[] ids = new int[itemIds.size()];
        for (int i = 0; i < itemIds.size(); i++) {
            ids[i] = itemIds.get(i);
        }
        return ids;
    }

    @IdRes
    private int getIdFromName(@NonNull String name) {
        switch (name) {
            case "markup":
                return R.id.pspdf__annotation_creation_toolbar_group_markup;
            case "writing":
                return R.id.pspdf__annotation_creation_toolbar_item_writing;
            case "highlight":
                return R.id.pspdf__annotation_creation_toolbar_item_highlight;
            case "squiggly":
                return R.id.pspdf__annotation_creation_toolbar_item_squiggly;
            case "strikeout":
                return R.id.pspdf__annotation_creation_toolbar_item_strikeout;
            case "underline":
                return R.id.pspdf__annotation_creation_toolbar_item_underline;
            case "freetext":
                return R.id.pspdf__annotation_creation_toolbar_item_freetext;
            case "freetext_callout":
                return R.id.pspdf__annotation_creation_toolbar_item_freetext_callout;
            case "signature":
                return R.id.pspdf__annotation_creation_toolbar_item_signature;
            case "pen":
                return R.id.pspdf__annotation_creation_toolbar_item_ink_pen;
            case "highlighter":
                return R.id.pspdf__annotation_creation_toolbar_item_ink_highlighter;
            case "note":
                return R.id.pspdf__annotation_creation_toolbar_item_note;
            case "drawing":
                return R.id.pspdf__annotation_creation_toolbar_group_drawing;
            case "multimedia":
                return R.id.pspdf__annotation_creation_toolbar_group_multimedia;
            case "image":
                return R.id.pspdf__annotation_creation_toolbar_item_image;
            case "camera":
                return R.id.pspdf__annotation_creation_toolbar_item_camera;
            case "stamp":
                return R.id.pspdf__annotation_creation_toolbar_item_stamp;
            case "line":
                return R.id.pspdf__annotation_creation_toolbar_item_line;
            case "square":
                return R.id.pspdf__annotation_creation_toolbar_item_square;
            case "circle":
                return R.id.pspdf__annotation_creation_toolbar_item_circle;
            case "polygon":
                return R.id.pspdf__annotation_creation_toolbar_item_polygon;
            case "polyline":
                return R.id.pspdf__annotation_creation_toolbar_item_polyline;
            case "erase":
                return R.id.pspdf__annotation_creation_toolbar_item_eraser;
            case "redaction":
                return R.id.pspdf__annotation_creation_toolbar_item_redaction;
            case "picker":
                return R.id.pspdf__annotation_creation_toolbar_item_picker;
            case "magic_ink":
                return R.id.pspdf__annotation_creation_toolbar_item_magic_ink;
            case "undo_redo":
                return R.id.pspdf__annotation_creation_toolbar_group_undo_redo;
            case "undo":
                return R.id.pspdf__annotation_creation_toolbar_item_undo;
            case "redo":
                return R.id.pspdf__annotation_creation_toolbar_item_redo;
            case "measurement":
                return R.id.pspdf__annotation_creation_toolbar_group_measurement;
            case "distance":
                return  R.id.pspdf__annotation_creation_toolbar_item_measurement_distance;
            case "perimeter":
                return R.id.pspdf__annotation_creation_toolbar_item_measurement_perimeter;
            case "area_polygon":
                return R.id.pspdf__annotation_creation_toolbar_item_measurement_area_polygon;
            case "area_square":
                return R.id.pspdf__annotation_creation_toolbar_item_measurement_area_rect;
            case "area_circle":
                return R.id.pspdf__annotation_creation_toolbar_item_measurement_area_ellipse;
        }

        Log.i(TAG, String.format("Received unknown menu item %s.", name));
        return INVALID_ID;
    }

    @NonNull
    @Override
    public List<MenuItem> getGroupPreset(@IntRange(from = ContextualToolbar.MIN_TOOLBAR_CAPACITY) int capacity, int itemsCount) {
        return items;
    }

    @Override
    public boolean areGeneratedGroupItemsSelectable() {
        return true;
    }
}
