//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import PSPDFKit

private final class WeakViewRef {
    weak var view: RCTPSPDFKitView?

    init(_ view: RCTPSPDFKitView) {
        self.view = view
    }
}

private final class WeakDelegateRef {
    weak var delegate: PDFDocumentManagerDelegate?

    init(_ delegate: PDFDocumentManagerDelegate) {
        self.delegate = delegate
    }
}

@objc(PDFDocumentStore)
public final class PDFDocumentStore: NSObject {

    private static let queue = DispatchQueue(label: "io.nutrient.reactnative.documentstore")
    private static var documents = [NSNumber: Document]()
    private static var viewByReference = [NSNumber: WeakViewRef]()
    private static var delegateByReference = [NSNumber: WeakDelegateRef]()

    @objc public static func setDocument(_ document: Document, reference: NSNumber) {
        queue.async {
            documents[reference] = document
        }
    }

    @objc public static func setView(_ view: Any, forReference reference: NSNumber) {
        guard let pdfView = view as? RCTPSPDFKitView else { return }
        queue.async {
            viewByReference[reference] = WeakViewRef(pdfView)
        }
    }

    @objc public static func removeReference(_ reference: NSNumber) {
        queue.async {
            documents.removeValue(forKey: reference)
            viewByReference.removeValue(forKey: reference)
            delegateByReference.removeValue(forKey: reference)
        }
    }

    @objc public static func setDelegate(_ delegate: PDFDocumentManagerDelegate, forReference reference: NSNumber) {
        queue.async {
            delegateByReference[reference] = WeakDelegateRef(delegate)
        }
    }

    public static func getDocument(_ reference: NSNumber) -> Document? {
        var result: Document?
        queue.sync {
            result = documents[reference]
        }
        return result
    }

    public static func getView(for reference: NSNumber) -> RCTPSPDFKitView? {
        var result: RCTPSPDFKitView?
        queue.sync {
            result = viewByReference[reference]?.view
        }
        return result
    }

    public static func getDelegate(for reference: NSNumber) -> PDFDocumentManagerDelegate? {
        var result: PDFDocumentManagerDelegate?
        queue.sync {
            result = delegateByReference[reference]?.delegate
        }
        return result
    }
}
