import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import { Platform, View } from 'react-native';
import React from 'react';

export class WatermarkStartup extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = React.createRef();
  constructor(props) {
    super(props);
    const { navigation } = props;

    this.state = {
      // This tag tells our CustomPdfView to apply the watermark to the document before loading it.
      documentPath: formDocumentPath + '|ADD_WATERMARK',
      shouldReturn: false,
    };

    navigation.addListener('beforeRemove', e => {
      if (Platform.OS !== 'android') {
        return;
      }
      const { shouldReturn } = this.state;
      if (!shouldReturn) {
        this.setState({ shouldReturn: true });
        e.preventDefault();
      }
      setTimeout(() => {
        this.goBack();
      }, 50);
    });
  }

  goBack(navigation) {
    this.props.navigation.goBack();
  }

  render() {
    const { shouldReturn } = this.state;
    return (
      <View style={styles.flex}>
        {!shouldReturn && (
          <CustomPdfView
            ref={this.pdfRef}
            document={this.state.documentPath}
            style={styles.flex}
            onDocumentWatermarked={event => {
              this.setState({
                documentPath: event.nativeEvent.watermarkedDocumentPath,
              });
            }}
          />
        )}
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
};
