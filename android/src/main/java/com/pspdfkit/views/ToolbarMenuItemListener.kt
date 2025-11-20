package com.pspdfkit.views

import android.content.Context
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomAnnotationContextualMenuItemTappedEvent
import com.pspdfkit.ui.toolbar.ContextualToolbar
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem

class ToolbarMenuItemListener: ContextualToolbar.OnMenuItemClickListener {

    private var parent: PdfView? = null
    private var eventDispatcher: EventDispatcher? = null
    private var isFabricMode: Boolean = false
    private var fabricDelegate: PdfView.PdfViewDelegate? = null
    private var context: Context? = null
    private var resourceIds: List<Int> = ArrayList()

    constructor(parent: PdfView, eventDispatcher: EventDispatcher, context: Context) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
    }

    constructor(parent: PdfView, eventDispatcher: EventDispatcher, context: Context, isFabricMode: Boolean, fabricDelegate: PdfView.PdfViewDelegate?) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
        this.isFabricMode = isFabricMode
        this.fabricDelegate = fabricDelegate
    }

    fun setResourceIds(resIds: List<Int>) {
        this.resourceIds = resIds
    }

    override fun onToolbarMenuItemClick(toolbar: ContextualToolbar<*>, menuItem: ContextualToolbarMenuItem): Boolean {
        // Check if the selected item is part of the custom items list
        if (this.resourceIds.contains(menuItem.id)) {
            val resourceName: String? = context?.resources?.getResourceEntryName(menuItem.id)
            if (resourceName != null) {
                if (isFabricMode && fabricDelegate != null && parent != null) {
                    // Fabric path: route back to manager delegate
                    fabricDelegate!!.onCustomAnnotationContextualMenuItemTapped(resourceName)
                } else {
                    parent?.let { CustomAnnotationContextualMenuItemTappedEvent(it.id, resourceName) }
                        ?.let { eventDispatcher!!.dispatchEvent(it) }
                }
            }
            return true
        }
        return false
    }
}