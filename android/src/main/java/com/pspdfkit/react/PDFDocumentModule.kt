package com.pspdfkit.react

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.pspdfkit.LicenseFeature
import com.pspdfkit.PSPDFKit
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.document.ImageDocument
import com.pspdfkit.document.PdfDocument
import com.pspdfkit.document.formatters.DocumentJsonFormatter
import com.pspdfkit.document.formatters.XfdfFormatter
import com.pspdfkit.document.providers.ContentResolverDataProvider
import com.pspdfkit.document.providers.DataProvider
import com.pspdfkit.forms.ChoiceFormElement
import com.pspdfkit.forms.ComboBoxFormElement
import com.pspdfkit.forms.EditableButtonFormElement
import com.pspdfkit.forms.SignatureFormElement
import com.pspdfkit.forms.TextFormElement
import com.pspdfkit.forms.SignatureFormConfiguration
import com.pspdfkit.forms.TextFormConfiguration
import android.graphics.RectF
import com.pspdfkit.react.helper.AnnotationUtils
import com.pspdfkit.react.helper.BookmarkUtils
import com.pspdfkit.react.helper.ConversionHelpers.getAnnotationTypes
import com.pspdfkit.react.helper.DocumentJsonDataProvider
import com.pspdfkit.react.helper.FormUtils
import com.pspdfkit.react.helper.JsonUtilities
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.schedulers.Schedulers
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.util.EnumSet
import androidx.core.graphics.toColorInt
import java.lang.ref.WeakReference
import com.pspdfkit.views.PdfView
import com.pspdfkit.ui.PdfFragment
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

data class DocumentData(
    val document: PdfDocument,
    var imageDocument: ImageDocument?,
    var pdfViewRef: WeakReference<PdfView>? = null
)

