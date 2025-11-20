/*
 * PdfViewStateChangedEvent.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2025 PSPDFKit GmbH. All rights reserved.
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

    // Getter methods for accessing private fields
    public boolean isDocumentLoaded() {
        return documentIsLoaded;
    }

    public int getCurrentPageIndex() {
        return currentPageIndex;
    }

    public int getPageCount() {
        return pageCount;
    }

    public boolean isAnnotationCreationActive() {
        return annotationCreationActive;
    }

    public int getAffectedPageIndex() {
        return currentPageIndex; // affectedPageIndex is same as currentPageIndex
    }

    public boolean isAnnotationEditingActive() {
        return annotationEditingActive;
    }

    public boolean isTextSelectionActive() {
        return textSelectionActive;
    }

    public boolean isFormEditingActive() {
        return formEditingActive;
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
