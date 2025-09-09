/**
 * @typedef FormField
 * @memberof FormField
 * @property {FormField.Type} [type] The type of the form field.
 * @property {string} [name] The name of the form field.
 * @property {string} [fullyQualifiedName] The fully qualified name of the form field.
 * @property {string} [mappingName] The mapping name used when exporting form field data.
 * @property {string} [alternateFieldName] An alternate name used in the UI.
 * @property {boolean} [isEditable] Whether the form field is editable.
 * @property {boolean} [isReadOnly] Whether the form field is read-only.
 * @property {boolean} [isRequired] Whether the form field is required.
 * @property {boolean} [isNoExport] Whether the form field should not be exported.
 * @property {any} [defaultValue] The default value of the form field.
 * @property {any} [exportValue] The value exported when the form is submitted.
 * @property {any} [value] The current value of the form field.
 * @property {number} [calculationOrderIndex] The calculation order index.
 * @property {boolean} [dirty] Whether the form field has been modified.
 */

/**
 * @typedef ButtonFormField
 * @memberof FormField
 * @property {boolean} isPushButton Whether this is a push button.
 * @property {boolean} isCheckBox Whether this is a check box.
 * @property {boolean} isRadioButton Whether this is a radio button.
 * @property {number[]} selectedAnnotationObjectNumbers The selected annotation object numbers.
 * @property {Array<{value: string, label: string}>} options The available options for the button.
 */

/**
 * @typedef ChoiceFormField
 * @memberof FormField
 * @property {Array<{value: string, label: string}>} options The available options.
 * @property {number[]} selectedIndices The indices of selected options.
 * @property {boolean} isMultiSelect Whether multiple selections are allowed.
 * @property {boolean} isCombo Whether this is a combo box.
 * @property {boolean} isEditable Whether the field is editable.
 * @property {number} [topIndex] The top index of visible options.
 */

/**
 * @typedef SignatureFormField
 * @memberof FormField
 * @property {string} [signatureContents] The contents of the signature.
 * @property {{name: string, date: Date, reason: string, location: string}} [signatureInfo] Information about the signature.
 * @property {boolean} isSigned Whether the field is signed.
 * @property {'text' | 'image' | 'drawing'} [signatureType] The type of signature.
 */

/**
 * @typedef TextFormField
 * @memberof FormField
 * @property {string} value The current value of the text field.
 * @property {string} [placeholder] The placeholder text.
 * @property {boolean} isPassword Whether this is a password field.
 * @property {boolean} isRichText Whether rich text is enabled.
 * @property {'left' | 'center' | 'right'} alignment The text alignment.
 * @property {number} fontSize The font size.
 * @property {string} [fontName] The font name.
 * @property {string} [textColor] The text color.
 * @property {number} [maxLength] The maximum length of the text.
 * @property {boolean} isMultiline Whether the field is multiline.
 * @property {boolean} doNotScroll Whether scrolling is disabled.
 */

/**
 * @interface FormField
 */
export class FormField {
    /**
     * The type of the form field.
     */
    type?: FormField.Type;

    /**
     * The name of the form field.
     */
    name?: string;

    /**
     * The fully qualified name of the form field. Form fields can form a hierarchy in the PDF form.
     * This combines all the parents names and separates them by a single dot to create a string that
     * can uniquely identify a form field across one PDF file.
     */
    fullyQualifiedName?: string;

    /**
     * (Optional; PDF 1.3) The mapping name that shall be used when exporting interactive form field data from the document.
     */
    mappingName?: string;

    /**
     * (Optional; PDF 1.3) An alternate field name that shall be used in place of the actual field name
     * wherever the field shall be identified in the user interface.
     */
    alternateFieldName?: string;

    /**
     * Specifies if the linked form elements are editable in the UI. Defaults to true.
     */
    isEditable?: boolean;

    /**
     * If set, the user may not change the value of the field. This flag is useful for fields whose
     * values are computed or imported from a database.
     */
    isReadOnly?: boolean;

    /**
     * If set, the field shall have a value at the time it is exported by a submit-form action.
     */
    isRequired?: boolean;

    /**
     * If set, the field shall not be exported by a submit-form action.
     */
    isNoExport?: boolean;

    /**
     * (Optional; inheritable) The default value to which the field reverts when a reset-form action is executed.
     */
    defaultValue?: any;

    /**
     * The value which the field is to export when submitted. Can return either a string or an array
     * of strings in the case of multiple selection.
     */
    exportValue?: any;

    /**
     * The value of the field. Can either be a string or an array of strings.
     */
    value?: any;

    /**
     * Returns the calculation order index.
     */
    calculationOrderIndex?: number;

    /**
     * Checks if the form field is dirty.
     */
    dirty?: boolean;

