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

    override fun onMenuItemClick(menuItem: MenuItem): Boolean = dispatchItemTapped(menuItem.itemId)

    /**
     * Dispatches `customToolbarButtonTapped` for [itemId].
     *
     * Split out of [onMenuItemClick] because the Compose toolbars report taps by id rather than
     * by `MenuItem`. Returns whether the tap was dispatched, which is what the toolbar item click
     * listener has to report so unrecognized ids fall through to the SDK's own handling.
     */
    fun dispatchItemTapped(itemId: Int): Boolean {
        val resourceName: String = runCatching { context?.resources?.getResourceEntryName(itemId) }
            .getOrNull() ?: return false
        val view = parent ?: return false
        val dispatcher = eventDispatcher ?: return false
        val surfaceId = UIManagerHelper.getSurfaceId(view)
        dispatcher.dispatchEvent(CustomToolbarButtonTappedEvent(surfaceId, view.id, resourceName))
        return true
    }
}