// Constants
import { Platform, requireNativeComponent } from 'react-native';

export const CustomPdfView = requireNativeComponent('CustomPdfView');
export const pspdfkitColor = '#267AD4';

// Document names
export const formDocumentName = 'Form_example.pdf';

// Document paths
export const formDocumentPath =
  Platform.OS === 'ios'
    ? 'PDFs/' + formDocumentName
    : 'file:///android_asset/' + formDocumentName;
