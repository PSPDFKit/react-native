/*
 * ToolbarMenuItemsAdapter.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2022-2025 PSPDFKit GmbH. All rights reserved.
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

import io.reactivex.rxjava3.annotations.NonNull;

/**
 * This class is used for mapping the toolbar menu items for customization.
 */
public class ToolbarMenuItemsAdapter {

    // Toolbar customization items that should be set in configuration
    private static final String TOOLBAR_ITEM_BOOKMARKS = "bookmarkButtonItem";
    private static final String TOOLBAR_ITEM_PRINT = "printButtonItem";
    private static final String TOOLBAR_ITEM_ANNOTATION_LIST = "annotationListButtonItem";
    private static final String TOOLBAR_ITEM_AI_ASSISTANT = "aiAssistantButtonItem";

    private final PdfActivityConfiguration.Builder newConfigurations;

    /**
     * @param currentConfiguration The current configuration.
     * @param toolbarItems         The toolbar items to be customized.
     */
    public ToolbarMenuItemsAdapter(@NonNull final PdfActivityConfiguration currentConfiguration, @NonNull final ReadableArray toolbarItems, PdfActivityConfiguration initialConfiguration) {
        // Initial config is used as the source for the user-defined config. If not available, use the current config. 
        if (initialConfiguration == null) {
            initialConfiguration = currentConfiguration;
        }
        PdfActivityConfiguration.Builder configurationBuilder = new PdfActivityConfiguration.Builder(currentConfiguration);
        PdfActivityConfiguration.Builder configuration = disableDefaultToolbarItems(configurationBuilder);

        for (int i = 0; i < toolbarItems.size(); i++) {
            String toolbarItem = toolbarItems.getString(i);
            switch (toolbarItem) {
                case TOOLBAR_ITEM_BOOKMARKS:
                    if (initialConfiguration.isBookmarkListEnabled()) {
                        configuration.bookmarkListEnabled(true);
                    }
                    break;
                case TOOLBAR_ITEM_PRINT:
                    if (initialConfiguration.isPrintingEnabled()) {
                        configuration.printingEnabled(true);
                    }
                    break;
                case TOOLBAR_ITEM_ANNOTATION_LIST:
                    if (initialConfiguration.isAnnotationListEnabled()) {
                        configuration.annotationListEnabled(true);
                    }
                    break;
                case TOOLBAR_ITEM_AI_ASSISTANT:
                    configuration.setAiAssistantEnabled(true);
                    break;
            }
        }
        newConfigurations = configuration;
    }

    private PdfActivityConfiguration.Builder disableDefaultToolbarItems(final PdfActivityConfiguration.Builder configuration) {
        configuration.disableAnnotationList()
                .disablePrinting()
                .disableBookmarkList();
        return configuration;
    }

    public PdfActivityConfiguration build() {
        return newConfigurations.build();
    }
}
