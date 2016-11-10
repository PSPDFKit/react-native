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

package com.pspdfkit.react;

import android.net.Uri;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.ui.PSPDFActivity;

import java.util.HashMap;
import java.util.Map;

public class PSPDFKitModule extends ReactContextBaseJavaModule {

    private static final String VERSION_KEY = "versionString";
    private static final String FILE_SCHEME = "file:///";
    private String licenseKey = "LICENSE_KEY_GOES_HERE";

    public PSPDFKitModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PSPDFKit";
    }

    @ReactMethod
    public void setLicenseKey(@NonNull String licenseKey) {
        this.licenseKey = licenseKey;
    }

    @ReactMethod
    public void present(@NonNull String document, @NonNull ReadableMap configuration) {
        if (getCurrentActivity() != null) {
            ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(getCurrentActivity(), licenseKey, configuration);
            // This is an edge case where file scheme is missing.
            if (Uri.parse(document).getScheme() == null) {
                document = FILE_SCHEME + document;
            }
            PSPDFActivity.showDocument(getCurrentActivity(), Uri.parse(document), configurationAdapter.build());
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
