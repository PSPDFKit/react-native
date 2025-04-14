package com.pspdfkit.react.helper

import com.pspdfkit.forms.ButtonFormElement
import com.pspdfkit.forms.FormField
import com.pspdfkit.forms.FormType
import com.pspdfkit.forms.FormElement
import com.pspdfkit.forms.TextFormElement
import com.pspdfkit.forms.EditableButtonFormElement
import com.pspdfkit.forms.ComboBoxFormElement
import com.pspdfkit.forms.ChoiceFormElement
import com.pspdfkit.forms.ComboBoxFormField
import com.pspdfkit.forms.SignatureFormElement
import com.pspdfkit.forms.TextFormField

object FormUtils {
    @JvmStatic
    fun formFieldToJSON(formField: FormField): Map<String, Any> {
        val formFieldDictionary = HashMap<String, Any>()
        
        formFieldDictionary["type"] = formFieldTypeToString(formField.type)
        formFieldDictionary["name"] = formField.name
        formFieldDictionary["fullyQualifiedName"] = formField.fullyQualifiedName
        formFieldDictionary["mappingName"] = formField.mappingName
        formFieldDictionary["alternateFieldName"] = formField.alternateFieldName
        formFieldDictionary["isReadOnly"] = formField.isReadOnly
        formFieldDictionary["isRequired"] = formField.isRequired
        formFieldDictionary["dirty"] = formField.isDirty
        if (formField is TextFormField) {
            formFieldDictionary["value"] = formField.formElement.text ?: ""
        } else if (formField is ComboBoxFormField && formField.formElement.isCustomTextSet) {
            formFieldDictionary["value"] = formField.formElement.customText ?: ""
        }
        
        return formFieldDictionary
    }
    
    @JvmStatic
    fun formFieldTypeToString(type: FormType): String {
        return when (type) {
            FormType.CHECKBOX -> "checkBox"
            FormType.COMBOBOX -> "comboBox"
            FormType.LISTBOX -> "listBox"
            FormType.PUSHBUTTON -> "pushButton"
            FormType.RADIOBUTTON -> "radioButton"
            FormType.SIGNATURE -> "signature"
            FormType.TEXT -> "text"
            FormType.UNDEFINED -> "unknown"
            else -> "unknown"
        }
    }

    @JvmStatic
    fun formElementToJSON(formElement: FormElement): Map<String, Any> {
        val elementJSON = mutableMapOf<String, Any>()

        elementJSON["isRequired"] = formElement.isRequired
        elementJSON["fieldName"] = formElement.name
        elementJSON["fullyQualifiedFieldName"] = formElement.fullyQualifiedName
        elementJSON["formField"] = FormUtils.formFieldToJSON(formElement.formField)

        when (formElement) {
            is EditableButtonFormElement -> {
                elementJSON["type"] = "button"
                elementJSON["selected"] = formElement.isSelected
            }
            is ButtonFormElement -> {
                elementJSON["type"] = "button"
            }
            is ChoiceFormElement -> {
                elementJSON["type"] = "choice"
                elementJSON["selectedIndices"] = formElement.selectedIndexes
                if (formElement is ComboBoxFormElement && formElement.isCustomTextSet) {
                    elementJSON["value"] = formElement.customText ?: ""
                }
            }
            is SignatureFormElement -> {
                elementJSON["type"] = "signature"
                elementJSON["signatureInfo"] = mapOf(
                    "name" to (formElement.signatureInfo.name ?: ""),
                    "date" to (formElement.signatureInfo.creationDate?.toString() ?: ""),
                    "reason" to (formElement.signatureInfo.reason ?: ""),
                    "location" to (formElement.signatureInfo.location ?: "")
                )
                elementJSON["isSigned"] = formElement.isSigned
            }
            is TextFormElement -> {
                elementJSON["type"] = "textField"
                elementJSON["value"] = formElement.text ?: ""
                elementJSON["isPassword"] = formElement.isPassword
                elementJSON["fontSize"] = formElement.annotation.fontSize
                elementJSON["fontName"] = formElement.annotation.fontName ?: ""
                elementJSON["isMultiline"] = formElement.isMultiLine
                elementJSON["maxLength"] = formElement.maxLength
            }
        }

        // Convert any null values to empty strings
        val sanitizedJSON = HashMap<String, Any>()
        for ((key, value) in elementJSON) {
            sanitizedJSON[key] = when (value) {
                null -> ""
                else -> value
            }
        }

        return sanitizedJSON
    }
} 