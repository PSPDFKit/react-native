/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.util.Log;
import com.pspdfkit.views.PdfView;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Registry to track PdfView instances by their component reference ID.
 * This allows TurboModules to access specific view instances.
 */
public class NutrientViewRegistry {
    private static final String TAG = "NutrientViewRegistry";
    private static NutrientViewRegistry instance;
    private final Map<String, PdfView> views = new ConcurrentHashMap<>();
    
    private NutrientViewRegistry() {}
    
    public static synchronized NutrientViewRegistry getInstance() {
        if (instance == null) {
            instance = new NutrientViewRegistry();
        }
        return instance;
    }
    
    public void registerView(PdfView view, String nativeId) {
        if (view == null || nativeId == null) {
            Log.w(TAG, "Warning: Attempted to register view with null view or nativeId");
            return;
        }
        
        views.put(nativeId, view);
        Log.d(TAG, "Registered view with ID: " + nativeId + " (Total: " + views.size() + ")");
    }
    
    public PdfView getViewForId(String nativeId) {
        if (nativeId == null) {
            return null;
        }
        
        PdfView view = views.get(nativeId);
        if (view == null) {
            Log.w(TAG, "Warning: No view found for ID: " + nativeId);
        }
        
        return view;
    }
    
    public void unregisterView(String nativeId) {
        if (nativeId == null) {
            return;
        }
        
        PdfView removedView = views.remove(nativeId);
        if (removedView != null) {
            Log.d(TAG, "Unregistered view with ID: " + nativeId + " (Total: " + views.size() + ")");
        }
    }
    
    public int getRegisteredViewCount() {
        return views.size();
    }
}
