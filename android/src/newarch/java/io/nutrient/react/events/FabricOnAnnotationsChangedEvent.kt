/*
 * FabricOnAnnotationsChangedEvent.kt
 *
 *   Nutrient
 *
 *   Copyright © 2021-2025 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package io.nutrient.react.events

import androidx.annotation.NonNull
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.pspdfkit.annotations.Annotation
import com.pspdfkit.react.helper.AnnotationUtils
import org.json.JSONArray
import org.json.JSONObject

class FabricOnAnnotationsChangedEvent(surfaceId: Int, viewId: Int, @NonNull private val eventType: String, @NonNull private val annotation: Annotation) : Event<FabricOnAnnotationsChangedEvent>(surfaceId, viewId) {

    companion object {
        const val EVENT_NAME = "onAnnotationsChanged"
    }

    override fun getEventName(): String {
        // Match Codegen's top-level name for BubblingEventHandler
        return "topAnnotationsChanged"
    }

    override fun getEventData(): WritableMap {
        val payload = Arguments.createMap()
        payload.putString("change", eventType)

        // Build JSON array of annotations for codegen compatibility
        val annotationsJson = JSONArray()
        try {
            val item = JSONObject()
            if ("removed" == eventType) {
                item.put("name", annotation.name)
                item.put("creatorName", annotation.creator)
                item.put("uuid", annotation.uuid)
                item.put("type", annotation.type.toString())
                item.put("pageIndex", annotation.pageIndex)
            } else {
                val processed = AnnotationUtils.processAnnotation(annotation)
                for ((key, value) in processed) {
                    item.put(key, value)
                }
            }
            annotationsJson.put(item)
        } catch (_: Exception) {
            val fallback = JSONObject()
            fallback.put("uuid", annotation.uuid)
            fallback.put("name", annotation.name)
            fallback.put("type", annotation.type.toString())
            fallback.put("pageIndex", annotation.pageIndex)
            annotationsJson.put(fallback)
        }

        payload.putString("annotationsJSONString", annotationsJson.toString())
        return payload
    }
}
