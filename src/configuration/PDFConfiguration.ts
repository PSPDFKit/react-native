import { MeasurementValueConfiguration } from './../measurements/Measurements';

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
 * @property { PDFConfiguration.IOSAllowedMenuActions } [iOSAllowedMenuActions] May be used to customize other displayed menu actions when text is selected.
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
 * @property { PDFConfiguration.SignatureCreationModes[] } [signatureCreationModes] The signature creation modes that should be available in the signature picker.
 * @property { PDFConfiguration.SignatureColorOptions[] } [signatureColorOptions] The color options that should be available in the signature picker, max of 3 colors are supported. If all 3 colors are not provided, defaults will be used in their place.
*/

export class PDFConfiguration {

    /**
     * Configures the direction of page scrolling in the document view.
     */
    scrollDirection?: PDFConfiguration.ScrollDirection;
    /**
     * Configures the page scrolling mode. Note that ```curl``` mode is only available for iOS and will be ignored on Android.
     */
    pageTransition?: PDFConfiguration.PageTransition;
    /**
     * The password to unlock the document.
     */
    documentPassword?: string;
    /**
     * Allow / disallow text selection.
     */
    enableTextSelection?: PDFConfiguration.BooleanType;
    /**
     * Determines whether PSPDFKit should save automatically in response to [certain UI triggers][], such as the app entering the background or the view disappearing.
     */
    autosaveEnabled?: PDFConfiguration.BooleanType;
    /**
     * Determines whether PSPDFKit should save automatically in response to certain UI triggers, such as the app entering the background or the view disappearing.
     */
    disableAutomaticSaving?: PDFConfiguration.BooleanType;
    /**
     * Determines whether signatures should be saved after creation.
     */
    signatureSavingStrategy?: PDFConfiguration.SignatureSavingStrategy;
    /**
     * Scrolls to the affected page during an undo / redo operation.
     */
    iOSShouldScrollToChangedPage?: PDFConfiguration.BooleanType;
    /**
     * Option to automatically focus on selected form elements.
     */
    iOSFormElementZoomEnabled?: PDFConfiguration.BooleanType;
    /**
     * Allow / disallow image selection.
     */
    iOSImageSelectionEnabled?: PDFConfiguration.BooleanType;
    /**
     * Configure if text selection should snap to words.
     */
    iOSTextSelectionShouldSnapToWord?: PDFConfiguration.BooleanType;
    /**
     * Shows a toolbar with text editing options above the keyboard while editing free text annotations.
     */
    iOSFreeTextAccessoryViewEnabled?: PDFConfiguration.BooleanType;
    /**
     * Enable / disable all internal gesture recognizers.
     */
    iOSInternalTapGesturesEnabled?: PDFConfiguration.BooleanType;
    /**
     * Determines whether automatic saving should happen on a background thread.
     */
    iOSAllowBackgroundSaving?: PDFConfiguration.BooleanType;
    /**
     * Minimum zoom scale for the scroll view.
     */
    iOSMinimumZoomScale?: number;
    /**
     * Maximum zoom scale for the scroll view.
     */
    iOSMaximumZoomScale?: number;
    /**
     * The action that happens when the user double taps somewhere in the document.
     */
    iOSDoubleTapAction?: PDFConfiguration.IOSDoubleTapAction;
    /**
     * Shows a custom cell with configurable color presets for the provided annotation types.
     */
    iOSTypesShowingColorPresets?: AnyCase<PDFConfiguration.IOSTypesShowingColorPresets>[];
    
