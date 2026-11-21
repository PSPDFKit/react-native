/*
 * PdfViewModeController.java
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


import androidx.annotation.NonNull;

import com.pspdfkit.datastructures.TextSelection;
import com.pspdfkit.react.NutrientNotificationCenter;
import com.pspdfkit.ui.PdfUiFragment;
import com.pspdfkit.ui.forms.FormEditingBar;
import com.pspdfkit.ui.special_mode.controller.TextSelectionController;
import com.pspdfkit.ui.special_mode.manager.TextSelectionManager;
import com.pspdfkit.ui.toolbar.grouping.MenuItemGroupingRule;

import java.util.List;

import javax.annotation.Nullable;

/**
 * Keeps track of the currently active mode and handles updating the toolbar states.
 */
class PdfViewModeController implements
    TextSelectionManager.OnTextSelectionModeChangeListener, TextSelectionManager.OnTextSelectionChangeListener,
    FormEditingBar.OnFormEditingBarLifecycleListener,
    ContextualToolbarBridge.Listener {

    private final PdfView parent;

    /**
     * The contextual toolbars moved to Compose, so the annotation toolbar's lifecycle and docking
     * position are observed through the toolbar coordinator rather than the removed
     * {@code ToolbarCoordinatorLayout} listener interfaces.
     */
    private final ContextualToolbarBridge contextualToolbarBridge = new ContextualToolbarBridge(this);

    private boolean annotationCreationActive = false;
    private boolean textSelectionActive = false;
    private boolean formEditingActive = false;

    @Nullable
    private PdfUiFragment boundFragment;

    PdfViewModeController(@NonNull PdfView parent) {
        this.parent = parent;
    }

    /**
     * Binds to {@code fragment}'s toolbar coordinator. Called again for every fragment the
     * {@link PdfView} attaches, including the replacement created on a configuration change.
     */
    void attachToFragment(@NonNull PdfUiFragment fragment) {
        boundFragment = fragment;
        contextualToolbarBridge.attach(fragment);
    }

    /**
     * Releases the toolbar coordinator subscription, and reports annotation creation as ended if
     * the fragment's annotation toolbar was shown.
     */
    void detachFromFragment() {
        contextualToolbarBridge.detach();
        boundFragment = null;
    }

    /**
     * Restricts the docks the contextual toolbars can be dragged to, or lifts the restriction for
     * {@code null}.
     */
    void setSupportedToolbarPositions(@Nullable List<String> positions) {
        contextualToolbarBridge.setSupportedToolbarPositions(positions);
    }

    /**
     * Sets the menu item grouping rule that will be used for the annotation creation toolbar.
     */
    public void setMenuItemGroupingRule(@Nullable MenuItemGroupingRule groupingRule) {
        contextualToolbarBridge.setMenuItemGroupingRule(boundFragment, groupingRule);
    }

    /**
     * Sets whether the stylus button should be shown on the annotation creation toolbar.
     */
    public void setShowStylusButton(boolean showStylusButton) {
        contextualToolbarBridge.setShowStylusButton(showStylusButton);
    }

    /**
     * Returns whether the stylus button should be shown on the annotation creation toolbar.
     */
    public boolean getShowStylusButton() {
        return contextualToolbarBridge.getShowStylusButton();
    }

    @Override
    public void onEnterTextSelectionMode(@NonNull TextSelectionController controller) {
        textSelectionActive = true;
    }

    @Override
    public void onExitTextSelectionMode(@NonNull TextSelectionController controller) {
        textSelectionActive = false;
    }

    boolean isAnnotationCreationActive() {
        return annotationCreationActive;
    }

    boolean isTextSelectionActive() {
        return textSelectionActive;
    }

    boolean isFormEditingActive() {
        return formEditingActive;
    }

    @Override
    public void onAnnotationToolbarVisibilityChanged(boolean visible) {
        annotationCreationActive = visible;
        parent.updateState();
    }

    @Override
    public void onContextualToolbarPositionChanged(@NonNull String position) {
        parent.setToolbarPosition(position);
    }

    @Override
    @Nullable
    public String getPreferredToolbarPosition() {
        return parent.getToolbarPosition();
    }

    @Override
    public void onPrepareFormEditingBar(@NonNull FormEditingBar formEditingBar) {
        // Not required.
    }

    @Override
    public void onDisplayFormEditingBar(@NonNull FormEditingBar formEditingBar) {
        formEditingActive = true;

        parent.updateState();
    }

    @Override
    public void onRemoveFormEditingBar(@NonNull FormEditingBar formEditingBar) {
        formEditingActive = false;

        parent.updateState();
    }

    @Override
    public boolean onBeforeTextSelectionChange(@androidx.annotation.Nullable TextSelection textSelection, @androidx.annotation.Nullable TextSelection textSelection1) {
        return true;
    }

    @Override
    public void onAfterTextSelectionChange(@androidx.annotation.Nullable TextSelection textSelection, @androidx.annotation.Nullable TextSelection textSelection1) {
        if (textSelection != null && textSelection.text != null) {
            if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
                parent.withPdfFragment(pdfFragment -> {
                    String documentID = pdfFragment.getDocument().getDocumentIdString();
                    int componentId = parent.isFabricMode() && parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId();
                    NutrientNotificationCenter.INSTANCE.didSelectText(textSelection.text, documentID, componentId);
                });
            }
        }
    }
}
