//
//  NutrientNotificationCenter.swift
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
import React
import PSPDFKit

@objc public protocol NutrientNotificationCenterDelegate: AnyObject {
    func nncDocumentLoaded(_ payload: NSDictionary)
    func nncDocumentLoadFailed(_ payload: NSDictionary)
    func nncDocumentPageChanged(_ payload: NSDictionary)
    func nncDocumentScrolled(_ payload: NSDictionary)
    func nncDocumentTapped(_ payload: NSDictionary)
    func nncAnnotationsAdded(_ payload: NSDictionary)
    func nncAnnotationChanged(_ payload: NSDictionary)
    func nncAnnotationsRemoved(_ payload: NSDictionary)
    func nncAnnotationsSelected(_ payload: NSDictionary)
    func nncAnnotationsDeselected(_ payload: NSDictionary)
    func nncAnnotationTapped(_ payload: NSDictionary)
    func nncTextSelected(_ payload: NSDictionary)
    func nncFormFieldValuesUpdated(_ payload: NSDictionary)
    func nncFormFieldSelected(_ payload: NSDictionary)
    func nncFormFieldDeselected(_ payload: NSDictionary)
    func nncAnalytics(_ payload: NSDictionary)
    func nncBookmarksChanged(_ payload: NSDictionary)
}

@objc public enum NotificationEvent: Int, RawRepresentable, CaseIterable {
    case documentLoaded
    case documentLoadFailed
    case documentPageChanged
    case documentScrolled
    case documentTapped
    case annotationsAdded
    case annotationChanged
    case annotationsRemoved
    case annotationsSelected
    case annotationsDeselected
    case annotationTapped
    case textSelected
    case formFieldValuesUpdated
    case formFieldSelected
    case formFieldDeselected
    case analytics
    case bookmarksChanged
    
    public typealias RawValue = String

    public var rawValue: RawValue {
        switch self {
            case .documentLoaded:
                return "documentLoaded"
            case .documentLoadFailed:
                return "documentLoadFailed"
            case .documentPageChanged:
                return "documentPageChanged"
            case .documentScrolled:
                return "documentScrolled"
            case .documentTapped:
                return "documentTapped"
            case .annotationsAdded:
                return "annotationsAdded"
            case .annotationChanged:
                return "annotationChanged"
            case .annotationsRemoved:
                return "annotationsRemoved"
            case .annotationsSelected:
                return "annotationsSelected"
            case .annotationsDeselected:
                return "annotationsDeselected"
            case .annotationTapped:
                return "annotationTapped"
            case .textSelected:
                return "textSelected"
            case .formFieldValuesUpdated:
                return "formFieldValuesUpdated"
            case .formFieldSelected:
                return "formFieldSelected"
            case .formFieldDeselected:
                return "formFieldDeselected"
            case .analytics:
                return "analytics"
            case .bookmarksChanged:
                return "bookmarksChanged"
        }
    }

    public init?(rawValue: RawValue) {
        switch rawValue {
            case "documentLoaded":
                self = .documentLoaded
            case "documentLoadFailed":
                self = .documentLoadFailed
            case "documentPageChanged":
                self = .documentPageChanged
            case "documentScrolled":
                self = .documentScrolled
            case "documentTapped":
                self = .documentTapped
            case "annotationCreated":
                self = .annotationsAdded
            case "annotationsAdded":
                self = .annotationChanged
            case "annotationsRemoved":
                self = .annotationsRemoved
            case "annotationsSelected":
                self = .annotationsSelected
            case "annotationsDeselected":
                self = .annotationsDeselected
            case "annotationTapped":
                self = .annotationTapped
            case "textSelected":
                self = .textSelected
            case "formFieldValuesUpdated":
                self = .formFieldValuesUpdated
            case "formFieldsSelected":
                self = .formFieldSelected
            case "formFieldsDeselected":
                self = .formFieldDeselected
            case "analytics":
                self = .analytics
            case "bookmarksChanged":
                self = .bookmarksChanged
            default:
                return nil
        }
    }
}

@objc public class CustomAnalyticsClient: NSObject, PDFAnalyticsClient {
    public func logEvent(_ event: PDFAnalytics.EventName, attributes: [String: Any]?) {
        NutrientNotificationCenter.shared.analyticsReceived(event: event.rawValue, attributes: attributes)
    }
}

@objc public class NutrientNotificationCenter: NSObject {
    
    private let customAnalyticsClient = CustomAnalyticsClient()
    private var internalEventEmitter: RCTEventEmitter? = nil
    @objc static public let shared = NutrientNotificationCenter()
    @objc public var isInUse = false
    private var lastProcessedId: String?
    @objc public weak var delegate: NutrientNotificationCenterDelegate?
    
