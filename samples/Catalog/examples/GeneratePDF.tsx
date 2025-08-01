import React from 'react';
import { processColor, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class GeneratePDF extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef<NutrientView>();
  }

  override render() {
    const { route } = this.props;
    const { fullPath } = route.params;

    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={fullPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
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
