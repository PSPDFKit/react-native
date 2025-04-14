"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFConfiguration = void 0;
/**
 * The configuration when downloading a document from a remote URL.
 * @typedef RemoteDocumentConfiguration
 * @memberof PDFConfiguration
 * @property { string } [outputFilePath] - The location where the downloaded document should be stored. If not set, the document will be stored in a temporary cache directory.
 * @property { boolean } [overwriteExisting] - Whether the document should be overwritten if it already exists at the specified location.
 */
/**
 * @namespace PDFConfiguration
 * @property { PDFConfiguration.ScrollDirection } [scrollDirection] Configures the direction of page scrolling in the document view.
 * @property { PDFConfiguration.PageTransition } [pageTransition] Configures the page scrolling mode. Note that ```curl``` mode is only available for iOS and will be ignored on Android.
 * @property { string } [documentPassword] The password to unlock the document.
 * @property { PDFConfiguration.BooleanType } [enableTextSelection] Allow / disallow text selection.
 * @property { PDFConfiguration.BooleanType } [autosaveEnabled] Determines whether PSPDFKit should save automatically in response to [certain UI triggers][], such as the app entering the background or the view disappearing.
 * @property { PDFConfiguration.BooleanType } [disableAutomaticSaving] Determines whether PSPDFKit should save automatically in response to certain UI triggers, such as the app entering the background or the view disappearing.
 * @property { PDFConfiguration.SignatureSavingStrategy } [signatureSavingStrategy] Determines whether signatures should be saved after creation.
 * @property { PDFConfiguration.BooleanType } [iOSShouldScrollToChangedPage] Scrolls to the affected page during an undo / redo operation.
 * @property { PDFConfiguration.BooleanType } [iOSFormElementZoomEnabled] Option to automatically focus on selected form elements.
 * @property { PDFConfiguration.BooleanType } [iOSImageSelectionEnabled] Allow / disallow image selection.
 * @property { PDFConfiguration.BooleanType } [iOSTextSelectionShouldSnapToWord] Configure if text selection should snap to words.
 * @property { PDFConfiguration.BooleanType } [iOSFreeTextAccessoryViewEnabled] Shows a toolbar with text editing options above the keyboard while editing free text annotations.
 * @property { PDFConfiguration.BooleanType } [iOSInternalTapGesturesEnabled] Enable / disable all internal gesture recognizers.
 * @property { PDFConfiguration.BooleanType } [iOSAllowBackgroundSaving] Determines whether automatic saving should happen on a background thread.
 * @property { number } [iOSMinimumZoomScale] Minimum zoom scale for the scroll view.
 * @property { number } [iOSMaximumZoomScale] Maximum zoom scale for the scroll view.
 * @property { PDFConfiguration.IOSDoubleTapAction } [iOSDoubleTapAction] The action that happens when the user double taps somewhere in the document.
 * @property { PDFConfiguration.IOSTypesShowingColorPresets[] } [iOSTypesShowingColorPresets] Shows a custom cell with configurable color presets for the provided annotation types.
 * @property { PDFConfiguration.PageMode } [pageMode] The document PageMode.
 * @property { PDFConfiguration.BooleanType } [firstPageAlwaysSingle] Option to show the first page separately.
 * @property { PDFConfiguration.BooleanType } [showPageLabels] Displays the current page number.
 * @property { PDFConfiguration.BooleanType } [documentLabelEnabled] Shows an overlay displaying the document name.
 * @property { PDFConfiguration.SpreadFitting } [spreadFitting] Controls the page fitting mode. ```adaptive``` mode only works on iOS and has no effect on Android.
 * @property { PDFConfiguration.BooleanType } [invertColors] Inverts the document color if ```true```.
 * @property { PDFConfiguration.BooleanType } [androidGrayScale] Converts the document colors to grayscale.
 * @property { PDFConfiguration.BooleanType } [iOSClipToPageBoundaries] Option to clip content to page boundaries.
 * @property { any } [iOSBackgroundColor] Background color behind the page view.
 * @property { PDFConfiguration.BooleanType } [iOSRenderAnimationEnabled] Shows a ```UIActivityIndicatorView``` in the top-right corner while the page is rendering.
 * @property { PDFConfiguration.IOSRenderStatusViewPosition } [iOSRenderStatusViewPosition] Position of the render status view.
 * @property { PDFConfiguration.IOSAllowedAppearanceModes } [iOSAllowedAppearanceModes] Allowed appearance modes for ```BrightnessViewController```.
 * @property { PDFConfiguration.UserInterfaceViewMode } [userInterfaceViewMode] Configures the user interface visibility.
 * @property { PDFConfiguration.BooleanType } [inlineSearch] Sets the type of search bar to be inline or modular.
 * @property { PDFConfiguration.BooleanType } [immersiveMode] Hides the user interface if set to ```true```.
 * @property { string } [toolbarTitle] Sets the title of the toolbar. Note: For iOS, you need to set ```documentLabelEnabled```, ```iOSUseParentNavigationBar```, and ```iOSAllowToolbarTitleChange``` to false in your configuration before setting the custom title.
 * @property { PDFConfiguration.BooleanType } [androidShowSearchAction] Enables / disables document search functionality.
 * @property { PDFConfiguration.BooleanType } [androidShowOutlineAction] Enables an outline menu in the activity.
 * @property { PDFConfiguration.BooleanType } [androidShowBookmarksAction] Enables the display of bookmarks.
 * @property { PDFConfiguration.BooleanType } [androidShowShareAction] Enables the display of share features.
 * @property { PDFConfiguration.BooleanType } [androidShowPrintAction] Enables the printing option in the menu (if applicable) for the document and the device.
 * @property { PDFConfiguration.BooleanType } [androidShowDocumentInfoView] Enables the display of document information.
 * @property { PDFConfiguration.BooleanType } [androidShowSettingsMenu] Enables the display of the settings menu.
 * @property { PDFConfiguration.BooleanType } [iOSShouldHideUserInterfaceOnPageChange] Option to hide / show the user interface when changing pages.
 * @property { PDFConfiguration.BooleanType } [iOSShouldShowUserInterfaceOnViewWillAppear] Option to hide / show the user interface when the page appears.
 * @property { PDFConfiguration.BooleanType } [iOSShouldHideStatusBarWithUserInterface] Option to hide / show the status bar with the user interface.
 * @property { PDFConfiguration.BooleanType } [iOSShouldHideNavigationBarWithUserInterface] Option to hide / show the navigation bar with the user interface.
 * @property { PDFConfiguration.IOSSearchMode } [iOSSearchMode] Sets the type of search bar to be inline or modal.
 * @property { PDFConfiguration.BooleanType } [iOSScrollOnEdgeTapEnabled] Determines whether tapping on leading / trailing edges of the document view should trigger changing to the previous / next page.
 * @property { number } [iOSScrollOnEdgeTapMargin] The margin in points from the view’s sides in which tapping should trigger scrolling to the previous / next page.
 * @property { PDFConfiguration.BooleanType } [iOSUseParentNavigationBar] Set this to true to allow this controller to access the parent ```navigationBar``` / ```navigationController``` to add custom buttons.
 * @property { PDFConfiguration.BooleanType } [iOSAllowToolbarTitleChange] Allow PSPDFKit to change the title of this view controller.
 * @property { PDFConfiguration.BooleanType } [iOSShouldHideStatusBar] If ```true```, the status bar will always remain hidden (regardless of the ```shouldHideStatusBarWithUserInterface``` setting).
 * @property { PDFConfiguration.BooleanType } [iOSShowBackActionButton] Shows a floating back button in the lower part of the screen.
 * @property { PDFConfiguration.BooleanType } [iOSShowForwardActionButton] Shows a floating forward button in the lower part of the screen.
 * @property { PDFConfiguration.BooleanType } [iOSShowBackForwardActionButtonLabels] Adds text labels representing the destination name to the back and forward buttons.
 * @property { number } [iOSSearchResultZoomScale] Increase this to zoom to the search result.
 * @property { any } [iOSAdditionalScrollViewFrameInsets] Additional insets to apply to the document scroll view's frame.
 * @property { any } [iOSAdditionalContentInsets] Additional insets to apply to the layout's content.
 * @property { PDFConfiguration.IOSSettingsOptions[] } [iOSSettingsOptions] Options that will be presented by ```PDFSettingsViewController```. Defaults to ```.default```.
 * @property { PDFConfiguration.BooleanType } [iOSShadowEnabled] Enable / disable page shadow.
 * @property { number } [iOSShadowOpacity] Set the default ```shadowOpacity```.
 * @property { PDFConfiguration.ShowThumbnailBar } [showThumbnailBar] Thumbnail bar mode controls the display of page thumbnails viewing a document.
 * @property { PDFConfiguration.BooleanType } [androidShowThumbnailGridAction] Displays an action bar icon to show a grid of thumbnail pages.
 * @property { PDFConfiguration.IOSScrubberBarType } [iOSScrubberBarType] Controls the placement of the scrubber bar.
 * @property { PDFConfiguration.IOSThumbnailGrouping } [iOSThumbnailGrouping] Option to set the grouping of thumbnails.
 * @property { any } [iOSThumbnailSize] Configure the size of the thumbnail.
 * @property { number } [iOSThumbnailInteritemSpacing] Configure the spacing between thumbnails.
 * @property { number } [iOSThumbnailLineSpacing] Configure the line spacing of thumbnails.
 * @property { any } [iOSThumbnailMargin] Configure the margin for thumbnails.
 * @property { PDFConfiguration.BooleanType } [iOSShouldCacheThumbnails] Option to enable / disable thumbnail caching.
 * @property { PDFConfiguration.EditableAnnotationTypes[] } [editableAnnotationTypes] Set containing the annotation types that should be editable.
 * @property { PDFConfiguration.BooleanType } [enableAnnotationEditing] Configuration to enable / disable editing all annotations. To selectively enable editing for specific types of annotations, use ```editableAnnotationTypes```.
 * @property { PDFConfiguration.BooleanType } [enableFormEditing] Enable / disable editing forms. This can also be accomplished by adding or removing the ```Widget``` annotation type from ```editableAnnotationTypes```.
 * @property { PDFConfiguration.BooleanType } [androidShowAnnotationListAction] Enables the list of annotations.
 * @property { PDFConfiguration.BooleanType } [iOSShouldAskForAnnotationUsername] If ```true```, asks the user to specify a custom annotation user name ("author") when creating a new annotation.
 * @property { PDFConfiguration.IOSLinkAction } [iOSLinkAction] Sets the default link action for pressing on a ```LinkAnnotation```.
 * @property { PDFConfiguration.IOSDrawCreateMode } [iOSDrawCreateMode] Determines whether new annotations are created when strokes end.
 * @property { PDFConfiguration.BooleanType } [iOSAnnotationGroupingEnabled] If set to ```true```, you can group / ungroup annotations with the multi-select tool.
 * @property { PDFConfiguration.BooleanType } [iOSNaturalDrawingAnnotationEnabled] Enables natural drawing for ink annotations.
 * @property { PDFConfiguration.BooleanType } [iOSNaturalSignatureDrawingEnabled] Enables natural drawing for signatures.
 * @property { PDFConfiguration.BooleanType } [iOSAnnotationEntersEditModeAfterSecondTapEnabled] Controls if a second tap to an annotation that allows inline editing enters edit mode.
 * @property { PDFConfiguration.BooleanType } [iOSCreateAnnotationMenuEnabled] If set to ```true```, a long tap that ends on a page area that isn’t a text / image will show a new menu to create annotations.
 * @property { number } [iOSAnnotationAnimationDuration] Overlay annotations are faded in. Set the global duration for this fade here.
 * @property { number } [iOSSoundAnnotationTimeLimit] Describes the time limit for recording sound annotations, in seconds.
 * @property { PDFConfiguration.IOSBookmarkSortOrder } [iOSBookmarkSortOrder] Controls how bookmarks are displayed and managed.
 * @property { PDFConfiguration.BooleanType } [enableInstantComments] Enable Instant comments.
 * @property { PDFConfiguration.BooleanType } [listenToServerChanges] Listen for server changes automatically.
 * @property { number } [delay] The delay before syncing with the Instant server.
 * @property { PDFConfiguration.BooleanType } [syncAnnotations] Indicates whether document annotations should be synced with the Instant server.
 * @property { Measurements.MeasurementValueConfiguration[] } [measurementValueConfigurations] The array of ```MeasurementValueConfiguration``` objects that should be applied to the document.
 * @property { PDFConfiguration.RemoteDocumentConfiguration } [remoteDocumentConfiguration] The configuration when downloading a document from a remote URL.
 * @property { PDFConfiguration.BooleanType } [androidShowDefaultToolbar] Used to show or hide the main toolbar.
 * @property { PDFConfiguration.BooleanType } [showActionButtons] Shows floating back and forward buttons in the lower part of the screen.
 *
 */
