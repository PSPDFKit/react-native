/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 */

package io.nutrient.react.fabric

import android.app.Activity
import android.util.Log
import android.view.View
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.BaseViewManagerDelegate
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.viewmanagers.NutrientInstantViewManagerDelegate
import com.facebook.react.viewmanagers.NutrientInstantViewManagerInterface
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.react.NutrientInstantViewRegistry
import com.pspdfkit.views.InstantPdfView
import com.pspdfkit.views.PdfView
import io.nutrient.react.events.FabricOnCloseButtonPressedEvent
import io.nutrient.react.events.FabricOnCustomAnnotationContextualMenuItemTappedEvent
import io.nutrient.react.events.FabricOnCustomTextSelectionContextualMenuItemTappedEvent
import io.nutrient.react.events.FabricOnCustomToolbarButtonTappedEvent
import io.nutrient.react.events.FabricOnNavigationButtonClickedEvent
import io.nutrient.react.events.FabricOnReadyEvent
import io.nutrient.react.events.FabricOnShouldExecuteActionEvent
import java.util.HashMap
import org.json.JSONObject

class ReactInstantPdfViewManagerFabric : ViewGroupManager<InstantPdfView>(), NutrientInstantViewManagerInterface<InstantPdfView> {

    companion object {
        const val NAME = "NutrientInstantView"
        private const val TAG = "NutrientInstantFabric"
    }

    private val delegate = NutrientInstantViewManagerDelegate<InstantPdfView, ReactInstantPdfViewManagerFabric>(this)
    private var eventDispatcher: EventDispatcher? = null
    private var reference = 0
    private var document: String? = null
    private var configuration: String? = null
    private var toolbarJSONString: String? = null
    private var annotationContextualMenuJSONString: String? = null
    private var textSelectionContextualMenuJSONString: String? = null
    private var menuItemGroupingJSONString: String? = null
    private var availableFontNamesJSONString: String? = null
    private var selectedFontName: String? = null
    private var showDownloadableFonts: Boolean? = null
    private var hideNavigationBar: Boolean? = null
    private var showNavigationButtonInToolbar: Boolean? = null
    private var showCloseButton: Boolean? = null
    private var hideDefaultToolbar: Boolean? = null
    private var annotationAuthorName: String? = null
    private var imageSaveMode: String? = null
    private var fragmentTag: String? = null

    private fun refreshEventDispatcherForView(view: InstantPdfView) {
        if (view.id == View.NO_ID) return
        val themed = view.context as? ThemedReactContext ?: return
        val refreshed = com.facebook.react.uimanager.UIManagerHelper.getEventDispatcher(themed, view.id) ?: return
        if (refreshed === eventDispatcher) return
        eventDispatcher = refreshed
        view.setEventDispatcher(refreshed)
    }

