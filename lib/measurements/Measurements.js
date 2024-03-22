"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurements = void 0;
/**
 * Measurement value configurations define how measurements are displayed and interpreted.
 * @typedef MeasurementValueConfiguration
 * @memberof Measurements
 * @property {Measurements.MeasurementScale} scale - A ratio of a distance on a document page to a corresponding real world distance.
 * @property {Measurements.Precision} precision - The smallest value to which measurements will be rounded.
 * @property {string} [name] - Names are displayed in user interface and serve to help distinguish different scales.
 * @property {boolean} [addToUndo] - Whether this new measurement configuration should be added to the undo stack (Android only).
 * @property {boolean} [isSelected] - Whether this new measurement configuration should be set as selected on the UI.
 */
/**
 * A ratio of a distance on a document page to a corresponding real world distance.
 * @typedef MeasurementScale
 * @memberof Measurements
 * @property {Measurements.ScaleUnitFrom} unitFrom - The unit for the distance on a document page.
 * @property {number} valueFrom - A distance on a document page. The unit of this value is given by ```unitFrom```.
 * @property {Measurements.ScaleUnitTo} unitTo - The unit for the real world distance.
 * @property {number} valueTo - A real world distance. The unit of this value is given by ```unitTo```.
 */
/**
 * @namespace Measurements
 */
var Measurements = /** @class */ (function () {
    function Measurements() {
    }
    return Measurements;
}());
exports.Measurements = Measurements;
(function (Measurements) {
    /**
     * The MeasurementScale UnitFrom options.
     * @readonly
     * @enum {string} ScaleUnitFrom
     */
    Measurements.ScaleUnitFrom = {
        /**
         * Inches (default). 1 inch is 72 PDF points.
         */
        INCH: 'inch',
        /**
         * Millimeters
         */
        MM: 'mm',
        /**
         * Centimeters
         */
        CM: 'cm',
        /**
         * PDF points. A PDF point is 1/72 inch. All values in a PDF page coordinate space (e.g. an annotation’s bounding box) are specified in PDF points.
         */
        PT: 'pt',
    };
    /**
     * The MeasurementScale UnitTo options.
     * @readonly
     * @enum {string} ScaleUnitTo
     */
    Measurements.ScaleUnitTo = {
        /**
         * Inches (default)
         */
        INCH: 'inch',
        /**
         * Millimeters
         */
        MM: 'mm',
        /**
         * Centimeters
         */
        CM: 'cm',
        /**
         * PDF points. You probably don’t want to use this for real world distances.
         */
        PT: 'pt',
        /**
         * Feet
         */
        FT: 'ft',
        /**
         * Meters
         */
        M: 'm',
        /**
         * Yards
         */
        YD: 'yd',
        /**
         * Kilometers
         */
        KM: 'km',
        /**
         * Miles
         */
        MI: 'mi',
    };
    /**
     * The MeasurementPrecision options.
     * @readonly
     * @enum {string} Precision
     */
    Measurements.Precision = {
        /**
         * Round to one decimal place. For example: 3.1.
         */
        ONE_DP: 'oneDP',
        /**
         * Round to two decimal places. For example: 3.14.
         */
        TWO_DP: 'twoDP',
        /**
         * Round to three decimal places. For example: 3.142.
         */
        THREE_DP: 'threeDP',
        /**
         * Round to four decimal places. For example: 3.1416.
         */
        FOUR_DP: 'fourDP',
        /**
         * Round to whole numbers. For example: 3.
         */
        WHOLE: 'whole',
        /**
         * Round to whole inches.
         */
        WHOLE_INCH: 'whole',
        /**
         * Round to halves. For example: 2 1/2.
         */
        HALVES_INCH: '1/2',
        /**
         * Round to quarters. For example: 2 3/4. Fractions will be simplified if possible.
         */
        QUARTERS_INCH: '1/4',
        /**
         * Round to eighths. For example: 2 5/8. Fractions will be simplified if possible.
         */
        EIGHTS_INCH: '1/8',
        /**
         * Round to sixteenths. For example: 2 9/16. Fractions will be simplified if possible.
         */
        SIXTEENTHS_INCH: '1/16',
    };
})(Measurements || (exports.Measurements = Measurements = {}));
