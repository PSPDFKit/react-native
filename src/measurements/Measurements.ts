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
export class Measurements {}

export interface MeasurementValueConfiguration {
 /**
  * Names are displayed in user interface and serve to help distinguish different scales.
  */
    name?: string;
 /**
  * Whether this new measurement configuration should be added to the undo stack (Android only).
  */
    addToUndo? : boolean;
 /**
  * Whether this new measurement configuration should be set as selected on the UI.
  */
    isSelected? : boolean;
 /**
  * A ratio of a distance on a document page to a corresponding real world distance.
  */
    scale: MeasurementScale;
 /**
  * The smallest value to which measurements will be rounded.
  */
    precision: Measurements.Precision;
}

export interface MeasurementScale {
 /**
  * The unit for the distance on a document page.
  */
    unitFrom: Measurements.ScaleUnitFrom;
 /**
  * A distance on a document page. The unit of this value is given by ```unitFrom```.
  */
    valueFrom: number;
 /**
  * The unit for the real world distance.
  */
    unitTo: Measurements.ScaleUnitTo;
 /**
  * A real world distance. The unit of this value is given by ```unitTo```.
  */
    valueTo: number;
}

export namespace Measurements {
    /**
     * The MeasurementScale UnitFrom options.
     * @readonly
     * @enum {string} ScaleUnitFrom
     */
     export const ScaleUnitFrom = {
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
     } as const;

    /**
     * The MeasurementScale UnitTo options.
     * @readonly
     * @enum {string} ScaleUnitTo
     */
    export const ScaleUnitTo = {
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
    } as const;

    /**
     * The MeasurementPrecision options.
     * @readonly
     * @enum {string} Precision
     */
    export const Precision = {
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
    } as const;

     export type ScaleUnitFrom = ValueOf<typeof ScaleUnitFrom>;
     export type ScaleUnitTo = ValueOf<typeof ScaleUnitTo>;
     export type Precision = ValueOf<typeof Precision>;
     type ValueOf<T> = T[keyof T];
}