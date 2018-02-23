package com.pspdfkit.react;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pspdfkit.views.PdfView;

/**
 * Exposes {@link PdfView} to react-native.
 */
public class ReactPdfViewManager extends ViewGroupManager<PdfView> {
    @Override
    public String getName() {
        return "RCTPSPDFKitView";
    }

    @Override
    protected PdfView createViewInstance(ThemedReactContext reactContext) {
        Activity currentActivity = reactContext.getCurrentActivity();
        if (currentActivity instanceof FragmentActivity) {
            // Since we require a FragmentManager this only works in FragmentActivities.
            FragmentActivity fragmentActivity = (FragmentActivity)reactContext.getCurrentActivity();
            PdfView pdfView = new PdfView(reactContext);
            pdfView.setFragmentManager(fragmentActivity.getSupportFragmentManager());
            return pdfView;
        } else {
            throw new IllegalStateException("ReactPSPDFKitView can only be used in FragmentActivity subclasses.");
        }
    }

    @Override
    public void onDropViewInstance(PdfView view) {
        view.removeFragment();
    }

    @ReactProp(name = "fragmentTag")
    public void setFragmentTag(PdfView view, @NonNull String fragmentTag) {
        view.setFragmentTag(fragmentTag);
    }

    @ReactProp(name = "configuration")
    public void setConfiguration(PdfView view, @NonNull ReadableMap configuration) {
        ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(view.getContext(), configuration);
        view.setConfiguration(configurationAdapter.build());
    }

    @ReactProp(name = "document")
    public void setDocument(PdfView view, @NonNull String document) {
        view.setDocument(document);
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }


}
