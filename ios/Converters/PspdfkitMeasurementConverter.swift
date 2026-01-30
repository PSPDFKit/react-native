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
import PSPDFKitUI

@objc(PspdfkitMeasurementConverter)
public class PspdfkitMeasurementConverter :NSObject{
    
    /**
    * Add a new measurement configuration to the document.
    * @param document The document to which the measurement configuration should be added.
    * @param configuration The measurement configuration to be added.
    */
    @objc static public func addMeasurementValueConfiguration(document: Document, configuration:NSDictionary) -> Bool {
        guard let measurementValueConfiguration = convertMeasurementValueConfiguration(measurementValueConfiguration: configuration) else {
            return false;
        }
        document.add(measurementValueConfiguration: measurementValueConfiguration)
        if let isSelected = configuration.object(forKey: "isSelected") as? Bool, isSelected == true {
            document.activeMeasurementValueConfiguration = measurementValueConfiguration;
        }
        return true
    }

    /**
    * Remove a measurement configuration from the document.
    * @param document The document from which the measurement configuration should be removed.
    * @param name The name of the measurement configuration to be removed.
    */
    @objc static public func removeMeasurementValueConfiguration(document: Document, name: NSString) {
        // TODO: Implement remove measurementValue configuration. This is not yet implemented in the PSPDFKit iOS SDK.
    }

    /**
    * Get all measurement configurations from the document.
    * @param document The document from which the measurement configurations should be retrieved.
    * @return An array of measurement configurations.
    */
    @objc static public func getMeasurementValueConfigurations(document: Document) -> NSArray {
        let configurations = document.measurementValueConfigurations
        var result = [NSDictionary]()
        for configuration in configurations {
            result.append(reverserMeasurementValueConfiguration(configuration: configuration) as NSDictionary)
        }
        return result as NSArray
    }

    /**
    * Modify a measurement configuration in the document.
    * @param document The document in which the measurement configuration should be modified.
    * @param configuration The measurement configuration to be modified.
    */
    @objc static public func modifyMeasurementValueConfiguration(document: Document, configuration:NSDictionary) {
        // TODO: Implement modify measurementValue configuration. This is not yet implemented in the PSPDFKit iOS SDK.
    }
    
    static private func convertMeasurementValueConfiguration(measurementValueConfiguration: NSDictionary) -> MeasurementValueConfiguration? {
        if (measurementValueConfiguration == NSNull()){
            return nil
        }
        guard let measurement = measurementValueConfiguration["scale"] as? NSDictionary else {
            return nil;
        }
        
        guard let scale = convertScale(measurement: measurement) else {
            return nil;
        }
        let precision = convertPrecision(precision: measurementValueConfiguration["precision"] as? NSString)
        let name = measurementValueConfiguration["name"] as? String
        return MeasurementValueConfiguration(name: name, scale: scale, precision: precision)
    }
    
    static private func reverserMeasurementValueConfiguration(configuration: MeasurementValueConfiguration) -> NSDictionary {
        let scale = reverseConvertScale(scale: configuration.scale)
        let precision = reverseConvertPrecision(precision: configuration.precision)
        return ["scale": scale, "precision": precision, "name": configuration.name ?? ""]
    }

    static private func convertScale(measurement: NSDictionary) -> MeasurementScale?  {
        if (measurement == NSNull()) {
            return nil
        }

        guard let valueFrom = measurement["valueFrom"] as? Double else { return nil }
        guard let valueTo = measurement["valueTo"] as? Double else { return nil }
        let unitFrom = measurement["unitFrom"] as? NSString
        let unitTo = measurement["unitTo"] as? NSString
        let fromUnits: UnitFrom = convertUnitFrom(unit: unitFrom)
        let toUnits: UnitTo = convertUnitTo(unit: unitTo)

        return MeasurementScale(from: valueFrom, unitFrom: fromUnits, to: valueTo, unitTo: toUnits)
    }
        
    
    static private func convertUnitFrom(unit: NSString?) -> UnitFrom {
        if(unit == NSNull()){
            return .centimeter
        }
        switch unit {
        case "inch":
            return .inch
        case "cm":
            return .centimeter
        case "mm":
            return .millimeter
        default:
            return .centimeter
        }
    }

    static private func convertUnitTo(unit: NSString?) -> UnitTo {
        if(unit == NSNull()){
            return .centimeter
        }
        switch unit {
        case "inch":
            return .inch
        case "cm":
            return .centimeter
        case "mm":
            return .millimeter
        case "m":
            return .meter
        case "km":
            return .kilometer
        case "yd":
            return .yard
        case "ft":
            return .foot
        case "mi":
            return .mile
        default:
            return .centimeter
        }
    }
    
    
    static private func convertPrecision(precision: NSString?) -> MeasurementPrecision  {
        if(precision == NSNull()){
            return .twoDecimalPlaces
        }
        switch precision {
        case "oneDP":
            return .oneDecimalPlace
        case "twoDP":
            return .twoDecimalPlaces
        case "threeDP":
            return .threeDecimalPlaces
        case "fourDP":
            return .fourDecimalPlaces
        case "whole":
            return .whole
        default:
            return .twoDecimalPlaces
        }
    }

    static private func reverseConvertScale(scale: MeasurementScale) -> NSDictionary {
        let fromUnit = reverseUnitFrom(unit: scale.unitFrom)
        let toUnit = reverseUnitsTo(unit: scale.unitTo)
        return ["valueFrom": scale.from, "valueTo": scale.to, "unitFrom": fromUnit, "unitTo": toUnit]
    }

    static private func reverseUnitFrom(unit: UnitFrom) -> String {
        switch unit {
        case .inch:
            return "inch"
        case .centimeter:
            return "cm"
        case .millimeter:
            return "mm"
        default:
            return "cm"
        }
    }
    
    static private func reverseUnitsTo(unit: UnitTo) -> String {
        switch unit {
        case .inch:
            return "inch"
        case .centimeter:
            return "cm"
        case .millimeter:
            return "mm"
        case .meter:
            return "m"
        case .kilometer:
            return "km"
        case .yard:
            return "yd"
        case .foot:
            return "ft"
        case .mile:
            return "mi"
        default:
            return ""
        }
    }

    static private func reverseConvertPrecision(precision: MeasurementPrecision) -> String {
        switch precision {
        case .oneDecimalPlace:
            return "oneDP"
        case .twoDecimalPlaces:
            return "twoDP"
        case .threeDecimalPlaces:
            return "threeDP"
        case .fourDecimalPlaces:
            return "fourDP"
        case .whole:
            return "whole"
        default:
            return "twoDP"
        }
    }
}
