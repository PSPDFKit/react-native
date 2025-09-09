//
//  NutrientNotificationCenter.swift
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
import React
import PSPDFKit

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
    
    @objc public func documentLoaded(documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentLoaded.rawValue, "documentID" : documentID]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        eventEmitter?.sendEvent(withName:NotificationEvent.documentLoaded.rawValue,
                               body: payload)
    }
    
    @objc public func documentLoadFailed(componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentLoadFailed.rawValue]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        eventEmitter?.sendEvent(withName:NotificationEvent.documentLoadFailed.rawValue,
                               body: payload)
    }
    
    @objc public func documentPageChanged(pageIndex: Int, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        let jsonData = ["event" : NotificationEvent.documentPageChanged.rawValue,
                        "pageIndex" : pageIndex, "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        eventEmitter?.sendEvent(withName:NotificationEvent.documentPageChanged.rawValue,
                               body: payload)
    }
    
    @objc public func documentScrolled(spreadIndex: CGFloat, scrollDirection: ScrollDirection, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        
        let scrollData = scrollDirection == .horizontal ? ["currX" : spreadIndex] : ["currY" : spreadIndex]
        
        let jsonData = ["event" : NotificationEvent.documentScrolled.rawValue,
                        "scrollData" : scrollData, "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        eventEmitter?.sendEvent(withName:NotificationEvent.documentScrolled.rawValue,
                               body: payload)
    }
    
    @objc public func didTapDocument(tapPoint: CGPoint, pageIndex: Int, documentID: String, componentID: Int) {
        if (!isInUse) { return }

        let pointDictionary = ["x" : tapPoint.x , "y" : tapPoint.y]
        let jsonData = ["event" : NotificationEvent.documentTapped.rawValue,
                        "pageIndex" : pageIndex,
                        "point" : pointDictionary,
                        "documentID" : documentID] as [String : Any]
        let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
        eventEmitter?.sendEvent(withName:NotificationEvent.documentTapped.rawValue,
                               body: payload)
    }
        
    @objc public func annotationsChanged(notification: Notification, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        switch notification.name {
            case NSNotification.Name.PSPDFAnnotationChanged:
                if let annotation = notification.object as? Annotation {
                    if (annotation is FormElement) {
                        if let annotationJSON = try? RCTConvert.instantJSON(from: annotation as? FormElement) {
                            let jsonData = ["event" : NotificationEvent.formFieldValuesUpdated.rawValue, "formField" : annotationJSON, "documentID" : documentID] as [String : Any]
                            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                            eventEmitter?.sendEvent(withName:NotificationEvent.formFieldValuesUpdated.rawValue,
                                                    body: payload)
                        } else {
                            // Could not decode annotation data
                        }
                    } else {
                        if let annotationJSON = try? RCTConvert.instantJSON(from: [annotation]) {
                            let jsonData = ["event" : NotificationEvent.annotationChanged.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                            eventEmitter?.sendEvent(withName:NotificationEvent.annotationChanged.rawValue, body: payload)
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
                        eventEmitter?.sendEvent(withName:NotificationEvent.annotationsAdded.rawValue, body: payload)
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
                        eventEmitter?.sendEvent(withName:NotificationEvent.annotationsRemoved.rawValue, body: payload)
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
                eventEmitter?.sendEvent(withName:NotificationEvent.formFieldSelected.rawValue,
                                       body: payload)
            } else {
                // Could not decode annotation data
            }
        } else {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                let jsonData = ["event" : NotificationEvent.annotationsSelected.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                eventEmitter?.sendEvent(withName:NotificationEvent.annotationsSelected.rawValue,
                                        body: payload)
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
                eventEmitter?.sendEvent(withName:NotificationEvent.formFieldDeselected.rawValue,
                                       body: payload)
            } else {
                // Could not decode annotation data
            }
        } else {
            if let annotationJSON = try? RCTConvert.instantJSON(from: annotations) {
                let jsonData = ["event" : NotificationEvent.annotationsDeselected.rawValue, "annotations" : annotationJSON, "documentID" : documentID] as [String : Any]
                let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
                eventEmitter?.sendEvent(withName:NotificationEvent.annotationsDeselected.rawValue,
                                       body: payload)
            } else {
                // Could not decode annotation data
            }
        }
    }
    
    @objc public func didTapAnnotation(annotation: Annotation, annotationPoint: CGPoint, documentID: String, componentID: Int) {
        if (!isInUse) { return }
        if let annotationJSON = try? RCTConvert.instantJSON(from: [annotation]) {
            let pointDictionary = ["x" : annotationPoint.x , "y" : annotationPoint.y]
            let jsonData = ["event" : NotificationEvent.annotationTapped.rawValue,
                            "annotation" : annotationJSON,
                            "annotationPoint" : pointDictionary,
                            "documentID" : documentID] as [String : Any]
            let payload = createEventPayload(jsonData: jsonData, componentID: componentID)
            eventEmitter?.sendEvent(withName:NotificationEvent.annotationTapped.rawValue,
                                   body: payload)
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
        eventEmitter?.sendEvent(withName:NotificationEvent.textSelected.rawValue,
                               body: payload)
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
            eventEmitter?.sendEvent(withName:NotificationEvent.bookmarksChanged.rawValue,
                                   body: payload)
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
        eventEmitter?.sendEvent(withName:NotificationEvent.analytics.rawValue,
                               body: payload)
    }
}
