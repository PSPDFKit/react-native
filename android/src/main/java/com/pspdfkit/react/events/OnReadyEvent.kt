package com.pspdfkit.react.events

import androidx.annotation.IdRes
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class OnReadyEvent: Event<OnReadyEvent> {

    constructor(surfaceId: Int, @IdRes viewId: Int) : super(surfaceId, viewId) {}

    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun getEventData(): WritableMap {
        val eventData = Arguments.createMap()
        return eventData
    }

    companion object {
        @kotlin.jvm.JvmField
        var EVENT_NAME = "onReadyEvent"
    }
}