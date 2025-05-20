"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
/**
 * A toolbar item used to display a custom button on the toolbar.
 * @typedef ToolbarItem
 * @memberof Toolbar
 * @property {string} id - The unique identifier for the custom toolbar button. This will be used to identify the button in the ```onCustomToolbarButtonTapped``` callback. On Android the ID needs to be specified as a resource item inside your application's ```ids.xml``` file.
 * @property {string} image - The image name (iOS) or resource ID (Android) for the toolbar button. Images must be included in the application bundle on iOS and specified as a drawable resource on Android.
 * @property {string} [title] - The title of the toolbar button (Android only).
 * @property {boolean} [showAsAction] - Whether the toolbar button should be displayed on the main toolbar, and not in the drop down menu (Android only).
 * @property {boolean} [applyTemplate] - Whether the icon should be rendered using the system's tint color to match the color scheme of other toolbar buttons. Set this to false if your icon already contains color information that should be preserved.
 */
/**
 * The toolbar buttons that should be displayed on the toolbar.
 * @typedef ToolbarItems
 * @memberof Toolbar
 * @property {Array<string | Toolbar.ToolbarItem>} buttons - An array of buttons that should be displayed on the toolbar. The buttons can be either stock toolbar buttons, custom toolbar buttons, or a combination of both.
 * @property {string} [viewMode] - The viewMode for which the toolbar buttons should be set (iOS only).
 * @property {string} [animated] - Whether the toolbar button change should be animated when they are set (iOS only).
 */
/**
 * @interface Toolbar
 * @property { Toolbar.ToolbarItems } [leftBarButtonItems] The bar buttons to display on the left side of the navigation bar (iOS only).
 * @property { Toolbar.ToolbarItems } [rightBarButtonItems] The bar buttons to display on the right side of the navigation bar (iOS only).
 * @property { Toolbar.ToolbarItems } [toolbarMenuItems] The toolbar buttons to display on the toolbar (Android only).
 */
var Toolbar = /** @class */ (function () {
    function Toolbar() {
    }
    return Toolbar;
}());
exports.Toolbar = Toolbar;
(function (Toolbar) {
    /**
     * The stock toolbar buttons available to display on the PSPDFKit toolbar.
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
