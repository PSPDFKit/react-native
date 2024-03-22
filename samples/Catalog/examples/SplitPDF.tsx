import React from 'react';
import { Dimensions, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import {
  exampleDocumentPath,
  formDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class SplitPDF extends BaseExampleAutoHidingHeaderComponent {
  pdfRef1: React.RefObject<PSPDFKitView>;
  pdfRef2: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    this.state = { dimensions: undefined };
    this.pdfRef1 = React.createRef();
    this.pdfRef2 = React.createRef();
  }

  override render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View style={styles.wrapper(layoutDirection)} onLayout={this._onLayout}>
        <PSPDFKitView
          ref={this.pdfRef1}
          document={formDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
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

  _onLayout = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };
}
const styles = {
  wrapper: (layoutDirection: any) => ({
    flex: 1,
    flexDirection: layoutDirection,
    justifyContent: 'center' as 'center',
  }),
  pdfView: { flex: 1, color: pspdfkitColor },
  pdfColor: { flex: 1, color: '#9932CC' },
};
