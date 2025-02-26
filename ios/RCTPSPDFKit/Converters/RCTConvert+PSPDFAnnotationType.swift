//
//  Copyright © 2017-2025 PSPDFKit GmbH. All rights reserved.
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
            case "ink", "pspdfkit/ink":
                updatedTypes |= Annotation.Kind.ink.rawValue
            case "link", "pspdfkit/link":
                updatedTypes |= Annotation.Kind.link.rawValue
            case "highlight", "pspdfkit/markup/highlight":
                updatedTypes |= Annotation.Kind.highlight.rawValue
            case "squiggly", "pspdfkit/markup/squiggly":
                updatedTypes |= Annotation.Kind.squiggly.rawValue
            case "strikeout", "pspdfkit/markup/strikeout":
                updatedTypes |= Annotation.Kind.strikeOut.rawValue
            case "underline", "pspdfkit/markup/underline":
                updatedTypes |= Annotation.Kind.underline.rawValue
            case "note", "pspdfkit/note":
                updatedTypes |= Annotation.Kind.note.rawValue
            case "line", "pspdfkit/shape/line":
                updatedTypes |= Annotation.Kind.line.rawValue
            case "polygon", "pspdfkit/shape/polygon":
                updatedTypes |= Annotation.Kind.polygon.rawValue
            case "polyline", "pspdfkit/shape/polyline":
                updatedTypes |= Annotation.Kind.polyLine.rawValue
            case "square", "pspdfkit/shape/square", "pspdfkit/shape/rectangle":
                updatedTypes |= Annotation.Kind.square.rawValue
            case "circle", "pspdfkit/shape/circle", "pspdfkit/shape/ellipse":
                updatedTypes |= Annotation.Kind.circle.rawValue
            case "freetext", "pspdfkit/freetext", "pspdfkit/text":
                updatedTypes |= Annotation.Kind.freeText.rawValue
            case "stamp", "pspdfkit/stamp":
                updatedTypes |= Annotation.Kind.stamp.rawValue
            case "image", "pspdfkit/image":
                updatedTypes |= Annotation.Kind.stamp.rawValue
            case "caret", "pspdfkit/caret":
                updatedTypes |= Annotation.Kind.caret.rawValue
            case "richmedia", "pspdfkit/richmedia":
                updatedTypes |= Annotation.Kind.richMedia.rawValue
            case "widget", "pspdfkit/widget":
                updatedTypes |= Annotation.Kind.widget.rawValue
            case "watermark", "pspdfkit/watermark":
                updatedTypes |= Annotation.Kind.watermark.rawValue
            case "file", "pspdfkit/file":
                updatedTypes |= Annotation.Kind.file.rawValue
            case "sound", "pspdfkit/sound":
                updatedTypes |= Annotation.Kind.sound.rawValue
            case "popup", "pspdfkit/popup":
                updatedTypes |= Annotation.Kind.popup.rawValue
            case "trapnet", "pspdfkit/trapnet":
                updatedTypes |= Annotation.Kind.trapNet.rawValue
            case "threedimensional", "pspdfkit/threedimensional":
                updatedTypes |= Annotation.Kind.threeDimensional.rawValue
            case "redaction", "pspdfkit/markup/redaction":
                updatedTypes |= Annotation.Kind.redaction.rawValue
            default:
                updatedTypes |= Annotation.Kind.all.rawValue
                break
            }
        }
        return updatedTypes
    }
}
