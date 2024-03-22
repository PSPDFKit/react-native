//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import PSPDFKit

struct RNConfigurationHelper {
    var configuration: [String: Any]

    public init(_ configurationDictionary: [String : Any]) {
        self.configuration = configurationDictionary
    }

    public func parseConfiguration() -> PDFNewPageConfiguration {
        let configBuilder = NewPageConfigurationBuilder()
        configBuilder.pageSize = parseSize()

        configBuilder.pageRotation = parseRotation()
        let pageTemplate = PageTemplate(pageType: .tiledPatternPage, identifier: parsePageTemplate())

        return PDFNewPageConfiguration(pageTemplate: pageTemplate, builderBlock: { builder in
            builder.pageSize = self.parseSize()
            builder.pageRotation = self.parseRotation()
            builder.pageMargins = self.parseMargins()
            builder.backgroundColor = self.parseBackgroundColor()
        })
    }

    public func newPageFromImage(_ configuration: [String: Any]) -> PDFNewPageConfiguration? {
        guard
            let imageUri = configuration["imageUri"] as? String,
            let imagePath = URL(string: imageUri),
            let image = UIImage(contentsOfFile: imagePath.path) else {
            return nil
        }

        let pageTemplate = PageTemplate(pageType: .emptyPage, identifier: nil)

        return PDFNewPageConfiguration(pageTemplate: pageTemplate) { builder in
            builder.item = ProcessorItem(image: image, jpegCompressionQuality: 0.7, builderBlock: nil)
            builder.pageSize = self.parseSize()
            builder.pageRotation = self.parseRotation()
            builder.pageMargins = self.parseMargins()
            builder.backgroundColor = self.parseBackgroundColor()
        }
    }
    
    public func newPageFromDocument(_ configuration: [String: Any]) -> PDFNewPageConfiguration? {
        guard let documentUri = configuration["documentPath"] as? String,
        let pageIndex = configuration["pageIndex"] as? UInt else {
            return nil
        }
        
        let documentPath = URL(fileURLWithPath: documentUri)
        let document = Document(url: documentPath, loadCheckpointIfAvailable: false)
        let validRange = 0...document.pageCount-1
        if !(validRange ~= pageIndex) {
            return nil
        }
        let pageTemplate = PageTemplate(document: document, sourcePageIndex: pageIndex)
        return PDFNewPageConfiguration(pageTemplate: pageTemplate) { builder in
            builder.pageSize = self.parseSize()
            builder.pageRotation = self.parseRotation()
            builder.pageMargins = self.parseMargins()
            builder.backgroundColor = self.parseBackgroundColor()
        }
    }

    private func parsePageTemplate() -> PageTemplate.Identifier {
        let templates: [String: PageTemplate.Identifier] = [
            "blank": .blank,
            "dot5mm": .dot5mm,
            "grid5mm": .grid5mm,
            "lines5mm": .lines5mm,
            "lines7mm": .lines7mm
        ]

        guard let templateID = configuration["template"] as? String else {
            return .blank
        }

        return templates[templateID] ?? .blank
    }

    private func parseSize() -> CGSize {
        let defaultSize = CGSize(width: 595, height: 842)

        if let width = configuration["width"], let height = configuration["height"] {
            return CGSize(
                width: width as? CGFloat ?? defaultSize.width,
                height: height as? CGFloat ?? defaultSize.height
            )
        }

        guard let size = configuration["pageSize"] as? [String: Any] else {
            return defaultSize
        }

        return CGSize(
            width: size["width"] as? CGFloat ?? defaultSize.width,
            height:size["height"] as? CGFloat ?? defaultSize.height
        )
    }

    private func parseRotation() -> Rotation {
        var rotationAngle = 0
        let availableAngles: [Int] = [0, 90, 180, 270]

        guard let rotation = configuration["rotation"] as? Int else {
            return Rotation(rawValue: 0)!
        }
        if availableAngles.contains(rotation) {
            rotationAngle = rotation
        }

        return Rotation(rawValue: UInt(rotationAngle))!
    }

    private func parseMargins() -> UIEdgeInsets {
        let defaultMargins = UIEdgeInsets(top: 30, left: 15, bottom: 30, right: 15)

        guard let margins = configuration["pageMargins"] as? [String: Any] else {
            return defaultMargins
        }

        return UIEdgeInsets(
            top: margins["top"] as? CGFloat ?? defaultMargins.top,
            left: margins["left"] as? CGFloat ?? defaultMargins.left,
            bottom: margins["bottom"] as? CGFloat ?? defaultMargins.bottom,
            right: margins["right"] as? CGFloat ?? defaultMargins.right
        )
    }

    // Can be in format of hex value (#ff0000), rgb(0,0,0), rgba(0,0,0,0) or color name (eg. lightgray, red...)
    private func parseBackgroundColor() -> UIColor {
        guard let color = configuration["backgroundColor"] else {
            return .white
        }

        if let colorValue = color as? String {
            if colorValue.contains("#"), let uiColor = UIColor(hexString: colorValue) {
                return uiColor
            }

            if colorValue.contains("rgb") {
                if let uiColor = UIColor.rgb(colorValue) {
                    return uiColor
                }
            }

            if let uiColor = UIColor.colorFromName(colorValue) {
                return uiColor
            }
        }

        return .white
    }
}
