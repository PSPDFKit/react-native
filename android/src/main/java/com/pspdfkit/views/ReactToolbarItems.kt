/*
 * ReactToolbarItems.kt
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

import android.content.Context
import androidx.appcompat.content.res.AppCompatResources
import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.asImageBitmap
import androidx.core.graphics.drawable.toBitmap
import com.pspdfkit.compose.toolbar.state.ToolbarIcon
import com.pspdfkit.compose.toolbar.state.ToolbarItem
import com.pspdfkit.react.helper.PSPDFKitUtils
import com.pspdfkit.ui.PdfActivity

/**
 * Builds the main toolbar's item list from the `toolbarMenuItems` prop.
 *
 * The Compose toolbars replaced the `onGenerateMenuItemIds` + `onCreateOptionsMenu` pair with a
 * single declarative [com.pspdfkit.listeners.ToolbarItemsProvider]: instead of computing a list of
 * ids and then reaching into the built `Menu` on a posted runnable to set each item's title, icon,
 * tint and `showAsAction`, the provider returns fully described items and the SDK renders them.
 * That removes the two-phase dance, and with it the window where the posted runnable could find
 * an item missing.
 *
 * Shared by [ReactPdfUiFragment] and [ReactInstantPdfUiFragment], which described the same item
 * shape twice.
 */
internal object ReactToolbarItems {

    /** Prefix for custom items' action ids, so they cannot collide with the SDK's own. */
    private const val CUSTOM_ACTION_PREFIX = "com.pspdfkit.react.custom."

    /** The stock items the `toolbarMenuItems` prop can switch off, and the ids they map to. */
    private val STOCK_ITEM_IDS: Map<String, Int> = mapOf(
        "searchButtonItem" to PdfActivity.MENU_OPTION_SEARCH,
        "readerViewButtonItem" to PdfActivity.MENU_OPTION_READER_VIEW,
        "annotationButtonItem" to PdfActivity.MENU_OPTION_EDIT_ANNOTATIONS,
        "thumbnailsButtonItem" to PdfActivity.MENU_OPTION_THUMBNAIL_GRID,
        "shareButtonItem" to PdfActivity.MENU_OPTION_SHARE,
        "settingsButtonItem" to PdfActivity.MENU_OPTION_SETTINGS,
        "outlineButtonItem" to PdfActivity.MENU_OPTION_OUTLINE,
        "documentInfoViewButtonItem" to PdfActivity.MENU_OPTION_DOCUMENT_INFO,
        "aiAssistantButtonItem" to PdfActivity.MENU_OPTION_AI_ASSISTANT,
    )

    /**
     * Returns the items to show: [defaultItems] minus the stock items the integrator switched
     * off, with the custom items inserted at their requested indices.
     *
     * An empty [stockToolbarItems] *and* [customToolbarItems] means "no customization", which
     * leaves [defaultItems] untouched — the same short-circuit the old `onGenerateMenuItemIds`
     * had, and what keeps a view that never set the prop on the SDK's defaults.
     */
    @JvmStatic
    fun buildItems(
        context: Context,
        defaultItems: List<ToolbarItem>,
        stockToolbarItems: List<String>,
        customToolbarItems: List<*>,
        iconCache: IconCache,
    ): List<ToolbarItem> {
        if (stockToolbarItems.isEmpty() && customToolbarItems.isEmpty()) return defaultItems

        val keptIds = stockToolbarItems.mapNotNull { STOCK_ITEM_IDS[it] }.toSet()
        val removableIds = STOCK_ITEM_IDS.values.toSet()
        val items = defaultItems.filterTo(mutableListOf()) { it.id !in removableIds || it.id in keptIds }

        for (item in customToolbarItems.filterIsInstance<Map<*, *>>()) {
            val customItem = toToolbarItem(context, item, iconCache) ?: continue
            val index = (item["index"] as? Number)?.toInt() ?: items.size
            items.add(index.coerceIn(0, items.size), customItem)
        }
        return items
    }

    /**
     * Dispatches a tap on a custom item, returning `false` for every id the prop did not add.
     * Returning `true` for an id we do not own would swallow the SDK's own buttons.
     */
    @JvmStatic
    fun onItemClick(
        context: Context,
        itemId: Int,
        customToolbarItems: List<*>,
        listener: MenuItemListener?,
    ): Boolean {
        if (listener == null) return false
        val owned = customToolbarItems.filterIsInstance<Map<*, *>>()
            .any { resourceIdOf(context, it) == itemId }
        if (!owned) return false
        return listener.dispatchItemTapped(itemId)
    }

