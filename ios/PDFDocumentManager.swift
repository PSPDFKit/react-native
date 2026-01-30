//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React
import PSPDFKit

@objc public protocol PDFDocumentManagerDelegate {
    @objc optional func didReceiveAnnotationChange(change: String, annotations: Array<Annotation>)
    @objc optional func reloadControllerData()
}

@objc(PDFDocumentManager) public class PDFDocumentManager: NSObject {
    
    var documents = [NSNumber:Document]()
    @objc public var delegate: PDFDocumentManagerDelegate?
    private let queue = DispatchQueue(label: "io.nutrient.reactnative.documentmanager")
    
    private func getDocument(_ reference: NSNumber) -> Document? {
        var result: Document?
        queue.sync {
            result = documents[reference]
        }
        return result
    }
    
    @objc public func setDocument(_ document: Document, reference: NSNumber) {
        queue.async {
            self.documents[reference] = document
        }
    }
    
    @objc static public func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc func getPageCount(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getPageCount", "Document is nil", nil)
            return
        }
        onSuccess(document.pageCount);
    }
    
    @objc func isEncrypted(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("isEncrypted", "Document is nil", nil)
            return
        }
        onSuccess(document.isEncrypted);
    }
    
    @objc func getPageInfo(_ reference: NSNumber, pageIndex: Int, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getPageInfo", "Document is nil", nil)
            return
        }
        
        guard let pageInfo = document.pageInfoForPage(at: PageIndex(pageIndex)) else {
            onError("getPageInfo", "Could not retrieve page info", nil)
            return
        }
        
        let sizeDictionary = ["width" : pageInfo.size.width, "height" : pageInfo.size.height]
        let pageInfoDictionary = ["savedRotation" : pageInfo.savedRotation.rawValue,
                                  "size" : sizeDictionary] as [String : Any]
        onSuccess(pageInfoDictionary);
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
        document.clearCache()
        onSuccess(true)
    }
    
    @objc func save(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("save", "Document is nil", nil)
            return
        }
        
        document.save { result in
            switch result {
            case .success:
                onSuccess(true)
                return
            case .failure(let error):
                onError("save", error.localizedDescription, nil)
                return
            }
        }
    }
    
    @objc func getAllUnsavedAnnotations(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getAllUnsavedAnnotations", "Document is nil", nil)
            return
        }
        guard let documentProvider = document.documentProviders.first else {
            onError("getAllUnsavedAnnotations", "DocumentProvider is nil", nil)
            return
        }
        guard let data = try? document.generateInstantJSON(from: documentProvider) else {
            onError("getAllUnsavedAnnotations", "Could not export annotations", nil)
            return
        }
        if let json = try? JSONSerialization.jsonObject(with: data) {
            onSuccess(json)
        } else {
            onError("getAllUnsavedAnnotations", "Could not export annotations", nil)
        }
    }
    
    @objc func getFormElements(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getFormFields", "Document is nil", nil)
            return
        }
        
        guard let allFormElements = document.formParser?.forms else {
            onError("getFormFields", "No form elements found", nil)
            return
        }
        
        var formElementsJSON = [[String: Any]]()
        
        for formElement in allFormElements {
            var elementJSON: [String: Any]
            
            if let buttonElement = formElement as? ButtonFormElement {
                elementJSON = RCTConvert.buttonFormElementToJSON(buttonElement)
                elementJSON["formTypeName"] = "button"
            } else if let choiceElement = formElement as? ChoiceFormElement {
                elementJSON = RCTConvert.choiceFormElementToJSON(choiceElement)
                elementJSON["formTypeName"] = "choice"
            } else if let signatureElement = formElement as? SignatureFormElement {
                elementJSON = RCTConvert.signatureFormElementToJSON(signatureElement)
                elementJSON["formTypeName"] = "signature"
            } else if let textFieldElement = formElement as? TextFieldFormElement {
                elementJSON = RCTConvert.textFieldFormElementToJSON(textFieldElement)
                elementJSON["formTypeName"] = "textField"
            } else {
                // Handle any other form element types or skip them
                continue
            }
            
            formElementsJSON.append(elementJSON)
        }
        
        onSuccess(formElementsJSON)
    }
    
    @objc func updateFormFieldValue(_ reference: NSNumber, fullyQualifiedName: String, value: Any, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("updateFormFieldValue", "Document is nil", nil)
            return
        }
        
        guard let formElements = document.formParser?.forms else {
            onError("updateFormFieldValue", "No form elements found", nil)
            return
        }
        
        var success = false
        
        for formElement in formElements {
            if formElement.fullyQualifiedFieldName == fullyQualifiedName ||
                formElement.formField?.fullyQualifiedName == fullyQualifiedName {
                if let buttonElement = formElement as? ButtonFormElement {
                    if let boolValue = value as? Bool {
                        if boolValue {
                            buttonElement.select()
                        } else {
                            buttonElement.deselect()
                        }
                        success = true
                    }
                } else if let choiceElement = formElement as? ChoiceFormElement {
                    if let arrayValue = value as? [Int] {
                        var indices = IndexSet()
                        for index in arrayValue {
                            indices.insert(index)
                        }
                        choiceElement.selectedIndices = indices
                        success = true
                    } else if let customTextValue = value as? String {
                        choiceElement.customText = customTextValue
                        success = true
                    }
                } else if let textFieldElement = formElement as? TextFieldFormElement {
                    if let stringValue = value as? String {
                        textFieldElement.contents = stringValue
                        success = true
                    }
                }
                break
            }
        }
        
        if success {
            onSuccess(true)
        } else {
            onError("updateFormFieldValue", "Could not update form field value", nil)
        }
    }
    
    @objc func getAnnotations(_ reference: NSNumber, type: String?, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getAnnotations", "Document is nil", nil)
            return
        }
        
        let allAnnotations = document.allAnnotations(of: type == nil ?
            .all : RCTConvert.annotationType(fromInstantJSONType: type))
            .flatMap({ $0.value })
        
        if let allAnnotationsJSON = try? RCTConvert.instantJSON(from: allAnnotations) {
            onSuccess(allAnnotationsJSON)
        } else {
            onError("getAnnotations", "Could not export annotations", nil)
        }
    }
    
    @objc func getAnnotationsForPage(_ reference: NSNumber, pageIndex: Int, type: String?, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getAnnotationsForPage", "Document is nil", nil)
            return
        }
        
        let allAnnotations = document.annotationsForPage(at: PageIndex(pageIndex), type: type == nil ? .all : RCTConvert.annotationType(fromInstantJSONType: type))
       
        if let allAnnotationsJSON = try? RCTConvert.instantJSON(from: allAnnotations) {
            onSuccess(allAnnotationsJSON)
        } else {
            onError("getAnnotationsForPage", "Could not export annotations", nil)
        }
    }
    
    @objc func removeAnnotations(_ reference: NSNumber, instantJSON: Array<Dictionary<String, Any>>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("removeAnnotations", "Document is nil", nil)
            return
        }
        var annotationsToDelete = Array<Annotation>()
        let allAnnotations = document.allAnnotations(of: .all).flatMap({ $0.value })
        for annotation in allAnnotations {
            for instantJSONAnnotation in instantJSON {
                if let instantJSONName = instantJSONAnnotation["name"] as? String {
                    if (annotation.name == instantJSONName) {
                        annotationsToDelete.append(annotation)
                        break
                    }
                }
                if let instantJSONUUID = instantJSONAnnotation["uuid"] as? String {
                    if (annotation.uuid == instantJSONUUID) {
                        annotationsToDelete.append(annotation)
                        break
                    }
                }
            }
        }
        
        if (annotationsToDelete.isEmpty) {
            onError("removeAnnotations", "No annotations found to delete", nil)
            return
        }
        let result = document.remove(annotations: annotationsToDelete)
        onSuccess(result)
    }
    
    @objc func addAnnotations(_ reference: NSNumber, instantJSON: Any, attachments: Dictionary<String, Any>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("addAnnotations", "Document is nil", nil)
            return
        }
        
        // This API is now used to add ONLY annotation objects to a document - the old functionality to apply document JSON has moved to the more aptly named applyInstantJSON.
        // For backwards compatibility, first check whether the API is being called with a full Document JSON object, and then redirect the call to applyInstantJSON.
        // Can be removed after customer migration is complete.
        
        if let instantJSON = instantJSON as? Dictionary<String, Any> {
            self.applyInstantJSON(reference, instantJSON: instantJSON, onSuccess: onSuccess, onError: onError)
            return
        } else if let instantJSONArray = instantJSON as? Array<Dictionary<String, Any>> {
            guard let documentProvider = document.documentProviders.first else {
                onError("addAnnotations", "DocumentProvider is nil", nil)
                return
            }
            
            for annotationDictionary in instantJSONArray {
                let annotationMutableDictionary = NSMutableDictionary(dictionary: annotationDictionary)
                annotationMutableDictionary.removeObject(forKey: "constructor")
                if let annotationData = try? JSONSerialization.data(withJSONObject: annotationMutableDictionary) {

                    let attachmentDataProvider: DataProviding?
                    if let attachmentId = annotationMutableDictionary["imageAttachmentId"] as? String {
                        guard let attachment = attachments[attachmentId] as? Dictionary<String, Any>,
                              let base64String = attachment["binary"] as? String,
                              let attachmentData = Data(base64Encoded: base64String) else {
                            onError("addAnnotations", "Failed to process attachment data", nil)
                            return
                        }
                        attachmentDataProvider = DataContainerProvider(data: attachmentData)
                    } else {
                        attachmentDataProvider = nil
                    }

                    do {
                        try documentProvider.addAnnotation(fromInstantJSON: annotationData, attachmentDataProvider: attachmentDataProvider)
                    } catch {
                        onError("addAnnotations", error.localizedDescription, nil)
                        return
                    }
                }
            }
            onSuccess(true)
        } else {
            onError("addAnnotations", "Cannot parse annotation data", nil)
            return
        }
    }
    
    @objc func applyInstantJSON(_ reference: NSNumber, instantJSON: Dictionary<String, Any>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("applyInstantJSON", "Document is nil", nil)
            return
        }
    
        do {
            let data = try JSONSerialization.data(withJSONObject: instantJSON)
            let dataContainerProvider = DataContainerProvider(data: data)
            
            guard let documentProvider = document.documentProviders.first else {
                onError("applyInstantJSON", "DocumentProvider is nil", nil)
                return
            }
            
            do {
                try document.applyInstantJSON(fromDataProvider: dataContainerProvider, to: documentProvider, lenient: false)
                
                // Calculate the diff to get the full Annotation data (most importantly the uuid) before calling onAnnotationsChanged
                var annotationArray = Array<Annotation>()
                let allAnnotations = document.allAnnotations(of: .all).flatMap({ $0.value })
                for annotation in allAnnotations {
                    if let annotations = instantJSON["annotations"] as? Array<Dictionary<String, Any>> {
                        for addedAnnotation in annotations {
                            if let instantJSONName = addedAnnotation["name"] as? String {
                                if (annotation.name == instantJSONName) {
                                    annotationArray.append(annotation)
                                    break
                                }
                            }
                        }
                    }
                }
                
                // Delegate to RCTPSPDFKitView to reload controller data
                delegate?.reloadControllerData?()
                onSuccess(true)
                // Emit the onAnnotationsChanged event since document.applyInstantJSON doesn't trigger the event on iOS
                delegate?.didReceiveAnnotationChange?(change: "added", annotations: annotationArray)
                return
            }
            catch {
                onError("applyInstantJSON", error.localizedDescription, nil)
                return
            }
        } catch {
            onError("applyInstantJSON", "Cannot serialize instantJSON data", nil)
            return
        }
    }
    
    @objc func importXFDF(_ reference: NSNumber, filePath: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("importXFDF", "Document is nil", nil)
            return
        }
        
        guard let externalAnnotationsFile = RCTConvert.parseURL(filePath) else {
            onError("importXFDF", "Could not find XFDF file", nil)
            return
        }
        
        guard let documentProvider = document.documentProviders.first else {
            onError("importXFDF", "DocumentProvider is nil", nil)
            return
        }
        
        let dataProvider = FileDataProvider(fileURL: externalAnnotationsFile)
        let parser = XFDFParser(dataProvider: dataProvider, documentProvider: documentProvider)
        guard let annotations = try? parser.parse() else {
            onError("importXFDF", "Could not parse XFDF annotations", nil)
            return
        }
        
        let result = document.add(annotations: annotations)
        let response = ["success" : result]
        onSuccess(response)
    }
    
    @objc func exportXFDF(_ reference: NSNumber, filePath: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("exportXFDF", "Document is nil", nil)
            return
        }
        
        guard let externalAnnotationsFile = RCTConvert.parseURL(filePath) else {
            onError("exportXFDF", "Could not find XFDF file", nil)
            return
        }
        
        guard let documentProvider = document.documentProviders.first else {
            onError("exportXFDF", "DocumentProvider is nil", nil)
            return
        }
        
        let allAnnotations = document.allAnnotations(of: .all).flatMap({ $0.value })
        guard let dataSink = try? FileDataSink(fileURL: externalAnnotationsFile) else {
            onError("exportXFDF", "Could open XFDF file", nil)
            return
        }
        
        guard let result = try? XFDFWriter().write(allAnnotations, to: dataSink, documentProvider: documentProvider) else {
            onError("exportXFDF", "Could not write to XFDF file", nil)
            return
        }
        let response = ["success" : true, "filePath" : filePath] as [String : Any]
        onSuccess(response)
    }
    
    @objc func getBookmarks(_ reference: NSNumber, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getBookmarks", "Document is nil", nil)
            return
        }
        
        if let allBookmarks = document.bookmarkManager?.bookmarks {
            let allBookmarksJSON = RCTConvert.bookmarksToJSON(allBookmarks)
            onSuccess(allBookmarksJSON)
        } else {
            onError("getBookmarks", "Could not export bookmarks", nil)
        }
    }
    
    @objc func addBookmarks(_ reference: NSNumber, bookmarks: Array<Dictionary<String, Any>>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("addBookmarks", "Document is nil", nil)
            return
        }
        
        guard let bookmarkManager = document.bookmarkManager else {
            onError("addBookmarks", "Bookmark manager is nil", nil)
            return
        }
        
        let bookmarkObjects = RCTConvert.JSONToBookmarks(bookmarks)
        for bookmark in bookmarkObjects {
            bookmarkManager.addBookmark(bookmark)
        }
        
        onSuccess(true)
    }
    
    @objc func removeBookmarks(_ reference: NSNumber, bookmarks: Array<Dictionary<String, Any>>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("removeBookmarks", "Document is nil", nil)
            return
        }
        
        guard let bookmarkManager = document.bookmarkManager else {
            onError("removeBookmarks", "Bookmark manager is nil", nil)
            return
        }
        
        let bookmarkObjects = RCTConvert.JSONToBookmarks(bookmarks)
        for bookmark in bookmarkObjects {
            bookmarkManager.removeBookmark(bookmark)
        }
        
        onSuccess(true)
    }
    
    @objc func getOverlappingSignature(_ reference: NSNumber, fullyQualifiedName: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getOverlappingSignature", "Document is nil", nil)
            return
        }
        
        guard let formElements = document.formParser?.forms else {
            onError("getOverlappingSignature", "No form elements found", nil)
            return
        }
        
        var overlapping: Annotation?
        
        for formElement in formElements {
            if formElement.fullyQualifiedFieldName == fullyQualifiedName {
                if let signatureElement = formElement as? SignatureFormElement {
                    overlapping = signatureElement.overlappingSignatureAnnotation
                }
                break
            }
        }
        
        guard let overlappingAnnotation = overlapping else {
            onError("getOverlappingSignature", "No overlaps found", nil)
            return
        }
        
        if let allAnnotationsJSON = try? RCTConvert.instantJSON(from: [overlappingAnnotation]) {
            onSuccess(allAnnotationsJSON.first)
        } else {
            onError("getOverlappingSignature", "Could not export annotations", nil)
        }
    }

    @objc func setAnnotationFlags(_ reference: NSNumber, uuid: String, flags: [String], onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("setAnnotationFlags", "Document is nil", nil)
            return
        }

        let allAnnotations = document.allAnnotations(of: .all).flatMap { $0.value }
        for annotation in allAnnotations {
            if annotation.uuid == uuid || (annotation.name != nil && annotation.name == uuid) {
                let convertedFlags = RCTConvert.parseAnnotationFlags(flags: flags)
                annotation.flags = Annotation.Flag(rawValue: convertedFlags)
                if let provider = document.documentProviders.first {
                    provider.annotationManager.update([annotation], animated: true)
                }
                onSuccess(true)
                return
            }
        }
        onSuccess(false)
    }

    @objc func getAnnotationFlags(_ reference: NSNumber, uuid: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getAnnotationFlags", "Document is nil", nil)
            return
        }

        let allAnnotations = document.allAnnotations(of: .all).flatMap { $0.value }
        for annotation in allAnnotations {
            if annotation.uuid == uuid || (annotation.name != nil && annotation.name == uuid) {
                let converted = RCTConvert.convertAnnotationFlags(flags: annotation.flags.rawValue)
                onSuccess(converted)
                return
            }
        }
        onSuccess([])
    }
    
    @objc func updateAnnotations(_ reference: NSNumber, instantJSON: Array<Dictionary<String, Any>>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("updateAnnotations", "Document is nil", nil)
            return
        }
        
        guard let documentProvider = document.documentProviders.first else {
            onError("updateAnnotations", "DocumentProvider is nil", nil)
            return
        }
        
        var annotationsToUpdate = Array<Annotation>()
        let allAnnotations = document.allAnnotations(of: .all).flatMap { $0.value }
        
        // Match annotations and apply changes
        for updateDict in instantJSON {
            // Find the annotation by uuid or name
            var foundAnnotation: Annotation?
            
            for annotation in allAnnotations {
                if let updateUUID = updateDict["uuid"] as? String, annotation.uuid == updateUUID {
                    foundAnnotation = annotation
                    break
                }
                if let updateName = updateDict["name"] as? String, 
                   annotation.name != nil && annotation.name == updateName {
                    foundAnnotation = annotation
                    break
                }
            }
            
            guard let annotation = foundAnnotation else {
                continue // Skip if annotation not found
            }
            
            // Apply changed properties from dictionary
            // Iterate through all keys in the dictionary (excluding uuid/name which are just for matching)
            for (key, value) in updateDict {
                // Skip uuid and name - they're only for matching
                if key == "uuid" || key == "name" {
                    continue
                }
                
                // Apply property based on key
                applyPropertyToAnnotation(annotation: annotation, key: key, value: value, document: document)
            }
            
            annotationsToUpdate.append(annotation)
        }
        
        if annotationsToUpdate.isEmpty {
            onError("updateAnnotations", "No annotations found to update", nil)
            return
        }
        
        // Notify the system that annotations changed
        documentProvider.annotationManager.update(annotationsToUpdate, animated: true)
        
        onSuccess(true)
    }
    
    // Helper function to apply individual properties to annotations
    private func applyPropertyToAnnotation(annotation: Annotation, key: String, value: Any, document: Document) {
        switch key {
        case "bbox":
            // bbox format: [left, top, width, height]
            // CGRect format: (x, y, width, height) where x=left, y=top
            if let bboxArray = value as? [Double], bboxArray.count == 4 {
                annotation.boundingBox = CGRect(
                    x: bboxArray[0],      // left -> x
                    y: bboxArray[1],      // top -> y
                    width: bboxArray[2],  // width
                    height: bboxArray[3]  // height
                )
            }
            
        case "opacity":
            if let opacity = value as? Double {
                annotation.alpha = CGFloat(opacity)
            }
            
        case "color":
            if let colorString = value as? String {
                annotation.color = UIColor(hexString: colorString) ?? annotation.color
            }
            
        case "flags":
            if let flagsArray = value as? [String] {
                let convertedFlags = RCTConvert.parseAnnotationFlags(flags: flagsArray)
                annotation.flags = Annotation.Flag(rawValue: convertedFlags)
            }
            
        case "subject":
            if let subject = value as? String {
                annotation.subject = subject
            }
            
        case "group":
            if let group = value as? String {
                annotation.group = group
            }
            
        case "hidden":
            if let hidden = value as? Bool {
                if hidden {
                    annotation.flags.insert(.hidden)
                } else {
                    annotation.flags.remove(.hidden)
                }
            }
            
        case "locked":
            if let locked = value as? Bool {
                if locked {
                    annotation.flags.insert(.locked)
                } else {
                    annotation.flags.remove(.locked)
                }
            }
            
        case "lockedContents":
            if let lockedContents = value as? Bool {
                if lockedContents {
                    annotation.flags.insert(.lockedContents)
                } else {
                    annotation.flags.remove(.lockedContents)
                }
            }
            
        case "noPrint":
            if let noPrint = value as? Bool {
                if noPrint {
                    annotation.flags.remove(.print)
                } else {
                    annotation.flags.insert(.print)
                }
            }
            
        case "noView":
            if let noView = value as? Bool {
                if noView {
                    annotation.flags.insert(.noView)
                } else {
                    annotation.flags.remove(.noView)
                }
            }
            
        case "readOnly":
            if let readOnly = value as? Bool {
                if readOnly {
                    annotation.flags.insert(.readOnly)
                } else {
                    annotation.flags.remove(.readOnly)
                }
            }
            
        case "note":
            if let note = value as? String {
                annotation.contents = note
            }
            
        // Type-specific properties
        case "lineWidth":
            if let inkAnnotation = annotation as? InkAnnotation,
               let lineWidth = value as? Double {
                inkAnnotation.lineWidth = CGFloat(lineWidth)
            }
            
        case "fillColor":
            if let colorString = value as? String {
                annotation.fillColor = UIColor(hexString: colorString) ?? annotation.fillColor
            }
            
        case "strokeWidth":
            if let strokeWidth = value as? Double {
                annotation.lineWidth = CGFloat(strokeWidth)
            }
            
        case "strokeDashArray":
            if let dashArray = value as? [Double], dashArray.count == 2 {
                annotation.dashArray = [CGFloat(dashArray[0]), CGFloat(dashArray[1])]
            }
            
        case "cloudyBorderIntensity":
            if let intensity = value as? Double {
                annotation.borderEffectIntensity = CGFloat(intensity)
            }
            
        case "fontSize":
            if let textAnnotation = annotation as? FreeTextAnnotation,
               let fontSize = value as? Double {
                textAnnotation.fontSize = CGFloat(fontSize)
            }
            
        case "fontColor":
            if let textAnnotation = annotation as? FreeTextAnnotation,
               let colorString = value as? String {
                textAnnotation.color = UIColor(hexString: colorString) ?? textAnnotation.color
            }
            
        case "text":
            if let textAnnotation = annotation as? FreeTextAnnotation {
                if let textString = value as? String {
                    textAnnotation.contents = textString
                }
            } else if let noteAnnotation = annotation as? NoteAnnotation {
                if let textString = value as? String {
                    noteAnnotation.contents = textString
                }
            }
            
        case "rotation":
            if let freeTextAnnotation = annotation as? FreeTextAnnotation,
               let rotation = value as? Double {
                freeTextAnnotation.setRotation(UInt(rotation), updateBoundingBox: true)
            }
            
        case "backgroundColor":
            if let inkAnnotation = annotation as? InkAnnotation,
               let colorString = value as? String {
                inkAnnotation.fillColor = UIColor(hexString: colorString) ?? inkAnnotation.fillColor
            }
                        
        case "startPoint":
            if let lineAnnotation = annotation as? LineAnnotation,
               let pointArray = value as? [Double], pointArray.count == 2 {
                lineAnnotation.point1 = CGPoint(x: pointArray[0], y: pointArray[1])
            }
            
        case "endPoint":
            if let lineAnnotation = annotation as? LineAnnotation,
               let pointArray = value as? [Double], pointArray.count == 2 {
                lineAnnotation.point2 = CGPoint(x: pointArray[0], y: pointArray[1])
            }
            
        case "isSignature":
            if let inkAnnotation = annotation as? InkAnnotation,
               let isSignature = value as? Bool {
                inkAnnotation.isSignature = isSignature
            } else if let stampAnnotation = annotation as? StampAnnotation,
                      let isSignature = value as? Bool {
                stampAnnotation.isSignature = isSignature
            }
            
        case "lines":
            if let inkAnnotation = annotation as? InkAnnotation,
               let linesDict = value as? [String: Any],
               let pointsArray = linesDict["points"] as? [[[Double]]] {
                // Parse nested array structure: strokes -> points -> [x, y]
                // Also parse intensities if available: strokes -> intensities
                let intensitiesArray = linesDict["intensities"] as? [[Double]]
                
                // CRITICAL: Convert from Instant JSON coordinates to PDF coordinates
                // Instant JSON: top-left origin, Y increases downward (Y=0 at top)
                // PDF coordinates: bottom-left origin, Y increases upward (Y=0 at bottom)
                // Conversion: pdfY = pageHeight - instantJsonY
                let pageInfo = document.pageInfoForPage(at: annotation.pageIndex)
                let pageHeight = pageInfo?.size.height ?? 0
                
                var strokes: [[DrawingPoint]] = []
                
                for (strokeIndex, strokeArray) in pointsArray.enumerated() {
                    var stroke: [DrawingPoint] = []
                    // Get intensities for this stroke if available
                    let strokeIntensities: [Double] = {
                        if let intensities = intensitiesArray,
                           strokeIndex < intensities.count {
                            return intensities[strokeIndex]
                        }
                        return []
                    }()
                    
                    for (pointIndex, pointArray) in strokeArray.enumerated() {
                        if pointArray.count >= 2 {
                            // Points come in Instant JSON format: [x, y] with top-left origin
                            // PSPDFKit's lines property expects PDF coordinates: bottom-left origin
                            let instantJsonX = CGFloat(pointArray[0])
                            let instantJsonY = CGFloat(pointArray[1])
                            
                            // Convert to PDF coordinates
                            let pdfX = instantJsonX  // X stays the same
                            let pdfY = pageHeight > 0 ? pageHeight - instantJsonY : instantJsonY  // Flip Y: pdfY = pageHeight - instantJsonY
                            
                            // Get intensity for this point, default to 1.0 if not available
                            let intensity = pointIndex < strokeIntensities.count
                                ? CGFloat(strokeIntensities[pointIndex])
                                : 1.0
                            // Convert CGPoint to DrawingPoint with intensity (now in PDF coordinates)
                            stroke.append(DrawingPoint(location: CGPoint(x: pdfX, y: pdfY), intensity: intensity))
                        }
                    }
                    if !stroke.isEmpty {
                        strokes.append(stroke)
                    }
                }
                
                // Set the lines property on the InkAnnotation (expects PDF coordinates)
                inkAnnotation.lines = strokes
            }
        
        default:
            // Not implemented
            break
        }
    }

    @objc func getPageTextRects(_ reference: NSNumber, pageIndex: Int, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("getPageTextRects", "Document is nil", nil)
            return
        }
        
        guard let parser = document.textParserForPage(at: PageIndex(pageIndex)) else {
            onError("getPageTextRects", "Could not get text parser for page", nil)
            return
        }
        
        var wordRects = [[String: Any]]()
        
        for word in parser.words {
            let frame = word.frame
            let wordDict: [String: Any] = [
                "text": word.stringValue,
                "frame": [
                    "x": frame.origin.x,
                    "y": frame.origin.y,
                    "width": frame.size.width,
                    "height": frame.size.height
                ]
            ]
            wordRects.append(wordDict)
        }
        
        onSuccess(wordRects)
    }
    
    @objc func addElectronicSignatureFormField(_ reference: NSNumber, signatureData: Dictionary<String, Any>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("addElectronicSignatureFormField", "Document is nil", nil)
            return
        }
        
        guard let documentProvider = document.documentProviders.first else {
            onError("addElectronicSignatureFormField", "DocumentProvider is nil", nil)
            return
        }
        
        guard let bboxArray = signatureData["bbox"] as? Array<NSNumber>,
              bboxArray.count == 4,
              let pageIndex = signatureData["pageIndex"] as? Int,
              let fullyQualifiedName = signatureData["fullyQualifiedName"] as? String else {
            onError("addElectronicSignatureFormField", "Invalid signature data", nil)
            return
        }
        
        // Convert bbox array [left, top, right, bottom] to CGRect (x, y, width, height)
        let left = bboxArray[0].floatValue
        let top = bboxArray[1].floatValue
        let right = bboxArray[2].floatValue
        let bottom = bboxArray[3].floatValue
        
        let signatureFormElement = SignatureFormElement()
        signatureFormElement.boundingBox = CGRect(
            x: CGFloat(left),
            y: CGFloat(bottom),
            width: CGFloat(right - left),
            height: CGFloat(top - bottom)
        )
        signatureFormElement.pageIndex = PageIndex(pageIndex)
        
        do {
            _ = try SignatureFormField.insertedSignatureField(
                withFullyQualifiedName: fullyQualifiedName,
                documentProvider: documentProvider,
                formElement: signatureFormElement
            )
            
            onSuccess(true)
        } catch {
            onError("addElectronicSignatureFormField", error.localizedDescription, error as NSError)
        }
    }
    
    @objc func addTextFormField(_ reference: NSNumber, formData: Dictionary<String, Any>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("addTextFormField", "Document is nil", nil)
            return
        }
        
        guard let documentProvider = document.documentProviders.first else {
            onError("addTextFormField", "DocumentProvider is nil", nil)
            return
        }
        
        guard let bboxArray = formData["bbox"] as? Array<NSNumber>,
              bboxArray.count == 4,
              let pageIndex = formData["pageIndex"] as? Int,
              let fullyQualifiedName = formData["fullyQualifiedName"] as? String else {
            onError("addTextFormField", "Invalid form data", nil)
            return
        }
        
        // Convert bbox array [left, top, right, bottom] to CGRect (x, y, width, height)
        let left = bboxArray[0].floatValue
        let top = bboxArray[1].floatValue
        let right = bboxArray[2].floatValue
        let bottom = bboxArray[3].floatValue
        
        let textFieldFormElement = TextFieldFormElement()
        textFieldFormElement.boundingBox = CGRect(
            x: CGFloat(left),
            y: CGFloat(bottom),
            width: CGFloat(right - left),
            height: CGFloat(top - bottom)
        )
        textFieldFormElement.pageIndex = PageIndex(pageIndex)
        
        do {
            _ = try TextFormField.insertedTextField(
                withFullyQualifiedName: fullyQualifiedName,
                documentProvider: documentProvider,
                formElement: textFieldFormElement
            )
            onSuccess(true)
        } catch {
            onError("addTextFormField", error.localizedDescription, error as NSError)
        }
    }
}
