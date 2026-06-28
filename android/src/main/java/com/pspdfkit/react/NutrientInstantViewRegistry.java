/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 */

package com.pspdfkit.react;

import android.util.Log;
import com.pspdfkit.views.InstantPdfView;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Registry for NutrientInstantView (Fabric) - maps nativeId to InstantPdfView.
 */
public class NutrientInstantViewRegistry {
    private static final String TAG = "NutrientInstantViewRegistry";
    private static NutrientInstantViewRegistry instance;
    private final Map<String, InstantPdfView> views = new ConcurrentHashMap<>();

    private NutrientInstantViewRegistry() {}

    public static synchronized NutrientInstantViewRegistry getInstance() {
        if (instance == null) {
            instance = new NutrientInstantViewRegistry();
        }
        return instance;
    }

    public void registerView(InstantPdfView view, String nativeId) {
        if (view != null && nativeId != null) {
            views.put(nativeId, view);
        }
    }

    public InstantPdfView getViewForId(String nativeId) {
        return nativeId == null ? null : views.get(nativeId);
    }

    public void unregisterView(String nativeId) {
        if (nativeId != null) {
            views.remove(nativeId);
        }
    }
}
