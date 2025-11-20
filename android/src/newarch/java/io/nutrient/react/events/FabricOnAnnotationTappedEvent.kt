/*
 * FabricOnAnnotationTappedEvent.kt
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
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.pspdfkit.annotations.Annotation

class FabricOnAnnotationTappedEvent(surfaceId: Int, viewId: Int, @NonNull private val annotation: Annotation) : Event<FabricOnAnnotationTappedEvent>(surfaceId, viewId) {

    companion object {
        const val EVENT_NAME = "onAnnotationTapped"
    }

    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun getEventData(): WritableMap {
        val event = Arguments.createMap()
        val annotationData = Arguments.createMap()
        
        // Add annotation properties to match Paper architecture
        annotationData.putString("uuid", annotation.uuid)
        annotationData.putString("name", annotation.name)
        annotationData.putString("type", annotation.type.toString())
        annotationData.putInt("pageIndex", annotation.pageIndex)
        
        event.putMap("annotation", annotationData)
        return event
    }
}
