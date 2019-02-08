package com.pspdfkit.react.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import androidx.annotation.IdRes;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when the document was saved.
 */
public class PdfViewDocumentSavedEvent extends Event<PdfViewDocumentSavedEvent> {

    public static final String EVENT_NAME = "pdfViewDocumentSaved";

    public PdfViewDocumentSavedEvent(@IdRes int viewId) {
        super(viewId);
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap eventData = Arguments.createMap();
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