    /**
     * The document PageMode.
     */
    pageMode?: PDFConfiguration.PageMode;
    /**
     * Option to show the first page separately.
     */
    firstPageAlwaysSingle?: PDFConfiguration.BooleanType;
    /**
     * Displays the current page number.
     */
    showPageLabels?: PDFConfiguration.BooleanType;
    /**
     * Shows an overlay displaying the document name.
     */
    documentLabelEnabled?: PDFConfiguration.BooleanType;
    /**
     * Controls the page fitting mode. ```adaptive``` mode only works on iOS and has no effect on Android.
     */
    spreadFitting?: PDFConfiguration.SpreadFitting;
    /**
     * Inverts the document color if ```true```.
     */
    invertColors?: PDFConfiguration.BooleanType;
    /**
     * Converts the document colors to grayscale.
     */
    androidGrayScale?: PDFConfiguration.BooleanType;
    /**
     * Option to clip content to page boundaries.
     */
    iOSClipToPageBoundaries?: PDFConfiguration.BooleanType;
    /**
     * Background color behind the page view.
     */
    iOSBackgroundColor?: any;
    /**
     * Shows a ```UIActivityIndicatorView``` in the top-right corner while the page is rendering.
     */
    iOSRenderAnimationEnabled?: PDFConfiguration.BooleanType;
    /**
     * Position of the render status view.
     */
    iOSRenderStatusViewPosition?: PDFConfiguration.IOSRenderStatusViewPosition;
    /**
     * Allowed appearance modes for ```BrightnessViewController```.
     */
    iOSAllowedAppearanceModes?: PDFConfiguration.IOSAllowedAppearanceModes;
    /**
     * Configures the user interface visibility.
     */
    userInterfaceViewMode?: PDFConfiguration.UserInterfaceViewMode;
    /**
     * Sets the type of search bar to be inline or modular.
     */
    inlineSearch?: PDFConfiguration.BooleanType;
    /**
     * Hides the user interface if set to ```true```.
     */
    immersiveMode?: PDFConfiguration.BooleanType;
    /**
     * Sets the title of the toolbar. Note: For iOS, you need to set ```documentLabelEnabled```, ```iOSUseParentNavigationBar```, and ```iOSAllowToolbarTitleChange``` to false in your configuration before setting the custom title.
     */
    toolbarTitle?: string;
    /**
     * Enables / disables document search functionality.
     */
    androidShowSearchAction?: PDFConfiguration.BooleanType;
    /**
     * Enables an outline menu in the activity.
     */
    androidShowOutlineAction?: PDFConfiguration.BooleanType;
    /**
     * Enables the display of bookmarks.
     */
    androidShowBookmarksAction?: PDFConfiguration.BooleanType;
    /**
     * Enables the display of share features.
     */
    androidShowShareAction?: PDFConfiguration.BooleanType;
    /**
     * Enables the printing option in the menu (if applicable) for the document and the device.
     */
    androidShowPrintAction?: PDFConfiguration.BooleanType;
    /**
     * Enables the display of document information.
     */
    androidShowDocumentInfoView?: PDFConfiguration.BooleanType;
    /**
     * Enables the display of the settings menu.
     */
    androidShowSettingsMenu?: PDFConfiguration.BooleanType;
    /**
     * Option to hide / show the user interface when changing pages.
     */
    iOSShouldHideUserInterfaceOnPageChange?: PDFConfiguration.BooleanType;
    /**
     * Option to hide / show the user interface when the page appears.
     */
    iOSShouldShowUserInterfaceOnViewWillAppear?: PDFConfiguration.BooleanType;
    /**
     * Option to hide / show the status bar with the user interface.
     */
    iOSShouldHideStatusBarWithUserInterface?: PDFConfiguration.BooleanType;
    /**
     * Option to hide / show the navigation bar with the user interface.
     */
    iOSShouldHideNavigationBarWithUserInterface?: PDFConfiguration.BooleanType;
    /**
     * Sets the type of search bar to be inline or modal.
     */
    iOSSearchMode?: PDFConfiguration.IOSSearchMode;
    /**
     * Determines whether tapping on leading / trailing edges of the document view should trigger changing to the previous / next page.
     */
    iOSScrollOnEdgeTapEnabled?: PDFConfiguration.BooleanType;
    /**
     * The margin in points from the view’s sides in which tapping should trigger scrolling to the previous / next page.
     */
    iOSScrollOnEdgeTapMargin?: number;
    /**
     * Set this to true to allow this controller to access the parent ```navigationBar``` / ```navigationController``` to add custom buttons.
     */
    iOSUseParentNavigationBar?: PDFConfiguration.BooleanType;
    /**
     * Allow PSPDFKit to change the title of this view controller.
     */
    iOSAllowToolbarTitleChange?: PDFConfiguration.BooleanType;
    /**
     * If ```true```, the status bar will always remain hidden (regardless of the ```shouldHideStatusBarWithUserInterface``` setting).
     */
    iOSShouldHideStatusBar?: PDFConfiguration.BooleanType;
    /**
     * Shows a floating back button in the lower part of the screen.
     */
    iOSShowBackActionButton?: PDFConfiguration.BooleanType;
    /**
     * Shows a floating forward button in the lower part of the screen.
     */
    iOSShowForwardActionButton?: PDFConfiguration.BooleanType;
    /**
     * Adds text labels representing the destination name to the back and forward buttons.
     */
    iOSShowBackForwardActionButtonLabels?: PDFConfiguration.BooleanType;
    /**
     * Increase this to zoom to the search result.
     */
    iOSSearchResultZoomScale?: number;
    /**
     * Additional insets to apply to the document scroll view's frame.
     */
    iOSAdditionalScrollViewFrameInsets?: any
    /**
     * Additional insets to apply to the layout's content.
     */
    iOSAdditionalContentInsets?: any
    /**
     * May be used to customize other displayed menu actions when text is selected.
     */
    iOSAllowedMenuActions?: PDFConfiguration.IOSAllowedMenuActions;
    /**
     * Options that will be presented by ```PDFSettingsViewController```. Defaults to ```.default```.
     */
    iOSSettingsOptions?: PDFConfiguration.IOSSettingsOptions[];
    /**
     * Enable / disable page shadow.
     */
    iOSShadowEnabled?: PDFConfiguration.BooleanType
    /**
     * Set the default ```shadowOpacity```.
     */
    iOSShadowOpacity?: number;