    private override init() {}
    
    @objc public var eventEmitter : RCTEventEmitter? {
        get {
            return self.internalEventEmitter
        }
        set {
            self.internalEventEmitter = newValue
        }
    }
    
    private func createEventPayload(jsonData: Dictionary<String, Any>, componentID: Int) -> Dictionary<String, Any> {
        return ["data": jsonData, "componentID": NSNumber(value: componentID)]
    }
    
    private func routeEvent(_ name: NotificationEvent, payload: Dictionary<String, Any>) {
        // Exactly one path is active at compile time.
        #if RCT_NEW_ARCH_ENABLED
        // New Architecture: deliver via delegate only.
        guard let delegate = delegate else { return }
        let dict = payload as NSDictionary
        switch name {
            case .documentLoaded: delegate.nncDocumentLoaded(dict)
            case .documentLoadFailed: delegate.nncDocumentLoadFailed(dict)
            case .documentPageChanged: delegate.nncDocumentPageChanged(dict)
            case .documentScrolled: delegate.nncDocumentScrolled(dict)
            case .documentTapped: delegate.nncDocumentTapped(dict)
            case .annotationsAdded: delegate.nncAnnotationsAdded(dict)
            case .annotationChanged: delegate.nncAnnotationChanged(dict)
            case .annotationsRemoved: delegate.nncAnnotationsRemoved(dict)
            case .annotationsSelected: delegate.nncAnnotationsSelected(dict)
            case .annotationsDeselected: delegate.nncAnnotationsDeselected(dict)
            case .annotationTapped: delegate.nncAnnotationTapped(dict)
            case .textSelected: delegate.nncTextSelected(dict)
            case .formFieldValuesUpdated: delegate.nncFormFieldValuesUpdated(dict)
            case .formFieldSelected: delegate.nncFormFieldSelected(dict)
            case .formFieldDeselected: delegate.nncFormFieldDeselected(dict)
            case .analytics: delegate.nncAnalytics(dict)
            case .bookmarksChanged: delegate.nncBookmarksChanged(dict)
        }
        #else
        // Old Architecture: deliver via event emitter only.
        eventEmitter?.sendEvent(withName: name.rawValue, body: payload)
        #endif
    }
    
