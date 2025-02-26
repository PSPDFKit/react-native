package com.pspdfkit.react

import android.os.Bundle
import android.graphics.PointF
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.pspdfkit.PSPDFKit
import com.pspdfkit.analytics.AnalyticsClient
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.annotations.WidgetAnnotation
import com.pspdfkit.forms.ChoiceFormElement
import com.pspdfkit.forms.ComboBoxFormElement
import com.pspdfkit.forms.EditableButtonFormElement
import com.pspdfkit.forms.FormElement
import com.pspdfkit.forms.FormField
import com.pspdfkit.forms.TextFormElement
import com.pspdfkit.react.helper.JsonUtilities
import org.json.JSONObject

class CustomAnalyticsClient: AnalyticsClient {
    override fun onEvent(name: String, data: Bundle?) {
        NutrientNotificationCenter.analyticsReceived(name, data)
    }
}

enum class NotificationEvent(val value: String) {
    DOCUMENT_LOADED("documentLoaded"),
    DOCUMENT_LOAD_FAILED("documentLoadFailed"),
    DOCUMENT_PAGE_CHANGED("documentPageChanged"),
    DOCUMENT_SCROLLED("documentScrolled"),
    ANNOTATIONS_ADDED("annotationsAdded"),
    ANNOTATION_CHANGED("annotationChanged"),
    ANNOTATIONS_REMOVED("annotationsRemoved"),
    ANNOTATIONS_SELECTED("annotationsSelected"),
    ANNOTATIONS_DESELECTED("annotationsDeselected"),
    ANNOTATION_TAPPED("annotationTapped"),
    TEXT_SELECTED("textSelected"),
    FORM_FIELD_VALUES_UPDATED("formFieldValuesUpdated"),
    FORM_FIELD_SELECTED("formFieldSelected"),
    FORM_FIELD_DESELECTED("formFieldDeselected"),
    ANALYTICS("analytics");
}

object NutrientNotificationCenter {
    private var internalReactContext: ReactContext? = null
    private var isInUse = false
    private var customAnalyticsClient = CustomAnalyticsClient()

    fun setReactContext(ctx: ReactContext) {
        internalReactContext = ctx
    }

    fun setIsNotificationCenterInUse(inUse: Boolean) {
        isInUse = inUse
    }

    fun getIsNotificationCenterInUse(): Boolean {
        return isInUse
    }

