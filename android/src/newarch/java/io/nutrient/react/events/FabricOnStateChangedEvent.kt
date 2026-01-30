/*
 * FabricOnStateChangedEvent.kt
 *
 *   Nutrient
 *
 *   Copyright © 2021-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package io.nutrient.react.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class FabricOnStateChangedEvent(surfaceId: Int, viewId: Int, private val eventData: com.pspdfkit.views.PdfView.StateChangedEvent) : Event<FabricOnStateChangedEvent>(surfaceId, viewId) {

    override fun getEventName(): String {
        return "onStateChanged"
    }

    override fun getEventData(): WritableMap {
        val payload = Arguments.createMap()
        payload.putBoolean("documentLoaded", true)
        payload.putInt("currentPageIndex", eventData.currentPageIndex)
        payload.putInt("pageCount", eventData.pageCount)
        payload.putBoolean("annotationCreationActive", eventData.annotationCreationActive)
        payload.putInt("affectedPageIndex", eventData.currentPageIndex)
        payload.putBoolean("annotationEditingActive", eventData.annotationEditingActive)
        payload.putBoolean("textSelectionActive", eventData.textSelectionActive)
        payload.putBoolean("formEditingActive", eventData.formEditingActive)
        return payload
    }
}
