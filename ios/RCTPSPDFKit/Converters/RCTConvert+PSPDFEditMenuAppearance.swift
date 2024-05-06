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
    
    @objc public static func PSPDFEditMenuAppearance(_ appearance: String) -> EditMenuAppearance {
        
        switch (appearance) {
        case "horizontalBar":
            return .horizontalBar
        case "contextMenu":
            return .contextMenu
        default:
            return .horizontalBar
        }
    }
}
