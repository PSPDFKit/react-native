package com.pspdfkit.react.events

import androidx.annotation.IdRes
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class CustomToolbarButtonTappedEvent: Event<CustomToolbarButtonTappedEvent> {

    private var buttonId: String? = null

    constructor(@IdRes viewId: Int, buttonId: String) : super(viewId) {
        this.buttonId = buttonId
    }

    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        val eventData = Arguments.createMap()
        eventData.putString("id", buttonId)
        rctEventEmitter.receiveEvent(viewTag, eventName, eventData)
    }

    companion object {
        @kotlin.jvm.JvmField
        var EVENT_NAME = "customToolbarButtonTapped"
    }
}