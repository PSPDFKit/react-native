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

@objc public protocol PDFDocumentManagerDelegate {
    @objc optional func didReceiveAnnotationChange(change: String, annotations: Array<Annotation>)
    @objc optional func reloadControllerData()
}

@objc(PDFDocumentManager) public class PDFDocumentManager: NSObject {
    
    var documents = [NSNumber:Document]()
    @objc public var delegate: PDFDocumentManagerDelegate?
    
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
    
    @objc func addAnnotations(_ reference: NSNumber, instantJSON: Dictionary<String, Any>, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard let document = getDocument(reference) else {
            onError("addAnnotations", "Document is nil", nil)
            return
        }
    
        do {
            let data = try JSONSerialization.data(withJSONObject: instantJSON)
            let dataContainerProvider = DataContainerProvider(data: data)
            
            guard let documentProvider = document.documentProviders.first else {
                onError("addAnnotations", "DocumentProvider is nil", nil)
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
                onError("addAnnotations", error.localizedDescription, nil)
                return
            }
        } catch {
            onError("addAnnotations", "Cannot serialize instantJSON data", nil)
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
}
