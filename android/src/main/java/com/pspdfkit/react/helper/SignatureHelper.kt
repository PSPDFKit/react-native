/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.pspdfkit.react.helper

import android.util.Log
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.document.PdfDocument
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

object SignatureHelper {

    private const val TAG = "SignatureHelper"

    /**
     * Adds the annotation to the document off the main thread and invokes [onComplete] on the
     * main thread when done. `AnnotationProvider.addAnnotationToPage` is suspending and can't
     * be called from Java directly.
     */
    @JvmStatic
    fun addAnnotation(document: PdfDocument, annotation: Annotation, onComplete: Runnable) {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                withContext(Dispatchers.Default) {
                    document.annotationProvider.addAnnotationToPage(annotation)
                }
                onComplete.run()
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to add the picked signature annotation to the document.", e)
            }
        }
    }
}
