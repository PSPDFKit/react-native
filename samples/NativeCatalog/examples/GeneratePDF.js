import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import { Platform, View } from 'react-native';
import React from 'react';

export class GeneratePDF extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);

    this.state = {
      shouldReturn: false,
    };

    const { navigation } = this.props;

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
