import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView } from '../configuration/Constants';
import { View } from 'react-native';
import React from 'react';

export class GeneratePDF extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);

    this.state = {
      shouldReturn: false,
    };
  }

  render() {
    const { route } = this.props;
    const { shouldReturn } = this.state;
    const fullPath = route.params.fullPath;

    return (
      <View style={styles.flex}>
        {!shouldReturn && (
          <CustomPdfView
            ref="pdfView"
            document={fullPath}
            style={styles.flex}
          />
        )}
      </View>
    );
  }
}

export default GeneratePDF;

const styles = {
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
