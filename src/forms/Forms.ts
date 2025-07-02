// @ts-ignore
import { findNodeHandle, NativeModules } from 'react-native';
import { FormElement, ButtonFormElement, ChoiceFormElement, SignatureFormElement, TextFieldFormElement } from './FormElement';
import { FormField, ButtonFormField, ChoiceFormField, SignatureFormField, TextFormField } from './FormField';

/**
 * @class Forms
 * @description The Forms class provides methods for managing form fields in the document.
 * @hideconstructor
 */
export class Forms {
    private pdfViewRef: any;

    constructor(pdfViewRef: any) {
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
    async getFormElements(): Promise<Array<FormElement>> {

        const formElements = await NativeModules.PDFDocumentManager.getFormElements(findNodeHandle(this.pdfViewRef));

        return formElements.map((element: FormElement) => {
                let formElement: FormElement;
                
                // Create the appropriate FormElement type based on the element type
                switch (element.formTypeName) {
                    case 'button':
                    case 'checkBox':
                    case 'radioButton':
                        formElement = new ButtonFormElement(element);
                        break;
                    case 'choice':
                    case 'listBox':
                    case 'comboBox':
                        formElement = new ChoiceFormElement(element);
                        break;
                    case 'signature':
                        formElement = new SignatureFormElement(element);
                        break;
                    case 'textField':
                        formElement = new TextFieldFormElement(element);
                        break;
                    default:
                        formElement = new FormElement(element);
                }
                
                // If the element has a formField property, create the appropriate FormField type
                if (element.formField) {
                    switch (element.formTypeName) {
                        case 'button':
                        case 'checkBox':
                        case 'radioButton':
                            formElement.formField = new ButtonFormField(element.formField);
                            break;
                        case 'choice':
                        case 'listBox':
                        case 'comboBox':
                            formElement.formField = new ChoiceFormField(element.formField);
                            break;
                        case 'signature':
                            formElement.formField = new SignatureFormField(element.formField);
                            break;
                        case 'textField':
                            formElement.formField = new TextFormField(element.formField);
                            break;
                        default:
                            // If type is unknown, create a base FormField
                            formElement.formField = new FormField(element.formField);
                    }
                }
                
                return formElement;
            });
    }

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
    updateButtonFormFieldValue(
        fullyQualifiedName: string,
        value: boolean
    ): Promise<boolean> {
        return NativeModules.PDFDocumentManager.updateFormFieldValue(
            findNodeHandle(this.pdfViewRef),
            fullyQualifiedName,
            value
        );
    }

    /**
     * @method updateChoiceFormFieldValue
     * @memberof Forms
     * @param {string} fullyQualifiedName The fully qualified name of the choice form field to update.
     * @param {number[]} selectedIndices The indices of the selected options in the choice form field.
     * @description Updates a choice form field value on the document. This is used for combo boxes and list boxes.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.updateChoiceFormFieldValue(name, [0, 2]);
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    updateChoiceFormFieldValue(
        fullyQualifiedName: string,
        selectedIndices: number[]
    ): Promise<boolean> {
        return NativeModules.PDFDocumentManager.updateFormFieldValue(
            findNodeHandle(this.pdfViewRef),
            fullyQualifiedName,
            selectedIndices
        );
    }

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
    updateTextFormFieldValue(
        fullyQualifiedName: string,
        value: string
    ): Promise<boolean> {
        return NativeModules.PDFDocumentManager.updateFormFieldValue(
            findNodeHandle(this.pdfViewRef),
            fullyQualifiedName,
            value
        );
    }
} 