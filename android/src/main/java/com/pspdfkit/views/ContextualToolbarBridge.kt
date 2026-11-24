/*
 * ContextualToolbarBridge.kt
 *
 *   Nutrient
 *
 *   Copyright © 2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views

import com.pspdfkit.R
import com.pspdfkit.compose.toolbar.adapter.ToolbarCoordinator
import com.pspdfkit.compose.toolbar.adapter.ToolbarSubscription
import com.pspdfkit.compose.toolbar.state.ContextualToolbarKind
import com.pspdfkit.compose.toolbar.state.ContextualToolbarState
import com.pspdfkit.compose.toolbar.state.ToolbarItem
import com.pspdfkit.compose.toolbar.state.ToolbarPosition
import com.pspdfkit.jetpack.compose.toolbar.nutrientToolbarCoordinator
import com.pspdfkit.jetpack.compose.toolbar.setMenuItemGroupingRule
import com.pspdfkit.ui.PdfUiFragment
import com.pspdfkit.ui.toolbar.grouping.MenuItemGroupingRule

/**
 * Java-friendly wrapper around the host fragment's [ToolbarCoordinator].
 *
 * The Compose toolbar migration removed `ContextualToolbar`, `AnnotationToolbar` and
 * `ToolbarCoordinatorLayout` along with the lifecycle and movement listeners
 * [PdfViewModeController] used to implement. Everything those listeners provided now arrives
 * through a single [ToolbarCoordinator.addContextualToolbarChangeListener] callback, which
 * reports the shown bar's kind, items and docking position as one immutable state — so the
 * old `onPrepare` / `onDisplay` / `onRemove` / `onDrag` split collapses into one entry point.
 *
 * The coordinator surface is Kotlin-only (lambdas over `PersistentList`, extension functions on
 * `Fragment`), so the interaction lives here rather than in [PdfViewModeController], which stays
 * Java alongside the rest of the view layer.
 */
internal class ContextualToolbarBridge(private val listener: Listener) {

    /** Reports the parts of the contextual toolbar state React Native mirrors into JavaScript. */
    internal interface Listener {
        /** Called when the annotation creation toolbar is shown or hidden. */
        fun onAnnotationToolbarVisibilityChanged(visible: Boolean)

        /** Called with `"top"`, `"left"` or `"right"` whenever the bar's docking position changes. */
        fun onContextualToolbarPositionChanged(position: String)

        /**
         * The docking position the `toolbarPosition` prop currently asks for, or `null` for the
         * SDK default. Read when a bar is shown rather than cached, which is what the removed
         * `onPrepareContextualToolbar` hook did.
         */
        fun getPreferredToolbarPosition(): String?
    }

    private var coordinator: ToolbarCoordinator? = null
    private var subscription: ToolbarSubscription? = null

    /** The docks from the `supportedToolbarPositions` prop, or `null` for no restriction. */
    private var allowedPositions: List<ToolbarPosition>? = null

    private var groupingRule: MenuItemGroupingRule? = null
    private var showStylusButton: Boolean = true

    /** Whether the annotation bar was shown the last time the coordinator reported a change. */
    private var annotationToolbarShown: Boolean = false

    /**
     * The kind of bar the preferred position was last applied to, or `null` when no bar is shown.
     * The position is pinned once, as each bar appears; afterwards the user owns it by dragging,
     * exactly as with the View toolbar, where the position was only set in `onPrepare`.
     */
    private var positionAppliedTo: ContextualToolbarKind? = null

    /**
     * The stylus toggle [applyStylusButtonVisibility] took off the shown annotation bar, at the
     * index it had, so that showing the button again can put it back. The SDK only builds the
     * item when the bar appears.
     */
    private var removedStylusItem: IndexedValue<ToolbarItem>? = null

    /**
     * Binds to [fragment]'s coordinator. Safe to call again for a new fragment — the previous
     * subscription is released first, which matters because the SDK recreates the fragment on
     * every configuration change and `PdfView` re-attaches its listeners each time.
     */
    fun attach(fragment: PdfUiFragment) {
        // Keeps `annotationToolbarShown`: the new subscription's first notification compares the
        // bar it finds with it, and reports the annotation bar as hidden if it didn't survive.
        release()
        val toolbarCoordinator = fragment.nutrientToolbarCoordinator()
        coordinator = toolbarCoordinator
        applyGroupingRule(fragment)
        // Before subscribing, so the first notification already carries the restricted state.
        toolbarCoordinator.setContextualToolbarAllowedPositions(allowedPositions)
        // Invoked synchronously with the current state on registration, so a bar that is already
        // shown (across a configuration change) is picked up without a separate initial read.
        subscription = toolbarCoordinator.addContextualToolbarChangeListener(::onContextualToolbarChanged)
    }

    /**
     * Releases the coordinator subscription, and reports the annotation bar as hidden if it was
     * shown, since no later notification will. Idempotent.
     */
    fun detach() {
        release()
        if (annotationToolbarShown) {
            annotationToolbarShown = false
            listener.onAnnotationToolbarVisibilityChanged(false)
        }
    }

    private fun release() {
        subscription?.close()
        subscription = null
        coordinator = null
        positionAppliedTo = null
        removedStylusItem = null
    }

