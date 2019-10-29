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
 * Sent by the CustomPdfView when the document was signed.
 */
public class DocumentDigitallySignedEvent extends Event<DocumentDigitallySignedEvent> {

    public static final String EVENT_NAME = "documentDigitallySignedEvent";

    @NonNull
    final Uri signedDocumentPath;

    public DocumentDigitallySignedEvent(@IdRes int viewId, @NonNull Uri signedDocumentPath) {
        super(viewId);
        this.signedDocumentPath = signedDocumentPath;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        // Put the signed path into our event data.
        HashMap<String, Object> data = new HashMap<>();
        data.put("signedDocumentPath", signedDocumentPath.toString());
        WritableMap eventData = Arguments.makeNativeMap(data);
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}

