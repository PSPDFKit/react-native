package com.pspdfkit.views

import android.content.Context
import android.util.Log
import android.view.View
import android.view.MenuItem
import androidx.annotation.NonNull
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.react.events.CustomToolbarButtonTappedEvent

class MenuItemListener: MenuItem.OnMenuItemClickListener {

    private var parent: View? = null
    private var eventDispatcher: EventDispatcher? = null
    private var context: Context? = null;

    constructor(parent: View, eventDispatcher: EventDispatcher, context: Context) {
        this.parent = parent
        this.eventDispatcher = eventDispatcher
        this.context = context
    }

    fun setEventDispatcher(eventDispatcher: EventDispatcher) {
        this.eventDispatcher = eventDispatcher
    }

    override fun onMenuItemClick(menuItem: MenuItem): Boolean {
        val resourceName: String? = context?.resources?.getResourceEntryName(menuItem.itemId)
        if (resourceName != null) {
            parent?.let {
                val surfaceId = UIManagerHelper.getSurfaceId(it)
                CustomToolbarButtonTappedEvent(surfaceId, it.id, resourceName)
            }
                ?.let { eventDispatcher!!.dispatchEvent(it) }
        }
        return false
    }
}