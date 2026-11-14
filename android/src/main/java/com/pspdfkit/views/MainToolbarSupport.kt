/*
 * MainToolbarSupport.kt
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
import androidx.compose.foundation.Image
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import com.pspdfkit.compose.toolbar.state.ToolbarIcon
import com.pspdfkit.jetpack.compose.toolbar.nutrientToolbarCoordinator
import com.pspdfkit.react.R
import com.pspdfkit.ui.PdfUi
import com.pspdfkit.ui.PdfUiFragment

/**
 * Main-toolbar customization for the `hideDefaultToolbar` and `showNavigationButtonInToolbar`
 * props.
 *
 * The main toolbar is a composable now, so there is no `MainToolbar` View to force to `GONE` or to
 * give a navigation icon. `ReactMainToolbar` existed only to hold the forced visibility: it
 * subclassed the removed `MainToolbar` and was swapped in through a `pspdf__toolbar_main.xml`
 * layout override, which the SDK no longer ships or inflates.
 */
internal object MainToolbarSupport {

    /**
     * The back arrow, tinted when it is drawn because [setNavigationButtonShown] can run before the
     * fragment has a context to resolve the color from.
     */
    private val navigationIcon = ToolbarIcon.Composed {
        val context = LocalContext.current
        val tint = remember(context) { actionBarIconsColor(context) }
        Image(
            painter = painterResource(R.drawable.pspdf__ic_navigation_arrow),
            contentDescription = null,
            colorFilter = ColorFilter.tint(tint),
        )
    }

    /**
     * The color the SDK tints its own main-toolbar icons with: `pspdf__iconsColor` from
     * `pspdf__actionBarIconsStyle`.
     *
     * Icons the bridge adds have to be tinted with it explicitly. The renderer's default tint comes
     * from `pspdf__mainToolbarStyle` instead, and can differ: the Catalog sets that style's text
     * color to the bar's background color, which made untinted icons invisible.
     */
    fun actionBarIconsColor(context: Context): Color {
        val a = context.theme.obtainStyledAttributes(
            null,
            com.pspdfkit.R.styleable.pspdf__ActionBarIcons,
            com.pspdfkit.R.attr.pspdf__actionBarIconsStyle,
            com.pspdfkit.R.style.PSPDFKit_ActionBarIcons,
        )
        return try {
            Color(a.getColor(com.pspdfkit.R.styleable.pspdf__ActionBarIcons_pspdf__iconsColor, android.graphics.Color.WHITE))
        } finally {
            a.recycle()
        }
    }

    /**
     * Keeps the main toolbar on [fragment] hidden while [hidden] is `true`, and hands its visibility
     * back to the SDK otherwise.
     *
     * Uses the coordinator's host veto, the Compose counterpart of `ReactMainToolbar`'s
     * `setForcedVisibility(GONE)`. The plain `setMainToolbarVisible` flag would not hold: the SDK
     * rewrites it whenever it recomputes the UI visibility, on every UI toggle and contextual
     * toolbar change. The veto isn't part of the toolbar's saved state, so the views re-apply it
     * when they attach a new fragment.
     */
    @JvmStatic
    fun setDefaultToolbarHidden(fragment: PdfUiFragment, hidden: Boolean) {
        fragment.nutrientToolbarCoordinator().setMainToolbarHostVisible(!hidden)
    }

    /**
     * Shows or removes the back arrow at the start of the main toolbar of [pdfUi], a
     * `PdfUiFragment` or a `PdfActivity`, calling [onClick] when it is tapped. A fragment holds
     * both until its UI exists, so this can be called before the fragment has a view.
     */
    @JvmStatic
    fun setNavigationButtonShown(pdfUi: PdfUi, shown: Boolean, onClick: Runnable) {
        if (shown) {
            pdfUi.setToolbarNavigationIcon(navigationIcon, null)
            pdfUi.setOnToolbarNavigationClickListener { onClick.run() }
        } else {
            pdfUi.setToolbarNavigationIcon(null, null)
            pdfUi.setOnToolbarNavigationClickListener(null)
        }
    }
}
