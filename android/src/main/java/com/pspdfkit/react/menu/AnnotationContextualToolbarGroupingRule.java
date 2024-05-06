package com.pspdfkit.react.menu;

import android.content.Context;
import androidx.annotation.NonNull;

import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem;
import com.pspdfkit.ui.toolbar.grouping.presets.AnnotationEditingToolbarGroupingRule;
import com.pspdfkit.ui.toolbar.grouping.presets.MenuItem;
import java.util.ArrayList;
import java.util.List;
public class AnnotationContextualToolbarGroupingRule extends AnnotationEditingToolbarGroupingRule {

    List<ContextualToolbarMenuItem> menuItems;

    public AnnotationContextualToolbarGroupingRule(@NonNull Context context, @NonNull List menuItems) {
        super(context);
        this.menuItems = menuItems;
    }

    @NonNull
    @Override
    public List<MenuItem> getGroupPreset(int capacity, int itemsCount) {
        List<com.pspdfkit.ui.toolbar.grouping.presets.MenuItem> groupPreset =
                new ArrayList<>(super.getGroupPreset(capacity - 1, itemsCount - 1));
        for (ContextualToolbarMenuItem menuItem : menuItems) {
            groupPreset.add(new MenuItem(menuItem.getId()));
        }
        return groupPreset;
    }
}
