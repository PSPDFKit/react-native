/*
 * PdfViewDocumentSavedEvent.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021 PSPDFKit GmbH. All rights reserved.
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
