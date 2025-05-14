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

//@ts-ignore
import formField = require('../src/formfield/FormField');
export import FormField = formField.FormField;
export import ButtonFormField = formField.ButtonFormField;
export import ChoiceFormField = formField.ChoiceFormField;
export import SignatureFormField = formField.SignatureFormField;
export import TextFormField = formField.TextFormField;

//@ts-ignore
import formElement = require('../src/forms/FormElement');
export import FormElement = formElement.FormElement;
export import ButtonFormElement = formElement.ButtonFormElement;
export import ChoiceFormElement = formElement.ChoiceFormElement;
export import SignatureFormElement = formElement.SignatureFormElement;
export import TextFieldFormElement = formElement.TextFieldFormElement;

//@ts-ignore
import forms = require('../src/forms/Forms');
export import Forms = forms.Forms;

//@ts-ignore
import aiConfig = require('../src/configuration/AIAssistantConfiguration');
export import AIAssistantConfiguration = aiConfig.AIAssistantConfiguration;

//@ts-ignore
import pageInfo = require('../src/document/PDFPageInfo');
export import PDFPageInfo = pageInfo.PDFPageInfo;