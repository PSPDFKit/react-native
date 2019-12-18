import React, {Component} from 'react';
import {
  SafeAreaView,
  findNodeHandle,
  UIManager,
  View,
  NativeModules,
  Button,
  requireNativeComponent,
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {
  extractFromAssetsIfMissing,
  requestExternalStoragePermission,
  CatalogScreen,
} from './shared';

const CustomPdfView = requireNativeComponent('CustomPdfView');
const PSPDFKit = NativeModules.PSPDFKit;

const FORM_DOCUMENT = 'file:///sdcard/Form_example.pdf';

const examples = [
  {
    name: 'Manual Signing',
    description:
      'Shows how to start the signing flow using a react-native button linked to our CustomPdfView.',
    action: component => {
      requestExternalStoragePermission(function() {
        extractFromAssetsIfMissing('Form_example.pdf', function() {
          component.props.navigation.navigate('ManualSigning');
        });
      });
    },
  },
  {
    name: 'Watermark',
    description:
      'Shows how to watermark a PDF that is loaded in our CustomPdfView',
    action: component => {
      requestExternalStoragePermission(function() {
        extractFromAssetsIfMissing('Form_example.pdf', function() {
          component.props.navigation.navigate('Watermark');
        });
      });
    },
  },
  {
    name: 'Watermark on Startup',
    description:
      'Shows how to watermark a PDF as soon as it is loaded in our CustomPdfView',
    action: component => {
      requestExternalStoragePermission(function() {
        extractFromAssetsIfMissing('Form_example.pdf', function() {
          component.props.navigation.navigate('WatermarkStartup');
        });
      });
    },
  },
];

class ManualSigningScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      documentPath: FORM_DOCUMENT,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomPdfView
          ref="pdfView"
          document={this.state.documentPath}
          style={{flex: 1}}
          onDocumentDigitallySigned={event => {
            this.setState({
              documentPath: event.nativeEvent.signedDocumentPath,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            padding: 10,
          }}>
          <View>
            <Button
              onPress={() => {
                // This will open the native signature dialog.
                UIManager.dispatchViewManagerCommand(
                  findNodeHandle(this.refs.pdfView),
                  'startSigning',
                  [],
                );
              }}
              title="Start Signing"
            />
          </View>
        </View>
      </View>
    );
  }
}

class WatermarkScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      documentPath: FORM_DOCUMENT,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomPdfView
          ref="pdfView"
          document={this.state.documentPath}
          style={{flex: 1}}
          onDocumentWatermarked={event => {
            this.setState({
              documentPath: event.nativeEvent.watermarkedDocumentPath,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            padding: 10,
          }}>
          <View>
            <Button
              onPress={() => {
                // This will open the native signature dialog.
                UIManager.dispatchViewManagerCommand(
                  findNodeHandle(this.refs.pdfView),
                  'createWatermark',
                  [],
                );
              }}
              title="Create Watermark"
            />
          </View>
        </View>
      </View>
    );
  }
}

class WatermarkStartupScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      // This tag tells our CustomPdfView to apply the watermark to the document before loading it.
      documentPath: FORM_DOCUMENT+"|ADD_WATERMARK",
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomPdfView
          ref="pdfView"
          document={this.state.documentPath}
          style={{flex: 1}}
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

export default createAppContainer(
  createStackNavigator(
    {
      Catalog: {
        screen: CatalogScreen,
      },
      ManualSigning: {
        screen: ManualSigningScreen,
      },
      Watermark: {
        screen: WatermarkScreen,
      },
      WatermarkStartup: {
        screen: WatermarkStartupScreen,
      },
    },
    {
      initialRouteName: 'Catalog',
      initialRouteParams: {
        examples: examples,
      },
    },
  ),
);