    /**
     * Thumbnail bar mode controls the display of page thumbnails viewing a document.
     */
    showThumbnailBar?: PDFConfiguration.ShowThumbnailBar;
    /**
     * Displays an action bar icon to show a grid of thumbnail pages.
     */
    androidShowThumbnailGridAction?: PDFConfiguration.BooleanType;
    /**
     * Controls the placement of the scrubber bar.
     */
    iOSScrubberBarType?: PDFConfiguration.IOSScrubberBarType;
    /**
     * Option to set the grouping of thumbnails.
     */
    iOSThumbnailGrouping?: PDFConfiguration.IOSThumbnailGrouping;
    /**
     * Configure the size of the thumbnail.
     */
    iOSThumbnailSize?: any;
    /**
     * Configure the spacing between thumbnails.
     */
    iOSThumbnailInteritemSpacing?: number;
    /**
     * Configure the line spacing of thumbnails.
     */
    iOSThumbnailLineSpacing?: number
    /**
     * Configure the margin for thumbnails.
     */
    iOSThumbnailMargin?: any
    /**
     * Option to enable / disable thumbnail caching.
     */
    iOSShouldCacheThumbnails?: PDFConfiguration.BooleanType;

    /**
     * Set containing the annotation types that should be editable.
     */
    editableAnnotationTypes?: AnyCase<PDFConfiguration.EditableAnnotationTypes>[];
    /**
     * Configuration to enable / disable editing all annotations. To selectively enable editing for specific types of annotations, use ```editableAnnotationTypes```.
     */
    enableAnnotationEditing?: PDFConfiguration.BooleanType;
    /**
     * Enable / disable editing forms. This can also be accomplished by adding or removing the ```Widget``` annotation type from ```editableAnnotationTypes```.
     */
    enableFormEditing?: PDFConfiguration.BooleanType;
    /**
     * Enables the list of annotations.
     */
    androidShowAnnotationListAction?: PDFConfiguration.BooleanType;
    /**
     * If ```true```, asks the user to specify a custom annotation user name ("author") when creating a new annotation.
     */
    iOSShouldAskForAnnotationUsername?: PDFConfiguration.BooleanType;
    /**
     * Sets the default link action for pressing on a ```LinkAnnotation```.
     */
    iOSLinkAction?: PDFConfiguration.IOSLinkAction;
    /**
     * Determines whether new annotations are created when strokes end.
     */
    iOSDrawCreateMode?: PDFConfiguration.IOSDrawCreateMode;
    /**
     * If set to ```true```, you can group / ungroup annotations with the multi-select tool.
     */
    iOSAnnotationGroupingEnabled?: PDFConfiguration.BooleanType;
    /**
     * Enables natural drawing for ink annotations.
     */
    iOSNaturalDrawingAnnotationEnabled?: PDFConfiguration.BooleanType;
    /**
     * Enables natural drawing for signatures.
     */
    iOSNaturalSignatureDrawingEnabled?: PDFConfiguration.BooleanType;
    /**
     * Controls if a second tap to an annotation that allows inline editing enters edit mode.
     */
    iOSAnnotationEntersEditModeAfterSecondTapEnabled?: PDFConfiguration.BooleanType;
    /**
     * If set to ```true```, a long tap that ends on a page area that isn’t a text / image will show a new menu to create annotations.
     */
    iOSCreateAnnotationMenuEnabled?: PDFConfiguration.BooleanType;
    /**
     * Overlay annotations are faded in. Set the global duration for this fade here.
     */
    iOSAnnotationAnimationDuration?: number;
    /**
     * Describes the time limit for recording sound annotations, in seconds.
     */
    iOSSoundAnnotationTimeLimit?: number;
    /**
     * Controls how bookmarks are displayed and managed.
     */
    iOSBookmarkSortOrder?: PDFConfiguration.IOSBookmarkSortOrder;

