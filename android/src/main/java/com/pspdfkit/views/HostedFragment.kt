package com.pspdfkit.views

import android.util.Log
import com.pspdfkit.react.helper.SdkAsync
import com.pspdfkit.ui.PdfFragment
import com.pspdfkit.ui.PdfUiFragment
import java.util.function.Consumer
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.mapNotNull
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull

/**
 * The [PdfUiFragment] a [PdfView] hosts, handed out now or once one is attached.
 *
 * This replaces the RxJava subject the view used for it. Like the `take(1).observeOn(mainThread())`
 * chains it replaces, a request runs once, on the main thread, after the current call returns, and a
 * request made while no fragment is attached waits for the next one. An observer runs for the
 * attached fragment and every fragment that replaces it. [cancelPendingRequests] drops every request
 * that hasn't run yet; one made with a timeout reports that no fragment is available.
 *
 * An action that throws is logged instead of crashing the app, as the global RxJava error handler
 * used to swallow these.
 */
internal class HostedFragment {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    // Replays the latest fragment like a BehaviorSubject, and keeps every publish distinct.
    private val fragments = MutableSharedFlow<PdfUiFragment?>(replay = 1, onBufferOverflow = BufferOverflow.DROP_OLDEST)

    /** The attached fragment, or `null` if there is none. */
    val current: PdfUiFragment?
        get() = fragments.replayCache.firstOrNull()

    /** Hands out a newly attached or replaced fragment, or `null` once it's removed. */
    fun publish(fragment: PdfUiFragment?) {
        fragments.tryEmit(fragment)
    }

    fun withPdfUiFragment(action: Consumer<PdfUiFragment>): SdkAsync.Cancellable =
        launch { run(action, fragments.filterNotNull().first()) }

    fun withPdfFragment(action: Consumer<PdfFragment>): SdkAsync.Cancellable =
        launch { run(action, pdfFragments().first()) }

    /**
     * Like [withPdfFragment], but runs [onUnavailable] instead if no fragment is attached in time, or
     * if the request is dropped first, such as by [cancelPendingRequests]. Either way the caller
     * hears back once, so a promise waiting on the request always settles.
     */
    fun withPdfFragment(timeoutMillis: Long, action: Consumer<PdfFragment>, onUnavailable: Runnable): SdkAsync.Cancellable {
        val unavailable = Consumer<Unit> { onUnavailable.run() }
        var answered = false
        val job = scope.launch {
            val pdfFragment = withTimeoutOrNull(timeoutMillis) { pdfFragments().first() }
            answered = true
            if (pdfFragment != null) run(action, pdfFragment) else run(unavailable, Unit)
        }
        // Also covers a request cancelled before it started running.
        job.invokeOnCompletion { cause -> if (cause is CancellationException && !answered) run(unavailable, Unit) }
        return SdkAsync.Cancellable { job.cancel() }
    }

    /**
     * Runs [change] with the current [PdfFragment] on a background thread, then reports the outcome
     * on the main thread. [cancelPendingRequests] covers the whole request: a change that hasn't
     * started is dropped, and one that is already running finishes but isn't reported. Either way
     * [onError] hears that the view was closed, so a promise waiting on the change still settles.
     */
    fun changeInBackground(change: Consumer<PdfFragment>, onComplete: Runnable?, onError: Consumer<Throwable>?): SdkAsync.Cancellable {
        var answered = false
        val job = scope.launch {
            val pdfFragment = pdfFragments().first()
            // A running change can't be interrupted. If the request is cancelled meanwhile,
            // withContext throws once the change returns, which skips the callbacks below.
            val failure = withContext(Dispatchers.IO) {
                try {
                    change.accept(pdfFragment)
                    null
                } catch (cancellation: CancellationException) {
                    throw cancellation
                } catch (error: Throwable) {
                    error
                }
            }
            answered = true
            if (failure == null) {
                if (onComplete != null) run(Consumer { onComplete.run() }, Unit)
            } else if (onError != null) {
                run(onError, failure)
            }
        }
        // Also covers a request cancelled before it started running.
        job.invokeOnCompletion { cause ->
            if (cause is CancellationException && !answered && onError != null) {
                run(onError, IllegalStateException("The PDF view was closed before the mode change finished"))
            }
        }
        return SdkAsync.Cancellable { job.cancel() }
    }

    /** Runs [observer] for the attached [PdfFragment] and every one that replaces it. */
    fun observePdfFragments(observer: Consumer<PdfFragment>): SdkAsync.Cancellable =
        launch { pdfFragments().collect { run(observer, it) } }

    fun cancelPendingRequests() {
        scope.coroutineContext.cancelChildren()
    }

    private fun pdfFragments() = fragments.mapNotNull { it?.pdfFragment }

    private fun launch(block: suspend CoroutineScope.() -> Unit): SdkAsync.Cancellable {
        val job = scope.launch(block = block)
        return SdkAsync.Cancellable { job.cancel() }
    }

    private fun <T> run(action: Consumer<T>, value: T) {
        try {
            action.accept(value)
        } catch (cancellation: CancellationException) {
            throw cancellation
        } catch (error: Throwable) {
            Log.e(TAG, "Fragment action failed", error)
        }
    }

    private companion object {
        const val TAG = "HostedFragment"
    }
}
