/*
 * PdfViewAnnotationTappedEvent.java
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
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.react.helper.JsonUtilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when an annotation was selected.
 */
public class PdfViewAnnotationTappedEvent extends Event<PdfViewAnnotationTappedEvent> {

    public static final String EVENT_NAME = "pdfViewAnnotationTapped";

    @NonNull
    private final Annotation annotation;

    public PdfViewAnnotationTappedEvent(@IdRes int viewId, @NonNull Annotation annotation) {
        super(viewId);
        this.annotation = annotation;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        try {
            String rawInstantJson = annotation.toInstantJson();
            if (rawInstantJson != null && !rawInstantJson.equals("null")) {
                JSONObject instantJson = new JSONObject(rawInstantJson);
                Map<String, Object> map = JsonUtilities.jsonObjectToMap(instantJson);
                map.put("uuid", annotation.getUuid());
                WritableMap eventData = Arguments.makeNativeMap(map);
                rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}