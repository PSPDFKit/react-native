/*
 * PdfViewStateChangedEvent.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.events;

import androidx.annotation.IdRes;

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
    private final boolean annotationEditingActive;
    private final boolean textSelectionActive;
    private final boolean formEditingActive;

    public PdfViewStateChangedEvent(@IdRes int viewId) {
        super(viewId);
        this.documentIsLoaded = false;
        this.currentPageIndex = -1;
        this.pageCount = -1;
        this.annotationCreationActive = false;
        this.annotationEditingActive = false;
        this.textSelectionActive = false;
        this.formEditingActive = false;
    }

    public PdfViewStateChangedEvent(@IdRes int viewID,
                                    int currentPageIndex,
                                    int pageCount,
                                    boolean annotationCreationActive,
                                    boolean annotationEditingActive,
                                    boolean textSelectionActive,
                                    boolean formEditingActive) {
        super(viewID);
        this.documentIsLoaded = true;
        this.currentPageIndex = currentPageIndex;
        this.pageCount = pageCount;
        this.annotationCreationActive = annotationCreationActive;
        this.annotationEditingActive = annotationEditingActive;
        this.textSelectionActive = textSelectionActive;
        this.formEditingActive = formEditingActive;
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
        eventData.putInt("affectedPageIndex", currentPageIndex);
        eventData.putBoolean("annotationEditingActive", annotationEditingActive);
        eventData.putBoolean("textSelectionActive", textSelectionActive);
        eventData.putBoolean("formEditingActive", formEditingActive);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
