//
//  Copyright © 2018-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import PSPDFKit

@objc(RNProcessor)
class RNProcessor: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
        return ["RNProcessor"]
    }

    @objc static override func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc override func constantsToExport() -> [AnyHashable : Any]! {
        return [:]
    }

    @objc func getTemporaryDirectory(_ onSuccess: RCTPromiseResolveBlock, onError: RCTPromiseRejectBlock) {
        guard let url = RNFileHelper.getTemporaryDirectory() else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }
        onSuccess(["tempDir": url]);
    }

    func documentPath() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        return documentsDirectory
    }

    func deleteExistingFileIfNeeded(filePath: URL, configuration: [String: Any]) {
        let fileManager = FileManager.default
        let override = configuration["override"] as? Bool ?? false

        if override {
            do {
                try fileManager.removeItem(at: filePath)
            } catch {
                print("Could not delete file, probably does not exists")
            }
        }
    }

    @objc func generateBlankPDF(_ configuration: [String: Any] = [:], onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {

        guard var outputFileURL = RNFileHelper.getFilePath(configuration, onError: onError) else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }
        outputFileURL = RNFileHelper.updateFileNameIfNeeded(outputFileURL)
        RNFileHelper.deleteExistingFileIfNeeded(filePath: outputFileURL, configuration: configuration)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1, execute: {
            let width = configuration["width"] as? CGFloat ?? 595 // A4 in points
            let height = configuration["height"] as? CGFloat ?? 842 // A4 in points
            let newPageConfiguration = PDFNewPageConfiguration(pageTemplate: PageTemplate.blank) {
                $0.backgroundColor = UIColor.white
                $0.pageSize = CGSize(width: width, height: height)
            }

            let processorConfiguration = Processor.Configuration()
            processorConfiguration.addNewPage(at: 0, configuration: newPageConfiguration)

            let processor = Processor(configuration: processorConfiguration, securityOptions: nil)
            do {
                try processor.write(toFileURL: outputFileURL)
                onSuccess(["fileURL": outputFileURL.absoluteString])
            } catch {
                onError("E_NEW_FAILED", "Generating PDF failed: \(error.localizedDescription)", error)
            }
        })
    }

    @objc func generatePDFFromHtmlString(_ configuration: [String: Any] = [:], html: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard var outputFileURL = RNFileHelper.getFilePath(configuration, onError: onError)  else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }

        outputFileURL = RNFileHelper.updateFileNameIfNeeded(outputFileURL)
        RNFileHelper.deleteExistingFileIfNeeded(filePath: outputFileURL, configuration: configuration)

        Processor.generatePDF(fromHTMLString: html, outputFileURL: outputFileURL, options: configuration) { actualOutputURL, error in
            if let outputURL = actualOutputURL {
                onSuccess(["fileURL": outputURL.absoluteString])
                return
            }

            if let error = error {
                onError("E_PDF_GENERATION_FROM_HTML", "Generating PDF failed: \(error.localizedDescription)", error)
            }
        }
    }

    @objc func generatePDFFromHtmlURL(_ configuration: [String: Any] = [:], htmlURL: String, onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {

        guard var outputFileURL = RNFileHelper.getFilePath(configuration, onError: onError) else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }
        outputFileURL = RNFileHelper.updateFileNameIfNeeded(outputFileURL)
        RNFileHelper.deleteExistingFileIfNeeded(filePath: outputFileURL, configuration: configuration)

        guard let htmlOriginURL = URL(string: htmlURL) else {
            let error = NSError(domain: "PSPDFKit", code: 200, userInfo: nil)
            onError("E_PDF_GENERATION_FROM_URL_INVALID_HTML_URL", "HTML URL is invalid", error)
            return
        }

        let exception = ExecuteWithObjCExceptionHandling {
            Processor.generatePDF(from: htmlOriginURL, outputFileURL: outputFileURL, options: nil) { outputURL, error in
                if let outputURL = outputURL {
                    onSuccess(["fileURL": outputURL.absoluteString])
                    return
                }

                if let error = error {
                    onError("E_PDF_GENERATION_FROM_URL_FAILED", "Generating PDF failed: \(error.localizedDescription)", error)
                    return
                }
            }
        }
        if let exception = exception {
            let error = NSError(domain: "PSPDFKit", code: 200, userInfo: nil)
            onError("E_PDF_GENERATION_FROM_URL_FAILED", exception.reason, error)
        }
    }

    @objc func generatePDFFromTemplate(_ configuration: [String: Any], onSuccess: @escaping RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard var outputFileURL = RNFileHelper.getFilePath(configuration, onError: onError)  else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }

        outputFileURL = RNFileHelper.updateFileNameIfNeeded(outputFileURL)
        RNFileHelper.deleteExistingFileIfNeeded(filePath: outputFileURL, configuration: configuration)

        let pageConfiguration = Processor.Configuration()

        // Build document with different template for each of the pages
        do {
            if let templates = configuration["templates"] as? [[String: Any]] {
                for (index, rawTemplate) in templates.enumerated() {
                    let pageConfigurationHelper = RNConfigurationHelper(rawTemplate)
                    let templateConfig = pageConfigurationHelper.parseConfiguration()
                    print("templateConfig", templateConfig)
                    pageConfiguration.addNewPage(at: PageIndex(index), configuration: templateConfig)
                }

                let processor = Processor(configuration: pageConfiguration, securityOptions: nil)
                try processor.write(toFileURL: outputFileURL)
                onSuccess(["fileURL": outputFileURL.absoluteString])
                return
            }
        } catch {
            onError("E_PDF_FROM_TEMPLATE_FAILED", "Generating PDF failed: \(error.localizedDescription)", error)
            return
        }

        // Build document from same configuration for multiple pages if available
        // Required attributes: pages => 1 and configuration options [template, size, rotation, pageMargins, backgroundColor]
        let pages = configuration["pages"] as? Int ?? 1
        if pages > 0 {
            let pageConfigurationHelper = RNConfigurationHelper(configuration)

            // Convert configuration with RN values to native enums
            let templateConfig = pageConfigurationHelper.parseConfiguration()

            for i in 0..<pages {
                pageConfiguration.addNewPage(at: PageIndex(i), configuration: templateConfig)
            }

            let processor = Processor(configuration: pageConfiguration, securityOptions: nil)

            do {
                try processor.write(toFileURL: outputFileURL)
                onSuccess(["fileURL": outputFileURL.absoluteString])
                return
            } catch {
                onError("E_PDF_FROM_TEMPLATE_FAILED", "Generating PDF failed: \(error.localizedDescription)", error)
                return
            }
        }

        let error = NSError(domain: "PSPDFKit", code: 200, userInfo: nil)
        onError("E_PDF_FROM_TEMPLATE_FAILED", "Generating PDF failed: Missing pages or templates configuration parameter", error)
    }

    @objc func generatePDFFromImages(_ configuration: [String: Any] = [:], onSuccess: @escaping  RCTPromiseResolveBlock, onError: @escaping RCTPromiseRejectBlock) -> Void {
        guard var outputFileURL = RNFileHelper.getFilePath(configuration, onError: onError)  else {
            onError("E_MISSING_PATH_DOCUMENT_NAME", "Please provide either document path or name", RNFileHelper.invalidFileError())
            return
        }

        outputFileURL = RNFileHelper.updateFileNameIfNeeded(outputFileURL)
        RNFileHelper.deleteExistingFileIfNeeded(filePath: outputFileURL, configuration: configuration)

        let pageConfiguration = Processor.Configuration()

        guard let images = configuration["images"] as? [[String: Any]] else {
            let error = NSError(domain: "", code: 200, userInfo: nil)
            onError("E_NEW_MISSING_IMAGES", "Pls provide at least one image", error)
            return
        }

        for (index, imageConfig) in images.enumerated() {
            let pageConfigurationHelper = RNConfigurationHelper(imageConfig)
            guard let imagePageConfig = pageConfigurationHelper.newPageFromImage(imageConfig) else { continue }
            pageConfiguration.addNewPage(at: PageIndex(index), configuration: imagePageConfig)
        }

        let processor = Processor(configuration: pageConfiguration, securityOptions: nil)

        do {
            try processor.write(toFileURL: outputFileURL)
            onSuccess(["fileURL": outputFileURL.absoluteString])
        } catch {
            onError("E_NEW_FAILED", "Generating PDF failed: \(error.localizedDescription)", error)
        }
    }
}
