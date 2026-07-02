/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * View that hosts InstantPdfUiFragment for embedded Instant documents (New Architecture only).
 */

package com.pspdfkit.views

import android.content.Context
import android.net.Uri
import android.os.Handler
import android.os.Bundle
import android.util.AttributeSet
import android.util.Log
import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.FragmentManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.EventDispatcher
import com.pspdfkit.configuration.PdfConfiguration
import com.pspdfkit.configuration.activity.PdfActivityConfiguration
import com.pspdfkit.document.PdfDocument
import com.pspdfkit.instant.ui.InstantPdfFragment
import com.pspdfkit.instant.document.InstantPdfDocument
import com.pspdfkit.instant.exceptions.InstantException
import com.pspdfkit.instant.listeners.InstantDocumentListener
import com.pspdfkit.listeners.DocumentListener
import com.pspdfkit.listeners.scrolling.DocumentScrollListener
import com.pspdfkit.listeners.scrolling.ScrollState
import com.pspdfkit.react.ConfigurationAdapter
import com.pspdfkit.react.NutrientNotificationCenter
import com.pspdfkit.react.R
import com.pspdfkit.react.helper.JsonUtilities
import com.pspdfkit.ui.PdfFragment
import com.pspdfkit.ui.PdfUiFragment
import com.pspdfkit.ui.PdfUiFragmentBuilder
import org.json.JSONException
import org.json.JSONObject
import java.util.HashMap

/**
 * Minimal view hosting [InstantPdfFragment] for NutrientInstantView (Fabric).
 * Document must be JSON with "serverUrl" and "jwt".
 */
