import * as React from 'react';
const { forwardRef, useImperativeHandle, useMemo } = React;
import NutrientInstantViewNativeComponent from './specs/NutrientInstantViewNativeComponent';
import type { NativeProps } from './specs/NutrientInstantViewNativeComponent';
import { PDFDocument } from './document/PDFDocument';
import { NotificationCenter } from './notification-center/NotificationCenter';
// @ts-ignore
import NativeNutrientInstantViewTurboModule from './specs/NativeNutrientInstantViewTurboModule';
import type { AnnotationType } from './annotations/AnnotationModels';

export interface NutrientInstantViewFabricRef {
  getDocument: () => PDFDocument;
  getNotificationCenter: () => NotificationCenter;
  enterAnnotationCreationMode: (annotationType?: string) => Promise<boolean> | void;
  enterContentEditingMode: () => Promise<boolean> | void;
  exitCurrentlyActiveMode: () => Promise<boolean> | void;
  setToolbar: (toolbar: any) => void;
  getToolbar: (viewMode?: string) => Promise<any>;
  setMeasurementValueConfigurations: (configurations: any[]) => Promise<boolean>;
  getMeasurementValueConfigurations: () => Promise<any[]>;
  getConfiguration: () => Promise<any>;
  setExcludedAnnotations: (annotations: string[]) => void;
  setUserInterfaceVisible: (visible: boolean) => Promise<boolean> | void;
  destroyView: () => void;
  setPageIndex: (pageIndex: number, animated: boolean) => Promise<boolean> | void;
  executeAction: (requestId: string, allow: boolean) => Promise<boolean> | void;
}

const NutrientInstantViewFabric = forwardRef<NutrientInstantViewFabricRef, NativeProps>((props, ref) => {
  const instanceId = useMemo(() => Math.floor(Math.random() * 1000000000), []);

  let pdfDocumentInstance: PDFDocument | null = null;
  let notificationCenterInstance: NotificationCenter | null = null;

  useImperativeHandle(ref, () => ({
    getDocument: () => {
      if (pdfDocumentInstance == null) {
        pdfDocumentInstance = new PDFDocument(instanceId);
      }
      return pdfDocumentInstance;
    },

    getNotificationCenter: () => {
      if (notificationCenterInstance == null) {
        notificationCenterInstance = new NotificationCenter(instanceId);
      }
      return notificationCenterInstance;
    },

    enterAnnotationCreationMode: (annotationType?: string) => {
      return NativeNutrientInstantViewTurboModule.enterAnnotationCreationMode(instanceId.toString(), annotationType);
    },

    enterContentEditingMode: () => {
      return NativeNutrientInstantViewTurboModule.enterContentEditingMode(instanceId.toString());
    },

    exitCurrentlyActiveMode: () => {
      return NativeNutrientInstantViewTurboModule.exitCurrentlyActiveMode(instanceId.toString());
    },

    setToolbar: (toolbar: any) => {
      NativeNutrientInstantViewTurboModule.setToolbar(instanceId.toString(), JSON.stringify(toolbar));
    },

    getToolbar: (viewMode?: string) => {
      return NativeNutrientInstantViewTurboModule.getToolbar(instanceId.toString(), viewMode);
    },

    setPageIndex: (pageIndex: number, animated: boolean) => {
      return NativeNutrientInstantViewTurboModule.setPageIndex(instanceId.toString(), pageIndex, animated);
    },

    setMeasurementValueConfigurations: (configurations: any[]) => {
      return NativeNutrientInstantViewTurboModule.setMeasurementValueConfigurations(instanceId.toString(), configurations);
    },

    getMeasurementValueConfigurations: () => {
      return NativeNutrientInstantViewTurboModule.getMeasurementValueConfigurations(instanceId.toString());
    },

    getConfiguration: () => {
      return NativeNutrientInstantViewTurboModule.getConfiguration(instanceId.toString());
    },

    setExcludedAnnotations: (annotations: string[]) => {
      NativeNutrientInstantViewTurboModule.setExcludedAnnotations(instanceId.toString(), annotations);
    },

    setUserInterfaceVisible: (visible: boolean) => {
      return NativeNutrientInstantViewTurboModule.setUserInterfaceVisible(instanceId.toString(), visible);
    },

    destroyView: () => {
      NativeNutrientInstantViewTurboModule.destroyView(instanceId.toString());
    },

    executeAction: (requestId: string, allow: boolean) => {
      return NativeNutrientInstantViewTurboModule.executeAction(instanceId.toString(), requestId, allow);
    },
  }), [instanceId]);

  const fabricProps = {
    ...props,
    disableDefaultActionForTappedAnnotations: (props as any).disableDefaultActionForTappedAnnotations === true,
    configurationJSONString: props.configuration ? JSON.stringify(props.configuration) : undefined,
    toolbarJSONString: props.toolbar ? JSON.stringify(props.toolbar) : undefined,
    menuItemGroupingJSONString: (props as any).menuItemGrouping
      ? JSON.stringify((props as any).menuItemGrouping)
      : undefined,
    annotationContextualMenuJSONString: (props as any).annotationContextualMenu
      ? JSON.stringify((props as any).annotationContextualMenu)
      : undefined,
    textSelectionContextualMenuJSONString: (props as any).textSelectionContextualMenu
      ? JSON.stringify((props as any).textSelectionContextualMenu)
      : undefined,
    availableFontNamesJSONString: (props as any).availableFontNames
      ? JSON.stringify((props as any).availableFontNames)
      : undefined,
    fragmentTag: (props as any).fragmentTag ?? 'NutrientInstantView.FragmentTag',
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
          (props as any).onCloseButtonPressed({});
        }
      : undefined,
    onShouldExecuteAction: (props as any).onShouldExecuteAction
      ? (e: any) => {
          const native = e?.nativeEvent ?? e;
          (props as any).onShouldExecuteAction(native);
        }
      : undefined,
    onReady: props.onReady
      ? (_e: any) => {
          (props as any).onReady({});
        }
      : undefined,
    hasShouldExecuteAction: !!(props as any).onShouldExecuteAction,
    nativeID: instanceId.toString(),
  };

  try {
    return React.createElement(NutrientInstantViewNativeComponent, fabricProps);
  } catch (error) {
    return React.createElement('View', { style: { backgroundColor: 'red', width: 100, height: 100 } }, React.createElement('Text', {}, 'Fabric Error'));
  }
});

NutrientInstantViewFabric.displayName = 'NutrientInstantViewFabric';

export default NutrientInstantViewFabric;