    private fun toToolbarItem(context: Context, item: Map<*, *>, iconCache: IconCache): ToolbarItem? {
        val resId = resourceIdOf(context, item) ?: return null
        val customId = item["id"]?.toString() ?: return null
        val title = item["title"]?.toString().orEmpty()
        val showAsAction = item["showAsAction"] as? Boolean ?: true
        val applyTemplate = item["applyTemplate"] as? Boolean ?: true
        val iconId = item["image"]?.toString()
            ?.let { PSPDFKitUtils.getCustomResourceId(it, "drawable", context) }
            ?.takeIf { it != 0 }

        return ToolbarItem.Button(
            actionId = CUSTOM_ACTION_PREFIX + customId,
            id = resId,
            contentDescription = title,
            icon = iconId?.let { iconCache.get(context, it, applyTemplate) } ?: ToolbarIcon.None,
            // `showAsAction` was mapped onto SHOW_AS_ACTION_ALWAYS / _NEVER, whose Compose
            // counterparts are AlwaysShow and Never.
            overflowBehavior = if (showAsAction) {
                ToolbarItem.OverflowBehavior.AlwaysShow
            } else {
                ToolbarItem.OverflowBehavior.Never
            },
        )
    }

    /** The largest icon the AppCompat toolbar drew; larger drawables were scaled down to it. */
    private const val MAX_ICON_SIZE_DP = 32f

    /** The size of a drawable that has no intrinsic size, such as a `<shape>` without one. */
    private const val DEFAULT_ICON_SIZE_DP = 24f

    /**
     * A missing drawable leaves the item icon-less, matching the old code, which caught the
     * failure to tint a null icon and left the item without one.
     *
     * The drawable is loaded and rasterized here rather than through `painterResource`, for the
     * two things `MenuItem.setIcon` did that the Compose renderer doesn't:
     * - It accepted any drawable. `painterResource` only takes `<vector>` and bitmap resources,
     *   and throws during composition for `<selector>`, `<shape>` or `<layer-list>` XML.
     * - The AppCompat toolbar scaled icons larger than 32dp down to fit. The Compose toolbar draws
     *   a resource icon at its intrinsic size, so a large asset would spill out of the bar.
     *
     * `applyTemplate` tints the drawable with [MainToolbarSupport.actionBarIconsColor], as the old
     * code did, rather than with the state tint the renderer passes in. Otherwise the drawable keeps
     * its own colors.
     */
    private fun toolbarIcon(context: Context, iconId: Int, applyTemplate: Boolean): ToolbarIcon {
        val drawable = AppCompatResources.getDrawable(context, iconId) ?: return ToolbarIcon.None
        val density = context.resources.displayMetrics.density
        val defaultSize = (DEFAULT_ICON_SIZE_DP * density).toInt()
        val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: defaultSize
        val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: defaultSize
        val scale = minOf(1f, MAX_ICON_SIZE_DP * density / maxOf(width, height))
        val iconsColor = if (applyTemplate) MainToolbarSupport.actionBarIconsColor(context) else null
        val bitmap = drawable
            .toBitmap(
                (width * scale).toInt().coerceAtLeast(1),
                (height * scale).toInt().coerceAtLeast(1),
            )
            .asImageBitmap()
        return ToolbarIcon.Composed {
            Image(
                bitmap = bitmap,
                contentDescription = null,
                colorFilter = iconsColor?.let { ColorFilter.tint(it) },
            )
        }
    }

    private fun resourceIdOf(context: Context, item: Map<*, *>): Int? {
        val customId = item["id"]?.toString() ?: return null
        return PSPDFKitUtils.getCustomResourceId(customId, "id", context).takeIf { it != 0 }
    }

    /**
     * The custom items' icons, kept so that the provider, which the SDK re-runs on every toolbar
     * rebuild, doesn't load, rasterize and tint each drawable again. One per fragment, since the
     * tint comes from the fragment's theme; emptied when the density or night mode changes, which
     * change the drawable and the tint.
     */
    class IconCache {
        private val icons = HashMap<Pair<Int, Boolean>, ToolbarIcon>()
        private var density = 0
        private var uiMode = 0

        internal fun get(context: Context, iconId: Int, applyTemplate: Boolean): ToolbarIcon {
            val configuration = context.resources.configuration
            if (configuration.densityDpi != density || configuration.uiMode != uiMode) {
                icons.clear()
                density = configuration.densityDpi
                uiMode = configuration.uiMode
            }
            return icons.getOrPut(iconId to applyTemplate) { toolbarIcon(context, iconId, applyTemplate) }
        }
    }
}
