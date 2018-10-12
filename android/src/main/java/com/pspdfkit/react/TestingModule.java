package com.pspdfkit.react;

import android.support.annotation.NonNull;

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
            while (!values.containsKey(key)) {
                values.wait(1000);
            }
            return values.get(key);
        }
    }
}
