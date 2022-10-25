// Document names
import fileSystem from 'react-native-fs';
import { Platform } from 'react-native';

const tiffImageName = 'PSPDFKit_Image_Example.tiff';
const formDocumentName = 'Form_example.pdf';
export const exampleDocumentName = 'PSPDFKit_Quickstart_Guide.pdf';

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

export const tiffImagePath =
  Platform.OS === 'ios'
    ? 'PDFs/' + tiffImageName
    : 'file:///android_asset/' + tiffImageName;

export const pspdfkitColor = '#267AD4';

export const writableDocumentPath =
  Platform.OS === 'ios'
    ? fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName
    : 'file://' + fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName;
