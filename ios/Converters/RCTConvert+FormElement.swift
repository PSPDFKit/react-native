//
//  Copyright © 2019-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React

@objc extension RCTConvert {
    
    @objc public static func baseFormElementToJSON(_ formElement: FormElement) -> Dictionary<String, Any> {
        
        var formElementDictionary = Dictionary<String, Any>()
        
        formElementDictionary["isResettable"] = formElement.isResettable
        formElementDictionary["defaultValue"] = formElement.defaultValue
        formElementDictionary["exportValue"] = formElement.exportValue
        if let uiColor = formElement.highlightColor {
            var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
            if uiColor.getRed(&r, green: &g, blue: &b, alpha: &a) {
                formElementDictionary["highlightColor"] = String(format: "#%02X%02X%02X", Int(r * 255), Int(g * 255), Int(b * 255))
            } else {
                formElementDictionary["highlightColor"] = NSNull()
            }
        } else {
            formElementDictionary["highlightColor"] = NSNull()
        }
        formElementDictionary["calculationOrderIndex"] = formElement.calculationOrderIndex
        formElementDictionary["isRequired"] = formElement.isRequired
        formElementDictionary["isNoExport"] = formElement.isNoExport
        formElementDictionary["fieldName"] = formElement.fieldName
        formElementDictionary["fullyQualifiedFieldName"] = formElement.fullyQualifiedFieldName
        formElementDictionary["maxLength"] = formElement.maxLength
        formElementDictionary["doNotScroll"] = formElement.doNotScroll
        formElementDictionary["isMultiline"] = formElement.isMultiline
        if let formField = formElement.formField {
            formElementDictionary["formField"] = RCTConvert.formFieldToJSON(formField)
        }
        
        return formElementDictionary
    }

    @objc public static func buttonFormElementToJSON(_ formElement: ButtonFormElement) -> Dictionary<String, Any> {
        var json = baseFormElementToJSON(formElement)
        
        json["selected"] = formElement.isSelected
        if let options = formElement.options {
            json["options"] = options.map { option in
                return [
                    "value": option.value,
                    "label": option.label
                ]
            }
        }
        json["onState"] = formElement.onState
        
        return json
    }

    @objc public static func choiceFormElementToJSON(_ formElement: ChoiceFormElement) -> Dictionary<String, Any> {
        var json = baseFormElementToJSON(formElement)
        
        if let options = formElement.options {
            json["options"] = options.map { option in
                return [
                    "value": option.value,
                    "label": option.label
                ]
            }
        }
        json["selectedIndices"] = formElement.selectedIndices?.sorted()
        json["isEditable"] = formElement.isEditable
        
        return json
    }

    @objc public static func signatureFormElementToJSON(_ formElement: SignatureFormElement) -> Dictionary<String, Any> {
        var json = baseFormElementToJSON(formElement)
        
        if let signatureInfo = formElement.signatureInfo {
            json["signatureInfo"] = [
                "name": signatureInfo.name,
                "date": signatureInfo.creationDate?.asString(style: .short),
                "reason": signatureInfo.reason,
                "location": signatureInfo.location
            ]
        }
        json["isSigned"] = formElement.isSigned
        
        return json
    }

    @objc public static func textFieldFormElementToJSON(_ formElement: TextFieldFormElement) -> Dictionary<String, Any> {
        var json = baseFormElementToJSON(formElement)
        
        json["value"] = formElement.value
        json["isPassword"] = formElement.isPassword
        json["fontSize"] = formElement.fontSize
        json["fontName"] = formElement.fontName
        
        return json
    }
}

extension Date {
  func asString(style: DateFormatter.Style) -> String {
    let dateFormatter = DateFormatter()
    dateFormatter.dateStyle = style
    return dateFormatter.string(from: self)
  }
}
