import { Forms } from '../src/forms/Forms';
import { FormElement, ButtonFormElement, ChoiceFormElement, SignatureFormElement, TextFieldFormElement } from '../src/forms/FormElement';
import { FormField, ButtonFormField, ChoiceFormField, SignatureFormField, TextFormField } from '../src/forms/FormField';
import { NativeModules, findNodeHandle } from 'react-native';

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    findNodeHandle: jest.fn(() => 1234),
    NativeModules: {
      ...actual.NativeModules,
      PDFDocumentManager: {
        getFormElements: jest.fn(),
      },
    },
  };
});

describe('Forms', () => {
  let forms: Forms;
  const mockPdfViewRef = { current: 1234 };

  beforeEach(() => {
    jest.clearAllMocks();
    forms = new Forms(mockPdfViewRef);
  });

  test('getFormElements maps button types to ButtonFormElement', async () => {
    const mockElements = [
      { formTypeName: 'button', fieldName: 'btn1' },
      { formTypeName: 'checkBox', fieldName: 'cb1' },
      { formTypeName: 'radioButton', fieldName: 'rb1' },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(ButtonFormElement);
    expect(result[1]).toBeInstanceOf(ButtonFormElement);
    expect(result[2]).toBeInstanceOf(ButtonFormElement);
  });

  test('getFormElements maps choice types to ChoiceFormElement', async () => {
    const mockElements = [
      { formTypeName: 'choice', fieldName: 'ch1' },
      { formTypeName: 'listBox', fieldName: 'lb1' },
      { formTypeName: 'comboBox', fieldName: 'cb1' },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(ChoiceFormElement);
    expect(result[1]).toBeInstanceOf(ChoiceFormElement);
    expect(result[2]).toBeInstanceOf(ChoiceFormElement);
  });

  test('getFormElements maps signature to SignatureFormElement', async () => {
    const mockElements = [
      { formTypeName: 'signature', fieldName: 'sig1' },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(SignatureFormElement);
    expect((result[0] as SignatureFormElement).pdfViewRef).toBe(1234);
  });

  test('getFormElements maps textField to TextFieldFormElement', async () => {
    const mockElements = [
      { formTypeName: 'textField', fieldName: 'tf1' },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(TextFieldFormElement);
  });

  test('getFormElements maps unknown types to base FormElement', async () => {
    const mockElements = [
      { formTypeName: 'unknown', fieldName: 'unk1' },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(FormElement);
    expect(result[0]).not.toBeInstanceOf(ButtonFormElement);
  });

  test('getFormElements creates appropriate FormField types', async () => {
    const mockElements = [
      {
        formTypeName: 'button',
        fieldName: 'btn1',
        formField: { fieldName: 'btn1' },
      },
      {
        formTypeName: 'choice',
        fieldName: 'ch1',
        formField: { fieldName: 'ch1' },
      },
      {
        formTypeName: 'signature',
        fieldName: 'sig1',
        formField: { fieldName: 'sig1' },
      },
      {
        formTypeName: 'textField',
        fieldName: 'tf1',
        formField: { fieldName: 'tf1' },
      },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result[0].formField).toBeInstanceOf(ButtonFormField);
    expect(result[1].formField).toBeInstanceOf(ChoiceFormField);
    expect(result[2].formField).toBeInstanceOf(SignatureFormField);
    expect(result[3].formField).toBeInstanceOf(TextFormField);
  });

  test('getFormElements creates base FormField for unknown types', async () => {
    const mockElements = [
      {
        formTypeName: 'unknown',
        fieldName: 'unk1',
        formField: { fieldName: 'unk1' },
      },
    ];
    
    (NativeModules.PDFDocumentManager.getFormElements as jest.Mock).mockResolvedValue(mockElements);
    
    const result = await forms.getFormElements();
    
    expect(result[0].formField).toBeInstanceOf(FormField);
    expect(result[0].formField).not.toBeInstanceOf(ButtonFormField);
  });
});

