package com.pspdfkit.views;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentManager;
import android.util.AttributeSet;
import android.view.Choreographer;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.pspdfkit.configuration.PdfConfiguration;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.forms.FormEditingBar;
import com.pspdfkit.ui.inspector.PropertyInspectorCoordinatorLayout;
import com.pspdfkit.ui.inspector.annotation.DefaultAnnotationCreationInspectorController;
import com.pspdfkit.ui.inspector.annotation.DefaultAnnotationEditingInspectorController;
import com.pspdfkit.ui.inspector.forms.FormEditingInspectorController;
import com.pspdfkit.ui.special_mode.controller.AnnotationCreationController;
import com.pspdfkit.ui.special_mode.controller.AnnotationEditingController;
import com.pspdfkit.ui.special_mode.controller.FormEditingController;
import com.pspdfkit.ui.special_mode.controller.TextSelectionController;
import com.pspdfkit.ui.special_mode.manager.AnnotationManager;
import com.pspdfkit.ui.special_mode.manager.FormManager;
import com.pspdfkit.ui.special_mode.manager.TextSelectionManager;
import com.pspdfkit.ui.toolbar.AnnotationCreationToolbar;
import com.pspdfkit.ui.toolbar.AnnotationEditingToolbar;
import com.pspdfkit.ui.toolbar.TextSelectionToolbar;
import com.pspdfkit.ui.toolbar.ToolbarCoordinatorLayout;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

/**
 * This view displays a {@link com.pspdfkit.ui.PdfFragment} and all associated toolbars.
 */
public class PdfView extends FrameLayout implements AnnotationManager.OnAnnotationCreationModeChangeListener, AnnotationManager.OnAnnotationEditingModeChangeListener, FormManager.OnFormElementEditingModeChangeListener, TextSelectionManager.OnTextSelectionModeChangeListener {

    private static final String FILE_SCHEME = "file:///";

    private FragmentManager fragmentManager;
    private String fragmentTag;
    private PdfActivityConfiguration configuration;
    private Disposable documentOpeningDisposable;
    private PdfDocument document;
    private int pageIndex = 0;

    private boolean isActive = true;
    private boolean annotationCreationActive = false;

    private FrameLayout container;
    private ToolbarCoordinatorLayout toolbarCoordinatorLayout;
    private AnnotationCreationToolbar annotationCreationToolbar;
    private TextSelectionToolbar textSelectionToolbar;
    private PropertyInspectorCoordinatorLayout inspectorCoordinatorLayout;
    private DefaultAnnotationEditingInspectorController annotationEditingInspectorController;
    private DefaultAnnotationCreationInspectorController annotationCreationInspectorController;
    private AnnotationEditingToolbar annotationEditingToolbar;
    private FormEditingInspectorController formEditingInspectorController;
    private FormEditingBar formEditingBar;

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

