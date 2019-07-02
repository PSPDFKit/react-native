package com.pspdfkit.react.events;

import android.support.annotation.IdRes;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when the document load failed.
 */
public class PdfViewDocumentLoadFailedEvent extends Event<PdfViewDocumentLoadFailedEvent> {

    public static final String EVENT_NAME = "pdfViewDocumentLoadFailed";

    private final String error;

    public PdfViewDocumentLoadFailedEvent(@IdRes int viewId, @NonNull String error) {
        super(viewId);
        this.error = error;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap eventData = Arguments.createMap();
        eventData.putString("error", error);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