@ReactModule(name = PDFDocumentModule.NAME)
class PDFDocumentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val job = SupervisorJob()
    private val scope = CoroutineScope(job + Dispatchers.Main.immediate)

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        job.cancel()
        scope.cancel()
    }

    private val documents = ConcurrentHashMap<Int, DocumentData>()
    private val documentConfigurations = ConcurrentHashMap<Int, MutableMap<String, Any>>()

    override fun getName(): String {
        return NAME
    }

    private fun getDocument(reference: Int): DocumentData? {
        return this.documents[reference]
    }

    @ReactMethod fun setAnnotationFlags(reference: Int, uuid: String, flags: ReadableArray, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("setAnnotationFlags", "Document is nil")
            return
        }
        scope.launch {
            try {
                val allAnnotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                }
                var foundAnnotation: Annotation? = null
                for (annotation in allAnnotations) {
                    if (annotation.uuid == uuid || (annotation.name != null && annotation.name == uuid)) {
                        val convertedFlags = com.pspdfkit.react.helper.ConversionHelpers.getAnnotationFlags(flags)
                        annotation.flags = convertedFlags
                        foundAnnotation = annotation
                        break
                    }
                }
                if (foundAnnotation != null) {
                    val docData = this@PDFDocumentModule.getDocument(reference)
                    val pdfView = docData?.pdfViewRef?.get()
                    if (pdfView != null) {
                        pdfView.getPdfFragment()
                            .take(1)
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                { pdfFragment -> pdfFragment.notifyAnnotationHasChanged(foundAnnotation!!) },
                                { /* Ignore errors if fragment is not available */ }
                            )
                    }
                }
                promise.resolve(foundAnnotation != null)
            } catch (e: Throwable) {
                promise.reject("setAnnotationFlags", e)
            }
        }
    }

    @ReactMethod fun getAnnotationFlags(reference: Int, uuid: String, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("getAnnotationFlags", "Document is nil")
            return
        }
        scope.launch {
            try {
                val allAnnotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                }
                var convertedFlags = ArrayList<String>()
                for (annotation in allAnnotations) {
                    if (annotation.uuid == uuid || (annotation.name != null && annotation.name == uuid)) {
                        val flags = annotation.flags
                        convertedFlags = com.pspdfkit.react.helper.ConversionHelpers.convertAnnotationFlags(flags)
                        break
                    }
                }
                promise.resolve(Arguments.makeNativeArray(convertedFlags))
            } catch (e: Throwable) {
                promise.reject("getAnnotationFlags", e)
            }
        }
    }

    private fun getDocumentConfiguration(reference: Int): MutableMap<String, Any>? {
        return this.documentConfigurations[reference]
    }

    fun setDocument(document: PdfDocument, imageDocument: ImageDocument?, reference: Int, pdfView: PdfView? = null) {
        val existingDocData = this.getDocument(reference)
        val docData = DocumentData(
            document,
            imageDocument ?: existingDocData?.imageDocument,
            if (pdfView != null) WeakReference(pdfView) else existingDocData?.pdfViewRef
        )
        this.documents[reference] = docData
    }

    fun updateDocumentConfiguration(key: String, value: Any, reference: Int) {
        var currentConfiguration = documentConfigurations[reference]
        if (currentConfiguration == null) {
            currentConfiguration = mutableMapOf()
        }
        currentConfiguration[key] = value
        documentConfigurations[reference] = currentConfiguration
    }

    @ReactMethod fun getDocumentId(reference: Int, promise: Promise) {
        try {
            promise.resolve(this.getDocument(reference)?.document?.documentIdString)
        } catch (e: Throwable) {
            promise.reject("getDocumentId error", e)
        }
    }

    @ReactMethod fun getPageInfo(reference: Int, pageIndex: Int, promise: Promise) {
        try {
            val rotation = this.getDocument(reference)?.document?.getPageRotation(pageIndex);
            val size = this.getDocument(reference)?.document?.getPageSize(pageIndex);
            val result = Arguments.createMap()
            if (rotation != null) {
                result.putInt("savedRotation", rotation)
            }
            if (size != null) {
                val sizeMap = Arguments.createMap()
                sizeMap.putDouble("height", size.height.toDouble())
                sizeMap.putDouble("width", size.width.toDouble())
                result.putMap("size", sizeMap)
            }
            promise.resolve(result);
        } catch (e: Throwable) {
            promise.reject("getPageInfo error", e)
        }
    }

    @ReactMethod fun getPageCount(reference: Int, promise: Promise) {
        try {
            promise.resolve(this.getDocument(reference)?.document?.pageCount)
        } catch (e: Throwable) {
            promise.reject("getPageCount error", e)
        }
    }

    @ReactMethod fun isEncrypted(reference: Int, promise: Promise) {
        try {
            promise.resolve(this.getDocument(reference)?.document?.isEncrypted)
        } catch (e: Throwable) {
            promise.reject("isEncrypted error", e)
        }
    }

    @ReactMethod fun invalidateCacheForPage(reference: Int, pageIndex: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.invalidateCacheForPage(pageIndex)
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("invalidateCacheForPage error", e)
        }
    }

    @ReactMethod fun invalidateCache(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.invalidateCache()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("invalidateCache error", e)
        }
    }

    @ReactMethod fun save(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.imageDocument?.let {
                val metadata = this.getDocumentConfiguration(reference)?.get("imageSaveMode")?.equals("flattenAndEmbed") == true
                promise.resolve(it.saveIfModified(metadata))
                return
            }
            this.getDocument(reference)?.document?.let {
                it.saveIfModified()
                promise.resolve(true)
                return
            }
        } catch (e: Throwable) {
            promise.reject("save error", e)
        }
    }

    @ReactMethod fun getAllUnsavedAnnotations(reference: Int, promise: Promise) {
        try {
            val document = this.getDocument(reference)?.document
            if (document == null) {
                promise.reject("getAllUnsavedAnnotations", "Document is nil")
                return
            }
            val outputStream = ByteArrayOutputStream()
            DocumentJsonFormatter.exportDocumentJsonAsync(document, outputStream)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    {
                        val json = JSONObject(outputStream.toString())
                        val jsonMap = JsonUtilities.jsonObjectToMap(json)
                        val nativeMap = Arguments.makeNativeMap(jsonMap)
                        promise.resolve(nativeMap)
                    }, { e ->
                        promise.reject("getAllUnsavedAnnotations", RuntimeException(e))
                    }
                )
        } catch (e: Throwable) {
            promise.reject("getAllUnsavedAnnotations error", e)
        }
    }

    @ReactMethod fun getAnnotations(reference: Int, type: String?, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("getAnnotations error", "Document is nil")
            return
        }
        val types = if (type == null) EnumSet.allOf(AnnotationType::class.java)
            else getAnnotationTypes(Arguments.makeNativeArray<String>(arrayOf(type)))
        scope.launch {
            try {
                val annotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(types)
                }
                var annotationsSerialized: ArrayList<Map<String, Any>> = ArrayList()
                for (annotation in annotations) {
                    if (annotation.type == AnnotationType.POPUP) continue
                    val annotationMap = AnnotationUtils.processAnnotation(annotation)
                    annotationsSerialized.add(annotationMap)
                }
                promise.resolve(Arguments.makeNativeArray(annotationsSerialized))
            } catch (e: Throwable) {
                promise.reject("getAnnotations error", e)
            }
        }
    }

    @ReactMethod fun getAnnotationsForPage(reference: Int, pageIndex: Int, type: String?, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("getAnnotationsForPage error", "Document is nil")
            return
        }
        if (pageIndex > document.pageCount - 1) {
            promise.reject(RuntimeException("Specified page index is out of bounds"))
            return
        }
        val types = if (type == null) EnumSet.allOf(AnnotationType::class.java)
            else getAnnotationTypes(Arguments.makeNativeArray<String>(arrayOf(type)))
        scope.launch {
            try {
                val annotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(types, pageIndex, 1)
                }
                val annotationsSerialized = ArrayList<Map<String, Any>>()
                for (annotation in annotations) {
                    if (annotation.type == AnnotationType.POPUP) continue
                    annotationsSerialized.add(AnnotationUtils.processAnnotation(annotation))
                }
                promise.resolve(Arguments.makeNativeArray(annotationsSerialized))
            } catch (e: Throwable) {
                promise.reject("getAnnotationsForPage error", e)
            }
        }
    }

    @ReactMethod fun removeAnnotations(reference: Int, instantJSON: ReadableArray, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("removeAnnotations error", "Document is nil")
            return
        }
        val instantJSONArray: List<Map<String, Any>> = instantJSON.toArrayList().filterIsInstance<Map<String, Any>>()
        scope.launch {
            try {
                val annotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                }
                val annotationsToDelete = ArrayList<Annotation>()
                for (annotation in annotations) {
                    for (instantJSONAnnotation in instantJSONArray) {
                        if (annotation.name == instantJSONAnnotation["name"] ||
                            annotation.uuid == instantJSONAnnotation["uuid"]) {
                            annotationsToDelete.add(annotation)
                            break
                        }
                    }
                }
                for (annotation in annotationsToDelete) {
                    document.annotationProvider.removeAnnotationFromPage(annotation)
                }
                promise.resolve(true)
            } catch (e: Throwable) {
                promise.reject("removeAnnotations error", e)
            }
        }
    }

    private fun createInstantObject(annotations: ReadableArray, attachments: ReadableMap): WritableMap? {
        val result = Arguments.createMap()
        result.putString("format", "https://pspdfkit.com/instant-json/v1")
        result.putArray("annotations", annotations)
        result.putMap("attachments", attachments)
        return result
    }

    @ReactMethod fun addAnnotations(reference: Int, instantJSON: Dynamic, attachments: Dynamic, promise: Promise) {

        // This API is now used to add ONLY annotation objects to a document - the old functionality to apply document JSON has moved to the more aptly named applyInstantJSON.
        // For backwards compatibility, first check whether the API is being called with a full Document JSON object, and then redirect the call to applyInstantJSON.
        // Can be removed after customer migration is complete.

        if (instantJSON.type == ReadableType.Map) {
            instantJSON.asMap()?.let { applyInstantJSON(reference, it, promise) }
            return
        }

        try {
            this.getDocument(reference)?.document?.let { document ->
                if (instantJSON.type == ReadableType.Array) {
                    val instantJSONArray = instantJSON.asArray()
                    val hasImageAnnotations = (0 until (instantJSONArray?.size() ?: 0)).any { i ->
                        val annotation = instantJSONArray?.getMap(i)
                        val hashMap = annotation?.toHashMap() as? Map<String, Any>
                        hashMap?.containsKey("imageAttachmentId") == true
                    }

                    if (hasImageAnnotations) {
                        // If there are any image annotations, process them all at once
                        val attachmentsJSONMap = attachments.asMap()
                        val instantData = createInstantObject(instantJSONArray!!,
                            attachmentsJSONMap!!
                        )
                        if (instantData != null) {
                            applyInstantJSON(reference, instantData, promise)
                            return
                        }
                    } else {
                        // Process non-image annotations directly
                        if (instantJSONArray != null) {
                            scope.launch {
                                try {
                                    withContext(Dispatchers.Default) {
                                        for (i in 0 until instantJSONArray.size()) {
                                            val annotation = instantJSONArray.getMap(i)
                                            val hashMap = annotation!!.toHashMap() as Map<*, *>
                                            document.annotationProvider.createAnnotationFromInstantJson(
                                                JSONObject(hashMap).toString()
                                            )
                                        }
                                    }
                                    promise.resolve(true)
                                } catch (e: Exception) {
                                    promise.reject("addAnnotations error", e)
                                }
                            }
                        } else {
                            promise.resolve(true)
                        }
                    }
                } else {
                    promise.reject("addAnnotations error", "Cannot parse annotation data")
                }
            }
        } catch (e: Throwable) {
            promise.reject("addAnnotations error", e)
        }
    }

    @ReactMethod fun applyInstantJSON(reference: Int, instantJSON: ReadableMap, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {
                val json = (instantJSON.toHashMap() as? Map<*, *>)?.let { it1 -> JSONObject(it1) }
                val dataProvider: DataProvider = DocumentJsonDataProvider(json)
                DocumentJsonFormatter.importDocumentJsonAsync(it, dataProvider)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe({
                        promise.resolve(true)
                    }, { e ->
                        promise.reject(RuntimeException(e))
                    })
            }
        } catch (e: Throwable) {
            promise.reject("applyInstantJSON error", e)
        }
    }

    @ReactMethod fun importXFDF(reference: Int, filePath: String, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {
                var importPath = filePath;
                if (Uri.parse(importPath).scheme == null) {
                    importPath = "file:///$filePath";
                }

                val document = it
                XfdfFormatter.parseXfdfAsync(document, ContentResolverDataProvider((Uri.parse(importPath))))
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(
                        { annotations ->
                            scope.launch {
                                try {
                                    withContext(Dispatchers.Default) {
                                        for (annotation in annotations) {
                                            document.annotationProvider.addAnnotationToPage(annotation)
                                        }
                                    }
                                    val result = JSONObject()
                                    result.put("success", true)
                                    val jsonMap = JsonUtilities.jsonObjectToMap(result)
                                    val nativeMap = Arguments.makeNativeMap(jsonMap)
                                    promise.resolve(nativeMap)
                                } catch (e: Throwable) {
                                    promise.reject("importXFDF error", e)
                                }
                            }
                        }, { e ->
                            promise.reject("importXFDF error", e)
                        })
            }
        } catch (e: Throwable) {
            promise.reject("importXFDF error", e)
        }
    }

    @ReactMethod fun exportXFDF(reference: Int, filePath: String, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("exportXFDF error", "Document is nil")
            return
        }
        var exportPath = filePath
        if (Uri.parse(exportPath).scheme == null) {
            exportPath = "file:///$filePath"
        }
        val outputStream = reactApplicationContext.contentResolver.openOutputStream(Uri.parse(exportPath))
            ?: run {
                promise.reject("exportXFDF error", RuntimeException("Could not write to supplied file path error"))
                return
            }
        scope.launch {
            try {
                val allAnnotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                }
                var allFormFields: List<com.pspdfkit.forms.FormField> = emptyList()
                if (PSPDFKit.getLicenseFeatures().contains(LicenseFeature.FORMS)) {
                    allFormFields = document.formProvider.formFields
                }
                XfdfFormatter.writeXfdfAsync(document, allAnnotations, allFormFields, outputStream)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(
                        {
                            try {
                                outputStream.close()
                            } catch (_: Exception) { /* ignore */ }
                            val result = JSONObject()
                            result.put("success", true)
                            result.put("filePath", filePath)
                            val jsonMap = JsonUtilities.jsonObjectToMap(result)
                            val nativeMap = Arguments.makeNativeMap(jsonMap)
                            promise.resolve(nativeMap)
                        },
                        { e ->
                            try {
                                outputStream.close()
                            } catch (_: Exception) { /* ignore */ }
                            promise.reject("exportXFDF error", e)
                        }
                    )
            } catch (e: Throwable) {
                try {
                    outputStream.close()
                } catch (_: Exception) { /* ignore */ }
                promise.reject("exportXFDF error", e)
            }
        }
    }

    @ReactMethod fun getFormElements(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {

                val formElements = it.formProvider.formElements
                val formElementsJSON = ArrayList<Map<String, Any>>()

                for (formElement in formElements) {
                    val elementJSON = FormUtils.formElementToJSON(formElement)
                    formElementsJSON.add(elementJSON)
                }

                promise.resolve(Arguments.makeNativeArray(formElementsJSON))
            }
        } catch (e: Throwable) {
            promise.reject("getFormElements", e)
        }
    }

    @ReactMethod fun updateFormFieldValue(reference: Int, fullyQualifiedName: String, value: Dynamic, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {

                var formElement = it.formProvider.getFormFieldWithFullyQualifiedName(fullyQualifiedName)?.formElement
                if (formElement == null) {
                    formElement = it.formProvider.getFormElementWithName(fullyQualifiedName)
                }
                var success = false

                when (formElement) {
                    is EditableButtonFormElement -> {
                        if (value.type == ReadableType.Boolean) {
                            if (value.asBoolean()) {
                                formElement.select()
                            } else {
                                formElement.deselect()
                            }
                            success = true
                        }
                    }
                    is ChoiceFormElement -> {
                        if (value.type == ReadableType.Array) {
                            val indices: MutableList<Int>? = value.asArray()?.toArrayList()
                                ?.filterIsInstance<Number>()
                                ?.map { it.toInt() }
                                ?.toMutableList()
                            if (indices != null) {
                                formElement.selectedIndexes = indices
                                success = true
                            }
                        } else if (value.type == ReadableType.String) {
                            if (formElement is ComboBoxFormElement) {
                                formElement.customText = value.asString()
                                success = true
                            }
                        }
                    }
                    is TextFormElement -> {
                        if (value.type == ReadableType.String) {
                            value.asString()?.let { it1 -> formElement.setText(it1) }
                            success = true
                        }
                    }
                }

                if (success) {
                    promise.resolve(true)
                } else {
                    promise.reject("updateFormFieldValue", "Could not update form field value")
                }
            }
        } catch (e: Throwable) {
            promise.reject("updateFormFieldValue", e)
        }
    }

    @ReactMethod fun getBookmarks(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let { document ->
                val bookmarks = document.bookmarkProvider.bookmarks
                val bookmarksJSON = BookmarkUtils.bookmarksToJSON(bookmarks)
                promise.resolve(Arguments.makeNativeArray(bookmarksJSON))
            } ?: run {
                promise.reject("getBookmarks", "Document is nil", null)
            }
        } catch (e: Throwable) {
            promise.reject("getBookmarks error", e)
        }
    }

    @ReactMethod fun addBookmarks(reference: Int, bookmarks: ReadableArray, promise: Promise) {
        try {
            val document = this.getDocument(reference)?.document
            if (document == null) {
                promise.reject("addBookmarks", "Document is nil", null)
                return
            }

            // Convert JSON to Bookmark objects
            val bookmarkObjects = BookmarkUtils.JSONToBookmarks(bookmarks)

            // Add each bookmark to the document
            for (bookmark in bookmarkObjects) {
                document.bookmarkProvider.addBookmark(bookmark)
            }

            promise.resolve(true)

        } catch (e: Throwable) {
            promise.reject("addBookmarks error", e)
        }
    }

    @ReactMethod fun removeBookmarks(reference: Int, bookmarks: ReadableArray, promise: Promise) {
        try {
            val document = this.getDocument(reference)?.document
            if (document == null) {
                promise.reject("removeBookmarks", "Document is nil", null)
                return
            }

            // Convert JSON to Bookmark objects
            val bookmarkObjects = BookmarkUtils.JSONToBookmarks(bookmarks)

            // Remove each bookmark from the document
            for (bookmark in bookmarkObjects) {
                document.bookmarkProvider.removeBookmark(bookmark)
            }

            promise.resolve(true)

        } catch (e: Throwable) {
            promise.reject("removeBookmarks error", e)
        }
    }

    @ReactMethod fun getOverlappingSignature(reference: Int, fullyQualifiedName: String, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let { document ->
                val formElement = document.formProvider.getFormFieldWithFullyQualifiedName(fullyQualifiedName)?.formElement

                // Check if formElement was found
                if (formElement == null) {
                    promise.reject("getOverlappingSignature", "Form element not found")
                    return@let
                }

                // Check if it's a SignatureFormElement and get the overlapping annotation
                val overlappingAnnotation = if (formElement is SignatureFormElement) {
                    formElement.getOverlappingSignatures()
                } else {
                    null
                }

                // Check if overlapping annotation was found
                if (overlappingAnnotation == null || overlappingAnnotation.size == 0) {
                    promise.reject("getOverlappingSignature", "No overlaps found")
                    return@let
                }

                // Convert annotation to map using AnnotationUtils
                val annotationMap = AnnotationUtils.processAnnotation(overlappingAnnotation.first())
                val nativeMap = Arguments.makeNativeMap(annotationMap)
                promise.resolve(nativeMap)
            } ?: run {
                promise.reject("getOverlappingSignature", "Document is nil")
            }
        } catch (e: Throwable) {
            promise.reject("getOverlappingSignature", e)
        }
    }

    @ReactMethod fun updateAnnotations(reference: Int, instantJSON: ReadableArray, promise: Promise) {
        val document = this.getDocument(reference)?.document
        if (document == null) {
            promise.reject("updateAnnotations", "Document is nil")
            return
        }
        val instantJSONArray: List<ReadableMap> = (0 until instantJSON.size())
            .mapNotNull { instantJSON.getMap(it) }
        scope.launch {
            try {
                val annotations = withContext(Dispatchers.Default) {
                    document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                }
                val annotationsToUpdate = ArrayList<Annotation>()
                for (updateMap in instantJSONArray) {
                    val updateUUID = updateMap.getString("uuid")
                    val updateName = updateMap.getString("name")
                    var foundAnnotation: Annotation? = null
                    for (annotation in annotations) {
                        if ((updateUUID != null && annotation.uuid == updateUUID) ||
                            (updateName != null && annotation.name == updateName)) {
                            foundAnnotation = annotation
                            break
                        }
                    }
                    foundAnnotation?.let { annotation ->
                        applyPropertiesToAnnotation(annotation, updateMap, document)
                        annotationsToUpdate.add(annotation)
                    }
                }
                if (annotationsToUpdate.isEmpty()) {
                    promise.reject("updateAnnotations", "No annotations found to update")
                    return@launch
                }
                val docData = this@PDFDocumentModule.getDocument(reference)
                val pdfView = docData?.pdfViewRef?.get()
                if (pdfView != null) {
                    for (annotation in annotationsToUpdate) {
                        pdfView.getPdfFragment()
                            .take(1)
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                { pdfFragment -> pdfFragment.notifyAnnotationHasChanged(annotation) },
                                { /* Ignore errors if fragment is not available */ }
                            )
                    }
                }
                promise.resolve(true)
            } catch (e: Throwable) {
                promise.reject("updateAnnotations", e)
            }
        }
    }

    @ReactMethod fun selectAnnotations(reference: Int, jsonAnnotations: ReadableArray, showContextualMenu: Boolean, promise: Promise) {
        val docData = this.getDocument(reference)
        val document = docData?.document
        val pdfView = docData?.pdfViewRef?.get()
        if (document == null || pdfView == null) {
            promise.reject("selectAnnotations", "Document is nil")
            return
        }
        val instantJSONArray: List<Map<String, Any>> = jsonAnnotations.toArrayList().filterIsInstance<Map<String, Any>>()
        scope.launch {
            try {
                val annotationsToSelect = withContext(Dispatchers.Default) {
                    val allAnnotations = document.annotationProvider.getAllAnnotationsOfType(EnumSet.allOf(AnnotationType::class.java))
                    val toSelect = ArrayList<Annotation>()
                    for (annotation in allAnnotations) {
                        for (instantJSONAnnotation in instantJSONArray) {
                            if ((annotation.name != null && annotation.name == instantJSONAnnotation["name"]) ||
                                annotation.uuid == instantJSONAnnotation["uuid"]) {
                                toSelect.add(annotation)
                                break
                            }
                        }
                    }
                    toSelect
                }
                pdfView.getPdfFragment()
                    .take(1)
                    .timeout(5, TimeUnit.SECONDS)
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(
                        { pdfFragment ->
                            try {
                                pdfFragment.setSelectedAnnotations(annotationsToSelect)
                                if (showContextualMenu) {
                                    pdfFragment.enterAnnotationEditingMode(annotationsToSelect)
                                }
                                promise.resolve(true)
                            } catch (e: Exception) {
                                promise.reject("selectAnnotations", e.message ?: "Failed to select annotations")
                            }
                        },
                        { throwable ->
                            promise.reject("selectAnnotations", throwable.message ?: throwable.toString())
                        }
                    )
            } catch (e: Throwable) {
                promise.reject("selectAnnotations", e.message ?: e.toString())
            }
        }
    }

    @ReactMethod fun clearSelectedAnnotations(reference: Int, promise: Promise) {
        val docData = this.getDocument(reference)
        val pdfView = docData?.pdfViewRef?.get()
        if (pdfView == null) {
            promise.reject("clearSelectedAnnotations", "Document is nil")
            return
        }
        pdfView.getPdfFragment()
            .take(1)
            .timeout(5, TimeUnit.SECONDS)
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                { pdfFragment ->
                    try {
                        pdfFragment.clearSelectedAnnotations()
                        promise.resolve(true)
                    } catch (e: Exception) {
                        promise.reject("clearSelectedAnnotations", e.message ?: "Failed to clear selected annotations")
                    }
                },
                { throwable ->
                    promise.reject("clearSelectedAnnotations", throwable.message ?: throwable.toString())
                }
            )
    }

    // Helper function to apply individual properties to annotations
    private fun applyPropertiesToAnnotation(annotation: Annotation, updateMap: ReadableMap, document: PdfDocument) {
        val iterator = updateMap.keySetIterator()

        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()

            // Skip uuid and name - they're only for matching
            if (key == "uuid" || key == "name") {
                continue
            }

            // Apply property based on key
            when (key) {
                "bbox" -> {
                    // bbox format: [left, top, width, height]
                    // RectF format: (left, top, right, bottom) where right = left + width, bottom = top + height
                    val bboxArray = updateMap.getArray(key)
                    if (bboxArray != null && bboxArray.size() == 4) {
                        val left = bboxArray.getDouble(0).toFloat()
                        val top = bboxArray.getDouble(1).toFloat()
                        val width = bboxArray.getDouble(2).toFloat()
                        val height = bboxArray.getDouble(3).toFloat()
                        annotation.boundingBox = android.graphics.RectF(left, top, left + width, top + height)
                    }
                }

                "opacity" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Number) {
                        annotation.alpha = updateMap.getDouble(key).toFloat()
                    }
                }

                "color" -> {
                    val colorString = updateMap.getString(key)
                    if (colorString != null) {
                        try {
                            annotation.color = android.graphics.Color.parseColor(colorString)
                        } catch (e: Exception) {
                            // Invalid color string, skip
                        }
                    }
                }

                "flags" -> {
                    val flagsArray = updateMap.getArray(key)
                    if (flagsArray != null) {
                        val convertedFlags = com.pspdfkit.react.helper.ConversionHelpers.getAnnotationFlags(flagsArray)
                        annotation.flags = convertedFlags
                    }
                }

                // Type-specific properties
                "lineWidth" -> {
                    if (annotation is com.pspdfkit.annotations.InkAnnotation) {
                        if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Number) {
                            annotation.lineWidth = updateMap.getDouble(key).toFloat()
                        }
                    }
                }

                "fillColor" -> {
                    if (annotation is com.pspdfkit.annotations.ShapeAnnotation) {
                        val colorString = updateMap.getString(key)
                        if (colorString != null) {
                            try {
                                annotation.fillColor = android.graphics.Color.parseColor(colorString)
                            } catch (e: Exception) {
                                // Invalid color string, skip
                            }
                        }
                    }
                }

                "fontColor" -> {
                    if (annotation is com.pspdfkit.annotations.FreeTextAnnotation) {
                        val colorString = updateMap.getString(key)
                        if (colorString != null) {
                            try {
                                annotation.color = colorString.toColorInt()
                            } catch (e: Exception) {
                                // Invalid color string, skip
                            }
                        }
                    }
                }

                "subject" -> {
                    val subject = updateMap.getString(key)
                    if (subject != null) {
                        annotation.subject = subject
                    }
                }

                "group" -> {
                    val group = updateMap.getString(key)
                    if (group != null) {
                        annotation.group = group
                    }
                }

                "note" -> {
                    val note = updateMap.getString(key)
                    if (note != null) {
                        annotation.contents = note
                    }
                }

                "lockedContents" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Boolean) {
                        val lockedContents = updateMap.getBoolean(key)
                        val flags = annotation.flags
                        if (lockedContents) {
                            flags.add(com.pspdfkit.annotations.AnnotationFlags.LOCKEDCONTENTS)
                        } else {
                            flags.remove(com.pspdfkit.annotations.AnnotationFlags.LOCKEDCONTENTS)
                        }
                        annotation.flags = flags
                    }
                }

                "noPrint" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Boolean) {
                        val noPrint = updateMap.getBoolean(key)
                        val flags = annotation.flags
                        if (noPrint) {
                            flags.remove(com.pspdfkit.annotations.AnnotationFlags.PRINT)
                        } else {
                            flags.add(com.pspdfkit.annotations.AnnotationFlags.PRINT)
                        }
                        annotation.flags = flags
                    }
                }

                "noView" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Boolean) {
                        val noView = updateMap.getBoolean(key)
                        val flags = annotation.flags
                        if (noView) {
                            flags.add(com.pspdfkit.annotations.AnnotationFlags.NOVIEW)
                        } else {
                            flags.remove(com.pspdfkit.annotations.AnnotationFlags.NOVIEW)
                        }
                        annotation.flags = flags
                    }
                }

                "readOnly" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Boolean) {
                        val readOnly = updateMap.getBoolean(key)
                        val flags = annotation.flags
                        if (readOnly) {
                            flags.add(com.pspdfkit.annotations.AnnotationFlags.READONLY)
                        } else {
                            flags.remove(com.pspdfkit.annotations.AnnotationFlags.READONLY)
                        }
                        annotation.flags = flags
                    }
                }

                "strokeWidth" -> {
                    if (annotation is com.pspdfkit.annotations.ShapeAnnotation) {
                        if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Number) {
                            annotation.borderWidth = updateMap.getDouble(key).toFloat()
                        }
                    }
                }

                "strokeDashArray" -> {
                    if (annotation is com.pspdfkit.annotations.ShapeAnnotation) {
                        val dashArray = updateMap.getArray(key)
                        if (dashArray != null && dashArray.size() >= 2) {
                            val dashList = listOf(
                                dashArray.getInt(0),
                                dashArray.getInt(1)
                            )
                            annotation.borderDashArray = dashList
                        }
                    }
                }

                "text" -> {
                    val text = updateMap.getString(key)
                    if (text != null) {
                        if (annotation is com.pspdfkit.annotations.FreeTextAnnotation) {
                            annotation.contents = text
                        } else if (annotation is com.pspdfkit.annotations.NoteAnnotation) {
                            annotation.contents = text
                        }
                    }
                }

                "icon" -> {
                    if (annotation is com.pspdfkit.annotations.NoteAnnotation) {
                        val iconString = updateMap.getString(key)
                        if (iconString != null) {
                            // Convert string to NoteIcon enum if needed
                            // annotation.iconName = iconString
                        }
                    }
                }

                "rotation" -> {
                    if (annotation is com.pspdfkit.annotations.FreeTextAnnotation) {
                        if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Number) {
                            annotation.rotation = updateMap.getInt(key)
                        }
                    }
                }

                "backgroundColor" -> {
                    val colorString = updateMap.getString(key)
                    if (colorString != null) {
                        try {
                            val color = android.graphics.Color.parseColor(colorString)
                            if (annotation is com.pspdfkit.annotations.InkAnnotation) {
                                annotation.fillColor = color
                            }
                        } catch (e: Exception) {
                            // Invalid color string, skip
                        }
                    }
                }

                "isSignature" -> {
                    if (updateMap.hasKey(key) && updateMap.getType(key) == ReadableType.Boolean) {
                        val isSignature = updateMap.getBoolean(key)
                        if (annotation is com.pspdfkit.annotations.InkAnnotation) {
                            annotation.setIsSignature(isSignature)
                        } else if (annotation is com.pspdfkit.annotations.StampAnnotation) {
                            annotation.setIsSignature(isSignature)
                        }
                    }
                }

                "lines" -> {
                    if (annotation is com.pspdfkit.annotations.InkAnnotation) {
                        val linesMap = updateMap.getMap(key)
                        if (linesMap != null) {
                            val pointsArray = linesMap.getArray("points")
                            if (pointsArray != null) {
                                // CRITICAL: Convert from Instant JSON coordinates to PDF coordinates
                                // Instant JSON: top-left origin, Y increases downward (Y=0 at top)
                                // PDF coordinates: bottom-left origin, Y increases upward (Y=0 at bottom)
                                // Conversion: pdfY = pageHeight - instantJsonY
                                val pageSize = document.getPageSize(annotation.pageIndex)
                                val pageHeight = pageSize?.height ?: 0f

                                val strokes = mutableListOf<MutableList<android.graphics.PointF>>()

                                for (i in 0 until pointsArray.size()) {
                                    val strokeArray = pointsArray.getArray(i)
                                    if (strokeArray != null) {
                                        val stroke = mutableListOf<android.graphics.PointF>()
                                        for (j in 0 until strokeArray.size()) {
                                            val pointArray = strokeArray.getArray(j)
                                            if (pointArray != null && pointArray.size() >= 2) {
                                                // Points come in Instant JSON format: [x, y] with top-left origin
                                                // PSPDFKit's lines property expects PDF coordinates: bottom-left origin
                                                val instantJsonX = pointArray.getDouble(0).toFloat()
                                                val instantJsonY = pointArray.getDouble(1).toFloat()

                                                // Convert to PDF coordinates
                                                val pdfX = instantJsonX  // X stays the same
                                                val pdfY = if (pageHeight > 0) pageHeight - instantJsonY else instantJsonY  // Flip Y: pdfY = pageHeight - instantJsonY

                                                stroke.add(android.graphics.PointF(pdfX, pdfY))
                                            }
                                        }
                                        if (stroke.isNotEmpty()) {
                                            strokes.add(stroke)
                                        }
                                    }
                                }

                                // Use the simple setLines API (expects PDF coordinates)
                                annotation.lines = strokes
                            }
                        }
                    }
                }

                "startPoint" -> {
                    if (annotation is com.pspdfkit.annotations.LineAnnotation) {
                        val pointArray = updateMap.getArray(key)
                        if (pointArray != null && pointArray.size() == 2) {
                            // CRITICAL: Convert from Instant JSON coordinates to PDF coordinates
                            // Instant JSON: top-left origin, Y increases downward (Y=0 at top)
                            // PDF coordinates: bottom-left origin, Y increases upward (Y=0 at bottom)
                            // Conversion: pdfY = pageHeight - instantJsonY
                            val pageSize = document.getPageSize(annotation.pageIndex)
                            val pageHeight = pageSize?.height ?: 0f

                            val instantJsonX = pointArray.getDouble(0).toFloat()
                            val instantJsonY = pointArray.getDouble(1).toFloat()

                            // Convert to PDF coordinates
                            val pdfX = instantJsonX  // X stays the same
                            val pdfY = if (pageHeight > 0) pageHeight - instantJsonY else instantJsonY  // Flip Y: pdfY = pageHeight - instantJsonY

                            val newStartPoint = android.graphics.PointF(pdfX, pdfY)

                            // Get current end point to preserve it, or use start point if not set
                            val currentEndPoint = annotation.points.second ?: newStartPoint

                            annotation.setPoints(newStartPoint, currentEndPoint)
                        }
                    }
                }

                "endPoint" -> {
                    if (annotation is com.pspdfkit.annotations.LineAnnotation) {
                        val pointArray = updateMap.getArray(key)
                        if (pointArray != null && pointArray.size() == 2) {
                            // CRITICAL: Convert from Instant JSON coordinates to PDF coordinates
                            // Instant JSON: top-left origin, Y increases downward (Y=0 at top)
                            // PDF coordinates: bottom-left origin, Y increases upward (Y=0 at bottom)
                            // Conversion: pdfY = pageHeight - instantJsonY
                            val pageSize = document.getPageSize(annotation.pageIndex)
                            val pageHeight = pageSize?.height ?: 0f

                            val instantJsonX = pointArray.getDouble(0).toFloat()
                            val instantJsonY = pointArray.getDouble(1).toFloat()

                            // Convert to PDF coordinates
                            val pdfX = instantJsonX  // X stays the same
                            val pdfY = if (pageHeight > 0) pageHeight - instantJsonY else instantJsonY  // Flip Y: pdfY = pageHeight - instantJsonY

                            val newEndPoint = android.graphics.PointF(pdfX, pdfY)

                            // Get current start point to preserve it, or use end point if not set
                            val currentStartPoint = annotation.points.first ?: newEndPoint

                            annotation.setPoints(currentStartPoint, newEndPoint)
                        }
                    }
                }

                else -> {
                    // Not implemented
                }
            }
        }
    }

    @ReactMethod fun getPageTextRects(reference: Int, pageIndex: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let { document ->
                if (pageIndex < 0 || pageIndex >= document.pageCount) {
                    promise.reject("getPageTextRects", "Page index out of bounds", null)
                    return
                }

                // Get page size for coordinate conversion
                val pageSize = document.getPageSize(pageIndex)
                val pageHeight = pageSize?.height ?: 0f

                // Get the full page text
                val pageText = document.getPageText(pageIndex)
                if (pageText == null || pageText.isEmpty()) {
                    promise.resolve(Arguments.makeNativeArray(ArrayList<Map<String, Any>>()))
                    return
                }

                val wordRects = ArrayList<Map<String, Any>>()

                // Split text into words using regex
                val wordPattern = "\\S+".toRegex()
                val matches = wordPattern.findAll(pageText)

                for (match in matches) {
                    val word = match.value
                    val wordStart = match.range.first
                    val wordLength = match.range.last - match.range.first + 1

                    try {
                        // Get text rects for this specific word's character range
                        val wordRectsList: List<RectF> = document.getPageTextRects(pageIndex, wordStart, wordLength, true)

                        if (wordRectsList.isNotEmpty()) {
                            // Merge multiple rects into one bounding box for the word
                            var minLeft = Float.MAX_VALUE
                            var minTop = Float.MAX_VALUE
                            var maxRight = Float.MIN_VALUE
                            var maxBottom = Float.MIN_VALUE

                            for (rect in wordRectsList) {
                                minLeft = minOf(minLeft, rect.left)
                                minTop = minOf(minTop, rect.top)
                                maxRight = maxOf(maxRight, rect.right)
                                maxBottom = maxOf(maxBottom, rect.bottom)
                            }

                            // Return PDF coordinates to match iOS (bottom-left origin, y increases upward)
                            // Calculate height as absolute difference (always positive)
                            val height = kotlin.math.abs(minTop - maxBottom)

                            // Determine y coordinate (bottom edge in PDF coords)
                            // If minTop > maxBottom: PDF coords, use maxBottom directly
                            // If minTop < maxBottom: Screen coords, convert maxBottom to PDF
                            val y = if (minTop > maxBottom) {
                                maxBottom  // Already PDF coords, bottom edge
                            } else {
                                pageHeight - maxBottom  // Convert from screen to PDF coords
                            }

                            val wordMap = mapOf(
                                "text" to word,
                                "frame" to mapOf(
                                    "x" to minLeft,
                                    "y" to y,
                                    "width" to (maxRight - minLeft),
                                    "height" to height
                                )
                            )
                            wordRects.add(wordMap)
                        }
                    } catch (e: Exception) {
                        // If getting rects for this word fails, skip it and continue
                        continue
                    }
                }

                promise.resolve(Arguments.makeNativeArray(wordRects))
            } ?: run {
                promise.reject("getPageTextRects", "Document is nil", null)
            }
        } catch (e: Throwable) {
            promise.reject("getPageTextRects", e.message ?: "Error getting text rects", e)
        }
    }

    @ReactMethod fun addElectronicSignatureFormField(reference: Int, signatureData: ReadableMap, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let { document ->
                val pageIndex = signatureData.getInt("pageIndex")
                val bboxArray = signatureData.getArray("bbox")

                if (bboxArray == null || bboxArray.size() != 4) {
                    promise.reject("addElectronicSignatureFormField", "Invalid bbox array", null)
                    return
                }

                // Bbox comes in PDF coordinates (from getPageTextRects, matching iOS)
                // Match iOS approach: use bottom as y coordinate, calculate height
                val left = bboxArray.getDouble(0).toFloat()
                var topPDF = bboxArray.getDouble(1).toFloat()  // PDF coordinates
                val right = bboxArray.getDouble(2).toFloat()
                var bottomPDF = bboxArray.getDouble(3).toFloat()  // PDF coordinates

                // Handle case where TypeScript sends top < bottom (backwards for PDF)
                if (topPDF < bottomPDF) {
                    val temp = topPDF
                    topPDF = bottomPDF
                    bottomPDF = temp
                }

                // Match iOS: iOS uses CGRect(x: left, y: bottom, width: right-left, height: top-bottom)
                // Use PDF coordinates directly - PSPDFKit Android should handle PDF coords like iOS
                // RectF(left, top, right, bottom) where in PDF coords: top > bottom (top is higher y)
                val rectFSignatureFormConfiguration = RectF(
                    left,
                    topPDF,
                    right,
                    bottomPDF
                )

                val fullyQualifiedName = signatureData.getString("fullyQualifiedName")
                if (fullyQualifiedName == null) {
                    promise.reject("addElectronicSignatureFormField", "fullyQualifiedName is required", null)
                    return
                }

                val signatureFormConfiguration = SignatureFormConfiguration.Builder(pageIndex, rectFSignatureFormConfiguration)
                    .build()

                document.formProvider.addFormElementToPage(fullyQualifiedName, signatureFormConfiguration)
                promise.resolve(true)
            } ?: run {
                promise.reject("addElectronicSignatureFormField", "Document is nil", null)
            }
        } catch (e: Throwable) {
            promise.reject("addElectronicSignatureFormField", e.message ?: "Failed to add signature field", e)
        }
    }

    @ReactMethod fun addTextFormField(reference: Int, formData: ReadableMap, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let { document ->
                val pageIndex = formData.getInt("pageIndex")
                val bboxArray = formData.getArray("bbox")

                if (bboxArray == null || bboxArray.size() != 4) {
                    promise.reject("addTextFormField", "Invalid bbox array", null)
                    return
                }

                // Bbox comes in PDF coordinates (from getPageTextRects, matching iOS)
                // Match iOS approach: use bottom as y coordinate, calculate height
                val left = bboxArray.getDouble(0).toFloat()
                var topPDF = bboxArray.getDouble(1).toFloat()  // PDF coordinates
                val right = bboxArray.getDouble(2).toFloat()
                var bottomPDF = bboxArray.getDouble(3).toFloat()  // PDF coordinates

                // Handle case where TypeScript sends top < bottom (backwards for PDF)
                if (topPDF < bottomPDF) {
                    val temp = topPDF
                    topPDF = bottomPDF
                    bottomPDF = temp
                }

                // Match iOS: iOS uses CGRect(x: left, y: bottom, width: right-left, height: top-bottom)
                // Use PDF coordinates directly - PSPDFKit Android should handle PDF coords like iOS
                // RectF(left, top, right, bottom) where in PDF coords: top > bottom (top is higher y)
                val rectFFormConfiguration = RectF(
                    left,
                    topPDF,
                    right,
                    bottomPDF
                )

                val fullyQualifiedName = formData.getString("fullyQualifiedName")
                if (fullyQualifiedName == null) {
                    promise.reject("addTextFormField", "fullyQualifiedName is required", null)
                    return
                }

                val textFormConfiguration = TextFormConfiguration.Builder(pageIndex, rectFFormConfiguration)
                    .build()

                document.formProvider.addFormElementToPage(fullyQualifiedName, textFormConfiguration)
                promise.resolve(true)
            } ?: run {
                promise.reject("addTextFormField", "Document is nil", null)
            }
        } catch (e: Throwable) {
            promise.reject("addTextFormField", e.message ?: "Failed to add text field", e)
        }
    }

    companion object {
        const val NAME = "PDFDocumentManager"
    }
}