        toolbarCoordinatorLayout = new ToolbarCoordinatorLayout(getContext());
        container.addView(toolbarCoordinatorLayout, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        annotationCreationToolbar = new AnnotationCreationToolbar(getContext());
        textSelectionToolbar = new TextSelectionToolbar(getContext());
        annotationEditingToolbar = new AnnotationEditingToolbar(getContext());

        inspectorCoordinatorLayout = new PropertyInspectorCoordinatorLayout(getContext());
        container.addView(inspectorCoordinatorLayout, LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        annotationEditingInspectorController = new DefaultAnnotationEditingInspectorController(getContext(), inspectorCoordinatorLayout);
        annotationCreationInspectorController = new DefaultAnnotationCreationInspectorController(getContext(), inspectorCoordinatorLayout);

        formEditingInspectorController = new FormEditingInspectorController(getContext(), inspectorCoordinatorLayout);
        formEditingBar = new FormEditingBar(getContext());
        container.addView(formEditingBar, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, Gravity.BOTTOM));

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

    public void setFragmentManager(FragmentManager fragmentManager) {
        this.fragmentManager = fragmentManager;
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

    private void setupFragment() {
        if (fragmentTag != null && configuration != null && document != null) {
            PdfFragment pdfFragment = (PdfFragment) fragmentManager.findFragmentByTag(fragmentTag);
            if (pdfFragment == null) {
                pdfFragment = PdfFragment.newInstance(document, new PdfConfiguration.Builder().build());
                prepareFragment(pdfFragment);
            } else {
                ViewGroup parent = (ViewGroup) pdfFragment.getView().getParent();
                if (pdfFragment.getDocument() != null && !pdfFragment.getDocument().getUid().equals(document.getUid())) {
                    fragmentManager.beginTransaction()
                            .remove(pdfFragment)
                            .commitNow();
                    resetToolbars();
                    // The document changed create a new PdfFragment.
                    pdfFragment = PdfFragment.newInstance(document, new PdfConfiguration.Builder().build());
                    prepareFragment(pdfFragment);
                } else if (parent != this) {
                    // We only need to detach the fragment if the parent view changed.
                    resetToolbars();
                    fragmentManager.beginTransaction()
                            .remove(pdfFragment)
                            .commitNow();
                    prepareFragment(pdfFragment);
                }
            }

            if (pdfFragment.getDocument() != null) {
                pdfFragment.setPageIndex(pageIndex, true);
            }
        }
    }

    private void prepareFragment(final PdfFragment pdfFragment) {
        pdfFragment.addDocumentListener(new SimpleDocumentListener() {
            @Override
            public void onDocumentLoaded(@NonNull PdfDocument document) {
                manuallyLayoutChildren();
                pdfFragment.setPageIndex(pageIndex);
            }
        });

        pdfFragment.addOnAnnotationCreationModeChangeListener(this);
        pdfFragment.addOnAnnotationEditingModeChangeListener(this);
        pdfFragment.addOnFormElementEditingModeChangeListener(this);
        pdfFragment.addOnTextSelectionModeChangeListener(this);


        fragmentManager.beginTransaction()
                .add(getId(), pdfFragment, fragmentTag)
                .commit();
    }

    public void removeFragment() {
        PdfFragment pdfFragment = (PdfFragment) fragmentManager.findFragmentByTag(fragmentTag);
        if (pdfFragment != null) {
            fragmentManager.beginTransaction()
                    .remove(pdfFragment)
                    .commit();
        }
        isActive = false;
    }

    private void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
        container.bringToFront();
    }

    private void resetToolbars() {
        toolbarCoordinatorLayout.removeContextualToolbar(false);
        annotationCreationToolbar.unbindController();
        annotationCreationActive = false;
        annotationCreationInspectorController.unbindAnnotationCreationController();
        annotationEditingToolbar.unbindController();
        annotationEditingInspectorController.unbindAnnotationEditingController();
        textSelectionToolbar.unbindController();
        formEditingInspectorController.unbindFormEditingController();
        formEditingBar.unbindController();
    }

    @Override
    public void onEnterAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        // When entering the annotation creation mode we bind the creation inspector to the provided controller.
        // Controller handles request for toggling annotation inspector.
        annotationCreationInspectorController.bindAnnotationCreationController(controller);

        // When entering the annotation creation mode we bind the toolbar to the provided controller, and
        // issue the coordinator layout to animate the toolbar in place.
        // Whenever the user presses an action, the toolbar forwards this command to the controller.
        // Instead of using the `AnnotationEditingToolbar` you could use a custom UI that operates on the controller.
        // Same principle is used on all other toolbars.
        annotationCreationToolbar.bindController(controller);
        toolbarCoordinatorLayout.displayContextualToolbar(annotationCreationToolbar, true);
        annotationCreationActive = true;
        manuallyLayoutChildren();
    }

    @Override
    public void onChangeAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        // Nothing to be done here, if toolbar is bound to the controller it will pick up the changes.
    }

    @Override
    public void onExitAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        // Once we're done with editing, unbind the controller from the toolbar, and remove it from the
        // toolbar coordinator layout (with animation in this case).
        // Same principle is used on all other toolbars.
        toolbarCoordinatorLayout.removeContextualToolbar(true);
        annotationCreationToolbar.unbindController();
        annotationCreationActive = false;

        // Also unbind the annotation creation controller from the inspector controller.
        annotationCreationInspectorController.unbindAnnotationCreationController();
        manuallyLayoutChildren();
    }

    @Override
    public void onEnterAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        annotationEditingInspectorController.bindAnnotationEditingController(controller);

        annotationEditingToolbar.bindController(controller);
        toolbarCoordinatorLayout.displayContextualToolbar(annotationEditingToolbar, true);
        manuallyLayoutChildren();
    }

    @Override
    public void onChangeAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        // Nothing to be done here, if toolbar is bound to the controller it will pick up the changes.
    }

    @Override
    public void onExitAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        toolbarCoordinatorLayout.removeContextualToolbar(true);
        annotationEditingToolbar.unbindController();

        annotationEditingInspectorController.unbindAnnotationEditingController();
        manuallyLayoutChildren();
    }

    @Override
    public void onEnterTextSelectionMode(@NonNull TextSelectionController controller) {
        textSelectionToolbar.bindController(controller);
        toolbarCoordinatorLayout.displayContextualToolbar(textSelectionToolbar, true);
        manuallyLayoutChildren();
    }

    @Override
    public void onExitTextSelectionMode(@NonNull TextSelectionController controller) {
        toolbarCoordinatorLayout.removeContextualToolbar(true);
        textSelectionToolbar.unbindController();
        manuallyLayoutChildren();
    }

    @Override
    public void onEnterFormElementEditingMode(@NonNull FormEditingController controller) {
        formEditingInspectorController.bindFormEditingController(controller);
        formEditingBar.bindController(controller);
        manuallyLayoutChildren();
    }

    @Override
    public void onChangeFormElementEditingMode(@NonNull FormEditingController controller) {

    }

    @Override
    public void onExitFormElementEditingMode(@NonNull FormEditingController controller) {
        formEditingInspectorController.unbindFormEditingController();
        formEditingBar.unbindController();
        manuallyLayoutChildren();
    }
}
