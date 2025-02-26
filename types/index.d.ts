export default PSPDFKitView;
/**
 * @typedef InstantDocumentData
 * @property { string } jwt The JWT received as part of the web response.
 * @property { string } serverUrl The server URL received as part of the web response.
 */
/**
 * @typedef InstantConfiguration
 * @property { boolean } enableInstantComments Specifies whether adding comment annotations is allowed.
 * @property { boolean } listenToServerChanges Automatically listen for and sync changes from the server.
 * @property { number } delay Delay in seconds before kicking off automatic sync after local changes are made to the ```editableDocument```’s annotations.
 * @property { boolean } syncAnnotations Specifies whether added annotations are automatically synced to the server.
 */
/**
 * @typedef PDFDocumentProperties
 * @property { number } pageCount The number of pages in the document.
 * @property { boolean } isEncrypted Indicates if the PDF document is encrypted (password protected).
 */
/**
 * PSPDFKit is a React Native {@link https://reactnative.dev/docs/native-modules-intro|Native Module} implementation used to call iOS and Android methods directly.
 * @hideconstructor
 * @example
 * const PSPDFKit = NativeModules.PSPDFKit;
 */
export class PSPDFKit {
    /**
     * Used to get the current version of the underlying PSPDFKit SDK.
     * @member versionString
     * @memberof PSPDFKit
     * @type { string }
     * @example
     * const version = PSPDFKit.versionString
     */
    versionString: string;
    /**
     * Used to get the document properties of the specified document.
     * @method getDocumentProperties
     * @memberof PSPDFKit
     * @param { string } documentPath The path to the document.
     * @returns { Promise<PDFDocumentProperties> } A promise returning the document properties.
     * @example
     * const properties = await PSPDFKit.getDocumentProperties('path/to/document.pdf');
     */
    getDocumentProperties: (documentPath: string) => Promise<PDFDocumentProperties>;
    /**
     * Used to set your PSPDFKit license key for the active platform only, either iOS or Android.
     * PSPDFKit is commercial software.
     * Each PSPDFKit license is bound to a specific app bundle ID.
     * Visit {@link https://my.nutrient.io} to get your demo or commercial license key.
     * @method setLicenseKey
     * @memberof PSPDFKit
     * @param { string | null } [key] Your PSPDFKit for React Native iOS or PSPDFKit for React Native Android license key.
     * @returns { Promise<boolean> } A promise returning ```true``` if the license key was set, and ```false``` if not.
     * @example
     * PSPDFKit.setLicenseKey('YOUR_LICENSE_KEY');
     */
    setLicenseKey: (key?: string | null) => Promise<boolean>;
    /**
     * Used to set the your PSPDFKit license keys for both platforms.
     * PSPDFKit is commercial software.
     * Each PSPDFKit license is bound to a specific app bundle ID.
     * Visit {@link https://my.nutrient.io} to get your demo or commercial license key.
     * @method setLicenseKeys
     * @memberof PSPDFKit
     * @param { string | null } [androidKey] Your PSPDFKit for React Native Android license key.
     * @param { string | null } [iosKey] Your PSPDFKit for React Native iOS license key.
     * @returns { Promise<boolean> } A promise returning ```true``` if the license keys were set, and ```false``` if not.
     * @example
     * PSPDFKit.setLicenseKeys('YOUR_ANDROID_LICENSE_KEY', 'YOUR_IOS_LICENSE_KEY');
     */
    setLicenseKeys: (androidKey?: string | null, iosKey?: string | null) => Promise<boolean>;
    /**
     * Used to present a PDF document.
     * @method present
     * @memberof PSPDFKit
     * @param { string } documentPath The path to the PDF document to be presented.
     * @param { PDFConfiguration } configuration Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options.
     * @returns { Promise<boolean> } A promise returning ```true``` if the document was successfully presented, and ```false``` if not.
     * @example
     * const fileName = 'document.pdf';
     * const exampleDocumentPath =
     * Platform.OS === 'ios' ? 'PDFs/' + fileName
     * : 'file:///android_asset/' + fileName;
     *
     * const configuration: PDFConfiguration = {
     *    pageMode: PDFConfiguration.PageMode.AUTOMATIC,
     *    scrollDirection: PDFConfiguration.ScrollDirection.HORIZONTAL,
     *    enableAnnotationEditing: PDFConfiguration.BooleanType.TRUE,
     *    pageTransition: PDFConfiguration.PageTransition.SCROLL_CONTINUOUS
     * };
     *
     * PSPDFKit.present(exampleDocumentPath, configuration);
     */
    present: (documentPath: string, configuration: PDFConfiguration) => Promise<boolean>;
    /**
     * Used to dismiss the ```PSPDFKitView```.
     * @method dismiss
     * @memberof PSPDFKit
     * @returns { Promise<boolean> } A promise returning ```true``` if the view was successfully dismissed, and ```false``` if not.
     * @example
     * PSPDFKit.dismiss();
     */
    dismiss: () => Promise<boolean>;
    /**
     * Used to set the current page of the document. Starts at 0.
     * @method setPageIndex
     * @memberof PSPDFKit
     * @param { number } pageIndex The page to transition to.
     * @param { boolean } animated ```true``` if the transition should be animated, and ```false``` otherwise.
     * @returns { Promise<boolean> } A promise returning ```true``` if the page was successfully set, and ```false``` if not.
     * @example
     * PSPDFKit.setPageIndex(3, false);
     */
    setPageIndex: (pageIndex: number, animated: boolean) => Promise<boolean>;
    /**
     * Used to create a new document with processed annotations, allowing a password to unlock the source document.
     * @method processAnnotations
     * @memberof PSPDFKit
     * @param { Annotation.Change } annotationChange Specifies how an annotation should be included in the resulting document. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.Change} for supported options.
     * @param { Array<Annotation.Type> } annotationTypes Specifies the annotation types that should be flattened. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.Type} for supported types. Use ```Annotation.Type.ALL``` to include all annotation types.
     * @param { string } sourceDocumentPath The source document to use as input.
     * @param { string } processedDocumentPath The path where the output document should be written to.
     * @param { string | null } [password] The password to unlock the source document, if required.
     * @returns { Promise<boolean> } A promise returning ```true``` if the document annotations were successfully flattened, and ```false``` if not.
     * @example
     * const result = await PSPDFKit.processAnnotations(
     *                      'flatten',
     *                      'all',
     *                      sourceDocumentPath,
     *                      processedDocumentPath,
     *                      password);
     */
    processAnnotations: (annotationChange: Annotation.Change, annotationTypes: Array<Annotation.Type>, sourceDocumentPath: string, processedDocumentPath: string, password?: string | null) => Promise<boolean>;
    /**
     * Used to present an Instant PDF document for collaboration.
     * @method presentInstant
     * @memberof PSPDFKit
     * @param { InstantDocumentData } documentData The Instant document data received entirely from the web response.
     * @param { PDFConfiguration } configuration Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options. Also see {@link InstantConfiguration} for additional Instant configuration options.
     * @returns { Promise<boolean> } A promise returning ```true``` if the document was successfully presented, and ```false``` if not.
     * @see {@link https://github.com/PSPDFKit/react-native/blob/5b2716a3f3cd3732c0e5845cc39e28d19b618aa4/samples/Catalog/examples/InstantSynchronization.js#L85C7-L85C7} for an example implementation.
     * @example
     * // Data received from your backend service.
     * const serverResult = await fetch('your-backend-server-url');
     * const documentData = {
     *     jwt: serverResult.jwt,
     *     serverUrl: Constants.InstantServerURL
     * };
     * const configuration: PDFConfiguration = {
     *    enableInstantComments: PDFConfiguration.BooleanType.FALSE,
     *    listenToServerChanges: PDFConfiguration.BooleanType.TRUE,
     *    delay: 1,
     *    syncAnnotations: PDFConfiguration.BooleanType.TRUE,
     * };
     *
     * PSPDFKit.presentInstant(documentData, configuration);
     */
    presentInstant: (documentData: InstantDocumentData, configuration: PDFConfiguration) => Promise<boolean>;
    /**
     * Delay in seconds before kicking off automatic sync after local changes are made to the ```editableDocument```’s annotations.
     * @method setDelayForSyncingLocalChanges
     * @memberof PSPDFKit
     * @param { number } delay The delay in seconds.
     */
    setDelayForSyncingLocalChanges: (delay: number) => void;
    /**
     * Automatically listen for and sync changes from the server.
     * @method setListenToServerChanges
     * @memberof PSPDFKit
     * @param { boolean } listenToServerChanges ```true``` if server changes should be synced automatically, and false ```false``` otherwise.
     */
    setListenToServerChanges: (listenToServerChanges: boolean) => void;
    /**
     * Method used by React Native Native Modules
     * @ignore
     */
    addListener: (eventName: any) => void;
    /**
     * Method used by React Native Native Modules
     * @ignore
     */
    removeListeners: () => void;
}
/**
 * @typedef BlankPDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { number } width The width of the new document.
 * @property { number } height The height of the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */
