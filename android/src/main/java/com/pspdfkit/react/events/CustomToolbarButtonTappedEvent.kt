package com.pspdfkit.react.events

import androidx.annotation.IdRes
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class CustomToolbarButtonTappedEvent: Event<CustomToolbarButtonTappedEvent> {

    private var buttonId: String? = null

    constructor(surfaceId: Int, @IdRes viewId: Int, buttonId: String) : super(surfaceId, viewId) {
        this.buttonId = buttonId
    }

    override fun getEventName(): String {
        return EVENT_NAME
    }

    fun getButtonId(): String? {
        return buttonId
    }

    fun getId(): String? {
        return buttonId // id is same as buttonId
    }

    override fun getEventData(): WritableMap {
        val eventData = Arguments.createMap()
        eventData.putString("id", buttonId)
        return eventData
    }

    companion object {
        @kotlin.jvm.JvmField
        var EVENT_NAME = "customToolbarButtonTapped"
    }
}