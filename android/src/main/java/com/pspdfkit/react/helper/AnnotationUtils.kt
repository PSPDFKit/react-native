package com.pspdfkit.react.helper

import com.pspdfkit.annotations.Annotation
import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.annotations.WidgetAnnotation
import org.json.JSONObject

object AnnotationUtils {
    @JvmStatic
    fun processAnnotation(annotation: Annotation): Map<String, Any> {
        return try {
            val instantJson = JSONObject(annotation.toInstantJson())
            val annotationMap = JsonUtilities.jsonObjectToMap(instantJson)
            // Keeping the uuid and isRequired props for backwards compatibility
            annotationMap["uuid"] = annotation.uuid
            if (annotation.type == AnnotationType.WIDGET) {
                val widgetAnnotation: WidgetAnnotation = annotation as WidgetAnnotation
                widgetAnnotation.formElement?.let { formElement ->
                    annotationMap["formElement"] = FormUtils.formElementToJSON(formElement)
                    annotationMap["isRequired"] = widgetAnnotation.formElement?.isRequired
                }
            }
            annotationMap
        } catch (e: Exception) {
            e.printStackTrace()
            emptyMap()
        }
    }
} 