/**
 * @typedef PDFTemplatePageSize
 * @property { number } width The width of the page.
 * @property { number } height The height of the page.
 */
/**
 * @typedef PDFTemplatePageMargins
 * @property { number } top The top margin.
 * @property { number } left The left margin.
 * @property { number } right The right margin.
 * @property { number } bottom The bottom margin.
 */
/**
 * @typedef PDFTemplate
 * @property { PDFTemplatePageSize } pageSize The size of the page.
 * @property { string } [backgroundColor] The background color of the page. Can be either a rgba string, for example: rgba(0.871, 0.188, 0.643, 0.5), or standard colors such as ```blue``` or ```yellow```.
 * @property { string } [template] Which template to use. Options are: ```blank```, ```dot5mm```, ```grid5mm```, ```lines5mm``` and ```lines7mm```.
 * @property { number } [rotation] The page rotation, in degrees.
 * @property { PDFTemplatePageMargins } [pageMargins] The page margins.
 */
/**
 * @typedef TemplatePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFTemplate> } templates An array of the templates that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */
/**
 * @typedef PDFImage
 * @property { string } imageUri The URI to the image file.
 * @property { string } [position] The image position on the PDF page. Options are: ```top```, ```bottom```, ```left```, ```right```, ```center```.
 * @property { number } [rotation] The page rotation, in degrees.
 * @property { PDFTemplatePageMargins } [pageMargins] The page margins.
 */
/**
 * @typedef ImagePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFImage> } images An array of the images that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */
/**
 * @typedef PDFDocumentConfiguration
 * @property { string } documentPath The URI to the existing document.
 * @property { number } [pageIndex] The index of the page that should be used from the document. Starts at 0. If not specified, the entire document will be used.
 */
/**
 * @typedef DocumentPDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFDocumentConfiguration> } documents An array of the documents that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */
/**
 * @typedef GeneratePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */
/**
 * @typedef GeneratePDFResult
 * @property { string } fileURL The path on the filesystem where the new document is stored.
 */
/**
 * Processor is a React Native {@link https://reactnative.dev/docs/native-modules-intro|Native Module} implementation used to call iOS and Android methods directly.
 * @hideconstructor
 * @example
 * const Processor = NativeModules.RNProcessor;
 */
