/*
 * FabricOnDocumentSaveFailedEvent.kt
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

class FabricOnDocumentSaveFailedEvent(surfaceId: Int, viewId: Int, private val error: String) : Event<FabricOnDocumentSaveFailedEvent>(surfaceId, viewId) {

    override fun getEventName(): String {
        return "onDocumentSaveFailed"
    }

    override fun getEventData(): WritableMap {
        val eventData: WritableMap = Arguments.createMap()
        eventData.putString("error", error)
        return eventData
    }
}