    /**
     * Enable Instant comments.
     */
    enableInstantComments?: PDFConfiguration.BooleanType;
    /**
     * Listen for server changes automatically.
     */
    listenToServerChanges?: PDFConfiguration.BooleanType;
    /**
     * The delay before syncing with the Instant server.
     */
    delay?: number;
    /**
     * Indicates whether document annotations should be synced with the Instant server.
     */
    syncAnnotations?: PDFConfiguration.BooleanType;

    /**
     * The array of ```MeasurementValueConfiguration``` objects that should be applied to the document.
     */
    measurementValueConfigurations?: MeasurementValueConfiguration[];

    /**
     * The configuration when downloading a document from a remote URL.
     */
    remoteDocumentConfiguration?: RemoteDocumentConfiguration;

    /**
     * The signature creation modes that should be available in the signature picker.
     */
    signatureCreationModes?: PDFConfiguration.SignatureCreationModes[];

    /**
     * The signature color options that should be available in the signature picker, max of 3 colors are supported. If all 3 colors are not provided, defaults will be used in their place.
     */
    signatureColorOptions?: PDFConfiguration.SignatureColorOptions[];
}

export namespace PDFConfiguration {

   /**
    * A convenience type to select Boolean options.
    * @readonly
    * @enum {string} BooleanType
    */
    export const BooleanType = {
       /**
        * Set the value to ```true```.
        */
        TRUE: true,
       /**
        * Set the value to ```false```.
        */
        FALSE: false,
    } as const;

   /**
    * Configures the direction of page scrolling in the document view.
    * @readonly
    * @enum {string} ScrollDirection
    */
    export const ScrollDirection = {
       /**
        * Enable horizontal scrolling.
        */
        HORIZONTAL: 'horizontal',
       /**
        * Enable vertical scrolling.
        */
        VERTICAL: 'vertical'
    } as const;

   /**
    * Configures the page scrolling mode. Note that curl mode is only available for iOS and will be ignored on Android.
    * @readonly
    * @enum {string} PageTransition
    */
    export const PageTransition = {
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
    } as const;

   /**
    * The SignatureSavingStrategy options.
    * @readonly
    * @enum {string} SignatureSavingStrategy
    */
    export const SignatureSavingStrategy = {
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
    } as const;

   /**
    * The IOSDoubleTapAction options.
    * @readonly
    * @enum {string} IOSDoubleTapAction
    */
    export const IOSDoubleTapAction = {
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
    } as const;

