package com.pspdfkit.react.menu

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.pspdfkit.listeners.OnPreparePopupToolbarListener
import com.pspdfkit.react.R as ReactR
import com.pspdfkit.react.helper.PSPDFKitUtils
import com.pspdfkit.ui.PopupToolbar
import com.pspdfkit.ui.toolbar.popup.AnnotationPopupToolbar
import com.pspdfkit.ui.toolbar.popup.PopupToolbarMenuItem
import com.pspdfkit.views.PdfView

/**
 * Applies [PdfView] React Native `annotationContextualMenu` props using
 * [OnPreparePopupToolbarListener.onPrepareAnnotationPopupToolbar], matching the previous
 * annotation selection toolbar behavior: optional stock filtering and custom items with JS-provided titles.
 *
 * Nutrient 11.3 replaces the removed AnnotationEditingToolbar with an annotation popup toolbar.
 */
object NutrientAnnotationPopupMenuBridge {

    data class Config(
        val retainSuggestedMenuItems: Boolean,
        val stockActionKeys: List<String>,
        val position: String,
        val customItemIds: Set<Int>,
        val customPopupItems: List<PopupToolbarMenuItem>,
        /** Map menu item id → literal title to apply after popup [PopupToolbar.menuItems] is set. */
        val literalTitlesByItemId: Map<Int, String>,
    )

    @JvmStatic
    fun parseConfig(context: Context, map: ReadableMap): Config? {
        val buttons = map.getArray("buttons") ?: return null
        if (buttons.size() == 0) return null

        val retainSuggested =
            if (map.hasKey("retainSuggestedMenuItems")) map.getBoolean("retainSuggestedMenuItems") else true
        val position = if (map.hasKey("position")) map.getString("position") ?: "end" else "end"

        val stockKeys = mutableListOf<String>()
        val customItems = mutableListOf<PopupToolbarMenuItem>()
        val literalTitles = mutableMapOf<Int, String>()
        val customIds = mutableSetOf<Int>()
        val pkg = context.packageName

        for (i in 0 until buttons.size()) {
            when (buttons.getType(i)) {
                ReadableType.String -> stockKeys.add(buttons.getString(i)!!)
                ReadableType.Map -> {
                    val item = buttons.getMap(i)!!
                    val customId = item.getString("id")!!
                    val image = if (item.hasKey("image")) item.getString("image") else null
                    val titleResName = if (item.hasKey("titleRes")) item.getString("titleRes") else null
                    val resId = PSPDFKitUtils.getCustomResourceId(customId, "id", context)
                    customIds.add(resId)

                    val titleStringRes =
                        if (titleResName.isNullOrEmpty()) 0 else resolveTitleStringRes(context, pkg, titleResName)
                    val useLiteralTitle = titleStringRes == 0
                    val titleRes =
                        if (useLiteralTitle) ReactR.string.nutrient_rn_empty_menu_title else titleStringRes

                    val iconRes =
                        if (image.isNullOrEmpty()) 0 else PSPDFKitUtils.getCustomResourceId(image, "drawable", context)
                    val popupItem =
                        if (iconRes != 0) PopupToolbarMenuItem(resId, titleRes, iconRes, true)
                        else PopupToolbarMenuItem(resId, titleRes)
                    customItems.add(popupItem)
                }
                else -> {}
            }
        }

        return Config(
            retainSuggestedMenuItems = retainSuggested,
            stockActionKeys = stockKeys,
            position = position,
            customItemIds = customIds,
            customPopupItems = customItems,
            literalTitlesByItemId = literalTitles,
        )
    }

    @JvmStatic
    fun applyAnnotationPopupConfig(
        toolbar: AnnotationPopupToolbar,
        cfg: Config,
        pdfView: PdfView,
    ) {
        val context = pdfView.context
        val current: List<PopupToolbarMenuItem> = toolbar.menuItems

        val baseItems = ArrayList<PopupToolbarMenuItem>()
        val hasStockKeys = cfg.stockActionKeys.isNotEmpty()

        if (cfg.retainSuggestedMenuItems) {
            baseItems.addAll(current)
        } else if (hasStockKeys) {
            // Popup toolbar ids are not guaranteed stable across SDK versions. Filter the SDK-provided
            // suggested items by resource entry name instead of relying on fixed ids.
            for (item in current) {
                val entryName = runCatching { context.resources.getResourceEntryName(item.id) }.getOrNull()
                if (entryName != null && cfg.stockActionKeys.any { stockKeyMatchesEntryName(it, entryName) }) {
                    baseItems.add(item)
                }
            }
        }

        val customs = cfg.customPopupItems
        val merged =
            if (cfg.position == "start") {
                ArrayList<PopupToolbarMenuItem>(customs.size + baseItems.size).apply {
                    addAll(customs)
                    for (item in baseItems) {
                        if (none { it.id == item.id }) add(item)
                    }
                }
            } else {
                ArrayList<PopupToolbarMenuItem>(baseItems.size + customs.size).apply {
                    addAll(baseItems)
                    for (item in customs) {
                        if (none { it.id == item.id }) add(item)
                    }
                }
            }

        toolbar.menuItems = merged
        NutrientTextSelectionPopupMenuBridge.patchLiteralButtonTitles(toolbar, cfg.literalTitlesByItemId)

        toolbar.setOnPopupToolbarItemClickedListener(
            PopupToolbar.OnPopupToolbarItemClickedListener { item: PopupToolbarMenuItem ->
                if (cfg.customItemIds.contains(item.id)) {
                    val name = context.resources.getResourceEntryName(item.id)
                    pdfView.dispatchCustomAnnotationContextualMenuItemTapped(name)
                    true
                } else {
                    false
                }
            },
        )
    }

    private fun resolveTitleStringRes(context: Context, packageName: String, titleFromJs: String): Int {
        var id = context.resources.getIdentifier(titleFromJs, "string", packageName)
        if (id != 0) return id
        id = context.resources.getIdentifier("${titleFromJs}_label", "string", packageName)
        if (id != 0) return id
        return 0
    }

    private fun stockKeyMatchesEntryName(key: String, entryName: String): Boolean {
        val k = key.lowercase()
        val e = entryName.lowercase()
        return when (k) {
            "copy" -> e.contains("copy")
            "delete" -> e.contains("delete")
            "color", "inspector", "style" -> e.contains("inspector") || e.contains("color") || e.contains("style")
            "note", "comment" -> e.contains("note") || e.contains("comment")
            "edit" -> e.contains("edit")
            "share" -> e.contains("share")
            "play" -> e.contains("play")
            "record" -> e.contains("record")
            "group" -> e.contains("group") && !e.contains("ungroup")
            "ungroup" -> e.contains("ungroup")
            else -> false
        }
    }
}
