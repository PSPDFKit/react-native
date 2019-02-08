package com.pspdfkit.react.events;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.react.helper.JsonUtilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

import androidx.annotation.IdRes;
import androidx.annotation.NonNull;

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
            JSONObject instantJson = new JSONObject(annotation.toInstantJson());
            Map<String, Object> map = JsonUtilities.jsonObjectToMap(instantJson);
            WritableMap eventData = Arguments.makeNativeMap(map);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}