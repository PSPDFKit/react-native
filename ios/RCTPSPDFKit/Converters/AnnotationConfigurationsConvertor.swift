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

// Annotation configuration constants
let DEFAULT_COLOR = "defaultColor"
let DEFAULT_FILL_COLOR = "defaultFillColor"
let DEFAULT_THICKNESS = "defaultThickness"
let DEFAULT_ALPHA = "defaultAlpha"
let AVAILABLE_COLORS = "availableColors"
let DEFAULT_BORDER_STYLE = "defaultBorderStyle"
let DEFAULT_LINE_END = "defaultLineEnd"
let DEFAULT_TEXT_SIZE = "defaultTextSize"
let DEFAULT_FONT = "defaultFont"
let OUTLINE_COLOR = "outlineColor"
let BLEND_MODE = "blendMode"
let OVERLAY_TEXT = "overlayText"
let REPEAT_OVERLAY_TEXT = "repeatOverlayText"
let DEFAULT_BORDER_EFFECT = "borderEffect"
let DEFAULT_TEXT_ALIGNMENT = "textAlignment"
let DEFAULT_ICON_NAME = "iconName"

// Annotation types constants
let ANNOTATION_INK_PEN = "inkPen"
let ANNOTATION_INK_MAGIC = "inkMagic"
let ANNOTATION_INK_HIGHLIGHTER = "inkHighlighter"
let ANNOTATION_FREE_TEXT = "freeText"
let ANNOTATION_FREE_TEXT_CALL_OUT = "freeTextCallout"
let ANNOTATION_STAMP = "stamp"
let ANNOTATION_NOTE = "note"
let ANNOTATION_HIGHLIGHT = "highlight"
let ANNOTATION_UNDERLINE = "underline"
let ANNOTATION_SQUIGGLY = "squiggly"
let ANNOTATION_STRIKE_OUT = "strikeOut"
let ANNOTATION_LINK = "link"
let ANNOTATION_SQUARE = "square"
let ANNOTATION_CIRCLE = "circle"
let ANNOTATION_LINE = "line"
let ANNOTATION_ARROW = "arrow"
let ANNOTATION_SIGNATURE = "signature"
let ANNOTATION_ERASER = "eraser"
let ANNOTATION_POLYGON = "polygon"
let ANNOTATION_POLYLINE = "polyline"
let ANNOTATION_REDACTION = "redaction"
let ANNOTATION_CARET = "caret"
let ANNOTATION_IMAGE = "image"
let ANNOTATION_AUDIO = "audio"
let ANNOTATION_CLOUDY = "cloudy"
let ANNOTATION_MEASUREMENT_AREA_RECT = "measurementAreaRect"
let ANNOTATION_MEASUREMENT_AREA_POLYGON = "measurementAreaPolygon"
let ANNOTATION_MEASUREMENT_AREA_ELLIPSE = "measurementAreaEllipse"
let ANNOTATION_MEASUREMENT_PERIMETER = "measurementPerimeter"
let ANNOTATION_MEASUREMENT_DISTANCE = "measurementDistance"


/** This class is used to convert annotation configurations from react native to PSPDFKit annotation configurations.
 * It is used in the `RCTPSPDFKitManager` class.
 */
@objc(AnnotationsConfigurationsConvertor)
public class AnnotationsConfigurationsConvertor: NSObject {

