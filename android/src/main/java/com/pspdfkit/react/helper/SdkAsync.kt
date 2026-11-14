package com.pspdfkit.react.helper

import android.content.Context
import android.net.Uri
import android.util.Log
import com.pspdfkit.document.DocumentSource
import com.pspdfkit.document.ImageDocument
import com.pspdfkit.document.ImageDocumentLoader
import com.pspdfkit.document.PdfDocument
import com.pspdfkit.document.PdfDocumentLoader
import com.pspdfkit.document.html.HtmlToPdfConverter
import com.pspdfkit.document.processor.PdfProcessor
import com.pspdfkit.document.processor.PdfProcessorTask
import com.pspdfkit.forms.FormElement
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.launch
import java.io.File
import java.util.function.Consumer

/**
 * Java entry points for the Nutrient SDK's suspending and `Flow` APIs, which Java can't call directly.
 *
 * Each call runs in a coroutine and reports back on the main thread. Cancelling the returned
 * [Cancellable] drops the result: neither callback runs, as when disposing the RxJava
 * subscription this replaces.
 */
object SdkAsync {
    private const val TAG = "SdkAsync"

    fun interface Cancellable {
        fun cancel()
    }

    interface Callback<T> {
        fun onSuccess(result: T)
        fun onError(error: Throwable)
    }

    interface Completion {
        fun onComplete()
        fun onError(error: Throwable)
    }

    /** Builds a [Callback] from two lambdas, for Java callers. */
    @JvmStatic
    fun <T> callback(onSuccess: Consumer<T>, onError: Consumer<Throwable>): Callback<T> = object : Callback<T> {
        override fun onSuccess(result: T) = onSuccess.accept(result)
        override fun onError(error: Throwable) = onError.accept(error)
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    private fun <T> launch(callback: Callback<T>, block: suspend () -> T): Cancellable {
        val job = scope.launch {
            val result = try {
                block()
            } catch (cancellation: CancellationException) {
                throw cancellation
            } catch (error: Throwable) {
                deliver { callback.onError(error) }
                return@launch
            }
            deliver { callback.onSuccess(result) }
        }
        return Cancellable { job.cancel() }
    }

    // A callback that throws is logged instead of crashing the app, as the global RxJava error
    // handler used to swallow these.
    private inline fun deliver(block: () -> Unit) {
        try {
            block()
        } catch (error: Throwable) {
            Log.e(TAG, "Callback failed", error)
        }
    }

    private fun launch(completion: Completion, block: suspend () -> Unit): Cancellable =
        launch(object : Callback<Unit> {
            override fun onSuccess(result: Unit) = completion.onComplete()
            override fun onError(error: Throwable) = completion.onError(error)
        }, block)

    @JvmStatic
    fun openPdfDocument(context: Context, uri: Uri, password: String?, callback: Callback<PdfDocument>): Cancellable =
        launch(callback) { PdfDocumentLoader.openDocumentAsync(context, uri, password) }

    @JvmStatic
    fun openImageDocument(context: Context, source: DocumentSource, callback: Callback<ImageDocument>): Cancellable =
        launch(callback) { ImageDocumentLoader.openDocumentAsync(context, source) }

    @JvmStatic
    fun getFormElementWithName(document: PdfDocument, name: String, callback: Callback<FormElement?>): Cancellable =
        launch(callback) { document.formProvider.getFormElementWithName(name) }

    @JvmStatic
    fun processDocument(task: PdfProcessorTask, outputFile: File, completion: Completion): Cancellable =
        launch(completion) { PdfProcessor.processDocumentAsync(task, outputFile).flowOn(Dispatchers.IO).collect() }

    /** Converts on the main thread, which the converter's web view requires. */
    @JvmStatic
    fun convertToPdf(converter: HtmlToPdfConverter, outputFile: File, completion: Completion): Cancellable =
        launch(completion) { converter.convertToPdfAsync(outputFile) }
}
