package com.pspdfkit.react.menu

import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem
import com.pspdfkit.views.ToolbarMenuItemListener

class ContextualToolbarMenuItemConfig(
    menuItems: List<ContextualToolbarMenuItem>,
    retain: Boolean = true,
    stockActions: List<String> = emptyList(),
    listener: ToolbarMenuItemListener,
) {
     val annotationSelectionMenuItems: List<ContextualToolbarMenuItem>
     val retainSuggestedMenuItems: Boolean
     val annotationStockActions: List<String>
     val toolbarMenuItemListener: ToolbarMenuItemListener

    init {
        annotationSelectionMenuItems = menuItems
        retainSuggestedMenuItems = retain
        annotationStockActions = stockActions
        toolbarMenuItemListener = listener
    }
}