    constructor(data: Partial<FormField> = {}) {
        this.type = data.type;
        this.name = data.name;
        this.fullyQualifiedName = data.fullyQualifiedName;
        this.mappingName = data.mappingName;
        this.alternateFieldName = data.alternateFieldName;
        this.isEditable = data.isEditable;
        this.isReadOnly = data.isReadOnly;
        this.isRequired = data.isRequired;
        this.isNoExport = data.isNoExport;
        this.defaultValue = data.defaultValue;
        this.exportValue = data.exportValue;
        this.value = data.value;
        this.calculationOrderIndex = data.calculationOrderIndex;
        this.dirty = data.dirty;
    }
}

export namespace FormField {
    /**
     * The different types of form fields.
     * @readonly
     * @enum {string} Type
     */
     export const Type = {
       /**
        * No form type known.
        */
        UNKNOWN: 'unknown',
       /**
        * Push button form field.
        */
        PUSH_BUTTON: 'pushButton',
       /**
        * Radio button form field.
        */
        RADIO_BUTTON: 'radioButton',
       /**
        * Check box form field.
        */
        CHECK_BOX: 'checkBox',
       /**
        * Text form field.
        */
        TEXT: 'text',
       /**
        * List box form field.
        */
        LIST_BOX: 'listBox',
       /**
        * Combo box form field.
        */
        COMBO_BOX: 'comboBox',
       /**
        * Signature form field.
        */
        SIGNATURE: 'signature',
     } as const;

     export type Type = ValueOf<typeof Type>;
     type ValueOf<T> = T[keyof T];
}

export class ButtonFormField extends FormField {
    /**
     * Whether this is a push button.
     */
    isPushButton: boolean;

    /**
     * Whether this is a check box.
     */
    isCheckBox: boolean;

    /**
     * Whether this is a radio button.
     */
    isRadioButton: boolean;

    /**
     * The selected annotation object numbers.
     */
    selectedAnnotationObjectNumbers: number[];

    /**
     * The available options for the button.
     */
    options: Array<{
        value: string;
        label: string;
    }>;

    constructor(data: Partial<ButtonFormField> = {}) {
        super(data);
        this.isPushButton = data.isPushButton || false;
        this.isCheckBox = data.isCheckBox || false;
        this.isRadioButton = data.isRadioButton || false;
        this.selectedAnnotationObjectNumbers = data.selectedAnnotationObjectNumbers || [];
        this.options = data.options || [];
    }
}

export class ChoiceFormField extends FormField {
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
     * Whether multiple selections are allowed.
     */
    isMultiSelect: boolean;

    /**
     * Whether this is a combo box.
     */
    isCombo: boolean;

    /**
     * Whether the field is editable.
     */
    isEditable: boolean;

    /**
     * The top index of visible options.
     */
    topIndex?: number;

    constructor(data: Partial<ChoiceFormField> = {}) {
        super(data);
        this.options = data.options || [];
        this.selectedIndices = data.selectedIndices || [];
        this.isMultiSelect = data.isMultiSelect || false;
        this.isCombo = data.isCombo || false;
        this.isEditable = data.isEditable || false;
        this.topIndex = data.topIndex;
    }
}

export class SignatureFormField extends FormField {
    /**
     * The contents of the signature.
     */
    signatureContents?: string;

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

    /**
     * The type of signature.
     */
    signatureType?: 'text' | 'image' | 'drawing';

    constructor(data: Partial<SignatureFormField> = {}) {
        super(data);
        this.signatureContents = data.signatureContents;
        this.signatureInfo = data.signatureInfo;
        this.isSigned = data.isSigned || false;
        this.signatureType = data.signatureType;
    }
}

export class TextFormField extends FormField {
    /**
     * The current value of the text field.
     */
    value: string;

    /**
     * The placeholder text.
     */
    placeholder?: string;

    /**
     * Whether this is a password field.
     */
    isPassword: boolean;

    /**
     * Whether rich text is enabled.
     */
    isRichText: boolean;

    /**
     * The text alignment.
     */
    alignment: 'left' | 'center' | 'right';

    /**
     * The font size.
     */
    fontSize: number;

    /**
     * The font name.
     */
    fontName?: string;

    /**
     * The text color.
     */
    textColor?: string;

    /**
     * The maximum length of the text.
     */
    maxLength?: number;

    /**
     * Whether the field is multiline.
     */
    isMultiline: boolean;

    /**
     * Whether scrolling is disabled.
     */
    doNotScroll: boolean;

    constructor(data: Partial<TextFormField> = {}) {
        super(data);
        this.value = data.value || '';
        this.placeholder = data.placeholder;
        this.isPassword = data.isPassword || false;
        this.isRichText = data.isRichText || false;
        this.alignment = data.alignment || 'left';
        this.fontSize = data.fontSize || 12;
        this.fontName = data.fontName;
        this.textColor = data.textColor;
        this.maxLength = data.maxLength;
        this.isMultiline = data.isMultiline || false;
        this.doNotScroll = data.doNotScroll || false;
    }
}