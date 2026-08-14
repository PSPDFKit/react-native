/*
 * Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package io.nutrient.react.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

/**
 * Fabric direct event for shouldShowSignaturePad, allowing JS to decide
 * whether the signature UI should be presented for a tapped signature field.
 */
class FabricOnShouldShowSignaturePadEvent(
    surfaceId: Int,
    viewId: Int,
    private val requestId: String,
    private val fullyQualifiedName: String?,
    private val pageIndex: Int
) : Event<FabricOnShouldShowSignaturePadEvent>(surfaceId, viewId) {

    companion object {
        // Match Codegen's top-level name for BubblingEventHandler
        const val EVENT_NAME = "topShouldShowSignaturePad"
    }

    override fun getEventName(): String = EVENT_NAME

    override fun getEventData(): WritableMap {
        val map = Arguments.createMap()
        map.putString("requestId", requestId)
        map.putInt("pageIndex", pageIndex)
        if (fullyQualifiedName != null) {
            map.putString("fullyQualifiedName", fullyQualifiedName)
        }
        return map
    }
}
