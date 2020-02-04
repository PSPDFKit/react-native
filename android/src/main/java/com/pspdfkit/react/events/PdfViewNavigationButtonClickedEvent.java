package com.pspdfkit.react.events;

import androidx.annotation.IdRes;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when navigation button was clicked.
 */
public class PdfViewNavigationButtonClickedEvent extends Event<PdfViewNavigationButtonClickedEvent> {

    public static final String EVENT_NAME = "pdfViewNavgigationButtonClicked";

    public PdfViewNavigationButtonClickedEvent(@IdRes int viewId) {
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