export class Processor {
    /**
     * Used to generate a new blank PDF document.
     * @method generateBlankPDF
     * @memberof Processor
     * @param { BlankPDFConfiguration } configuration The configuration to generate a new blank PDF document.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * const configuration = {
     *    name: 'newDocument.pdf',
     *    width: 595,
     *    height: 842,
     *    override: true,
     *  };
     * const { fileURL } = await Processor.generateBlankPDF(configuration);
     */
    generateBlankPDF: (configuration: BlankPDFConfiguration) => Promise<GeneratePDFResult>;
    /**
     * Used to generate a new PDF document from an HTML string.
     * @method generatePDFFromHtmlString
     * @memberof Processor
     * @param { GeneratePDFConfiguration } configuration The configuration to generate a new PDF document.
     * @param { string } html The HTML string from which the document should be generated.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * const fileName = 'newDocument.pdf';
     * const { tempDir } = await Processor.getTemporaryDirectory();
     * const documentPath = `${tempDir}/${fileName}`;
     *
     * const htmlString = `<html lang="en"><head></head><body><h1>PDF generated from HTML</h1></body></html>`;
     * const configuration = {
     *    filePath: documentPath,
     *    override: true,
     *  };
     * const { fileURL } = await Processor.generatePDFFromHtmlString(configuration, htmlString);
     */
    generatePDFFromHtmlString: (configuration: GeneratePDFConfiguration, html: string) => Promise<GeneratePDFResult>;
    /**
     * Used to generate a new PDF document from an HTML URL.
     * @method generatePDFFromHtmlURL
     * @memberof Processor
     * @param { GeneratePDFConfiguration } configuration The configuration to generate a new PDF document.
     * @param { string } url The origin URL from which the document should be generated.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * const fileName = 'newDocument.pdf';
     * const { tempDir } = await Processor.getTemporaryDirectory();
     * const documentPath = `${tempDir}/${fileName}`;
  
     * const url = `https://www.pspdfkit.com`;
     * const configuration = {
     *    documentPath: documentPath,
     *    override: true,
     *  };
     * const { fileURL } = await Processor.generatePDFFromHtmlURL(configuration, url);
     */
    generatePDFFromHtmlURL: (configuration: GeneratePDFConfiguration, url: string) => Promise<GeneratePDFResult>;
    /**
     * Used to generate a new PDF document from a template.
     * @method generatePDFFromTemplate
     * @memberof Processor
     * @param { TemplatePDFConfiguration } configuration The configuration to generate a new PDF document.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * const configuration = {
     *    filePath: fileURL,
     *    override: true,
     *     templates: [
     *       {
     *         pageSize: { width: 540, height: 846 },
     *         backgroundColor: 'rgba(0.871, 0.188, 0.643, 0.5)',
     *         template: 'lines7mm',
     *         rotation: 90,
     *         pageMargins: { top: 10, left: 10, right: 10, bottom: 10 },
     *       },
     *       {
     *         pageSize: { width: 540, height: 846 },
     *         backgroundColor: 'yellow',
     *         template: 'dot5mm',
     *       },
     *     ],
     *   };
     * const { fileURL } = await Processor.generatePDFFromTemplate(configuration);
     */
    generatePDFFromTemplate: (configuration: TemplatePDFConfiguration) => Promise<GeneratePDFResult>;
    /**
     * Used to generate a new PDF document from images.
     * @method generatePDFFromImages
     * @memberof Processor
     * @param { ImagePDFConfiguration } configuration The configuration to generate a new PDF document.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * export const exampleImage = 'PSPDFKit_Image_Example.jpg';
     * export const exampleImagePath =
     * Platform.OS === 'ios' ? 'PDFs/' + exampleImage : 'file:///android_asset/' + exampleImage;
     *
     * // Helper method to get iOS bundlePath
     * let globalPath = getMainBundlePath(exampleImagePath.toString());
     * const configuration = {
     *     name: 'newDocument.pdf',
     *     images: [
     *       {
     *         imageUri: Platform.OS === 'ios' ? globalPath : exampleImagePath,
     *         position: 'center',
     *       },
     *     ],
     *     override: true,
     *   };
     * const { fileURL } = await Processor.generatePDFFromImages(configuration);
     */
    generatePDFFromImages: (configuration: ImagePDFConfiguration) => Promise<GeneratePDFResult>;
    /**
     * Used to generate a new PDF document from existing PDF documents.
     * @method generatePDFFromDocuments
     * @memberof Processor
     * @param { DocumentPDFConfiguration } configuration The configuration to generate a new PDF document.
     * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
     * @example
     * const fileName = 'newDocument.pdf';
     * const { tempDir } = await Processor.getTemporaryDirectory();
     * const documentPath = `${tempDir}/${fileName}`;
     *
     * const exampleDocument = 'PSPDFKit_Image_Example.jpg';
     * const exampleDocumentPath =
     * Platform.OS === 'ios' ? 'PDFs/' + exampleImage : 'file:///android_asset/' + exampleDocument;
     *
     * // Helper method to get iOS bundlePath
     * let globalPath = getMainBundlePath(exampleDocumentPath.toString());
     *
     * const configuration = {
     *     filePath: documentPath,
     *     name: fileName,
     *     documents: [
     *       {
     *         documentPath:
     *           Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
     *         pageIndex: 5,
     *       },
     *       {
     *         documentPath:
     *           Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
     *         pageIndex: 8,
     *       },
     *     ],
     *     override: true,
     *   };
     * const { fileURL } = await Processor.generatePDFFromDocuments(configuration);
     */
    generatePDFFromDocuments: (configuration: DocumentPDFConfiguration) => Promise<GeneratePDFResult>;
    /**
     * A helper method to get a temporary directory where the document can be written to.
     * @method getTemporaryDirectory
     * @memberof Processor
     * @returns { Promise<any> } A promise containing the path to the temporary directory that can be used for output.
     * @example
     * const { fileURL } = await Processor.getTemporaryDirectory();
     */
    getTemporaryDirectory: () => Promise<any>;
}
export type Props = {
    /**
     * The path to the PDF file that should be displayed.
     */
    document: string;
    /**
     * Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options.
     */
    configuration?: PDFConfiguration;
    /**
     * Toolbar object to customize the toolbar appearance and behaviour.
     */
    toolbar?: Toolbar;
    /**
     * Object to customize the menu shown when selecting an annotation.
     */
    annotationContextualMenu?: AnnotationContextualMenu;
    /**
     * Page index of the document that will be shown. Starts at 0.
     */
    pageIndex?: number;
    /**
     * Controls whether a navigation bar is created and shown or not. Navigation bar is shown by default (```false```).
     */
    hideNavigationBar?: boolean;
    /**
     * Specifies whether the close button should be shown in the navigation bar. Disabled by default (```false```). Only applies when the ```PSPDFKitView``` is presented modally. Will call ```onCloseButtonPressed``` when tapped if a callback was provided. If ```onCloseButtonPressed``` wasn’t provided, ```PSPDFKitView``` will automatically be dismissed when modally presented.
     */
    showCloseButton?: boolean;
    /**
     * Controls whether or not the default action for tapped annotations is processed. Defaults to processing the action (```false```).
     */
    disableDefaultActionForTappedAnnotations?: boolean;
    /**
     * Controls whether or not the document will automatically be saved. Defaults to automatically saving (```false```).
     */
    disableAutomaticSaving?: boolean;
    /**
     * Controls the author name that’s set for new annotations. If not set and the user hasn’t specified it before, the user will be asked and the result will be saved. The value set here will be persisted and the user won’t be asked, even if this isn’t set the next time.
     */
    annotationAuthorName?: string;
    /**
     * Specifies what is written back to the original image URL when the receiver is saved. If this property is ```flattenAndEmbed```, then this allows for changes made to the image to be saved as metadata in the original file. If the same file is reopened, all previous changes made will remain editable. If this property is ```flatten```, the changes are simply written to the image, and will not be editable when reopened. Available options are: ```flatten``` or ```flattenAndEmbed```.
     */
    imageSaveMode?: string;
    /**
     * Callback that’s called when the user tapped the close button. If you provide this function, you need to handle dismissal yourself. If you don't provide this function, ```PSPDFKitView``` will be automatically dismissed. Only applies when the ```PSPDFKitView``` is presented modally.
     */
    onCloseButtonPressed?: Function;
    /**
     * Callback that’s called when the document is loaded in the ```PSPDFKitView```.
     */
    onDocumentLoaded?: Function;
    /**
     * Callback that’s called when the document failed to load.
     */
    onDocumentLoadFailed?: Function;
    /**
     * Callback that’s called when the document is saved.
     */
    onDocumentSaved?: Function;
    /**
     * Callback that’s called when the document fails to save.
     */
    onDocumentSaveFailed?: Function;
    /**
     * Callback that’s called when an annotation is tapped.
     */
    onAnnotationTapped?: Function;
    /**
     * Callback that’s called when an annotation is added, changed, or removed.
     */
    onAnnotationsChanged?: Function;
    /**
     * Callback that’s called when the state of the ```PSPDFKitView``` changes.
     */
    onStateChanged?: Function;
    /**
     * Callback that’s called when a custom toolbar button is tapped.
     */
    onCustomToolbarButtonTapped?: Function;
    /**
     * Callback that’s called when a custom annotation menu item is tapped.
     */
    onCustomAnnotationContextualMenuItemTapped?: Function;
    /**
     * The tag used to identify a single PdfFragment in the view hierarchy. This needs to be unique in the view hierarchy.
     */
    fragmentTag?: string;
    /**
     * Used to specify a custom grouping for the menu items in the annotation creation toolbar.
     */
    menuItemGrouping?: any[];
    /**
     * Sets the left bar button items. Note: The same button item cannot be added to both the left and right bar button items simultaneously. See {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
     */
    leftBarButtonItems?: Array<string>;
    /**
     * Sets the right bar button items. Note: The same button item cannot be added to both the left and right bar button items simultaneously. See {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
     */
    rightBarButtonItems?: Array<string>;
    /**
     * Used to specify a custom toolbar title on iOS by setting the ```title``` property of the ```PSPDFViewController```. Note: You need to set ```documentLabelEnabled```, ```useParentNavigationBar```, and ```allowToolbarTitleChange``` to ```false``` in your configuration before setting the custom title.
     */
    toolbarTitle?: string;
    /**
     * Used to customize the toolbar menu items for Android. See {@link https://github.com/PSPDFKit/react-native/blob/master/android/src/main/java/com/pspdfkit/react/ToolbarMenuItemsAdapter.java} for supported toolbar menu items.
     */
    toolbarMenuItems?: Array<string>;
    /**
     * When set to ```true```, the toolbar integrated into the ```PSPDFKitView``` will display a back button in the top-left corner.
     */
    showNavigationButtonInToolbar?: boolean;
    /**
     * If ```showNavigationButtonInToolbar``` is set to ```true```, this callback will notify you when the back button is tapped.
     */
    onNavigationButtonClicked?: Function;
    /**
     * Used to specify the available font names in the font picker. Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
     */
    availableFontNames?: Array<string>;
    /**
     * Used to specify the current selected font in the font picker. Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
     */
    selectedFontName?: string;
    /**
     * Used to show or hide the downloadable fonts section in the font picker. Defaults to ```true```, showing the downloadable fonts. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
     */
    showDownloadableFonts?: boolean;
    /**
     * The annotation preset configuration. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.AnnotationPresetConfiguration} for available options.
     */
    annotationPresets?: AnnotationPresetConfiguration;
    /**
     * Used to show or hide the main toolbar on Android.
     */
    hideDefaultToolbar?: boolean;
    /**
     * Used to style the React Native component.
     */
    style?: any;
};
export type InstantDocumentData = {
    /**
     * The JWT received as part of the web response.
     */
    jwt: string;
    /**
     * The server URL received as part of the web response.
     */
    serverUrl: string;
};
export type InstantConfiguration = {
    /**
     * Specifies whether adding comment annotations is allowed.
     */
    enableInstantComments: boolean;
    /**
     * Automatically listen for and sync changes from the server.
     */
    listenToServerChanges: boolean;
    /**
     * Delay in seconds before kicking off automatic sync after local changes are made to the ```editableDocument```’s annotations.
     */
    delay: number;
    /**
     * Specifies whether added annotations are automatically synced to the server.
     */
    syncAnnotations: boolean;
};
export type PDFDocumentProperties = {
    /**
     * The number of pages in the document.
     */
    pageCount: number;
    /**
     * Indicates if the PDF document is encrypted (password protected).
     */
    isEncrypted: boolean;
};
export type BlankPDFConfiguration = {
    /**
     * The name of the new document.
     */
    name?: string;
    /**
     * The directory where the new document should be stored.
     */
    filePath?: string;
    /**
     * The width of the new document.
     */
    width: number;
    /**
     * The height of the new document.
     */
    height: number;
    /**
     * If ```true```, will override existing document with the same name.
     */
    override: boolean;
};
export type PDFTemplatePageSize = {
    /**
     * The width of the page.
     */
    width: number;
    /**
     * The height of the page.
     */
    height: number;
};
export type PDFTemplatePageMargins = {
    /**
     * The top margin.
     */
    top: number;
    /**
     * The left margin.
     */
    left: number;
    /**
     * The right margin.
     */
    right: number;
    /**
     * The bottom margin.
     */
    bottom: number;
};
export type PDFTemplate = {
    /**
     * The size of the page.
     */
    pageSize: PDFTemplatePageSize;
    /**
     * The background color of the page. Can be either a rgba string, for example: rgba(0.871, 0.188, 0.643, 0.5), or standard colors such as ```blue``` or ```yellow```.
     */
    backgroundColor?: string;
    /**
     * Which template to use. Options are: ```blank```, ```dot5mm```, ```grid5mm```, ```lines5mm``` and ```lines7mm```.
     */
    template?: string;
    /**
     * The page rotation, in degrees.
     */
    rotation?: number;
    /**
     * The page margins.
     */
    pageMargins?: PDFTemplatePageMargins;
};
export type TemplatePDFConfiguration = {
    /**
     * The name of the new document.
     */
    name?: string;
    /**
     * The directory where the new document should be stored.
     */
    filePath?: string;
    /**
     * An array of the templates that should be used to construct the new document.
     */
    templates: Array<PDFTemplate>;
    /**
     * If ```true```, will override existing document with the same name.
     */
    override: boolean;
};
export type PDFImage = {
    /**
     * The URI to the image file.
     */
    imageUri: string;
    /**
     * The image position on the PDF page. Options are: ```top```, ```bottom```, ```left```, ```right```, ```center```.
     */
    position?: string;
    /**
     * The page rotation, in degrees.
     */
    rotation?: number;
    /**
     * The page margins.
     */
    pageMargins?: PDFTemplatePageMargins;
};
export type ImagePDFConfiguration = {
    /**
     * The name of the new document.
     */
    name?: string;
    /**
     * The directory where the new document should be stored.
     */
    filePath?: string;
    /**
     * An array of the images that should be used to construct the new document.
     */
    images: Array<PDFImage>;
    /**
     * If ```true```, will override existing document with the same name.
     */
    override: boolean;
};
export type PDFDocumentConfiguration = {
    /**
     * The URI to the existing document.
     */
    documentPath: string;
    /**
     * The index of the page that should be used from the document. Starts at 0. If not specified, the entire document will be used.
     */
    pageIndex?: number;
};
export type DocumentPDFConfiguration = {
    /**
     * The name of the new document.
     */
    name?: string;
    /**
     * The directory where the new document should be stored.
     */
    filePath?: string;
    /**
     * An array of the documents that should be used to construct the new document.
     */
    documents: Array<PDFDocumentConfiguration>;
    /**
     * If ```true```, will override existing document with the same name.
     */
    override: boolean;
};
export type GeneratePDFConfiguration = {
    /**
     * The name of the new document.
     */
    name?: string;
    /**
     * The directory where the new document should be stored.
     */
    filePath?: string;
    /**
     * If ```true```, will override existing document with the same name.
     */
    override: boolean;
};
export type GeneratePDFResult = {
    /**
     * The path on the filesystem where the new document is stored.
     */
    fileURL: string;
};
/**
 * PSPDFKitView is a React Native component used to view PDF documents on iOS and Android.
 * @augments {React.Component<Props, *>}
 * @hideconstructor
 * @example
 * <PSPDFKitView
 *      document={DOCUMENT_PATH}
 *      configuration={{
 *        showThumbnailBar: PDFConfiguration.ShowThumbnailBar.SCROLLABLE,
 *        pageTransition: PDFConfiguration.PageTransition.SCROLL_CONTINUOUS,
 *        scrollDirection: PDFConfiguration.ScrollDirection.VERTICAL,
 *      }}
 *      ref={this.pdfRef}
 *      fragmentTag="PDF1"
 *      style={{ flex: 1 }}
 *    />
 */
