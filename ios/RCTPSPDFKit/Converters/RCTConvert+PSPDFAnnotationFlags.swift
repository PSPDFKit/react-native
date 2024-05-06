//
//  Copyright © 2019-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React

@objc extension RCTConvert {
    
    @objc(parseAnnotationFlags:) public static func parseAnnotationFlags(flags: Array<String>) -> UInt {
        
        var updatedFlags: UInt = 0;
        
        for (flag) in flags {
            switch (flag) {
            case "hidden":
                updatedFlags |= Annotation.Flag.hidden.rawValue
            case "invisible":
                updatedFlags |= Annotation.Flag.invisible.rawValue
            case "locked":
                updatedFlags |= Annotation.Flag.locked.rawValue
            case "lockedContents":
                updatedFlags |= Annotation.Flag.lockedContents.rawValue
            case "print":
                updatedFlags |= Annotation.Flag.print.rawValue
            case "readOnly":
                updatedFlags |= Annotation.Flag.readOnly.rawValue
            case "noView":
                updatedFlags |= Annotation.Flag.noView.rawValue
            default:
                break
            }
        }
        return updatedFlags
    }
    
    @objc(convertAnnotationFlags:) public static func convertAnnotationFlags(flags: UInt) -> Array<String> {
        
        var stringFlags = Array<String>()
        
        if ((flags & Annotation.Flag.hidden.rawValue) != 0) {
            stringFlags.append("hidden")
        }
        if ((flags & Annotation.Flag.invisible.rawValue) != 0) {
            stringFlags.append("invisible")
        }
        if ((flags & Annotation.Flag.locked.rawValue) != 0) {
            stringFlags.append("locked")
        }
        if ((flags & Annotation.Flag.lockedContents.rawValue) != 0) {
            stringFlags.append("lockedContents")
        }
        if ((flags & Annotation.Flag.print.rawValue) != 0) {
            stringFlags.append("print")
        }
        if ((flags & Annotation.Flag.readOnly.rawValue) != 0) {
            stringFlags.append("readOnly")
        }
        if ((flags & Annotation.Flag.noView.rawValue) != 0) {
            stringFlags.append("noView")
        }
        return stringFlags
    }
}
