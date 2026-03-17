package com.pspdfkit.views

import android.content.Context
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomAnnotationContextualMenuItemTappedEvent
import com.pspdfkit.react.events.CustomTextSelectionContextualMenuItemTappedEvent
import com.pspdfkit.ui.toolbar.ContextualToolbar
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem
import com.pspdfkit.ui.toolbar.TextSelectionToolbar

class ToolbarMenuItemListener: ContextualToolbar.OnMenuItemClickListener {

    private var parent: PdfView? = null
    private var eventDispatcher: EventDispatcher? = null
    private var isFabricMode: Boolean = false
    private var fabricDelegate: PdfView.PdfViewDelegate? = null
    private var context: Context? = null
    private var annotationResourceIds: List<Int> = emptyList()
    private var textSelectionResourceIds: List<Int> = emptyList()

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

    fun setAnnotationResourceIds(resIds: List<Int>) {
        this.annotationResourceIds = resIds
    }

    fun setTextSelectionResourceIds(resIds: List<Int>) {
        this.textSelectionResourceIds = resIds
    }

    override fun onToolbarMenuItemClick(toolbar: ContextualToolbar<*>, menuItem: ContextualToolbarMenuItem): Boolean {
        val id = menuItem.id
        val isAnnotationCustom = annotationResourceIds.contains(id)
        val isTextSelectionCustom = textSelectionResourceIds.contains(id)

        if (!isAnnotationCustom && !isTextSelectionCustom) {
            return false
        }

        val resourceName: String = context?.resources?.getResourceEntryName(id) ?: return false
        val isTextSelection = isTextSelectionCustom

        if (isFabricMode && fabricDelegate != null && parent != null) {
            if (isTextSelection) {
                fabricDelegate!!.onCustomTextSelectionContextualMenuItemTapped(resourceName)
            } else {
                fabricDelegate!!.onCustomAnnotationContextualMenuItemTapped(resourceName)
            }
        } else {
            val viewId = parent?.id ?: return false
            val event =
                if (isTextSelection) {
                    CustomTextSelectionContextualMenuItemTappedEvent(viewId, resourceName)
                } else {
                    CustomAnnotationContextualMenuItemTappedEvent(viewId, resourceName)
                }
            eventDispatcher!!.dispatchEvent(event)
        }

        return true
    }
}