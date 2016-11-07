/*
 *   PSPDFKitModule.java
 *   PSPDFKit
 *
 *   Copyright (c) 2014-2016 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.react.pspdfkit;

import android.net.Uri;
import android.os.Environment;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.ui.PSPDFActivity;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class PSPDFKitModule extends ReactContextBaseJavaModule {

    private static final String VERSION_KEY = "VERSION";

    public PSPDFKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PSPDFKit";
    }

    @ReactMethod
    public void presentAsset(@NonNull String document, @NonNull String licenseKey, @NonNull ReadableMap configuration) {
        if (getCurrentActivity() != null) {
            final Uri assetDocument = Uri.parse("file:///android_asset/" + document);
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), licenseKey, configuration);
            PSPDFActivity.showDocument(getCurrentActivity(), assetDocument, configurationAdapter.build());
        }
    }    

    @ReactMethod
    public void presentLocal(@NonNull String document, @NonNull String licenseKey, @NonNull ReadableMap configuration) {
        if (getCurrentActivity() != null) {
            final Uri localDocument = Uri.fromFile(new File(Environment.getExternalStorageDirectory(), document));
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), licenseKey, configuration);
            PSPDFActivity.showDocument(getCurrentActivity(), localDocument, configurationAdapter.build());
        }
    }

    @NonNull
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(VERSION_KEY, PSPDFKit.VERSION);
        return constants;
    }
}
