"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forms = void 0;
// @ts-ignore
var react_native_1 = require("react-native");
var FormElement_1 = require("./FormElement");
var FormField_1 = require("./FormField");
/**
 * @class Forms
 * @description The Forms class provides methods for managing form fields in the document.
 * @hideconstructor
 */
var Forms = /** @class */ (function () {
    function Forms(pdfViewRef) {
        this.pdfViewRef = pdfViewRef;
    }
    /**
     * @method getFormElements
     * @memberof Forms
     * @description Gets all the form elements for the current document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.getFormElements();
     * @returns { Promise<Array<FormElement>> } A promise containing an array of the ```FormElement``` objects.
     */
    Forms.prototype.getFormElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var formElements;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_1.NativeModules.PDFDocumentManager.getFormElements((0, react_native_1.findNodeHandle)(this.pdfViewRef))];
                    case 1:
                        formElements = _a.sent();
                        return [2 /*return*/, formElements.map(function (element) {
                                var formElement;
                                // Create the appropriate FormElement type based on the element type
                                switch (element.formTypeName) {
                                    case 'button':
                                    case 'checkBox':
                                    case 'radioButton':
                                        formElement = new FormElement_1.ButtonFormElement(element);
                                        break;
                                    case 'choice':
                                    case 'listBox':
                                    case 'comboBox':
                                        formElement = new FormElement_1.ChoiceFormElement(element);
                                        break;
                                    case 'signature':
                                        formElement = new FormElement_1.SignatureFormElement(element);
                                        formElement.pdfViewRef = (0, react_native_1.findNodeHandle)(_this.pdfViewRef);
                                        break;
                                    case 'textField':
                                        formElement = new FormElement_1.TextFieldFormElement(element);
                                        break;
                                    default:
                                        formElement = new FormElement_1.FormElement(element);
                                }
                                // If the element has a formField property, create the appropriate FormField type
                                if (element.formField) {
                                    switch (element.formTypeName) {
                                        case 'button':
                                        case 'checkBox':
                                        case 'radioButton':
                                            formElement.formField = new FormField_1.ButtonFormField(element.formField);
                                            break;
                                        case 'choice':
                                        case 'listBox':
                                        case 'comboBox':
                                            formElement.formField = new FormField_1.ChoiceFormField(element.formField);
                                            break;
                                        case 'signature':
                                            formElement.formField = new FormField_1.SignatureFormField(element.formField);
                                            break;
                                        case 'textField':
                                            formElement.formField = new FormField_1.TextFormField(element.formField);
                                            break;
                                        default:
                                            // If type is unknown, create a base FormField
                                            formElement.formField = new FormField_1.FormField(element.formField);
                                    }
                                }
                                return formElement;
                            })];
                }
            });
        });
    };
    /**
     * @method updateButtonFormFieldValue
     * @memberof Forms
     * @param {string} fullyQualifiedName The fully qualified name of the button form field to update.
     * @param {boolean} selected The new value of the button form field (true for selected, false for deselected).
     * @description Updates a button form field value on the document. This is used for checkboxes and radio buttons.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.updateButtonFormFieldValue(name, true);
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    Forms.prototype.updateButtonFormFieldValue = function (fullyQualifiedName, value) {
        return react_native_1.NativeModules.PDFDocumentManager.updateFormFieldValue((0, react_native_1.findNodeHandle)(this.pdfViewRef), fullyQualifiedName, value);
    };
    /**
     * @method updateChoiceFormFieldValue
     * @memberof Forms
     * @param {string} fullyQualifiedName The fully qualified name of the choice form field to update.
     * @param {number[] | string} selectedIndices An array containing the indices of the selected option(s) in the choice form field. Can also be a string if a custom value needs to be set.
     * @description Updates a choice form field value on the document. This is used for combo boxes and list boxes.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.updateChoiceFormFieldValue(name, [2]);
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    Forms.prototype.updateChoiceFormFieldValue = function (fullyQualifiedName, selectedIndices) {
        return react_native_1.NativeModules.PDFDocumentManager.updateFormFieldValue((0, react_native_1.findNodeHandle)(this.pdfViewRef), fullyQualifiedName, selectedIndices);
    };
    /**
     * @method updateTextFormFieldValue
     * @memberof Forms
     * @param {string} fullyQualifiedName The fully qualified name of the text form field to update.
     * @param {string} value The new text value.
     * @description Updates a text form field value on the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.updateTextFormFieldValue(name, 'New text');
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    Forms.prototype.updateTextFormFieldValue = function (fullyQualifiedName, value) {
        return react_native_1.NativeModules.PDFDocumentManager.updateFormFieldValue((0, react_native_1.findNodeHandle)(this.pdfViewRef), fullyQualifiedName, value);
    };
    return Forms;
}());
exports.Forms = Forms;
