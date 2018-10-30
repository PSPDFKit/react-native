package com.pspdfkit.views;

import android.support.annotation.NonNull;

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
import com.pspdfkit.ui.toolbar.ToolbarCoordinatorLayout;

/**
 * Keeps track of the currently active mode and handles updating the toolbar states.
 */
class PdfViewModeController implements AnnotationManager.OnAnnotationCreationModeChangeListener,
        AnnotationManager.OnAnnotationEditingModeChangeListener,
        FormManager.OnFormElementEditingModeChangeListener,
        TextSelectionManager.OnTextSelectionModeChangeListener {

    private final PdfView parent;
    private final ToolbarCoordinatorLayout toolbarCoordinatorLayout;
    private final AnnotationCreationToolbar annotationCreationToolbar;
    private final AnnotationEditingToolbar annotationEditingToolbar;
    private final FormEditingBar formEditingBar;

    private boolean annotationCreationActive = false;
    private boolean annotationEditingActive = false;
    private boolean textSelectionActive = false;
    private boolean formEditingActive = false;

    private final DefaultAnnotationCreationInspectorController annotationCreationInspectorController;
    private final DefaultAnnotationEditingInspectorController annotationEditingInspectorController;
    private final FormEditingInspectorController formEditingInspectorController;

    PdfViewModeController(PdfView parent,
                          PropertyInspectorCoordinatorLayout inspectorCoordinatorLayout,
                          ToolbarCoordinatorLayout toolbarCoordinatorLayout,
                          FormEditingBar formEditingBar) {
        this.parent = parent;
        this.toolbarCoordinatorLayout = toolbarCoordinatorLayout;
        this.annotationCreationToolbar = new AnnotationCreationToolbar(parent.getContext());
        this.annotationEditingToolbar = new AnnotationEditingToolbar(parent.getContext());
        this.formEditingBar = formEditingBar;

        this.annotationCreationInspectorController = new DefaultAnnotationCreationInspectorController(parent.getContext(), inspectorCoordinatorLayout);
        this.annotationEditingInspectorController = new DefaultAnnotationEditingInspectorController(parent.getContext(), inspectorCoordinatorLayout);
        this.formEditingInspectorController = new FormEditingInspectorController(parent.getContext(), inspectorCoordinatorLayout);
    }

    @Override
    public void onEnterAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        annotationCreationActive = true;

        // When entering the annotation creation mode we bind the creation inspector to the provided controller.
        // Controller handles request for toggling annotation inspector.
        annotationCreationInspectorController.bindAnnotationCreationController(controller);

        // When entering the annotation creation mode we bind the toolbar to the provided controller, and
        // issue the coordinator layout to animate the toolbar in place.
        // Whenever the user presses an action, the toolbar forwards this command to the controller.
        annotationCreationToolbar.bindController(controller);
        toolbarCoordinatorLayout.displayContextualToolbar(annotationCreationToolbar, true);
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    @Override
    public void onChangeAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        // Nothing to be done here, if toolbar is bound to the controller it will pick up the changes.
    }

    @Override
    public void onExitAnnotationCreationMode(@NonNull AnnotationCreationController controller) {
        annotationCreationActive = false;

        // Once we're done with editing, unbind the controller from the toolbar, and remove it from the
        // toolbar coordinator layout (with animation in this case).
        toolbarCoordinatorLayout.removeContextualToolbar(true);
        annotationCreationToolbar.unbindController();

        // Also unbind the annotation creation controller from the inspector controller.
        annotationCreationInspectorController.unbindAnnotationCreationController();
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    @Override
    public void onEnterAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        annotationEditingActive = true;

        annotationEditingInspectorController.bindAnnotationEditingController(controller);

        annotationEditingToolbar.bindController(controller);
        toolbarCoordinatorLayout.displayContextualToolbar(annotationEditingToolbar, true);
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    @Override
    public void onChangeAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        // Nothing to be done here, if toolbar is bound to the controller it will pick up the changes.
    }

    @Override
    public void onExitAnnotationEditingMode(@NonNull AnnotationEditingController controller) {
        annotationEditingActive = false;

        toolbarCoordinatorLayout.removeContextualToolbar(true);
        annotationEditingToolbar.unbindController();

        annotationEditingInspectorController.unbindAnnotationEditingController();
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    @Override
    public void onEnterTextSelectionMode(@NonNull TextSelectionController controller) {
        textSelectionActive = true;
    }

    @Override
    public void onExitTextSelectionMode(@NonNull TextSelectionController controller) {
        textSelectionActive = false;
    }

    @Override
    public void onEnterFormElementEditingMode(@NonNull FormEditingController controller) {
        formEditingActive = true;

        formEditingInspectorController.bindFormEditingController(controller);
        formEditingBar.bindController(controller);
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    @Override
    public void onChangeFormElementEditingMode(@NonNull FormEditingController controller) {

    }

    @Override
    public void onExitFormElementEditingMode(@NonNull FormEditingController controller) {
        formEditingActive = false;

        formEditingInspectorController.unbindFormEditingController();
        formEditingBar.unbindController();
        parent.manuallyLayoutChildren();
        parent.updateState();
    }

    void resetToolbars() {
        toolbarCoordinatorLayout.removeContextualToolbar(false);
        annotationCreationToolbar.unbindController();
        annotationCreationActive = false;
        annotationCreationInspectorController.unbindAnnotationCreationController();
        annotationEditingToolbar.unbindController();
        annotationEditingInspectorController.unbindAnnotationEditingController();
        formEditingInspectorController.unbindFormEditingController();
        formEditingBar.unbindController();
    }

    boolean isAnnotationCreationActive() {
        return annotationCreationActive;
    }

    boolean isAnnotationEditingActive() {
        return annotationEditingActive;
    }

    boolean isTextSelectionActive() {
        return textSelectionActive;
    }

    boolean isFormEditingActive() {
        return formEditingActive;
    }
}