declare class PSPDFKitView extends React.Component<Props, any, any> {
    constructor(props: Props);
    constructor(props: Props, context: any);
    /**
     * @ignore
     */
    _nextRequestId: number;
    /**
     * @ignore
     */
    _requestMap: Map<any, any>;
    /**
     * @ignore
     */
    _pdfDocument: any;
    /**
     * @ignore
     */
    _notificationCenter: any;
    /**
     * @ignore
     */
    _componentRef: React.RefObject<any>;
    render(): React.JSX.Element;
    /**
     * @ignore
     */
    _onStateChanged: (event: any) => void;
    /**
     * @ignore
     */
    _onDocumentLoaded: (event: any) => void;
    /**
     * @ignore
     */
    _onDocumentSaved: (event: any) => void;
    /**
     * @ignore
     */
    _onDocumentSaveFailed: (event: any) => void;
    /**
     * @ignore
     */
    _onDocumentLoadFailed: (event: any) => void;
    /**
     * @ignore
     */
    _onAnnotationTapped: (event: any) => void;
    /**
     * @ignore
     */
    _onAnnotationsChanged: (event: any) => void;
    /**
     * @ignore
     */
    _onNavigationButtonClicked: (event: any) => void;
    /**
     * @ignore
     */
    _onDataReturned: (event: any) => void;
    /**
     * @ignore
     */
    _onCustomToolbarButtonTapped: (event: any) => void;
    /**
     * @ignore
     */
    _onCustomAnnotationContextualMenuItemTapped: (event: any) => void;
    /**
     * Enters annotation creation mode, showing the annotation creation toolbar.
     * @method enterAnnotationCreationMode
     * @param { Annotation.Type } [annotationType] The annotation type that should be pre-selected when entering annotation creation mode.
     * @example
     * this.pdfRef.current.enterAnnotationCreationMode();
     * @memberof PSPDFKitView
     */
    enterAnnotationCreationMode: (annotationType?: Annotation.Type) => any;
    /**
     * Exits the currently active mode, hiding all toolbars.
     * @method exitCurrentlyActiveMode
     * @example
     * this.pdfRef.current.exitCurrentlyActiveMode();
     * @memberof PSPDFKitView
     */
    exitCurrentlyActiveMode: () => any;
    /**
     * Saves the document that’s currently open.
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().save()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.save|save()}.
     * @method saveCurrentDocument
     * @memberof PSPDFKitView
     * @example
     * const result = await this.pdfRef.current.saveCurrentDocument();
     *
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the document was saved, and ```false``` if not.
     */
    saveCurrentDocument: () => Promise<boolean>;
    /**
     * Get the current PDF document.
     * @method getDocument
     * @example
     * const document = this.pdfRef.current?.getDocument();
     * @see {@link https://pspdfkit.com/api/react-native/PDFDocument.html} for available methods.
     * @memberof PSPDFKitView
     * @returns { PDFDocument } A reference to the document that is currently loaded in the PSPDFKitView component.
     */
    getDocument(): PDFDocument;
    /**
     * Get the current Notification Center.
     * @method getNotificationCenter
     * @example
     * const document = this.pdfRef.current?.getNotificationCenter();
     * @see {@link https://pspdfkit.com/api/react-native/NotificationCenter.html} for available methods.
     * @memberof PSPDFKitView
     * @returns { NotificationCenter } A reference to the Notification Center that can be used to subscribe and unsubscribe from events.
     */
    getNotificationCenter(): NotificationCenter;
    /**
     * @method clearSelectedAnnotations
     * @memberof PSPDFKitView
     * @description Clears all currently selected Annotations.
     * @example
     * const result = await this.pdfRef.current?.clearSelectedAnnotations();
     * @returns { Promise<any> } A promise containing the result of the operation. ```true``` if the annotations selection were cleared, ```false``` otherwise.
     */
    clearSelectedAnnotations: () => Promise<any>;
    /**
     * @method selectAnnotations
     * @memberof PSPDFKitView
     * @param { object } annotations An array of the annotations to select in Instant JSON format.
     * @param { boolean } [showContextualMenu] Whether the annotation contextual menu should be shown after selection.
     * @description Select one or more annotations.
     * @example
     * const result = await this.pdfRef.current?.selectAnnotations(annotations);
     * @returns { Promise<any> } A promise containing the result of the operation. ```true``` if the annotations were selected, ```false``` otherwise.
     */
    selectAnnotations: (annotations: object, showContextualMenu?: boolean) => Promise<any>;
    /**
     * Gets all annotations of the given type from the specified page.
     *
     * @method getAnnotations
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().getAnnotations()``` or ```getAnnotationsForPage()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotations|getAnnotations()} and {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotationsForPage|getAnnotationsForPage()}.
     * @memberof PSPDFKitView
     * @param { number } pageIndex The page index to get the annotations for, starting at 0.
     * @param { string } [type] The type of annotations to get. If not specified or ```null```, all annotation types will be returned.
     * @example
     * const result = await this.pdfRef.current.getAnnotations(3, 'pspdfkit/ink');
     * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for supported types.
     *
     * @returns { Promise } A promise containing an object with an array of InstantJSON objects.
     */
    getAnnotations: (pageIndex: number, type?: string) => Promise<any>;
    /**
     * Adds a new annotation to the current document.
     *
     * @method addAnnotation
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().addAnnotations()``` instead.
     * @memberof PSPDFKitView
     * @param { object } annotation The InstantJSON of the annotation to add.
     * @example
     * const result = await this.pdfRef.current.addAnnotation(annotationJSON);
     * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for document JSON structure.
     *
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotation was added successfully, and ```false``` if an error occurred.
     */
    addAnnotation: (annotation: object) => Promise<boolean>;
    /**
     * Removes an existing annotation from the current document.
     *
     * @method removeAnnotation
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().removeAnnotations()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.removeAnnotations|removeAnnotations()}.
     * @memberof PSPDFKitView
     * @param { object } annotation The InstantJSON of the annotation to remove.
     * @example
     * const result = await this.pdfRef.current.removeAnnotation(instantJSON);
     *
     * @returns { Promise } A promise resolving to ```true``` if the annotation was removed successfully, and ```false``` if the annotation couldn’t be found or an error occurred.
     */
    removeAnnotation: (annotation: object) => Promise<any>;
    /**
     * Removes the supplied document InstantJSON from the current document.
     *
     * @method removeAnnotations
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().removeAnnotations()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.removeAnnotations|removeAnnotations()}.
     * @memberof PSPDFKitView
     * @param { object } annotation The InstantJSON of the annotations to remove.
     * @example
     * const result = await this.pdfRef.current.removeAnnotations(instantJSON);
     *
     * @returns { Promise } A promise resolving to ```true``` if the annotations were removed successfully, and ```false``` if the annotations couldn’t be found or an error occurred.
     */
    removeAnnotations: (annotations: any) => Promise<any>;
    /**
     * Gets all unsaved changes to annotations.
     *
     * @method getAllUnsavedAnnotations
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().getAllUnsavedAnnotations()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAllUnsavedAnnotations|getAllUnsavedAnnotations()}.
     * @memberof PSPDFKitView
     * @returns { Promise } A promise containing document InstantJSON.
     * @see {@link https://pspdfkit.com/guides/android/current/importing-exporting/instant-json/#instant-document-json-api-a56628} for more information.
     */
    getAllUnsavedAnnotations: () => Promise<any>;
    /**
     * Gets all annotations of the given type.
     *
     * @method getAllAnnotations
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().getAnnotations()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotations|getAnnotations()}.
     * @memberof PSPDFKitView
     * @param { string } [type] The type of annotations to get. If not specified or ```null```, all annotation types will be returned.
     * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for supported types.
     * @example
     * const result = await this.pdfRef.current.getAllAnnotations('all');
     * // result: {'annotations' : [instantJson]}
     *
     * @returns { Promise } A promise containing an object with an array of InstantJSON objects.
     */
    getAllAnnotations: (type?: string) => Promise<any>;
    /**
     * Applies the supplied document InstantJSON to the current document.
     *
     * @method addAnnotations
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().addAnnotations()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.addAnnotations|addAnnotations()}.
     * @memberof PSPDFKitView
     * @param { object } annotations The document InstantJSON to apply to the current document.
     * @example
     * const result = await this.pdfRef.current.addAnnotations(annotationsJSON);
     * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for document JSON structure.
     *
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotations were added successfully, and ```false``` if an error occurred.
     */
    addAnnotations: (annotations: object) => Promise<boolean>;
    /**
     * Sets the flags of the specified annotation.
     *
     * @method setAnnotationFlags
     * @memberof PSPDFKitView
     * @param { string } uuid The UUID of the annotation to update.
     * @param { Annotation.Flags[] } flags The flags to apply to the annotation.
     * @example
     * const result = await this.pdfRef.current.setAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a', ['locked', 'hidden']);
     *
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotations were added successfully, and ```false``` if an error occurred.
     */
    setAnnotationFlags: (uuid: string, flags: Annotation.Flags[]) => Promise<boolean>;
    /**
     * Gets the flags for the specified annotation.
     *
     * @method getAnnotationFlags
     * @memberof PSPDFKitView
     * @param { string } uuid The UUID of the annotation to query.
     * @example
     * const flags = await this.pdfRef.current.getAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a');
     *
     * @returns { Promise<Annotation.Flags[]> } A promise containing the flags of the specified annotation.
     */
    getAnnotationFlags: (uuid: string) => Promise<Annotation.Flags[]>;
    /**
     * Imports the supplied XFDF file into the current document.
     *
     * @method importXFDF
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().importXFDF()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.importXFDF|importXFDF()}.
     * @memberof PSPDFKitView
     * @param { string } filePath The path to the XFDF file to import.
     * @example
     * const result = await this.pdfRef.current.importXFDF('path/to/XFDF.xfdf');
     *
     * @returns { Promise<any> } A promise containing an object with the result. ```true``` if the xfdf file was imported successfully, and ```false``` if an error occurred.
     */
    importXFDF: (filePath: string) => Promise<any>;
    /**
     * Exports the annotations from the current document to a XFDF file.
     *
     * @method exportXFDF
     * @deprecated Since Nutrient React Native SDK 2.12. Use ```this.pdfRef.current?.getDocument().exportXFDF()``` instead.
     * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.exportXFDF|exportXFDF()}.
     * @memberof PSPDFKitView
     * @param { string } filePath The path where the XFDF file should be exported to.
     * @example
     * const result = await this.pdfRef.current.exportXFDF('path/to/XFDF.xfdf');
     *
     * @returns { Promise<any> } A promise containing an object with the exported file path and result. ```true``` if the xfdf file was exported successfully, and ```false``` if an error occurred.
     */
    exportXFDF: (filePath: string) => Promise<any>;
    /**
     * @typedef FormFieldResult
     * @property { string } [formElement] The form field value
     * @property { string } [error] The error description
     */
    /**
     * Gets the form field value of the supplied form field name.
     *
     * @method getFormFieldValue
     * @memberof PSPDFKitView
     * @param { string } fullyQualifiedName The fully qualified name of the form element.
     * @example
     * const result = await this.pdfRef.current.getFormFieldValue('myFormElement');
     * // result: {'myFormElement' : value}
     * // or
     * // {'error' : 'Failed to get the form field value.'}
     *
     * @returns { Promise<FormFieldResult> } A promise containing an object with the value, or an error if the form field could not be found.
     */
    getFormFieldValue: (fullyQualifiedName: string) => Promise<{
        /**
         * The form field value
         */
        formElement?: string;
        /**
         * The error description
         */
        error?: string;
    }>;
    /**
     * Sets the form field value of the supplied form field name.
     *
     * @method setFormFieldValue
     * @memberof PSPDFKitView
     * @param { string } fullyQualifiedName The fully qualified name of the form element. When using form elements such as radio buttons, the individual elements can be accessed by appending the index to the fully qualified name, for example ```choiceElement.0``` and ```choiceElement.1```.
     * @param { string } value The new string value of the form element. For button form elements, pass ```selected``` or ```deselected```. For choice form elements, pass the index of the choice to select, for example ```1```.
     * @example
     * const result = await this.pdfRef.current.setFormFieldValue('Name_Last', 'Appleseed');
     *
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the value was set successfully, and ```false``` if an error occurred.
     */
    setFormFieldValue: (fullyQualifiedName: string, value: string) => Promise<boolean>;
    /**
     * Sets the left bar button items for the specified view mode.
     * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
     *
     * @method setLeftBarButtonItems
     * @memberof PSPDFKitView
     * @param { Array<string> } items The list of bar button items.
     * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
     * @param { string } [viewMode] The view mode for which the bar buttons should be set. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for all the view modes are set.
     * @param { boolean } [animated] Specifies whether changing the bar buttons should be animated.
     * @example
     * const result = await this.pdfRef.current.setLeftBarButtonItems(
     *    ['searchButtonItem', 'thumbnailsButtonItem'],
     *    'document',
     *    true);
     *
     */
    setLeftBarButtonItems: (items: Array<string>, viewMode?: string, animated?: boolean) => void;
    /**
     * Gets the left bar button items for the specified view mode.
     *
     * @method getLeftBarButtonItemsForViewMode
     * @memberof PSPDFKitView
     * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for the current view mode are returned.
     *
     * @returns { Promise<Array<string>> } A promise containing an array of bar button items, or an error if the items couldn’t be retrieved.
     * @example
     * const leftBarButtonItems = await this.pdfRef.current.getLeftBarButtonItemsForViewMode('document');
     * // leftBarButtonItems: ['outlineButtonItem', 'searchButtonItem']
     * // or
     * // {'error' : 'Failed to get the left bar button items.'}
     *
     */
    getLeftBarButtonItemsForViewMode: (viewMode?: string) => Promise<Array<string>>;
    /**
     * Sets the right bar button items for the specified view mode.
     * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
     *
     * @method setRightBarButtonItems
     * @memberof PSPDFKitView
     * @param { Array<string> } items The list of bar button items.
     * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
     * @param { string } [viewMode] The view mode for which the bar buttons should be set. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for all the view modes are set.
     * @param { boolean } [animated] Specifies whether changing the bar buttons should be animated.
     * @example
     * const result = await this.pdfRef.current.setRightBarButtonItems(
     *    ['searchButtonItem', 'thumbnailsButtonItem'],
     *    'document',
     *    true);
     *
     */
    setRightBarButtonItems: (items: Array<string>, viewMode?: string, animated?: boolean) => void;
    /**
     * Gets the right bar button items for the specified view mode.
     *
     * @method getRightBarButtonItemsForViewMode
     * @memberof PSPDFKitView
     * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for the current view mode are returned.
     *
     * @returns { Promise<Array<string>> } A promise containing an array of bar button items, or an error if the items couldn’t be retrieved.
     * @example
     * const rightBarButtonItems = await this.pdfRef.current.getRightBarButtonItemsForViewMode('document');
     * // rightBarButtonItems: ['outlineButtonItem', 'searchButtonItem']
     * // or
     * // {'error' : 'Failed to get the right bar button items.'}
     *
     */
    getRightBarButtonItemsForViewMode: (viewMode?: string) => Promise<Array<string>>;
    /**
     * Sets the Toolbar object to customize the toolbar appearance and behaviour.
     *
     * @method setToolbar
     * @memberof PSPDFKitView
     * @param { Toolbar } toolbar The toolbar object.
     * @example
     * const toolbar = {
     *		// iOS
     *		rightBarButtonItems: {
     *		  viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
     *		  animated: true,
     *		  buttons: ['searchButtonItem', 'readerViewButtonItem']
     *		},
     *		// Android
     *		toolbarMenuItems: {
     *		  buttons: ['searchButtonItem', 'readerViewButtonItem']
     *	  },
     *	}
     *	this.pdfRef.current.setToolbar(toolbar);
     *
     */
    setToolbar: (toolbar: Toolbar) => void;
    /**
     * Gets the toolbar for the specified view mode.
     *
     * @method getToolbar
     * @memberof PSPDFKitView
     * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the toolbar buttons for the current view mode are returned.
     *
     * @returns { Promise<Array<string>> } A promise containing the toolbar object, or an error if it couldn’t be retrieved.
     * @example
     * const toolbar = await this.pdfRef.current.getToolbar('document');
     *
     */
    getToolbar: (viewMode?: string) => Promise<Array<string>>;
    /**
     * Sets the measurement value configurations for the ```PSPDFKitView```.
     *
     * @method setMeasurementValueConfigurations
     * @memberof PSPDFKitView
     * @param { MeasurementValueConfiguration[] } configurations The array of ```MeasurementValueConfiguration``` objects that should be applied to the document.
     * @example
     * const scale: MeasurementScale = {
     *    unitFrom: Measurements.ScaleUnitFrom.INCH,
     *    valueFrom: 1.0,
     *    unitTo: Measurements.ScaleUnitTo.INCH,
     *    valueTo: 2.54
     *  };
     *
     *  const measurementValueConfig: MeasurementValueConfiguration = {
     *    name: 'Custom Scale',
     *    scale: scale,
     *    precision: Measurements.Precision.FOUR_DP
     *  };
     *
     *  const configs = [measurementValueConfig];
     *  await this.pdfRef.current?.setMeasurementValueConfigurations(configs);
     */
    setMeasurementValueConfigurations: (configurations: MeasurementValueConfiguration[]) => Promise<any>;
    /**
     * Gets the current PSPDFKitView MeasurementValueConfigurations.
     *
     * @method getMeasurementValueConfigurations
     * @memberof PSPDFKitView
     *
     * @returns { Promise<MeasurementValueConfiguration[]> } A promise containing an array of ```MeasurementValueConfiguration``` objects.
     * @example
     * const configurations = await this.pdfRef.current.getMeasurementValueConfigurations();
     */
    getMeasurementValueConfigurations: () => Promise<MeasurementValueConfiguration[]>;
    /**
     * Customizes the visible toolbar menu items for Android.
     *
     * @method setToolbarMenuItems
     * @memberof PSPDFKitView
     * @param { Array<string> } toolbarMenuItems The list of bar button items.
     * @see {@link https://pspdfkit.com/guides/react-native/user-interface/toolbars/main-toolbar/} for supported button items.
     * @example
     * const result = await this.pdfRef.current.setToolbarMenuItems(['searchButtonItem', 'readerViewButtonItem']);
     *
     */
    setToolbarMenuItems: (toolbarMenuItems: Array<string>) => void;
    /**
     * Gets the current PSPDFKitView configuration.
     *
     * @method getConfiguration
     * @memberof PSPDFKitView
     *
     * @returns { Promise<PDFConfiguration> } A promise containing a ```PDFConfiguration``` object with the document configuration.
     * @example
     * const configuration = await this.pdfRef.current.getConfiguration();
     */
    getConfiguration: () => Promise<PDFConfiguration>;
    /**
     * Removes the currently displayed Android Native ```PdfUiFragment```.
     * This function should only be used as a workaround for a bug in ```react-native-screen``` that causes a crash when
     * ```navigation.goBack()``` is called or a hardware back button is used to navigate back on Android. Calling this
     * function will prevent the crash by removing the fragment from the ```PdfView``` before the navigation takes place.
     *
     * @method destroyView
     * @memberof PSPDFKitView
     *
     */
    destroyView: () => void;
    _getViewManagerConfig: (viewManagerName: any) => any;
}
declare namespace PSPDFKitView {
    namespace propTypes {
        let document: string;
        let configuration: PDFConfiguration;
        let toolbar: Toolbar;
        let annotationContextualMenu: AnnotationContextualMenu;
        let pageIndex: number;
        let hideNavigationBar: boolean;
        let showCloseButton: boolean;
        let disableDefaultActionForTappedAnnotations: boolean;
        let disableAutomaticSaving: boolean;
        let annotationAuthorName: string;
        let imageSaveMode: string;
        let onCloseButtonPressed: Function;
        let onDocumentLoaded: Function;
        let onDocumentLoadFailed: Function;
        let onDocumentSaved: Function;
        let onDocumentSaveFailed: Function;
        let onAnnotationTapped: Function;
        let onAnnotationsChanged: Function;
        let onStateChanged: Function;
        let onCustomToolbarButtonTapped: Function;
        let onCustomAnnotationContextualMenuItemTapped: Function;
        let fragmentTag: string;
        let menuItemGrouping: any[];
        let leftBarButtonItems: Array<string>;
        let rightBarButtonItems: Array<string>;
        let toolbarTitle: string;
        let toolbarMenuItems: Array<string>;
        let showNavigationButtonInToolbar: boolean;
        let onNavigationButtonClicked: Function;
        let availableFontNames: Array<string>;
        let selectedFontName: string;
        let showDownloadableFonts: boolean;
        let style: any;
        let annotationPresets: AnnotationPresetConfiguration;
        let hideDefaultToolbar: boolean;
    }
}
import * as React from 'react';
//# sourceMappingURL=index.d.ts.map

