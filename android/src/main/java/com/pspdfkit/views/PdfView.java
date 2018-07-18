package com.pspdfkit.views;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentManager;
import android.util.AttributeSet;
import android.view.Choreographer;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.facebook.react.uimanager.events.EventDispatcher;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.activity.ThumbnailBarMode;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.react.R;
import com.pspdfkit.react.events.PdfViewStateChangedEvent;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfThumbnailBar;
import com.pspdfkit.ui.forms.FormEditingBar;
import com.pspdfkit.ui.inspector.PropertyInspectorCoordinatorLayout;
import com.pspdfkit.ui.thumbnail.PdfThumbnailBarController;
import com.pspdfkit.ui.toolbar.ToolbarCoordinatorLayout;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

/**
 * This view displays a {@link com.pspdfkit.ui.PdfFragment} and all associated toolbars.
 */
public class PdfView extends FrameLayout {

    private static final String FILE_SCHEME = "file:///";

    private FragmentManager fragmentManager;
    private EventDispatcher eventDispatcher;
    private String fragmentTag;
    private PdfActivityConfiguration configuration;
    private Disposable documentOpeningDisposable;
    private PdfDocument document;
    private int pageIndex = 0;

    private boolean isActive = true;

    private FrameLayout container;
    private PdfViewModeController pdfViewModeController;
    private PdfViewDocumentListener pdfViewDocumentListener;

    private PdfThumbnailBar pdfThumbnailBar;

    private PdfFragment fragment;

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
        container = new FrameLayout(getContext());
        addView(container, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        ToolbarCoordinatorLayout toolbarCoordinatorLayout = new ToolbarCoordinatorLayout(getContext());
        container.addView(toolbarCoordinatorLayout, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        PropertyInspectorCoordinatorLayout inspectorCoordinatorLayout = new PropertyInspectorCoordinatorLayout(getContext());
        container.addView(inspectorCoordinatorLayout, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);


        FormEditingBar formEditingBar = new FormEditingBar(getContext());
        container.addView(formEditingBar, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, Gravity.BOTTOM));

        pdfThumbnailBar = new PdfThumbnailBar(getContext());
        pdfThumbnailBar.setVisibility(View.GONE);
        container.addView(pdfThumbnailBar, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, Gravity.BOTTOM));

        pdfViewModeController = new PdfViewModeController(this,
                inspectorCoordinatorLayout,
                toolbarCoordinatorLayout,
                formEditingBar);

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
        this.configuration = configuration;
        setupFragment();
    }

    public void setDocument(String document) {
        if (Uri.parse(document).getScheme() == null) {
            document = FILE_SCHEME + document;
        }
        if (documentOpeningDisposable != null) {
            documentOpeningDisposable.dispose();
        }
        updateState();
        documentOpeningDisposable = PdfDocument.openDocumentAsync(getContext(), Uri.parse(document))
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<PdfDocument>() {

                    @Override
                    public void accept(PdfDocument pdfDocument) throws Exception {
                        PdfView.this.document = pdfDocument;
                        setupFragment();
                    }
                });
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
        setupFragment();
    }

    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        pdfViewDocumentListener.setDisableDefaultActionForTappedAnnotations(disableDefaultActionForTappedAnnotations);
    }

    private void setupFragment() {
        if (fragmentTag != null && configuration != null && document != null) {
            PdfFragment pdfFragment = (PdfFragment) fragmentManager.findFragmentByTag(fragmentTag);
            if (pdfFragment == null) {
                pdfFragment = PdfFragment.newInstance(document, this.configuration.getConfiguration());
                prepareFragment(pdfFragment);
            } else {
                ViewGroup parent = (ViewGroup) pdfFragment.getView().getParent();
                if (pdfFragment.getDocument() != null && !pdfFragment.getDocument().getUid().equals(document.getUid())) {
                    fragmentManager.beginTransaction()
                            .remove(pdfFragment)
                            .commitNow();
                    pdfViewModeController.resetToolbars();
                    // The document changed create a new PdfFragment.
                    pdfFragment = PdfFragment.newInstance(document, this.configuration.getConfiguration());
                    prepareFragment(pdfFragment);
                } else if (parent != this) {
                    // We only need to detach the fragment if the parent view changed.
                    pdfViewModeController.resetToolbars();
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
        }
    }

    private void prepareFragment(final PdfFragment pdfFragment) {
        pdfFragment.addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void onDocumentLoaded(@NonNull PdfDocument document) {
                manuallyLayoutChildren();
                pdfFragment.setPageIndex(pageIndex, false);
                pdfThumbnailBar.setDocument(document, configuration.getConfiguration(), pdfFragment.getEventBus());
                updateState();
            }

            @Override
            public void onPageChanged(@NonNull PdfDocument document, int pageIndex) {
                updateState(pageIndex);
            }
        });

        pdfFragment.addOnAnnotationCreationModeChangeListener(pdfViewModeController);
        pdfFragment.addOnAnnotationEditingModeChangeListener(pdfViewModeController);
        pdfFragment.addOnFormElementEditingModeChangeListener(pdfViewModeController);
        pdfFragment.addOnTextSelectionModeChangeListener(pdfViewModeController);
        pdfFragment.addDocumentListener(pdfViewDocumentListener);
        pdfFragment.addOnAnnotationSelectedListener(pdfViewDocumentListener);

        setupThumbnailBar(pdfFragment);

        fragmentManager.beginTransaction()
                .add(pdfFragment, fragmentTag)
                .commitNow();
        View fragmentView = pdfFragment.onCreateView(LayoutInflater.from(getContext()), this, null);
        addView(fragmentView, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
    }

    private void setupThumbnailBar(final PdfFragment pdfFragment) {
        if (configuration.getThumbnailBarMode() != ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE) {
            pdfThumbnailBar.setThumbnailBarMode(configuration.getThumbnailBarMode());
            pdfThumbnailBar.setVisibility(VISIBLE);
        } else {
            pdfThumbnailBar.setVisibility(GONE);
        }
        pdfFragment.addDocumentListener(pdfThumbnailBar.getDocumentListener());
        pdfThumbnailBar.setOnPageChangedListener(new PdfThumbnailBar.OnPageChangedListener() {
            @Override
            public void onPageChanged(@NonNull PdfThumbnailBarController pdfThumbnailBarController, int pageIndex) {
                pdfFragment.setPageIndex(pageIndex);
            }
        });
    }

    public void removeFragment() {
        PdfFragment pdfFragment = (PdfFragment) fragmentManager.findFragmentByTag(fragmentTag);
        if (pdfFragment != null) {
            fragmentManager.beginTransaction()
                    .remove(pdfFragment)
                    .commitAllowingStateLoss();
        }
        isActive = false;

        fragment = null;
    }

    void manuallyLayoutChildren() {
        applyThumbnailBarPadding();
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
        container.bringToFront();
    }

    private void applyThumbnailBarPadding() {
        View fragmentView = findViewById(R.id.pspdf__fragment_layout);
        if (fragmentView != null && configuration.getThumbnailBarMode() != ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE) {
            fragmentView.setPadding(0, 0, 0, pdfThumbnailBar.getHeight());
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

    public void enterAnnotationCreationMode() {
        if (fragment != null) {
            fragment.enterAnnotationCreationMode();
        }
    }

    public void exitCurrentlyActiveMode() {
        if (fragment != null) {
            fragment.exitCurrentlyActiveMode();
        }
    }
}
