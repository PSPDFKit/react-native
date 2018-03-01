package com.pspdfkit.react;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentActivity;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pspdfkit.react.events.PdfViewStateChangedEvent;
import com.pspdfkit.views.PdfView;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Exposes {@link PdfView} to react-native.
 */
public class ReactPdfViewManager extends ViewGroupManager<PdfView> {

    public static final int COMMAND_ENTER_ANNOTATION_CREATION_MODE = 1;
    public static final int COMMAND_EXIT_CURRENTLY_ACTIVE_MODE = 2;

    @Override
    public String getName() {
        return "RCTPSPDFKitView";
    }

    @Override
    protected PdfView createViewInstance(ThemedReactContext reactContext) {
        Activity currentActivity = reactContext.getCurrentActivity();
        if (currentActivity instanceof FragmentActivity) {
            // Since we require a FragmentManager this only works in FragmentActivities.
            FragmentActivity fragmentActivity = (FragmentActivity) reactContext.getCurrentActivity();
            PdfView pdfView = new PdfView(reactContext);
            pdfView.setFragmentManager(fragmentActivity.getSupportFragmentManager());
            pdfView.setEventDispatcher(reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher());
            return pdfView;
        } else {
            throw new IllegalStateException("ReactPSPDFKitView can only be used in FragmentActivity subclasses.");
        }
    }

    @Override
    public void onDropViewInstance(PdfView view) {
        view.removeFragment();
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                "enterAnnotationCreationMode",
                COMMAND_ENTER_ANNOTATION_CREATION_MODE,
                "exitCurrentlyActiveMode",
                COMMAND_EXIT_CURRENTLY_ACTIVE_MODE);
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

    @ReactProp(name = "pageIndex")
    public void setPageIndex(PdfView view, int pageIndex) {
        view.setPageIndex(pageIndex);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(PdfViewStateChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onStateChanged"));
    }

    @Override
    public void receiveCommand(PdfView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                root.enterAnnotationCreationMode();
                break;
            case  COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                root.exitCurrentlyActiveMode();
                break;
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }


}