//@ts-ignore
declare module 'react-native' {
  export interface NativeModulesStatic {
      //@ts-ignore
      RNProcessor: Processor;
      //@ts-ignore
      PSPDFKit: PSPDFKit;
   }
}
//@ts-ignore
import config = require('../src/configuration/PDFConfiguration');
export import PDFConfiguration = config.PDFConfiguration;
export import RemoteDocumentConfiguration = config.RemoteDocumentConfiguration;
//@ts-ignore
import toolbar = require('../src/toolbar/Toolbar');
export import Toolbar = toolbar.Toolbar;
//@ts-ignore
import measurements = require('../src/measurements/Measurements');
export import Measurements = measurements.Measurements;
export import MeasurementScale = measurements.MeasurementScale;
export import MeasurementValueConfiguration = measurements.MeasurementValueConfiguration;
//@ts-ignore
import annotation = require('../src/annotations/Annotation');
export import Annotation = annotation.Annotation;
export import AnnotationContextualMenu = annotation.AnnotationContextualMenu;
export import AnnotationContextualMenuItem = annotation.AnnotationContextualMenuItem;
export import AnnotationPresetConfiguration = annotation.AnnotationPresetConfiguration;

export import AnnotationPresetInk = annotation.AnnotationPresetInk
export import AnnotationPresetFreeText = annotation.AnnotationPresetInk
export import AnnotationPresetStamp = annotation.AnnotationPresetStamp
export import AnnotationPresetNote = annotation.AnnotationPresetNote
export import AnnotationPresetMarkup = annotation.AnnotationPresetMarkup
export import AnnotationPresetShape = annotation.AnnotationPresetShape
export import AnnotationPresetLine = annotation.AnnotationPresetLine
export import AnnotationPresetEraser = annotation.AnnotationPresetEraser
export import AnnotationPresetFile = annotation.AnnotationPresetFile
export import AnnotationPresetSound = annotation.AnnotationPresetSound
export import AnnotationPresetRedact = annotation.AnnotationPresetRedact
export import AnnotationPresetMeasurementArea = annotation.AnnotationPresetMeasurementArea
export import AnnotationPresetMeasurementPerimeter = annotation.AnnotationPresetMeasurementPerimeter
export import AnnotationPresetMeasurementDistance = annotation.AnnotationPresetMeasurementDistance

