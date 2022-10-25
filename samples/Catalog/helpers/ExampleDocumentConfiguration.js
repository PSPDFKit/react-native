// Configurations
import { processColor } from 'react-native';

const exampleDocumentConfiguration = {
  iOSBackgroundColor: processColor('white'),
  showPageNumberOverlay: false,
  grayScale: false,
  showPageLabels: false,
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

const tiffImageConfiguration = {
  showPageNumberOverlay: false,
  showPageLabels: false,
  showThumbnailBar: 'none',
};

export { tiffImageConfiguration };

export default exampleDocumentConfiguration;
