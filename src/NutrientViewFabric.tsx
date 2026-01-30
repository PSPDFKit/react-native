import * as React from 'react';
const { forwardRef, useImperativeHandle, useMemo } = React;
import NutrientViewNativeComponent from './specs/NutrientViewNativeComponent';
import type { NativeProps } from './specs/NutrientViewNativeComponent';
import { PDFDocument } from './document/PDFDocument';
import { NotificationCenter } from './notification-center/NotificationCenter';
// @ts-ignore
import NativeNutrientViewTurboModule from './specs/NativeNutrientViewTurboModule';
import type { AnnotationType } from './annotations/AnnotationModels';

// Enhanced ref interface with the methods you need - same as Paper implementation
export interface NutrientViewFabricRef {
  getDocument: () => PDFDocument;
  getNotificationCenter: () => NotificationCenter;
  
  // All the command methods exposed directly on the ref - matching index.js signatures
  enterAnnotationCreationMode: (annotationType?: string) => Promise<boolean> | void;
  exitCurrentlyActiveMode: () => Promise<boolean> | void;
  setToolbar: (toolbar: any) => void;
  getToolbar: (viewMode?: string) => Promise<any>;
  setMeasurementValueConfigurations: (configurations: any[]) => Promise<boolean>;
  getMeasurementValueConfigurations: () => Promise<any[]>;
  getConfiguration: () => Promise<any>;
  setExcludedAnnotations: (annotations: string[]) => void;
  setUserInterfaceVisible: (visible: boolean) => Promise<boolean> | void;
  destroyView: () => void;
  clearSelectedAnnotations: () => Promise<any> | void;
  selectAnnotations: (annotations: any, showContextualMenu?: boolean) => Promise<any> | void;
  setPageIndex: (pageIndex: number, animated: boolean) => Promise<boolean> | void;
}

