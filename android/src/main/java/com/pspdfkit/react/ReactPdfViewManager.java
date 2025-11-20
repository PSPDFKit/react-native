/*
 * ReactPdfViewManager.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2025 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.annotations.configuration.AnnotationConfiguration;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.preferences.PSPDFKitPreferences;
import com.pspdfkit.react.annotations.ReactAnnotationPresetConfiguration;
import com.pspdfkit.react.AnnotationConfigurationAdaptor;
import com.pspdfkit.react.ConfigurationAdapter;
import com.pspdfkit.react.events.PdfViewDataReturnedEvent;
import com.pspdfkit.react.menu.ReactGroupingRule;
import com.pspdfkit.react.common.NutrientPropsAnnotationsHelper;
import com.pspdfkit.react.common.NutrientPropsDocumentHelper;
import com.pspdfkit.react.ToolbarMenuItemsAdapter;
import com.pspdfkit.react.common.NutrientPropsToolbarHelper;
import com.pspdfkit.react.common.NutrientPropsMeasurementConfigurationHelper;
import com.pspdfkit.views.PdfView;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import javax.annotation.Nullable;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.functions.Consumer;
import io.reactivex.rxjava3.schedulers.Schedulers;

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
    public static final int COMMAND_GET_ALL_ANNOTATIONS = 11;
    public static final int COMMAND_REMOVE_ANNOTATION = 10;
    public static final int COMMAND_REMOVE_FRAGMENT = 12;
    public static final int COMMAND_SET_TOOLBAR_MENU_ITEMS = 13;
    public static final int COMMAND_REMOVE_ANNOTATIONS = 14;
    public static final int COMMAND_GET_CONFIGURATION = 18;
    public static final int COMMAND_SET_TOOLBAR = 19;
    public static final int COMMAND_SET_MEASUREMENT_VALUE_CONFIGURATIONS = 21;
    public static final int COMMAND_GET_MEASUREMENT_VALUE_CONFIGURATIONS = 22;
    public static final int COMMAND_IMPORT_XFDF = 23;
    public static final int COMMAND_EXPORT_XFDF = 24;
    public static final int COMMAND_SET_ANNOTATION_FLAGS = 25;
    public static final int COMMAND_GET_ANNOTATION_FLAGS = 26;
    public static final int COMMAND_CLEAR_SELECTED_ANNOTATIONS = 27;
    public static final int COMMAND_SELECT_ANNOTATIONS = 28;
    public static final int COMMAND_SET_PAGE_INDEX = 29;
    public static final int COMMAND_SET_EXCLUDED_ANNOTATIONS = 30;

    private final CompositeDisposable annotationDisposables = new CompositeDisposable();

    private ReactApplicationContext reactApplicationContext;

    @NonNull
    @Override
    public String getName() {
        return "RCTPSPDFKitView";
    }

    @NonNull
    @Override
    protected PdfView createViewInstance(ThemedReactContext reactContext) {
        this.reactApplicationContext = reactContext.getReactApplicationContext();
        Activity currentActivity = reactContext.getCurrentActivity();
        if (currentActivity instanceof FragmentActivity) {
            // Since we require a FragmentManager this only works in FragmentActivities.
            FragmentActivity fragmentActivity = (FragmentActivity) reactContext.getCurrentActivity();
            PdfView pdfView = new PdfView(reactContext, false); // Paper mode
            pdfView.inject(fragmentActivity.getSupportFragmentManager(),
                    UIManagerHelper.getEventDispatcher(reactContext, pdfView.getId()));
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
        Map<String, Integer> commandMap = MapBuilder.of();
        commandMap.put("enterAnnotationCreationMode", COMMAND_ENTER_ANNOTATION_CREATION_MODE);
        commandMap.put("exitCurrentlyActiveMode", COMMAND_EXIT_CURRENTLY_ACTIVE_MODE);
        commandMap.put("saveCurrentDocument", COMMAND_SAVE_CURRENT_DOCUMENT);
        commandMap.put("getAnnotations", COMMAND_GET_ANNOTATIONS);
        commandMap.put("addAnnotation", COMMAND_ADD_ANNOTATION);
        commandMap.put("getAllUnsavedAnnotations", COMMAND_GET_ALL_UNSAVED_ANNOTATIONS);
        commandMap.put("addAnnotations", COMMAND_ADD_ANNOTATIONS);
        commandMap.put("getFormFieldValue", COMMAND_GET_FORM_FIELD_VALUE);
        commandMap.put("setFormFieldValue", COMMAND_SET_FORM_FIELD_VALUE);
        commandMap.put("removeAnnotation", COMMAND_REMOVE_ANNOTATION);
        commandMap.put("removeAnnotations", COMMAND_REMOVE_ANNOTATIONS);
        commandMap.put("getAllAnnotations", COMMAND_GET_ALL_ANNOTATIONS);
        commandMap.put("removeFragment", COMMAND_REMOVE_FRAGMENT);
        commandMap.put("setToolbarMenuItems", COMMAND_SET_TOOLBAR_MENU_ITEMS);
        commandMap.put("setMeasurementValueConfigurations", COMMAND_SET_MEASUREMENT_VALUE_CONFIGURATIONS);
        commandMap.put("getMeasurementValueConfigurations", COMMAND_GET_MEASUREMENT_VALUE_CONFIGURATIONS);
        commandMap.put("getConfiguration", COMMAND_GET_CONFIGURATION);
        commandMap.put("setToolbar", COMMAND_SET_TOOLBAR);
        commandMap.put("importXFDF", COMMAND_IMPORT_XFDF);
        commandMap.put("exportXFDF", COMMAND_EXPORT_XFDF);
        commandMap.put("setAnnotationFlags", COMMAND_SET_ANNOTATION_FLAGS);
        commandMap.put("getAnnotationFlags", COMMAND_GET_ANNOTATION_FLAGS);
        commandMap.put("clearSelectedAnnotations", COMMAND_CLEAR_SELECTED_ANNOTATIONS);
        commandMap.put("selectAnnotations", COMMAND_SELECT_ANNOTATIONS);
        commandMap.put("setPageIndex", COMMAND_SET_PAGE_INDEX);
        commandMap.put("setExcludedAnnotations", COMMAND_SET_EXCLUDED_ANNOTATIONS);
        return commandMap;
    }

    @ReactProp(name = "documentAndConfiguration")
    public void setDocumentAndConfiguration(PdfView view, @Nullable ReadableMap documentAndConfiguration) {
       if (documentAndConfiguration == null) return;
       
       // Process configuration first
       if (documentAndConfiguration.hasKey("configuration") && !documentAndConfiguration.isNull("configuration")) {
           ReadableMap configuration = documentAndConfiguration.getMap("configuration");
           setConfiguration(view, configuration);
       }
       
       // Then load document
       if (documentAndConfiguration.hasKey("document") && !documentAndConfiguration.isNull("document")) {
           String document = documentAndConfiguration.getString("document");
           // Always set the document, even if it's the same path, to ensure it loads
           view.setDocument(document, this.reactApplicationContext, null);
       }
   }

    @ReactProp(name = "fragmentTag")
    public void setFragmentTag(PdfView view, @NonNull String fragmentTag) {
        view.setFragmentTag(fragmentTag);
    }

    // Helper method for setDocumentAndConfiguration (not @ReactProp method)
    private void setConfiguration(PdfView view, @NonNull ReadableMap configuration) {
        ConfigurationAdapter configurationAdapter = new ConfigurationAdapter(view.getContext(), configuration);
        PdfActivityConfiguration configurationBuild = configurationAdapter.build();
        view.setInitialConfiguration(configurationBuild);
        // If there are pending toolbar items, we need to apply them.
        if (view.getPendingToolbarItems() != null) {
            ToolbarMenuItemsAdapter newConfigurations = new ToolbarMenuItemsAdapter(configurationBuild, view.getPendingToolbarItems(), view.getInitialConfiguration());
            view.setConfiguration(newConfigurations.build());
        } else {
            view.setConfiguration(configurationBuild);
        }
        view.setDocumentPassword(configuration.getString("documentPassword"));
        view.setRemoteDocumentConfiguration(configuration.getMap("remoteDocumentConfiguration"));
        // Although MeasurementValueConfigurations is specified as part of Configuration, it is configured separately on the Android SDK
        if (configuration.getArray("measurementValueConfigurations") != null) {
            NutrientPropsMeasurementConfigurationHelper.setMeasurementValueConfigurations(view, configuration.getArray("measurementValueConfigurations"));
        }
        if (configuration.getMap("aiAssistantConfiguration") != null) {
            view.setAIAConfiguration(configuration.getMap("aiAssistantConfiguration"));
        }
        if (configuration.hasKey("androidRemoveStatusBarOffset")) {
            view.setIsStatusBarHidden(configuration.getBoolean("androidRemoveStatusBarOffset"));
        }
    }

    @ReactProp(name = "annotationPresets")
    public void setAnnotationPresets(PdfView view, @NonNull ReadableMap annotationPresets) {
        List<ReactAnnotationPresetConfiguration> annotationsConfiguration = AnnotationConfigurationAdaptor.convertAnnotationConfigurations(
                view.getContext(), annotationPresets
        );
        view.setAnnotationConfiguration(annotationsConfiguration);
    }

    @ReactProp(name = "pageIndex")
    public void setPageIndex(PdfView view, int pageIndex) {
        view.setPageIndex(pageIndex);
    }

    @ReactProp(name = "toolbar")
    public void setToolbar(@NonNull final PdfView view, @NonNull ReadableMap toolbar) {
        NutrientPropsToolbarHelper.applyToolbar(view, toolbar);
    }

    @ReactProp(name = "menuItemGrouping")
    public void setMenuItemGrouping(PdfView view, @NonNull ReadableArray menuItemGrouping) {
        ReactGroupingRule groupingRule = new ReactGroupingRule(view.getContext(), menuItemGrouping);
        view.setMenuItemGroupingRule(groupingRule);
    }

    @ReactProp(name = "toolbarMenuItems")
    public void setToolbarMenuItems(@NonNull final PdfView view, @Nullable final ReadableArray toolbarItems) {
        if (toolbarItems != null) {
            PdfActivityConfiguration currentConfiguration = view.getConfiguration();
            ToolbarMenuItemsAdapter newConfigurations = new ToolbarMenuItemsAdapter(currentConfiguration, toolbarItems, view.getInitialConfiguration());
            // If the initial config is null, it means that the user-provided config has not been applied yet, so we set toolbar items as pending.
            if (view.getInitialConfiguration() == null) {
                view.setPendingToolbarItems(toolbarItems);
            } else {
                view.setConfiguration(newConfigurations.build());
            }
        }
    }

    @ReactProp(name = "annotationContextualMenu")
    public void setAnnotationContextualMenu(@NonNull final PdfView view, @NonNull ReadableMap annotationContextualMenuItems) {
        NutrientPropsAnnotationsHelper.applyAnnotationContextualMenu(view, annotationContextualMenuItems);
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

    @ReactProp(name = "imageSaveMode")
    public void setImageSaveMode(PdfView view, String imageSaveMode) {
        view.setImageSaveMode(imageSaveMode);
    }

    @ReactProp(name = "showNavigationButtonInToolbar")
    public void setShowNavigationButtonInToolbar(@NonNull final PdfView view, final boolean showNavigationButtonInToolbar) {
        NutrientPropsDocumentHelper.applyShowNavigationButtonInToolbar(view, showNavigationButtonInToolbar);
    }

    @ReactProp(name= "hideDefaultToolbar")
    public void setHideDefaultToolbar(@NonNull final PdfView view, final boolean hideDefaultToolbar) {
        NutrientPropsDocumentHelper.applyHideDefaultToolbar(view, hideDefaultToolbar);
    }

    @ReactProp(name = "availableFontNames")
    public void setAvailableFontNames(@NonNull final PdfView view, @Nullable final ReadableArray availableFontNames) {
        NutrientPropsDocumentHelper.applyAvailableFontNames(view, availableFontNames);
    }

    @ReactProp(name = "selectedFontName")
    public void setSelectedFontName(@NonNull final PdfView view, @Nullable final String selectedFontName) {
        NutrientPropsDocumentHelper.applySelectedFontName(view, selectedFontName);
    }

    @ReactProp(name = "measurementValueConfigurations")
    public void setMeasurementValueConfigurations(@NonNull final PdfView view, @Nullable final ReadableArray measurementValueConfigs) {
        NutrientPropsMeasurementConfigurationHelper.setMeasurementValueConfigurations(view, measurementValueConfigs);
    }

    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return PdfView.createDefaultEventRegistrationMap();
    }

    @Override
    public void receiveCommand(@NonNull final PdfView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    if (args.size() == 2) {
                        final String annotationType = args.getString(1);
                        root.enterAnnotationCreationMode(annotationType,
                                () -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, true)),
                                (Consumer<Throwable>) throwable -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, throwable))
                        );
                    } else {
                        root.enterAnnotationCreationMode(null,
                                () -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, true)),
                                (Consumer<Throwable>) throwable -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, throwable))
                        );
                    }
                }
                break;
            case COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    root.exitCurrentlyActiveMode(
                            () -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, true)),
                            (Consumer<Throwable>) throwable -> root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, throwable))
                    );
                }
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
            case COMMAND_REMOVE_ANNOTATIONS:
                if(args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    final ReadableArray annotations = args.getArray(1);
                    final int length = annotations.size();
                    for (int i = 0; i < length; i++) {
                        ReadableMap annotation = annotations.getMap(i);
                        annotationDisposables.add(root.removeAnnotation(requestId, annotation));
                    }
                }
                break;
            case COMMAND_GET_ALL_UNSAVED_ANNOTATIONS:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    Disposable annotationDisposable = root.getAllUnsavedAnnotations()
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(jsonObject -> root.getEventDispatcher()
                                    .dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, jsonObject)));
                    annotationDisposables.add(annotationDisposable);
                }
                break;
            case COMMAND_ADD_ANNOTATIONS:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.addAnnotations(requestId, args.getMap(1)));
                }
                break;
            case COMMAND_SET_ANNOTATION_FLAGS:
                if (args != null && args.size() == 3) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.setAnnotationFlags(requestId, args.getString(1), args.getArray(2)));
                }
                break;
            case COMMAND_GET_ANNOTATION_FLAGS:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    annotationDisposables.add(root.getAnnotationFlags(requestId, args.getString(1)));
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
            case COMMAND_REMOVE_FRAGMENT:
                // Removing a fragment like this is not recommended, but it can be used as a workaround
                // to stop `react-native-screens` from crashing the App when the back button is pressed.
                root.removeFragment(true);
                break;
            case COMMAND_SET_TOOLBAR_MENU_ITEMS:
                if (args != null && args.size() == 1) {
                    setToolbarMenuItems(root,args.getArray(0));
                }
                break;
            case COMMAND_SET_MEASUREMENT_VALUE_CONFIGURATIONS:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    NutrientPropsMeasurementConfigurationHelper.setMeasurementValueConfigurations(root, args.getArray(1));
                    root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, true));
                }
                break;
            case COMMAND_GET_MEASUREMENT_VALUE_CONFIGURATIONS:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    try {
                        JSONObject result = NutrientPropsMeasurementConfigurationHelper.getMeasurementValueConfigurations(root);
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, result));
                    } catch (Exception e) {
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, e));
                    }
                }
                break;
            case COMMAND_GET_CONFIGURATION:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    try {
                        JSONObject result = root.convertConfiguration();
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, result));
                    } catch (Exception e) {
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, e));
                    }
                }
                break;
            case COMMAND_SET_TOOLBAR:
                if (args != null && args.size() == 1) {
                    setToolbar(root,args.getMap(0));
                }
                break;
            case COMMAND_IMPORT_XFDF:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    root.importXFDF(requestId, args.getString(1));
                }
                break;
            case COMMAND_EXPORT_XFDF:
                if (args != null && args.size() == 2) {
                    final int requestId = args.getInt(0);
                    root.exportXFDF(requestId, args.getString(1));
                }
                break;
            case COMMAND_CLEAR_SELECTED_ANNOTATIONS:
                if (args != null) {
                    final int requestId = args.getInt(0);
                    try {
                        root.clearSelectedAnnotations();
                        JSONObject result = new JSONObject();
                        result.put("success", true);
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, result));
                    } catch (Exception e) {
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, e));
                    }
                }
                break;
            case COMMAND_SELECT_ANNOTATIONS:
                if (args != null && args.size() == 3) {
                    final int requestId = args.getInt(0);
                    try {
                        root.selectAnnotations(requestId, args.getArray(1), args.getBoolean(2));
                    } catch (Exception e) {
                        root.getEventDispatcher().dispatchEvent(new PdfViewDataReturnedEvent(root.getId(), requestId, e));
                    }
                }
                break;
            case COMMAND_SET_PAGE_INDEX:
                if (args != null && args.size() == 1) {
                    try {
                        root.setPageIndex(args.getInt(0));
                    } catch (Exception ignored) {}
                }
                break;
            case COMMAND_SET_EXCLUDED_ANNOTATIONS:
                if (args != null && args.size() == 1) {
                    root.setExcludedAnnotations(args.getArray(0));
                }
                break;
        }
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }
}