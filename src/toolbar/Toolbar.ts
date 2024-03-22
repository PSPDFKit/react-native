/**
 * A toolbar item used to display a custom button on the toolbar.
 * @typedef ToolbarItem
 * @memberof Toolbar
 * @property {string} id - The unique identifier for the custom toolbar button. This will be used to identify the button in the ```onCustomToolbarButtonTapped``` callback. On Android the ID needs to be specified as a resource item inside your application's ```ids.xml``` file.
 * @property {string} image - The image name (iOS) or resource ID (Android) for the toolbar button. Images must be included in the application bundle on iOS and specified as a drawable resource on Android.
 * @property {string} [title] - The title of the toolbar button (Android only).
 * @property {boolean} [showAsAction] - Whether the toolbar button should be displayed on the main toolbar (not in the drop down menu) (Android only).
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
 * @namespace Toolbar
 * @property { Toolbar.ToolbarItems } [leftBarButtonItems] The bar buttons to display on the left side of the navigation bar (iOS only).
 * @property { Toolbar.ToolbarItems } [rightBarButtonItems] The bar buttons to display on the right side of the navigation bar (iOS only).
 * @property { Toolbar.ToolbarItems } [toolbarMenuItems] The toolbar buttons to display on the toolbar (Android only).
 */
export class Toolbar {
    leftBarButtonItems?: ToolbarItems;
    rightBarButtonItems?: ToolbarItems;
    toolbarMenuItems?: ToolbarItems;
}

export interface ToolbarItem {
    id: string;
    image: string;
    title?: string;
    showAsAction?: boolean;
}

export interface ToolbarItems {
    buttons: Array<Toolbar.DefaultToolbarButton | ToolbarItem>;
    viewMode?: Toolbar.PDFViewMode;
    animated?: boolean;
}

export namespace Toolbar {
    /**
     * The stock toolbar buttons available to display on the PSPDFKit toolbar.
     * @readonly
     * @enum {string} DefaultToolbarButton
     */
     export const DefaultToolbarButton = {
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
     } as const;

    /**
     * The available view modes when setting the bar buttons on iOS.
     * @readonly
     * @enum {string} PDFViewMode
     */
     export const PDFViewMode = {
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
     } as const;

     export type DefaultToolbarButton = ValueOf<typeof DefaultToolbarButton>;
     export type PDFViewMode = ValueOf<typeof PDFViewMode>;
     type ValueOf<T> = T[keyof T];
}