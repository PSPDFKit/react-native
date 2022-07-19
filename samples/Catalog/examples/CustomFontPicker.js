import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import React from 'react';

export class CustomFontPicker extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showThumbnailBar: 'scrubberBar',
            useParentNavigationBar: false,
          }}
          availableFontNames={[
            'Arial',
            'Calibri',
            'Times New Roman',
            'Courier New',
            'Helvetica',
            'Comic Sans MS',
          ]}
          selectedFontName={'Courier New'}
          showDownloadableFonts={false}
          style={styles.pdfColor}
        />
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
