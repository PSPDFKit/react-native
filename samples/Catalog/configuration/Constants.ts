// Document names
import { Platform } from 'react-native';
import fileSystem from 'react-native-fs';

const tiffImageName = 'PSPDFKit_Image_Example.tiff';
export const formDocumentName = 'Form_example.pdf';
const measurementsName = 'Measurements.pdf';
export const exampleDocumentName = 'PSPDFKit_Quickstart_Guide.pdf';
export const exampleAIName = 'Resource_Depletion.pdf';
export const examplePasswordDocumentName = 'PSPDFKit_Quickstart_Guide_Password.pdf';
export const exampleReportName = 'JKHF-AnnualReport.pdf';
export const exampleXFDFName = 'XFDFTest.xfdf';

export const exampleImage = 'PSPDFKit_Image_Example.jpg';
export const exampleImagePath =
  Platform.OS === 'ios'
    ? 'PDFs/' + exampleImage
    : 'file:///android_asset/' + exampleImage;

// Document paths
export const formDocumentPath =
  Platform.OS === 'ios'
    ? 'PDFs/' + formDocumentName
    : 'file:///android_asset/' + formDocumentName;

export const exampleDocumentPath =
  Platform.OS === 'ios'
    ? 'PDFs/' + exampleDocumentName
    : 'file:///android_asset/' + exampleDocumentName;

export const examplePasswordDocumentPath =
    Platform.OS === 'ios'
      ? 'PDFs/' + examplePasswordDocumentName
      : 'file:///android_asset/' + examplePasswordDocumentName;

export const exampleReportPath =
      Platform.OS === 'ios'
        ? 'PDFs/' + exampleReportName
        : 'file:///android_asset/' + exampleReportName;

export const exampleXFDFPath =
        Platform.OS === 'ios'
          ? 'PDFs/' + exampleXFDFName
          : 'file:///android_asset/' + exampleXFDFName;

export const exampleAIPath =
          Platform.OS === 'ios'
            ? 'PDFs/' + exampleAIName
            : 'file:///android_asset/' + exampleAIName;

export const tiffImagePath =
  Platform.OS === 'ios'
    ? 'PDFs/' + tiffImageName
    : 'file:///android_asset/' + tiffImageName;

export const measurementsDocument =
  Platform.OS === 'ios'
    ? 'PDFs/' + measurementsName
    : 'file:///android_asset/' + measurementsName;

export const pspdfkitColor = '#67594B';

export const writableDocumentPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName;

export const writableFormDocumentPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + formDocumentName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + formDocumentName;

export const writableXFDFPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + exampleXFDFName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + exampleXFDFName;
