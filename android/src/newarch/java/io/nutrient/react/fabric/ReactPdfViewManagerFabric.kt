/*
 * Copyright © 2018-2025 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package io.nutrient.react.fabric

import android.app.Activity
import android.util.Log
import androidx.annotation.NonNull
import androidx.annotation.Nullable
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import java.util.HashMap
import org.json.JSONArray
import org.json.JSONException
import com.facebook.react.uimanager.BaseViewManagerDelegate
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.viewmanagers.NutrientViewManagerDelegate
import com.facebook.react.viewmanagers.NutrientViewManagerInterface
import com.pspdfkit.views.PdfView
import com.pspdfkit.react.common.NutrientPropsToolbarHelper
import com.pspdfkit.react.common.NutrientPropsDocumentHelper
import com.pspdfkit.react.common.NutrientPropsAnnotationsHelper
import io.nutrient.react.events.FabricOnDocumentLoadedEvent
import io.nutrient.react.events.FabricOnStateChangedEvent
import io.nutrient.react.events.FabricOnCustomToolbarButtonTappedEvent
import io.nutrient.react.events.FabricOnCustomAnnotationContextualMenuItemTappedEvent
import io.nutrient.react.events.FabricOnCloseButtonPressedEvent
import io.nutrient.react.events.FabricOnDocumentLoadFailedEvent
import io.nutrient.react.events.FabricOnDocumentSavedEvent
import io.nutrient.react.events.FabricOnDocumentSaveFailedEvent
import io.nutrient.react.events.FabricOnReadyEvent
import io.nutrient.react.events.FabricOnNavigationButtonClickedEvent
import io.nutrient.react.events.FabricOnAnnotationTappedEvent
import io.nutrient.react.events.FabricOnAnnotationsChangedEvent
import com.pspdfkit.react.NutrientViewRegistry

class ReactPdfViewManagerFabric : ViewGroupManager<PdfView>(), NutrientViewManagerInterface<PdfView> {

    companion object {
        const val NAME: String = "NutrientView"
        private const val TAG: String = "NutrientFabric"
    }

    private var reactApplicationContext: ReactApplicationContext? = null
    private val delegate = NutrientViewManagerDelegate<PdfView, ReactPdfViewManagerFabric>(this)
    private var eventDispatcher: EventDispatcher? = null
    private var reference: Int = 0
    private var document: String? = null
    private var configuration: String? = null
    private var fragmentTag: String? = null

    override fun getDelegate(): BaseViewManagerDelegate<PdfView, ReactPdfViewManagerFabric> = delegate

    @NonNull
    override fun getName(): String = NAME

    @NonNull
    override fun createViewInstance(@NonNull reactContext: ThemedReactContext): PdfView {
        
        reference = 0
        document = null
        configuration = null
        fragmentTag = null

        reactApplicationContext = reactContext.reactApplicationContext

        val currentActivity: Activity? = reactContext.currentActivity
        if (currentActivity is FragmentActivity) {
            val fragmentActivity = currentActivity
            val pdfView = PdfView(reactContext, true)

            eventDispatcher = UIManagerHelper.getEventDispatcher(reactContext, pdfView.id)

            pdfView.setDelegate(object : com.pspdfkit.views.PdfView.PdfViewDelegate {
                override fun onDocumentLoaded() {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnDocumentLoadedEvent(surfaceId, pdfView.id))
                }

                override fun onStateChanged(event: com.pspdfkit.views.PdfView.StateChangedEvent) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnStateChangedEvent(surfaceId, pdfView.id, event))
                }

                override fun onCustomToolbarButtonTapped(buttonId: String, id: String) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnCustomToolbarButtonTappedEvent(surfaceId, pdfView.id, buttonId, id))
                }

                override fun onCustomAnnotationContextualMenuItemTapped(id: String) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnCustomAnnotationContextualMenuItemTappedEvent(surfaceId, pdfView.id, id))
                }

                override fun onNavigationButtonClicked() {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnNavigationButtonClickedEvent(surfaceId, pdfView.id))
                }

                override fun onAnnotationTapped(annotation: com.pspdfkit.annotations.Annotation) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnAnnotationTappedEvent(surfaceId, pdfView.id, annotation))
                }

                override fun onAnnotationsChanged(eventType: String, annotation: com.pspdfkit.annotations.Annotation) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnAnnotationsChangedEvent(surfaceId, pdfView.id, eventType, annotation))
                }

                override fun onCloseButtonPressed() {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnCloseButtonPressedEvent(surfaceId, pdfView.id))
                }

                override fun onDocumentLoadFailed(throwable: Throwable) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    // Determine error code based on exception type
                    val code = if (throwable is com.pspdfkit.exceptions.InvalidPasswordException) {
                        "ENCRYPTED"
                    } else {
                        "CORRUPTED"
                    }
                    val message = throwable.message ?: "Document failed to load"
                    eventDispatcher?.dispatchEvent(FabricOnDocumentLoadFailedEvent(surfaceId, pdfView.id, code, message))
                }

                override fun onDocumentSaved() {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnDocumentSavedEvent(surfaceId, pdfView.id))
                }

                override fun onDocumentSaveFailed(error: String) {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnDocumentSaveFailedEvent(surfaceId, pdfView.id, error))
                }

                override fun onReady() {
                    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                    eventDispatcher?.dispatchEvent(FabricOnReadyEvent(surfaceId, pdfView.id))
                }
            })

            pdfView.inject(
                fragmentActivity.supportFragmentManager,
                eventDispatcher
            )
            return pdfView
        } else {
            Log.e(TAG, "Cannot create PdfView - not in FragmentActivity")
            throw IllegalStateException("ReactPSPDFKitView can only be used in FragmentActivity subclasses.")
        }
    }

    override fun onDropViewInstance(view: PdfView) {
        
        // Unregister using the view's componentReferenceId (the actual view being dropped)
        if (view.componentReferenceId != null && view.componentReferenceId != 0) {
            val viewReference = view.componentReferenceId.toString()
            NutrientViewRegistry.getInstance().unregisterView(viewReference)
        }
        
        if (this.reference == 0) {
            reference = 0
            document = null
            configuration = null
            fragmentTag = null
        } else {
            Log.d(TAG, "onDropViewInstance: Preserving reference=${this.reference} (likely hot reload, will be reused for new view)")
            // Don't clear document/configuration/fragmentTag - they're still valid for the active view
        }

        view.removeFragment(true)
    }

    override fun onAfterUpdateTransaction(view: PdfView) {
        super.onAfterUpdateTransaction(view)
        this.fragmentTag?.let { view.setFragmentTag(it) }
        this.configuration?.let {
            NutrientPropsDocumentHelper.applyConfigurationJSONString(
                view,
                it
            )
        }
        this.document?.let { doc ->
            reactApplicationContext?.let { ctx ->
                NutrientPropsDocumentHelper.applyDocument(view, doc, ctx, this.reference)
            }
        }
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = HashMap()

    override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
        val map: MutableMap<String, Any> = HashMap()
        map["onDocumentLoaded"] = mapOf("registrationName" to "onDocumentLoaded")
        map["onStateChanged"] = mapOf("registrationName" to "onStateChanged")
        map["onCustomToolbarButtonTapped"] = mapOf("registrationName" to "onCustomToolbarButtonTapped")
        map["onCustomAnnotationContextualMenuItemTapped"] = mapOf("registrationName" to "onCustomAnnotationContextualMenuItemTapped")
        map["onCloseButtonPressed"] = mapOf("registrationName" to "onCloseButtonPressed")
        map["onDocumentLoadFailed"] = mapOf("registrationName" to "onDocumentLoadFailed")
        map["onDocumentSaved"] = mapOf("registrationName" to "onDocumentSaved")
        map["onDocumentSaveFailed"] = mapOf("registrationName" to "onDocumentSaveFailed")
        map["onReady"] = mapOf("registrationName" to "onReady")
        map["onNavigationButtonClicked"] = mapOf("registrationName" to "onNavigationButtonClicked")
        map["onAnnotationTapped"] = mapOf("registrationName" to "onAnnotationTapped")
        map["onAnnotationsChanged"] = mapOf("registrationName" to "onAnnotationsChanged")
        return map
    }

    // Generated interface methods
    override fun setNativeID(view: PdfView, @Nullable value: String?) {
        if (value != null) {
            if (this.reference != 0) {
                val oldReference = this.reference.toString()
                NutrientViewRegistry.getInstance().unregisterView(oldReference)
            }
            this.reference = value.toInt()
            NutrientViewRegistry.getInstance().registerView(view, value)
        }
    }

    override fun setDocument(view: PdfView, @Nullable value: String?) {
        if (value != null) {
            this.document = value
        }
    }

    override fun setPageIndex(view: PdfView, value: Int) {
        view.setPageIndex(value)
    }

    override fun setFragmentTag(view: PdfView, @Nullable value: String?) {
        if (value != null) this.fragmentTag = value
    }

    override fun setConfiguration(view: PdfView, @Nullable value: ReadableMap?) { }

    override fun setConfigurationJSONString(view: PdfView, @Nullable value: String?) {
        if (value != null) {
            this.configuration = value
        }
    }

    override fun setToolbar(view: PdfView, @Nullable value: ReadableMap?) { }

    override fun setToolbarJSONString(view: PdfView, @Nullable value: String?) {
        NutrientPropsToolbarHelper.applyToolbarJSONString(view, value)
    }

    override fun setAnnotationPresets(view: PdfView, @Nullable value: ReadableMap?) {
        if (value != null) {
            NutrientPropsDocumentHelper.applyAnnotationPresets(view, value)
        }
    }

    override fun setAnnotationContextualMenuJSONString(view: PdfView, @Nullable value: String?) {
        NutrientPropsAnnotationsHelper.applyAnnotationContextualMenuJSONString(view, value)
    }

    override fun setMenuItemGroupingJSONString(view: PdfView, @Nullable value: String?) {
        NutrientPropsDocumentHelper.applyMenuItemGroupingJSONString(view, value)
    }

    override fun setMenuItemGrouping(view: PdfView, @Nullable value: ReadableArray?) {
        if (value != null) {
            NutrientPropsDocumentHelper.applyMenuItemGrouping(view, value)
        }
    }

    override fun setHideNavigationBar(view: PdfView, value: Boolean) {
        // No-op. iOS only.
    }

    override fun setShowNavigationButtonInToolbar(view: PdfView, value: Boolean) {
        NutrientPropsDocumentHelper.applyShowNavigationButtonInToolbar(view, value)
    }

    override fun setAvailableFontNamesJSONString(view: PdfView, @Nullable value: String?) {
        if (value == null || value.isEmpty()) return
        try {
            val jsonArray = JSONArray(value)
            val list = mutableListOf<Any>()
            for (i in 0 until jsonArray.length()) {
                list.add(jsonArray.getString(i))
            }
            val readableArray = Arguments.makeNativeArray(list)
            NutrientPropsDocumentHelper.applyAvailableFontNames(view, readableArray)
        } catch (e: JSONException) {
            // Ignore invalid JSON
        }
    }

    override fun setSelectedFontName(view: PdfView, @Nullable value: String?) {
        NutrientPropsDocumentHelper.applySelectedFontName(view, value)
    }

    override fun setShowDownloadableFonts(view: PdfView, value: Boolean) {
        // No-op. iOS only.
    }

    override fun setDisableDefaultActionForTappedAnnotations(view: PdfView, value: Boolean) {
        view.setDisableDefaultActionForTappedAnnotations(value)
    }

    override fun setAnnotationAuthorName(view: PdfView, @Nullable value: String?) {
        if (value != null) {
            NutrientPropsDocumentHelper.applyAnnotationAuthorName(view, value)
        }
    }

    override fun setImageSaveMode(view: PdfView, @Nullable value: String?) {
        if (value != null) {
            NutrientPropsDocumentHelper.applyImageSaveMode(view, value)
        }
    }

    override fun setShowCloseButton(view: PdfView, value: Boolean) {
        // No-op. iOS only.
    }

    override fun setHideDefaultToolbar(view: PdfView, value: Boolean) {
        // No-op. iOS only.
    }
}
