package com.pspdfkit.react.menu

import com.pspdfkit.listeners.OnPreparePopupToolbarListener
import com.pspdfkit.ui.toolbar.popup.AnnotationPopupToolbar
import com.pspdfkit.ui.toolbar.popup.TextSelectionPopupToolbar
import com.pspdfkit.views.PdfView

/**
 * Single [OnPreparePopupToolbarListener] instance that applies both React Native customizations:
 * - `textSelectionContextualMenu` → text selection popup toolbar
 * - `annotationContextualMenu` → annotation popup toolbar (Nutrient 11.3+)
 *
 * PdfFragment only supports one listener instance at a time.
 */
object NutrientPopupMenuBridge {

    @JvmStatic
    fun createPrepareListener(pdfView: PdfView): OnPreparePopupToolbarListener {
        return object : OnPreparePopupToolbarListener {
            override fun onPrepareTextSelectionPopupToolbar(toolbar: TextSelectionPopupToolbar) {
                val cfg = pdfView.textSelectionPopupMenuConfig ?: return
                NutrientTextSelectionPopupMenuBridge.applyTextSelectionPopupConfig(toolbar, cfg, pdfView)
            }

            override fun onPrepareAnnotationPopupToolbar(toolbar: AnnotationPopupToolbar) {
                val cfg = pdfView.annotationPopupMenuConfig ?: return
                NutrientAnnotationPopupMenuBridge.applyAnnotationPopupConfig(toolbar, cfg, pdfView)
            }
        }
    }
}
