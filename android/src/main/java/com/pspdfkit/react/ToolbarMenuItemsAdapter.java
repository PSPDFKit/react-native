/*
 * ToolbarMenuItemsAdapter.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2022 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */
 
package com.pspdfkit.react;

import com.facebook.react.bridge.ReadableArray;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.configuration.sharing.ShareFeatures;

import io.reactivex.annotations.NonNull;

/**
 * This class is used for mapping the toolbar menu items for customization.
 */
public class ToolbarMenuItemsAdapter {

    // Toolbar customization items.
    private static final String TOOLBAR_ITEM_SEARCH = "searchButtonItem";
    private static final String TOOLBAR_ITEM_READER_VIEW = "readerViewButtonItem";
    private static final String TOOLBAR_ITEM_ANNOTATIONS = "annotationButtonItem";
    private static final String TOOLBAR_ITEM_THUMBNAILS = "thumbnailsButtonItem";
    private static final String TOOLBAR_ITEM_SHARE = "shareButtonItem";
    private static final String TOOLBAR_ITEM_SETTINGS = "settingsButtonItem";
    private static final String TOOLBAR_ITEM_OUTLINE = "outlineButtonItem";
    private static final String TOOLBAR_ITEM_BOOKMARKS = "bookmarkButtonItem";
    private static final String TOOLBAR_ITEM_PRINT = "printButtonItem";
    private static final String TOOLBAR_ITEM_ANNOTATION_LIST = "annotationListButtonItem";
    private static final String TOOLBAR_ITEM_DOCUMENT_INFO_VIEW = "documentInfoViewButtonItem";

    private final PdfActivityConfiguration.Builder newConfigurations;

    /**
     * @param currentConfiguration The current configurations.
     * @param toolbarItems         The toolbar items to be customized.
     */
    public ToolbarMenuItemsAdapter(@NonNull final PdfActivityConfiguration.Builder currentConfiguration, @NonNull final ReadableArray toolbarItems) {
        PdfActivityConfiguration.Builder configuration = disableDefaultToolbarItems(currentConfiguration);

        for (int i = 0; i < toolbarItems.size(); i++) {
            String toolbarItem = toolbarItems.getString(i);
            switch (toolbarItem) {
                case TOOLBAR_ITEM_SEARCH:
                    configuration.enableSearch();
                    break;
                case TOOLBAR_ITEM_READER_VIEW:
                    configuration.enableReaderView(true);
                    break;
                case TOOLBAR_ITEM_ANNOTATIONS:
                    configuration.enableAnnotationEditing();
                    break;
                case TOOLBAR_ITEM_THUMBNAILS:
                    configuration.showThumbnailGrid();
                    break;
                case TOOLBAR_ITEM_SHARE:
                    configuration.setEnabledShareFeatures(ShareFeatures.all());
                    break;
                case TOOLBAR_ITEM_SETTINGS:
                    configuration.showSettingsMenu();
                    break;
                case TOOLBAR_ITEM_OUTLINE:
                    configuration.enableOutline();
                    break;
                case TOOLBAR_ITEM_BOOKMARKS:
                    configuration.enableBookmarkList();
                    break;
                case TOOLBAR_ITEM_PRINT:
                    configuration.enablePrinting();
                    break;
                case TOOLBAR_ITEM_ANNOTATION_LIST:
                    configuration.enableAnnotationList();
                    break;
                case TOOLBAR_ITEM_DOCUMENT_INFO_VIEW:
                    configuration.enableDocumentInfoView();
                    break;
            }
        }
        newConfigurations = configuration;
    }

    private PdfActivityConfiguration.Builder disableDefaultToolbarItems(final PdfActivityConfiguration.Builder configuration) {
        configuration.disableSearch()
                .enableReaderView(false)
                .disableAnnotationEditing()
                .hideThumbnailGrid()
                .setEnabledShareFeatures(ShareFeatures.none())
                .hideSettingsMenu()
                .hideThumbnailGrid()
                .disableOutline()
                .disableAnnotationList()
                .disablePrinting()
                .disableBookmarkList()
                .disableDocumentInfoView();
        return configuration;
    }

    public PdfActivityConfiguration build() {
        return newConfigurations.build();
    }
}
