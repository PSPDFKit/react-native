"use strict";
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
exports.TextFieldFormElement = exports.SignatureFormElement = exports.ChoiceFormElement = exports.ButtonFormElement = exports.FormElement = void 0;
var react_native_1 = require("react-native");
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
var FormElement = /** @class */ (function () {
    function FormElement(data) {
        if (data === void 0) { data = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.formField = data.formField;
        this.resettable = data.resettable;
        this.defaultValue = data.defaultValue;
        this.exportValue = data.exportValue;
        this.highlightColor = data.highlightColor;
        this.calculationOrderIndex = (_a = data.calculationOrderIndex) !== null && _a !== void 0 ? _a : 0;
        this.readOnly = (_b = data.readOnly) !== null && _b !== void 0 ? _b : false;
        this.required = (_c = data.required) !== null && _c !== void 0 ? _c : false;
        this.noExport = (_d = data.noExport) !== null && _d !== void 0 ? _d : false;
        this.fieldName = (_e = data.fieldName) !== null && _e !== void 0 ? _e : '';
        this.fullyQualifiedFieldName = (_f = data.fullyQualifiedFieldName) !== null && _f !== void 0 ? _f : '';
        this.formTypeName = (_g = data.formTypeName) !== null && _g !== void 0 ? _g : '';
        this.maxLength = (_h = data.maxLength) !== null && _h !== void 0 ? _h : 0;
        this.doNotScroll = (_j = data.doNotScroll) !== null && _j !== void 0 ? _j : false;
        this.isMultiline = (_k = data.isMultiline) !== null && _k !== void 0 ? _k : false;
        this.pdfViewRef = data.pdfViewRef;
    }
    return FormElement;
}());
exports.FormElement = FormElement;
var ButtonFormElement = /** @class */ (function (_super) {
    __extends(ButtonFormElement, _super);
    function ButtonFormElement(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.selected = data.selected || false;
        _this.options = data.options;
        _this.onState = data.onState;
        _this.buttonFormField = data.buttonFormField;
        return _this;
    }
    return ButtonFormElement;
}(FormElement));
exports.ButtonFormElement = ButtonFormElement;
var ChoiceFormElement = /** @class */ (function (_super) {
    __extends(ChoiceFormElement, _super);
    function ChoiceFormElement(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.options = data.options || [];
        _this.selectedIndices = data.selectedIndices || [];
        _this.isEditable = data.isEditable || false;
        return _this;
    }
    return ChoiceFormElement;
}(FormElement));
exports.ChoiceFormElement = ChoiceFormElement;
var SignatureFormElement = /** @class */ (function (_super) {
    __extends(SignatureFormElement, _super);
    function SignatureFormElement(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.signatureInfo = data.signatureInfo;
        _this.isSigned = data.isSigned || false;
        return _this;
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
    SignatureFormElement.prototype.getOverlappingSignature = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getOverlappingSignature(this.pdfViewRef, this.fullyQualifiedFieldName);
    };
    return SignatureFormElement;
}(FormElement));
exports.SignatureFormElement = SignatureFormElement;
var TextFieldFormElement = /** @class */ (function (_super) {
    __extends(TextFieldFormElement, _super);
    function TextFieldFormElement(data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, data) || this;
        _this.value = data.value || '';
        _this.isPassword = data.isPassword || false;
        _this.fontSize = data.fontSize || 12;
        _this.fontName = data.fontName;
        return _this;
    }
    return TextFieldFormElement;
}(FormElement));
exports.TextFieldFormElement = TextFieldFormElement;
