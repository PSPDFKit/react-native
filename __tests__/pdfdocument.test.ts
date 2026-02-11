jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    findNodeHandle: jest.fn(),
  };
});

jest.mock('../src/ArchitectureDetector', () => ({
  isNewArchitectureEnabled: jest.fn(),
}));

import { PDFDocument } from '../src/document/PDFDocument';
import { isNewArchitectureEnabled } from '../src/ArchitectureDetector';
import { NativeModules, findNodeHandle } from 'react-native';
import {
  ButtonFormElement,
  ChoiceFormElement,
  FormElement,
  SignatureFormElement,
  TextFieldFormElement,
} from '../src/forms/FormElement';
import {
  ButtonFormField,
  ChoiceFormField,
  FormField,
  SignatureFormField,
  TextFormField,
} from '../src/forms/FormField';
import { WidgetAnnotation } from '../src/annotations/AnnotationModels';

describe('PDFDocument JS helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (findNodeHandle as jest.Mock).mockReturnValue(999);
    (isNewArchitectureEnabled as jest.Mock).mockReturnValue(false);
  });

  test('getRef returns numeric reference on Fabric (pdfViewRef is component id)', () => {
    (isNewArchitectureEnabled as jest.Mock).mockReturnValue(true);
    (findNodeHandle as jest.Mock).mockReturnValue(null);
    const doc = new PDFDocument(1234);
    // @ts-ignore access private
    const ref = (doc as any).getRef();
    expect(ref).toBe(1234);
  });

  test('getRef returns null on Paper when findNodeHandle returns null (no fallback)', () => {
    (isNewArchitectureEnabled as jest.Mock).mockReturnValue(false);
    (findNodeHandle as jest.Mock).mockReturnValue(null);
    const doc = new PDFDocument(1234);
    // @ts-ignore access private
    const ref = (doc as any).getRef();
    expect(ref).toBeNull();
  });

  test('setPageIndex rejects out of bounds', async () => {
    const doc = new PDFDocument(5);
    (NativeModules.PDFDocumentManager.getPageCount as jest.Mock).mockResolvedValueOnce(3);
    await expect(doc.setPageIndex(10)).rejects.toBeInstanceOf(Error);
  });

  describe('createAnnotationInstance - Widget annotations with form elements', () => {
    let doc: PDFDocument;
    const mockPdfViewRef = { current: {} };

    beforeEach(() => {
      doc = new PDFDocument(1234);
      // @ts-ignore access private
      doc.pdfViewRef = mockPdfViewRef;
    });

    test('creates ButtonFormElement and ButtonFormField for button formTypeName', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'button',
          name: 'test-button',
          formField: {
            type: 'button',
            name: 'test-button',
            value: 'button-value',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeInstanceOf(ButtonFormElement);
      expect(result.formElement.formField).toBeInstanceOf(ButtonFormField);
      expect(result.formElement.pdfViewRef).toBe(999);
      expect(findNodeHandle).toHaveBeenCalledWith(mockPdfViewRef);
    });

    test('creates ChoiceFormElement and ChoiceFormField for choice formTypeName', () => {
      const annotationData = {
        type: 'widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'choice',
          name: 'test-choice',
          formField: {
            type: 'choice',
            name: 'test-choice',
            value: 'choice-value',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeInstanceOf(ChoiceFormElement);
      expect(result.formElement.formField).toBeInstanceOf(ChoiceFormField);
      expect(result.formElement.pdfViewRef).toBe(999);
    });

    test('creates SignatureFormElement and SignatureFormField for signature formTypeName', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'signature',
          name: 'test-signature',
          formField: {
            type: 'signature',
            name: 'test-signature',
            value: 'signature-value',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeInstanceOf(SignatureFormElement);
      expect(result.formElement.formField).toBeInstanceOf(SignatureFormField);
      expect(result.formElement.pdfViewRef).toBe(999);
    });

    test('creates TextFieldFormElement and TextFormField for textfield formTypeName', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'textField',
          name: 'test-textfield',
          formField: {
            type: 'text',
            name: 'test-textfield',
            value: 'text-value',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeInstanceOf(TextFieldFormElement);
      expect(result.formElement.formField).toBeInstanceOf(TextFormField);
      expect(result.formElement.pdfViewRef).toBe(999);
    });

    test('creates FormElement and FormField for unknown formTypeName', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'unknown-type',
          name: 'test-unknown',
          formField: {
            type: 'unknown',
            name: 'test-unknown',
            value: 'unknown-value',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeInstanceOf(FormElement);
      expect(result.formElement.formField).toBeInstanceOf(FormField);
      expect(result.formElement.pdfViewRef).toBe(999);
    });

    test('handles formTypeName case insensitivity', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'BUTTON', // uppercase
          name: 'test-button',
          formField: {
            type: 'button',
            name: 'test-button',
          },
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result.formElement).toBeInstanceOf(ButtonFormElement);
    });

    test('handles widget annotation without formElement', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result).toBeInstanceOf(WidgetAnnotation);
      expect(result.formElement).toBeUndefined();
    });

    test('handles formElement without formField', () => {
      const annotationData = {
        type: 'pspdfkit/widget',
        pageIndex: 0,
        bbox: [0, 0, 100, 50],
        horizontalAlign: 'left',
        verticalAlign: 'top',
        formElement: {
          formTypeName: 'button',
          name: 'test-button',
        },
      };

      // @ts-ignore access private
      const result = doc.createAnnotationInstance(annotationData);

      expect(result.formElement).toBeInstanceOf(ButtonFormElement);
      expect(result.formElement.formField).toBeUndefined();
    });

    test('sets pdfViewRef on formElementInstance for all form types', () => {
      const formTypes = ['button', 'choice', 'signature', 'textField', 'unknown'];
      
      formTypes.forEach((formType) => {
        const annotationData = {
          type: 'pspdfkit/widget',
          pageIndex: 0,
          bbox: [0, 0, 100, 50],
          horizontalAlign: 'left',
          verticalAlign: 'top',
          formElement: {
            formTypeName: formType,
            name: `test-${formType}`,
            formField: {
              type: formType,
              name: `test-${formType}`,
            },
          },
        };

        // @ts-ignore access private
        const result = doc.createAnnotationInstance(annotationData);
        
        expect(result.formElement.pdfViewRef).toBe(999);
      });
    });
  });
});


