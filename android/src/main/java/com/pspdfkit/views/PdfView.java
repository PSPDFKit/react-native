package com.pspdfkit.views;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Pair;
import android.view.Choreographer;
import android.view.View;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.formatters.DocumentJsonFormatter;
import com.pspdfkit.document.providers.DataProvider;
import com.pspdfkit.forms.ChoiceFormElement;
import com.pspdfkit.forms.ComboBoxFormElement;
import com.pspdfkit.forms.EditableButtonFormElement;
import com.pspdfkit.forms.TextFormElement;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.react.events.PdfViewAnnotationChangedEvent;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDataReturnedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSaveFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.react.events.PdfViewNavigationButtonClickedEvent;
import com.pspdfkit.react.events.PdfViewStateChangedEvent;
import com.pspdfkit.react.helper.DocumentJsonDataProvider;
import com.pspdfkit.ui.DocumentDescriptor;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfUiFragment;
import com.pspdfkit.ui.PdfUiFragmentBuilder;
import com.pspdfkit.ui.toolbar.grouping.MenuItemGroupingRule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.Callable;

import io.reactivex.Completable;
import io.reactivex.Maybe;
import io.reactivex.Observable;
import io.reactivex.ObservableSource;
import io.reactivex.Single;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Function;
import io.reactivex.schedulers.Schedulers;
import io.reactivex.subjects.BehaviorSubject;

/**
 * This view displays a {@link com.pspdfkit.ui.PdfFragment} and all associated toolbars.
 */
@SuppressLint("pspdfkit-experimental")
public class PdfView extends FrameLayout {

    private static final String FILE_SCHEME = "file:///";

    /** Key to use when setting the id argument of PdfFragments created by this PdfView. */
    private static final String ARG_ROOT_ID = "root_id";

    private FragmentManager fragmentManager;
    private EventDispatcher eventDispatcher;
    private String fragmentTag;
    private PdfActivityConfiguration configuration;
    private Disposable documentOpeningDisposable;
    private PdfDocument document;
    private int pageIndex = 0;

    private boolean isActive = true;

    private PdfViewModeController pdfViewModeController;
    private PdfViewDocumentListener pdfViewDocumentListener;

    @NonNull
    private CompositeDisposable pendingFragmentActions = new CompositeDisposable();

    @Nullable
    private PdfUiFragment fragment;

    /** We wrap the fragment in a list so we can have a state that encapsulates no element being set. */
    @NonNull
    private final BehaviorSubject<List<PdfUiFragment>> pdfUiFragmentGetter = BehaviorSubject.createDefault(Collections.emptyList());

    /** An internal id we generate so we can track if fragments found belong to this specific PdfView instance. */
    private int internalId;

    public PdfView(@NonNull Context context) {
        super(context);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
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

        // Set a default configuration.
        configuration = new PdfActivityConfiguration.Builder(getContext()).build();

        // Generate an id to set on all fragments created by the PdfView.
        internalId = View.generateViewId();
    }

    public void inject(FragmentManager fragmentManager, EventDispatcher eventDispatcher) {
        this.fragmentManager = fragmentManager;
        this.eventDispatcher = eventDispatcher;
        pdfViewDocumentListener = new PdfViewDocumentListener(this,
            eventDispatcher);
    }

    public void setFragmentTag(String fragmentTag) {
        this.fragmentTag = fragmentTag;
        setupFragment();
    }

    public void setConfiguration(PdfActivityConfiguration configuration) {
        if (configuration != null && !configuration.equals(this.configuration)) {
            // The configuration changed, recreate the fragment.
            // We set the current page index so the fragment is created at this location.
            this.pageIndex = fragment != null ? fragment.getPageIndex() : this.pageIndex;
            removeFragment(false);
        }
        this.configuration = configuration;
        setupFragment();
    }

