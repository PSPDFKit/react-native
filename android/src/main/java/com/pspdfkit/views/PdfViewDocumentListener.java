/*
 * PdfViewDocumentListener.java
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

package com.pspdfkit.views;

import android.annotation.SuppressLint;
import android.graphics.PointF;
import android.view.MotionEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.uimanager.events.EventDispatcher;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.annotations.AnnotationProvider;
import com.pspdfkit.document.DocumentSaveOptions;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.forms.FormElement;
import com.pspdfkit.forms.FormField;
import com.pspdfkit.forms.FormListeners;
import com.pspdfkit.listeners.DocumentListener;
import com.pspdfkit.listeners.scrolling.DocumentScrollListener;
import com.pspdfkit.listeners.scrolling.ScrollState;
import com.pspdfkit.react.NutrientNotificationCenter;
import com.pspdfkit.react.events.PdfViewAnnotationChangedEvent;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDocumentLoadedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSaveFailedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.ui.special_mode.controller.AnnotationSelectionController;
import com.pspdfkit.ui.special_mode.manager.AnnotationManager;
import com.pspdfkit.ui.special_mode.manager.FormManager;

import java.util.List;
import java.util.Map;

class PdfViewDocumentListener implements DocumentListener, AnnotationManager.OnAnnotationSelectedListener, AnnotationManager.OnAnnotationDeselectedListener, AnnotationProvider.OnAnnotationUpdatedListener, FormListeners.OnFormFieldUpdatedListener, FormManager.OnFormElementSelectedListener, FormManager.OnFormElementDeselectedListener, DocumentScrollListener {

    @NonNull
    private final PdfView parent;

    @NonNull
    private final EventDispatcher eventDispatcher;

    private boolean disableDefaultActionForTappedAnnotations = false;
    private boolean disableAutomaticSaving = false;

    PdfViewDocumentListener(@NonNull PdfView parent, @NonNull EventDispatcher eventDispatcher) {
        this.parent = parent;
        this.eventDispatcher = eventDispatcher;
    }

    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        this.disableDefaultActionForTappedAnnotations = disableDefaultActionForTappedAnnotations;
    }

    public void setDisableAutomaticSaving(boolean disableAutomaticSaving) {
        this.disableAutomaticSaving = disableAutomaticSaving;
    }

    @Override
    public void onDocumentLoaded(@NonNull PdfDocument pdfDocument) {
        NutrientNotificationCenter.INSTANCE.documentLoaded(pdfDocument.getDocumentIdString());
        eventDispatcher.dispatchEvent(new PdfViewDocumentLoadedEvent(parent.getId()));
    }

    @Override
    public void onDocumentLoadFailed(@NonNull Throwable throwable) {
        NutrientNotificationCenter.INSTANCE.documentLoadFailed();
    }

    @Override
    public boolean onDocumentSave(@NonNull PdfDocument pdfDocument, @NonNull DocumentSaveOptions documentSaveOptions) {
        return !disableAutomaticSaving;
    }

    @Override
    public void onDocumentSaved(@NonNull PdfDocument pdfDocument) {
        eventDispatcher.dispatchEvent(new PdfViewDocumentSavedEvent(parent.getId()));
    }

    @Override
    public void onDocumentSaveFailed(@NonNull PdfDocument pdfDocument, @NonNull Throwable throwable) {
        eventDispatcher.dispatchEvent(new PdfViewDocumentSaveFailedEvent(parent.getId(), throwable.getMessage()));
    }

    @Override
    public void onDocumentSaveCancelled(PdfDocument pdfDocument) {

    }

    @SuppressLint("CheckResult")
    @Override
    public boolean onPageClick(@NonNull PdfDocument pdfDocument, int pageIndex, @Nullable MotionEvent motionEvent, @Nullable PointF pointF, @Nullable Annotation annotation) {
        String documentID = pdfDocument.getDocumentIdString();
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            NutrientNotificationCenter.INSTANCE.didTapDocument(pointF, documentID);
        }
        if (annotation != null) {
            if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
                NutrientNotificationCenter.INSTANCE.didTapAnnotation(annotation, pointF, documentID);
            }
            eventDispatcher.dispatchEvent(new PdfViewAnnotationTappedEvent(parent.getId(), annotation));
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
                NutrientNotificationCenter.INSTANCE.documentPageChanged(pageIndex, documentID);
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
        return !disableDefaultActionForTappedAnnotations;
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationSelected(@NonNull Annotation annotation, boolean annotationCreated) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.didSelectAnnotations(annotation, documentID);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationCreated(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("added", annotation, documentID);
            });
        }
        eventDispatcher.dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotation));
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationUpdated(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("changed", annotation, documentID);
            });
        }
        eventDispatcher.dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation));
    }

    @SuppressLint("CheckResult")
    @Override
    public void onAnnotationRemoved(@NonNull Annotation annotation) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.annotationsChanged("removed", annotation, documentID);
            });
        }
        eventDispatcher.dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_REMOVED, annotation));
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
                NutrientNotificationCenter.INSTANCE.formFieldValuesUpdated(formField, documentID);
            });
        }
        Annotation annotation = formField.getFormElement().getAnnotation();
        if (annotation != null) {
            eventDispatcher.dispatchEvent(new PdfViewAnnotationChangedEvent(parent.getId(), PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation));
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
                NutrientNotificationCenter.INSTANCE.didDeselectAnnotations(annotation, documentID);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onFormElementSelected(@NonNull FormElement formElement) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.didSelectFormField(formElement, documentID);
            });
        }
    }

    @SuppressLint("CheckResult")
    @Override
    public void onFormElementDeselected(@NonNull FormElement formElement, boolean b) {
        if (NutrientNotificationCenter.INSTANCE.getIsNotificationCenterInUse()) {
            parent.getPdfFragment().subscribe(pdfFragment -> {
                String documentID = pdfFragment.getDocument().getDocumentIdString();
                NutrientNotificationCenter.INSTANCE.didDeSelectFormField(formElement, documentID);
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
                NutrientNotificationCenter.INSTANCE.documentScrolled(Map.of("currX", currX, "currY", currY, "maxX", maxX, "maxY", maxY, "extendX", extendX, "extendY", extendY), documentID);
            });
        }
    }
}
