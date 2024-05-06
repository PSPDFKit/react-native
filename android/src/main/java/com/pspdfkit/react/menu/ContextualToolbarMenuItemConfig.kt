package com.pspdfkit.react.menu

import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem
import com.pspdfkit.views.ToolbarMenuItemListener

class ContextualToolbarMenuItemConfig(menuItems: List<ContextualToolbarMenuItem>, retain: Boolean = true, listener: ToolbarMenuItemListener) {
     val annotationSelectionMenuItems: List<ContextualToolbarMenuItem>
     val retainSuggestedMenuItems: Boolean
     val toolbarMenuItemListener: ToolbarMenuItemListener

    init {
        annotationSelectionMenuItems = menuItems
        retainSuggestedMenuItems = retain
        toolbarMenuItemListener = listener
    }
}