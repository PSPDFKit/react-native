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