    override fun getDelegate(): BaseViewManagerDelegate<InstantPdfView, ReactInstantPdfViewManagerFabric> = delegate

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): InstantPdfView {
        reference = 0
        document = null
        configuration = null
        toolbarJSONString = null
        annotationContextualMenuJSONString = null
        textSelectionContextualMenuJSONString = null
        menuItemGroupingJSONString = null
        availableFontNamesJSONString = null
        selectedFontName = null
        showDownloadableFonts = null
        hideNavigationBar = null
        showNavigationButtonInToolbar = null
        showCloseButton = null
        hideDefaultToolbar = null
        annotationAuthorName = null
        imageSaveMode = null
        fragmentTag = null
        val activity: Activity? = reactContext.currentActivity
        if (activity is FragmentActivity) {
            val pdfView = InstantPdfView(reactContext, null, 0, true)
            eventDispatcher = com.facebook.react.uimanager.UIManagerHelper.getEventDispatcher(reactContext, pdfView.id)
            pdfView.setFragmentManager(activity.supportFragmentManager)
            eventDispatcher?.let { pdfView.setEventDispatcher(it) }
            pdfView.setDelegate(object : PdfView.PdfViewDelegate {
                override fun onDocumentLoaded() {
                }
                override fun onStateChanged(event: PdfView.StateChangedEvent) {
                }
                override fun onCustomToolbarButtonTapped(buttonId: String, id: String) {
                    eventDispatcher?.dispatchEvent(FabricOnCustomToolbarButtonTappedEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id, buttonId, id))
                }
                override fun onCustomAnnotationContextualMenuItemTapped(id: String) {
                    eventDispatcher?.dispatchEvent(FabricOnCustomAnnotationContextualMenuItemTappedEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id, id))
                }
                override fun onCustomTextSelectionContextualMenuItemTapped(id: String) {
                    eventDispatcher?.dispatchEvent(FabricOnCustomTextSelectionContextualMenuItemTappedEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id, id))
                }
                override fun onNavigationButtonClicked() {
                    eventDispatcher?.dispatchEvent(FabricOnNavigationButtonClickedEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id))
                }
                override fun onAnnotationTapped(annotation: Annotation) {
                }
                override fun onAnnotationsChanged(eventType: String, annotation: Annotation) {
                }
                override fun onCloseButtonPressed() {
                    eventDispatcher?.dispatchEvent(FabricOnCloseButtonPressedEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id))
                }
                override fun onDocumentLoadFailed(throwable: Throwable) {
                }
                override fun onDocumentSaved() {
                }
                override fun onDocumentSaveFailed(error: String) {
                }
                override fun onReady() {
                    eventDispatcher?.dispatchEvent(FabricOnReadyEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id))
                }
                override fun onShouldExecuteAction(requestId: String, action: com.pspdfkit.annotations.actions.Action, pageIndex: Int, url: String?) {
                    eventDispatcher?.dispatchEvent(FabricOnShouldExecuteActionEvent(com.facebook.react.uimanager.UIManagerHelper.getSurfaceId(reactContext), pdfView.id, requestId, pageIndex, action, url))
                }
            })
            return pdfView
        } else {
            Log.e(TAG, "Cannot create InstantPdfView - not in FragmentActivity")
            throw IllegalStateException("NutrientInstantView can only be used in FragmentActivity.")
        }
    }

    override fun onDropViewInstance(view: InstantPdfView) {
        view.componentReferenceId?.let { id ->
            if (id != 0) NutrientInstantViewRegistry.getInstance().unregisterView(id.toString())
        }
        view.removeFragment(true)
    }

    override fun onAfterUpdateTransaction(view: InstantPdfView) {
        super.onAfterUpdateTransaction(view)
        refreshEventDispatcherForView(view)
        fragmentTag?.let { view.setFragmentTag(it) }
        buildMergedConfigurationJSON()?.let { view.setConfigurationJSONString(it) }
        document?.let { view.setDocument(it) }
        toolbarJSONString?.let { view.setToolbarJSONString(it) }
        showNavigationButtonInToolbar?.let { view.setShowNavigationButtonInToolbar(it) }
        hideDefaultToolbar?.let { view.setHideDefaultToolbar(it) }
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = HashMap()
    override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> = HashMap()

    override fun setNativeID(view: InstantPdfView, value: String?) {
        if (value != null) {
            if (reference != 0) NutrientInstantViewRegistry.getInstance().unregisterView(reference.toString())
            reference = value.toInt()
            NutrientInstantViewRegistry.getInstance().registerView(view, value)
            view.componentReferenceId = value.toInt()
        }
    }

    // Kept for compatibility with older generated interfaces that still
    // expose a string-based `document` prop.
    override fun setDocument(view: InstantPdfView, value: String?) {
        document = value
    }

    override fun setDocumentInfo(view: InstantPdfView, value: ReadableMap?) {
        if (value == null) return
        val serverUrl = value.getString("serverUrl") ?: return
        val jwt = value.getString("jwt") ?: return
        val jsonObject = org.json.JSONObject()
        jsonObject.put("serverUrl", serverUrl)
        jsonObject.put("jwt", jwt)
        document = jsonObject.toString()
    }

    override fun setPageIndex(view: InstantPdfView, value: Int) {
        view.setPageIndex(value)
    }

    override fun setFragmentTag(view: InstantPdfView, value: String?) {
        if (value != null) fragmentTag = value
    }

    override fun setConfiguration(view: InstantPdfView, value: ReadableMap?) {
        if (value == null) return
        // Mirror NutrientView: accept object-typed `configuration` and
        // convert it into the JSON string that InstantPdfView expects.
        val jsonObject = org.json.JSONObject(value.toHashMap())
        configuration = jsonObject.toString()
    }
    override fun setConfigurationJSONString(view: InstantPdfView, value: String?) {
        if (value != null) configuration = value
    }

    override fun setToolbar(view: InstantPdfView, value: ReadableMap?) {
        if (value == null) return
        toolbarJSONString = JSONObject(value.toHashMap()).toString()
    }
    override fun setToolbarJSONString(view: InstantPdfView, value: String?) {
        toolbarJSONString = value
    }

    override fun setAnnotationPresets(view: InstantPdfView, value: ReadableMap?) { /* Instant: not exposed */ }
    override fun setAnnotationContextualMenuJSONString(view: InstantPdfView, value: String?) {
        annotationContextualMenuJSONString = value
    }
    override fun setTextSelectionContextualMenuJSONString(view: InstantPdfView, value: String?) {
        textSelectionContextualMenuJSONString = value
    }
    override fun setMenuItemGroupingJSONString(view: InstantPdfView, value: String?) {
        menuItemGroupingJSONString = value
    }
    override fun setMenuItemGrouping(view: InstantPdfView, value: ReadableArray?) {
        if (value == null) return
        menuItemGroupingJSONString = org.json.JSONArray(value.toArrayList()).toString()
    }
    override fun setHideNavigationBar(view: InstantPdfView, value: Boolean) {
        hideNavigationBar = value
    }
    override fun setShowNavigationButtonInToolbar(view: InstantPdfView, value: Boolean) {
        showNavigationButtonInToolbar = value
    }
    override fun setAvailableFontNamesJSONString(view: InstantPdfView, value: String?) {
        availableFontNamesJSONString = value
    }
    override fun setSelectedFontName(view: InstantPdfView, value: String?) {
        selectedFontName = value
    }
    override fun setShowDownloadableFonts(view: InstantPdfView, value: Boolean) {
        showDownloadableFonts = value
    }
    override fun setDisableDefaultActionForTappedAnnotations(view: InstantPdfView, value: Boolean) {
        view.setDisableDefaultActionForTappedAnnotations(value)
    }
    override fun setHasShouldExecuteAction(view: InstantPdfView, value: Boolean) {
        view.setHasShouldExecuteAction(value)
    }
    override fun setAnnotationAuthorName(view: InstantPdfView, value: String?) {
        annotationAuthorName = value
    }
    override fun setImageSaveMode(view: InstantPdfView, value: String?) {
        imageSaveMode = value
    }
    override fun setShowCloseButton(view: InstantPdfView, value: Boolean) {
        showCloseButton = value
    }
    override fun setHideDefaultToolbar(view: InstantPdfView, value: Boolean) {
        hideDefaultToolbar = value
    }

    private fun buildMergedConfigurationJSON(): String? {
        val merged = if (!configuration.isNullOrEmpty()) JSONObject(configuration) else JSONObject()
        if (!toolbarJSONString.isNullOrEmpty()) {
            merged.put("toolbar", JSONObject(toolbarJSONString))
        }
        if (!annotationContextualMenuJSONString.isNullOrEmpty()) {
            merged.put("annotationContextualMenu", JSONObject(annotationContextualMenuJSONString))
        }
        if (!textSelectionContextualMenuJSONString.isNullOrEmpty()) {
            merged.put("textSelectionContextualMenu", JSONObject(textSelectionContextualMenuJSONString))
        }
        if (!menuItemGroupingJSONString.isNullOrEmpty()) {
            merged.put("menuItemGrouping", org.json.JSONArray(menuItemGroupingJSONString))
        }
        if (!availableFontNamesJSONString.isNullOrEmpty()) {
            merged.put("availableFontNames", org.json.JSONArray(availableFontNamesJSONString))
        }
        if (selectedFontName != null) merged.put("selectedFontName", selectedFontName)
        if (showDownloadableFonts != null) merged.put("showDownloadableFonts", showDownloadableFonts)
        if (hideNavigationBar != null) merged.put("hideNavigationBar", hideNavigationBar)
        if (showNavigationButtonInToolbar != null) merged.put("showNavigationButtonInToolbar", showNavigationButtonInToolbar)
        if (showCloseButton != null) merged.put("showCloseButton", showCloseButton)
        if (hideDefaultToolbar != null) merged.put("hideDefaultToolbar", hideDefaultToolbar)
        if (annotationAuthorName != null) merged.put("annotationAuthorName", annotationAuthorName)
        if (imageSaveMode != null) merged.put("imageSaveMode", imageSaveMode)
        return if (merged.length() == 0) null else merged.toString()
    }
}