    @objc public static func convertAnnotationConfigurations(annotationPreset: Dictionary<String, Dictionary<String, Any>>) {

        for key in annotationPreset.keys {
            switch key {
            case ANNOTATION_INK_PEN:
                let tool = Annotation.ToolVariantID(tool: .ink, variant: .inkPen)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_INK_MAGIC:
                let tool = Annotation.ToolVariantID(tool: .ink, variant: .inkMagic)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_INK_HIGHLIGHTER:
                let tool = Annotation.ToolVariantID(tool: .ink, variant: .inkHighlighter)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_FREE_TEXT:
                let tool = Annotation.ToolVariantID(tool: .freeText)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_FREE_TEXT_CALL_OUT:
                let tool = Annotation.ToolVariantID(tool: .freeText, variant: .freeTextCallout)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_STAMP:
                let tool = Annotation.ToolVariantID(tool: .stamp)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_NOTE:
                let tool = Annotation.ToolVariantID(tool: .note)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_SQUARE:
                let tool = Annotation.ToolVariantID(tool: .square)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_CIRCLE:
                let tool = Annotation.ToolVariantID(tool: .circle)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_LINE:
                let tool = Annotation.ToolVariantID(tool: .line)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
                
            case ANNOTATION_POLYGON:
                let tool = Annotation.ToolVariantID(tool: .polygon)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_POLYLINE:
                let tool = Annotation.ToolVariantID(tool: .polyLine)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_ERASER:
                let tool = Annotation.ToolVariantID(tool: .eraser)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_SIGNATURE:
                let tool = Annotation.ToolVariantID(tool: .signature)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_IMAGE:
                let tool = Annotation.ToolVariantID(tool: .image)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_AUDIO:
                let tool = Annotation.ToolVariantID(tool: .sound)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_STRIKE_OUT:
                let tool = Annotation.ToolVariantID(tool: .strikeOut)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_UNDERLINE:
                let tool = Annotation.ToolVariantID(tool: .underline)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_SQUIGGLY:
                let tool = Annotation.ToolVariantID(tool: .squiggly)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_CARET:
                let tool = Annotation.ToolVariantID(tool: .caret)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_LINK:
                let tool = Annotation.ToolVariantID(tool: .link)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_REDACTION:
                let tool = Annotation.ToolVariantID(tool: .redaction)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_ARROW:
                let tool = Annotation.ToolVariantID(tool: .line, variant: .lineArrow)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_CLOUDY:
                let tool = Annotation.ToolVariantID(tool: .polygon, variant: .polygonCloud)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_MEASUREMENT_DISTANCE:
                let tool = Annotation.ToolVariantID(tool: .line, variant: .distanceMeasurement)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_MEASUREMENT_PERIMETER:
                let tool = Annotation.ToolVariantID(tool: .polyLine, variant: .perimeterMeasurement)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_MEASUREMENT_AREA_RECT:
                let tool = Annotation.ToolVariantID(tool: .square, variant: .rectangularAreaMeasurement)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_MEASUREMENT_AREA_POLYGON:
                let tool = Annotation.ToolVariantID(tool: .polygon, variant: .polygonalAreaMeasurement)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            case ANNOTATION_MEASUREMENT_AREA_ELLIPSE:
                let tool = Annotation.ToolVariantID(tool: .circle, variant: .ellipticalAreaMeasurement)
                extractPresets(presets: annotationPreset[key] ?? [:], annotationTool: tool)
                break
            default:
                break
            }
        }
    }