class InstantPdfView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0,
    private val isFabricMode: Boolean = true
) : FrameLayout(context, attrs, defStyleAttr) {

    companion object {
        private const val TAG = "InstantPdfView"
        private const val ARG_ROOT_ID = "root_id"
    }

    var componentReferenceId: Int? = null

    private var fragmentManager: FragmentManager? = null
    private var fragmentTag: String? = "NutrientInstantView.FragmentTag"
    private var documentJson: String? = null
    private var configurationJson: String? = null
    private var toolbarJSONString: String? = null
    private var showNavigationButtonInToolbar: Boolean? = null
    private var eventDispatcher: EventDispatcher? = null

    private var isStatusBarHidden: Boolean = false
    private var hideDefaultToolbar: Boolean = false

    private var fragment: ReactInstantPdfUiFragment? = null
    private var pageIndex: Int = 0
    private var delegate: PdfView.PdfViewDelegate? = null

    init {
        // Mirror PdfView: continuously lay out children so the embedded fragment view
        // always matches the React Native layout bounds.
        Choreographer.getInstance().postFrameCallback(object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                manuallyLayoutChildren()
                viewTreeObserver.dispatchOnGlobalLayout()
                // Instant view is lightweight; keep this active as long as the view exists.
                Choreographer.getInstance().postFrameCallback(this)
            }
        })

        // Mirror PdfView: when requested, consume system bar insets by adjusting margins.
        ViewCompat.setOnApplyWindowInsetsListener(
            this,
            object : androidx.core.view.OnApplyWindowInsetsListener {
                override fun onApplyWindowInsets(
                    v: View,
                    windowInsets: WindowInsetsCompat
                ): WindowInsetsCompat {
                    if (!isStatusBarHidden) return windowInsets

                    val insets: Insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars())
                    val layoutParams = v.layoutParams
                    if (layoutParams is ViewGroup.MarginLayoutParams) {
                        layoutParams.leftMargin = insets.left
                        layoutParams.topMargin = insets.top
                        layoutParams.rightMargin = insets.right
                        layoutParams.bottomMargin = insets.bottom
                        v.layoutParams = layoutParams
                    }
                    return WindowInsetsCompat.CONSUMED
                }
            },
        )
    }

    fun setDelegate(d: PdfView.PdfViewDelegate?) {
        delegate = d
    }

    fun setFragmentManager(fm: FragmentManager?) {
        fragmentManager = fm
    }

    fun setDocument(document: String?) {
        documentJson = document
        tryApplyDocument()
    }

    fun setConfigurationJSONString(config: String?) {
        configurationJson = config
        tryApplyDocument()
    }

    fun setToolbarJSONString(toolbar: String?) {
        toolbarJSONString = toolbar
        toolbar?.let { applyToolbarCustomization(it) }
    }

    fun setFragmentTag(tag: String?) {
        fragmentTag = tag ?: "NutrientInstantView.FragmentTag"
    }

    fun setEventDispatcher(dispatcher: EventDispatcher) {
        eventDispatcher = dispatcher
    }

    fun setShowNavigationButtonInToolbar(visible: Boolean) {
        showNavigationButtonInToolbar = visible
        fragment?.setShowNavigationButtonInToolbar(visible)
    }

    fun setIsStatusBarHidden(hidden: Boolean) {
        isStatusBarHidden = hidden
        // Trigger re-application so margins are updated.
        ViewCompat.requestApplyInsets(this)
    }

    fun setHideDefaultToolbar(hide: Boolean) {
        hideDefaultToolbar = hide
        applyHideDefaultToolbar()
    }

    private fun tryApplyDocument() {
        val doc = documentJson ?: return
        val configStr = configurationJson ?: return
        val fm = fragmentManager ?: return
        val tag = fragmentTag ?: return
        try {
            val obj = JSONObject(doc)
            val serverUrl = obj.optString("serverUrl")
            val jwt = obj.optString("jwt")
            if (serverUrl.isEmpty() || jwt.isEmpty()) return
            val configObj = JSONObject(configStr)

            // These props affect the host layout/system-bar integration (not only PdfActivityConfiguration).
            if (configObj.has("androidRemoveStatusBarOffset")) {
                setIsStatusBarHidden(configObj.optBoolean("androidRemoveStatusBarOffset", false))
            }
            when {
                configObj.has("hideDefaultToolbar") ->
                    setHideDefaultToolbar(configObj.optBoolean("hideDefaultToolbar", false))
                configObj.has("showDefaultToolbar") ->
                    setHideDefaultToolbar(!configObj.optBoolean("showDefaultToolbar", true))
                configObj.has("androidShowDefaultToolbar") ->
                    setHideDefaultToolbar(!configObj.optBoolean("androidShowDefaultToolbar", true))
            }

            val configMap = Arguments.makeNativeMap(JsonUtilities.jsonObjectToMap(configObj))
            val configAdapter = ConfigurationAdapter(context, configMap)
            val pdfConfig: PdfActivityConfiguration = configAdapter.build()
            val newFragment = PdfUiFragmentBuilder
                .fromUri(context, Uri.parse("file:///"))
                .fragmentClass(ReactInstantPdfUiFragment::class.java)
                .pdfFragmentTag(tag)
                .build() as ReactInstantPdfUiFragment
            newFragment.setConfiguration(pdfConfig)

            // InstantPdfUiFragment requires the Instant document source to be present in its
            // fragment arguments during onCreateView(). We copy the arguments produced by
            // InstantPdfFragment.newInstance(serverUrl, jwt, configuration) so Instant's native
            // init sees the correct document source.
            try {
                val instantFragment = InstantPdfFragment.newInstance(serverUrl, jwt, pdfConfig.configuration)
                val instantArgs = instantFragment.arguments
                if (instantArgs != null) {
                    val uiArgs = newFragment.arguments ?: Bundle().also { newFragment.arguments = it }
                    uiArgs.putAll(instantArgs)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to prepare Instant document source arguments for InstantPdfUiFragment", e)
            }

            // Mirror PdfView behavior: only attach/replace the fragment once this view
            // is attached to the window and has a valid id. This avoids silent failures
            // where the transaction targets an unattached or id-less view, resulting in
            // a blank screen.
            attachFragment(fm, newFragment, tag)

        } catch (e: Exception) {
            componentReferenceId?.let { refId ->
                NutrientNotificationCenter.documentLoadFailed(
                    "CORRUPTED",
                    e.message ?: "Instant document failed to load",
                    refId
                )
            }
            delegate?.onDocumentLoadFailed(e)
        }
    }

    private fun attachFragment(
        fm: FragmentManager,
        newFragment: ReactInstantPdfUiFragment,
        tag: String
    ) {
        val runnable = object : Runnable {
            override fun run() {
                try {
                    // RN can assign view ids after we receive props. If the id isn't ready yet,
                    // re-try on the main thread until it is.
                    if (id == View.NO_ID) {
                        Handler(context.mainLooper).post(this)
                        return
                    }

                    // Avoid duplicate fragments when configuration/document changes trigger re-attachment.
                    // PdfUiFragment expects a root id argument (same key as PdfView.java).
                    val args = newFragment.arguments ?: Bundle().also { newFragment.arguments = it }
                    args.putInt(ARG_ROOT_ID, id)

                    val existing = fm.findFragmentByTag(tag)
                    if (existing != null) {
                        fm.beginTransaction()
                            .remove(existing)
                            .commitNowAllowingStateLoss()
                    }

                    fm.beginTransaction()
                        .add(this@InstantPdfView.id, newFragment, tag)
                        .commitNowAllowingStateLoss()
                    fragment = newFragment
                    registerFragmentListeners(newFragment)

                    // Apply forced toolbar visibility after the fragment view is attached.
                    newFragment.view?.post { applyHideDefaultToolbar() } ?: applyHideDefaultToolbar()

                    toolbarJSONString?.let { applyToolbarCustomization(it) }
                    showNavigationButtonInToolbar?.let { newFragment.setShowNavigationButtonInToolbar(it) }
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to attach ReactInstantPdfUiFragment", e)
                }
            }
        }

        if (isAttachedToWindow) {
            // View is already attached; run on the main thread.
            Handler(context.mainLooper).post(runnable)
        } else {
            // Defer until the view is attached so `id` is valid and the transaction succeeds.
            addOnAttachStateChangeListener(object : OnAttachStateChangeListener {
                override fun onViewAttachedToWindow(v: View) {
                    v.removeOnAttachStateChangeListener(this)
                    Handler(context.mainLooper).post(runnable)
                }

                override fun onViewDetachedFromWindow(v: View) {
                    // No-op
                }
            })
        }
    }

    fun getPdfFragment(): PdfFragment? = fragment?.pdfFragment

    fun setPageIndex(pageIndex: Int) {
        this.pageIndex = pageIndex
        fragment?.pdfFragment?.setPageIndex(pageIndex, true)
    }

    fun setDisableDefaultActionForTappedAnnotations(disable: Boolean) { }
    fun setHasShouldExecuteAction(has: Boolean) { }

    fun enterAnnotationCreationMode(annotationType: String?, onSuccess: () -> Unit, onError: (Throwable) -> Unit) {
        onSuccess()
    }

    fun exitCurrentlyActiveMode(onSuccess: () -> Unit, onError: (Throwable) -> Unit) {
        onSuccess()
    }

    fun enterContentEditingMode(onSuccess: () -> Unit, onError: (Throwable) -> Unit) {
        onSuccess()
    }

    fun setUserInterfaceVisible(visible: Boolean) {
        // InstantPdfFragment does not expose the same UI visibility API as PdfView; no-op for now.
    }

    fun setExcludedAnnotations(annotations: com.facebook.react.bridge.ReadableArray?) {}
    fun executeAction(requestId: String, allow: Boolean): Boolean = false

    fun removeFragment(remove: Boolean) {
        fragmentManager?.let { fm ->
            fragment?.let { f ->
                if (f.isAdded) {
                    fm.beginTransaction().remove(f).commitAllowingStateLoss()
                }
                fragment = null
            }
        }
    }

    private fun manuallyLayoutChildren() {
        for (i in 0 until childCount) {
            val child = getChildAt(i)
            child.measure(
                MeasureSpec.makeMeasureSpec(measuredWidth, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(measuredHeight, MeasureSpec.EXACTLY),
            )
            child.layout(0, 0, child.measuredWidth, child.measuredHeight)
        }
    }

    fun convertConfiguration(): org.json.JSONObject? = null

    private fun registerFragmentListeners(uiFragment: ReactInstantPdfUiFragment) {
        val pdfFragment = try {
            uiFragment.requirePdfFragment()
        } catch (e: Exception) {
            Log.e(TAG, "registerFragmentListeners: requirePdfFragment() failed", e)
            null
        } ?: return
        // Forward document events into NotificationCenter for Instant.
        pdfFragment.addDocumentListener(object : DocumentListener {
            override fun onDocumentLoaded(loadedDocument: PdfDocument) {
                if (NutrientNotificationCenter.getIsNotificationCenterInUse()) {
                    val componentId = componentReferenceId ?: id
                    NutrientNotificationCenter.documentLoaded(
                        loadedDocument.documentIdString,
                        componentId
                    )
                }
                delegate?.onDocumentLoaded()
                // Align with PdfView: ensure initial pageIndex is applied after the document is ready.
                try {
                    pdfFragment.setPageIndex(pageIndex, true)
                } catch (_: Exception) {
                    // Ignore out-of-range or not-yet-initialized cases.
                }
            }

            override fun onDocumentLoadFailed(throwable: Throwable) {
                if (NutrientNotificationCenter.getIsNotificationCenterInUse()) {
                    val componentId = componentReferenceId ?: id
                    NutrientNotificationCenter.documentLoadFailed(
                        "CORRUPTED",
                        throwable.message ?: "Instant document failed to load",
                        componentId
                    )
                }
                delegate?.onDocumentLoadFailed(throwable)
            }

            override fun onPageChanged(pdfDocument: PdfDocument, pageIndex: Int) {
                if (NutrientNotificationCenter.getIsNotificationCenterInUse()) {
                    val componentId = componentReferenceId ?: id
                    NutrientNotificationCenter.documentPageChanged(
                        pageIndex,
                        pdfDocument.documentIdString,
                        componentId
                    )
                }
            }

            override fun onDocumentZoomed(pdfDocument: PdfDocument, pageIndex: Int, zoom: Float) {}
            override fun onPageUpdated(pdfDocument: PdfDocument, pageIndex: Int) {}

            override fun onDocumentSave(
                pdfDocument: PdfDocument,
                options: com.pspdfkit.document.DocumentSaveOptions
            ): Boolean = true

            override fun onDocumentSaved(pdfDocument: PdfDocument) {}
            override fun onDocumentSaveFailed(pdfDocument: PdfDocument, throwable: Throwable) {}
            override fun onDocumentSaveCancelled(pdfDocument: PdfDocument) {}
        })

        pdfFragment.addDocumentScrollListener(object : DocumentScrollListener {
            override fun onScrollStateChanged(scrollState: ScrollState) {}

            override fun onDocumentScrolled(
                currX: Int,
                currY: Int,
                maxX: Int,
                maxY: Int,
                extendX: Int,
                extendY: Int
            ) {
                if (NutrientNotificationCenter.getIsNotificationCenterInUse()) {
                    val document = uiFragment.document ?: return
                    val componentId = componentReferenceId ?: id
                    NutrientNotificationCenter.documentScrolled(
                        mapOf(
                            "currX" to currX,
                            "currY" to currY,
                        ),
                        document.documentIdString,
                        componentId
                    )
                }
            }
        })

        // Wire toolbar navigation button clicks into the existing delegate.
        uiFragment.setReactPdfUiFragmentListener(object : ReactInstantPdfUiFragment.ReactPdfUiFragmentListener {
            override fun onConfigurationChanged(pdfUiFragment: PdfUiFragment) {
                // No-op for now. PdfFragment listeners will keep handling most events.
            }

            override fun onNavigationButtonClicked(pdfUiFragment: PdfUiFragment) {
                delegate?.onNavigationButtonClicked()
            }
        })
    }

    private fun applyHideDefaultToolbar() {
        val toolbarView = fragment?.view?.findViewById<View>(R.id.pspdf__toolbar_main) ?: return
        if (toolbarView is ReactMainToolbar) {
            // Mirror PdfView.java: forcedVisibility overrides future updates.
            toolbarView.setForcedVisibility(if (hideDefaultToolbar) View.GONE else null)
            toolbarView.visibility = if (hideDefaultToolbar) View.GONE else View.VISIBLE
        } else {
            toolbarView.visibility = if (hideDefaultToolbar) View.GONE else View.VISIBLE
        }
    }

    private fun applyToolbarCustomization(toolbarJSONString: String) {
        val dispatcher = eventDispatcher ?: return
        val fragmentOrNull = fragment ?: return
        val toolbarObj = JSONObject(toolbarJSONString)
        val toolbarMenuItemsObj = toolbarObj.optJSONObject("toolbarMenuItems") ?: return
        val buttons = toolbarMenuItemsObj.optJSONArray("buttons") ?: return

        val stockToolbarItems = arrayListOf<String>()
        val customToolbarItems = arrayListOf<HashMap<Any?, Any?>>()

        for (i in 0 until buttons.length()) {
            val item = buttons.get(i)
            when (item) {
                is String -> {
                    // Keep behavior aligned with NutrientView toolbar setup.
                    val stock = if (item == "documentEditorButtonItem") {
                        "thumbnailsButtonItem"
                    } else {
                        item
                    }
                    stockToolbarItems.add(stock)
                }

                is JSONObject -> {
                    val map = JsonUtilities.jsonObjectToMap(item)
                    val hashMap: HashMap<Any?, Any?> = HashMap(map)
                    hashMap["index"] = i
                    customToolbarItems.add(hashMap)
                }
            }
        }

        val menuListener = MenuItemListener(this, dispatcher, context)
        fragmentOrNull.setCustomToolbarItems(
            stockToolbarItems,
            customToolbarItems,
            menuListener
        )

        fragmentOrNull.invalidateMenu()
    }
}
