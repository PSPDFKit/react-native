package com.pspdfkit.nativecatalog.events;

import android.net.Uri;

import androidx.annotation.IdRes;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.HashMap;

/**
 * Sent by the CustomPdfView when the document was watermarked.
 */
public class DocumentWatermarkedEvent extends Event<DocumentWatermarkedEvent> {

    public static final String EVENT_NAME = "documentWatermarkedEvent";

    @NonNull
    final String watermarkedDocumentPath;

    public DocumentWatermarkedEvent(@IdRes int viewId, @NonNull String watermarkedDocumentPath) {
        super(viewId);
        this.watermarkedDocumentPath = watermarkedDocumentPath;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        // Put the signed path into our event data.
        HashMap<String, Object> data = new HashMap<>();
        data.put("watermarkedDocumentPath", watermarkedDocumentPath);
        WritableMap eventData = Arguments.makeNativeMap(data);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}

