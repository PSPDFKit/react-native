package com.pspdfkit.views

import android.content.Context
import android.util.Log
import android.view.MenuItem
import androidx.annotation.NonNull
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomToolbarButtonTappedEvent

class MenuItemListener: MenuItem.OnMenuItemClickListener {

    private var parent: PdfView? = null
    private var eventDispatcher: EventDispatcher? = null
    private var context: Context? = null;

    constructor(parent: PdfView, eventDispatcher: EventDispatcher, context: Context) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
    }

    override fun onMenuItemClick(menuItem: MenuItem): Boolean {
        val resourceName: String? = context?.resources?.getResourceEntryName(menuItem.itemId)
        if (resourceName != null) {
            eventDispatcher!!.dispatchEvent(parent?.let { CustomToolbarButtonTappedEvent(it.id, resourceName) })
        }
        return false
    }
}