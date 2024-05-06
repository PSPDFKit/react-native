/*
 * PdfViewModeController.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2024 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views;

import androidx.annotation.NonNull;

import com.pspdfkit.react.menu.AnnotationContextualToolbarGroupingRule;
import com.pspdfkit.react.menu.ContextualToolbarMenuItemConfig;
import com.pspdfkit.ui.forms.FormEditingBar;
import com.pspdfkit.ui.special_mode.controller.TextSelectionController;
import com.pspdfkit.ui.special_mode.manager.TextSelectionManager;
import com.pspdfkit.ui.toolbar.AnnotationCreationToolbar;
import com.pspdfkit.ui.toolbar.AnnotationEditingToolbar;
import com.pspdfkit.ui.toolbar.ContextualToolbar;
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem;
import com.pspdfkit.ui.toolbar.ToolbarCoordinatorLayout;
import com.pspdfkit.ui.toolbar.grouping.MenuItemGroupingRule;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

/**
 * Keeps track of the currently active mode and handles updating the toolbar states.
 */
class PdfViewModeController implements
    TextSelectionManager.OnTextSelectionModeChangeListener,
    ToolbarCoordinatorLayout.OnContextualToolbarLifecycleListener, FormEditingBar.OnFormEditingBarLifecycleListener {

    private final PdfView parent;

    private boolean annotationCreationActive = false;
    private boolean annotationEditingActive = false;
    private boolean textSelectionActive = false;
    private boolean formEditingActive = false;

    @Nullable
    private MenuItemGroupingRule itemGroupingRule;

    private ContextualToolbarMenuItemConfig annotationSelectionMenuConfig;

    PdfViewModeController(@NonNull PdfView parent) {
        this.parent = parent;
    }

    /**
     * Sets the menu item grouping rule that will be used for the annotation creation toolbar.
     */
    public void setMenuItemGroupingRule(@Nullable MenuItemGroupingRule groupingRule) {
        this.itemGroupingRule = groupingRule;
    }

    /**
     * Sets the annotation menu items used when an annotation is selected.
     */
    public void setAnnotationSelectionMenuConfig(ContextualToolbarMenuItemConfig annotationSelectionMenuConfig) {
        this.annotationSelectionMenuConfig = annotationSelectionMenuConfig;
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

    boolean isAnnotationEditingActive() {
        return annotationEditingActive;
    }

    boolean isTextSelectionActive() {
        return textSelectionActive;
    }

    boolean isFormEditingActive() {
        return formEditingActive;
    }

    @Override
    public void onPrepareContextualToolbar(@NonNull ContextualToolbar contextualToolbar) {
        if (contextualToolbar instanceof AnnotationCreationToolbar) {
            if (itemGroupingRule != null) {
                contextualToolbar.setMenuItemGroupingRule(itemGroupingRule);
            }
        }
        if (contextualToolbar instanceof AnnotationEditingToolbar) {
            if (this.annotationSelectionMenuConfig != null) {
                List<ContextualToolbarMenuItem> annotationSelectionMenuItems = this.annotationSelectionMenuConfig.getAnnotationSelectionMenuItems();
                boolean retainSuggestedMenuItems = this.annotationSelectionMenuConfig.getRetainSuggestedMenuItems();

                if (annotationSelectionMenuItems != null) {
                    final List<ContextualToolbarMenuItem> menuItems = ((AnnotationEditingToolbar) contextualToolbar).getMenuItems();
                    List<ContextualToolbarMenuItem> newList = new ArrayList<>(menuItems);
                    newList.addAll(annotationSelectionMenuItems);
                    contextualToolbar.setMenuItemGroupingRule(new AnnotationContextualToolbarGroupingRule(contextualToolbar.getContext(), annotationSelectionMenuItems));
                    contextualToolbar.setMenuItems(retainSuggestedMenuItems ? newList : annotationSelectionMenuItems);
                }
                contextualToolbar.setOnMenuItemClickListener(this.annotationSelectionMenuConfig.getToolbarMenuItemListener());
            }
        }
    }

    @Override
    public void onDisplayContextualToolbar(@NonNull ContextualToolbar contextualToolbar) {
        if (contextualToolbar instanceof AnnotationCreationToolbar) {
            annotationCreationActive = true;
        }
        if (contextualToolbar instanceof AnnotationEditingToolbar) {
            annotationEditingActive = true;
        }

        parent.updateState();
    }

    @Override
    public void onRemoveContextualToolbar(@NonNull ContextualToolbar contextualToolbar) {
        if (contextualToolbar instanceof AnnotationCreationToolbar) {
            annotationCreationActive = false;
        }
        if (contextualToolbar instanceof AnnotationEditingToolbar) {
            annotationEditingActive = false;
        }

        parent.updateState();
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
}
