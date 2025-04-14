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
    
    @objc public static func formFieldToJSON(_ formField: PDFFormField) -> Dictionary<String, Any> {
        
        var formFieldDictionary = Dictionary<String, Any>()
        
        formFieldDictionary["type"] = RCTConvert.formFieldTypeToString(formField.type)
        formFieldDictionary["name"] = formField.name
        formFieldDictionary["fullyQualifiedName"] = formField.fullyQualifiedName
        formFieldDictionary["mappingName"] = formField.mappingName
        formFieldDictionary["alternateFieldName"] = formField.alternateFieldName
        formFieldDictionary["isEditable"] = formField.isEditable
        formFieldDictionary["isReadOnly"] = formField.isReadOnly
        formFieldDictionary["isRequired"] = formField.isRequired
        formFieldDictionary["isNoExport"] = formField.isNoExport
        formFieldDictionary["defaultValue"] = formField.defaultValue
        formFieldDictionary["exportValue"] = formField.exportValue
        formFieldDictionary["value"] = formField.value
        formFieldDictionary["calculationOrderIndex"] = formField.calculationOrderIndex
        formFieldDictionary["dirty"] = formField.dirty
        
        return formFieldDictionary
    }
    
    @objc public static func formFieldTypeToString(_ type: PDFFormField.Kind) -> String {
        
        switch type {
        case .checkBox:
            "checkBox"
        case .comboBox:
            "comboBox"
        case .listBox:
            "listBox"
        case .pushButton:
            "pushButton"
        case .radioButton:
            "radioButton"
        case .signature:
            "signature"
        case .text:
            "text"
        case .unknown:
            "unknown"
        default:
            "unknown"
        }
    }
}
