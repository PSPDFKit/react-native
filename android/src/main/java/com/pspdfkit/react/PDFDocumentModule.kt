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
import com.pspdfkit.annotations.AnnotationProvider.ALL_ANNOTATION_TYPES
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
import com.pspdfkit.forms.TextFormElement
import com.pspdfkit.react.helper.AnnotationUtils
import com.pspdfkit.react.helper.ConversionHelpers.getAnnotationTypes
import com.pspdfkit.react.helper.DocumentJsonDataProvider
import com.pspdfkit.react.helper.FormUtils
import com.pspdfkit.react.helper.JsonUtilities
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.schedulers.Schedulers
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.util.EnumSet

data class DocumentData(val document: PdfDocument, var imageDocument: ImageDocument?)

@ReactModule(name = PDFDocumentModule.NAME)
class PDFDocumentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var documents = mutableMapOf<Int, DocumentData>()
    private var documentConfigurations = mutableMapOf<Int, MutableMap<String, Any>>()

    override fun getName(): String {
        return NAME
    }
    
    private fun getDocument(reference: Int): DocumentData? {
        return this.documents[reference]
    }

    private fun getDocumentConfiguration(reference: Int): MutableMap<String, Any>? {
        return this.documentConfigurations[reference]
    }

    fun setDocument(document: PdfDocument, imageDocument: ImageDocument?, reference: Int) {
        val docData = DocumentData(document, imageDocument)
        // If this document has already been set and contained an imageDocument, retain the imageDocument
        this.getDocument(reference)?.imageDocument?.let {
            if (docData.imageDocument == null) {
                docData.imageDocument = it
            }
        }
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
            this.getDocument(reference)?.document?.let {
                val outputStream = ByteArrayOutputStream()
                DocumentJsonFormatter.exportDocumentJsonAsync(it, outputStream)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                {
                                    val json = JSONObject(outputStream.toString())
                                    val jsonMap = JsonUtilities.jsonObjectToMap(json)
                                    val nativeMap = Arguments.makeNativeMap(jsonMap)
                                    promise.resolve(nativeMap)
                                }, { e ->
                                    promise.reject(RuntimeException(e))
                                }
                        )
            }
        } catch (e: Throwable) {
            promise.reject("getAllUnsavedAnnotations error", e)
        }
    }

    @ReactMethod fun getAnnotations(reference: Int, type: String?, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {
                it.annotationProvider.getAllAnnotationsOfTypeAsync(if (type == null) ALL_ANNOTATION_TYPES else getAnnotationTypes(Arguments.makeNativeArray<String>(arrayOf(type))))
                        .toList()
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                { annotations ->
                                    var annotationsSerialized: ArrayList<Map<String, Any>> = ArrayList()
                                    for (annotation in annotations) {
                                        if (annotation.type == AnnotationType.POPUP) {
                                            continue
                                        }
                                        val annotationMap = AnnotationUtils.processAnnotation(annotation)
                                        annotationsSerialized.add(annotationMap)
                                    }
                                    val nativeList = Arguments.makeNativeArray(annotationsSerialized)
                                    promise.resolve(nativeList)
                                }, { e ->
                                    promise.reject(RuntimeException(e))
                                }
                        )
            }
        } catch (e: Throwable) {
            promise.reject("getAnnotations error", e)
        }
    }

    @ReactMethod fun getAnnotationsForPage(reference: Int, pageIndex: Int, type: String?, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {

                if (pageIndex > it.pageCount-1) {
                    promise.reject(RuntimeException("Specified page index is out of bounds"))
                    return
                }

                it.annotationProvider.getAllAnnotationsOfTypeAsync(if (type == null) EnumSet.allOf(AnnotationType::class.java) else
                    getAnnotationTypes(Arguments.makeNativeArray<String>(arrayOf(type))), pageIndex, 1)
                        .toList()
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                { annotations ->
                                    var annotationsSerialized: ArrayList<Map<String, Any>> = ArrayList()
                                    for (annotation in annotations) {
                                        if (annotation.type == AnnotationType.POPUP) {
                                            continue
                                        }
                                        val annotationMap = AnnotationUtils.processAnnotation(annotation)
                                        annotationsSerialized.add(annotationMap)
                                    }
                                    val nativeList = Arguments.makeNativeArray(annotationsSerialized)
                                    promise.resolve(nativeList)
                                }, { e ->
                                    promise.reject(RuntimeException(e))
                                }
                        )
            }
        } catch (e: Throwable) {
            promise.reject("getAnnotationsForPage error", e)
        }
    }

    @ReactMethod fun removeAnnotations(reference: Int, instantJSON: ReadableArray, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {

                val instantJSONArray: List<Map<String, Any>> = instantJSON.toArrayList().filterIsInstance<Map<String, Any>>()
                var annotationsToDelete: ArrayList<Annotation> = ArrayList()
                it.annotationProvider.getAllAnnotationsOfTypeAsync(ALL_ANNOTATION_TYPES)
                        .toList()
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                { annotations ->
                                    for (annotation in annotations) {
                                        for (instantJSONAnnotation in instantJSONArray) {
                                            if (annotation.name == instantJSONAnnotation["name"] ||
                                                    annotation.uuid == instantJSONAnnotation["uuid"]) {
                                                annotationsToDelete.add(annotation)
                                            }
                                        }
                                    }

                                    for (annotation in annotationsToDelete) {
                                        it.annotationProvider.removeAnnotationFromPage(annotation)
                                    }
                                    promise.resolve(true)
                                }, { e ->
                                    promise.reject(RuntimeException(e))
                                }
                        )
            }
        } catch (e: Throwable) {
            promise.reject("removeAnnotations error", e)
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
            applyInstantJSON(reference, instantJSON.asMap(), promise)
            return
        }

        try {
            this.getDocument(reference)?.document?.let { document ->
                if (instantJSON.type == ReadableType.Array) {
                    val instantJSONArray = instantJSON.asArray()
                    val hasImageAnnotations = (0 until instantJSONArray.size()).any { i ->
                        val annotation = instantJSONArray.getMap(i)
                        val hashMap = annotation?.toHashMap() as? Map<String, Any>
                        hashMap?.containsKey("imageAttachmentId") == true
                    }

                    if (hasImageAnnotations) {
                        // If there are any image annotations, process them all at once
                        val attachmentsJSONMap = attachments.asMap()
                        val instantData = createInstantObject(instantJSONArray, attachmentsJSONMap)
                        if (instantData != null) {
                            applyInstantJSON(reference, instantData, promise)
                            return
                        }
                    } else {
                        // Process non-image annotations directly
                        for (i in 0 until instantJSONArray.size()) {
                            try {
                                val annotation = instantJSONArray.getMap(i)
                                val hashMap = annotation!!.toHashMap() as Map<String, Any>
                                document.annotationProvider.createAnnotationFromInstantJson(
                                    JSONObject(hashMap).toString()
                                )
                            } catch (e: Exception) {
                                promise.reject("addAnnotations error", e)
                                return
                            }
                        }
                        promise.resolve(true)
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
                val json = JSONObject(instantJSON.toHashMap() as Map<*, *>?)
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

                XfdfFormatter.parseXfdfAsync(it, ContentResolverDataProvider((Uri.parse(importPath))))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                { annotations ->
                                    for (annotation in annotations) {
                                        it.annotationProvider.addAnnotationToPage(annotation)
                                    }
                                    val result = JSONObject()
                                    result.put("success", true)
                                    val jsonMap = JsonUtilities.jsonObjectToMap(result)
                                    val nativeMap = Arguments.makeNativeMap(jsonMap)
                                    promise.resolve(nativeMap)
                                }, { e ->
                                    promise.reject("importXFDF error", e)
                                })
            }
        } catch (e: Throwable) {
            promise.reject("importXFDF error", e)
        }
    }

    @ReactMethod fun exportXFDF(reference: Int, filePath: String, promise: Promise) {
        try {
            this.getDocument(reference)?.document?.let {
                var exportPath = filePath;
                if (Uri.parse(exportPath).scheme == null) {
                    exportPath = "file:///$filePath";
                }

                val outputStream = reactApplicationContext.contentResolver.openOutputStream(Uri.parse(exportPath))
                if (outputStream == null) {
                    promise.reject("exportXFDF error", RuntimeException("Could not write to supplied file path error"))
                    return
                }

                val allAnnotations = it.annotationProvider.getAllAnnotationsOfType(ALL_ANNOTATION_TYPES)
                var allFormFields: List<com.pspdfkit.forms.FormField> = emptyList()
                if (PSPDFKit.getLicenseFeatures().contains(LicenseFeature.FORMS)) {
                    allFormFields = it.formProvider.formFields
                }

                XfdfFormatter.writeXfdfAsync(it, allAnnotations, allFormFields, outputStream)
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                {
                                    val result = JSONObject()
                                    result.put("success", true)
                                    result.put("filePath", filePath)
                                    val jsonMap = JsonUtilities.jsonObjectToMap(result)
                                    val nativeMap = Arguments.makeNativeMap(jsonMap)
                                    promise.resolve(nativeMap)
                                }, { e ->
                            promise.reject("exportXFDF error", e)
                        })
            }
        } catch (e: Throwable) {
            promise.reject("exportXFDF error", e)
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

                it.formProvider.getFormElementWithNameAsync(fullyQualifiedName)
                    .subscribeOn(Schedulers.io())
                    .observeOn(AndroidSchedulers.mainThread())
                    .subscribe(
                        { formElement ->
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
                                        val indices = value.asArray().toArrayList().filterIsInstance<Int>()
                                        formElement.selectedIndexes = indices
                                        success = true
                                    } else if (value.type == ReadableType.String) {
                                        try {
                                            val index = value.asString().toInt()
                                            formElement.selectedIndexes = listOf(index)
                                            success = true
                                        } catch (e: NumberFormatException) {
                                            // Handle custom text for combo box
                                            if (formElement is ComboBoxFormElement) {
                                                formElement.customText = value.asString()
                                                success = true
                                            }
                                        }
                                    }
                                }
                                is TextFormElement -> {
                                    if (value.type == ReadableType.String) {
                                        formElement.setText(value.asString())
                                        success = true
                                    }
                                }
                            }

                            if (success) {
                                promise.resolve(true)
                            } else {
                                promise.reject("updateFormFieldValue", "Could not update form field value")
                            }
                        },
                        { e ->
                            promise.reject("updateFormFieldValue", e)
                        }
                    )
            }
        } catch (e: Throwable) {
            promise.reject("updateFormFieldValue", e)
        }
    }

    companion object {
        const val NAME = "PDFDocumentManager"
    }
}