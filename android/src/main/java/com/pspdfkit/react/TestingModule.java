/*
 * TestingModule.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;

public class TestingModule extends ReactContextBaseJavaModule {

    private static final HashMap<String, String> values = new HashMap<>();

    public TestingModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "TestingModule";
    }

    @ReactMethod
    public void setValue(@NonNull String key, @NonNull String value) {
        synchronized (values) {
            values.put(key, value);
            values.notifyAll();
        }
    }

    public static void resetValues() {
        synchronized (values) {
            values.clear();
        }
    }

    public static String getValue(@NonNull String key) throws InterruptedException {
        synchronized (values) {
            if (!values.containsKey(key)) {
                values.wait(60000);
                if (!values.containsKey(key)) {
                    throw new IllegalArgumentException("Key " + key + " was not found. Got: " + values.toString());
                }
            }
            return values.get(key);
        }
    }
}
