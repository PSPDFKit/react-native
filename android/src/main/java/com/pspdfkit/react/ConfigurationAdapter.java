/*
 * ConfigurationAdapter.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2019 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.activity.ThumbnailBarMode;
import com.pspdfkit.configuration.activity.UserInterfaceViewMode;
import com.pspdfkit.configuration.page.PageFitMode;
import com.pspdfkit.configuration.page.PageLayoutMode;
import com.pspdfkit.configuration.page.PageScrollDirection;
import com.pspdfkit.configuration.page.PageScrollMode;
import com.pspdfkit.configuration.sharing.ShareFeatures;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

public class ConfigurationAdapter {

    private static final String LOG_TAG = "ConfigurationAdapter";

    private static final String PAGE_SCROLL_DIRECTION = "pageScrollDirection";
    private static final String PAGE_SCROLL_DIRECTION_HORIZONTAL = "horizontal";
    private static final String PAGE_SCROLL_DIRECTION_VERTICAL = "vertical";
    private static final String PAGE_SCROLL_CONTINUOUS = "scrollContinuously";
    private static final String FIT_PAGE_TO_WIDTH = "fitPageToWidth";
    private static final String IMMERSIVE_MODE = "immersiveMode";
    private static final String USER_INTERFACE_VIEW_MODE = "userInterfaceViewMode";
    private static final String USER_INTERFACE_VIEW_MODE_AUTOMATIC = "automatic";
    private static final String USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES = "automaticBorderPages";
    private static final String USER_INTERFACE_VIEW_MODE_ALWAYS_VISIBLE = "alwaysVisible";
    private static final String USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN = "alwaysHidden";
    private static final String SHOW_SEARCH_ACTION = "showSearchAction";
    private static final String INLINE_SEARCH = "inlineSearch";
    private static final String SHOW_THUMBNAIL_BAR = "showThumbnailBar";
    private static final String SHOW_THUMBNAIL_BAR_DEFAULT = "default";
    private static final String SHOW_THUMBNAIL_BAR_SCROLLABLE = "scrollable";
    private static final String SHOW_THUMBNAIL_BAR_FLOATING = "floating";
    private static final String SHOW_THUMBNAIL_BAR_PINNED = "pinned";
    private static final String SHOW_THUMBNAIL_BAR_NONE = "none";
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
    private static final String SHOW_DOCUMENT_INFO_VIEW = "showDocumentInfoView";
    private static final String SHOW_DOCUMENT_TITLE_OVERLAY = "documentLabelEnabled";
    private static final String PAGE_MODE = "pageMode";
    private static final String PAGE_MODE_SINGLE = "single";
    private static final String PAGE_MODE_DOUBLE = "double";
    private static final String PAGE_MODE_AUTO = "automatic";
    private static final String FIRST_PAGE_ALWAYS_SINGLE = "firstPageAlwaysSingle";
    private static final String AUTOSAVE_DISABLED = "disableAutomaticSaving";
    private static final String ANNOTATION_EDITING_ENABLED = "enableAnnotationEditing";
    private static final String EDITABLE_ANNOTATION_TYPES = "editableAnnotationTypes";
    private static final String SHOW_SETTINGS_MENU = "showSettingsMenu";
    private static final String TOOLBAR_TITLE = "toolbarTitle";

    private final PdfActivityConfiguration.Builder configuration;


    public ConfigurationAdapter(@NonNull Context context, ReadableMap configuration) {
        ReadableMapKeySetIterator iterator = configuration.keySetIterator();
        boolean hasConfiguration = iterator.hasNextKey();
        this.configuration = new PdfActivityConfiguration.Builder(context);
        if (hasConfiguration) {
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
            if (configuration.hasKey(USER_INTERFACE_VIEW_MODE)) {
                configureUserInterfaceViewMode(configuration.getString(USER_INTERFACE_VIEW_MODE));
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
            if (configuration.hasKey(SHOW_THUMBNAIL_BAR)) {
                configureShowThumbnailBar(configuration.getString(SHOW_THUMBNAIL_BAR));
            }
            if (configuration.hasKey(SHOW_DOCUMENT_INFO_VIEW)) {
                configureDocumentInfoView(configuration.getBoolean(SHOW_DOCUMENT_INFO_VIEW));
            }
            if (configuration.hasKey(SHOW_DOCUMENT_TITLE_OVERLAY)) {
                configureShowDocumentTitleOverlay(configuration.getBoolean(SHOW_DOCUMENT_TITLE_OVERLAY));
            }
            if (configuration.hasKey(PAGE_MODE)) {
                configurePageMode(configuration.getString(PAGE_MODE));
            }
            if (configuration.hasKey(FIRST_PAGE_ALWAYS_SINGLE)) {
                configureFirstPageAlwaysSingle(configuration.getBoolean(FIRST_PAGE_ALWAYS_SINGLE));
            }
            if (configuration.hasKey(AUTOSAVE_DISABLED)) {
                configureAutosaveEnabled(!configuration.getBoolean(AUTOSAVE_DISABLED));
            }
            if (configuration.hasKey(ANNOTATION_EDITING_ENABLED)) {
                configureAnnotationEditingEnabled(configuration.getBoolean(ANNOTATION_EDITING_ENABLED));
            }
            if (configuration.hasKey(EDITABLE_ANNOTATION_TYPES)) {
                configureEditableAnnotationTypes(configuration.getArray(EDITABLE_ANNOTATION_TYPES));
            }
            if (configuration.hasKey(SHOW_SETTINGS_MENU)) {
                configureSettingsMenuShown(configuration.getBoolean(SHOW_SETTINGS_MENU));
            }
            if (configuration.hasKey(TOOLBAR_TITLE)) {
                configureToolbarTitle(configuration.getString(TOOLBAR_TITLE));
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
        final int searchType = inlineSearch ? PdfActivityConfiguration.SEARCH_INLINE : PdfActivityConfiguration.SEARCH_MODULAR;
        configuration.setSearchType(searchType);
    }

    private void configureStartPage(int startPage) {
        configuration.page(startPage);
    }

    private void configureUserInterfaceViewMode(String userInterfaceViewMode) {
        UserInterfaceViewMode result = UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC;
        if (userInterfaceViewMode.equals(USER_INTERFACE_VIEW_MODE_AUTOMATIC)) {
            result = UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC;
        } else if (userInterfaceViewMode.equals(USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES)) {
            result = UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES;
        } else if (userInterfaceViewMode.equals(USER_INTERFACE_VIEW_MODE_ALWAYS_VISIBLE)) {
            result = UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_VISIBLE;
        } else if (userInterfaceViewMode.equals(USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN)) {
            result = UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_HIDDEN;
        }
        configuration.setUserInterfaceViewMode(result);
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

    private void configureShowThumbnailBar(String showThumbnailBar) {
        ThumbnailBarMode thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_FLOATING;
        if (showThumbnailBar.equals(SHOW_THUMBNAIL_BAR_DEFAULT)) {
            thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_FLOATING;
        } else if (showThumbnailBar.equals(SHOW_THUMBNAIL_BAR_SCROLLABLE)) {
            thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_SCROLLABLE;
        } else if (showThumbnailBar.equals(SHOW_THUMBNAIL_BAR_NONE)) {
            thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE;
        } else if (showThumbnailBar.equals(SHOW_THUMBNAIL_BAR_FLOATING)) {
            thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_FLOATING;
        } else if (showThumbnailBar.equals(SHOW_THUMBNAIL_BAR_PINNED)) {
            thumbnailBarMode = ThumbnailBarMode.THUMBNAIL_BAR_MODE_PINNED;
        }
        configuration.setThumbnailBarMode(thumbnailBarMode);
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
        if (enableAnnotationEditing) {
            configuration.enableAnnotationEditing();
        } else {
            configuration.disableAnnotationEditing();
        }
    }

    private void configureShowShareAction(boolean showShareAction) {
        if (showShareAction) {
            configuration.setEnabledShareFeatures(ShareFeatures.all());
        } else {
            configuration.setEnabledShareFeatures(ShareFeatures.none());
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

    private void configureDocumentInfoView(boolean enableDocumentInfoView) {
        if (enableDocumentInfoView) {
            configuration.enableDocumentInfoView();
        } else {
            configuration.disableDocumentInfoView();
        }
    }

    private void configureShowDocumentTitleOverlay(boolean showDocumentTitleOverlay) {
        if (showDocumentTitleOverlay) {
            configuration.showDocumentTitleOverlay();
        } else {
            configuration.hideDocumentTitleOverlay();
        }
    }

    private void configurePageMode(@Nullable final String pageMode) {
        PageLayoutMode pageLayoutMode = PageLayoutMode.AUTO;
        if (pageMode == null ||
            pageMode.equalsIgnoreCase(PAGE_MODE_AUTO)) {
            pageLayoutMode = PageLayoutMode.AUTO;
        } else if (pageMode.equalsIgnoreCase(PAGE_MODE_SINGLE)) {
            pageLayoutMode = PageLayoutMode.SINGLE;
        } else if (pageMode.equalsIgnoreCase(PAGE_MODE_DOUBLE)) {
            pageLayoutMode = PageLayoutMode.DOUBLE;
        }
        configuration.layoutMode(pageLayoutMode);
    }

    private void configureFirstPageAlwaysSingle(final boolean firstPageAlwaysSingle) {
        configuration.firstPageAlwaysSingle(firstPageAlwaysSingle);
    }

    private void configureAutosaveEnabled(final boolean autosaveEnabled) {
        configuration.autosaveEnabled(autosaveEnabled);
    }

    private void configureAnnotationEditingEnabled(final boolean annotationEditingEnabled) {
        if (annotationEditingEnabled) {
            configuration.enableAnnotationEditing();
        } else {
            configuration.disableAnnotationEditing();
        }
    }

    private void configureEditableAnnotationTypes(@Nullable final ReadableArray editableAnnotationTypes) {
        if (editableAnnotationTypes == null) {
            // If explicit null is passed we disable annotation editing.
            configuration.editableAnnotationTypes(Collections.singletonList(AnnotationType.NONE));
            return;
        }
        List<Object> annotationTypes = editableAnnotationTypes.toArrayList();
        if (annotationTypes.contains("all")) {
            // Passing in null enables all annotation types.
            configuration.editableAnnotationTypes(null);
            return;
        }

        // Finally create the actual list of enabled annotation types.
        List<AnnotationType> parsedTypes = new ArrayList<>();
        for (Object item : annotationTypes) {
            String annotationType = item.toString();
            try {
                parsedTypes.add(AnnotationType.valueOf(annotationType.toUpperCase(Locale.ENGLISH)));
            } catch (IllegalArgumentException ex) {
                Log.e(LOG_TAG,
                    String.format("Illegal option %s provided for configuration option %s. Skipping this %s.", annotationType, EDITABLE_ANNOTATION_TYPES, annotationType),
                    ex);
            }
        }

        configuration.editableAnnotationTypes(parsedTypes);
    }

    private void configureSettingsMenuShown(final boolean settingsMenuShown) {
        if (settingsMenuShown) {
            configuration.showSettingsMenu();
        } else {
            configuration.hideSettingsMenu();
        }
    }

    private void configureToolbarTitle(@Nullable final String customTitle) {
        configuration.title(customTitle);
    }

    public PdfActivityConfiguration build() {
        return configuration.build();
    }
}
