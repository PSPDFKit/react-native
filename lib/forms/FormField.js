"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFormField = exports.SignatureFormField = exports.ChoiceFormField = exports.ButtonFormField = exports.FormField = void 0;
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
 * @namespace FormField
 */
var FormField = /** @class */ (function () {
    function FormField(data) {
        if (data === void 0) { data = {}; }
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
    return FormField;
}());
exports.FormField = FormField;
(function (FormField) {
    /**
     * The different types of form fields.
     * @readonly
     * @enum {string} Type
     */
    FormField.Type = {
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
        CHECK_BOX: 'checkbox',
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
    };
})(FormField || (exports.FormField = FormField = {}));
var ButtonFormField = /** @class */ (function (_super) {
    __extends(ButtonFormField, _super);
    function ButtonFormField(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.isPushButton = data.isPushButton || false;
        _this.isCheckBox = data.isCheckBox || false;
        _this.isRadioButton = data.isRadioButton || false;
        _this.selectedAnnotationObjectNumbers = data.selectedAnnotationObjectNumbers || [];
        _this.options = data.options || [];
        return _this;
    }
    return ButtonFormField;
}(FormField));
exports.ButtonFormField = ButtonFormField;
var ChoiceFormField = /** @class */ (function (_super) {
    __extends(ChoiceFormField, _super);
    function ChoiceFormField(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.options = data.options || [];
        _this.selectedIndices = data.selectedIndices || [];
        _this.isMultiSelect = data.isMultiSelect || false;
        _this.isCombo = data.isCombo || false;
        _this.isEditable = data.isEditable || false;
        _this.topIndex = data.topIndex;
        return _this;
    }
    return ChoiceFormField;
}(FormField));
exports.ChoiceFormField = ChoiceFormField;
var SignatureFormField = /** @class */ (function (_super) {
    __extends(SignatureFormField, _super);
    function SignatureFormField(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.signatureContents = data.signatureContents;
        _this.signatureInfo = data.signatureInfo;
        _this.isSigned = data.isSigned || false;
        _this.signatureType = data.signatureType;
        return _this;
    }
    return SignatureFormField;
}(FormField));
exports.SignatureFormField = SignatureFormField;
var TextFormField = /** @class */ (function (_super) {
    __extends(TextFormField, _super);
    function TextFormField(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.value = data.value || '';
        _this.placeholder = data.placeholder;
        _this.isPassword = data.isPassword || false;
        _this.isRichText = data.isRichText || false;
        _this.alignment = data.alignment || 'left';
        _this.fontSize = data.fontSize || 12;
        _this.fontName = data.fontName;
        _this.textColor = data.textColor;
        _this.maxLength = data.maxLength;
        _this.isMultiline = data.isMultiline || false;
        _this.doNotScroll = data.doNotScroll || false;
        return _this;
    }
    return TextFormField;
}(FormField));
exports.TextFormField = TextFormField;
