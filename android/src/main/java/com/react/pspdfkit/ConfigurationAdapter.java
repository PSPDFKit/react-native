/*
 *   ConfigurationAdapter.java
 *   PSPDFKit
 *
 *   Copyright (c) 2014-2016 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.react.pspdfkit;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.pspdfkit.configuration.activity.HUDViewMode;
import com.pspdfkit.configuration.activity.PSPDFActivityConfiguration;
import com.pspdfkit.configuration.annotations.AnnotationEditingConfiguration;
import com.pspdfkit.configuration.page.PageFitMode;
import com.pspdfkit.configuration.page.PageScrollDirection;
import com.pspdfkit.configuration.page.PageScrollMode;

public class ConfigurationAdapter {
    private static final String PAGE_SCROLL_DIRECTION = "pageScrollDirection";
    private static final String PAGE_SCROLL_DIRECTION_HORIZONTAL = "horizontal";
    private static final String PAGE_SCROLL_DIRECTION_VERTICAL = "vertical";
    private static final String PAGE_SCROLL_CONTINUOUS = "scrollContinuously";
    private static final String FIT_PAGE_TO_WIDTH = "fitPageToWidth";
    private static final String IMMERSIVE_MODE = "immersiveMode";
    private static final String SYSTEM_HUD_MODE = "hudViewMode";
    private static final String HUD_VIEW_MODE_AUTOMATIC = "automatic";
    private static final String HUD_VIEW_MODE_AUTOMATIC_BORDER_PAGES = "automaticBorderPages";
    private static final String HUD_VIEW_MODE_ALWAYS_VISIBLE = "alwaysVisible";
    private static final String HUD_VIEW_MODE_ALWAYS_HIDDEN = "alwaysHidden";
    private static final String SHOW_SEARCH_ACTION = "showSearchAction";
    private static final String INLINE_SEARCH = "inlineSearch";
    private static final String SHOW_THUMBNAIL_BAR = "showThumbnailBar";
    private static final String SHOW_THUMBNAIL_GRID_ACTION = "showThumbnailGridAction";
    private static final String SHOW_OUTLINE_ACTION = "showOutlineAction";
    private static final String SHOW_ANNOTATION_LIST_ACTION = "showAnnotationListAction";
    private static final String SHOW_PAGE_NUMBER_OVERLAY = "showPageNumberOverlay";
    private static final String SHOW_PAGE_LABELS = "showPageLabels";
    private static final String INVERT_COLORS = "invertColors";
    private static final String GRAY_SCALE = "grayScale";
    private static final String START_PAGE = "startPage";
    private static final String ENABLE_ANNOTATION_EDITING = "enableAnnotationEditing";
    private static final String ENABLE_TEXT_SELECTION = "enableTextSelection";
    private static final String SHOW_SHARE_ACTION = "showShareAction";
    private static final String SHOW_PRINT_ACTION = "showPrintAction";

    private final PSPDFActivityConfiguration.Builder configuration;
    private final Activity activity;


    public ConfigurationAdapter(@NonNull Activity activity, @NonNull String licenseKey, ReadableMap configuration) {

        this.activity = activity;
        ReadableMapKeySetIterator iterator = configuration.keySetIterator();
        boolean emptyConfiguration = iterator.hasNextKey() ? false : true;
        if (emptyConfiguration) {
            this.configuration = getDefaultConfiguration(activity, licenseKey);
        } else {
            this.configuration = new PSPDFActivityConfiguration.Builder(activity, licenseKey);

            if (configuration.hasKey(PAGE_SCROLL_DIRECTION)) {
                configurePageScrollDirection(configuration.getString(PAGE_SCROLL_DIRECTION));
            }
            if (configuration.hasKey(PAGE_SCROLL_CONTINUOUS)) {
                configurePageScrollContinuous(configuration.getBoolean(PAGE_SCROLL_CONTINUOUS));
            }
            if (configuration.hasKey(FIT_PAGE_TO_WIDTH)) {
                configureFitPageToWidth(configuration.getBoolean(FIT_PAGE_TO_WIDTH));
            }
            if (configuration.hasKey(INLINE_SEARCH)) {
                configureInlineSearch(configuration.getBoolean(INLINE_SEARCH));
            }
            if (configuration.hasKey(SYSTEM_HUD_MODE)) {
                configureSystemHudMode(configuration.getString(SYSTEM_HUD_MODE));
            }
            if (configuration.hasKey(START_PAGE)) {
                configureStartPage(configuration.getInt(START_PAGE));
            }
            if (configuration.hasKey(SHOW_SEARCH_ACTION)) {
                configureShowSearchAction(configuration.getBoolean(SHOW_SEARCH_ACTION));
            }
            if (configuration.hasKey(IMMERSIVE_MODE)) {
                configureImmersiveMode(configuration.getBoolean(IMMERSIVE_MODE));
            }
            if (configuration.hasKey(SHOW_THUMBNAIL_BAR)) {
                configureShowThumbnailBar(configuration.getBoolean(SHOW_THUMBNAIL_BAR));
            }
            if (configuration.hasKey(SHOW_THUMBNAIL_GRID_ACTION)) {
                configureShowThumbnailGridAction(configuration.getBoolean(SHOW_THUMBNAIL_GRID_ACTION));
            }
            if (configuration.hasKey(SHOW_OUTLINE_ACTION)) {
                configureShowOutlineAction(configuration.getBoolean(SHOW_OUTLINE_ACTION));
            }
            if (configuration.hasKey(SHOW_ANNOTATION_LIST_ACTION)) {
                configureShowAnnotationListAction(configuration.getBoolean(SHOW_ANNOTATION_LIST_ACTION));
            }
            if (configuration.hasKey(SHOW_PAGE_NUMBER_OVERLAY)) {
                configureShowPageNumberOverlay(configuration.getBoolean(SHOW_PAGE_NUMBER_OVERLAY));
            }
            if (configuration.hasKey(SHOW_PAGE_LABELS)) {
                configureShowPageLabels(configuration.getBoolean(SHOW_PAGE_LABELS));
            }
            if (configuration.hasKey(GRAY_SCALE)) {
                configureGrayScale(configuration.getBoolean(GRAY_SCALE));
            }
            if (configuration.hasKey(INVERT_COLORS)) {
                configureInvertColors(configuration.getBoolean(INVERT_COLORS));
            }
            if (configuration.hasKey(ENABLE_ANNOTATION_EDITING)) {
                configureEnableAnnotationEditing(configuration.getBoolean(ENABLE_ANNOTATION_EDITING));
            }
            if (configuration.hasKey(SHOW_SHARE_ACTION)) {
                configureShowShareAction(configuration.getBoolean(SHOW_SHARE_ACTION));
            }
            if (configuration.hasKey(SHOW_PRINT_ACTION)) {
                configureShowPrintAction(configuration.getBoolean(SHOW_PRINT_ACTION));
            }
            if (configuration.hasKey(ENABLE_TEXT_SELECTION)) {
                configureEnableTextSelection(configuration.getBoolean(ENABLE_TEXT_SELECTION));
            }
        }
    }

    private void configureShowPageNumberOverlay(boolean showPageNumberOverlay) {
        if (showPageNumberOverlay) {
            configuration.showPageNumberOverlay();
        } else {
            configuration.hidePageNumberOverlay();
        }
    }

    private void configurePageScrollDirection(final String pageScrollDirection) {
        if (pageScrollDirection.equals(PAGE_SCROLL_DIRECTION_HORIZONTAL)) {
            configuration.scrollDirection(PageScrollDirection.HORIZONTAL);
        } else if (pageScrollDirection.equals(PAGE_SCROLL_DIRECTION_VERTICAL)) {
            configuration.scrollDirection(PageScrollDirection.VERTICAL);
        }
    }

    private void configurePageScrollContinuous(final boolean pageScrollContinuous) {
        final PageScrollMode pageScrollMode = pageScrollContinuous ? PageScrollMode.CONTINUOUS : PageScrollMode.PER_PAGE;
        configuration.scrollMode(pageScrollMode);
    }

    private void configureFitPageToWidth(boolean fitPageToWidth) {
        final PageFitMode pageFitMode = fitPageToWidth ? PageFitMode.FIT_TO_WIDTH : PageFitMode.FIT_TO_SCREEN;
        configuration.fitMode(pageFitMode);
    }

    private void configureInlineSearch(boolean inlineSearch) {
        final int searchType = inlineSearch ? PSPDFActivityConfiguration.SEARCH_INLINE : PSPDFActivityConfiguration.SEARCH_MODULAR;
        configuration.setSearchType(searchType);
    }

    private void configureStartPage(int startPage) {
        configuration.page(startPage);
    }

    private void configureSystemHudMode(String systemHudMode) {
        HUDViewMode hudMode = HUDViewMode.HUD_VIEW_MODE_AUTOMATIC;
        if (systemHudMode.equals(HUD_VIEW_MODE_AUTOMATIC)) {
            hudMode = HUDViewMode.HUD_VIEW_MODE_AUTOMATIC;
        } else if (systemHudMode.equals(HUD_VIEW_MODE_AUTOMATIC_BORDER_PAGES)) {
            hudMode = HUDViewMode.HUD_VIEW_MODE_AUTOMATIC_BORDER_PAGES;
        } else if (systemHudMode.equals(HUD_VIEW_MODE_ALWAYS_VISIBLE)) {
            hudMode = HUDViewMode.HUD_VIEW_MODE_VISIBLE;
        } else if (systemHudMode.equals(HUD_VIEW_MODE_ALWAYS_HIDDEN)) {
            hudMode = HUDViewMode.HUD_VIEW_MODE_HIDDEN;
        }
        configuration.setHudViewMode(hudMode);
    }

    private void configureShowSearchAction(boolean showSearchAction) {
        if (showSearchAction) {
            configuration.enableSearch();
        } else {
            configuration.disableSearch();
        }
    }

    private void configureImmersiveMode(boolean immersiveMode) {
        configuration.useImmersiveMode(immersiveMode);
    }

    private void configureShowThumbnailBar(boolean showThumbnailBar) {
        if (showThumbnailBar) {
            configuration.showThumbnailBar();
        } else {
            configuration.hideThumbnailBar();
        }
    }

    private void configureShowThumbnailGridAction(boolean showThumbnailGridAction) {
        if (showThumbnailGridAction) {
            configuration.showThumbnailGrid();
        } else {
            configuration.hideThumbnailGrid();
        }
    }

    private void configureShowOutlineAction(boolean showOutlineAction) {
        if (showOutlineAction) {
            configuration.enableOutline();
        } else {
            configuration.disableOutline();
        }
    }

    private void configureShowAnnotationListAction(boolean showAnnotationListAction) {
        if (showAnnotationListAction) {
            configuration.enableAnnotationList();
        } else {
            configuration.disableAnnotationList();
        }
    }

    private void configureShowPageLabels(boolean showPageLabels) {
        if (showPageLabels) {
            configuration.showPageLabels();
        } else {
            configuration.hidePageLabels();
        }
    }

    private void configureGrayScale(boolean grayScale) {
        configuration.toGrayscale(grayScale);
    }

    private void configureInvertColors(boolean invertColors) {
        configuration.invertColors(invertColors);
    }

    private void configureEnableAnnotationEditing(boolean enableAnnotationEditing) {
        AnnotationEditingConfiguration.Builder annotationEditingConfiguration = new AnnotationEditingConfiguration.Builder(activity);
        if (enableAnnotationEditing) {
            annotationEditingConfiguration.enableAnnotationEditing();
        } else {
            annotationEditingConfiguration.disableAnnotationEditing();
        }
        configuration.annotationEditingConfiguration(annotationEditingConfiguration.build());
    }

    private void configureShowShareAction(boolean showShareAction) {
        if (showShareAction) {
            configuration.enableShare();
        } else {
            configuration.disableShare();
        }
    }

    private void configureShowPrintAction(boolean showPrintAction) {
        if (showPrintAction) {
            configuration.enablePrinting();
        } else {
            configuration.disablePrinting();
        }
    }

    private void configureEnableTextSelection(boolean enableTextSelection) {
        configuration.textSelectionEnabled(enableTextSelection);
    }

    public PSPDFActivityConfiguration build() {
        return configuration.build();
    }

    public static PSPDFActivityConfiguration.Builder getDefaultConfiguration(Context context, String license) {

        final PageScrollDirection pageScrollDirection = PageScrollDirection.HORIZONTAL;
        final PageScrollMode pageScrollMode = PageScrollMode.PER_PAGE;
        final PageFitMode pageFitMode = PageFitMode.FIT_TO_WIDTH;
        final int searchType = PSPDFActivityConfiguration.SEARCH_INLINE;
        final HUDViewMode hudViewMode = HUDViewMode.HUD_VIEW_MODE_AUTOMATIC;
        int startPage = 0;

        PSPDFActivityConfiguration.Builder configuration = new PSPDFActivityConfiguration.Builder(context, license)
                .scrollDirection(pageScrollDirection)
                .scrollMode(pageScrollMode)
                .fitMode(pageFitMode)
                .setHudViewMode(hudViewMode)
                .setSearchType(searchType)
                .page(startPage);

        AnnotationEditingConfiguration.Builder annotationEditingConfiguration = new AnnotationEditingConfiguration.Builder(context);
        configuration.annotationEditingConfiguration(annotationEditingConfiguration.build());
        return configuration;
    }
}
