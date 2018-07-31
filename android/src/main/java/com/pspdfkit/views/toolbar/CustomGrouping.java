package com.pspdfkit.views.toolbar;

import android.content.Context;
import android.support.annotation.IntRange;
import android.support.annotation.NonNull;

import com.pspdfkit.react.R;
import com.pspdfkit.ui.toolbar.ContextualToolbar;
import com.pspdfkit.ui.toolbar.grouping.presets.MenuItem;
import com.pspdfkit.ui.toolbar.grouping.presets.PresetMenuItemGroupingRule;

import java.util.ArrayList;
import java.util.List;

/** Groups the annotation creation toolbar items. */
public class CustomGrouping extends PresetMenuItemGroupingRule {
    public CustomGrouping(@NonNull Context context) {
        super(context);
    }

    @Override
    public List<MenuItem> getGroupPreset(@IntRange(from = ContextualToolbar.MIN_TOOLBAR_CAPACITY) int capacity, int itemsCount) {
        // Capacity shouldn't be less than 4. If that is the case, return empty list.
        if (capacity < ContextualToolbar.MIN_TOOLBAR_CAPACITY) return new ArrayList<>(0);

        return (capacity <= 7) ? FOUR_ITEMS_GROUPING : SEVEN_ITEMS_GROUPING;
    }

    /** Annotation toolbar grouping with 4 elements. */
    private static final List<MenuItem> FOUR_ITEMS_GROUPING = new ArrayList<>(4);
    static {
        // Make sure our custom item is included.
        FOUR_ITEMS_GROUPING.add(new MenuItem(R.id.pspdf_menu_custom));
        FOUR_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_markup,
                new int[]{
                        com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_highlight,
                        com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_squiggly,
                        com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_strikeout,
                        com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_underline}));
        FOUR_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_picker));
        FOUR_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_image));
    }

    /** Annotation toolbar grouping with 7 elements. */
    private static final List<MenuItem> SEVEN_ITEMS_GROUPING = new ArrayList<>(7);
    static {
        // Make sure our custom item is included.
        SEVEN_ITEMS_GROUPING.add(new MenuItem(R.id.pspdf_menu_custom));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_highlight));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_squiggly));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_strikeout));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_underline));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_picker));
        SEVEN_ITEMS_GROUPING.add(new MenuItem(com.pspdfkit.R.id.pspdf__annotation_creation_toolbar_item_image));
    }
}
