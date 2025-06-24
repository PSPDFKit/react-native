/*
 * ConfigurationAdapter.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2025 PSPDFKit GmbH. All rights reserved.
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
import com.pspdfkit.configuration.activity.TabBarHidingMode;
import com.pspdfkit.configuration.activity.ThumbnailBarMode;
import com.pspdfkit.configuration.activity.UserInterfaceViewMode;
import com.pspdfkit.configuration.page.PageFitMode;
import com.pspdfkit.configuration.page.PageLayoutMode;
import com.pspdfkit.configuration.page.PageScrollDirection;
import com.pspdfkit.configuration.page.PageScrollMode;
import com.pspdfkit.configuration.search.SearchType;
import com.pspdfkit.configuration.sharing.ShareFeatures;
import com.pspdfkit.configuration.signatures.SignatureSavingStrategy;
import com.pspdfkit.preferences.PSPDFKitPreferences;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

public class ConfigurationAdapter {

    private static final String LOG_TAG = "ConfigurationAdapter";

    // Document Interaction Options
    private static final String SCROLL_DIRECTION = "scrollDirection";
    private static final String PAGE_SCROLL_DIRECTION_HORIZONTAL = "horizontal";
    private static final String PAGE_SCROLL_DIRECTION_VERTICAL = "vertical";
    private static final String PAGE_TRANSITION = "pageTransition";
    private static final String PAGE_TRANSITION_PER_SPREAD = "scrollPerSpread";
    private static final String PAGE_TRANSITION_CONTINUOUS = "scrollContinuous";
    private static final String ENABLE_TEXT_SELECTION = "enableTextSelection";
    private static final String AUTOSAVE_ENABLED = "autosaveEnabled";
    private static final String AUTOSAVE_DISABLED = "disableAutomaticSaving";
    private static final String SIGNATURE_SAVING_STRATEGY = "signatureSavingStrategy";
    private static final String SIGNATURE_SAVING_STRATEGY_ALWAYS = "alwaysSave";
    private static final String SIGNATURE_SAVING_STRATEGY_NEVER = "neverSave";
    private static final String SIGNATURE_SAVING_STRATEGY_IF_SELECTED = "saveIfSelected";

    // Document Presentation Options
    private static final String SHOW_PAGE_LABELS = "showPageLabels";
    private static final String SHOW_DOCUMENT_TITLE_OVERLAY = "documentLabelEnabled";
    private static final String PAGE_MODE = "pageMode";
    private static final String PAGE_MODE_SINGLE = "single";
    private static final String PAGE_MODE_DOUBLE = "double";
    private static final String PAGE_MODE_AUTO = "automatic";
    private static final String FIRST_PAGE_ALWAYS_SINGLE = "firstPageAlwaysSingle";
    private static final String SPREAD_FITTING = "spreadFitting";
    private static final String SPREAD_FITTING_FIT = "fit";
    private static final String SPREAD_FITTING_FILL = "fill";
    private static final String INVERT_COLORS = "invertColors";
    private static final String GRAY_SCALE = "grayScale";

    // User Interface Options
    private static final String USER_INTERFACE_VIEW_MODE = "userInterfaceViewMode";
    private static final String USER_INTERFACE_VIEW_MODE_AUTOMATIC = "automatic";
    private static final String USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES = "automaticBorderPages";
    private static final String USER_INTERFACE_VIEW_MODE_AUTOMATIC_NO_FIRST_LAST_PAGE = "automaticNoFirstLastPage";
    private static final String USER_INTERFACE_VIEW_MODE_ALWAYS = "always";
    private static final String USER_INTERFACE_VIEW_MODE_ALWAYS_VISIBLE = "alwaysVisible";
    private static final String USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN = "alwaysHidden";
    private static final String USER_INTERFACE_VIEW_MODE_NEVER = "never";
    private static final String TOOLBAR_TITLE = "toolbarTitle";
    private static final String IMMERSIVE_MODE = "immersiveMode";
    private static final String SHOW_SEARCH_ACTION = "showSearchAction";
    private static final String INLINE_SEARCH = "inlineSearch";
    private static final String SHOW_OUTLINE_ACTION = "showOutlineAction";
    private static final String SHOW_BOOKMARKS_ACTION = "showBookmarksAction";
    private static final String SHOW_SHARE_ACTION = "showShareAction";
    private static final String SHOW_PRINT_ACTION = "showPrintAction";
    private static final String SHOW_DOCUMENT_INFO_VIEW = "showDocumentInfoView";
    private static final String SHOW_SETTINGS_MENU = "showSettingsMenu";
    private static final String SHOW_DEFAULT_TOOLBAR = "showDefaultToolbar";
    private static final String SHOW_ACTION_BUTTONS = "showActionButtons";

    // Thumbnail Options
    private static final String SHOW_THUMBNAIL_BAR = "showThumbnailBar";
    private static final String SHOW_THUMBNAIL_BAR_NONE = "none";
    private static final String SHOW_THUMBNAIL_BAR_DEFAULT = "default";
    private static final String SHOW_THUMBNAIL_BAR_FLOATING = "floating";
    private static final String SHOW_THUMBNAIL_BAR_SCRUBBERBAR = "scrubberBar";
    private static final String SHOW_THUMBNAIL_BAR_PINNED = "pinned";
    private static final String SHOW_THUMBNAIL_BAR_SCROLLABLE = "scrollable";
    private static final String SHOW_THUMBNAIL_GRID_ACTION = "showThumbnailGridAction";

    // Annotation, Forms and Bookmark Options
    private static final String EDITABLE_ANNOTATION_TYPES = "editableAnnotationTypes";
    private static final String ENABLE_ANNOTATION_EDITING = "enableAnnotationEditing";
    private static final String ENABLE_FORM_EDITING = "enableFormEditing";
    private static final String SHOW_ANNOTATION_LIST_ACTION = "showAnnotationListAction";
    private static final String ANNOTATION_EDITING_ENABLED = "enableAnnotationEditing";

    // Measurement tools options
    private static final String ENABLED_MEASUREMENT_TOOLS = "enableMeasurementTools";
    private static final String ENABLE_MAGNIFIER = "enableMagnifier";
    private static final String ENABLED_MEASUREMENT_TOOL_SNAPPING = "enableMeasurementToolSnapping";

    // Deprecated Options
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code SCROLL_DIRECTION} instead, which replaces it.
     */
    @Deprecated
    private static final String PAGE_SCROLL_DIRECTION = "pageScrollDirection";
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code PAGE_TRANSITION} instead, which replaces it.
     */
    @Deprecated
    private static final String PAGE_SCROLL_CONTINUOUS = "scrollContinuously";
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code SHOW_PAGE_LABELS} instead, which replaces it.
     */
    @Deprecated
    private static final String SHOW_PAGE_NUMBER_OVERLAY = "showPageNumberOverlay";
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code SHOW_PAGE_LABELS} instead, which replaces it.
     */
    @Deprecated
    private static final String PAGE_LABEL_ENABLED = "pageLabelEnabled";
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code SPREAD_FITTING} instead, which replaces it.
     */
    @Deprecated
    private static final String FIT_PAGE_TO_WIDTH = "fitPageToWidth";
    /**
     * @deprecated This key word was deprecated with PSPDFKit for React Native 2.1.
     * Use {@code pageIndex} property on {@code PSPDFKitView} instead.
     */
    @Deprecated
    private static final String START_PAGE = "startPage";

    private final PdfActivityConfiguration.Builder configuration;

    public ConfigurationAdapter(@NonNull final Context context, ReadableMap configuration) {
        ReadableMapKeySetIterator iterator = configuration.keySetIterator();
        boolean hasConfiguration = iterator.hasNextKey();
        this.configuration = new PdfActivityConfiguration.Builder(context);
        this.configuration.contentEditingEnabled(false);
        if (hasConfiguration) {
            String key;

            key = getKeyOrNull(configuration, PAGE_SCROLL_DIRECTION);
            if (key != null) {
                configurePageScrollDirection(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, SCROLL_DIRECTION);
            if (key != null) {
                configurePageScrollDirection(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, USER_INTERFACE_VIEW_MODE);
            if (key != null) {
                configureUserInterfaceViewMode(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, SHOW_THUMBNAIL_BAR);
            if (key != null) {
                configureShowThumbnailBar(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, SHOW_THUMBNAIL_GRID_ACTION);
            if (key != null) {
                configureShowThumbnailGridAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, PAGE_SCROLL_CONTINUOUS);
            if (key != null) {
                configurePageScrollContinuous(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, PAGE_TRANSITION);
            if (key != null) {
                configurePageTransition(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, SPREAD_FITTING);
            if (key != null) {
                configureSpreadFitting(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, FIT_PAGE_TO_WIDTH);
            if (key != null) {
                configureFitPageToWidth(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, INLINE_SEARCH);
            if (key != null) {
                configureInlineSearch(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, START_PAGE);
            if (key != null) {
                configureStartPage(configuration.getInt(key));
            }
            key = getKeyOrNull(configuration, SIGNATURE_SAVING_STRATEGY);
            if (key != null) {
                configureSignatureSavingStrategy(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, SHOW_SEARCH_ACTION);
            if (key != null) {
                configureShowSearchAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, IMMERSIVE_MODE);
            if (key != null) {
                configureImmersiveMode(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_OUTLINE_ACTION);
            if (key != null) {
                configureShowOutlineAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_BOOKMARKS_ACTION);
            if (key != null) {
                configureShowBookmarksAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_ANNOTATION_LIST_ACTION);
            if (key != null) {
                configureShowAnnotationListAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_PAGE_NUMBER_OVERLAY);
            if (key != null) {
                configureShowPageNumberOverlay(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_PAGE_LABELS);
            if (key != null) {
                configureShowPageLabels(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, PAGE_LABEL_ENABLED);
            if (key != null) {
                configureShowPageLabels(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, GRAY_SCALE);
            if (key != null) {
                configureGrayScale(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, INVERT_COLORS);
            if (key != null) {
                configureInvertColors(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ENABLE_ANNOTATION_EDITING);
            if (key != null) {
                configureEnableAnnotationEditing(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ENABLE_FORM_EDITING);
            if (key != null) {
                configureEnableFormEditing(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_SHARE_ACTION);
            if (key != null) {
                configureShowShareAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_PRINT_ACTION);
            if (key != null) {
                configureShowPrintAction(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ENABLE_TEXT_SELECTION);
            if (key != null) {
                configureEnableTextSelection(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_DOCUMENT_INFO_VIEW);
            if (key != null) {
                configureDocumentInfoView(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_DOCUMENT_TITLE_OVERLAY);
            if (key != null) {
                configureShowDocumentTitleOverlay(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, PAGE_MODE);
            if (key != null) {
                configurePageMode(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, FIRST_PAGE_ALWAYS_SINGLE);
            if (key != null) {
                configureFirstPageAlwaysSingle(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, AUTOSAVE_ENABLED);
            if (key != null) {
                configureAutosaveEnabled(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, AUTOSAVE_DISABLED);
            if (key != null) {
                configureAutosaveEnabled(!configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ANNOTATION_EDITING_ENABLED);
            if (key != null) {
                configureAnnotationEditingEnabled(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, EDITABLE_ANNOTATION_TYPES);
            if (key != null) {
                configureEditableAnnotationTypes(configuration.getArray(key));
            }
            key = getKeyOrNull(configuration, SHOW_SETTINGS_MENU);
            if (key != null) {
                configureSettingsMenuShown(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, TOOLBAR_TITLE);
            if (key != null) {
                configureToolbarTitle(configuration.getString(key));
            }
            key = getKeyOrNull(configuration, ENABLE_MAGNIFIER);
            if (key != null) {
                configureMagnifierEnabled(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ENABLED_MEASUREMENT_TOOLS);
            if (key != null) {
                configureMeasurementToolsEnabled(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, ENABLED_MEASUREMENT_TOOL_SNAPPING);
            if (key != null) {
                configureMeasurementToolSnappingEnabled(context, configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_DEFAULT_TOOLBAR);
            if (key != null) {
                configureShowDefaultToolbar(configuration.getBoolean(key));
            }
            key = getKeyOrNull(configuration, SHOW_ACTION_BUTTONS);
            if (key != null) {
                configureShowActionButtons(configuration.getBoolean(key));
            }
        }
    }

    public static List<String> getStringValuesForConfigurationItems(final List<AnnotationType> items) {
        List<String> foundKeys = new ArrayList<>();
        for (AnnotationType item : items) {
            foundKeys.add(item.toString());
        }
        return foundKeys;
    }

    public static String getStringValueForConfigurationItem(final Enum item) {
        String resolvedValue = "";
        if (item instanceof PageScrollDirection) {
            if (item == PageScrollDirection.HORIZONTAL) { resolvedValue = PAGE_SCROLL_DIRECTION_HORIZONTAL; }
            else if (item == PageScrollDirection.VERTICAL) { resolvedValue = PAGE_SCROLL_DIRECTION_VERTICAL; }
        }

        if (item instanceof PageScrollMode) {
            if (item == PageScrollMode.PER_PAGE) { resolvedValue = PAGE_TRANSITION_PER_SPREAD; }
            else if (item == PageScrollMode.CONTINUOUS) { resolvedValue = PAGE_TRANSITION_CONTINUOUS; }
        }

        if (item instanceof PageLayoutMode) {
            if (item == PageLayoutMode.AUTO) { resolvedValue = PAGE_MODE_AUTO; }
            else if (item == PageLayoutMode.SINGLE) { resolvedValue = PAGE_MODE_SINGLE; }
            else if (item == PageLayoutMode.DOUBLE) { resolvedValue = PAGE_MODE_DOUBLE; }
        }

        if (item instanceof SignatureSavingStrategy) {
            if (item == SignatureSavingStrategy.ALWAYS_SAVE) { resolvedValue = SIGNATURE_SAVING_STRATEGY_ALWAYS; }
            else if (item == SignatureSavingStrategy.NEVER_SAVE) { resolvedValue = SIGNATURE_SAVING_STRATEGY_NEVER; }
            else if (item == SignatureSavingStrategy.SAVE_IF_SELECTED) { resolvedValue = SIGNATURE_SAVING_STRATEGY_IF_SELECTED; }
        }

        if (item instanceof PageFitMode) {
            if (item == PageFitMode.FIT_TO_SCREEN) { resolvedValue = SPREAD_FITTING_FIT; }
            else if (item == PageFitMode.FIT_TO_WIDTH) { resolvedValue = SPREAD_FITTING_FILL; }
        }

        if (item instanceof UserInterfaceViewMode) {
            if (item == UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC) { resolvedValue = USER_INTERFACE_VIEW_MODE_AUTOMATIC; }
            else if (item == UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES) { resolvedValue = USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES; }
            else if (item == UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_VISIBLE) { resolvedValue = USER_INTERFACE_VIEW_MODE_ALWAYS_VISIBLE; }
            else if (item == UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_HIDDEN) { resolvedValue = USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN; }
            else if (item == UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_MANUAL) { resolvedValue = USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN; }
        }

        if (item instanceof ThumbnailBarMode) {
            if (item == ThumbnailBarMode.THUMBNAIL_BAR_MODE_FLOATING) { resolvedValue = SHOW_THUMBNAIL_BAR_FLOATING; }
            else if (item == ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE) { resolvedValue = SHOW_THUMBNAIL_BAR_NONE; }
            else if (item == ThumbnailBarMode.THUMBNAIL_BAR_MODE_SCROLLABLE) { resolvedValue = SHOW_THUMBNAIL_BAR_SCROLLABLE; }
            else if (item == ThumbnailBarMode.THUMBNAIL_BAR_MODE_PINNED) { resolvedValue = SHOW_THUMBNAIL_BAR_PINNED; }
        }

        return resolvedValue;
    }

    private void configureShowPageNumberOverlay(final boolean showPageNumberOverlay) {
        configuration.pageNumberOverlayEnabled(showPageNumberOverlay);
    }

    private void configurePageScrollDirection(@Nullable final String pageScrollDirection) {
        if (pageScrollDirection == null) {
            Log.e(LOG_TAG, "Illegal configuration option for page scroll direction.");
            return;
        }
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

    private void configurePageTransition(@Nullable final String pageTransition) {
        if (pageTransition == null) {
            Log.e(LOG_TAG, "Illegal configuration option for page transition.");
            return;
        }

        if (pageTransition.equals(PAGE_TRANSITION_PER_SPREAD)) {
            configuration.scrollMode(PageScrollMode.PER_PAGE);
        } else if (pageTransition.equals(PAGE_TRANSITION_CONTINUOUS)) {
            configuration.scrollMode(PageScrollMode.CONTINUOUS);
        }
    }

    private void configureSpreadFitting(@Nullable final String mode) {
        if (mode == null) {
            Log.e(LOG_TAG, "Illegal configuration option for mode.");
            return;
        }
        if (mode.equals(SPREAD_FITTING_FIT)) {
            configuration.fitMode(PageFitMode.FIT_TO_SCREEN);
        }
        else if (mode.equals(SPREAD_FITTING_FILL)) {
            configuration.fitMode(PageFitMode.FIT_TO_WIDTH);
        }
    }

    private void configureFitPageToWidth(final boolean fitPageToWidth) {
        final PageFitMode pageFitMode = fitPageToWidth ? PageFitMode.FIT_TO_WIDTH : PageFitMode.FIT_TO_SCREEN;
        configuration.fitMode(pageFitMode);
    }

    private void configureInlineSearch(final boolean inlineSearch) {
        final SearchType searchType = inlineSearch ? SearchType.INLINE : SearchType.MODULAR;
        configuration.setSearchType(searchType);
    }

    private void configureStartPage(final int startPage) {
        configuration.page(startPage);
    }

    private void configureUserInterfaceViewMode(@Nullable final String userInterfaceViewMode) {
        if (userInterfaceViewMode == null) {
            Log.e(LOG_TAG, "Illegal configuration option for user interface view mode.");
            return;
        }
        switch (userInterfaceViewMode) {
            case USER_INTERFACE_VIEW_MODE_AUTOMATIC:
                configuration.setUserInterfaceViewMode(UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC);
                break;
            case USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES:
            case USER_INTERFACE_VIEW_MODE_AUTOMATIC_NO_FIRST_LAST_PAGE:
                configuration.setUserInterfaceViewMode(UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_AUTOMATIC_BORDER_PAGES);
                break;
            case USER_INTERFACE_VIEW_MODE_ALWAYS:
            case USER_INTERFACE_VIEW_MODE_ALWAYS_VISIBLE:
                configuration.setUserInterfaceViewMode(UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_VISIBLE);
                break;
            case USER_INTERFACE_VIEW_MODE_ALWAYS_HIDDEN:
            case USER_INTERFACE_VIEW_MODE_NEVER:
                configuration.setUserInterfaceViewMode(UserInterfaceViewMode.USER_INTERFACE_VIEW_MODE_HIDDEN);
                break;
        }
    }

    private void configureShowSearchAction(final boolean showSearchAction) {
        configuration.searchEnabled(showSearchAction);
    }

    private void configureSignatureSavingStrategy(@Nullable final String signatureSavingStrategy) {
        if (signatureSavingStrategy == null) {
            Log.e(LOG_TAG, "Illegal configuration option for signature saving strategy.");
            return;
        }
        if (signatureSavingStrategy.equals(SIGNATURE_SAVING_STRATEGY_ALWAYS)) {
            configuration.signatureSavingStrategy(SignatureSavingStrategy.ALWAYS_SAVE);
        } else if (signatureSavingStrategy.equals(SIGNATURE_SAVING_STRATEGY_NEVER)) {
            configuration.signatureSavingStrategy(SignatureSavingStrategy.NEVER_SAVE);
        } else if (signatureSavingStrategy.equals(SIGNATURE_SAVING_STRATEGY_IF_SELECTED)) {
            configuration.signatureSavingStrategy(SignatureSavingStrategy.SAVE_IF_SELECTED);
        }
    }

    private void configureImmersiveMode(final boolean immersiveMode) {
        configuration.useImmersiveMode(immersiveMode);
    }

    private void configureShowThumbnailBar(@Nullable final String showThumbnailBar) {
        if (showThumbnailBar == null) {
            Log.e(LOG_TAG, "Illegal configuration option for showing thumbnail bar.");
            return;
        }

        switch (showThumbnailBar) {
            case SHOW_THUMBNAIL_BAR_NONE:
                configuration.setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_NONE);
                break;
            case SHOW_THUMBNAIL_BAR_DEFAULT:
            case SHOW_THUMBNAIL_BAR_FLOATING:
                configuration.setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_FLOATING);
                break;
            case SHOW_THUMBNAIL_BAR_SCRUBBERBAR:
            case SHOW_THUMBNAIL_BAR_PINNED:
                configuration.setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_PINNED);
                break;
            case SHOW_THUMBNAIL_BAR_SCROLLABLE:
                configuration.setThumbnailBarMode(ThumbnailBarMode.THUMBNAIL_BAR_MODE_SCROLLABLE);
                break;
        }
    }

    private void configureShowThumbnailGridAction(final boolean showThumbnailGridAction) {
        configuration.thumbnailGridEnabled(showThumbnailGridAction);
    }

    private void configureShowOutlineAction(final boolean showOutlineAction) {
        configuration.outlineEnabled(showOutlineAction);
    }

    private void configureShowBookmarksAction(final boolean showBookmarksAction) {
        configuration.bookmarkListEnabled(showBookmarksAction);
    }

    private void configureShowAnnotationListAction(final boolean showAnnotationListAction) {
        configuration.annotationListEnabled(showAnnotationListAction);
    }

    private void configureShowPageLabels(final boolean showPageLabels) {
        configuration.pageLabelsEnabled(showPageLabels);
        configuration.pageNumberOverlayEnabled(showPageLabels);
    }

    private void configureGrayScale(final boolean grayScale) {
        configuration.toGrayscale(grayScale);
    }

    private void configureInvertColors(final boolean invertColors) {
        configuration.invertColors(invertColors);
    }

    private void configureEnableAnnotationEditing(final boolean enableAnnotationEditing) {
        configuration.annotationEditingEnabled(enableAnnotationEditing);
    }

    private void configureEnableFormEditing(final boolean enableFormEditing) {
        configuration.formEditingEnabled(enableFormEditing);
    }

    private void configureShowShareAction(final boolean showShareAction) {
        if (showShareAction) {
            configuration.setEnabledShareFeatures(ShareFeatures.all());
        } else {
            configuration.setEnabledShareFeatures(ShareFeatures.none());
        }
    }

    private void configureShowPrintAction(final boolean showPrintAction) {
        configuration.printingEnabled(showPrintAction);
    }

    private void configureEnableTextSelection(final boolean enableTextSelection) {
        configuration.textSelectionEnabled(enableTextSelection);
    }

    private void configureDocumentInfoView(final boolean enableDocumentInfoView) {
        configuration.documentInfoViewEnabled(enableDocumentInfoView);
    }

    private void configureShowDocumentTitleOverlay(final boolean showDocumentTitleOverlay) {
        configuration.documentTitleOverlayEnabled(showDocumentTitleOverlay);
    }

    private void configurePageMode(@Nullable final String pageMode) {
        if (pageMode == null) {
            Log.e(LOG_TAG, "Illegal configuration option for page mode.");
            return;
        }

        if (pageMode.equalsIgnoreCase(PAGE_MODE_AUTO)) {
            configuration.layoutMode(PageLayoutMode.AUTO);
        } else if (pageMode.equalsIgnoreCase(PAGE_MODE_SINGLE)) {
            configuration.layoutMode(PageLayoutMode.SINGLE);
        } else if (pageMode.equalsIgnoreCase(PAGE_MODE_DOUBLE)) {
            configuration.layoutMode(PageLayoutMode.DOUBLE);
        }
    }

    private void configureFirstPageAlwaysSingle(final boolean firstPageAlwaysSingle) {
        configuration.firstPageAlwaysSingle(firstPageAlwaysSingle);
    }

    private void configureAutosaveEnabled(final boolean autosaveEnabled) {
        configuration.autosaveEnabled(autosaveEnabled);
    }

    private void configureAnnotationEditingEnabled(final boolean annotationEditingEnabled) {
        configuration.annotationEditingEnabled(annotationEditingEnabled);
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
        configuration.settingsMenuEnabled(settingsMenuShown);
    }

    private void configureToolbarTitle(@Nullable final String customTitle) {
        configuration.title(customTitle);
    }

    private void configureMeasurementToolsEnabled(final Boolean measurementToolsEnabled) {
        configuration.setMeasurementToolsEnabled(measurementToolsEnabled);
    }

    private void configureMagnifierEnabled(final Boolean magnifierEnabled) {
        configuration.enableMagnifier(magnifierEnabled);
    }

    private void configureMeasurementToolSnappingEnabled(Context context, final Boolean snappingEnabled) {
        PSPDFKitPreferences.get(context).setMeasurementSnappingEnabled(snappingEnabled);
    }

    private void configureShowDefaultToolbar(final boolean showDefaultToolbar) {
        if (showDefaultToolbar) {
            // Set it back to the default, which is AUTOMATIC_HIDE_SINGLE
            configuration.setTabBarHidingMode(TabBarHidingMode.AUTOMATIC_HIDE_SINGLE);
            configuration.defaultToolbarEnabled(true);
        } else {
            configuration.setTabBarHidingMode(TabBarHidingMode.HIDE);
            configuration.defaultToolbarEnabled(false);
        }
    }

    private void configureShowActionButtons(final boolean showActionButtons) {
        configuration.navigationButtonsEnabled(showActionButtons);
    }

    public PdfActivityConfiguration build() {
        return configuration.build();
    }

    /**
     * When reading configuration options, we check not only for the given configuration string,
     * but also for a string with the `android` prefix. For instance if the user enters
     * `androidPageScrollDirection`, it is considered a valid string equal to `pageScrollDirection`.
     *
     * When documenting, we always prefer configuration option strings:
     *
     * - No prefix          : If the key works for both iOS and Android.
     * - `android` prefix   : If the key works only for Android.
     * - `iOS` prefix       : If the key works only for iOS.
     */
    private String addAndroidPrefix(String key) {
        // Capitalize the first letter.
        String cap = String.valueOf(key.charAt(0)).toUpperCase() + key.substring(1);
        return "android" + cap;
    }

    @Nullable
    private String getKeyOrNull(ReadableMap configuration, String key) {
        if (configuration.hasKey(key)) {
            return key;
        }
        String prefixedKey = addAndroidPrefix(key);
        if (configuration.hasKey(prefixedKey)) {
            return prefixedKey;
        }
        return null;
    }
}
