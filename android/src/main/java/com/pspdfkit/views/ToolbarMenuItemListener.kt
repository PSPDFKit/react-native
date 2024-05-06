package com.pspdfkit.views

import android.content.Context
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomAnnotationContextualMenuItemTappedEvent
import com.pspdfkit.ui.toolbar.ContextualToolbar
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem

class ToolbarMenuItemListener: ContextualToolbar.OnMenuItemClickListener {

    private var parent: PdfView? = null
    private var eventDispatcher: EventDispatcher? = null
    private var context: Context? = null
    private var resourceIds: List<Int> = ArrayList()

    constructor(parent: PdfView, eventDispatcher: EventDispatcher, context: Context) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
    }

    fun setResourceIds(resIds: List<Int>) {
        this.resourceIds = resIds
    }

    override fun onToolbarMenuItemClick(toolbar: ContextualToolbar<*>, menuItem: ContextualToolbarMenuItem): Boolean {
        // Check if the selected item is part of the custom items list
        if (this.resourceIds.contains(menuItem.id)) {
            val resourceName: String? = context?.resources?.getResourceEntryName(menuItem.id)
            if (resourceName != null) {
                eventDispatcher!!.dispatchEvent(parent?.let { CustomAnnotationContextualMenuItemTappedEvent(it.id, resourceName) })
            }
            return true
        }
        return false
    }
}