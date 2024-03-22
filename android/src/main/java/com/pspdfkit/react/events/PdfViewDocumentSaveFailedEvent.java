/*
 * PdfViewDocumentSaveFailedEvent.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2024 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.events;

import androidx.annotation.IdRes;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when the document save failed.
 */
public class PdfViewDocumentSaveFailedEvent extends Event<PdfViewDocumentSaveFailedEvent> {

    public static final String EVENT_NAME = "pdfViewDocumentSaveFailed";

    private final String error;

    public PdfViewDocumentSaveFailedEvent(@IdRes int viewId, @NonNull String error) {
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
