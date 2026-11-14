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
import PSPDFKit
import PSPDFKitUI

@objc public class AIAConfig: NSObject {
    
    /// Sets the AI Assistant server from the JavaScript `aiAssistantConfiguration`.
    ///
    /// Returns a warning for the caller to log if the configuration can't be used. AI Assistant then
    /// keeps its default source, the on-device language model, so the problem is otherwise silent.
    @objc public static func processAIAConfig(_ config: PDFConfigurationBuilder, aiaConfig: Dictionary<String, String>) -> String? {
        guard let serverURLString = aiaConfig["serverURL"], let jwt = aiaConfig["jwt"], let sessionID = aiaConfig["sessionID"] else {
            let missingKeys = ["serverURL", "jwt", "sessionID"].filter { aiaConfig[$0] == nil }
            return ignoredConfigurationWarning("is missing \(missingKeys.joined(separator: ", "))")
        }
        guard let serverURL = URL(string: serverURLString) else {
            return ignoredConfigurationWarning("has a serverURL that isn't a valid URL: \(serverURLString)")
        }

        let serverConfiguration = AIAssistantServerConfiguration(serverURL: serverURL, jwt: jwt, sessionID: sessionID, userID: aiaConfig["userID"])
        config.aiAssistantSource = .server(serverConfiguration)
        return nil
    }

    private static func ignoredConfigurationWarning(_ problem: String) -> String {
        "aiAssistantConfiguration \(problem), so AI Assistant uses the on-device language model instead of a server."
    }
}