    @objc public func documentLoaded(documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentLoaded.rawValue, "documentID" : documentID]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.documentLoaded, payload: payload)
    }
    
    @objc public func documentLoadFailed(code: String, message: String, componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentLoadFailed.rawValue, "code" : code, "message" : message] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.documentLoadFailed, payload: payload)
    }
    
    @objc public func documentPageChanged(pageIndex: Int, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentPageChanged.rawValue,
                        "pageIndex" : pageIndex, "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.documentPageChanged, payload: payload)
    }
    
    @objc public func documentScrolled(spreadIndex: CGFloat, scrollDirection: ScrollDirection, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        
        let scrollData = scrollDirection == .horizontal ? ["currX" : spreadIndex] : ["currY" : spreadIndex]
        
        let jsonData = ["event" : NotificationEvent.documentScrolled.rawValue,
                        "scrollData" : scrollData, "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.documentScrolled, payload: payload)
    }
    
    @objc public func didTapDocument(tapPoint: CGPoint, pageIndex: Int, documentID: String, componentID: Int) {
        if (!isInUse) { return }

        let pointDictionary = ["x" : tapPoint.x , "y" : tapPoint.y]
        let jsonData = ["event" : NotificationEvent.documentTapped.rawValue,
                        "pageIndex" : pageIndex,
                        "point" : pointDictionary,
                        "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.documentTapped, payload: payload)
    }
        
    @objc public func annotationsChanged(notification: Notification, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        switch notification.name {
            case NSNotification.Name.PSPDFAnnotationChanged:
                if let annotation = notification.object as? Annotation {
                    if (annotation is FormElement) {
                        guard let eventId = annotation.uuid as String? ,
                                      lastProcessedId != eventId else { return }
                        if let formElement = annotation as? FormElement,
                           let annotationJSON = try? RCTConvert.instantJSON(from: formElement) {
                            let jsonData = ["event" : NotificationEvent.formFieldValuesUpdated.rawValue, "formField" : annotationJSON, "documentID" : documentID] as [String : Any]
                            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                            routeEvent(.formFieldValuesUpdated, payload: payload)
                        } else {
                            // Could not decode annotation data or annotation was not a FormElement
                        }
                        lastProcessedId = eventId
                        // Clear the ID after 100ms
                        DispatchQueue.global(qos: .background).asyncAfter(deadline: .now() + 0.1) {
                            self.lastProcessedId = nil
                        }
                    } else {
                        if let annotationJSON = try? RCTConvert.instantJSON(from: [annotation]) {
                            let jsonData = ["event" : NotificationEvent.annotationChanged.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                            routeEvent(.annotationChanged, payload: payload)
                        } else {
                            // Could not decode annotation data
                        }
                    }
                }
            break
            case NSNotification.Name.PSPDFAnnotationsAdded:
                if let annotations = notification.object as? [Annotation] {

                    if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                        let jsonData = ["event" : NotificationEvent.annotationsAdded.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                        routeEvent(.annotationsAdded, payload: payload)
                    } else {
                        // Could not decode annotation data
                    }
                }
            break
            case NSNotification.Name.PSPDFAnnotationsRemoved:
                if let annotations = notification.object as? [Annotation] {

                    if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                        let jsonData = ["event" : NotificationEvent.annotationsRemoved.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                        routeEvent(.annotationsRemoved, payload: payload)
                    } else {
                        // Could not decode annotation data
                    }
                }
            break
            default:
                // Unknown event
            break
        }
    }
    
    @objc public func didSelectAnnotations(annotations: [Annotation], documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let isFormElement = annotations.contains(where: { $0 is FormElement })
        
        if (isFormElement) {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations[0] as? FormElement) {
                let jsonData = ["event" : NotificationEvent.formFieldSelected.rawValue, "formField" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                routeEvent(.formFieldSelected, payload: payload)
            } else {
                // Could not decode annotation data
            }
        } else {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                let jsonData = ["event" : NotificationEvent.annotationsSelected.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                routeEvent(.annotationsSelected, payload: payload)
            } else {
                // Could not decode annotation data
            }
        }
    }
    
    @objc public func didDeselectAnnotations(annotations: [Annotation], documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let isFormElement = annotations.contains(where: { $0 is FormElement })
        
        if (isFormElement) {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations[0] as? FormElement) {
                let jsonData = ["event" : NotificationEvent.formFieldDeselected.rawValue, "formField" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                routeEvent(.formFieldDeselected, payload: payload)
            } else {
                // Could not decode annotation data
            }
        } else {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                let jsonData = ["event" : NotificationEvent.annotationsDeselected.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                routeEvent(.annotationsDeselected, payload: payload)
            } else {
                // Could not decode annotation data
            }
        }
    }
    
    @objc public func didTapAnnotation(annotation: Annotation, annotationPoint: CGPoint, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        if let annotationJSON = try? RCTConvert.instantJSON(from: [annotation]) {
            let annotationDict = annotationJSON.first ?? [:]
            let pointDictionary = ["x" : annotationPoint.x , "y" : annotationPoint.y]
            let jsonData = ["event" : NotificationEvent.annotationTapped.rawValue,
                            "annotation" : annotationDict,
                            "annotationPoint" : pointDictionary,
                            "documentID" : documentID] as [String : Any]
            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
            routeEvent(.annotationTapped, payload: payload)
        } else {
            // Could not decode annotation data
        }
    }
    
    @objc public func didSelectText(text: String, rect: CGRect, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let rectDictionary = ["x" : rect.minX , "y" : rect.minY, "width" : rect.width, "height" : rect.height]
        let jsonData = ["event" : NotificationEvent.textSelected.rawValue,
                         "text" : text,
                         "rect" : rectDictionary, "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        routeEvent(.textSelected, payload: payload)
    }
    
    @objc public func bookmarksChanged(notification: Notification, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        
        if let bookmarkManager = notification.object as? BookmarkManager {
            let bookmarks = bookmarkManager.bookmarks
            let allBookmarksJSON = RCTConvert.bookmarksToJSON(bookmarks)
            
            let jsonData = ["event" : NotificationEvent.bookmarksChanged.rawValue,
                            "bookmarks" : allBookmarksJSON,
                            "documentID" : documentID] as [String : Any]
            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
            routeEvent(.bookmarksChanged, payload: payload)
        }
    }
    
    @objc public func analyticsEnabled() {
        PSPDFKit.SDK.shared.analytics.add(customAnalyticsClient)
        PSPDFKit.SDK.shared.analytics.enabled = true
    }
    
    @objc public func analyticsDisabled() {
        PSPDFKit.SDK.shared.analytics.enabled = false
        PSPDFKit.SDK.shared.analytics.remove(customAnalyticsClient)
    }
    
    @objc public func analyticsReceived(event: String, attributes: [String: Any]?) {
        if (!isInUse) { return }
        var jsonData = ["event" : NotificationEvent.analytics.rawValue, "analyticsEvent" : event] as [String : Any]
        if let attributes = attributes {
            jsonData["attributes"] = attributes
        }
        let payload = createEventPayload(jsonData: jsonData, componentID: 0)
        routeEvent(.analytics, payload: payload)
    }
}
