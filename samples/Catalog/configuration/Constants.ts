// Document names
import { Platform } from 'react-native';
import fileSystem from 'react-native-fs';

const tiffImageName = 'PSPDFKit_Image_Example.tiff';
export const formDocumentName = 'Form_example.pdf';
const measurementsName = 'Measurements.pdf';
export const exampleDocumentName = 'PSPDFKit_Quickstart_Guide.pdf';
export const examplePasswordDocumentName = 'PSPDFKit_Quickstart_Guide_Password.pdf';

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

export const tiffImagePath =
  Platform.OS === 'ios'
    ? 'PDFs/' + tiffImageName
    : 'file:///android_asset/' + tiffImageName;

export const measurementsDocument =
  Platform.OS === 'ios'
    ? 'PDFs/' + measurementsName
    : 'file:///android_asset/' + measurementsName;

export const pspdfkitColor = '#267AD4';

export const writableDocumentPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName;

export const writableFormDocumentPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + formDocumentName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + formDocumentName;
