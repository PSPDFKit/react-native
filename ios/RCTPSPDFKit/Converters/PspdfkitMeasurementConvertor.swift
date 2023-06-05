//
//  Copyright © 2016-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

import Foundation
import PSPDFKit
import PSPDFKitUI

@objc(PspdfkitMeasurementConvertor)
public class PspdfkitMeasurementConvertor: NSObject {
    /**
     * Converts precision string from React Native layer to MeasurementPrecision enum
     *
     * @param precision The string representation of a measurement precision.
     * @return The MeasurementPrecision enum.
     */
    @objc public static func getPrecision(_ precision: String?) -> MeasurementPrecision  {
        let precisionOptions: [String: MeasurementPrecision] = [
            "whole": .whole,
            "onedp": .oneDecimalPlace,
            "twodp": .twoDecimalPlaces,
            "threedp": .threeDecimalPlaces,
            "fourdp": .fourDecimalPlaces,
        ]

        guard
            let precision = precision?.lowercased(),
            let precisionValue = precisionOptions[precision]
        else {
            return .twoDecimalPlaces
        }

        return precisionValue
    }

    @objc public static func getPrecisionInt(_ precision: String?) -> Int {
        return self.getPrecision(precision).rawValue
    }

    @objc public static func getScaleConfig(_ rawData: [String: AnyObject]) -> MeasurementScale? {
        var fromValue: Double = 1
        var toValue: Double = 1
        var unitFrom: UnitFrom = .inch
        var unitTo: UnitTo = .inch

        for (key, value) in rawData {
            switch key.lowercased() {
            case "unitfrom":
                unitFrom = parseScaleUnitFrom(value as? String ?? "")
            case "unitto":
                unitTo = parseScaleUnitTo(value as? String ?? "")
            case "fromvalue":
                fromValue = value as? Double ?? 1
            case "tovalue":
                toValue = value as? Double ?? 1

            default:
                break
            }
        }

        let config = MeasurementScale(from: fromValue, unitFrom: unitFrom, to: toValue, unitTo: unitTo)
        return config
    }

    @objc public static func parseScaleUnitTo(_ stringValue: String) -> UnitTo {
        let options: [String: UnitTo] = [
            "inch": .inch,
            "mm": .millimeter,
            "cm": .centimeter,
            "pt": .point,
            "ft": .foot,
            "m": .meter,
            "yd": .yard,
            "km": .kilometer,
            "mi": .mile,
        ];

        guard let unitTo = options[stringValue.lowercased()] else {
            return .inch
        }

        return unitTo
    }

    @objc public static func parseScaleUnitFrom(_ stringValue: String) -> UnitFrom {
        let options: [String: UnitFrom] = [
            "inch": .inch,
            "mm": .millimeter,
            "cm": .centimeter,
            "pt": .point
        ];

        guard let unitFrom = options[stringValue.lowercased()] else {
            return .inch
        }

        return unitFrom
    }

    @objc public static func setConfig(_ configuration: [String: AnyObject], document: Document?) {
        if
            let scaleData = configuration["measurementScale"] as? [String: AnyObject],
            let scale = self.getScaleConfig(scaleData) {
            document?.measurementScale = scale
        }

        if
            let precision = configuration["measurementPrecision"] as? String {
            document?.measurementPrecision = self.getPrecision(precision)
        }
    }
}