    /**
     * Restricts the docks every contextual toolbar can be dragged to, replacing the View
     * `ToolbarCoordinatorLayout.LayoutParams` allowed positions the removed `onPrepare` hook set.
     * A bar outside the restriction moves to the first allowed dock, in top, left, right order,
     * which is also where it opens when no `toolbarPosition` is set. Unknown values are skipped,
     * and `null` or an empty list lifts the restriction.
     */
    fun setSupportedToolbarPositions(positions: List<String>?) {
        allowedPositions = positions
            ?.mapNotNull { position ->
                when (position) {
                    "top" -> ToolbarPosition.Top
                    "left" -> ToolbarPosition.Start
                    "right" -> ToolbarPosition.End
                    else -> null
                }
            }
            ?.distinct()
            ?.takeIf { it.isNotEmpty() }
        coordinator?.setContextualToolbarAllowedPositions(allowedPositions)
    }

    /**
     * Sets the grouping rule for the annotation creation toolbar. Bridged through the
     * coordinator's deprecated [setMenuItemGroupingRule] adapter, which keeps
     * [com.pspdfkit.react.menu.ReactGroupingRule]'s logic intact — it is a
     * `PresetMenuItemGroupingRule`, the shape the adapter supports in full.
     */
    fun setMenuItemGroupingRule(fragment: PdfUiFragment?, rule: MenuItemGroupingRule?) {
        groupingRule = rule
        if (fragment != null) applyGroupingRule(fragment)
    }

    /**
     * Shows or hides the stylus toggle on the annotation creation toolbar, replacing the View
     * `AnnotationToolbar.setShouldShowStylusButton`.
     */
    fun setShowStylusButton(show: Boolean) {
        showStylusButton = show
        coordinator?.let { applyStylusButtonVisibility(it.contextualToolbar.value) }
    }

    fun getShowStylusButton(): Boolean = showStylusButton

    private fun applyGroupingRule(fragment: PdfUiFragment) {
        val coordinator = coordinator ?: return
        coordinator.setMenuItemGroupingRule(
            fragment.requireContext(),
            ContextualToolbarKind.Annotation,
            groupingRule,
        )
    }

    private fun onContextualToolbarChanged(state: ContextualToolbarState?) {
        val isAnnotationToolbar = state?.kind == ContextualToolbarKind.Annotation

        // `toolbarPosition` applies to every contextual bar, as `onPrepareContextualToolbar` did.
        if (state != null && positionAppliedTo != state.kind) {
            positionAppliedTo = state.kind
            // A position outside the bar's allowed docks would be turned back into the current
            // state without a notification, so only ask for one the bar can take.
            val preferred = listener.getPreferredToolbarPosition()?.let { toToolbarPosition(it) }
                ?.takeIf { it in state.allowedPositions }
            val coordinator = coordinator
            if (preferred != null && state.position != preferred && coordinator != null) {
                coordinator.setContextualToolbarPosition(preferred)
                // The write re-enters this listener with the corrected state, which carries
                // the notifications below. Reporting the stale position first would surface
                // a position to JavaScript that is already superseded. If the write changed
                // nothing, nothing re-enters, so carry on and report this state.
                if (coordinator.contextualToolbar.value != state) return
            }
        } else if (state == null) {
            positionAppliedTo = null
        }
        if (!isAnnotationToolbar) removedStylusItem = null

        if (isAnnotationToolbar) {
            applyStylusButtonVisibility(state)
            // Only the annotation bar's position is reported, as before. It becomes the preferred
            // position, so reporting a bar that only docks on top, such as the content editing
            // bar, would move the next annotation bar to the top as well.
            listener.onContextualToolbarPositionChanged(toPositionString(state.position))
        }

        if (isAnnotationToolbar != annotationToolbarShown) {
            annotationToolbarShown = isAnnotationToolbar
            listener.onAnnotationToolbarVisibilityChanged(isAnnotationToolbar)
        }
    }

    /**
     * Drops the stylus toggle from the shown annotation bar, or puts back the one it dropped. The
     * SDK inserts it after grouping, so no grouping rule can exclude it; removing it from the
     * shown bar's items is the equivalent of the View `setShouldShowStylusButton(false)`.
     *
     * Changing the items notifies this listener again; the guards below make that pass a no-op
     * rather than a loop.
     */
    private fun applyStylusButtonVisibility(state: ContextualToolbarState?) {
        if (state?.kind != ContextualToolbarKind.Annotation) return
        val coordinator = coordinator ?: return
        if (showStylusButton) {
            val removed = removedStylusItem ?: return
            removedStylusItem = null
            if (state.items.any { it.id == R.id.pspdf__annotation_toolbar_item_stylus }) return
            coordinator.updateContextualItems { items ->
                items.add(removed.index.coerceAtMost(items.size), removed.value)
            }
            return
        }
        val index = state.items.indexOfFirst { it.id == R.id.pspdf__annotation_toolbar_item_stylus }
        if (index < 0) return
        removedStylusItem = IndexedValue(index, state.items[index])
        coordinator.updateContextualItems { items ->
            items.removeAll { it.id == R.id.pspdf__annotation_toolbar_item_stylus }
        }
    }

    private companion object {
        /**
         * React Native's toolbar positions are `"top"`, `"left"` and `"right"`. The Compose
         * toolbar is RTL-safe and uses Start/End instead, which resolve to left/right in LTR.
         */
        fun toToolbarPosition(position: String): ToolbarPosition = when (position) {
            "left" -> ToolbarPosition.Start
            "right" -> ToolbarPosition.End
            else -> ToolbarPosition.Top
        }

        fun toPositionString(position: ToolbarPosition): String = when (position) {
            ToolbarPosition.Start -> "left"
            ToolbarPosition.End -> "right"
            ToolbarPosition.Top -> "top"
        }
    }
}
