// Configurations
import { processColor } from 'react-native';
import { PDFConfiguration } from 'react-native-pspdfkit';

const exampleDocumentConfiguration: PDFConfiguration = {
  iOSBackgroundColor: processColor('white'),
  showPageLabels: false,
  androidGrayScale: false,
  documentLabelEnabled: false,
  inlineSearch: false,
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical',
  showThumbnailBar: 'scrollable',
  // Settings this to false will disable all annotation editing
  enableAnnotationEditing: false,
  // Only stamps and square annotations will be editable, others can not be selected or otherwise modified.
  editableAnnotationTypes: ['Stamp', 'Square'],
};

const tiffImageConfiguration: PDFConfiguration = {
  showPageLabels: false,
  showThumbnailBar: 'none',
};

export { tiffImageConfiguration };

export default exampleDocumentConfiguration;
