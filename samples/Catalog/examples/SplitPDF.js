import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Dimensions, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  formDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import React from 'react';

export class SplitPDF extends BaseExampleAutoHidingHeaderComponent {
  pdfRef1 = null;
  pdfRef2 = null;

  constructor(props) {
    super(props);
    this.state = { dimensions: undefined };
    this.pdfRef2 = React.createRef();
  }

  render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View style={styles.wrapper(layoutDirection)} onLayout={this._onLayout}>
        <PSPDFKitView
          ref={this.pdfRef1}
          document={formDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfView}
        />
        <PSPDFKitView
          ref={this.pdfRef2}
          document={exampleDocumentPath}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          style={styles.pdfColor}
        />
      </View>
    );
  }

  _getOptimalLayoutDirection = () => {
    const width = this.state.dimensions
      ? this.state.dimensions.width
      : Dimensions.get('window').width;
    return width > 450 ? 'row' : 'column';
  };

  _onLayout = event => {
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };
}
const styles = {
  wrapper: layoutDirection => ({
    flex: 1,
    flexDirection: layoutDirection,
    justifyContent: 'center',
  }),
  pdfView: { flex: 1, color: pspdfkitColor },
  pdfColor: { flex: 1, color: '#9932CC' },
};
