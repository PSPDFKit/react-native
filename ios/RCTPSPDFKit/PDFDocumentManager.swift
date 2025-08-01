//
//  Copyright © 2018-2025 PSPDFKit GmbH. All rights reserved.
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
        
        let pageInfoDictionary = ["savedRotation" : pageInfo.savedRotation.rawValue]
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
                elementJSON["type"] = "button"
            } else if let choiceElement = formElement as? ChoiceFormElement {
                elementJSON = RCTConvert.choiceFormElementToJSON(choiceElement)
                elementJSON["type"] = "choice"
            } else if let signatureElement = formElement as? SignatureFormElement {
                elementJSON = RCTConvert.signatureFormElementToJSON(signatureElement)
                elementJSON["type"] = "signature"
            } else if let textFieldElement = formElement as? TextFieldFormElement {
                elementJSON = RCTConvert.textFieldFormElementToJSON(textFieldElement)
                elementJSON["type"] = "textField"
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
            if formElement.fullyQualifiedFieldName == fullyQualifiedName {
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
                    if let arrayValue = value as? [String] {
                        // For multi-select
                        var indices = IndexSet()
                        if let options = choiceElement.options {
                            for (index, option) in options.enumerated() {
                                if arrayValue.contains(option.value) {
                                    indices.insert(index)
                                }
                            }
                        }
                        choiceElement.selectedIndices = indices
                        success = true
                    } else if let stringValue = value as? String {
                        // For single select
                        if let index = choiceElement.options?.firstIndex(where: { $0.value == stringValue }) {
                            choiceElement.selectedIndices = IndexSet(integer: index)
                            success = true
                        }
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
            
            var annotationsArray = Array<Annotation>()
                        
            for annotationDictionary in instantJSONArray {
                let annotationMutableDictionary = NSMutableDictionary(dictionary: annotationDictionary)
                annotationMutableDictionary.removeObject(forKey: "constructor")
                if let annotationData = try? JSONSerialization.data(withJSONObject: annotationMutableDictionary),
                   let annotation = try? Annotation(fromInstantJSON: annotationData, documentProvider: documentProvider) {
                    
                     if let attachmentId = annotationMutableDictionary["imageAttachmentId"] as? String {
                         guard let attachment = attachments[attachmentId] as? Dictionary<String, Any>,
                               let base64String = attachment["binary"] as? String,
                               let base64Data = Data(base64Encoded: base64String) else {
                             onError("addAnnotations", "Failed to process attachment data", nil)
                             return
                         }
                         
                         let dataProvider = DataContainerProvider(data: base64Data)
                         do {
                             try annotation.attachBinaryInstantJSONAttachment(fromDataProvider: dataProvider)
                         } catch {
                             onError("addAnnotations", "DocumentProvider is nil", nil)
                             return
                         }
                     }
                    annotationsArray.append(annotation)
                }
            }
            document.add(annotations: annotationsArray)
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
}