   /**
    * The IOSTextSelectionMode options.
    * @readonly
    * @enum {string} IOSTextSelectionMode
    */
    export const IOSTextSelectionMode = {
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
    } as const;

   /**
    * The IOSTypesShowingColorPresets options.
    * @readonly
    * @enum {string} IOSTypesShowingColorPresets
    */
    export const IOSTypesShowingColorPresets = {
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
    } as const;

   /**
    * The PageMode options.
    * @readonly
    * @enum {string} PageMode
    */
    export const PageMode = {
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
    } as const;

   /**
    * The SpreadFitting options.
    * @readonly
    * @enum {string} SpreadFitting
    */
    export const SpreadFitting = {
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
    } as const;

   /**
    * The IOSRenderStatusViewPosition options.
    * @readonly
    * @enum {string} IOSRenderStatusViewPosition
    */
    export const IOSRenderStatusViewPosition = {
       /**
        * Display render status view at the top.
        */
        TOP: 'top',
       /**
        * Display render status view at the center.
        */
        CENTERED: 'centered'
    } as const;

   /**
    * The IOSAllowedAppearanceModes options.
    * @readonly
    * @enum {string} IOSAllowedAppearanceModes
    */
    export const IOSAllowedAppearanceModes = {
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
    } as const;

   /**
    * The UserInterfaceViewMode options.
    * @readonly
    * @enum {string} UserInterfaceViewMode
    */    
    export const UserInterfaceViewMode = {
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
    } as const;

   /**
    * The IOSSearchMode options.
    * @readonly
    * @enum {string} IOSSearchMode
    */     
    export const IOSSearchMode = {
       /**
        * Display search results in a modal view.
        */
        MODAL: 'modal',
       /**
        * Display search results inline.
        */
        INLINE: 'inline'
    } as const;

   /**
    * The IOSAllowedMenuActions options.
    * @readonly
    * @enum {string} IOSAllowedMenuActions
    */  
    export const IOSAllowedMenuActions = {
       /**
        * Allow no action.
        */
        NONE: 'none',
       /**
        * Allow searching the document with selected text.
        */
        SEARCH: 'search',
       /**
        * Allow presenting the definition for selected text.
        */
        DEFINE: 'define',
       /**
        * Allow searching Wikipedia with selected text.
        */
        WIKIPEDIA: 'wikipedia',
       /**
        * Allow accessibility text-to-speech.
        */
        SPEAK: 'speak',
       /**
        * Allow all actions.
        */
        ALL: 'all'
    } as const;

   /**
    * The IOSSettingsOptions options.
    * @readonly
    * @enum {string} IOSSettingsOptions
    */  
    export const IOSSettingsOptions = {
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
    } as const;

   /**
    * The ShowThumbnailBar options.
    * @readonly
    * @enum {string} ShowThumbnailBar
    */  
    export const ShowThumbnailBar = {
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
    } as const;

   /**
    * The IOSScrubberBarType options.
    * @readonly
    * @enum {string} IOSScrubberBarType
    */  
    export const IOSScrubberBarType = {
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
    } as const;

   /**
    * The IOSThumbnailGrouping options.
    * @readonly
    * @enum {string} IOSThumbnailGrouping
    */  
    export const IOSThumbnailGrouping = {
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
    } as const;
    
   /**
    * The EditableAnnotationTypes options.
    * @readonly
    * @enum {string} EditableAnnotationTypes
    */
    export const EditableAnnotationTypes = {
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
    } as const;

   /**
    * The IOSLinkAction options.
    * @readonly
    * @enum {string} IOSLinkAction
    */  
    export const IOSLinkAction = {
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
    } as const;

   /**
    * The IOSDrawCreateMode options.
    * @readonly
    * @enum {string} IOSDrawCreateMode
    */  
    export const IOSDrawCreateMode = {
       /**
        * Every stroke will result in a separate ink annotation.
        */
        SEPARATE: 'separate',
       /**
        * Strokes that have the same color/width are merged.
        */
        MERGE_IF_POSSIBLE: 'mergeIfPossible'
    } as const;

