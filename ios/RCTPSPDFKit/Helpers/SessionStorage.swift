//
//  SessionStorage.swift
//  PSPDFKit
//
//  Copyright © 2017-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

@objc public class SessionStorage: NSObject {
    
    @objc public enum CallbackType: Int {
        case onDocumentLoaded
    }
    
    var annotationContextualMenuItems: NSDictionary!
    var barButtonItems: NSMutableDictionary!
    var closeButtonAttributes: NSDictionary!
    var pendingCallbacks: NSMutableArray!

    override public init() {
        annotationContextualMenuItems = [:]
        barButtonItems = [:]
        closeButtonAttributes = [:]
        pendingCallbacks = []
        super .init()
    }
    
    @objc public func setAnnotationContextualMenuItems(_ items: NSDictionary) {
        annotationContextualMenuItems = items
    }
    
    @objc public func getAnnotationContextualMenuItems() -> NSDictionary {
        return annotationContextualMenuItems
    }
    
    @objc public func addBarButtonItem(_ object: UIBarButtonItem, key: NSString) {
        barButtonItems.setObject(object, forKey: key)
    }
    
    @objc public func getBarButtonItems() -> NSDictionary {
        return barButtonItems
    }
    
    @objc public func setCloseButtonAttributes(_ items: NSDictionary) {
        closeButtonAttributes = items
    }
    
    @objc public func getCloseButtonAttributes() -> NSDictionary {
        return closeButtonAttributes
    }
    
    @objc public func addPendingCallback(_ type: CallbackType) {
        pendingCallbacks.add(type.rawValue)
    }
    
    @objc public func removePendingCallback(_ type: CallbackType) {
        pendingCallbacks.remove(type.rawValue)
    }
    
    @objc public func getPendingCallbacks() -> NSArray {
        return pendingCallbacks
    }
}
