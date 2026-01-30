// @ts-ignore
import { findNodeHandle, NativeModules } from 'react-native';
import { FormElement, ButtonFormElement, ChoiceFormElement, SignatureFormElement, TextFieldFormElement } from './FormElement';
import { FormField, ButtonFormField, ChoiceFormField, SignatureFormField, TextFormField } from './FormField';
import { ElectronicSignatureFieldConfiguration, TextFormFieldConfiguration } from './FormFieldConfiguration';

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
                        formElement.pdfViewRef = findNodeHandle(this.pdfViewRef);
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
     * @param {number[] | string} selectedIndices An array containing the indices of the selected option(s) in the choice form field. Can also be a string if a custom value needs to be set.
     * @description Updates a choice form field value on the document. This is used for combo boxes and list boxes.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.updateChoiceFormFieldValue(name, [2]);
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    updateChoiceFormFieldValue(
        fullyQualifiedName: string,
        selectedIndices: number[] | string
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

    /**
     * @method addElectronicSignatureFormField
     * @memberof Forms
     * @param {ElectronicSignatureFieldConfiguration} configuration The configuration for the electronic signature field.
     * @description Adds an electronic signature field to the document at the specified location.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.addElectronicSignatureFormField({
     *   pageIndex: 0,
     *   bbox: { left: 100, top: 100, right: 300, bottom: 150 },
     *   fullyQualifiedName: 'Signature1'
     * });
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the field was added successfully, ```false``` otherwise.
     */
    addElectronicSignatureFormField(
        configuration: ElectronicSignatureFieldConfiguration
    ): Promise<boolean> {
        // Convert bbox to array format if it's an object
        const bboxArray = Array.isArray(configuration.bbox)
            ? configuration.bbox
            : [
                configuration.bbox.left,
                configuration.bbox.top,
                configuration.bbox.right,
                configuration.bbox.bottom
            ];

        return NativeModules.PDFDocumentManager.addElectronicSignatureFormField(
            findNodeHandle(this.pdfViewRef),
            {
                pageIndex: configuration.pageIndex,
                bbox: bboxArray,
                fullyQualifiedName: configuration.fullyQualifiedName
            }
        );
    }

    /**
     * @method addTextFormField
     * @memberof Forms
     * @param {TextFormFieldConfiguration} configuration The configuration for the text form field.
     * @description Adds a text form field to the document at the specified location.
     * @example
     * const result = await this.pdfRef.current?.getDocument().forms.addTextFormField({
     *   pageIndex: 0,
     *   bbox: { left: 100, top: 100, right: 300, bottom: 150 },
     *   fullyQualifiedName: 'TextField1'
     * });
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the field was added successfully, ```false``` otherwise.
     */
    addTextFormField(
        configuration: TextFormFieldConfiguration
    ): Promise<boolean> {
        // Convert bbox to array format if it's an object
        const bboxArray = Array.isArray(configuration.bbox)
            ? configuration.bbox
            : [
                configuration.bbox.left,
                configuration.bbox.top,
                configuration.bbox.right,
                configuration.bbox.bottom
            ];

        return NativeModules.PDFDocumentManager.addTextFormField(
            findNodeHandle(this.pdfViewRef),
            {
                pageIndex: configuration.pageIndex,
                bbox: bboxArray,
                fullyQualifiedName: configuration.fullyQualifiedName
            }
        );
    }
}