    public void setDocument(@Nullable String documentPath) {
        if (documentPath == null) {
            this.document = null;
            removeFragment(false);
            return;
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
        updateState();
        documentOpeningDisposable = PdfDocumentLoader.openDocumentAsync(getContext(), Uri.parse(documentPath))
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(pdfDocument -> {
                PdfView.this.document = pdfDocument;
                setupFragment();
            }, throwable -> {
                PdfView.this.document = null;
                setupFragment();
                eventDispatcher.dispatchEvent(new PdfViewDocumentLoadFailedEvent(getId(), throwable.getMessage()));
            });
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
        setupFragment();
    }

    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        pdfViewDocumentListener.setDisableDefaultActionForTappedAnnotations(disableDefaultActionForTappedAnnotations);
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

    public void setShowNavigationButtonInToolbar(final boolean showNavigationButtonInToolbar) {
        pendingFragmentActions.add(getCurrentPdfUiFragment()
            .observeOn(Schedulers.io())
            .subscribe(pdfUiFragment -> {
                ((ReactPdfUiFragment) pdfUiFragment).setShowNavigationButtonInToolbar(showNavigationButtonInToolbar);
            }));
    }

    private void setupFragment() {
        if (fragmentTag != null && configuration != null && document != null) {
            PdfUiFragment pdfFragment = (PdfUiFragment) fragmentManager.findFragmentByTag(fragmentTag);
            if (pdfFragment != null &&
                (pdfFragment.getArguments() == null ||
                    pdfFragment.getArguments().getInt(ARG_ROOT_ID) != internalId)) {
                // This is an orphaned fragment probably from a reload, get rid of it.
                fragmentManager.beginTransaction()
                    .remove(pdfFragment)
                    .commitNow();
                pdfFragment = null;
            }

            if (pdfFragment == null) {
                pdfFragment = PdfUiFragmentBuilder.fromDocumentDescriptor(getContext(), DocumentDescriptor.fromDocument(document))
                    .configuration(configuration)
                    .fragmentClass(ReactPdfUiFragment.class)
                    .build();
                // We put our internal id so we can track if this fragment belongs to us, used to handle orphaned fragments after hot reloads.
                pdfFragment.getArguments().putInt(ARG_ROOT_ID, internalId);
                prepareFragment(pdfFragment);
            } else {
                View fragmentView = pdfFragment.getView();
                if (pdfFragment.getDocument() != null && !pdfFragment.getDocument().getUid().equals(document.getUid())) {
                    fragmentManager.beginTransaction()
                        .remove(pdfFragment)
                        .commitNow();
                    // The document changed create a new PdfFragment.
                    pdfFragment = PdfUiFragmentBuilder.fromDocumentDescriptor(getContext(), DocumentDescriptor.fromDocument(document))
                        .configuration(configuration)
                        .fragmentClass(ReactPdfUiFragment.class)
                        .build();
                    prepareFragment(pdfFragment);
                } else if (fragmentView != null && fragmentView.getParent() != this) {
                    // We only need to detach the fragment if the parent view changed.
                    fragmentManager.beginTransaction()
                        .remove(pdfFragment)
                        .commitNow();
                    prepareFragment(pdfFragment);
                }
            }

            if (pdfFragment.getDocument() != null) {
                pdfFragment.setPageIndex(pageIndex, true);
            }

            fragment = pdfFragment;
            pdfUiFragmentGetter.onNext(Collections.singletonList(pdfFragment));
        }
    }

    private void prepareFragment(final PdfUiFragment pdfUiFragment) {
        fragmentManager.beginTransaction()
            .add(pdfUiFragment, fragmentTag)
            .commitNow();
        View fragmentView = pdfUiFragment.getView();
        addView(fragmentView, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        pdfUiFragment.setOnContextualToolbarLifecycleListener(pdfViewModeController);
        pdfUiFragment.getPSPDFKitViews().getFormEditingBarView().addOnFormEditingBarLifecycleListener(pdfViewModeController);
        ((ReactPdfUiFragment) pdfUiFragment).setReactPdfUiFragmentListener(new ReactPdfUiFragment.ReactPdfUiFragmentListener() {
            @Override
            public void onConfigurationChanged(@NonNull PdfUiFragment pdfUiFragment) {
                // If the configuration was changed from the UI a new fragment will be created, reattach our listeners.
                preparePdfFragment(pdfUiFragment.getPdfFragment());
            }

            @Override
            public void onNavigationButtonClicked(@NonNull PdfUiFragment pdfUiFragment) {
                eventDispatcher.dispatchEvent(new PdfViewNavigationButtonClickedEvent(getId()));
            }
        });

        // After attaching the PdfUiFragment we can access the PdfFragment.
        preparePdfFragment(pdfUiFragment.getPdfFragment());
    }

    private void preparePdfFragment(@NonNull PdfFragment pdfFragment) {
        pdfFragment.addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void onDocumentLoaded(@NonNull PdfDocument document) {
                manuallyLayoutChildren();
                pdfFragment.setPageIndex(pageIndex, false);
                updateState();
            }
        });

        pdfFragment.addOnTextSelectionModeChangeListener(pdfViewModeController);
        pdfFragment.addDocumentListener(pdfViewDocumentListener);
        pdfFragment.addOnAnnotationSelectedListener(pdfViewDocumentListener);
        pdfFragment.addOnAnnotationUpdatedListener(pdfViewDocumentListener);
    }

