import React from 'react';
import { processColor, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class CustomFontPicker extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<NutrientView>();
    hideToolbar(navigation);
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
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
