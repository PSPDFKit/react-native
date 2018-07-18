package com.pspdfkit.views;

import android.graphics.PointF;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.MotionEvent;

import com.facebook.react.uimanager.events.EventDispatcher;
import com.pspdfkit.annotations.Annotation;
import com.pspdfkit.document.DocumentSaveOptions;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.listeners.DocumentListener;
import com.pspdfkit.react.events.PdfViewAnnotationTappedEvent;
import com.pspdfkit.react.events.PdfViewDocumentSavedEvent;
import com.pspdfkit.ui.special_mode.controller.AnnotationSelectionController;
import com.pspdfkit.ui.special_mode.manager.AnnotationManager;

class PdfViewDocumentListener implements DocumentListener, AnnotationManager.OnAnnotationSelectedListener {

    @NonNull
    private final PdfView parent;

    @NonNull
    private final EventDispatcher eventDispatcher;

    private boolean disableDefaultActionForTappedAnnotations = false;

    PdfViewDocumentListener(@NonNull PdfView parent, @NonNull EventDispatcher eventDispatcher) {
        this.parent = parent;
        this.eventDispatcher = eventDispatcher;
    }


    public void setDisableDefaultActionForTappedAnnotations(boolean disableDefaultActionForTappedAnnotations) {
        this.disableDefaultActionForTappedAnnotations = disableDefaultActionForTappedAnnotations;
    }

    @Override
    public void onDocumentLoaded(@NonNull PdfDocument pdfDocument) {

    }

    @Override
    public void onDocumentLoadFailed(@NonNull Throwable throwable) {

    }

    @Override
    public boolean onDocumentSave(@NonNull PdfDocument pdfDocument, @NonNull DocumentSaveOptions documentSaveOptions) {
        return true;
    }

    @Override
    public void onDocumentSaved(@NonNull PdfDocument pdfDocument) {
        eventDispatcher.dispatchEvent(new PdfViewDocumentSavedEvent(parent.getId()));
    }

    @Override
    public void onDocumentSaveFailed(@NonNull PdfDocument pdfDocument, @NonNull Throwable throwable) {

    }

    @Override
    public void onDocumentSaveCancelled(PdfDocument pdfDocument) {

    }

    @Override
    public boolean onPageClick(@NonNull PdfDocument pdfDocument, int i, @Nullable MotionEvent motionEvent, @Nullable PointF pointF, @Nullable Annotation annotation) {
        return false;
    }

    @Override
    public boolean onDocumentClick() {
        return false;
    }

    @Override
    public void onPageChanged(@NonNull PdfDocument pdfDocument, int i) {

    }

    @Override
    public void onDocumentZoomed(@NonNull PdfDocument pdfDocument, int i, float v) {

    }

    @Override
    public void onPageUpdated(@NonNull PdfDocument pdfDocument, int i) {

    }

    @Override
    public boolean onPrepareAnnotationSelection(@NonNull AnnotationSelectionController annotationSelectionController, @NonNull Annotation annotation, boolean annotationCreated) {
        eventDispatcher.dispatchEvent(new PdfViewAnnotationTappedEvent(parent.getId(), annotation));
        return !disableDefaultActionForTappedAnnotations;
    }

    @Override
    public void onAnnotationSelected(@NonNull Annotation annotation, boolean annotationCreated) {
    }
}