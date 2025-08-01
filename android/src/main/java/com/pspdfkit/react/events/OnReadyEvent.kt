package com.pspdfkit.react.events

import androidx.annotation.IdRes
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class OnReadyEvent: Event<OnReadyEvent> {

    constructor(@IdRes viewId: Int) : super(viewId) {}

    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        val eventData = Arguments.createMap()
        rctEventEmitter.receiveEvent(viewTag, eventName, eventData)
    }

    companion object {
        @kotlin.jvm.JvmField
        var EVENT_NAME = "onReadyEvent"
    }
}