    private fun sendEvent(
        eventName: String,
        params: WritableMap
    ) {
        internalReactContext
            ?.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java)
            ?.emit(eventName, params)
    }

    fun documentLoaded(documentID: String) {
        val jsonData = Arguments.createMap()
        jsonData.putString("event", NotificationEvent.DOCUMENT_LOADED.value)
        jsonData.putString("documentID", documentID)
        sendEvent(NotificationEvent.DOCUMENT_LOADED.value, jsonData)
    }

    fun documentLoadFailed() {
        val jsonData = Arguments.createMap()
        jsonData.putString("event", NotificationEvent.DOCUMENT_LOAD_FAILED.value)
        sendEvent(NotificationEvent.DOCUMENT_LOAD_FAILED.value, jsonData)
    }

    fun documentPageChanged(pageIndex: Int, documentID: String) {
        val jsonData = Arguments.createMap()
        jsonData.putString("event", NotificationEvent.DOCUMENT_PAGE_CHANGED.value)
        jsonData.putInt("pageIndex", pageIndex)
        jsonData.putString("documentID", documentID)
        sendEvent(NotificationEvent.DOCUMENT_PAGE_CHANGED.value, jsonData)
    }

    fun documentScrolled(scrollData: Map<String, Int>, documentID: String) {
        val jsonData = Arguments.createMap()
        val scrollDataMap = Arguments.createMap()
        scrollData.forEach { (key, value) ->
            scrollDataMap.putInt(key, value)
        }
        jsonData.putString("event", NotificationEvent.DOCUMENT_SCROLLED.value)
        jsonData.putMap("scrollData", scrollDataMap)
        jsonData.putString("documentID", documentID)
        sendEvent(NotificationEvent.DOCUMENT_SCROLLED.value, jsonData)
    }

    fun annotationsChanged(changeType: String, annotation: Annotation, documentID: String) {
        when (changeType) {
            "changed" -> {
                try {
                    val instantJson = JSONObject(annotation.toInstantJson())
                    val annotationsList = mutableListOf<Map<String, Any>>()
                    val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
                    annotationMap["uuid"] = annotation.uuid
                    if (annotation.type == AnnotationType.WIDGET) {
                        val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                        annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
                    }
                    annotationsList.add(annotationMap)
                    val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

                    val jsonData = Arguments.createMap()
                    jsonData.putString("event", NotificationEvent.ANNOTATION_CHANGED.value)
                    jsonData.putArray("annotations", nativeAnnotationsList)
                    jsonData.putString("documentID", documentID)
                    sendEvent(NotificationEvent.ANNOTATION_CHANGED.value, jsonData)
                } catch (e: Exception) {
                    // Could not decode annotation data
                }
            }
            "removed" -> {
                val annotationsList = mutableListOf<Map<String, Any>>()
                val annotationMap = HashMap<String, String>()
                annotation.name?.let { annotationMap["name"] = it }
                annotation.creator?.let { annotationMap["creatorName"] = it }
                annotationMap["uuid"] = annotation.uuid
                annotationsList.add(annotationMap)
                val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

                val jsonData = Arguments.createMap()
                jsonData.putString("event", NotificationEvent.ANNOTATIONS_REMOVED.value)
                jsonData.putArray("annotations", nativeAnnotationsList)
                jsonData.putString("documentID", documentID)
                sendEvent(NotificationEvent.ANNOTATION_CHANGED.value, jsonData)
            }
            "added" -> {
                try {
                    val instantJson = JSONObject(annotation.toInstantJson())
                    val annotationsList = mutableListOf<Map<String, Any>>()
                    val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
                    annotationMap["uuid"] = annotation.uuid
                    if (annotation.type == AnnotationType.WIDGET) {
                        val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                        annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
                    }
                    annotationsList.add(annotationMap)
                    val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

                    val jsonData = Arguments.createMap()
                    jsonData.putString("event", NotificationEvent.ANNOTATIONS_ADDED.value)
                    jsonData.putArray("annotations", nativeAnnotationsList)
                    jsonData.putString("documentID", documentID)
                    sendEvent(NotificationEvent.ANNOTATIONS_ADDED.value, jsonData)
                } catch (e: Exception) {
                    // Could not decode annotation data
                }
            }
        }
    }

    fun didSelectAnnotations(annotation: Annotation, documentID: String) {
        try {
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationsList = mutableListOf<Map<String, Any>>()
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }
            annotationsList.add(annotationMap)
            val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.ANNOTATIONS_SELECTED.value)
            jsonData.putArray("annotations", nativeAnnotationsList)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.ANNOTATIONS_SELECTED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun didDeselectAnnotations(annotation: Annotation, documentID: String) {
        try {
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationsList = mutableListOf<Map<String, Any>>()
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }
            annotationsList.add(annotationMap)
            val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.ANNOTATIONS_DESELECTED.value)
            jsonData.putArray("annotations", nativeAnnotationsList)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.ANNOTATIONS_DESELECTED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun didTapAnnotation(annotation: Annotation, pointF: PointF, documentID: String) {
        try {
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }
            val nativeAnnotationMap = Arguments.makeNativeMap(annotationMap)

            val pointMap = mapOf("x" to pointF.x, "y" to pointF.y)
            val nativePointMap = Arguments.makeNativeMap(pointMap)

            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.ANNOTATION_TAPPED.value)
            jsonData.putMap("annotation", nativeAnnotationMap)
            jsonData.putMap("annotationPoint", nativePointMap)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.ANNOTATION_TAPPED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun didSelectText(text: String, documentID: String) {
        val jsonData = Arguments.createMap()
        jsonData.putString("event", NotificationEvent.TEXT_SELECTED.value)
        jsonData.putString("text", text)
        jsonData.putString("documentID", documentID)
        sendEvent(NotificationEvent.TEXT_SELECTED.value, jsonData)
    }

    fun formFieldValuesUpdated(formField: FormField, documentID: String) {
        try {
            val annotation = formField.formElement.annotation
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationsList = mutableListOf<Map<String, Any>>()
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }

            (formField.formElement as? TextFormElement).let { textFormElement ->
                if (textFormElement != null) {
                    annotationMap["value"] = textFormElement.text
                }
            }
            (formField.formElement as? EditableButtonFormElement).let { buttonFormElement ->
                if (buttonFormElement != null) {
                    annotationMap["value"] = if (buttonFormElement.isSelected) "selected" else "deselected"
                }
            }
            (formField.formElement as? ComboBoxFormElement).let { comboBoxFormElement ->
                if (comboBoxFormElement != null) {
                    annotationMap["value"] = if (comboBoxFormElement.isCustomTextSet) comboBoxFormElement.customText else comboBoxFormElement.selectedIndexes
                }
            }
            (formField.formElement as? ChoiceFormElement).let { choiceFormElement ->
                if (choiceFormElement != null) {
                    annotationMap["value"] = choiceFormElement.selectedIndexes
                }
            }

            annotationsList.add(annotationMap)
            val nativeAnnotationsList = Arguments.makeNativeArray(annotationsList)

            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.FORM_FIELD_VALUES_UPDATED.value)
            jsonData.putArray("annotations", nativeAnnotationsList)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.FORM_FIELD_VALUES_UPDATED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun didSelectFormField(formElement: FormElement, documentID: String) {
        try {
            val annotation = formElement.annotation
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }

            (formElement as? TextFormElement).let { textFormElement ->
                if (textFormElement != null) {
                    annotationMap["value"] = textFormElement.text
                }
            }
            (formElement as? EditableButtonFormElement).let { buttonFormElement ->
                if (buttonFormElement != null) {
                    annotationMap["value"] = if (buttonFormElement.isSelected) "selected" else "deselected"
                }
            }
            (formElement as? ComboBoxFormElement).let { comboBoxFormElement ->
                if (comboBoxFormElement != null) {
                    annotationMap["value"] = if (comboBoxFormElement.isCustomTextSet) comboBoxFormElement.customText else comboBoxFormElement.selectedIndexes
                }
            }
            (formElement as? ChoiceFormElement).let { choiceFormElement ->
                if (choiceFormElement != null) {
                    annotationMap["value"] = choiceFormElement.selectedIndexes
                }
            }

            val nativeAnnotationMap = Arguments.makeNativeMap(annotationMap)
            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.FORM_FIELD_SELECTED.value)
            jsonData.putMap("annotation", nativeAnnotationMap)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.FORM_FIELD_SELECTED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun didDeSelectFormField(formElement: FormElement, documentID: String) {
        try {
            val annotation = formElement.annotation
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation : WidgetAnnotation = annotation as WidgetAnnotation
                annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
            }

            (formElement as? TextFormElement).let { textFormElement ->
                if (textFormElement != null) {
                    annotationMap["value"] = textFormElement.text
                }
            }
            (formElement as? EditableButtonFormElement).let { buttonFormElement ->
                if (buttonFormElement != null) {
                    annotationMap["value"] = if (buttonFormElement.isSelected) "selected" else "deselected"
                }
            }
            (formElement as? ComboBoxFormElement).let { comboBoxFormElement ->
                if (comboBoxFormElement != null) {
                    annotationMap["value"] = if (comboBoxFormElement.isCustomTextSet) comboBoxFormElement.customText else comboBoxFormElement.selectedIndexes
                }
            }
            (formElement as? ChoiceFormElement).let { choiceFormElement ->
                if (choiceFormElement != null) {
                    annotationMap["value"] = choiceFormElement.selectedIndexes
                }
            }

            val nativeAnnotationMap = Arguments.makeNativeMap(annotationMap)
            val jsonData = Arguments.createMap()
            jsonData.putString("event", NotificationEvent.FORM_FIELD_DESELECTED.value)
            jsonData.putMap("annotation", nativeAnnotationMap)
            jsonData.putString("documentID", documentID)
            sendEvent(NotificationEvent.FORM_FIELD_DESELECTED.value, jsonData)
        } catch (e: Exception) {
            // Could not decode annotation data
        }
    }

    fun analyticsEnabled() {
        PSPDFKit.addAnalyticsClient(customAnalyticsClient)
    }

    fun analyticsDisabled() {
        PSPDFKit.removeAnalyticsClient(customAnalyticsClient)
    }

    fun analyticsReceived(event: String, attributes: Bundle?) {
        val jsonData = Arguments.createMap()
        val attributesMap = Arguments.createMap()
        if (attributes != null) {
            for (key in attributes.keySet()) {
                attributesMap.putString(key, attributes.getString(key))
            }
        }
        jsonData.putString("analyticsEvent", event)
        jsonData.putMap("attributes", attributesMap)
        jsonData.putString("event", NotificationEvent.ANALYTICS.value)
        sendEvent(NotificationEvent.ANALYTICS.value, jsonData)
    }
}