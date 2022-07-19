import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { pspdfkitColor, tiffImagePath } from '../configuration/Constants';
import React from 'react';

export class OpenImageDocument extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={tiffImagePath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showPageLabels: false,
            useParentNavigationBar: false,
            allowToolbarTitleChange: false,
          }}
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
