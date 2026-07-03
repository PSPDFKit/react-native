package com.pspdfkit.views

import android.content.Context
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomAnnotationContextualMenuItemTappedEvent
import com.pspdfkit.ui.toolbar.ContextualToolbar
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem

class ToolbarMenuItemListener : ContextualToolbar.OnMenuItemClickListener {

    private var parent: PdfView? = null
    private var eventDispatcher: EventDispatcher? = null
    private var isFabricMode: Boolean = false
    private var fabricDelegate: PdfView.PdfViewDelegate? = null
    private var context: Context? = null
    private var annotationResourceIds: List<Int> = emptyList()

    constructor(parent: PdfView, eventDispatcher: EventDispatcher, context: Context) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
    }

    constructor(
        parent: PdfView,
        eventDispatcher: EventDispatcher,
        context: Context,
        isFabricMode: Boolean,
        fabricDelegate: PdfView.PdfViewDelegate?,
    ) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
        this.isFabricMode = isFabricMode
        this.fabricDelegate = fabricDelegate
    }

    fun setAnnotationResourceIds(resIds: List<Int>) {
        this.annotationResourceIds = resIds
    }

    fun setEventDispatcher(eventDispatcher: EventDispatcher) {
        this.eventDispatcher = eventDispatcher
    }

    override fun onToolbarMenuItemClick(toolbar: ContextualToolbar<*>, menuItem: ContextualToolbarMenuItem): Boolean {
        val id = menuItem.id
        if (!annotationResourceIds.contains(id)) {
            return false
        }

        val resourceName: String = context?.resources?.getResourceEntryName(id) ?: return false

        if (isFabricMode && fabricDelegate != null && parent != null) {
            fabricDelegate!!.onCustomAnnotationContextualMenuItemTapped(resourceName)
        } else {
            val parentView = parent ?: return false
            val viewId = parentView.id
            val surfaceId = UIManagerHelper.getSurfaceId(parentView)
            eventDispatcher!!.dispatchEvent(
                CustomAnnotationContextualMenuItemTappedEvent(surfaceId, viewId, resourceName),
            )
        }

        return true
    }
}
