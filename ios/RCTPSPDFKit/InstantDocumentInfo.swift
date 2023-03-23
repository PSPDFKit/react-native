//
//  InstantDocumentInfo.swift
//  PSPDFKit
//
//  Copyright © 2017-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

// The response from the PSPDFKit for Web examples server API that may be used to load a document layer with Instant.
@objc
public class InstantDocumentInfo: NSObject{
    let serverURL: URL
    let url: URL
    let jwt: String

 @objc public init(serverURL: URL, url: URL, jwt: String) {
        self.serverURL = serverURL
        self.url = url
        self.jwt = jwt
    }
}

extension InstantDocumentInfo {
    enum JSONKeys: String {
        case serverUrl, url, documentId, jwt
    }

    convenience init?(json: Any) {
        guard let dictionary = json as? [String: Any],
            let serverUrlString = dictionary[JSONKeys.serverUrl.rawValue] as? String,
            let serverURL = URL(string: serverUrlString),
            let urlString = dictionary[JSONKeys.url.rawValue] as? String,
            let url = URL(string: urlString),
            let jwt = dictionary[JSONKeys.jwt.rawValue] as? String else {
                return nil
        }

        self.init(serverURL: serverURL, url: url, jwt: jwt)
    }
}

