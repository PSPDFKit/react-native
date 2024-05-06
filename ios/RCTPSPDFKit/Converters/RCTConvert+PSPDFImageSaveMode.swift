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
    
    @objc public static func PSPDFImageSaveMode(_ saveMode: String) -> ImageDocument.SaveMode {
        
        switch (saveMode) {
        case "flatten":
            return .flatten
        case "flattenAndEmbed":
            return .flattenAndEmbed
        default:
            return .flatten
        }
    }
}
