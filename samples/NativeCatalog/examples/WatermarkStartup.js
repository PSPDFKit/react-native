import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import { View } from 'react-native';
import React from 'react';

export class WatermarkStartup extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {
      // This tag tells our CustomPdfView to apply the watermark to the document before loading it.
      documentPath: formDocumentPath + '|ADD_WATERMARK',
    };
  }

  render() {
    return (
      <View style={styles.flex}>
        <CustomPdfView
          ref="pdfView"
          document={this.state.documentPath}
          style={styles.flex}
          onDocumentWatermarked={event => {
            this.setState({
              documentPath: event.nativeEvent.watermarkedDocumentPath,
            });
          }}
        />
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
};
