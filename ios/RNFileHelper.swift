//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

struct RNFileHelper {
    static func documentPath() -> URL? {
        let paths =  FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        return documentsDirectory
    }

    static func getFilePath(_ configuration: [String: Any] = [:], onError: @escaping RCTPromiseRejectBlock) -> URL? {
        if
            let filePath = configuration["filePath"] as? String,
            !filePath.isEmpty,
            let filePathURL = URL(string: filePath) {

            return filePathURL
        }

        if
            let name = configuration["name"] as? String,
            let documentPath = documentPath() {

            let filePathURL = URL(string: documentPath.absoluteString + "\(name)")?.appendingPathExtension("pdf")
            if let outputFileUrl = filePathURL {
                return outputFileUrl
            }
        }

        onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", invalidFileError())

        return nil
    }

    static func invalidFileError () -> NSError {
        return NSError(domain: "PSPDFKit", code: 200, userInfo: nil)
    }

    static func deleteExistingFileIfNeeded(filePath: URL?, configuration: [String: Any]) {
        let fileManager = FileManager.default
        let override = configuration["override"] as? Bool ?? false

        if override, let filePathURL = filePath {
            do {
                try fileManager.removeItem(at: filePathURL)

            } catch {
                print("E_NO_DOCUMENT_FOUND: Could not delete file, probably didn't exist")
            }
        }
    }

    static func getTemporaryDirectory() -> String? {
        return URL(fileURLWithPath: NSTemporaryDirectory()).absoluteString
    }

    static func updateFileNameIfNeeded(_ outputFileURL: URL) -> URL {
        if String(outputFileURL.absoluteString.suffix(4)) != ".pdf",
           let updatedURL = URL(string: outputFileURL.absoluteString + ".pdf") {
            return updatedURL
        }

        return outputFileURL
    }
}
