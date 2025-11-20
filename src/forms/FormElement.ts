import {
    NativeModules
    // @ts-ignore
  } from 'react-native';
import { FormField } from './FormField';
import { AnnotationType } from '../annotations/AnnotationModels';

/**
 * @typedef FormElement
 * @memberof FormElement
 * @property {FormField} [formField] The associated form field.
 * @property {boolean} [resettable] Whether the form element can be reset.
 * @property {any} [defaultValue] The default value of the form element.
 * @property {any} [exportValue] The value exported when the form is submitted.
 * @property {string} [highlightColor] The highlight color of the form element.
 * @property {number} calculationOrderIndex The calculation order index.
 * @property {boolean} readOnly Whether the form element is read-only.
 * @property {boolean} required Whether the form element is required.
 * @property {boolean} noExport Whether the form element should not be exported.
 * @property {string} [fieldName] The name of the form field.
 * @property {string} [fullyQualifiedFieldName] The fully qualified name of the form field.
 * @property {string} formTypeName The type name of the form.
 * @property {number} maxLength The maximum length of the form element.
 * @property {boolean} doNotScroll Whether scrolling is disabled.
 * @property {boolean} isMultiline Whether the form element is multiline.
 */

/**
 * @typedef ButtonFormElement
 * @memberof FormElement
 * @property {boolean} selected Whether the button is selected.
 * @property {Array<{value: string, label: string}>} [options] The available options for the button.
 * @property {string} [onState] The state when the button is on.
 * @property {FormField} [buttonFormField] The associated button form field.
 */

/**
 * @typedef ChoiceFormElement
 * @memberof FormElement
 * @property {Array<{value: string, label: string}>} options The available options.
 * @property {number[]} selectedIndices The indices of selected options.
 * @property {boolean} isEditable Whether the field is editable.
 */

/**
 * @typedef SignatureFormElement
 * @memberof FormElement
 * @property {{name: string, date: Date, reason: string, location: string}} [signatureInfo] Information about the signature.
 * @property {boolean} isSigned Whether the field is signed.
 */

/**
 * @typedef TextFieldFormElement
 * @memberof FormElement
 * @property {string} value The current value of the text field.
 * @property {boolean} isPassword Whether this is a password field.
 * @property {number} fontSize The font size.
 * @property {string} [fontName] The font name.
 */

/**
 * @interface FormElement
 */
export class FormElement {
    /**
     * The associated form field.
     */
    formField?: FormField;

    /**
     * Whether the form element can be reset.
     */
    resettable?: boolean;

    /**
     * The default value of the form element.
     */
    defaultValue?: any;

    /**
     * The value exported when the form is submitted.
     */
    exportValue?: any;

    /**
     * The highlight color of the form element.
     */
    highlightColor?: string;

    /**
     * The calculation order index.
     */
    calculationOrderIndex: number;

    /**
     * Whether the form element is read-only.
     */
    readOnly: boolean;

    /**
     * Whether the form element is required.
     */
    required: boolean;

    /**
     * Whether the form element should not be exported.
     */
    noExport: boolean;

    /**
     * The name of the form field.
     */
    fieldName?: string;

    /**
     * The fully qualified name of the form field.
     */
    fullyQualifiedFieldName?: string;

    /**
     * The type name of the form.
     */
    formTypeName: string;

    /**
     * The maximum length of the form element.
     */
    maxLength: number;

    /**
     * Whether scrolling is disabled.
     */
    doNotScroll: boolean;

    /**
     * Whether the form element is multiline.
     */
    isMultiline: boolean;

    /**
     * The reference to the NutrientView instance that this form element belongs to.
     */
    pdfViewRef?: any;

    constructor(data: Partial<FormElement> = {}) {
        this.formField = data.formField;
        this.resettable = data.resettable;
        this.defaultValue = data.defaultValue;
        this.exportValue = data.exportValue;
        this.highlightColor = data.highlightColor;
        this.calculationOrderIndex = data.calculationOrderIndex ?? 0;
        this.readOnly = data.readOnly ?? false;
        this.required = data.required ?? false;
        this.noExport = data.noExport ?? false;
        this.fieldName = data.fieldName ?? '';
        this.fullyQualifiedFieldName = data.fullyQualifiedFieldName ?? '';
        this.formTypeName = data.formTypeName ?? '';
        this.maxLength = data.maxLength ?? 0;
        this.doNotScroll = data.doNotScroll ?? false;
        this.isMultiline = data.isMultiline ?? false;
        this.pdfViewRef = data.pdfViewRef;
    }
}

export class ButtonFormElement extends FormElement {
    /**
     * Whether the button is selected.
     */
    selected: boolean;

    /**
     * The available options for the button.
     */
    options?: Array<{
        value: string;
        label: string;
    }>;

    /**
     * The state when the button is on.
     */
    onState?: string;

    /**
     * The associated button form field.
     */
    buttonFormField?: FormField;

    constructor(data: Partial<ButtonFormElement> = {}) {
        super(data);
        this.selected = data.selected || false;
        this.options = data.options;
        this.onState = data.onState;
        this.buttonFormField = data.buttonFormField;
    }
}

export class ChoiceFormElement extends FormElement {
    /**
     * The available options.
     */
    options: Array<{
        value: string;
        label: string;
    }>;

    /**
     * The indices of selected options.
     */
    selectedIndices: number[];

    /**
     * Whether the field is editable.
     */
    isEditable: boolean;

    constructor(data: Partial<ChoiceFormElement> = {}) {
        super(data);
        this.options = data.options || [];
        this.selectedIndices = data.selectedIndices || [];
        this.isEditable = data.isEditable || false;
    }
}

export class SignatureFormElement extends FormElement {
    /**
     * Information about the signature.
     */
    signatureInfo?: {
        name: string;
        date: Date;
        reason: string;
        location: string;
    };

    /**
     * Whether the field is signed.
     */
    isSigned: boolean;

    constructor(data: Partial<SignatureFormElement> = {}) {
        super(data);
        this.signatureInfo = data.signatureInfo;
        this.isSigned = data.isSigned || false;
    }

  /**
   * Gets the overlapping annotation for this specific form element.
   * Called on the ```SignatureFormElement``` object.
   *
   * @method getOverlappingSignature
   * @memberof FormElement
   * @example
   * const result = await signatureFormElement.getOverlappingSignature();
   *
   * @returns { Promise<AnnotationType> } A promise containing the annotation, if found.
   * @throws { Error } If the annotation could not be found.
   */
    getOverlappingSignature(): Promise<AnnotationType> {
        return NativeModules.PDFDocumentManager.getOverlappingSignature(this.pdfViewRef, this.fullyQualifiedFieldName);
    }
}

export class TextFieldFormElement extends FormElement {
    /**
     * The current value of the text field.
     */
    value: string;

    /**
     * Whether this is a password field.
     */
    isPassword: boolean;

    /**
     * The font size.
     */
    fontSize: number;

    /**
     * The font name.
     */
    fontName?: string;

    constructor(data: Partial<TextFieldFormElement> = {}) {
        super(data);
        this.value = data.value || '';
        this.isPassword = data.isPassword || false;
        this.fontSize = data.fontSize || 12;
        this.fontName = data.fontName;
    }
} 