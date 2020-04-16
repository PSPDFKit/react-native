package com.pspdfkit.react;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.preferences.PSPDFKitPreferences;
import com.pspdfkit.react.events.PdfViewDataReturnedEvent;
import com.pspdfkit.react.menu.ReactGroupingRule;
import com.pspdfkit.views.PdfView;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

/**
 * Exposes {@link PdfView} to react-native.
 */
public class ReactPdfViewManager extends ViewGroupManager<PdfView> {

    public static final int COMMAND_ENTER_ANNOTATION_CREATION_MODE = 1;
    public static final int COMMAND_EXIT_CURRENTLY_ACTIVE_MODE = 2;
    public static final int COMMAND_SAVE_CURRENT_DOCUMENT = 3;
    public static final int COMMAND_GET_ANNOTATIONS = 4;
    public static final int COMMAND_ADD_ANNOTATION = 5;
    public static final int COMMAND_GET_ALL_UNSAVED_ANNOTATIONS = 6;
    public static final int COMMAND_ADD_ANNOTATIONS = 7;
    public static final int COMMAND_GET_FORM_FIELD_VALUE = 8;
    public static final int COMMAND_SET_FORM_FIELD_VALUE = 9;
    public static final int COMMAND_REMOVE_ANNOTATION = 10;
    public static final int COMMAND_GET_ALL_ANNOTATIONS = 11;

    private CompositeDisposable annotationDisposables = new CompositeDisposable();

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
            pdfView.inject(fragmentActivity.getSupportFragmentManager(),
                    reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher());
            return pdfView;
        } else {
            throw new IllegalStateException("ReactPSPDFKitView can only be used in FragmentActivity subclasses.");
        }
    }

    @Override
    public void onDropViewInstance(PdfView view) {
        view.removeFragment(true);
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandMap = MapBuilder.of(
                "enterAnnotationCreationMode",
                COMMAND_ENTER_ANNOTATION_CREATION_MODE,
                "exitCurrentlyActiveMode",
                COMMAND_EXIT_CURRENTLY_ACTIVE_MODE,
                "saveCurrentDocument",
                COMMAND_SAVE_CURRENT_DOCUMENT,
                "getAnnotations",
                COMMAND_GET_ANNOTATIONS,
                "addAnnotation",
                COMMAND_ADD_ANNOTATION,
                "getAllUnsavedAnnotations",
                COMMAND_GET_ALL_UNSAVED_ANNOTATIONS,
                "addAnnotations",
                COMMAND_ADD_ANNOTATIONS);
        commandMap.put("getFormFieldValue", COMMAND_GET_FORM_FIELD_VALUE);
        commandMap.put("setFormFieldValue", COMMAND_SET_FORM_FIELD_VALUE);
        commandMap.put("removeAnnotation", COMMAND_REMOVE_ANNOTATION);
        commandMap.put("getAllAnnotations", COMMAND_GET_ALL_ANNOTATIONS);
        return commandMap;
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

    @ReactProp(name = "disableDefaultActionForTappedAnnotations")
    public void setDisableDefaultActionForTappedAnnotations(PdfView view, boolean disableDefaultActionForTappedAnnotations) {
        view.setDisableDefaultActionForTappedAnnotations(disableDefaultActionForTappedAnnotations);
    }

    @ReactProp(name = "disableAutomaticSaving")
    public void setDisableAutomaticSaving(PdfView view, boolean disableAutomaticSaving) {
        view.setDisableAutomaticSaving(disableAutomaticSaving);
    }

    @ReactProp(name = "annotationAuthorName")
    public void setAnnotationAuthorName(PdfView view, String annotationAuthorName) {
        PSPDFKitPreferences.get(view.getContext()).setAnnotationCreator(annotationAuthorName);
    }

    @ReactProp(name = "menuItemGrouping")
    public void setMenuItemGrouping(PdfView view, @NonNull ReadableArray menuItemGrouping) {
        ReactGroupingRule groupingRule = new ReactGroupingRule(view.getContext(), menuItemGrouping);
        view.setMenuItemGroupingRule(groupingRule);
    }

    @ReactProp(name = "showNavigationButtonInToolbar")
    public void setShowNavigationButtonInToolbar(@NonNull final PdfView view, final boolean showNavigationButtonInToolbar) {
        view.setShowNavigationButtonInToolbar(showNavigationButtonInToolbar);
    }

    @ReactProp(name= "hideDefaultToolbar")
    public void setHideDefaultToolbar(@NonNull final PdfView view, final boolean hideDefaultToolbar) {
        view.setHideDefaultToolbar(hideDefaultToolbar);
    }

    @ReactProp(name = "availableFontNames")
    public void setAvailableFontNames(@NonNull final PdfView view, @Nullable final ReadableArray availableFontNames) {
        view.setAvailableFontNames(availableFontNames);
    }

    @ReactProp(name = "selectedFontName")
    public void setSelectedFontName(@NonNull final PdfView view, @Nullable final String selectedFontName) {
        view.setSelectedFontName(selectedFontName);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return PdfView.createDefaultEventRegistrationMap();
    }

    @Override
    public void receiveCommand(final PdfView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                root.enterAnnotationCreationMode();
                break;
            case COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                root.exitCurrentlyActiveMode();
                break;
            case COMMAND_SAVE_CURRENT_DOCUMENT:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    try {
                        boolean result = root.saveCurrentDocument();
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, result));
                    } catch (Exception e) {
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, e));
                    }
                }
                break;
            case COMMAND_GET_ANNOTATIONS:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    Disposable annotationDisposable = root.getAnnotations(args.getInt(1), args.getString(2))
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(new Consumer<List<Annotation>>() {
                                @Override
                                public void accept(List<Annotation> annotations) {
                                    root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, annotations));
                                }
                            });
                    annotationDisposables.add(annotationDisposable);
                }
                break;
            case COMMAND_GET_ALL_ANNOTATIONS:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.getAllAnnotations(args.getString(1))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(annotations -> {
                            root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, annotations));
                        }, throwable -> {
                            root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, throwable));
                        }));
                }
                break;
            case COMMAND_ADD_ANNOTATION:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.addAnnotation(requestId, args.getMap(1)));
                }
                break;
            case COMMAND_REMOVE_ANNOTATION:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.removeAnnotation(requestId, args.getMap(1)));
                }
                break;
            case COMMAND_GET_ALL_UNSAVED_ANNOTATIONS:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    Disposable annotationDisposable = root.getAllUnsavedAnnotations()
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(new Consumer<JSONObject>() {
                                @Override
                                public void accept(JSONObject jsonObject) {
                                    root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, jsonObject));
                                }
                            });
                    annotationDisposables.add(annotationDisposable);
                }
                break;
            case COMMAND_ADD_ANNOTATIONS:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.addAnnotations(requestId, args.getMap(1)));
                }
                break;
            case COMMAND_GET_FORM_FIELD_VALUE:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.getFormFieldValue(requestId, args.getString(1)));
                }
                break;
            case COMMAND_SET_FORM_FIELD_VALUE:
                if (args != null && args.size() == 3) {
                    final int requestId = args.getInt(0);
                    Disposable annotationDisposable = root.setFormFieldValue(args.getString(1), args.getString(2))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(fieldSet ->  {
                            root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, fieldSet));
                        }, throwable -> {
                            root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, throwable));
                        },() -> {
                            // Called when no form field was found.
                            root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, false));
                        });
                    annotationDisposables.add(annotationDisposable);
                }
                break;
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        annotationDisposables.dispose();
    }
}
