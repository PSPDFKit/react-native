/*
 * DocumentJsonDataProvider.java
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

package com.pspdfkit.react.helper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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