var PDFConfiguration = /** @class */ (function () {
    function PDFConfiguration() {
    }
    return PDFConfiguration;
}());
exports.PDFConfiguration = PDFConfiguration;
(function (PDFConfiguration) {
    /**
     * A convenience type to select Boolean options.
     * @readonly
     * @enum {string} BooleanType
     */
    PDFConfiguration.BooleanType = {
        /**
         * Set the value to ```true```.
         */
        TRUE: true,
        /**
         * Set the value to ```false```.
         */
        FALSE: false,
    };
    /**
     * Configures the direction of page scrolling in the document view.
     * @readonly
     * @enum {string} ScrollDirection
     */
    PDFConfiguration.ScrollDirection = {
        /**
         * Enable horizontal scrolling.
         */
        HORIZONTAL: 'horizontal',
        /**
         * Enable vertical scrolling.
         */
        VERTICAL: 'vertical'
    };
    /**
     * Configures the page scrolling mode. Note that curl mode is only available for iOS and will be ignored on Android.
     * @readonly
     * @enum {string} PageTransition
     */
    PDFConfiguration.PageTransition = {
        /**
         * Transitions from one spread to another and does not stop scrolling in between two spreads (paginated).
         */
        SCROLL_PER_SPREAD: 'scrollPerSpread',
        /**
         * Scrolls continuously.
         */
        SCROLL_CONTINUOUS: 'scrollContinuous',
        /**
         * Page curl mode, similar to Apple Books. Not supported with variable sized PDFs. Only available on iOS.
         */
        CURL: 'curl'
    };
    /**
     * The SignatureSavingStrategy options.
     * @readonly
     * @enum {string} SignatureSavingStrategy
     */
    PDFConfiguration.SignatureSavingStrategy = {
        /**
         * Always save the signature after it is created.
         */
        ALWAYS_SAVE: 'alwaysSave',
        /**
         * Never save the signature after it is created.
         */
        NEVER_SAVE: 'neverSave',
        /**
         * Save the signature after it is created, if indicated by the user.
         */
        SAVE_IF_SELECTED: 'saveIfSelected'
    };
    /**
     * The IOSDoubleTapAction options.
     * @readonly
     * @enum {string} IOSDoubleTapAction
     */
    PDFConfiguration.IOSDoubleTapAction = {
        /**
         * Do not zoom on double tap.
         */
        NONE: 'none',
        /**
         * Zoom on double tap.
         */
        ZOOM: 'zoom',
        /**
         * Smart zoom on double tap.
         */
        SMART_ZOOM: 'smartZoom'
    };
    /**
     * The IOSTextSelectionMode options.
     * @readonly
     * @enum {string} IOSTextSelectionMode
     */
    PDFConfiguration.IOSTextSelectionMode = {
        /**
         * Selecting text in regular mode starts after a long-press and results in a selection with dragging handles.
         */
        REGULAR: 'regular',
        /**
         * Selecting text in simple mode starts almost immediately on touch down and results in a selection with dragging handles.
         */
        SIMPLE: 'simple',
        /**
         * Selection mode will be chosen based on input device: selecting text with finger or Apple Pencil will use regular mode, while selecting text with trackpad or mouse will use simple mode.
         */
        AUTOMATIC: 'automatic'
    };
    /**
     * The IOSTypesShowingColorPresets options.
     * @readonly
     * @enum {string} IOSTypesShowingColorPresets
     */
    PDFConfiguration.IOSTypesShowingColorPresets = {
        NONE: 'none',
        UNDEFINED: 'undefined',
        ALL: 'all',
        LINK: 'link',
        HIGHLIGHT: 'highlight',
        UNDERLINE: 'underline',
        SQUIGGLY: 'squiggly',
        STRIKE_OUT: 'strikeOut',
        TEXT: 'text',
        CARET: 'caret',
        FREE_TEXT: 'freeText',
        INK: 'ink',
        SQUARE: 'square',
        CIRCLE: 'circle',
        LINE: 'line',
        SIGNATURE: 'signature',
        STAMP: 'stamp',
        ERASER: 'eraser',
        IMAGE: 'image',
        WIDGET: 'widget',
        FILE_ATTACHMENT: 'fileAttachment',
        SOUND: 'sound',
        POLYGON: 'polygon',
        POLY_LINE: 'polyLine',
        RICH_MEDIA: 'richMedia',
        SCREEN: 'screen',
        POPUP: 'popup',
        WATERMARK: 'watermark',
        TRAP_NET: 'trapNet',
        '3D': '3D',
        REDACT: 'redact',
    };
    /**
     * The PageMode options.
     * @readonly
     * @enum {string} PageMode
     */
    PDFConfiguration.PageMode = {
        /**
         * Always show a single page.
         */
        SINGLE: 'single',
        /**
         * Always show two pages side-by-side.
         */
        DOUBLE: 'double',
        /**
         * Show two pages only when the view is sufficiently large and two pages can be shown without too much shrinking.
         */
        AUTOMATIC: 'automatic'
    };
    /**
     * The SpreadFitting options.
     * @readonly
     * @enum {string} SpreadFitting
     */
    PDFConfiguration.SpreadFitting = {
        /**
         * Aspect fit results in a spread view having all its pages always visible on screen.
         */
        FIT: 'fit',
        /**
         * Aspect fills the content so that it completely covers the width of the view.
         */
        FILL: 'fill',
        /**
         * Automatically switches between ```fit``` and ```fill```.
         */
        ADAPTIVE: 'adaptive'
    };
    /**
     * The IOSRenderStatusViewPosition options.
     * @readonly
     * @enum {string} IOSRenderStatusViewPosition
     */
    PDFConfiguration.IOSRenderStatusViewPosition = {
        /**
         * Display render status view at the top.
         */
        TOP: 'top',
        /**
         * Display render status view at the center.
         */
        CENTERED: 'centered'
    };
    /**
     * The IOSAllowedAppearanceModes options.
     * @readonly
     * @enum {string} IOSAllowedAppearanceModes
     */
    PDFConfiguration.IOSAllowedAppearanceModes = {
        /**
         * Normal application appearance and page rendering, as configured by the host app.
         */
        DEFAULT: 'default',
        /**
         * Renders the PDF content with a sepia tone.
         */
        SEPIA: 'sepia',
        /**
         * Inverts the PDF page content and applies color correction.
         */
        NIGHT: 'night',
        /**
         * All options.
         */
        ALL: 'all',
    };
    /**
     * The UserInterfaceViewMode options.
     * @readonly
     * @enum {string} UserInterfaceViewMode
     */
    PDFConfiguration.UserInterfaceViewMode = {
        /**
         * Show user interface view on touch and first/last page.
         */
        AUTOMATIC: 'automatic',
        /**
         * Show user interface view on touch and first/last page.
         */
        AUTOMATIC_BORDER_PAGES: 'automaticBorderPages',
        /**
         * Show user interface view on touch.
         */
        AUTOMATIC_NO_FIRST_LAST_PAGE: 'automaticNoFirstLastPage',
        /**
         * Always show the user interface view.
         */
        ALWAYS: 'always',
        /**
         * Always show the user interface view.
         */
        ALWAYS_VISIBLE: 'alwaysVisible',
        /**
         * Never show the user interface view.
         */
        ALWAYS_HIDDEN: 'alwaysHidden',
        /**
         * Never show the user interface view.
         */
        NEVER: 'never',
    };
    /**
     * The IOSSearchMode options.
     * @readonly
     * @enum {string} IOSSearchMode
     */
    PDFConfiguration.IOSSearchMode = {
        /**
         * Display search results in a modal view.
         */
        MODAL: 'modal',
        /**
         * Display search results inline.
         */
        INLINE: 'inline'
    };
    /**
     * The IOSSettingsOptions options.
     * @readonly
     * @enum {string} IOSSettingsOptions
     */
    PDFConfiguration.IOSSettingsOptions = {
        /**
         * Shows UI to change ```ScrollDirection```.
         */
        SCROLL_DIRECTION: 'scrollDirection',
        /**
         * Shows UI to change ```PageTransition``` (continuous or per-spread scrolling).
         */
        PAGE_TRANSITION: 'pageTransition',
        /**
         * Shows UI to change ```AppearanceMode``` (sepia and dark rendering).
         */
        APPEARANCE: 'appearance',
        /**
         * Shows UI to adjust screen brightness.
         */
        BRIGHTNESS: 'brightness',
        /**
         * Shows UI to change ```PageMode``` (single or double page mode).
         */
        PAGE_MODE: 'pageMode',
        /**
         * The default set of settings the user can adjust with ```PDFSettingsViewController```.
         */
        DEFAULT: 'default',
        /**
         * All the settings that can be set by a ```PDFSettingsViewController```.
         */
        ALL: 'all'
    };
    /**
     * The ShowThumbnailBar options.
     * @readonly
     * @enum {string} ShowThumbnailBar
     */
    PDFConfiguration.ShowThumbnailBar = {
        /**
         * Don't show any thumbnails.
         */
        NONE: 'none',
        /**
         * The default thumbnail bar (like Apple Books, ```ScrubberBar```)
         */
        DEFAULT: 'default',
        /**
         * Show a floating scrubber bar (```ScrubberBar```)
         */
        FLOATING: 'floating',
        /**
         * Show a pinned scrubber bar (```ScrubberBar```)
         */
        PINNED: 'pinned',
        /**
         * Show scrubber bar (like Apple Books, ```ScrubberBar```)
         */
        SCRUBBER_BAR: 'scrubberBar',
        /**
         * Show scrollable thumbnail bar (```ThumbnailBar```)
         */
        SCROLLABLE: 'scrollable'
    };
    /**
     * The IOSScrubberBarType options.
     * @readonly
     * @enum {string} IOSScrubberBarType
     */
    PDFConfiguration.IOSScrubberBarType = {
        /**
         * The default style: A scrubber bar that lays out its thumbnails along its width.
         */
        HORIZONTAL: 'horizontal',
        /**
         * Style for a scrubber bar that lays out its thumbnails along its height and sits along the left edge of its container.
         */
        VERTICAL_LEFT: 'verticalLeft',
        /**
         * Style for a scrubber bar that lays out its thumbnails along its height and sits along the right edge of its container view.
         */
        VERTICAL_RIGHT: 'verticalRight'
    };
    /**
     * The IOSThumbnailGrouping options.
     * @readonly
     * @enum {string} IOSThumbnailGrouping
     */
    PDFConfiguration.IOSThumbnailGrouping = {
        /**
         * Group double pages when ```PageMode.double``` is enabled.
         */
        AUTOMATIC: 'automatic',
        /**
         * Never group double pages for thumbnails.
         */
        NEVER: 'never',
        /**
         * Always group double pages for thumbnails.
         */
        ALWAYS: 'always'
    };
    /**
     * The EditableAnnotationTypes options.
     * @readonly
     * @enum {string} EditableAnnotationTypes
     */
    PDFConfiguration.EditableAnnotationTypes = {
        NONE: 'none',
        UNDEFINED: 'undefined',
        ALL: 'all',
        LINK: 'link',
        HIGHLIGHT: 'highlight',
        UNDERLINE: 'underline',
        SQUIGGLY: 'squiggly',
        STRIKE_OUT: 'strikeOut',
        TEXT: 'text',
        CARET: 'caret',
        FREE_TEXT: 'freeText',
        INK: 'ink',
        SQUARE: 'square',
        CIRCLE: 'circle',
        LINE: 'line',
        SIGNATURE: 'signature',
        STAMP: 'stamp',
        ERASER: 'eraser',
        IMAGE: 'image',
        WIDGET: 'widget',
        FILE_ATTACHMENT: 'fileAttachment',
        SOUND: 'sound',
        POLYGON: 'polygon',
        POLY_LINE: 'polyLine',
        RICH_MEDIA: 'richMedia',
        SCREEN: 'screen',
        POPUP: 'popup',
        WATERMARK: 'watermark',
        TRAP_NET: 'trapNet',
        '3D': '3D',
        REDACT: 'redact',
        SELECTION_TOOL: 'selection_tool',
    };
    /**
     * The IOSLinkAction options.
     * @readonly
     * @enum {string} IOSLinkAction
     */
    PDFConfiguration.IOSLinkAction = {
        /**
         * Link actions are ignored.
         */
        AUTOMATIC: 'none',
        /**
         * Link actions open an ```UIAlertView```.
         */
        ALERT_VIEW: 'alertView',
        /**
         * Link actions directly open Safari or whichever app is set as the default browser.
         */
        OPEN_SAFARI: 'openSafari',
        /**
         * Link actions open in an ```SFSafariViewController```, falling back on ```PDFWebViewController``` for local file URLs.
         */
        INLINE_BROWSER: 'inlineBrowser',
        /**
         * Always uses ```PDFWebViewController```.
         */
        INLINE_WEB_VIEW_CONTROLLER: 'InlineWebViewController'
    };
    /**
     * The IOSDrawCreateMode options.
     * @readonly
     * @enum {string} IOSDrawCreateMode
     */
    PDFConfiguration.IOSDrawCreateMode = {
        /**
         * Every stroke will result in a separate ink annotation.
         */
        SEPARATE: 'separate',
        /**
         * Strokes that have the same color/width are merged.
         */
        MERGE_IF_POSSIBLE: 'mergeIfPossible'
    };
    /**
     * The IOSBookmarkSortOrder options.
     * @readonly
     * @enum {string} IOSBookmarkSortOrder
     */
    PDFConfiguration.IOSBookmarkSortOrder = {
        /**
         * Custom sort order, based on creation, but reorderable.
         */
        CUSTOM: 'custom',
        /**
         * Sort based on pages.
         */
        PAGE_BASED: 'pageBased'
    };
})(PDFConfiguration || (exports.PDFConfiguration = PDFConfiguration = {}));
