/*
 * PdfView.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views;

import static com.pspdfkit.configuration.signatures.SignatureSavingStrategy.*;
import static com.pspdfkit.react.helper.ConversionHelpers.getAnnotationTypes;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Handler;
import android.util.AttributeSet;
import android.util.Log;
import android.util.Pair;
import android.view.Choreographer;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.Promise;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.Event;
import com.pspdfkit.LicenseFeature;
import com.pspdfkit.PSPDFKit;
import com.pspdfkit.ai.AiAssistantHelpersKt;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.annotations.AnnotationFlags;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.annotations.configuration.FreeTextAnnotationConfiguration;
import com.pspdfkit.configuration.PdfConfiguration;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.search.SearchType;
import com.pspdfkit.annotations.LinkAnnotation;
import com.pspdfkit.annotations.actions.Action;
import com.pspdfkit.configuration.sharing.ShareFeatures;

import java.util.EnumSet;
import com.pspdfkit.document.DocumentSource;
import com.pspdfkit.document.ImageDocumentLoader;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.formatters.DocumentJsonFormatter;
import com.pspdfkit.document.formatters.XfdfFormatter;
import com.pspdfkit.document.providers.ContentResolverDataProvider;
import com.pspdfkit.document.providers.DataProvider;
import com.pspdfkit.exceptions.InvalidPasswordException;
import com.pspdfkit.forms.ChoiceFormElement;
import com.pspdfkit.forms.ComboBoxFormElement;
import com.pspdfkit.forms.EditableButtonFormElement;
import com.pspdfkit.forms.FormField;
import com.pspdfkit.forms.SignatureFormElement;
import com.pspdfkit.forms.TextFormElement;
import com.pspdfkit.listeners.OnVisibilityChangedListener;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.react.NutrientNotificationCenter;
import com.pspdfkit.react.PDFDocumentModule;
import com.pspdfkit.react.R;
import com.pspdfkit.react.annotations.ReactAnnotationPresetConfiguration;
import com.pspdfkit.react.events.CustomAnnotationContextualMenuItemTappedEvent;
import com.pspdfkit.react.events.CustomTextSelectionContextualMenuItemTappedEvent;
import com.pspdfkit.react.events.OnReadyEvent;
import com.pspdfkit.react.events.PdfViewAnnotationChangedEvent;
import com.pspdfkit.react.ConfigurationAdapter;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDataReturnedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSaveFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.react.events.PdfViewShouldShowSignaturePadEvent;
import com.pspdfkit.react.events.PdfViewNavigationButtonClickedEvent;
import com.pspdfkit.react.events.CustomToolbarButtonTappedEvent;
import com.pspdfkit.react.events.PdfViewStateChangedEvent;
import com.pspdfkit.react.helper.ConversionHelpers;
import com.pspdfkit.react.helper.DocumentJsonDataProvider;
import com.pspdfkit.react.helper.MeasurementsHelper;
import com.pspdfkit.react.helper.RemoteDocumentDownloader;
import com.pspdfkit.react.menu.NutrientAnnotationPopupMenuBridge;
import com.pspdfkit.react.menu.NutrientPopupMenuBridge;
import com.pspdfkit.react.menu.NutrientTextSelectionPopupMenuBridge;
import com.pspdfkit.signatures.Signature;
import com.pspdfkit.signatures.listeners.OnSignaturePickedListener;
import com.pspdfkit.signatures.storage.DatabaseSignatureStorage;
import com.pspdfkit.signatures.storage.SignatureStorage;
import com.pspdfkit.ui.signatures.ElectronicSignatureFragment;
import com.pspdfkit.react.helper.PSPDFKitUtils;
import com.pspdfkit.react.helper.SignatureHelper;
import com.pspdfkit.ui.DocumentDescriptor;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.utils.Size;
import com.pspdfkit.ui.PdfUiFragment;
import com.pspdfkit.ui.PdfUiFragmentBuilder;
import com.pspdfkit.ui.fonts.Font;
import com.pspdfkit.ui.fonts.FontManager;
import com.pspdfkit.ui.search.PdfSearchView;
import com.pspdfkit.ui.search.PdfSearchViewInline;
import com.pspdfkit.ui.special_mode.controller.AnnotationTool;
import com.pspdfkit.ui.toolbar.grouping.MenuItemGroupingRule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;


import io.nutrient.data.models.AiAssistantConfiguration;
import io.nutrient.data.models.DocumentIdentifiers;
import io.nutrient.domain.ai.AiAssistant;
import io.nutrient.domain.ai.AiAssistantKt;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.Maybe;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.functions.Consumer;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import io.reactivex.rxjava3.subjects.BehaviorSubject;
import kotlin.Unit;
import com.pspdfkit.react.SessionStorage;

/**
 * This view displays a {@link com.pspdfkit.ui.PdfFragment} and all associated toolbars.
 */
@SuppressLint("pspdfkit-experimental")
public class PdfView extends FrameLayout {

    private static final String FILE_SCHEME = "file:///";
    
    // Delegate interface for event forwarding
    public interface PdfViewDelegate {
        void onDocumentLoaded();
        void onStateChanged(StateChangedEvent event);
        void onCustomToolbarButtonTapped(String buttonId, String id);
        void onCustomAnnotationContextualMenuItemTapped(String id);
        void onCustomTextSelectionContextualMenuItemTapped(String id);
        void onNavigationButtonClicked();
        void onCloseButtonPressed();
        void onDocumentLoadFailed(Throwable throwable);
        void onDocumentSaved();
        void onDocumentSaveFailed(String error);
        void onReady();
        void onAnnotationTapped(Annotation annotation);
        void onAnnotationsChanged(String eventType, Annotation annotation);
        void onShouldExecuteAction(String requestId, Action action, int pageIndex, @Nullable String url);
        void onShouldShowSignaturePad(String requestId, @Nullable String fullyQualifiedName, int pageIndex);
    }

    // Event data structure for state changes
    public static class StateChangedEvent {
        public boolean documentLoaded;
        public int currentPageIndex;
        public int pageCount;
        public boolean annotationCreationActive;
        public int affectedPageIndex;
        public boolean annotationEditingActive;
        public boolean textSelectionActive;
        public boolean formEditingActive;
    }

    /** Key to use when setting the id argument of PdfFragments created by this PdfView. */
    private static final String ARG_ROOT_ID = "root_id";
    private static final String TAG = "PdfView";

    private FragmentManager fragmentManager;
    private EventDispatcher eventDispatcher;
    private String fragmentTag;
    private PdfActivityConfiguration configuration;
    private Disposable documentOpeningDisposable;
    private PdfDocument document;
    private String documentPath;
    private String documentPassword;
    private ReadableMap remoteDocumentConfiguration;
    private ReadableMap aiaConfiguration;
    private int pageIndex = 0;
    private PdfActivityConfiguration initialConfiguration;
    private ReadableArray pendingToolbarItems;

    private boolean isActive = true;

    private PdfViewModeController pdfViewModeController;
    private PdfViewDocumentListener pdfViewDocumentListener;
    @Nullable
    private SimpleDocumentListener fragmentDocumentLoadedListener;
    private MenuItemListener menuItemListener;
    private ToolbarMenuItemListener toolbarMenuItemListener;

    @NonNull
    private CompositeDisposable pendingFragmentActions = new CompositeDisposable();

    @Nullable
    private PdfUiFragment fragment;

    /** We wrap the fragment in a list so we can have a state that encapsulates no element being set. */
    @NonNull
    private final BehaviorSubject<List<PdfUiFragment>> pdfUiFragmentGetter = BehaviorSubject.createDefault(Collections.emptyList());

    /** An internal id we generate so we can track if fragments found belong to this specific PdfView instance. */
    private int internalId;

    /** Runnable to execute fragment transactions on the main thread */
    private Runnable fragmentTransactionRunnable;

    /** We keep track if the navigation button should be shown so we can show it when the inline search view is closed. */
    private boolean isNavigationButtonShown = false;
    /** We keep track if the inline search view is shown since we don't want to add a second navigation button while it is shown. */
    private boolean isSearchViewShown = false;

    private boolean isDefaultToolbarHidden = false;

    private boolean isStatusBarHidden = false;

    /** Indicates whether the image document annotations should be flattened only or flattened and embedded. */
    private String imageSaveMode = "flatten";

    /** Disposable keeping track of our subscription to update the annotation configuration on each emitted PdfFragment. */
    @Nullable
    private Disposable updateAnnotationConfigurationDisposable;

    /** The currently configured array of available font names for free text annotations. */
    @Nullable
    private ReadableArray availableFontNames;

    /** The currently configured default font name for free text annotations. */
    @Nullable
    private String selectedFontName;

    @Nullable
    private List<ReactAnnotationPresetConfiguration> annotationsConfigurations;

    @Nullable
    private ReadableArray measurementValueConfigurations;

    @Nullable
    private String toolbarPosition;

    @Nullable
    private ReadableArray supportedToolbarPositions;
    
    @Nullable
    private List<String> supportedToolbarPositionsList;

    /**
     * Parsed {@code textSelectionContextualMenu} for {@link OnPreparePopupToolbarListener} (Android popup toolbar).
     */
    @Nullable
    private NutrientTextSelectionPopupMenuBridge.Config textSelectionPopupMenuConfig;

    /**
     * Parsed {@code annotationContextualMenu} for {@link OnPreparePopupToolbarListener} (Android annotation popup toolbar).
     */
    @Nullable
    private NutrientAnnotationPopupMenuBridge.Config annotationPopupMenuConfig;

    private ReactApplicationContext reactApplicationContext;
    // Reference passed from Fabric (nativeID-based). Null in Paper mode.
    @Nullable
    private Integer componentReferenceId = null;
    
    // Delegate for event forwarding
    private PdfViewDelegate delegate;
    private final boolean isFabricMode;

    // Pending PDF actions intercepted for shouldExecuteAction handling
    private final java.util.Map<String, Action> pendingActions = new java.util.HashMap<>();
    private final java.util.Map<String, Integer> pendingActionPageIndices = new java.util.HashMap<>();
    private boolean suppressShouldExecuteAction = false;
    private boolean hasShouldExecuteAction = false;
    private final java.util.Map<String, SignatureFormElement> pendingSignatureForms = new java.util.HashMap<>();
    private boolean hasShouldShowSignaturePad = false;

    public PdfView(@NonNull Context context) {
        this(context, false);
    }

