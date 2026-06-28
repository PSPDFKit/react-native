// @ts-ignore
import type { ViewProps, Int32, Double } from 'react-native';
// @ts-ignore
import type { BubblingEventHandler, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
// @ts-ignore
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
// @ts-ignore
import type { HostComponent } from 'react-native';

// NOTE: Codegen cannot import types from other files yet. Types duplicated from NutrientViewNativeComponent.ts.
// NutrientInstantView supports the same props. documentInfo must be an Instant document descriptor
// containing a serverUrl and jwt, as returned by the Instant backend.
// Some APIs may be omitted on native if not supported by Instant.

// Remote document configuration interface
export interface RemoteDocumentConfiguration {
  outputFilePath?: string;
  overwriteExisting?: boolean;
}

// Measurement value configuration interface
export interface MeasurementValueConfiguration {
  name: string;
  scale: {
    unitFrom: string;
    valueFrom: Double;
    unitTo: string;
    valueTo: Double;
  };
  precision: string;
}

// Duplicated types from PDFConfiguration.ts
export interface PDFConfiguration {
  scrollDirection?: WithDefault<'horizontal' | 'vertical', 'vertical'>;
  pageTransition?: WithDefault<'scrollPerSpread' | 'scrollContinuous' | 'curl', 'scrollContinuous'>;
  documentPassword?: string;
  enableTextSelection?: boolean;
  autosaveEnabled?: boolean;
  disableAutomaticSaving?: boolean;
  pageMode?: WithDefault<'single' | 'double' | 'automatic', 'single'>;
  firstPageAlwaysSingle?: boolean;
  showPageLabels?: boolean;
  documentLabelEnabled?: boolean;
  spreadFitting?: WithDefault<'fit' | 'fill' | 'adaptive', 'fit'>;
  invertColors?: boolean;
  androidGrayScale?: boolean;
  iOSClipToPageBoundaries?: boolean;
  iOSBackgroundColor?: Double;
  iOSRenderAnimationEnabled?: boolean;
  iOSMinimumZoomScale?: Double;
  iOSMaximumZoomScale?: Double;
  iOSDoubleTapAction?: WithDefault<'none' | 'zoom' | 'smartZoom', 'none'>;
  iOSUseParentNavigationBar?: boolean;
  iOSAllowToolbarTitleChange?: boolean;
  iOSShouldHideStatusBar?: boolean;
  iOSShowBackActionButton?: boolean;
  iOSShowForwardActionButton?: boolean;
  iOSShowBackForwardActionButtonLabels?: boolean;
  iOSSearchResultZoomScale?: Double;
  iOSShadowEnabled?: boolean;
  iOSShadowOpacity?: Double;
  showThumbnailBar?: WithDefault<'none' | 'default' | 'floating' | 'pinned' | 'scrubberBar' | 'scrollable', 'none'>;
  iOSScrubberBarType?: WithDefault<'horizontal' | 'verticalLeft' | 'verticalRight', 'horizontal'>;
  iOSThumbnailGrouping?: WithDefault<'automatic' | 'never' | 'always', 'automatic'>;
  iOSThumbnailSize?: Double;
  iOSThumbnailInteritemSpacing?: Double;
  iOSThumbnailLineSpacing?: Double;
  iOSThumbnailMargin?: Double;
  iOSShouldCacheThumbnails?: boolean;
  editableAnnotationTypes?: string[];
  enableAnnotationEditing?: boolean;
  enableFormEditing?: boolean;
  iOSShouldAskForAnnotationUsername?: boolean;
  iOSLinkAction?: WithDefault<'none' | 'alertView' | 'openSafari' | 'inlineBrowser' | 'InlineWebViewController', 'none'>;
  iOSDrawCreateMode?: WithDefault<'separate' | 'mergeIfPossible', 'separate'>;
  iOSAnnotationGroupingEnabled?: boolean;
  iOSNaturalDrawingAnnotationEnabled?: boolean;
  iOSNaturalSignatureDrawingEnabled?: boolean;
  iOSAnnotationEntersEditModeAfterSecondTapEnabled?: boolean;
  iOSCreateAnnotationMenuEnabled?: boolean;
  iOSAnnotationAnimationDuration?: Double;
  iOSSoundAnnotationTimeLimit?: Double;
  iOSBookmarkSortOrder?: WithDefault<'custom' | 'pageBased', 'custom'>;
  enableInstantComments?: boolean;
  listenToServerChanges?: boolean;
  delay?: Double;
  syncAnnotations?: boolean;
  measurementValueConfigurations?: MeasurementValueConfiguration[];
  remoteDocumentConfiguration?: RemoteDocumentConfiguration;
  androidShowDefaultToolbar?: boolean;
  showActionButtons?: boolean;
  aiAssistantConfiguration?: string[];
  androidRemoveStatusBarOffset?: boolean;
  iOSFileConflictResolution?: WithDefault<'default' | 'close' | 'save' | 'reload', 'default'>;
  iOSDocumentInfoOptions?: string[];
  toolbarTitle?: string;
}

export interface InstantDocumentInfo {
  serverUrl: string;
  jwt: string;
}

// Duplicated types from Toolbar.ts
export interface ToolbarItems {
  buttons: string[];
  viewMode?: string;
  animated?: boolean;
}

export interface Toolbar {
  leftBarButtonItems?: ToolbarItems;
  rightBarButtonItems?: ToolbarItems;
  toolbarMenuItems?: ToolbarItems;
}

export namespace Toolbar {
  export const DefaultToolbarButton = {
    CLOSE_BUTTON_ITEM: 'closeButtonItem',
    OUTLINE_BUTTON_ITEM: 'outlineButtonItem',
    SEARCH_BUTTON_ITEM: 'searchButtonItem',
    THUMBNAILS_BUTTON_ITEM: 'thumbnailsButtonItem',
    CONTENT_EDITING_BUTTON_ITEM: 'contentEditingButtonItem',
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
  } as const;

  export const PDFViewMode = {
    VIEW_MODE_DOCUMENT: 'document',
    VIEW_MODE_THUMBNAILS: 'thumbnails',
    VIEW_MODE_DOCUMENT_EDITOR: 'documentEditor',
  } as const;

  export type DefaultToolbarButton = ValueOf<typeof DefaultToolbarButton>;
  export type PDFViewMode = ValueOf<typeof PDFViewMode>;
  type ValueOf<T> = T[keyof T];
}

// Duplicated types from Annotation.ts
export interface AnnotationContextualMenuItem {
  id: string;
  image: string;
  title?: string;
  selectable?: boolean;
}

export interface AnnotationContextualMenu {
  buttons: AnnotationContextualMenuItem[];
  retainSuggestedMenuItems?: boolean;
  menuType?: string;
  appearance?: WithDefault<'horizontalBar' | 'contextMenu', 'horizontalBar'>;
  position?: WithDefault<'start' | 'end', 'end'>;
}

export interface AnnotationPresetInk {
  defaultColor?: string;
  defaultFillColor?: string;
  defaultAlpha?: Double;
  defaultThickness?: Double;
  blendMode?: string;
  availableColors?: string[];
  availableFillColors?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
  aggregationStrategy?: string;
}

export interface AnnotationPresetFreeText {
  defaultColor?: string;
  availableColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultTextSize?: Double;
  minimumTextSize?: Double;
  maximumTextSize?: Double;
  defaultFont?: string;
  availableFonts?: string[];
  zIndexEditingEnabled?: boolean;
  previewEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetShape {
  defaultColor?: string;
  defaultFillColor?: string;
  defaultAlpha?: Double;
  defaultThickness?: Double;
  availableColors?: string[];
  availableFillColors?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  defaultBorderStyle?: string;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetLine {
  defaultColor?: string;
  availableColors?: string[];
  defaultFillColor?: string;
  availableFillColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultThickness?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  defaultAlpha?: Double;
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  defaultLineEnd?: string;
  availableLineEnds?: string[];
  defaultBorderStyle?: string;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetMarkup {
  defaultColor?: string;
  defaultAlpha?: Double;
  availableColors?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  customColorPickerEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetEraser {
  defaultThickness?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetStamp {
  availableStampItems?: string[];
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetNote {
  defaultColor?: string;
  availableColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultIconName?: string;
  availableIconNames?: string[];
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetFile {
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetRedact {
  defaultColor?: string;
  defaultFillColor?: string;
  availableColors?: string[];
  availableFillColors?: string[];
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

export interface AnnotationPresetSound {
  audioSamplingRate?: Double;
  audioRecordingTimeLimit?: Double;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetMeasurementArea {
  defaultColor?: string;
  defaultAlpha?: Double;
  defaultThickness?: Double;
  defaultBorderStyle?: string;
  availableColors?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetMeasurementPerimeter {
  defaultColor?: string;
  defaultAlpha?: Double;
  defaultBorderStyle?: string;
  defaultThickness?: Double;
  availableColors?: string[];
  defaultLineEnd?: string;
  availableLineEnds?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetMeasurementDistance {
  defaultLineEnd?: string;
  availableLineEnds?: string[];
  defaultBorderStyle?: string;
  defaultColor?: string;
  defaultAlpha?: Double;
  defaultThickness?: Double;
  availableColors?: string[];
  minimumAlpha?: Double;
  maximumAlpha?: Double;
  minimumThickness?: Double;
  maximumThickness?: Double;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

export interface AnnotationPresetConfiguration {
  inkPen?: AnnotationPresetInk;
  inkMagic?: AnnotationPresetInk;
  inkHighlighter?: AnnotationPresetInk;
  freeText?: AnnotationPresetFreeText;
  freeTextCallout?: AnnotationPresetFreeText;
  stamp?: AnnotationPresetStamp;
  note?: AnnotationPresetNote;
  highlight?: AnnotationPresetMarkup;
  underline?: AnnotationPresetMarkup;
  squiggly?: AnnotationPresetMarkup;
  strikeOut?: AnnotationPresetMarkup;
  square?: AnnotationPresetShape;
  circle?: AnnotationPresetShape;
  line?: AnnotationPresetLine;
  arrow?: AnnotationPresetLine;
  eraser?: AnnotationPresetEraser;
  file?: AnnotationPresetFile;
  polygon?: AnnotationPresetShape;
  polyline?: AnnotationPresetLine;
  sound?: AnnotationPresetSound;
  redaction?: AnnotationPresetRedact;
  image?: AnnotationPresetStamp;
  audio?: AnnotationPresetSound;
  measurementAreaRect?: AnnotationPresetMeasurementArea;
  measurementAreaPolygon?: AnnotationPresetMeasurementArea;
  measurementAreaEllipse?: AnnotationPresetMeasurementArea;
  measurementPerimeter?: AnnotationPresetMeasurementPerimeter;
  measurementDistance?: AnnotationPresetMeasurementDistance;
}

// Main props interface - same as NutrientView. For Instant, document is InstantDocumentData JSON (serverUrl, jwt).
export interface NativeProps extends ViewProps {
  nativeID?: string;
  document?: string;
  pageIndex?: WithDefault<Int32, 0>;
  fragmentTag?: string;
  configuration?: PDFConfiguration;
  configurationJSONString?: string;
  toolbar?: Toolbar;
  toolbarJSONString?: string;
  annotationPresets?: AnnotationPresetConfiguration;
  annotationContextualMenuJSONString?: string;
  textSelectionContextualMenuJSONString?: string;
  menuItemGrouping?: string[];
  menuItemGroupingJSONString?: string;
  hideNavigationBar?: boolean;
  showNavigationButtonInToolbar?: boolean;
  availableFontNamesJSONString?: string;
  selectedFontName?: string;
  showDownloadableFonts?: boolean;
  disableDefaultActionForTappedAnnotations?: boolean;
  hasShouldExecuteAction?: WithDefault<boolean, false>;
  annotationAuthorName?: string;
  imageSaveMode?: string;
  showCloseButton?: WithDefault<boolean, false>;
  hideDefaultToolbar?: boolean;
  documentInfo?: InstantDocumentInfo;
  onCustomToolbarButtonTapped?: BubblingEventHandler<{ buttonId?: string; id?: string }>;
  onCustomAnnotationContextualMenuItemTapped?: BubblingEventHandler<{ id: string }>;
  onCloseButtonPressed?: BubblingEventHandler<{}>;
  onNavigationButtonClicked?: BubblingEventHandler<{}>;
  onReady?: BubblingEventHandler<{}>;
  onShouldExecuteAction?: BubblingEventHandler<{
    requestId: string;
    pageIndex: Int32;
    actionType?: string;
    url?: string;
  }>;
}

// Export the Fabric native component for NutrientInstantView (New Architecture only)
export default codegenNativeComponent<NativeProps>('NutrientInstantView') as HostComponent<NativeProps>;
