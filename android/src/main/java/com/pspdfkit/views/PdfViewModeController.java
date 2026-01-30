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

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;

import com.pspdfkit.datastructures.TextSelection;
import com.pspdfkit.react.NutrientNotificationCenter;
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
import java.util.EnumSet;
import java.util.List;

import javax.annotation.Nullable;

/**
 * Keeps track of the currently active mode and handles updating the toolbar states.
 */
class PdfViewModeController implements
    TextSelectionManager.OnTextSelectionModeChangeListener, TextSelectionManager.OnTextSelectionChangeListener,
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
        // Apply toolbar position configuration
        String toolbarPosition = parent.getToolbarPosition();
        com.facebook.react.bridge.ReadableArray supportedPositions = parent.getSupportedToolbarPositions();
        
        if (toolbarPosition != null || supportedPositions != null) {
            ToolbarCoordinatorLayout.LayoutParams.Position position = null;
            EnumSet<ToolbarCoordinatorLayout.LayoutParams.Position> supportedPositionsSet = null;
            
            // Convert supported positions string array to EnumSet
            if (supportedPositions != null) {
                supportedPositionsSet = EnumSet.noneOf(ToolbarCoordinatorLayout.LayoutParams.Position.class);
                for (int i = 0; i < supportedPositions.size(); i++) {
                    String pos = supportedPositions.getString(i);
                    if ("top".equals(pos)) {
                        supportedPositionsSet.add(ToolbarCoordinatorLayout.LayoutParams.Position.TOP);
                    } else if ("left".equals(pos)) {
                        supportedPositionsSet.add(ToolbarCoordinatorLayout.LayoutParams.Position.LEFT);
                    } else if ("right".equals(pos)) {
                        supportedPositionsSet.add(ToolbarCoordinatorLayout.LayoutParams.Position.RIGHT);
                    }
                }
            }
            
            // Convert toolbar position string to enum
            if (toolbarPosition != null) {
                if ("top".equals(toolbarPosition)) {
                    position = ToolbarCoordinatorLayout.LayoutParams.Position.TOP;
                } else if ("left".equals(toolbarPosition)) {
                    position = ToolbarCoordinatorLayout.LayoutParams.Position.LEFT;
                } else if ("right".equals(toolbarPosition)) {
                    position = ToolbarCoordinatorLayout.LayoutParams.Position.RIGHT;
                }
            }
            
            // Set toolbar position and supported positions
            if (supportedPositionsSet != null && !supportedPositionsSet.isEmpty()) {
                // If both position and supported positions are set, use LayoutParams
                ToolbarCoordinatorLayout.LayoutParams.Position finalPosition;
                if (position != null) {
                    finalPosition = position;
                } else {
                    // Only supported positions set, use first supported position as default
                    finalPosition = supportedPositionsSet.iterator().next();
                }
                
                // Create and set LayoutParams with position and supported positions
                contextualToolbar.setLayoutParams(new ToolbarCoordinatorLayout.LayoutParams(finalPosition, supportedPositionsSet));
            } else if (position != null) {
                // Only position is set, use setPosition method
                contextualToolbar.setPosition(position);
            }
        }
        
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

    @Override
    public boolean onBeforeTextSelectionChange(@androidx.annotation.Nullable TextSelection textSelection, @androidx.annotation.Nullable TextSelection textSelection1) {
        return true;
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAfterTextSelectionChange(@androidx.annotation.Nullable TextSelection textSelection, @androidx.annotation.Nullable TextSelection textSelection1) {
        if (textSelection != null && textSelection.text != null) {
            if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
                parent.getPdfFragment().subscribe(pdfFragment -> {
                    String documentID = pdfFragment.getDocument().getDocumentIdString();
                    int componentId = parent.isFabricMode() && parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId();
                    NutrientNotificationCenter.INSTANCE.didSelectText(textSelection.text, documentID, componentId);
                });
            }
        }
    }
}