    public PdfView(@NonNull Context context, boolean isFabricMode) {
        super(context);
        this.isFabricMode = isFabricMode;
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, false);
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, boolean isFabricMode) {
        super(context, attrs);
        this.isFabricMode = isFabricMode;
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        this(context, attrs, defStyleAttr, false);
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, boolean isFabricMode) {
        super(context, attrs, defStyleAttr);
        this.isFabricMode = isFabricMode;
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        this(context, attrs, defStyleAttr, defStyleRes, false);
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes, boolean isFabricMode) {
        super(context, attrs, defStyleAttr, defStyleRes);
        this.isFabricMode = isFabricMode;
        init();
    }

    private void init() {
        pdfViewModeController = new PdfViewModeController(this);

        Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
            @Override
            public void doFrame(long frameTimeNanos) {
                manuallyLayoutChildren();
                getViewTreeObserver().dispatchOnGlobalLayout();
                if (isActive) {
                    Choreographer.getInstance().postFrameCallback(this);
                }
            }
        });

        // Set a default configuration. Immersive should be disabled for React Native.
        // We keep the default text selection popup menu here; at this point no React
        // props (such as textSelectionContextualMenu) have been applied yet.
        configuration = new PdfActivityConfiguration.Builder(getContext())
                .immersiveModeEnabled(false)
                .build();

        // Generate an id to set on all fragments created by the PdfView.
        internalId = View.generateViewId();

        ViewCompat.setOnApplyWindowInsetsListener(this, new androidx.core.view.OnApplyWindowInsetsListener() {
            @NonNull
            @Override
            public WindowInsetsCompat onApplyWindowInsets(@NonNull View v, @NonNull WindowInsetsCompat windowInsets) {
                if (isStatusBarHidden) {
                    Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
                    ViewGroup.LayoutParams layoutParams = v.getLayoutParams();
                    if (layoutParams instanceof MarginLayoutParams marginParams) {
                        marginParams.leftMargin = insets.left;
                        marginParams.topMargin = insets.top;
                        marginParams.rightMargin = insets.right;
                        marginParams.bottomMargin = insets.bottom;
                        v.setLayoutParams(marginParams);
                    }
                    return WindowInsetsCompat.CONSUMED;
                } else {
                    return windowInsets;
                }
            }
        });
    }

    // Expose Fabric mode and component reference to other classes
    public boolean isFabricMode() {
        return isFabricMode;
    }

    // Internal flag accessor used by PdfViewDocumentListener to avoid re-entrancy
    boolean isSuppressedShouldExecuteAction() {
        return suppressShouldExecuteAction;
    }

    boolean hasShouldExecuteAction() {
        return hasShouldExecuteAction;
    }

    boolean hasShouldShowSignaturePad() {
        return hasShouldShowSignaturePad;
    }

    @Nullable
    public Integer getComponentReferenceId() {
        return componentReferenceId;
    }

    public void inject(FragmentManager fragmentManager, EventDispatcher eventDispatcher) {
        this.fragmentManager = fragmentManager;
        this.eventDispatcher = eventDispatcher;
        pdfViewDocumentListener = new PdfViewDocumentListener(this,
            eventDispatcher, isFabricMode, delegate);
        menuItemListener = new MenuItemListener(this, eventDispatcher, getContext());
        toolbarMenuItemListener = new ToolbarMenuItemListener(this, eventDispatcher, getContext(), isFabricMode, delegate);
    }

    /**
     * Replaces the {@link EventDispatcher} used by Fabric/paper listeners after the view has a valid
     * React tag (Fabric assigns the tag after {@code createViewInstance}; initial {@code inject} may
     * have used {@link android.view.View#NO_ID}).
     */
    public void replaceEventDispatcher(@NonNull EventDispatcher newDispatcher) {
        this.eventDispatcher = newDispatcher;
        if (pdfViewDocumentListener != null) {
            pdfViewDocumentListener.setEventDispatcher(newDispatcher);
        }
        if (menuItemListener != null) {
            menuItemListener.setEventDispatcher(newDispatcher);
        }
        if (toolbarMenuItemListener != null) {
            toolbarMenuItemListener.setEventDispatcher(newDispatcher);
        }
    }
    
    public void setDelegate(PdfViewDelegate delegate) {
        this.delegate = delegate;
    }

    public void setFragmentTag(String fragmentTag) {
        this.fragmentTag = fragmentTag;
    }

    public void setInitialConfiguration(PdfActivityConfiguration configuration) {
        this.initialConfiguration = configuration;
    }

    public PdfActivityConfiguration getInitialConfiguration() {
        return this.initialConfiguration;
    }

    public void setPendingToolbarItems(ReadableArray toolbarItems) {
        this.pendingToolbarItems = toolbarItems;
    }

    public ReadableArray getPendingToolbarItems() {
        return this.pendingToolbarItems;
    }

    public void setConfiguration(PdfActivityConfiguration configuration) {
        this.configuration = configuration;
        if (fragment != null) {
            fragment.setConfiguration(configuration);
        }
        setShowNavigationButtonInToolbar(this.isNavigationButtonShown);
        setHideDefaultToolbar(this.isDefaultToolbarHidden);
    }

    public PdfActivityConfiguration getConfiguration() {
        return configuration;
    }

    public void setAllToolbarItems(final ArrayList stockToolbarItems, final ArrayList customToolbarItems) {
        pendingFragmentActions.add(getCurrentPdfUiFragment()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(pdfUiFragment -> {
                        ((ReactPdfUiFragment) pdfUiFragment).setCustomToolbarItems(stockToolbarItems, customToolbarItems, menuItemListener);
                        pdfUiFragment.invalidateMenu();
        }));
    }

    public void setAnnotationConfiguration(final List<ReactAnnotationPresetConfiguration> annotationsConfigurations) {
        this.annotationsConfigurations = annotationsConfigurations;
    }

    public void setDocumentPassword(@Nullable String documentPassword) {
        this.documentPassword = documentPassword;
    }

    public void setRemoteDocumentConfiguration(@Nullable ReadableMap remoteDocumentConfig) {
        this.remoteDocumentConfiguration = remoteDocumentConfig;
    }

    public void setAIAConfiguration(@Nullable ReadableMap aiaConfiguration) {
        this.aiaConfiguration = aiaConfiguration;
    }

    public void setDocument(@Nullable String documentPath, ReactApplicationContext reactApplicationContext, @Nullable Integer reference) {
        if (documentPath == null) {
            this.document = null;
            removeFragment(false);
            return;
        }

        this.reactApplicationContext = reactApplicationContext;
        // Re-activate the view for this load. A prior removeFragment(true) (e.g. the
        // COMMAND_REMOVE_FRAGMENT workaround) leaves isActive false; without resetting it here the
        // load callbacks below would be gated off and the reloaded document would never appear.
        isActive = true;
        // Store component reference for Fabric mode if provided
        if (reference != null) {
            this.componentReferenceId = reference;
        }

        if (Uri.parse(documentPath).getScheme() == null) {
            // If there is no scheme it might be a raw path.
            try {
                File file = new File(documentPath);
                documentPath = Uri.fromFile(file).toString();
            } catch (Exception e) {
                documentPath = FILE_SCHEME + document;
            }
        }
        if (documentOpeningDisposable != null) {
            documentOpeningDisposable.dispose();
        }
        this.documentPath = documentPath;

        if (Uri.parse(documentPath).getScheme().toLowerCase(Locale.getDefault()).contains("http")) {
            String outputFilePath = this.remoteDocumentConfiguration != null &&
                    this.remoteDocumentConfiguration.hasKey("outputFilePath") ?
                    this.remoteDocumentConfiguration.getString("outputFilePath") : null;

            // If no output file was specified, the temporary file location should always be overwritten
            Boolean overwriteExisting = this.remoteDocumentConfiguration != null &&
                    this.remoteDocumentConfiguration.hasKey("overwriteExisting") ?
                    this.remoteDocumentConfiguration.getBoolean("overwriteExisting") : (outputFilePath == null ? true : false);

            RemoteDocumentDownloader downloader = new RemoteDocumentDownloader(documentPath, outputFilePath, overwriteExisting, getContext(), fragmentManager);
            downloader.startDownload((fileLocation, error) -> {
                // The download is not tracked by documentOpeningDisposable, so a teardown while it
                // is in flight cannot cancel it. Bail out if the view was torn down meanwhile,
                // otherwise this would start a new open and re-attach a fragment after teardown.
                if (!isActive) {
                    return Unit.INSTANCE;
                }
                if (error != null) {
                    // Download failed: forward to delegate and JS, then reset fragment
                    PdfView.this.document = null;
                    setupFragment(true);
                    return Unit.INSTANCE;
                }

                if (fileLocation != null) {
                    documentOpeningDisposable = PdfDocumentLoader.openDocumentAsync(getContext(), Uri.fromFile(fileLocation), documentPassword)
                            .subscribeOn(Schedulers.io())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(pdfDocument -> {
                                if (!isActive) {
                                    return;
                                }
                                PdfView.this.document = pdfDocument;
                                reactApplicationContext.getNativeModule(PDFDocumentModule.class).setDocument(pdfDocument, null, reference != null ? reference : this.getId(), PdfView.this);
                                reactApplicationContext.getNativeModule(PDFDocumentModule.class).updateDocumentConfiguration("imageSaveMode", imageSaveMode, reference != null ? reference : this.getId());
                                setupFragment(false);
                            }, throwable -> {
                                if (!isActive) {
                                    return;
                                }
                                if (throwable instanceof  InvalidPasswordException) {
                                    if (delegate != null) {
                                        delegate.onDocumentLoadFailed(throwable);
                                    }
                                    if (!isFabricMode) {
                                        dispatchEvent(new PdfViewDocumentLoadFailedEvent(getId(), throwable.getMessage()));
                                    }
                                } else {
                                    PdfView.this.document = null;
                                }
                                setupFragment(true);
                            });
                }
                return Unit.INSTANCE;
            });
        } else {
            if (PSPDFKitUtils.isValidImage(documentPath)) {
                documentOpeningDisposable = ImageDocumentLoader.openDocumentAsync(getContext(), new DocumentSource(Uri.parse(documentPath)))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(imageDocument -> {
                            if (!isActive) {
                                return;
                            }
                            PdfView.this.document = imageDocument.getDocument();
                            reactApplicationContext.getNativeModule(PDFDocumentModule.class).setDocument(imageDocument.getDocument(), imageDocument, reference != null ? reference : this.getId(), PdfView.this);
                            reactApplicationContext.getNativeModule(PDFDocumentModule.class).updateDocumentConfiguration("imageSaveMode", imageSaveMode, reference != null ? reference : this.getId());
                            setupFragment(false);
                        }, throwable -> {
                            if (!isActive) {
                                return;
                            }
                            PdfView.this.document = null;
                            if (throwable instanceof  InvalidPasswordException) {
                                if (delegate != null) {
                                    delegate.onDocumentLoadFailed(throwable);
                                }
                                if (!isFabricMode) {
                                    dispatchEvent(new PdfViewDocumentLoadFailedEvent(getId(), throwable.getMessage()));
                                }
                            }
                            setupFragment(false);
                        });
            } else {
                documentOpeningDisposable = PdfDocumentLoader.openDocumentAsync(getContext(), Uri.parse(documentPath), documentPassword)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(pdfDocument -> {
                            if (!isActive) {
                                return;
                            }
                            PdfView.this.document = pdfDocument;
                            reactApplicationContext.getNativeModule(PDFDocumentModule.class).setDocument(pdfDocument, null, reference != null ? reference : this.getId(), PdfView.this);
                            reactApplicationContext.getNativeModule(PDFDocumentModule.class).updateDocumentConfiguration("imageSaveMode", imageSaveMode, reference != null ? reference : this.getId());
                            setupFragment(false);
                        }, throwable -> {
                            if (!isActive) {
                                return;
                            }
                            if (throwable instanceof  InvalidPasswordException) {
                                if (delegate != null) {
                                    delegate.onDocumentLoadFailed(throwable);
                                }
                                if (!isFabricMode) {
                                    dispatchEvent(new PdfViewDocumentLoadFailedEvent(getId(), throwable.getMessage()));
                                }
                            } else {
                                PdfView.this.document = null;
                            }
                            setupFragment(true);
                        });
                }
        }
    }

    @SuppressLint("CheckResult")
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
        getCurrentPdfFragment()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(fragment -> {
                    if (fragment != null) {
                        try {
                            fragment.setPageIndex(pageIndex);
                        } catch (Exception e) {
                            // Invalid page index
                        }
                    }
                });
    }

    public void setExcludedAnnotations(ReadableArray annotations) {
        pdfViewDocumentListener.setExcludedAnnotations(annotations);
    }

    public void setUserInterfaceVisible(boolean visible) {
        pendingFragmentActions.add(getCurrentPdfUiFragment()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(pdfUiFragment -> {
                    pdfUiFragment.setUserInterfaceVisible(visible, true);
                }));
    }

    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        pdfViewDocumentListener.setDisableDefaultActionForTappedAnnotations(disableDefaultActionForTappedAnnotations);
    }

    public void setHasShouldExecuteAction(boolean hasShouldExecuteAction) {
        this.hasShouldExecuteAction = hasShouldExecuteAction;
    }

    public void setHasShouldShowSignaturePad(boolean hasShouldShowSignaturePad) {
        this.hasShouldShowSignaturePad = hasShouldShowSignaturePad;
    }

    public void setDisableAutomaticSaving(boolean disableAutomaticSaving) {
        pdfViewDocumentListener.setDisableAutomaticSaving(disableAutomaticSaving);
    }

    /**
     * Sets the menu item grouping rule that will be used for the annotation creation toolbar.
     */
    public void setMenuItemGroupingRule(@NonNull MenuItemGroupingRule groupingRule) {
        pdfViewModeController.setMenuItemGroupingRule(groupingRule);
    }

    /**
     * Sets whether the stylus button should be shown on the annotation creation toolbar.
     */
    public void setShowStylusButton(boolean showStylusButton) {
        pdfViewModeController.setShowStylusButton(showStylusButton);
    }

    /**
     * Returns whether the stylus button should be shown on the annotation creation toolbar.
     */
    public boolean getShowStylusButton() {
        return pdfViewModeController.getShowStylusButton();
    }

    public void setAvailableFontNames(@Nullable final ReadableArray availableFontNames) {
        this.availableFontNames = availableFontNames;
        if (fragment != null && fragment.isAdded()) {
            updateAnnotationConfiguration();
        }
    }

    public void setSelectedFontName(@Nullable final String selectedFontName) {
        this.selectedFontName = selectedFontName;
        if (fragment != null && fragment.isAdded()) {
            updateAnnotationConfiguration();
        }
    }

    private void updateAnnotationConfiguration() {
        if (updateAnnotationConfigurationDisposable != null) {
            updateAnnotationConfigurationDisposable.dispose();
        }

        // First we create the new FreeTextAnnotationConfiguration.
        FreeTextAnnotationConfiguration.Builder builder = FreeTextAnnotationConfiguration.builder(getContext());
        FontManager systemFontManager = PSPDFKit.getSystemFontManager();
        if (availableFontNames != null) {
            // Custom list of available fonts is set.
            final ArrayList<Font> availableFonts  = new ArrayList<>();
            for (int i = 0; i < availableFontNames.size(); i++) {
                final String fontName = availableFontNames.getString(i);
                final Font font = systemFontManager.getFontByName(fontName);
                if (font != null) {
                    availableFonts.add(font);
                } else {
                    Log.w(TAG, String.format("Failed to add font %s to list of available fonts since it wasn't found in the list of system fonts.", fontName));
                }
            }
            builder.setAvailableFonts(availableFonts);
        }

        if (selectedFontName != null) {
            final Font defaultFont = systemFontManager.getFontByName(selectedFontName);
            if (defaultFont != null) {
                builder.setDefaultFont(defaultFont);
            } else {
                Log.w(TAG, String.format("Failed to set default font to %s since it wasn't found in the list of system fonts.", selectedFontName));
            }
        }

        final FreeTextAnnotationConfiguration configuration = builder.build();
        // We want to set this on the current PdfFragment and all future ones.
        // We use the observable emitting PdfFragments for this purpose.
        updateAnnotationConfigurationDisposable = getPdfFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfFragment -> {
                if (pdfFragment.getView() != null) {
                    pdfFragment.getAnnotationConfiguration().put(
                            AnnotationTool.FREETEXT, configuration);
                    pdfFragment.getAnnotationConfiguration().put(
                            AnnotationType.FREETEXT, configuration);
                    pdfFragment.getAnnotationConfiguration().put(
                            AnnotationTool.FREETEXT_CALLOUT, configuration);
                }
            });
    }

    public void setShowNavigationButtonInToolbar(final boolean showNavigationButtonInToolbar) {
        isNavigationButtonShown = showNavigationButtonInToolbar;
        pendingFragmentActions.add(getCurrentPdfUiFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfUiFragment -> {
                if (!isSearchViewShown) {
                    ((ReactPdfUiFragment) pdfUiFragment).setShowNavigationButtonInToolbar(showNavigationButtonInToolbar);
                }
            }));
    }

    public void setImageSaveMode(final String imageSaveMode) {
        this.imageSaveMode = imageSaveMode;
    }

    public void setIsStatusBarHidden(final boolean statusBarHidden) {
        this.isStatusBarHidden = statusBarHidden;
    }

    public void setHideDefaultToolbar(boolean hideDefaultToolbar) {
        isDefaultToolbarHidden = hideDefaultToolbar;
        pendingFragmentActions.add(getCurrentPdfUiFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfUiFragment -> {
                final View views = pdfUiFragment.getView();
                if (views != null) {
                    final ReactMainToolbar mainToolbar = views.findViewById(R.id.pspdf__toolbar_main);
                    if (hideDefaultToolbar) {
                        // If hiding the toolbar is requested we force the visibility to gone, this way it will never be shown.
                        mainToolbar.setForcedVisibility(GONE);
                    } else {
                        // To reset we undo our forcing, and if the UI is supposed to be shown right
                        // now we manually set the visibility to visible so it's immediately shown.
                        mainToolbar.setForcedVisibility(null);
                        if (pdfUiFragment.isUserInterfaceVisible()) {
                            mainToolbar.setVisibility(VISIBLE);
                        }
                    }
                }
            }));
    }

    private void setupFragment(boolean recreate) {
        if (fragmentTag != null && configuration != null && (document != null || recreate == true)) {
            PdfUiFragment pdfFragment = (PdfUiFragment) fragmentManager.findFragmentByTag(fragmentTag);
            if (pdfFragment != null &&
                (pdfFragment.getArguments() == null ||
                    pdfFragment.getArguments().getInt(ARG_ROOT_ID) != internalId)) {
                // This is an orphaned fragment probably from a reload, get rid of it.
                int argRoot = pdfFragment.getArguments() == null ? -1 : pdfFragment.getArguments().getInt(ARG_ROOT_ID);
                Log.w(TAG, "setupFragment: removing orphaned fragment. argRootId=" + argRoot + ", internalId=" + internalId);
                fragmentManager.beginTransaction()
                    .remove(pdfFragment)
                    .commitNow();
                pdfFragment = null;
            }

            if (pdfFragment == null) {
                if (recreate == true) {
                    pdfFragment = PdfUiFragmentBuilder.fromUri(getContext(), Uri.parse(this.documentPath)).fragmentClass(ReactPdfUiFragment.class).pdfFragmentTag(fragmentTag).build();
                } else if (document != null) {
                    pdfFragment = PdfUiFragmentBuilder.fromDocumentDescriptor(getContext(), DocumentDescriptor.fromDocument(document))
                        .configuration(configuration)
                        .fragmentClass(ReactPdfUiFragment.class)
                            .pdfFragmentTag(fragmentTag)
                        .build();
                } else {
                    return;
                }
                // We put our internal id so we can track if this fragment belongs to us, used to handle orphaned fragments after hot reloads.
                pdfFragment.getArguments().putInt(ARG_ROOT_ID, internalId);
                prepareFragment(pdfFragment, true);
            } else {
                if (pdfFragment.getDocument() != null && !pdfFragment.getDocument().getUid().equals(document.getUid())) {

                    PdfUiFragment oldFragment = pdfFragment;
                    if (oldFragment.isAdded() && oldFragment.getPdfFragment() != null) {
                        // Detach the fragment - this removes its view but keeps it in memory
                        // allowing background tasks to access context while completing
                        fragmentManager.beginTransaction()
                                .detach(oldFragment)
                                .commitNowAllowingStateLoss();
                    }

                    // The document changed, create a new PdfFragment.
                    if (recreate == true) {
                        pdfFragment = PdfUiFragmentBuilder.fromUri(getContext(), Uri.parse(this.documentPath)).fragmentClass(ReactPdfUiFragment.class).pdfFragmentTag(fragmentTag).build();
                    } else {
                        pdfFragment = PdfUiFragmentBuilder.fromDocumentDescriptor(getContext(), DocumentDescriptor.fromDocument(document))
                                .configuration(configuration)
                                .fragmentClass(ReactPdfUiFragment.class)
                                .pdfFragmentTag(fragmentTag)
                                .build();
                    }
                    prepareFragment(pdfFragment, true);
                }
            }
            fragment = pdfFragment;
        }
    }

    private void postFragmentSetup(PdfUiFragment pdfFragment) {
        updateState();
        attachPdfFragmentListeners(pdfFragment);
        updateAnnotationConfiguration();
        if (pdfFragment.getDocument() != null) {
            if (pageIndex <= document.getPageCount()-1) {
                pdfFragment.setPageIndex(pageIndex, true);
            }
        }
        if (aiaConfiguration != null) {
            try {
                if (aiaConfiguration.getString("serverURL") != null && aiaConfiguration.getString("jwt") != null && aiaConfiguration.getString("sessionID") != null) {
                    AiAssistantConfiguration aiaConfig = new AiAssistantConfiguration(
                            aiaConfiguration.getString("serverURL"),
                            aiaConfiguration.getString("jwt"),
                            aiaConfiguration.getString("sessionID"),
                            aiaConfiguration.getString("userID"));

                    PdfDocument document = fragment.getDocument();
                    DocumentIdentifiers documentIdentifiers = new DocumentIdentifiers(document.getDocumentSource().getDataProvider(),
                            document.getPermanentId().toString(),
                            null,
                            document.getPermanentId().toString(),
                            null);

                    AiAssistant aiAssistant = AiAssistantKt.standaloneAiAssistant(reactApplicationContext, aiaConfig, List.of(documentIdentifiers));
                    SessionStorage.setAiAssistant(aiAssistant);
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to set AIA Configuration: " + e.getMessage());
            }
        }
        pdfUiFragmentGetter.onNext(Collections.singletonList(pdfFragment));
    }

    private void prepareFragment(final PdfUiFragment pdfUiFragment, final boolean attachFragment) {
        if (attachFragment) {
            fragmentTransactionRunnable = new Runnable() {
                @Override
                public void run() {
                    try {
                        fragmentManager
                                .beginTransaction()
                                .add(getId(), pdfUiFragment, fragmentTag)
                                .commitNowAllowingStateLoss();
                        postFragmentSetup(pdfUiFragment);
                    } catch (Exception e) {
                        // Could not add fragment
                        Log.e(TAG, "prepareFragment: failed to attach fragment", e);
                    }
                }
            };

            OnAttachStateChangeListener stateChangeListener = new OnAttachStateChangeListener() {
                @Override
                public void onViewAttachedToWindow(@NonNull View view) {
                    new Handler(getContext().getMainLooper()).post(fragmentTransactionRunnable);
                    removeOnAttachStateChangeListener(this);
                }

                @Override
                public void onViewDetachedFromWindow(@NonNull View view) {}
            };

            if (isAttachedToWindow()) {
                new Handler(getContext().getMainLooper()).post(fragmentTransactionRunnable);
            } else {
                addOnAttachStateChangeListener(stateChangeListener);
            }
        } else {
            attachPdfFragmentListeners(pdfUiFragment);
        }
    }

    private void attachPdfFragmentListeners(final PdfUiFragment pdfUiFragment) {
        pdfUiFragment.setOnContextualToolbarLifecycleListener(pdfViewModeController);
        pdfUiFragment.setOnContextualToolbarMovementListener(pdfViewModeController);
        pdfUiFragment.getPSPDFKitViews().getFormEditingBarView().addOnFormEditingBarLifecycleListener(pdfViewModeController);
        ((ReactPdfUiFragment) pdfUiFragment).setReactPdfUiFragmentListener(new ReactPdfUiFragment.ReactPdfUiFragmentListener() {
            @Override
            public void onConfigurationChanged(@NonNull PdfUiFragment pdfUiFragment) {
                // If the configuration was changed from the UI a new fragment will be created, reattach our listeners.
                prepareFragment(pdfUiFragment, false);
                // Also notify other places that might want to reattach their listeners.
                pdfUiFragmentGetter.onNext(Collections.singletonList(pdfUiFragment));
            }

            @Override
            public void onNavigationButtonClicked(@NonNull PdfUiFragment pdfUiFragment) {
                if (isFabricMode && delegate != null) {
                    delegate.onNavigationButtonClicked();
                } else {
                    dispatchEvent(new PdfViewNavigationButtonClickedEvent(getId()));
                }
            }
        });

        PdfSearchView searchView = pdfUiFragment.getPSPDFKitViews().getSearchView();
        if (searchView instanceof PdfSearchViewInline) {
            // The inline search view provides its own back button hide ours if it becomes visible.
            searchView.addOnVisibilityChangedListener(new OnVisibilityChangedListener() {
                @Override
                public void onShow(@NonNull View view) {
                    ((ReactPdfUiFragment) pdfUiFragment).setShowNavigationButtonInToolbar(false);
                }

                @Override
                public void onHide(@NonNull View view) {
                    ((ReactPdfUiFragment) pdfUiFragment).setShowNavigationButtonInToolbar(isNavigationButtonShown);
                }
            });
        }

        // After attaching the PdfUiFragment we can access the PdfFragment.
        preparePdfFragment(pdfUiFragment.getPdfFragment());
    }

    private void preparePdfFragment(@NonNull PdfFragment pdfFragment) {
        fragmentDocumentLoadedListener = new SimpleDocumentListener() {
            @Override
            public void onDocumentLoaded(@NonNull PdfDocument document) {
                if (reactApplicationContext != null) {
                    reactApplicationContext.getNativeModule(PDFDocumentModule.class).setDocument(document, null, getId(), PdfView.this);
                }
                manuallyLayoutChildren();
                if (pageIndex <= document.getPageCount()-1) {
                    pdfFragment.setPageIndex(pageIndex, false);
                }
                updateState();
            }
        };
        pdfFragment.addDocumentListener(fragmentDocumentLoadedListener);

        pdfFragment.addOnTextSelectionModeChangeListener(pdfViewModeController);
        pdfFragment.addOnTextSelectionChangeListener(pdfViewModeController);
        pdfFragment.setOnPreparePopupToolbarListener(NutrientPopupMenuBridge.createPrepareListener(this));
        pdfFragment.addDocumentListener(pdfViewDocumentListener);
        pdfFragment.addOnFormElementClickedListener(pdfViewDocumentListener);
        pdfFragment.addOnFormElementSelectedListener(pdfViewDocumentListener);
        pdfFragment.addOnFormElementDeselectedListener(pdfViewDocumentListener);
        pdfFragment.addOnAnnotationSelectedListener(pdfViewDocumentListener);
        pdfFragment.addOnAnnotationUpdatedListener(pdfViewDocumentListener);
        pdfFragment.addDocumentScrollListener(pdfViewDocumentListener);
        if (pdfFragment.getDocument() != null) {
            pdfFragment.getDocument().getFormProvider().addOnFormFieldUpdatedListener(pdfViewDocumentListener);
            pdfFragment.getDocument().getBookmarkProvider().addBookmarkListener(pdfViewDocumentListener);
        }

        // Add annotation configurations.
        if (annotationsConfigurations != null) {
            for (ReactAnnotationPresetConfiguration config : annotationsConfigurations) {
                if (config.getAnnotationTool() != null && config.getVariant() != null) {
                    pdfFragment.getAnnotationConfiguration().put(
                            config.getAnnotationTool(),
                            config.getVariant(),
                            config.getConfiguration()
                    );
                }
                if (config.getAnnotationTool() != null && config.getType() == null) {
                    pdfFragment.getAnnotationConfiguration().put(
                            config.getAnnotationTool(),
                            config.getConfiguration()
                    );
                }
                if (config.getType() != null) {
                    pdfFragment.getAnnotationConfiguration().put(
                            config.getType(),
                            config.getConfiguration()
                    );
                }
            }
        }

        // Add Measurement configuration
        if (this.measurementValueConfigurations != null) {
            this.applyMeasurementValueConfigurations(pdfFragment, this.measurementValueConfigurations);
        }
          
        // Setup SignatureDatabase if SignatureSaving is enabled.
        if (pdfFragment.getConfiguration().getSignatureSavingStrategy() == ALWAYS_SAVE ||
                pdfFragment.getConfiguration().getSignatureSavingStrategy() == SAVE_IF_SELECTED) {
            final SignatureStorage storage = DatabaseSignatureStorage.withName(getContext(), "SignatureDatabase");
            pdfFragment.setSignatureStorage(storage);
        }
    }

    public void removeFragment(boolean makeInactive) {
        PdfUiFragment pdfUiFragment = (PdfUiFragment) fragmentManager.findFragmentByTag(fragmentTag);
        if (makeInactive) {
            // Detach the document-scoped listeners first, driven by the retained document rather
            // than the fragment. These form and bookmark listeners are held by a native form
            // observer through a JNI global reference, so they must be removed even when the UI
            // fragment can no longer be resolved by tag; otherwise the retain cycle survives and
            // the view hierarchy and document leak.
            detachDocumentListeners();
        }
        if (pdfUiFragment != null) {
            if (makeInactive) {
                detachFragmentListeners(pdfUiFragment.getPdfFragment());
            }
            fragmentManager.beginTransaction()
                .remove(pdfUiFragment)
                .commitNowAllowingStateLoss();
        }
        if (makeInactive) {
            // Clear everything.
            isActive = false;
            // Cancel any in-flight document open so its callback cannot repopulate the document
            // or re-attach a fragment after teardown. isActive gates the callbacks that disposal
            // cannot reach (e.g. a remote download still in flight).
            if (documentOpeningDisposable != null) {
                documentOpeningDisposable.dispose();
                documentOpeningDisposable = null;
            }
            document = null;
            releaseDocumentReferences();
            // The attach runnable captures the PdfUiFragment; clearing it releases the fragment's
            // view hierarchy once the fragment is removed.
            fragmentTransactionRunnable = null;
            pendingFragmentActions.dispose();
            pendingFragmentActions = new CompositeDisposable();
        }
        fragment = null;
        pdfUiFragmentGetter.onNext(Collections.emptyList());
    }

    /**
     * Removes the document-scoped listeners registered in {@link #preparePdfFragment}. The form
     * field and bookmark listeners are registered on the document, which outlives the fragment and
     * is held by a native form observer through a JNI global reference, so they are what pin this
     * view after teardown. Driven by the retained {@link #document} so it works even when the UI
     * fragment can no longer be resolved by tag. Must run before {@link #document} is cleared.
     */
    private void detachDocumentListeners() {
        if (pdfViewDocumentListener == null || document == null) {
            return;
        }
        document.getFormProvider().removeOnFormFieldUpdatedListener(pdfViewDocumentListener);
        document.getBookmarkProvider().removeBookmarkListener(pdfViewDocumentListener);
    }

    /**
     * Removes the fragment-scoped listeners registered in {@link #preparePdfFragment}. These are
     * held by the {@link PdfFragment} being removed, so they only need detaching when the fragment
     * is still available.
     */
    private void detachFragmentListeners(@Nullable PdfFragment pdfFragment) {
        if (pdfFragment == null) {
            return;
        }
        if (fragmentDocumentLoadedListener != null) {
            pdfFragment.removeDocumentListener(fragmentDocumentLoadedListener);
            fragmentDocumentLoadedListener = null;
        }
        pdfFragment.removeOnTextSelectionModeChangeListener(pdfViewModeController);
        pdfFragment.removeOnTextSelectionChangeListener(pdfViewModeController);
        if (pdfViewDocumentListener != null) {
            pdfFragment.removeDocumentListener(pdfViewDocumentListener);
            pdfFragment.removeOnFormElementSelectedListener(pdfViewDocumentListener);
            pdfFragment.removeOnFormElementDeselectedListener(pdfViewDocumentListener);
            pdfFragment.removeOnAnnotationSelectedListener(pdfViewDocumentListener);
            pdfFragment.removeOnAnnotationUpdatedListener(pdfViewDocumentListener);
            pdfFragment.removeDocumentScrollListener(pdfViewDocumentListener);
        }
    }

    /**
     * Removes this view's entries from the {@link PDFDocumentModule} registry so the loaded
     * documents can be garbage collected. Documents are registered under the component reference
     * ID (Fabric) and under the view ID (document load listener), so both keys must be released.
     */
    private void releaseDocumentReferences() {
        if (reactApplicationContext == null) {
            return;
        }
        PDFDocumentModule documentModule = reactApplicationContext.getNativeModule(PDFDocumentModule.class);
        if (documentModule == null) {
            return;
        }
        if (componentReferenceId != null && componentReferenceId != 0) {
            documentModule.releaseDocument(componentReferenceId);
        }
        documentModule.releaseDocument(getId());
    }

    void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }

    @SuppressLint("CheckResult")
    void updateState() {
        getCurrentPdfFragment()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(pdfFragment -> {
                    try {
                        if (pdfFragment != null) {
                            updateState(pdfFragment.getPageIndex());
                        } else {
                            updateState(-1);
                        }
                    } catch (Exception e) {
                        // Could not update state
                        Log.e(TAG, "updateState(): error", e);
                    }
                });
    }

    @SuppressLint("CheckResult")
    void updateState(int pageIndex) {
        getCurrentPdfFragment()
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(pdfFragment -> {
                    if (pdfFragment != null) {
                        if (pdfFragment.getDocument() != null) {
                            if (isFabricMode && delegate != null) {
                                StateChangedEvent event = new StateChangedEvent();
                                event.documentLoaded = true;
                                event.currentPageIndex = pageIndex;
                                event.pageCount = pdfFragment.getDocument().getPageCount();
                                event.annotationCreationActive = pdfViewModeController.isAnnotationCreationActive();
                                event.affectedPageIndex = pageIndex;
                                // Nutrient 11.3+: annotation editing toolbar removed; keep false for compatibility.
                                event.annotationEditingActive = false;
                                event.textSelectionActive = pdfViewModeController.isTextSelectionActive();
                                event.formEditingActive = pdfViewModeController.isFormEditingActive();
                                delegate.onStateChanged(event);
                            }
                            if (!isFabricMode) {
                                dispatchEvent(new PdfViewStateChangedEvent(
                                        getId(),
                                        pageIndex,
                                        pdfFragment.getDocument().getPageCount(),
                                        pdfViewModeController.isAnnotationCreationActive(),
                                        false,
                                        pdfViewModeController.isTextSelectionActive(),
                                        pdfViewModeController.isFormEditingActive()));
                            }
                        }
                    }
                });
    }

    public EventDispatcher getEventDispatcher() {
        return eventDispatcher;
    }

    /**
     * Routes events to either Fabric delegate or Paper EventDispatcher based on architecture mode
     */
    private void dispatchEvent(Event event) {
        // Always route via EventDispatcher here; Fabric path handled in manager delegate
        if (eventDispatcher != null) {
            eventDispatcher.dispatchEvent(event);
        }
    }

    /**
     * Store a pending PDF action so React Native can decide later whether it should be executed.
     */
    public void storePendingAction(@NonNull String requestId, @NonNull Action action, int pageIndex) {
        pendingActions.put(requestId, action);
        pendingActionPageIndices.put(requestId, pageIndex);
    }

    public void storePendingSignatureForm(@NonNull String requestId, @NonNull SignatureFormElement formElement) {
        pendingSignatureForms.put(requestId, formElement);
    }

    /**
     * Present or drop the signature UI for a previously intercepted signature form tap.
     * Returns true if the requestId was known and handled.
     */
    public boolean showSignaturePad(@NonNull String requestId, boolean allow) {
        final SignatureFormElement formElement = pendingSignatureForms.remove(requestId);
        if (formElement == null) {
            return false;
        }

        if (!allow) {
            // The signature UI stays suppressed; nothing else to do.
            return true;
        }

        getCurrentPdfFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(fragment -> {
                ElectronicSignatureFragment.show(
                    fragment.getParentFragmentManager(),
                    new OnSignaturePickedListener() {
                        @Override
                        public void onSignaturePicked(@NonNull Signature signature) {
                            applyPickedSignature(fragment, formElement, signature);
                        }

                        @Override
                        public void onDismiss() {
                            // No-op: the user closed the signature UI without picking.
                        }
                    },
                    null,
                    fragment.getSignatureStorage());
            }, throwable -> {
                // Ignore errors; the fragment is not available.
            });

        return true;
    }

    /**
     * Applies a picked signature to the widget of the intercepted signature form element,
     * mirroring the SDK's default signing behavior.
     */
    private void applyPickedSignature(@NonNull PdfFragment fragment, @NonNull SignatureFormElement formElement, @NonNull Signature signature) {
        PdfDocument document = fragment.getDocument();
        if (document == null) {
            return;
        }

        RectF boundingBox = new RectF(formElement.getAnnotation().getBoundingBox());
        // Shrink the target rect slightly so floating point inaccuracies can't push the
        // signature outside the form field bounds (matches the SDK's default behavior).
        float insetX = Math.abs(boundingBox.width()) * 0.025f;
        float insetY = Math.abs(boundingBox.height()) * 0.025f;
        if (boundingBox.left <= boundingBox.right) {
            boundingBox.left += insetX;
            boundingBox.right -= insetX;
        } else {
            boundingBox.left -= insetX;
            boundingBox.right += insetX;
        }
        if (boundingBox.top >= boundingBox.bottom) {
            boundingBox.top -= insetY;
            boundingBox.bottom += insetY;
        } else {
            boundingBox.top += insetY;
            boundingBox.bottom -= insetY;
        }

        Annotation signatureAnnotation = signature.toAnnotation(document, formElement.getAnnotation().getPageIndex(), boundingBox);
        signatureAnnotation.setCreator(fragment.getAnnotationPreferences().getAnnotationCreator());
        SignatureHelper.addAnnotation(document, signatureAnnotation,
            () -> fragment.setSelectedAnnotation(signatureAnnotation));
    }

    /**
     * Dismisses the currently presented signature UI, if any.
     * Emits whether a signature UI was actually showing and got dismissed.
     */
    @SuppressWarnings("deprecation")
    public Single<Boolean> dismissSignaturePad() {
        // With no hosted fragment there is no signature UI that could be showing;
        // settle with false instead of waiting on a fragment that may never arrive.
        final List<PdfUiFragment> pdfUiFragments = pdfUiFragmentGetter.getValue();
        if (pdfUiFragments == null || pdfUiFragments.isEmpty() || pdfUiFragments.get(0).getPdfFragment() == null) {
            return Single.just(false);
        }
        return getCurrentPdfFragment()
            .firstOrError()
            .observeOn(AndroidSchedulers.mainThread())
            .map(fragment -> {
                FragmentManager fragmentManager = fragment.getParentFragmentManager();
                // Detect by type rather than by fragment tag: this stays in sync with the
                // dismiss() calls below by construction, and breaks at compile time instead
                // of silently returning false if the SDK ever drops these classes.
                boolean wasShowing = false;
                for (Fragment attachedFragment : fragmentManager.getFragments()) {
                    if (attachedFragment instanceof ElectronicSignatureFragment
                        || attachedFragment instanceof com.pspdfkit.ui.signatures.SignaturePickerFragment) {
                        wasShowing = true;
                        break;
                    }
                }
                ElectronicSignatureFragment.dismiss(fragmentManager);
                com.pspdfkit.ui.signatures.SignaturePickerFragment.dismiss(fragmentManager);
                return wasShowing;
            });
    }

    /**
     * Execute or cancel a previously stored action identified by requestId.
     * Returns true if the requestId was known and handled.
     */
    public boolean executeAction(@NonNull String requestId, boolean allow) {
        Action action = pendingActions.remove(requestId);
        Integer pageIndex = pendingActionPageIndices.remove(requestId);

        if (action == null) {
            return false;
        }

        if (!allow) {
            // Action is cancelled; nothing else to do.
            return true;
        }

        // Execute action on the current PdfFragment on the main thread.
        getCurrentPdfFragment()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(fragment -> {
                try {
                    // Prevent re-entrancy into onShouldExecuteAction while we replay the action JS approved.
                    suppressShouldExecuteAction = true;
                    // Use the simplest executeAction overload; the action itself encodes its target.
                    fragment.executeAction(action);
                } catch (Exception ignored) {
                    // Swallow and treat as handled; RN already decided to allow.
                } finally {
                    suppressShouldExecuteAction = false;
                }
            }, throwable -> {
                // Ignore errors for now; action was attempted.
            });

        return true;
    }

    public Disposable enterAnnotationCreationMode(@Nullable final String annotationType, Runnable onComplete, Consumer<Throwable> onError) {
        Disposable disposable;
        if (annotationType == null) {
            disposable = getCurrentPdfFragment()
                    .observeOn(Schedulers.io())
                    .subscribe(fragment -> {
                        fragment.enterAnnotatingMode();
                        if (onComplete != null) onComplete.run();
                    }, onError);
        } else {
            ConversionHelpers.AnnotationToolResult annotationTool = ConversionHelpers.convertAnnotationTool(annotationType);
            if (annotationTool.getAnnotationToolVariant() == null) {
                disposable = getCurrentPdfFragment()
                        .observeOn(Schedulers.io())
                        .subscribe(fragment -> {
                            fragment.enterAnnotatingMode(annotationTool.getAnnotationTool());
                            if (onComplete != null) onComplete.run();
                        }, onError);
            } else {
                disposable = getCurrentPdfFragment()
                        .observeOn(Schedulers.io())
                        .subscribe(fragment -> {
                            fragment.enterAnnotatingMode(annotationTool.getAnnotationTool(), annotationTool.getAnnotationToolVariant());
                            if (onComplete != null) onComplete.run();
                        }, onError);
            }
        }
        pendingFragmentActions.add(disposable);
        return disposable;
    }

    public Disposable exitCurrentlyActiveMode(Runnable onComplete, Consumer<Throwable> onError) {
        Disposable disposable = getCurrentPdfFragment()
                .observeOn(Schedulers.io())
                .subscribe(fragment -> {
                    fragment.exitCurrentlyActiveMode();
                    if (onComplete != null) onComplete.run();
                }, onError);
        pendingFragmentActions.add(disposable);
        return disposable;
    }

    public Disposable enterContentEditingMode(Runnable onComplete, Consumer<Throwable> onError) {
        Disposable disposable = getCurrentPdfFragment()
                .observeOn(Schedulers.io())
                .subscribe(fragment -> {
                    fragment.enterContentEditingMode();
                    if (onComplete != null) onComplete.run();
                }, onError);
        pendingFragmentActions.add(disposable);
        return disposable;
    }

    public boolean saveCurrentDocument() throws Exception {
        if (fragment != null) {
            try {
                if (fragment.getPdfFragment() != null && fragment.getPdfFragment().getImageDocument() != null) {
                    boolean metadata = this.imageSaveMode.equals("flattenAndEmbed");
                    if ((fragment.getPdfFragment().getImageDocument().saveIfModified(metadata))) {
                        // Since the document listeners won't be called when manually saving we also dispatch this event here.
                        if (delegate != null) {
                            delegate.onDocumentSaved();
                        }
                        if (!isFabricMode && eventDispatcher != null) {
                            dispatchEvent(new PdfViewDocumentSavedEvent(getId()));
                        }
                        return true;
                    }
                } else {
                    if (fragment.getDocument().saveIfModified()) {
                        // Since the document listeners won't be called when manually saving we also dispatch this event here.
                        if (delegate != null) {
                            delegate.onDocumentSaved();
                        }
                        if (!isFabricMode && eventDispatcher != null) {
                            dispatchEvent(new PdfViewDocumentSavedEvent(getId()));
                        }
                        return true;
                    }
                }
                return false;
            } catch (Exception e) {
                if (delegate != null) {
                    delegate.onDocumentSaveFailed(e.getMessage());
                }
                if (!isFabricMode && eventDispatcher != null) {
                    dispatchEvent(new PdfViewDocumentSaveFailedEvent(getId(), e.getMessage()));
                }
                throw e;
            }
        }
        return false;
    }

    public Disposable getFormFieldValue(final int requestId, @NonNull String formElementName) {
        return document.getFormProvider().getFormElementWithNameAsync(formElementName)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(formElement -> {
                JSONObject result = new JSONObject();
                if (formElement instanceof TextFormElement) {
                    TextFormElement textFormElement = (TextFormElement) formElement;
                    String text = textFormElement.getText();
                    if (text == null || text.isEmpty()) {
                        result.put("value", JSONObject.NULL);
                    } else {
                        result.put("value", text);
                    }
                } else if (formElement instanceof EditableButtonFormElement) {
                    EditableButtonFormElement editableButtonFormElement = (EditableButtonFormElement) formElement;
                    if (editableButtonFormElement.isSelected()) {
                        result.put("value", "selected");
                    } else {
                        result.put("value", "deselected");
                    }
                } else if (formElement instanceof ComboBoxFormElement) {
                    ComboBoxFormElement comboBoxFormElement = (ComboBoxFormElement) formElement;
                    if (comboBoxFormElement.isCustomTextSet()) {
                        result.put("value", comboBoxFormElement.getCustomText());
                    } else {
                        result.put("value", comboBoxFormElement.getSelectedIndexes());
                    }
                } else if (formElement instanceof ChoiceFormElement) {
                    result.put("value", ((ChoiceFormElement) formElement).getSelectedIndexes());
                }

                if (result.length() == 0) {
                    // No type was applicable.
                    result.put("error", "Unsupported form field encountered");
                    dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                } else {
                    dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                }
            },
                throwable -> dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, throwable)),
                () -> {
                    try {
                        JSONObject result = new JSONObject();
                        result.put("error", "Failed to get the form field value.");
                        dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                    } catch (Exception e) {
                        dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, e));
                    }
                });

    }

    // region Viewport / coordinate conversion

    /** Immutable snapshot of the current viewport transformation state. */
    private static final class ViewportData {
        int pageIndex;
        float zoomScale;
        float pdfToScreenScale;
        final RectF visiblePdfRect = new RectF();
        final PointF contentOffset = new PointF();
        float pageWidth;
        float pageHeight;
        float viewportWidth;
        float viewportHeight;
        String documentID = "";
    }

    /**
     * Computes the current viewport state from the given fragment. Must be called on the UI
     * thread. Returns {@code null} only when there is no page to report on at all; a page that is
     * momentarily off screen still reports, with an empty visiblePdfRect.
     */
    @Nullable
    private ViewportData computeViewportData(@NonNull PdfFragment pdfFragment) {
        PdfDocument doc = pdfFragment.getDocument();
        if (doc == null) {
            return null;
        }
        int pageIndex = pdfFragment.getPageIndex();
        List<Integer> visiblePages = pdfFragment.getVisiblePages();
        if (pageIndex < 0 && !visiblePages.isEmpty()) {
            pageIndex = visiblePages.get(0);
        }
        if (pageIndex < 0) {
            return null;
        }

        // Visible PDF rect (already in PDF coordinates). Returns false when the page is not
        // visible, which happens for a frame or two during a fling while getPageIndex still
        // names the departing page. Report an empty rect and carry on rather than dropping the
        // update: the offset, the scale and the page size all still describe where the page sits,
        // iOS behaves the same way, and the payload documents the all-zero rect as the signal.
        RectF visibleRect = new RectF();
        boolean pageIsOnScreen = pdfFragment.getVisiblePdfRect(visibleRect, pageIndex);
        if (!pageIsOnScreen) {
            visibleRect.setEmpty();
        }

        float density = getResources().getDisplayMetrics().density;
        if (density <= 0f) {
            density = 1f;
        }

        ViewportData data = new ViewportData();
        data.pageIndex = pageIndex;
        data.documentID = doc.getDocumentIdString();
        data.zoomScale = pdfFragment.getZoomScale(pageIndex);
        // Page extent in PDF points. getPageSize accounts for page rotation, matching iOS's
        // pageInfo.size, so on both platforms the page spans (0, 0) to this size in the PDF
        // coordinate space the conversion methods work in.
        Size pageSize = doc.getPageSize(pageIndex);
        data.pageWidth = pageSize.width;
        data.pageHeight = pageSize.height;

        // Normalize so serialization matches iOS (x = minX, y = minY), and clip to the page.
        // getVisiblePdfRect is already page-clipped, but its projection leaves a sub-point
        // overshoot that grows with the page size (1.6 pt on a 2592 pt page), and the payload
        // documents this rect as never reaching past the page. Intersected rather than clamped
        // edge by edge: when the page is reduced to a sliver at the edge of the viewport the
        // overshoot can carry the whole rect past the page, and independent clamps then invert
        // it (left 595.8 against right 595.3) for a negative width.
        RectF normalizedPdfRect = new RectF(
            Math.min(visibleRect.left, visibleRect.right),
            Math.min(visibleRect.top, visibleRect.bottom),
            Math.max(visibleRect.left, visibleRect.right),
            Math.max(visibleRect.top, visibleRect.bottom));
        if (!data.visiblePdfRect.setIntersect(
                normalizedPdfRect, new RectF(0f, 0f, pageSize.width, pageSize.height))) {
            // Nothing of the page is left once the overshoot is taken off. Report an empty
            // rect, as iOS does, rather than an inverted one.
            data.visiblePdfRect.setEmpty();
        }

        // Content offset: screen-space (dp) position of the page's visual top-left, negated.
        // (0, pageSize.height) is the PDF-native (bottom-left, y-up) top-left; toViewPoint's
        // page transform flips Y and translates by page height, landing on the same top-left
        // in view (y-down) space that iOS's equivalent computes (RCTPSPDFKitView.m,
        // computeViewportPageView) via pageView's own plain UIKit bounds. Both platforms
        // compute the same quantity here.
        PointF pageTopLeft = new PointF(0f, pageSize.height);
        pdfFragment.getViewProjection().toViewPoint(pageTopLeft, pageIndex); // -> view pixels
        data.contentOffset.set(-pageTopLeft.x / density, -pageTopLeft.y / density);

        // Screen points (dp) per PDF point, probed through the same ViewProjection the
        // convertPointToScreen family uses, so a position derived from this scale in JS agrees
        // with those methods by construction rather than by assumption.
        PointF pdfSpaceOrigin = new PointF(0f, 0f);
        PointF pdfSpaceUnitX = new PointF(1f, 0f);
        pdfFragment.getViewProjection().toViewPoint(pdfSpaceOrigin, pageIndex); // -> view pixels
        pdfFragment.getViewProjection().toViewPoint(pdfSpaceUnitX, pageIndex); // -> view pixels
        data.pdfToScreenScale = (float) Math.hypot(
            pdfSpaceUnitX.x - pdfSpaceOrigin.x, pdfSpaceUnitX.y - pdfSpaceOrigin.y) / density;

        // The projection is what every other spatial field here is built from, so a scale that is
        // zero, negative or not a number means the fragment is not laid out yet and the rest of
        // the payload describes nothing. Report no state rather than plausible-looking geometry:
        // an off-screen page is a real state worth emitting, an unlaid-out one is not. Also keeps
        // the payload's own contract, which tells consumers to derive positions from this scale.
        if (!(data.pdfToScreenScale > 0f)) {
            return null;
        }

        data.viewportWidth = getWidth() / density;
        data.viewportHeight = getHeight() / density;
        return data;
    }

    private JSONObject viewportDataToJson(@NonNull ViewportData data) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("event", "documentViewportChanged");
        json.put("documentID", data.documentID);
        json.put("pageIndex", data.pageIndex);
        json.put("zoomScale", data.zoomScale);
        json.put("pdfToScreenScale", data.pdfToScreenScale);

        JSONObject rect = new JSONObject();
        rect.put("x", data.visiblePdfRect.left);
        rect.put("y", data.visiblePdfRect.top);
        rect.put("width", data.visiblePdfRect.width());
        rect.put("height", data.visiblePdfRect.height());
        json.put("visiblePdfRect", rect);

        JSONObject pageSize = new JSONObject();
        pageSize.put("width", data.pageWidth);
        pageSize.put("height", data.pageHeight);
        json.put("pageSize", pageSize);

        JSONObject offset = new JSONObject();
        offset.put("x", data.contentOffset.x);
        offset.put("y", data.contentOffset.y);
        json.put("contentOffset", offset);

        JSONObject size = new JSONObject();
        size.put("width", data.viewportWidth);
        size.put("height", data.viewportHeight);
        json.put("viewportSize", size);
        return json;
    }

    /** Emits the {@code documentViewportChanged} notification. Must be called on the UI thread. */
    public void emitViewportChangedEvent() {
        if (!NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            return;
        }
        PdfFragment pdfFragment = fragment != null ? fragment.getPdfFragment() : null;
        if (pdfFragment == null) {
            return;
        }
        ViewportData data;
        try {
            data = computeViewportData(pdfFragment);
        } catch (Exception e) {
            return;
        }
        if (data == null) {
            return;
        }
        int componentId = isFabricMode()
            ? (getComponentReferenceId() != null ? getComponentReferenceId() : getId())
            : getId();
        NutrientNotificationCenter.INSTANCE.documentViewportChanged(
            data.pageIndex, data.zoomScale, data.visiblePdfRect, data.contentOffset,
            data.viewportWidth, data.viewportHeight, data.pdfToScreenScale,
            data.pageWidth, data.pageHeight, data.documentID, componentId);
    }

    /** Produces a viewport/coordinate JSONObject from an available PdfFragment. */
    private interface ViewportResultProducer {
        @Nullable JSONObject produce(@NonNull PdfFragment pdfFragment) throws Exception;
    }

    /**
     * Runs a viewport/coordinate computation once a PdfFragment is available, without blocking
     * the calling thread. {@code callback} is invoked on the main thread with the result, or
     * with {@code null} if the fragment never becomes available (e.g. the view is destroyed
     * before it attaches) within the timeout.
     *
     * The subscription is tracked so teardown cancels it: without that, a request made against
     * one document could still be waiting when the view is torn down and resolve against a
     * freshly attached document instead.
     */
    private void computeViewportResultAsync(@NonNull ViewportResultProducer producer, @NonNull Consumer<JSONObject> callback) {
        Disposable disposable = getActivePdfFragment()
            .timeout(5, TimeUnit.SECONDS, Maybe.empty())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                pdfFragment -> {
                    JSONObject result;
                    try {
                        result = producer.produce(pdfFragment);
                    } catch (Exception e) {
                        result = null;
                    }
                    callback.accept(result);
                },
                throwable -> callback.accept(null),
                () -> callback.accept(null));
        pendingFragmentActions.add(disposable);
    }

    /** One-shot pull of the current viewport state. */
    public void getViewportState(@NonNull Consumer<JSONObject> callback) {
        computeViewportResultAsync(pdfFragment -> {
            ViewportData data = computeViewportData(pdfFragment);
            return data == null ? null : viewportDataToJson(data);
        }, callback);
    }

    /** Converts a PDF-space point to screen (dp) coordinates. */
    public void convertPointToScreen(int pageIndex, double x, double y, @NonNull Consumer<JSONObject> callback) {
        computeViewportResultAsync(pdfFragment -> {
            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1f;
            }
            PointF point = new PointF((float) x, (float) y);
            pdfFragment.getViewProjection().toViewPoint(point, pageIndex); // -> view pixels
            JSONObject json = new JSONObject();
            json.put("x", point.x / density);
            json.put("y", point.y / density);
            return json;
        }, callback);
    }

    /** Converts a screen (dp) point to PDF-space coordinates. */
    public void convertPointToPage(int pageIndex, double x, double y, @NonNull Consumer<JSONObject> callback) {
        computeViewportResultAsync(pdfFragment -> {
            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1f;
            }
            PointF point = new PointF((float) (x * density), (float) (y * density)); // dp -> px
            pdfFragment.getViewProjection().toPdfPoint(point, pageIndex);
            JSONObject json = new JSONObject();
            json.put("x", point.x);
            json.put("y", point.y);
            return json;
        }, callback);
    }

    /** Converts a PDF-space rect to screen (dp) coordinates. */
    public void convertRectToScreen(int pageIndex, double x, double y, double width, double height, @NonNull Consumer<JSONObject> callback) {
        computeViewportResultAsync(pdfFragment -> {
            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1f;
            }
            RectF rect = new RectF((float) x, (float) y, (float) (x + width), (float) (y + height));
            pdfFragment.getViewProjection().toViewRect(rect, pageIndex); // -> view pixels
            return normalizedRectToJson(rect, density);
        }, callback);
    }

    /** Converts a screen (dp) rect to PDF-space coordinates. */
    public void convertRectToPage(int pageIndex, double x, double y, double width, double height, @NonNull Consumer<JSONObject> callback) {
        computeViewportResultAsync(pdfFragment -> {
            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1f;
            }
            RectF rect = new RectF(
                (float) (x * density), (float) (y * density),
                (float) ((x + width) * density), (float) ((y + height) * density)); // dp -> px
            pdfFragment.getViewProjection().toPdfRect(rect, pageIndex);
            return normalizedRectToJson(rect, 1f);
        }, callback);
    }

    private JSONObject normalizedRectToJson(@NonNull RectF rect, float divisor) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("x", Math.min(rect.left, rect.right) / divisor);
        json.put("y", Math.min(rect.top, rect.bottom) / divisor);
        json.put("width", Math.abs(rect.width()) / divisor);
        json.put("height", Math.abs(rect.height()) / divisor);
        return json;
    }

    // endregion

    public Maybe<Boolean> setFormFieldValue(@NonNull String formElementName, @NonNull final String value) {
        return document.getFormProvider().getFormElementWithNameAsync(formElementName)
            .map(formElement -> {
                if (formElement instanceof TextFormElement) {
                    TextFormElement textFormElement = (TextFormElement) formElement;
                    textFormElement.setText(value);
                    return true;
                } else if (formElement instanceof EditableButtonFormElement) {
                    EditableButtonFormElement editableButtonFormElement = (EditableButtonFormElement) formElement;
                    if (value.equalsIgnoreCase("selected")) {
                        editableButtonFormElement.select();
                    } else if (value.equalsIgnoreCase("deselected")) {
                        editableButtonFormElement.deselect();
                    }
                    return true;
                } else if (formElement instanceof ChoiceFormElement) {
                    ChoiceFormElement choiceFormElement = (ChoiceFormElement) formElement;
                    try {
                        int selectedIndex = Integer.parseInt(value);
                        List<Integer> selectedIndices = new ArrayList<>();
                        selectedIndices.add(selectedIndex);
                        choiceFormElement.setSelectedIndexes(selectedIndices);
                        return true;
                    } catch (NumberFormatException e) {
                        try {
                            // Maybe it's multiple indices.
                            JSONArray indices = new JSONArray(value);
                            List<Integer> selectedIndices = new ArrayList<>();
                            for (int i = 0; i < indices.length(); i++) {
                                selectedIndices.add(indices.getInt(i));
                            }
                            choiceFormElement.setSelectedIndexes(selectedIndices);
                            return true;
                        } catch (JSONException ex) {
                            // This isn't an index maybe we can set a custom value on a combo box.
                            if (formElement instanceof ComboBoxFormElement) {
                                ((ComboBoxFormElement) formElement).setCustomText(value);
                                return true;
                            }
                        }
                    }
                }
                return false;
            });
    }

    public JSONObject convertConfiguration() {
        try {
            JSONObject config = new JSONObject();
            config.put("scrollDirection", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getConfiguration().getScrollDirection()));
            config.put("pageTransition", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getConfiguration().getScrollMode()));
            config.put("enableTextSelection", fragment.getConfiguration().getConfiguration().isTextSelectionEnabled());
            config.put("autosaveEnabled", fragment.getConfiguration().getConfiguration().isAutosaveEnabled());
            config.put("disableAutomaticSaving", !fragment.getConfiguration().getConfiguration().isAutosaveEnabled());
            config.put("signatureSavingStrategy", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getConfiguration().getSignatureSavingStrategy()));

            config.put("pageMode", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getConfiguration().getLayoutMode()));
            config.put("firstPageAlwaysSingle", fragment.getConfiguration().getConfiguration().isFirstPageAlwaysSingle());
            config.put("showPageLabels", fragment.getConfiguration().isShowPageLabels());
            config.put("documentLabelEnabled", fragment.getConfiguration().isShowDocumentTitleOverlayEnabled());
            config.put("spreadFitting", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getConfiguration().getFitMode()));
            config.put("invertColors", fragment.getConfiguration().getConfiguration().isInvertColors());
            config.put("androidGrayScale", fragment.getConfiguration().getConfiguration().isToGrayscale());

            config.put("userInterfaceViewMode", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getUserInterfaceViewMode()));
            config.put("inlineSearch", fragment.getConfiguration().getSearchType() == SearchType.INLINE ? true : false);
            config.put("immersiveMode", fragment.getConfiguration().isImmersiveModeEnabled());
            config.put("toolbarTitle", fragment.getConfiguration().getActivityTitle());
            config.put("androidShowSearchAction", fragment.getConfiguration().isSearchEnabled());
            config.put("androidShowOutlineAction", fragment.getConfiguration().isOutlineEnabled());
            config.put("androidShowBookmarksAction", fragment.getConfiguration().isBookmarkListEnabled());
            config.put("androidShowShareAction", fragment.getConfiguration().getConfiguration().getEnabledShareFeatures().equals(EnumSet.allOf(ShareFeatures.class)));
            config.put("androidShowPrintAction", fragment.getConfiguration().isPrintingEnabled());
            config.put("androidShowDocumentInfoView", fragment.getConfiguration().isDocumentInfoViewEnabled());
            config.put("androidShowSettingsMenu", fragment.getConfiguration().isSettingsItemEnabled());
            config.put("androidEnableStylusOnDetection", fragment.getConfiguration().getConfiguration().getEnableStylusOnDetection());
            config.put("androidShowStylusButton", getShowStylusButton());

            config.put("showThumbnailBar", ConfigurationAdapter.getStringValueForConfigurationItem(fragment.getConfiguration().getThumbnailBarMode()));
            config.put("androidShowThumbnailGridAction", fragment.getConfiguration().isThumbnailGridEnabled());

            config.put("editableAnnotationTypes", ConfigurationAdapter.getStringValuesForConfigurationItems(fragment.getConfiguration().getConfiguration().getEditableAnnotationTypes()));
            config.put("enableAnnotationEditing", fragment.getConfiguration().getConfiguration().isAnnotationEditingEnabled());
            config.put("enableFormEditing", fragment.getConfiguration().getConfiguration().isFormEditingEnabled());
            config.put("androidShowAnnotationListAction", fragment.getConfiguration().isAnnotationListEnabled());

            {
                String pos = getToolbarPosition();
                config.put("toolbarPosition", pos != null ? pos : "top");
            }

            return config;
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    /** Returns the {@link PdfFragment} hosted in the current {@link PdfUiFragment}. */
    private Observable<PdfFragment> getCurrentPdfFragment() {
        return getPdfFragment()
            .take(1);
    }

    /** Returns the {@link PdfUiFragment}. */
    private Observable<PdfUiFragment> getCurrentPdfUiFragment() {
        return pdfUiFragmentGetter
            .filter(pdfUiFragments -> !pdfUiFragments.isEmpty())
            .map(pdfUiFragments -> pdfUiFragments.get(0))
            .take(1);
    }

    /**
     * Returns the current fragment if it is set. You should not cache a reference to this as it might be replaced.
     * If you want to register listeners on the {@link PdfFragment} you should observe the result of {@link #getPdfFragment()}
     * and setup the listeners in there. This way if the fragment is replaced your listeners will be setup again.
     */
    public Maybe<PdfFragment> getActivePdfFragment() {
        return getCurrentPdfFragment().firstElement();
    }

    /**
     * This returns {@link PdfFragment} as they become available. If the user changes the view configuration or the fragment is replaced for other reasons a new {@link PdfFragment} is emitted.
     */
    public Observable<PdfFragment> getPdfFragment() {
        return pdfUiFragmentGetter
            .filter(pdfUiFragments -> !pdfUiFragments.isEmpty())
            .map(pdfUiFragments -> pdfUiFragments.get(0))
            .filter(pdfUiFragment -> pdfUiFragment.getPdfFragment() != null)
            .map(PdfUiFragment::getPdfFragment);
    }

    /** Returns the event registration map for the default events emitted by the {@link PdfView}. */
    public static  Map<String, Map<String, String>> createDefaultEventRegistrationMap() {
       Map<String , Map<String, String>> map = MapBuilder.of(PdfViewStateChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onStateChanged"),
            PdfViewDocumentSavedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentSaved"),
            PdfViewAnnotationTappedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onAnnotationTapped"),
            PdfViewAnnotationChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onAnnotationsChanged"),
            PdfViewDataReturnedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDataReturned"),
            PdfViewDocumentSaveFailedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentSaveFailed"),
            PdfViewDocumentLoadFailedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentLoadFailed")
        );
       map.put(PdfViewNavigationButtonClickedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onNavigationButtonClicked"));
       map.put(PdfViewDocumentLoadedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onDocumentLoaded"));
       map.put(OnReadyEvent.EVENT_NAME, MapBuilder.of("registrationName", "onReady"));
       map.put(CustomToolbarButtonTappedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onCustomToolbarButtonTapped"));
       map.put(CustomAnnotationContextualMenuItemTappedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onCustomAnnotationContextualMenuItemTapped"));
       map.put(CustomTextSelectionContextualMenuItemTappedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onCustomTextSelectionContextualMenuItemTapped"));
       map.put(PdfViewShouldShowSignaturePadEvent.EVENT_NAME, MapBuilder.of("registrationName", "onShouldShowSignaturePad"));
       return map;
    }

    private void applyMeasurementValueConfigurations(PdfFragment fragment, ReadableArray measurementConfigs) {
        if (this.measurementValueConfigurations != null) {
            for (int i = 0; i < this.measurementValueConfigurations.size(); i++) {
                ReadableMap configuration = this.measurementValueConfigurations.getMap(i);
                MeasurementsHelper.addMeasurementConfiguration(fragment, configuration.toHashMap());
            }
        }
    }

    /**
     * Sets the MeasurementValuesConfigurations on the current pdfFragment during setup, also saves it if fragment changes occur
     * @param measurementConfigs
     */
    public void setMeasurementValueConfigurations(ReadableArray measurementConfigs) {
        this.measurementValueConfigurations = measurementConfigs;
        if (fragment != null && fragment.getPdfFragment() != null) {
            this.applyMeasurementValueConfigurations(fragment.getPdfFragment(), measurementConfigs);
        }
    }

    /**
     * Sets the toolbar position for the annotation toolbar.
     * @param toolbarPosition The position string ("top", "left", or "right")
     */
    public void setToolbarPosition(@Nullable String toolbarPosition) {
        this.toolbarPosition = toolbarPosition;
    }

    /**
     * Sets the supported toolbar positions for the annotation toolbar.
     * @param supportedToolbarPositions Array of position strings ("top", "left", "right")
     */
    public void setSupportedToolbarPositions(@Nullable ReadableArray supportedToolbarPositions) {
        this.supportedToolbarPositions = supportedToolbarPositions;
        
        // Convert to List<String> for persistence (ReadableArray can become invalid)
        if (supportedToolbarPositions != null) {
            supportedToolbarPositionsList = new ArrayList<>();
            for (int i = 0; i < supportedToolbarPositions.size(); i++) {
                supportedToolbarPositionsList.add(supportedToolbarPositions.getString(i));
            }
        } else {
            supportedToolbarPositionsList = null;
        }
    }

    /**
     * Gets the toolbar position.
     * @return The toolbar position string
     */
    @Nullable
    public String getToolbarPosition() {
        return toolbarPosition;
    }

    /**
     * Gets the supported toolbar positions.
     * @return Array of supported toolbar position strings
     */
    @Nullable
    public ReadableArray getSupportedToolbarPositions() {
        // Try to use the persistent list first
        if (supportedToolbarPositionsList != null && !supportedToolbarPositionsList.isEmpty()) {
            // Convert List back to ReadableArray
            com.facebook.react.bridge.WritableArray array = com.facebook.react.bridge.Arguments.createArray();
            for (String pos : supportedToolbarPositionsList) {
                array.pushString(pos);
            }
            return array;
        }
        
        // Fallback to original ReadableArray if list is not available
        if (supportedToolbarPositions != null) {
            try {
                return supportedToolbarPositions;
            } catch (Exception e) {
                return null;
            }
        }
        
        return null;
    }

    /**
     * Returns the current MeasurementValuesConfigurations
     * @return List of MeasurementValueConfiguration objects
     */
    public JSONObject getMeasurementValueConfigurations() throws JSONException {

        JSONObject result = new JSONObject();
        if (fragment != null && fragment.getPdfFragment() != null) {
            List configs = MeasurementsHelper.getMeasurementConfigurations(fragment.getPdfFragment());
            result.put("measurementValueConfigurations", configs);
            return result;
        }
        return result;
    }

    /**
     * Sets the Annotation menu toolbar items on the current pdfFragment during setup
     * @param annotationContextualMenuItems
     */
    public void setAnnotationToolbarMenuButtonItems(ReadableMap annotationContextualMenuItems) {
        ReadableArray menuItems = annotationContextualMenuItems.getArray("buttons");
        if (menuItems == null || menuItems.size() == 0) {
            clearAnnotationPopupMenu();
            return;
        }
        annotationPopupMenuConfig = NutrientAnnotationPopupMenuBridge.parseConfig(getContext(), annotationContextualMenuItems);
    }

    /**
     * Sets the Text Selection popup toolbar items via {@link com.pspdfkit.listeners.OnPreparePopupToolbarListener}.
     */
    public void setTextSelectionToolbarMenuButtonItems(@Nullable ReadableMap textSelectionContextualMenuItems) {
        if (textSelectionContextualMenuItems == null) {
            clearTextSelectionPopupMenu();
            return;
        }
        ReadableArray menuItems = textSelectionContextualMenuItems.getArray("buttons");
        if (menuItems == null || menuItems.size() == 0) {
            clearTextSelectionPopupMenu();
            return;
        }
        textSelectionPopupMenuConfig = NutrientTextSelectionPopupMenuBridge.parseConfig(getContext(), textSelectionContextualMenuItems);
    }

    /** Clears React-driven text selection popup customization (SDK default menu). */
    public void clearTextSelectionPopupMenu() {
        textSelectionPopupMenuConfig = null;
    }

    /** Clears React-driven annotation popup customization (SDK default menu). */
    public void clearAnnotationPopupMenu() {
        annotationPopupMenuConfig = null;
    }

    @Nullable
    public NutrientTextSelectionPopupMenuBridge.Config getTextSelectionPopupMenuConfig() {
        return textSelectionPopupMenuConfig;
    }

    @Nullable
    public NutrientAnnotationPopupMenuBridge.Config getAnnotationPopupMenuConfig() {
        return annotationPopupMenuConfig;
    }

    /** Dispatches {@code customTextSelectionContextualMenuItemTapped} for popup toolbar custom items. */
    public void dispatchCustomTextSelectionContextualMenuItemTapped(@NonNull String resourceName) {
        if (isFabricMode && delegate != null) {
            delegate.onCustomTextSelectionContextualMenuItemTapped(resourceName);
        } else if (eventDispatcher != null) {
            int surfaceId = UIManagerHelper.getSurfaceId(this);
            eventDispatcher.dispatchEvent(new CustomTextSelectionContextualMenuItemTappedEvent(surfaceId, getId(), resourceName));
        }
    }

    /** Dispatches {@code customAnnotationContextualMenuItemTapped} for annotation popup toolbar custom items. */
    public void dispatchCustomAnnotationContextualMenuItemTapped(@NonNull String resourceName) {
        if (isFabricMode && delegate != null) {
            delegate.onCustomAnnotationContextualMenuItemTapped(resourceName);
        } else if (eventDispatcher != null) {
            int surfaceId = UIManagerHelper.getSurfaceId(this);
            eventDispatcher.dispatchEvent(new CustomAnnotationContextualMenuItemTappedEvent(surfaceId, getId(), resourceName));
        }
    }
}
