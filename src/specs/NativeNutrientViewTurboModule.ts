// @ts-ignore
import type { TurboModule, Double } from 'react-native';
// @ts-ignore
import { TurboModuleRegistry } from 'react-native';

// Type definitions for TurboModule (duplicated from NutrientViewNativeComponent.ts since Codegen can't import types)
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

// Remote document configuration interface
export interface RemoteDocumentConfiguration {
  outputFilePath?: string;
  overwriteExisting?: boolean;
}

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

export interface PDFConfiguration {
  scrollDirection?: string;
  pageTransition?: string;
  documentPassword?: string;
  enableTextSelection?: boolean;
  autosaveEnabled?: boolean;
  disableAutomaticSaving?: boolean;
  pageMode?: string;
  firstPageAlwaysSingle?: boolean;
  showPageLabels?: boolean;
  documentLabelEnabled?: boolean;
  spreadFitting?: string;
  invertColors?: boolean;
  androidGrayScale?: boolean;
  iOSClipToPageBoundaries?: boolean;
  iOSBackgroundColor?: string;
  iOSRenderAnimationEnabled?: boolean;
  iOSMinimumZoomScale?: number;
  iOSMaximumZoomScale?: number;
  iOSDoubleTapAction?: string;
  iOSUseParentNavigationBar?: boolean;
  iOSAllowToolbarTitleChange?: boolean;
  iOSShouldHideStatusBar?: boolean;
  iOSShowBackActionButton?: boolean;
  iOSShowForwardActionButton?: boolean;
  iOSShowBackForwardActionButtonLabels?: boolean;
  iOSSearchResultZoomScale?: number;
  iOSShadowEnabled?: boolean;
  iOSShadowOpacity?: number;
  showThumbnailBar?: string;
  iOSScrubberBarType?: string;
  iOSThumbnailGrouping?: string;
  iOSThumbnailSize?: number;
  iOSThumbnailInteritemSpacing?: number;
  iOSThumbnailLineSpacing?: number;
  iOSThumbnailMargin?: number;
  iOSShouldCacheThumbnails?: boolean;
  editableAnnotationTypes?: string[];
  enableAnnotationEditing?: boolean;
  enableFormEditing?: boolean;
  iOSShouldAskForAnnotationUsername?: boolean;
  iOSLinkAction?: string;
  iOSDrawCreateMode?: string;
  iOSAnnotationGroupingEnabled?: boolean;
  iOSNaturalDrawingAnnotationEnabled?: boolean;
  iOSNaturalSignatureDrawingEnabled?: boolean;
  iOSAnnotationEntersEditModeAfterSecondTapEnabled?: boolean;
  iOSCreateAnnotationMenuEnabled?: boolean;
  iOSAnnotationAnimationDuration?: number;
  iOSSoundAnnotationTimeLimit?: number;
  iOSBookmarkSortOrder?: string;
  enableInstantComments?: boolean;
  listenToServerChanges?: boolean;
  delay?: number;
  syncAnnotations?: boolean;
  measurementValueConfigurations?: MeasurementValueConfiguration[];
  remoteDocumentConfiguration?: RemoteDocumentConfiguration;
  androidShowDefaultToolbar?: boolean;
  showActionButtons?: boolean;
  aiAssistantConfiguration?: string[];
  androidRemoveStatusBarOffset?: boolean;
  iOSFileConflictResolution?: string;
  iOSDocumentInfoOptions?: string[];
}

export interface Spec extends TurboModule {
  // Annotation creation and management
  enterAnnotationCreationMode: (reference: string, annotationType?: string) => Promise<boolean>;
  exitCurrentlyActiveMode: (reference: string) => Promise<boolean>;
  clearSelectedAnnotations: (reference: string) => Promise<boolean>;
  selectAnnotations: (reference: string, annotationsJSONString: string, showContextualMenu?: boolean) => Promise<boolean>;
  
  // Document operations
  setPageIndex: (reference: string, pageIndex: number, animated: boolean) => Promise<boolean>;
  
  // Toolbar and UI operations
  setToolbar: (reference: string, toolbar: string) => void;
  getToolbar: (reference: string, viewMode?: string) => Promise<Toolbar>;
  setMeasurementValueConfigurations: (reference: string, configurations: MeasurementValueConfiguration[]) => Promise<boolean>;
  getMeasurementValueConfigurations: (reference: string) => Promise<MeasurementValueConfiguration[]>;
  getConfiguration: (reference: string) => Promise<PDFConfiguration>;
  setExcludedAnnotations: (reference: string, annotations: string[]) => void;
  setUserInterfaceVisible: (reference: string, visible: boolean) => Promise<boolean>;
  destroyView: (reference: string) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NutrientViewTurboModule'); 