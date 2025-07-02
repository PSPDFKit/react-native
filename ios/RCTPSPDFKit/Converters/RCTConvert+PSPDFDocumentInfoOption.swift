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
    
    @objc public static func PSPDFDocumentInfoOption(_ option: String) -> DocumentInfoOption {
        
        switch (option) {
        case "outline":
            return .outline
        case "bookmarks":
            return .bookmarks
        case "annotations":
            return .annotations
        case "embeddedFiles":
            return .embeddedFiles
        case "documentInfo":
            return .documentInfo
        case "security":
            return .security
        default:
            return .outline
        }
    }
}
