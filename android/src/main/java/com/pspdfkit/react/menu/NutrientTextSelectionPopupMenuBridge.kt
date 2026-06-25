package com.pspdfkit.react.menu

import android.content.Context
import android.view.ViewGroup
import android.widget.Button
import androidx.appcompat.widget.TooltipCompat
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.pspdfkit.listeners.OnPreparePopupToolbarListener
import com.pspdfkit.react.helper.PSPDFKitUtils
import com.pspdfkit.react.R as ReactR
import com.pspdfkit.ui.PopupToolbar
import com.pspdfkit.ui.toolbar.popup.PopupToolbarMenuItem
import com.pspdfkit.ui.toolbar.popup.TextSelectionPopupToolbar
import com.pspdfkit.views.PdfView

/**
 * Applies [PdfView] React Native `textSelectionContextualMenu` props using
 * [OnPreparePopupToolbarListener.onPrepareTextSelectionPopupToolbar], matching the previous
 * TextSelectionToolbar behavior: optional stock filtering and custom items with JS-provided titles.
 */
object NutrientTextSelectionPopupMenuBridge {

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
    fun createPrepareListener(pdfView: PdfView): OnPreparePopupToolbarListener {
        return object : OnPreparePopupToolbarListener {
            override fun onPrepareTextSelectionPopupToolbar(toolbar: TextSelectionPopupToolbar) {
                val cfg = pdfView.textSelectionPopupMenuConfig ?: return
                applyTextSelectionPopupConfig(toolbar, cfg, pdfView)
            }
        }
    }

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

    private fun resolveTitleStringRes(context: Context, packageName: String, titleFromJs: String): Int {
        var id = context.resources.getIdentifier(titleFromJs, "string", packageName)
        if (id != 0) return id
        id = context.resources.getIdentifier("${titleFromJs}_label", "string", packageName)
        if (id != 0) return id
        return 0
    }

    @JvmStatic
    internal fun applyTextSelectionPopupConfig(
        toolbar: TextSelectionPopupToolbar,
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
            val allowed = HashSet<Int>()
            for (key in cfg.stockActionKeys) {
                stockKeyToToolbarItemId(key)?.let { allowed.add(it) }
            }
            for (item in current) {
                if (allowed.contains(item.id)) {
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
        patchLiteralButtonTitles(toolbar, cfg.literalTitlesByItemId)

        toolbar.setOnPopupToolbarItemClickedListener(
            PopupToolbar.OnPopupToolbarItemClickedListener { item: PopupToolbarMenuItem ->
                if (cfg.customItemIds.contains(item.id)) {
                    val name = context.resources.getResourceEntryName(item.id)
                    pdfView.dispatchCustomTextSelectionContextualMenuItemTapped(name)
                    true
                } else {
                    false
                }
            },
        )
    }

    /**
     * Mirrors stock keys supported by the former [com.pspdfkit.views.PdfViewModeController] path,
     * extended with ids present on the text selection popup toolbar.
     */
    private fun stockKeyToToolbarItemId(key: String): Int? {
        return when (key) {
            "copy" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_copy
            "highlight" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_highlight
            "redaction", "redact" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_redact
            "speak" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_speak
            "search" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_search
            "share" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_share
            "link" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_link
            "aia", "aiAssistant", "ai_assistant" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_aia
            "instantHighlightComment", "instant_highlight_comment" ->
                com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_instantHighlightComment
            "strikeout" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_strikeout
            "underline" -> com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_underline
            "paste", "paste_annotation", "pasteAnnotation" ->
                com.pspdfkit.R.id.pspdf__text_selection_toolbar_item_paste_annotation
            else -> null
        }
    }

    @JvmStatic
    internal fun patchLiteralButtonTitles(toolbar: PopupToolbar, literals: Map<Int, String>) {
        if (literals.isEmpty()) return
        try {
            val field = PopupToolbar::class.java.getDeclaredField("popupToolbarView")
            field.isAccessible = true
            val popupToolbarView = field.get(toolbar) as? ViewGroup ?: return
            for (i in 0 until popupToolbarView.childCount) {
                val child = popupToolbarView.getChildAt(i)
                if (child is Button) {
                    val lit = literals[child.id] ?: continue
                    child.text = lit
                    child.contentDescription = lit
                    TooltipCompat.setTooltipText(child, lit)
                }
            }
        } catch (_: Exception) {
        }
    }

}
