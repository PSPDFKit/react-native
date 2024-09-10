//
//  Copyright © 2017-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React

@objc extension RCTConvert {
    
    @objc(parseAnnotationTypes:) public static func parseAnnotationTypes(annotationTypes: [String]) -> UInt {
        
        var updatedTypes: UInt = 0;
        
        for (type) in annotationTypes {
            switch (type.lowercased()) {
            case "all":
                updatedTypes |= Annotation.Kind.all.rawValue
            case "ink":
                updatedTypes |= Annotation.Kind.ink.rawValue
            case "link":
                updatedTypes |= Annotation.Kind.link.rawValue
            case "highlight":
                updatedTypes |= Annotation.Kind.highlight.rawValue
            case "squiggly":
                updatedTypes |= Annotation.Kind.squiggly.rawValue
            case "strikeout":
                updatedTypes |= Annotation.Kind.strikeOut.rawValue
            case "underline":
                updatedTypes |= Annotation.Kind.underline.rawValue
            case "note":
                updatedTypes |= Annotation.Kind.note.rawValue
            case "line":
                updatedTypes |= Annotation.Kind.line.rawValue
            case "polygon":
                updatedTypes |= Annotation.Kind.polygon.rawValue
            case "polyline":
                updatedTypes |= Annotation.Kind.polyLine.rawValue
            case "square":
                updatedTypes |= Annotation.Kind.square.rawValue
            case "freetext":
                updatedTypes |= Annotation.Kind.freeText.rawValue
            case "stamp":
                updatedTypes |= Annotation.Kind.stamp.rawValue
            case "image":
                updatedTypes |= Annotation.Kind.stamp.rawValue
            case "caret":
                updatedTypes |= Annotation.Kind.caret.rawValue
            case "richmedia":
                updatedTypes |= Annotation.Kind.richMedia.rawValue
            case "widget":
                updatedTypes |= Annotation.Kind.widget.rawValue
            case "watermark":
                updatedTypes |= Annotation.Kind.watermark.rawValue
            case "file":
                updatedTypes |= Annotation.Kind.file.rawValue
            case "sound":
                updatedTypes |= Annotation.Kind.sound.rawValue
            case "popup":
                updatedTypes |= Annotation.Kind.popup.rawValue
            case "trapnet":
                updatedTypes |= Annotation.Kind.trapNet.rawValue
            case "threedimensional":
                updatedTypes |= Annotation.Kind.threeDimensional.rawValue
            case "redaction":
                updatedTypes |= Annotation.Kind.redaction.rawValue
            default:
                updatedTypes |= Annotation.Kind.all.rawValue
                break
            }
        }
        return updatedTypes
    }
}
