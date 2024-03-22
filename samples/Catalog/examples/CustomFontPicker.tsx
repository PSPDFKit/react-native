import React from 'react';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class CustomFontPicker extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<PSPDFKitView>();
    hideToolbar(navigation);
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={exampleDocumentPath}
          ref={this.pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            showThumbnailBar: 'scrubberBar',
            iOSUseParentNavigationBar: false,
          }}
          availableFontNames={[
            'Arial',
            'Calibri',
            'Times New Roman',
            'Roboto',
            'Helvetica',
            'Comic Sans MS',
          ]}
          selectedFontName={'Roboto'}
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
