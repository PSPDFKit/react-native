package com.pspdfkit.react.events;

import android.support.annotation.IdRes;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.react.helper.JsonUtilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Event sent by the {@link com.pspdfkit.views.PdfView} when an annotation was selected.
 */
public class PdfViewAnnotationChangedEvent extends Event<PdfViewAnnotationChangedEvent> {

    public static final String EVENT_NAME = "pdfViewAnnotationChanged";
    public static final String EVENT_TYPE_CHANGED = "changed";
    public static final String EVENT_TYPE_ADDED = "added";
    public static final String EVENT_TYPE_REMOVED = "removed";

    @NonNull
    private final String eventType;

    @NonNull
    private final Annotation annotation;

    public PdfViewAnnotationChangedEvent(@IdRes int viewId, @NonNull String eventType, @NonNull Annotation annotation) {
        super(viewId);
        this.eventType = eventType;
        this.annotation = annotation;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        try {
            Map<String, Object> map = new HashMap<>();
            map.put("change", eventType);

            if (EVENT_TYPE_REMOVED.equalsIgnoreCase(eventType)) {
                // For removed annotation we can't get the instant json so manually create something.
                Map<String, Object> annotationMap = new HashMap<>();
                annotationMap.put("name", annotation.getName());
                annotationMap.put("creatorName", annotation.getCreator());
                map.put("annotation", annotationMap);
            } else {
                JSONObject instantJson = new JSONObject(annotation.toInstantJson());
                Map<String, Object> instantJsonMap = JsonUtilities.jsonObjectToMap(instantJson);
                map.put("annotation", instantJsonMap);
            }

            WritableMap eventData = Arguments.makeNativeMap(map);
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}