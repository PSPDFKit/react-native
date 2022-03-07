// Document names
import fileSystem from 'react-native-fs';

const tiffImageName = 'PSPDFKit_Image_Example.tiff';
const formDocumentName = 'Form_example.pdf';
export const exampleDocumentName = 'PSPDFKit_Quickstart_Guide.pdf';

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
