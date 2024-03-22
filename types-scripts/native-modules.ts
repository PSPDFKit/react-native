//@ts-ignore
declare module 'react-native' {
  export interface NativeModulesStatic {
      //@ts-ignore
      RNProcessor: Processor;
      //@ts-ignore
      PSPDFKit: PSPDFKit;
   }
}
//@ts-ignore
import config = require('../src/configuration/PDFConfiguration');
export import PDFConfiguration = config.PDFConfiguration;
//@ts-ignore
import toolbar = require('../src/toolbar/Toolbar');
export import Toolbar = toolbar.Toolbar;
//@ts-ignore
import measurements = require('../src/measurements/Measurements');
export import Measurements = measurements.Measurements;
export import MeasurementScale = measurements.MeasurementScale;
export import MeasurementValueConfiguration = measurements.MeasurementValueConfiguration;
