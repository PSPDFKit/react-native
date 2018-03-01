package com.pspdfkit.react.events;


import android.support.annotation.IdRes;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} containing info about the current state.
 */
public class PdfViewStateChangedEvent extends Event<PdfViewStateChangedEvent> {

    public static final String EVENT_NAME = "pdfViewStateChanged";

    private final boolean documentIsLoaded;
    private final int currentPageIndex;
    private final int pageCount;
    private final boolean annotationCreationActive;

    public PdfViewStateChangedEvent(@IdRes int viewId) {
        super(viewId);
        this.documentIsLoaded = false;
        this.currentPageIndex = -1;
        this.pageCount = -1;
        this.annotationCreationActive = false;
    }

    public PdfViewStateChangedEvent(@IdRes int viewID, int currentPageIndex, int pageCount, boolean annotationCreationActive) {
        super(viewID);
        this.documentIsLoaded = true;
        this.currentPageIndex = currentPageIndex;
        this.pageCount = pageCount;
        this.annotationCreationActive = annotationCreationActive;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap eventData = Arguments.createMap();
        eventData.putBoolean("documentLoaded", documentIsLoaded);
        eventData.putInt("currentPageIndex", currentPageIndex);
        eventData.putInt("pageCount", pageCount);
        eventData.putBoolean("annotationCreationActive", annotationCreationActive);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
