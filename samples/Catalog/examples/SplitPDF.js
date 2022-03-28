import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Dimensions, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  formDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import React from 'react';

export class SplitPDF extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {dimensions: undefined};
  }

  render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View
        style={{
          flex: 1,
          flexDirection: layoutDirection,
          justifyContent: 'center',
        }}
        onLayout={this._onLayout}
      >
        <PSPDFKitView
          ref="pdfView1"
          document={formDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <PSPDFKitView
          ref="pdfView2"
          document={exampleDocumentPath}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          style={{flex: 1, color: '#9932CC'}}
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
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}});
  };
}
