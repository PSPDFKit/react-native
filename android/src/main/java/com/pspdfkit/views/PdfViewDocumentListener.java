/*
 * PdfViewDocumentListener.java
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
import android.graphics.PointF;
import android.view.MotionEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.annotations.AnnotationProvider;
import com.pspdfkit.bookmarks.Bookmark;
import com.pspdfkit.bookmarks.BookmarkProvider;
import com.pspdfkit.document.DocumentSaveOptions;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.forms.FormElement;
import com.pspdfkit.forms.FormField;
import com.pspdfkit.forms.FormListeners;
import com.pspdfkit.listeners.DocumentListener;
import com.pspdfkit.listeners.scrolling.DocumentScrollListener;
import com.pspdfkit.listeners.scrolling.ScrollState;
import com.pspdfkit.react.NutrientNotificationCenter;
import com.pspdfkit.react.events.OnReadyEvent;
import com.pspdfkit.react.events.PdfViewAnnotationChangedEvent;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSaveFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.ui.special_mode.controller.AnnotationSelectionController;
import com.pspdfkit.ui.special_mode.manager.AnnotationManager;
import com.pspdfkit.ui.special_mode.manager.FormManager;
import com.pspdfkit.utils.Size;

import java.util.List;
import java.util.Map;

class PdfViewDocumentListener implements DocumentListener, com.pspdfkit.ui.annotations.OnAnnotationSelectedListener, AnnotationProvider.OnAnnotationUpdatedListener, FormListeners.OnFormFieldUpdatedListener, FormManager.OnFormElementSelectedListener, FormManager.OnFormElementDeselectedListener, DocumentScrollListener, BookmarkProvider.BookmarkListener {

    @NonNull
    private final PdfView parent;

    @NonNull
    private final EventDispatcher eventDispatcher;
    private final boolean isFabricMode;
    private final PdfView.PdfViewDelegate fabricDelegate;

    private boolean disableDefaultActionForTappedAnnotations = false;
    private boolean disableAutomaticSaving = false;
    private ReadableArray excludedAnnotations;

    PdfViewDocumentListener(@NonNull PdfView parent, @NonNull EventDispatcher eventDispatcher) {
        this(parent, eventDispatcher, false, null);
    }

    PdfViewDocumentListener(@NonNull PdfView parent, @NonNull EventDispatcher eventDispatcher, boolean isFabricMode, @Nullable PdfView.PdfViewDelegate fabricDelegate) {
        this.parent = parent;
        this.eventDispatcher = eventDispatcher;
        this.isFabricMode = isFabricMode;
        this.fabricDelegate = fabricDelegate;
    }

    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        this.disableDefaultActionForTappedAnnotations = disableDefaultActionForTappedAnnotations;
    }

    public void setDisableAutomaticSaving(boolean disableAutomaticSaving) {
        this.disableAutomaticSaving = disableAutomaticSaving;
    }

    public void setExcludedAnnotations(ReadableArray annotations) {
        this.excludedAnnotations = annotations;
    }

    /**
     * Routes events to React via EventDispatcher.
     * Note: Fabric events are dispatched by the Fabric ViewManager; this listener always uses EventDispatcher.
     */
    private void dispatchEvent(com.facebook.react.uimanager.events.Event event) {
        eventDispatcher.dispatchEvent(event);
    }

    @Override
    public void onDocumentLoaded(@NonNull PdfDocument pdfDocument) {
        int componentId = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
        NutrientNotificationCenter.INSTANCE.documentLoaded(pdfDocument.getDocumentIdString(), componentId);
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onReady();
            fabricDelegate.onDocumentLoaded();
        } else {
            dispatchEvent(new OnReadyEvent(parent.getId()));
            dispatchEvent(new PdfViewDocumentLoadedEvent(parent.getId()));
        }
    }

    @Override
    public void onDocumentLoadFailed(@NonNull Throwable throwable) {
        int componentIdOnFail = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
        // Determine error code based on exception type
        String code = (throwable instanceof com.pspdfkit.exceptions.InvalidPasswordException) ? "ENCRYPTED" : "CORRUPTED";
        String message = throwable.getMessage() != null ? throwable.getMessage() : "Document failed to load";
        NutrientNotificationCenter.INSTANCE.documentLoadFailed(code, message, componentIdOnFail);
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onReady();
            fabricDelegate.onDocumentLoadFailed(throwable);
        } else {
            dispatchEvent(new OnReadyEvent(parent.getId()));
            dispatchEvent(new com.pspdfkit.react.events.PdfViewDocumentLoadFailedEvent(parent.getId(), throwable.getMessage()));
        }
    }

    @Override
    public boolean onDocumentSave(@NonNull PdfDocument pdfDocument, @NonNull DocumentSaveOptions documentSaveOptions) {
        return !disableAutomaticSaving;
    }

    @Override
    public void onDocumentSaved(@NonNull PdfDocument pdfDocument) {
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onDocumentSaved();
        } else {
            dispatchEvent(new PdfViewDocumentSavedEvent(parent.getId()));
        }
    }

    @Override
    public void onDocumentSaveFailed(@NonNull PdfDocument pdfDocument, @NonNull Throwable throwable) {
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onDocumentSaveFailed(throwable.getMessage());
        } else {
            dispatchEvent(new PdfViewDocumentSaveFailedEvent(parent.getId(), throwable.getMessage()));
        }
    }

    @Override
    public void onDocumentSaveCancelled(PdfDocument pdfDocument) {

    }

    @SuppressLint("CheckResult")
    @Override
    public boolean onPageClick(@NonNull PdfDocument pdfDocument, int pageIndex, @Nullable MotionEvent motionEvent, @Nullable PointF pointF, @Nullable Annotation annotation) {
        String documentID = pdfDocument.getDocumentIdString();
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            if (pointF != null) {
                // Calculate the inverted point on the y-axis using page size
                Size size = pdfDocument.getPageSize(pageIndex);
                PointF clickedPoint = new PointF(pointF.x, size.height - pointF.y);
                int componentIdTap = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didTapDocument(clickedPoint, pageIndex, documentID, componentIdTap);
            }
        }
        if (annotation != null) {
            if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
                if (pointF == null) {
                    pointF = new PointF(0,0);
                }
                int componentIdAnn = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didTapAnnotation(annotation, pointF, documentID, componentIdAnn);
            }
            if (isFabricMode && fabricDelegate != null) {
                fabricDelegate.onAnnotationTapped(annotation);
            } else {
                dispatchEvent(new PdfViewAnnotationTappedEvent(parent.getId(), annotation));
            }
        }
        
        return false;
    }

    @Override
    public boolean onDocumentClick() {
        return false;
    }

    @SuppressLint("CheckResult")
    @Override
    public void onPageChanged(@NonNull PdfDocument pdfDocument, int pageIndex) {
        parent.updateState(pageIndex);
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdPg = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.documentPageChanged(pageIndex, documentID, componentIdPg);
            });
        }
    }

    @Override
    public void onDocumentZoomed(@NonNull PdfDocument pdfDocument, int i, float v) {

    }

    @Override
    public void onPageUpdated(@NonNull PdfDocument pdfDocument, int i) {

    }

    @Override
    public boolean onPrepareAnnotationSelection(@NonNull AnnotationSelectionController annotationSelectionController, @NonNull Annotation annotation, boolean annotationCreated) {
        // First check if default action should be disabled
        if (disableDefaultActionForTappedAnnotations) {
            return false;
        }

        // Check if this annotation should be excluded
        ReadableArray excludedAnnotations = this.excludedAnnotations;
        if (excludedAnnotations != null && excludedAnnotations.size() > 0) {
            String annotationUuid = annotation.getUuid();
            String annotationName = annotation.getName();

            for (int i = 0; i < excludedAnnotations.size(); i++) {
                String excludedUuid = excludedAnnotations.getString(i);
                if (excludedUuid != null &&
                        (excludedUuid.equals(annotationUuid) ||
                                (annotationName != null && excludedUuid.equals(annotationName)))) {
                    return false; // Exclude this annotation
                }
            }
        }

        return true; // Allow selection
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationSelected(@NonNull Annotation annotation, boolean annotationCreated) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdSel = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didSelectAnnotations(annotation, documentID, componentIdSel);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationCreated(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdAdd = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("added", annotation, documentID, componentIdAdd);
            });
        }
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onAnnotationsChanged("added", annotation);
        } else {
            dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotation));
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationUpdated(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdChg = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("changed", annotation, documentID, componentIdChg);
            });
        }
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onAnnotationsChanged("changed", annotation);
        } else {
            dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation));
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationRemoved(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdRem = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("removed", annotation, documentID, componentIdRem);
            });
        }
        if (isFabricMode && fabricDelegate != null) {
            fabricDelegate.onAnnotationsChanged("removed", annotation);
        } else {
            dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_REMOVED, annotation));
        }
    }

    @Override
    public void onAnnotationZOrderChanged(int i, @NonNull List<Annotation> list, @NonNull List<Annotation> list1) {
        // Not required.
    }

    @SuppressLint("CheckResult")
    @Override
    public void onFormFieldUpdated(@NonNull FormField formField) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdForm = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.formFieldValuesUpdated(formField, documentID, componentIdForm);
            });
        }
        Annotation annotation = formField.getFormElement().getAnnotation();
        if (annotation != null) {
            if (isFabricMode && fabricDelegate != null) {
                fabricDelegate.onAnnotationsChanged("changed", annotation);
            } else {
                dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation));
            }
        }
    }

    @Override
    public void onFormFieldReset(@NonNull FormField formField, @NonNull FormElement formElement) {
        // Not used.
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationDeselected(@NonNull Annotation annotation, boolean b) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdDesel = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didDeselectAnnotations(annotation, documentID, componentIdDesel);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onFormElementSelected(@NonNull FormElement formElement) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdFormSel = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didSelectFormField(formElement, documentID, componentIdFormSel);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onFormElementDeselected(@NonNull FormElement formElement, boolean b) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdFormDesel = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.didDeSelectFormField(formElement, documentID, componentIdFormDesel);
            });
        }
    }

    @Override
    public void onScrollStateChanged(@NonNull ScrollState scrollState) {
        // Nothing to do here
    }

    @SuppressLint("CheckResult")
    @Override
    public void onDocumentScrolled(int currX, int currY, int maxX, int maxY, int extendX, int extendY) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdScroll = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.documentScrolled(Map.of("currX", currX, "currY", currY, "maxX", maxX, "maxY", maxY, "extendX", extendX, "extendY", extendY), documentID, componentIdScroll);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onBookmarksChanged(@NonNull List<Bookmark> list) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                int componentIdBm = parent.isFabricMode() ? (parent.getComponentReferenceId() != null ? parent.getComponentReferenceId() : parent.getId()) : parent.getId();
                NutrientNotificationCenter.INSTANCE.bookmarksChanged(list, documentID, componentIdBm);
            });
        }
    }

    @Override
    public void onBookmarkAdded(@NonNull Bookmark bookmark) {
        BookmarkProvider.BookmarkListener.super.onBookmarkAdded(bookmark);
    }
}