   /**
    * The IOSBookmarkSortOrder options.
    * @readonly
    * @enum {string} IOSBookmarkSortOrder
    */  
    export const IOSBookmarkSortOrder = {
       /**
        * Custom sort order, based on creation, but reorderable.
        */
        CUSTOM: 'custom',
       /**
        * Sort based on pages.
        */
        PAGE_BASED: 'pageBased'
    } as const;

    /**
     * The possible ways in which the user can input their signature.
     * @readonly
     * @enum {string} SignatureCreationModes
     */
    export const SignatureCreationModes = {
      /**
       * The user draws their signature. For example using a finger or stylus.
       */
      DRAW: 'draw',
      /**
       * The user selects an existing image of their signature from their photo library or files, or takes
       * a photo of their signature written on a piece of paper.
       */
      IMAGE: 'image',
      /**
       * The user types their name and selects a style for their signature from a small number of fonts.
       */
      TYPE: 'type'
    } as const;

    /**
     * Color defined by a hex string of RGB values.
     */
    export type HexColor = `#${string}`;

    /**
     * Color defined by RGB values.
     */
    export type RGBColor = `rgb(${number},${number},${number})`;
    
    export type BooleanType = ValueOf<typeof BooleanType>;
    export type ScrollDirection = ValueOf<typeof ScrollDirection>;
    export type PageTransition = ValueOf<typeof PageTransition>;
    export type SignatureSavingStrategy = ValueOf<typeof SignatureSavingStrategy>;
    export type IOSDoubleTapAction = ValueOf<typeof IOSDoubleTapAction>;
    export type IOSTextSelectionMode = ValueOf<typeof IOSTextSelectionMode>;
    export type IOSTypesShowingColorPresets = ValueOf<typeof IOSTypesShowingColorPresets>;
    export type PageMode = ValueOf<typeof PageMode>;
    export type SpreadFitting = ValueOf<typeof SpreadFitting>;
    export type IOSRenderStatusViewPosition = ValueOf<typeof IOSRenderStatusViewPosition>;
    export type IOSAllowedAppearanceModes = ValueOf<typeof IOSAllowedAppearanceModes>;
    export type UserInterfaceViewMode = ValueOf<typeof UserInterfaceViewMode>;
    export type IOSSearchMode = ValueOf<typeof IOSSearchMode>;
    export type IOSAllowedMenuActions = ValueOf<typeof IOSAllowedMenuActions>;
    export type IOSSettingsOptions = ValueOf<typeof IOSSettingsOptions>;
    export type ShowThumbnailBar = ValueOf<typeof ShowThumbnailBar>;
    export type IOSScrubberBarType = ValueOf<typeof IOSScrubberBarType>;
    export type IOSThumbnailGrouping = ValueOf<typeof IOSThumbnailGrouping>;
    export type EditableAnnotationTypes = ValueOf<typeof EditableAnnotationTypes>;
    export type IOSLinkAction = ValueOf<typeof IOSLinkAction>;
    export type IOSDrawCreateMode = ValueOf<typeof IOSDrawCreateMode>;
    export type IOSBookmarkSortOrder = ValueOf<typeof IOSBookmarkSortOrder>;
    export type SignatureCreationModes = ValueOf<typeof SignatureCreationModes>;
    export type SignatureColorOptions = HexColor | RGBColor | string;
}

/**
 * The configuration when downloading a document from a remote URL.
 */
export interface RemoteDocumentConfiguration {
    /**
     * The location where the downloaded document should be stored. If not set, the document will be stored in a temporary cache directory.
     */
    outputFilePath?: string;
    /**
     * Whether the document should be overwritten if it already exists at the specified location.
     */
    overwriteExisting?: boolean;
}

export type AnyCase<T extends string> =
string extends T ? string :
T extends `${infer F1}${infer F2}${infer R}` ? (
    `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
) :
T extends `${infer F}${infer R}` ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}` :
"";

type ValueOf<T> = T[keyof T];
