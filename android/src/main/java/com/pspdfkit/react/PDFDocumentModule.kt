package com.pspdfkit.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.pspdfkit.document.PdfDocument

@ReactModule(name = PDFDocumentModule.NAME)
class PDFDocumentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var documents = mutableMapOf<Int, PdfDocument>()

    override fun getName(): String {
        return NAME
    }

    private fun getDocument(reference: Int): PdfDocument? {
        return this.documents[reference]
    }

    fun setDocument(document: PdfDocument, reference: Int) {
        this.documents[reference] = document
    }

    @ReactMethod fun getDocumentId(reference: Int, promise: Promise) {
        try {
            // Using uid here until Android exposes the documentId property.
            promise.resolve(this.getDocument(reference)?.uid)
        } catch (e: Throwable) {
            promise.reject("getDocumentId error", e)
        }
    }

    @ReactMethod fun invalidateCacheForPage(reference: Int, pageIndex: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.invalidateCacheForPage(pageIndex)
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("invalidateCacheForPage error", e)
        }
    }

    @ReactMethod fun invalidateCache(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.invalidateCache()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("invalidateCache error", e)
        }
    }

    companion object {
        const val NAME = "PDFDocumentManager"
    }
}