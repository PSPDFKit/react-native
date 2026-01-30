//
//  AIAConfig.swift
//  PSPDFKit
//
//  Copyright © 2017-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

@objc public class AIAConfig: NSObject {
    
    @objc public static func processAIAConfig(_ config: PDFConfigurationBuilder, aiaConfig: Dictionary<String, String>) {
        
        if let serverURL = aiaConfig["serverURL"], let jwt = aiaConfig["jwt"], let sessionID = aiaConfig["sessionID"], let serverURLParsed = URL(string: serverURL) {
            
            let aiaConfiguration = AIAssistantConfiguration(serverURL: serverURLParsed, jwt: jwt, sessionID: sessionID, userID: aiaConfig["userID"] == nil ? nil : aiaConfig["userID"])
            config.aiAssistantConfiguration = aiaConfiguration
        } else {
            print("Failed to set AIA Configuration.")
        }
    }
}
