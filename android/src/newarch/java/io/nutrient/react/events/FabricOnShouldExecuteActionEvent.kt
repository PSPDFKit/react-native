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
import com.pspdfkit.annotations.actions.Action

/**
 * Fabric direct event for shouldExecuteAction, allowing JS to decide
 * whether a pending PDF action should be executed.
 */
class FabricOnShouldExecuteActionEvent(
    surfaceId: Int,
    viewId: Int,
    private val requestId: String,
    private val pageIndex: Int,
    private val action: Action,
    private val url: String?
) : Event<FabricOnShouldExecuteActionEvent>(surfaceId, viewId) {

    companion object {
        // Match Codegen's top-level name for BubblingEventHandler
        const val EVENT_NAME = "topShouldExecuteAction"
    }

    override fun getEventName(): String = EVENT_NAME

    override fun getEventData(): WritableMap {
        val map = Arguments.createMap()
        map.putString("requestId", requestId)
        map.putInt("pageIndex", pageIndex)
        // Provide a simple action type string
        map.putString("actionType", action.javaClass.simpleName)
        if (url != null) {
            map.putString("url", url)
        }
        return map
    }
}