    public void removeFragment(boolean makeInactive) {
        PdfUiFragment pdfUiFragment = (PdfUiFragment) fragmentManager.findFragmentByTag(fragmentTag);
        if (pdfUiFragment != null) {
            fragmentManager.beginTransaction()
                .remove(pdfUiFragment)
                .commitNowAllowingStateLoss();
        }
        if (makeInactive) {
            // Clear everything.
            isActive = false;
            document = null;

            pendingFragmentActions.dispose();
            pendingFragmentActions = new CompositeDisposable();
        }

        fragment = null;

        pdfUiFragmentGetter.onNext(Collections.emptyList());
    }

    void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }

    void updateState() {
        if (fragment != null) {
            updateState(fragment.getPageIndex());
        } else {
            updateState(-1);
        }
    }

    void updateState(int pageIndex) {
        if (fragment != null) {
            if (fragment.getDocument() != null) {
                eventDispatcher.dispatchEvent(new PdfViewStateChangedEvent(
                    getId(),
                    pageIndex,
                    fragment.getDocument().getPageCount(),
                    pdfViewModeController.isAnnotationCreationActive(),
                    pdfViewModeController.isAnnotationEditingActive(),
                    pdfViewModeController.isTextSelectionActive(),
                    pdfViewModeController.isFormEditingActive()));
            } else {
                eventDispatcher.dispatchEvent(new PdfViewStateChangedEvent(getId()));
            }
        }
    }

    public EventDispatcher getEventDispatcher() {
        return eventDispatcher;
    }

    public void enterAnnotationCreationMode() {
        pendingFragmentActions.add(getCurrentPdfFragment()
            .observeOn(Schedulers.io())
            .subscribe(PdfFragment::enterAnnotationCreationMode));
    }

    public void exitCurrentlyActiveMode() {
        pendingFragmentActions.add(getCurrentPdfFragment()
            .observeOn(Schedulers.io())
            .subscribe(PdfFragment::exitCurrentlyActiveMode));
    }

    public boolean saveCurrentDocument() throws Exception {
        if (fragment != null) {
            try {
                if (document.saveIfModified()) {
                    // Since the document listeners won't be called when manually saving we also dispatch this event here.
                    eventDispatcher.dispatchEvent(new PdfViewDocumentSavedEvent(getId()));
                    return true;
                }
                return false;
            } catch (Exception e) {
                eventDispatcher.dispatchEvent(new PdfViewDocumentSaveFailedEvent(getId(), e.getMessage()));
                throw e;
            }
        }
        return false;
    }

    public Single<List<Annotation>> getAnnotations(final int pageIndex, @Nullable final String type) {
        return getCurrentPdfFragment()
            .map(pdfFragment -> pdfFragment.getDocument())
            .flatMap((Function<PdfDocument, ObservableSource<Annotation>>) pdfDocument ->
                pdfDocument.getAnnotationProvider().getAllAnnotationsOfTypeAsync(getTypeFromString(type), pageIndex, 1)).toList();
    }

    public Single<List<Annotation>> getAllAnnotations(@Nullable final String type) {
        return getCurrentPdfFragment().map(PdfFragment::getDocument)
            .flatMap(pdfDocument -> pdfDocument.getAnnotationProvider().getAllAnnotationsOfTypeAsync(getTypeFromString(type)))
            .toList();
    }

    private EnumSet<AnnotationType> getTypeFromString(@Nullable String type) {
        if (type == null) {
            return EnumSet.allOf(AnnotationType.class);
        }
        if ("pspdfkit/ink".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.INK);
        }
        if ("pspdfkit/link".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.LINK);
        }
        if ("pspdfkit/markup/highlight".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.HIGHLIGHT);
        }
        if ("pspdfkit/markup/squiggly".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.SQUIGGLY);
        }
        if ("pspdfkit/markup/strikeout".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.STRIKEOUT);
        }
        if ("pspdfkit/markup/underline".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.UNDERLINE);
        }
        if ("pspdfkit/note".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.NOTE);
        }
        if ("pspdfkit/shape/ellipse".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.CIRCLE);
        }
        if ("pspdfkit/shape/line".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.LINE);
        }
        if ("pspdfkit/shape/polygon".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.POLYGON);
        }
        if ("pspdfkit/shape/polyline".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.POLYLINE);
        }
        if ("pspdfkit/shape/rectangle".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.SQUARE);
        }
        if ("pspdfkit/text".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.FREETEXT);
        }
        return EnumSet.noneOf(AnnotationType.class);
    }

    public Disposable addAnnotation(final int requestId, ReadableMap annotation) {
        return getCurrentPdfFragment().map(PdfFragment::getDocument).subscribeOn(Schedulers.io())
            .map(pdfDocument -> {
                JSONObject json = new JSONObject(annotation.toHashMap());
                return pdfDocument.getAnnotationProvider().createAnnotationFromInstantJson(json.toString());
            })
            .map(Annotation::toInstantJson)
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe((instantJson) -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, true)),
                (throwable) -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, throwable)));
    }

    public Disposable removeAnnotation(final int requestId, ReadableMap annotation) {
        return getCurrentPdfFragment().map(PdfFragment::getDocument).subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .flatMap(pdfDocument -> {
                JSONObject json = new JSONObject(annotation.toHashMap());
                // We can't create an annotation from the instant json since that will attach it to the document,
                // so we manually grab the necessary values.
                int pageIndex = json.optInt("pageIndex", -1);
                String type = json.optString("type", null);
                String name = json.optString("name", null);
                if (pageIndex == -1 || type == null || name == null) {
                    return Observable.empty();
                }

                return pdfDocument.getAnnotationProvider().getAllAnnotationsOfTypeAsync(getTypeFromString(type), pageIndex, 1)
                    .filter(annotationToFilter -> name.equals(annotationToFilter.getName()))
                    .map(filteredAnnotation -> new Pair<>(filteredAnnotation, pdfDocument));
            })
            .firstOrError()
            .flatMapCompletable(pair -> Completable.fromAction(() -> {
                pair.second.getAnnotationProvider().removeAnnotationFromPage(pair.first);
            }))
            .subscribe(() -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, true)), (throwable -> {
                if (throwable instanceof NoSuchElementException) {
                    // We didn't find an annotation so return false.
                    eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, false));
                } else {
                    eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, throwable));
                }
            }));
    }

    public Single<JSONObject> getAllUnsavedAnnotations() {
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        return DocumentJsonFormatter.exportDocumentJsonAsync(document, outputStream)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .toSingle(new Callable<JSONObject>() {
                @Override
                public JSONObject call() throws Exception {
                    final String jsonString = outputStream.toString();
                    return new JSONObject(jsonString);
                }
            });
    }

    public Disposable addAnnotations(final int requestId, ReadableMap annotation) {
        return getCurrentPdfFragment().map(PdfFragment::getDocument).subscribeOn(Schedulers.io())
            .flatMapCompletable(currentDocument -> Completable.fromAction(() -> {
                JSONObject json = new JSONObject(annotation.toHashMap());
                final DataProvider dataProvider = new DocumentJsonDataProvider(json);
                DocumentJsonFormatter.importDocumentJson(currentDocument, dataProvider);
            }))
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(() -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, true)),
                (throwable) -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, throwable)));
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
                    eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                } else {
                    eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                }
            },
                throwable -> eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, throwable)),
                () -> {
                    try {
                        JSONObject result = new JSONObject();
                        result.put("error", "Failed to get the form field value.");
                        eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, result));
                    } catch (Exception e) {
                        eventDispatcher.dispatchEvent(new PdfViewDataReturnedEvent(getId(), requestId, e));
                    }
                });

    }

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
                            // This isn't an index maybe we can set a custom value on a combobox.
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
     * This returns {@link PdfFragment} as they become available. If the user changes the view configuration of the fragment is replaced for other reasons a new {@link PdfFragment} is emitted.
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

       return map;
    }
}
