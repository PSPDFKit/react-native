"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
var Toolbar;
(function (Toolbar) {
    /**
     * The stock toolbar buttons available to display on the Nutrient toolbar.
     * @readonly
     * @enum {string} DefaultToolbarButton
     */
    Toolbar.DefaultToolbarButton = {
        CLOSE_BUTTON_ITEM: 'closeButtonItem',
        OUTLINE_BUTTON_ITEM: 'outlineButtonItem',
        SEARCH_BUTTON_ITEM: 'searchButtonItem',
        THUMBNAILS_BUTTON_ITEM: 'thumbnailsButtonItem',
        DOCUMENT_EDITOR_BUTTON_ITEM: 'documentEditorButtonItem',
        PRINT_BUTTON_ITEM: 'printButtonItem',
        OPEN_IN_BUTTON_ITEM: 'openInButtonItem',
        EMAIL_BUTTON_ITEM: 'emailButtonItem',
        MESSAGE_BUTTON_ITEM: 'messageButtonItem',
        ANNOTATION_BUTTON_ITEM: 'annotationButtonItem',
        BOOKMARK_BUTTON_ITEM: 'bookmarkButtonItem',
        BRIGHTNESS_BUTTON_ITEM: 'brightnessButtonItem',
        ACTIVITY_BUTTON_ITEM: 'activityButtonItem',
        SETTINGS_BUTTON_ITEM: 'settingsButtonItem',
        READER_VIEW_BUTTON_ITEM: 'readerViewButtonItem',
        ANNOTATION_LIST_BUTTON_ITEM: 'annotationListButtonItem',
        SHARE_BUTTON_ITEM: 'shareButtonItem',
        AI_ASSISTANT_BUTTON_ITEM: 'aiAssistantButtonItem',
    };
    /**
     * The available view modes when setting the bar buttons on iOS.
     * @readonly
     * @enum {string} PDFViewMode
     */
    Toolbar.PDFViewMode = {
        /**
         * Set the toolbar buttons when the Document is visible.
         */
        VIEW_MODE_DOCUMENT: 'document',
        /**
         * Set the toolbar buttons when thumbnails are visible.
         */
        VIEW_MODE_THUMBNAILS: 'thumbnails',
        /**
         * Set the toolbar buttons when thumbnails and page editing options are visible.
         */
        VIEW_MODE_DOCUMENT_EDITOR: 'documentEditor',
    };
})(Toolbar || (exports.Toolbar = Toolbar = {}));