//@ts-ignore
import document = require('../src/document/PDFDocument');
export import PDFDocument = document.PDFDocument;

//@ts-ignore
import notificationCenter = require('../src/notification-center/NotificationCenter');
export import NotificationCenter = notificationCenter.NotificationCenter;

//@ts-ignore
import annotationModels = require('../src/annotations/AnnotationModels');
export import AnnotationType = annotationModels.AnnotationType;
export import DocumentJSON = annotationModels.DocumentJSON;
export import AnnotationAttachment = annotationModels.AnnotationAttachment;
export import BaseAnnotation = annotationModels.BaseAnnotation;
export import CommentMarkerAnnotation = annotationModels.CommentMarkerAnnotation;
export import EllipseShapeAnnotation = annotationModels.EllipseShapeAnnotation;
export import HighlightMarkupAnnotation = annotationModels.HighlightMarkupAnnotation;
export import ImageAnnotation = annotationModels.ImageAnnotation;
export import InkAnnotation = annotationModels.InkAnnotation;
export import LineShapeAnnotation = annotationModels.LineShapeAnnotation;
export import LinkAnnotation = annotationModels.LinkAnnotation;
export import MarkupAnnotation = annotationModels.MarkupAnnotation;
export import MediaAnnotation = annotationModels.MediaAnnotation;
export import NoteAnnotation = annotationModels.NoteAnnotation;
export import PolygonShapeAnnotation = annotationModels.PolygonShapeAnnotation;
export import PolylineShapeAnnotation = annotationModels.PolylineShapeAnnotation;
export import RectangleShapeAnnotation = annotationModels.RectangleShapeAnnotation;
export import RedactionMarkupAnnotation = annotationModels.RedactionMarkupAnnotation;
export import ShapeAnnotation = annotationModels.ShapeAnnotation;
export import SquigglyMarkupAnnotation = annotationModels.SquigglyMarkupAnnotation;
export import StampAnnotation = annotationModels.StampAnnotation;
export import StrikeOutMarkupAnnotation = annotationModels.StrikeOutMarkupAnnotation;
export import TextAnnotation = annotationModels.TextAnnotation;
export import UnderlineMarkupAnnotation = annotationModels.UnderlineMarkupAnnotation;
export import WidgetAnnotation = annotationModels.WidgetAnnotation;