"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurements = void 0;
var Measurements;
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
