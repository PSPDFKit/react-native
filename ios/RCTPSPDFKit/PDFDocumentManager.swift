//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React
import PSPDFKit

@objc(PDFDocumentManager) public class PDFDocumentManager: NSObject {
    
    var documents = [NSNumber:Document]()
    
    private func getDocument(_ reference: NSNumber) -> Document? {
        return documents[reference]
    }
    
    @objc public func setDocument(_ document: Document, reference: NSNumber) {
        self.documents[reference] = document
    }
    
    @objc static public func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc func getDocumentId(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getDocumentId", "Document is nil", nil)
            return
        }
        onSuccess(document.documentIdString);
    }
    
    @objc func invalidateCacheForPage(_ reference: NSNumber, pageIndex: Int, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("invalidateCacheForPage", "Document is nil", nil)
            return
        }
        SDK.shared.cache.invalidateImages(from: document, pageIndex: PageIndex(pageIndex))
        onSuccess(true)
    }
    
    @objc func invalidateCache(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("invalidateCache", "Document is nil", nil)
            return
        }
        SDK.shared.cache.remove(for: document)
        onSuccess(true)
    }
}