    private class func extractPresets(presets: [String: Any], annotationTool: Annotation.ToolVariantID) {
        let styleManager = SDK.shared.styleManager
        for key in presets.keys {
            switch key {
            case DEFAULT_COLOR:
                if let color = parseColor(colorString: presets[key] as? String){
                    styleManager.setLastUsedValue(color, forProperty: #keyPath(Annotation.color), forKey: annotationTool)
                }
                break
            case DEFAULT_FILL_COLOR:
                if let color = parseColor(colorString: presets[key] as? String){
                    styleManager.setLastUsedValue(color, forProperty: #keyPath(Annotation.fillColor), forKey: annotationTool)
                }
                break
            case OUTLINE_COLOR:
                if let outlineColor = presets[key] as? String {
                    styleManager.setLastUsedValue(parseColor(colorString: outlineColor), forProperty: #keyPath(RedactionAnnotation.outlineColor), forKey: annotationTool)
                }
                break
            case DEFAULT_THICKNESS:
                if let thickness = presets[key] as? NSNumber, thickness.floatValue >= 0 {
                    styleManager.setLastUsedValue(thickness, forProperty: #keyPath(Annotation.lineWidth), forKey: annotationTool)
                }
                break
            case DEFAULT_ALPHA:
                if let alpha = presets[key] as? NSNumber, alpha.floatValue <= 1 {
                    styleManager.setLastUsedValue(alpha, forProperty: #keyPath(Annotation.alpha), forKey: annotationTool)
                }
                break
            case DEFAULT_TEXT_SIZE:
                if let fontSize = presets[key] as? NSNumber, fontSize.floatValue >= 0 {
                    styleManager.setLastUsedValue(fontSize, forProperty: #keyPath(FreeTextAnnotation.fontSize), forKey: annotationTool)
                }
                break
            case DEFAULT_FONT:
              
                if let fontName = presets[key] as? String {
                    styleManager.setLastUsedValue(fontName, forProperty: #keyPath(FreeTextAnnotation.fontName), forKey: annotationTool)
                }
                break
                
            case DEFAULT_BORDER_STYLE:
                if let borderStyle = presets[key] as? String {
                    let annotationBorderStyle = parseBorderStyle(borderStyle: borderStyle)
                    styleManager.setLastUsedValue(annotationBorderStyle, forProperty: #keyPath(Annotation.borderStyle), forKey: annotationTool)
                    
                    if (annotationBorderStyle == .dashed) {
                        styleManager.setLastUsedValue(parseBorderDashArray(borderStyle: borderStyle), forProperty: #keyPath(LineAnnotation.__dashArray), forKey: annotationTool)
                    }
                }
                break
            case DEFAULT_BORDER_EFFECT:
                if  let borderEffect = presets[key] as? String {
                    styleManager.setLastUsedValue(parseBorderEffect(borderEffect: borderEffect), forProperty: #keyPath(Annotation.borderEffect), forKey: annotationTool)
                }
                break
            case BLEND_MODE:
                if let blendMode = presets[key] as? String {
                    styleManager.setLastUsedValue(parseBlendMode(blendMode: blendMode), forProperty: #keyPath(Annotation.blendMode), forKey: annotationTool)
                }
                break
            case DEFAULT_LINE_END:
                if let lineEnd = presets[key] as? String {
                    let lineEndArray = lineEnd.components(separatedBy: ",")
                    if lineEndArray.count < 2 {
                        break
                    }
                    styleManager.setLastUsedValue(NSNumber(integerLiteral:parseLineEnd(lineEnd: lineEndArray[0]).rawValue), forProperty: #keyPath(LineAnnotation.lineEnd1), forKey: annotationTool)
                    styleManager.setLastUsedValue(NSNumber(integerLiteral:parseLineEnd(lineEnd: lineEndArray[1]).rawValue), forProperty: #keyPath(LineAnnotation.lineEnd2), forKey: annotationTool)
                    break
                }
                break
            case OVERLAY_TEXT:
                if let overlayText = presets[key] as? String {
                    styleManager.setLastUsedValue(overlayText, forProperty: #keyPath(RedactionAnnotation.overlayText), forKey: annotationTool)
                }
                break
            case REPEAT_OVERLAY_TEXT:
                if let repeatOverlayText = presets[key] as? NSNumber {
                    styleManager.setLastUsedValue(repeatOverlayText, forProperty: #keyPath(RedactionAnnotation.repeatOverlayText), forKey: annotationTool)
                }
                break
            case DEFAULT_TEXT_ALIGNMENT:
                if let textAlignment = presets[key] as? String {
                    styleManager.setLastUsedValue(parseTextAlignment(textAlignment: textAlignment), forProperty: #keyPath(Annotation.textAlignment), forKey: annotationTool)
                }
                break
            case DEFAULT_ICON_NAME:
                if let icon = presets[key] as? String {
                    styleManager.setLastUsedValue(icon, forProperty: #keyPath(NoteAnnotation.iconName), forKey: annotationTool)
                }
                break
            case AVAILABLE_COLORS:
                if let colors = presets[key] as? Array<String> {
                    styleManager.setPresets(parseColorPresets(colors: colors), forKey: annotationTool, type: .colorPreset)
                }
                break
            default:
                break
            }
        }
    }

    private class func parseBorderStyle(borderStyle: String) -> Annotation.BorderStyle {
        var parsedBorderStyle = borderStyle

        if parsedBorderStyle.contains("dashed_") {
            parsedBorderStyle = parsedBorderStyle.components(separatedBy: "_")[0]
        }
        
        switch parsedBorderStyle {
        case "solid":
            return .solid
        case "dashed":
            return .dashed
        case "beveled":
            return .beveled
        case "inset":
            return .inset
        case "underline":
            return .underline
        default:
            return .solid
        }
    }
    
    private class func parseBorderDashArray(borderStyle: String) -> Array<Int> {
        var dashArray = [Int]()
        
        // Example format: dashed_1_3
        if borderStyle.contains("dashed_") {
            let parsedBorderArray = borderStyle.split(separator: "_", maxSplits: 1)[1]
            // Example format: 1_3
            if parsedBorderArray.contains("_") {
                let parsedDashArray = parsedBorderArray.components(separatedBy: "_")
                if (parsedDashArray.count == 2) {
                    dashArray.append(Int(parsedDashArray[0]) ?? 1)
                    dashArray.append(Int(parsedDashArray[1]) ?? 1)
                }
            }
        } else {
            dashArray.append(1)
            dashArray.append(1)
        }
        
        return dashArray
    }

    private class func parseTextAlignment(textAlignment: String) -> NSTextAlignment {
        switch textAlignment {
        case "left":
            return .left
        case "center":
            return .center
        case "right":
            return .right
        default:
            return .left
        }
    }

    private class func parseLineEnd(lineEnd: String) -> AbstractLineAnnotation.EndType {
        switch lineEnd {
        case "none":
            return .none
        case "openArrow":
            return .openArrow
        case "closedArrow":
            return .closedArrow
        case "circle":
            return .circle
        case "square":
            return .square
        default:
            return .none
        }
    }

    private static func parseColor(colorString: String?) -> UIColor? {
        if colorString == nil || colorString!.isEmpty {
            return nil
        }
        let color = UIColor.init(hexString: colorString!)
        return color
    }

    private static func parseColorPresets(colors: Array<String>) -> Array<ColorPreset> {
        var colorPresets: Array<ColorPreset> = []
        for color in colors {
            let colorPreset = ColorPreset(color: UIColor.init(hexString: color))
            colorPresets.append(colorPreset)
        }
        return colorPresets
    }

    private static func parseBorderEffect(borderEffect: String) -> Annotation.BorderEffect {
        switch borderEffect {
        case "none":
            return .noEffect
        case "cloudy":
            return .cloudy
        default:
            return .noEffect
        }
    }

    private static func parseBlendMode(blendMode: String) -> CGBlendMode {
        switch blendMode {
        case "normal":
            return .normal
        case "multiply":
            return .multiply
        case "screen":
            return .screen
        case "overlay":
            return .overlay
        case "darken":
            return .darken
        case "lighten":
            return .lighten
        case "colorDodge":
            return .colorDodge
        case "colorBurn":
            return .colorBurn
        case "softLight":
            return .softLight
        case "hardLight":
            return .hardLight
        case "difference":
            return .difference
        case "exclusion":
            return .exclusion
        case "hue":
            return .hue
        case "saturation":
            return .saturation
        case "color":
            return .color
        case "luminosity":
            return .luminosity
        default:
            return .normal
        }
    }
}
