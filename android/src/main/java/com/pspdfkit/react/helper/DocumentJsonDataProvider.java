package com.pspdfkit.react.helper;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.pspdfkit.document.providers.DataProvider;

import org.json.JSONObject;

import java.nio.charset.Charset;

/**
 * {@link DataProvider} that is used when adding document instant json.
 */
public class DocumentJsonDataProvider implements DataProvider {

    private final byte[] jsonData;

    public DocumentJsonDataProvider(JSONObject documentJson) {
        jsonData = documentJson.toString().getBytes(Charset.forName("UTF-8"));
    }

    @NonNull
    @Override
    public byte[] read(long size, long offset) {
        return jsonData;
    }

    @Override
    public long getSize() {
        return jsonData.length;
    }

    @NonNull
    @Override
    public String getUid() {
        return "Json Data";
    }

    @Nullable
    @Override
    public String getTitle() {
        return "Json Data";
    }

    @Override
    public void release() {

    }
}