// Fabric component using the actual native component
const NutrientViewFabric = forwardRef<NutrientViewFabricRef, NativeProps>((props, ref) => {
  
  // Generate a unique identifier for this component instance
  const instanceId = useMemo(() => Math.floor(Math.random() * 1000000000), []);
  
  // Store instances directly - same pattern as Paper's this._pdfDocument
  let pdfDocumentInstance: PDFDocument | null = null;
  let notificationCenterInstance: NotificationCenter | null = null;
  
  useImperativeHandle(ref, () => ({
    getDocument: () => {
      if (pdfDocumentInstance == null) {
        // Pass the instanceId to PDFDocument constructor - same as Paper's this._componentRef.current
        pdfDocumentInstance = new PDFDocument(instanceId);
      }
      return pdfDocumentInstance;
    },
    
    getNotificationCenter: () => {
      if (notificationCenterInstance == null) {
        // Pass the instanceId to NotificationCenter constructor - same as Paper's this._componentRef.current
        notificationCenterInstance = new NotificationCenter(instanceId);
      }
      return notificationCenterInstance;
    },
    
    // Expose all commands directly on the ref - Paper-style API with NativeModules
    enterAnnotationCreationMode: (annotationType?: string) => {
      return NativeNutrientViewTurboModule.enterAnnotationCreationMode(instanceId.toString(), annotationType);
    },
    
    exitCurrentlyActiveMode: () => {
      return NativeNutrientViewTurboModule.exitCurrentlyActiveMode(instanceId.toString());
    },
    
    setToolbar: (toolbar: any) => {
      NativeNutrientViewTurboModule.setToolbar(instanceId.toString(), JSON.stringify(toolbar));
    },
    
    getToolbar: (viewMode?: string) => {
      return NativeNutrientViewTurboModule.getToolbar(instanceId.toString(), viewMode);
    },

    clearSelectedAnnotations: () => {
      return NativeNutrientViewTurboModule.clearSelectedAnnotations(instanceId.toString());
    },

    selectAnnotations: (annotations: any, showContextualMenu?: boolean) => {
      return NativeNutrientViewTurboModule.selectAnnotations(instanceId.toString(), JSON.stringify(annotations), showContextualMenu);
    },

    setPageIndex: (pageIndex: number, animated: boolean) => {
      return NativeNutrientViewTurboModule.setPageIndex(instanceId.toString(), pageIndex, animated);
    },
    
    setMeasurementValueConfigurations: (configurations: any[]) => {
      return NativeNutrientViewTurboModule.setMeasurementValueConfigurations(instanceId.toString(), configurations);
    },
    
    getMeasurementValueConfigurations: () => {
      return NativeNutrientViewTurboModule.getMeasurementValueConfigurations(instanceId.toString());
    },
    
    getConfiguration: () => {
      return NativeNutrientViewTurboModule.getConfiguration(instanceId.toString());
    },
    
    setExcludedAnnotations: (annotations: string[]) => {
      NativeNutrientViewTurboModule.setExcludedAnnotations(instanceId.toString(), annotations);
    },
    
    setUserInterfaceVisible: (visible: boolean) => {
      return NativeNutrientViewTurboModule.setUserInterfaceVisible(instanceId.toString(), visible);
    },
    
    destroyView: () => {
      NativeNutrientViewTurboModule.destroyView(instanceId.toString());
    }
  }), [instanceId]);
  
  const fabricProps = {
    ...props,
    configurationJSONString: props.configuration ? JSON.stringify(props.configuration) : undefined,
    toolbarJSONString: props.toolbar ? JSON.stringify(props.toolbar) : undefined,
    menuItemGroupingJSONString: (props as any).menuItemGrouping
      ? JSON.stringify((props as any).menuItemGrouping)
      : undefined,
    annotationContextualMenuJSONString: (props as any).annotationContextualMenu
      ? JSON.stringify((props as any).annotationContextualMenu)
      : undefined,
    availableFontNamesJSONString: (props as any).availableFontNames
      ? JSON.stringify((props as any).availableFontNames)
      : undefined,
    // Ensure parity with Paper default
    fragmentTag: (props as any).fragmentTag ?? 'NutrientView.FragmentTag',
    // Back-compat wrapper: pass Paper-shaped payloads to user callbacks
    onDocumentLoaded: props.onDocumentLoaded
      ? (e: any) => {
          // Paper passed an empty object
          (props as any).onDocumentLoaded({});
        }
      : undefined,
    onStateChanged: props.onStateChanged
      ? (e: any) => {
          // Same as Paper: pass event.nativeEvent directly
          (props as any).onStateChanged(e?.nativeEvent ?? e);
        }
      : undefined,
    onCustomToolbarButtonTapped: props.onCustomToolbarButtonTapped
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          const buttonId = native?.buttonId ?? native?.id;
          (props as any).onCustomToolbarButtonTapped({ id: buttonId });
        }
      : undefined,
    onCustomAnnotationContextualMenuItemTapped: props.onCustomAnnotationContextualMenuItemTapped
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          (props as any).onCustomAnnotationContextualMenuItemTapped({ id: native?.id });
        }
      : undefined,
    onCloseButtonPressed: props.onCloseButtonPressed
      ? (_e: any) => {
          // Paper passed an empty object
          (props as any).onCloseButtonPressed({});
        }
      : undefined,
    onDocumentLoadFailed: props.onDocumentLoadFailed
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          (props as any).onDocumentLoadFailed({ 
            code: native?.code ?? 'CORRUPTED', 
            message: native?.message ?? native?.error ?? 'Document failed to load' 
          });
        }
      : undefined,
    onDocumentSaved: props.onDocumentSaved
      ? (_e: any) => {
          // Paper passed an empty object
          (props as any).onDocumentSaved({});
        }
      : undefined,
    onDocumentSaveFailed: props.onDocumentSaveFailed
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          (props as any).onDocumentSaveFailed({ error: native?.error });
        }
      : undefined,
    onAnnotationsChanged: (props as any).onAnnotationsChanged
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          const change: string | undefined = native?.change;
          const json: string | undefined = native?.annotationsJSONString;
          let annotations: AnnotationType[] = [];
          if (typeof json === 'string') {
            try {
              annotations = JSON.parse(json) as AnnotationType[];
            } catch {
              annotations = [];
            }
          }
          (props as any).onAnnotationsChanged({ change, annotations });
        }
      : undefined,
    onReady: props.onReady
      ? (_e: any) => {
          // Paper passed an empty object
          (props as any).onReady({});
        }
      : undefined,
    // Convert numeric instanceId to string for React Native nativeID
    nativeID: instanceId.toString(),
  };
  
  try {
    // Render the native component that communicates with ReactPdfViewManagerFabric
    const nativeComponent = React.createElement(NutrientViewNativeComponent, fabricProps);
    return nativeComponent;
  } catch (error) {
    // Fallback to a simple view for debugging
    return React.createElement('View', { 
      style: { backgroundColor: 'red', width: 100, height: 100 } 
    }, React.createElement('Text', {}, 'Fabric Error'));
  }
});

NutrientViewFabric.displayName = 'NutrientViewFabric';

export default NutrientViewFabric; 