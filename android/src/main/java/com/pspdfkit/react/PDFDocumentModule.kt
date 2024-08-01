package com.pspdfkit.react

import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.annotations.AnnotationProvider.ALL_ANNOTATION_TYPES
import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.document.PdfDocument
import com.pspdfkit.document.formatters.DocumentJsonFormatter
import com.pspdfkit.document.formatters.XfdfFormatter
import com.pspdfkit.document.providers.ContentResolverDataProvider
import com.pspdfkit.document.providers.DataProvider
import com.pspdfkit.internal.model.ImageDocumentImpl
import com.pspdfkit.react.helper.ConversionHelpers.getAnnotationTypeFromString
import com.pspdfkit.react.helper.DocumentJsonDataProvider
import com.pspdfkit.react.helper.JsonUtilities
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.schedulers.Schedulers
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.util.EnumSet

@ReactModule(name = PDFDocumentModule.NAME)
class PDFDocumentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var documents = mutableMapOf<Int, PdfDocument>()
    private var documentConfigurations = mutableMapOf<Int, MutableMap<String, Any>>()

    override fun getName(): String {
        return NAME
    }

    private fun getDocument(reference: Int): PdfDocument? {
        return this.documents[reference]
    }

    private fun getDocumentConfiguration(reference: Int): MutableMap<String, Any>? {
        return this.documentConfigurations[reference]
    }

    fun setDocument(document: PdfDocument, reference: Int) {
        this.documents[reference] = document
    }

    fun updateDocumentConfiguration(key: String, value: Any, reference: Int) {
        val currentConfiguration = documentConfigurations[reference]
        currentConfiguration?.set(key, value)
    }

    @ReactMethod fun getDocumentId(reference: Int, promise: Promise) {
        try {
            promise.resolve(this.getDocument(reference)?.documentIdString)
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

    @ReactMethod fun save(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.let {
                if (it is ImageDocumentImpl.ImagePdfDocumentWrapper) {
                    val metadata = this.getDocumentConfiguration(reference)?.get("imageSaveMode")?.equals("flattenAndEmbed") == true
                    if (it.imageDocument.saveIfModified(metadata)) {
                        promise.resolve(true)
                    }
                } else {
                    it.saveIfModified()
                    promise.resolve(true)
                }
            }
            promise.reject("save error", RuntimeException("Could not save document"))
        } catch (e: Throwable) {
            promise.reject("save error", e)
        }
    }

    @ReactMethod fun getAllUnsavedAnnotations(reference: Int, promise: Promise) {
        try {
            this.getDocument(reference)?.let {
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
            this.getDocument(reference)?.let {
                it.annotationProvider.getAllAnnotationsOfTypeAsync(if (type == null) ALL_ANNOTATION_TYPES else getAnnotationTypeFromString(type))
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
                                        val annotationInstantJSON = JSONObject(annotation.toInstantJson())
                                        val annotationMap = JsonUtilities.jsonObjectToMap(annotationInstantJSON)
                                        annotationMap["uuid"] = annotation.uuid
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
            this.getDocument(reference)?.let {

                if (pageIndex > it.pageCount-1) {
                    promise.reject(RuntimeException("Specified page index is out of bounds"))
                    return
                }

                it.annotationProvider.getAllAnnotationsOfTypeAsync(if (type == null) EnumSet.allOf(AnnotationType::class.java) else
                    getAnnotationTypeFromString(type), pageIndex, 1)
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
                                        val annotationInstantJSON = JSONObject(annotation.toInstantJson())
                                        val annotationMap = JsonUtilities.jsonObjectToMap(annotationInstantJSON)
                                        annotationMap["uuid"] = annotation.uuid
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
            this.getDocument(reference)?.let {

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

    @ReactMethod fun addAnnotations(reference: Int, instantJSON: ReadableMap, promise: Promise) {
        try {
            this.getDocument(reference)?.let {
                val json = JSONObject(instantJSON.toHashMap())
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
            promise.reject("addAnnotations error", e)
        }
    }

    @ReactMethod fun importXFDF(reference: Int, filePath: String, promise: Promise) {
        try {
            this.getDocument(reference)?.let {
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
            this.getDocument(reference)?.let {
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
                val allFormFields = it.formProvider.formFields

                XfdfFormatter.writeXfdfAsync(it, allAnnotations, allFormFields, outputStream)
                XfdfFormatter.parseXfdfAsync(it, ContentResolverDataProvider((Uri.parse(exportPath))))
                        .subscribeOn(Schedulers.io())
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                { annotations ->
                                    for (annotation in annotations) {
                                        it.annotationProvider.addAnnotationToPage(annotation)
                                    }
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

    companion object {
        const val NAME = "PDFDocumentManager"
    }
}