import React, {Component} from 'react';
import {
  SafeAreaView,
  findNodeHandle,
  UIManager,
  View,
  NativeModules,
  Button,
  Text,
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

const FORM_DOCUMENT =
  Platform.OS === 'android'
    ? 'file:///sdcard/Form_example.pdf'
    : 'PDFs/Form_example.pdf';

const examples = [
  {
    name: 'Manual Signing',
    description:
      'Shows how to start the signing flow using a react-native button linked to our CustomPdfView.',
    action: (component) => {
      if (Platform.OS === 'android') {
        requestExternalStoragePermission(function () {
          extractFromAssetsIfMissing('Form_example.pdf', function () {
            component.props.navigation.navigate('ManualSigning');
          });
        });
      } else {
        component.props.navigation.navigate('ManualSigning');
      }
    },
  },
  {
    name: 'Watermark',
    description:
      'Shows how to watermark a PDF that is loaded in our CustomPdfView',
    action: (component) => {
      if (Platform.OS === 'android') {
        requestExternalStoragePermission(function () {
          extractFromAssetsIfMissing('Form_example.pdf', function () {
            component.props.navigation.navigate('Watermark');
          });
        });
      } else {
        component.props.navigation.navigate('Watermark');
      }
    },
  },
  {
    name: 'Watermark on Startup',
    description:
      'Shows how to watermark a PDF as soon as it is loaded in our CustomPdfView',
    action: (component) => {
      if (Platform.OS === 'android') {
        requestExternalStoragePermission(function () {
          extractFromAssetsIfMissing('Form_example.pdf', function () {
            component.props.navigation.navigate('WatermarkStartup');
          });
        });
      } else {
        component.props.navigation.navigate('WatermarkStartup');
      }
    },
  },
  {
    name: 'Default Annotation Settings',
    description:
      'Shows how to configure default annotations settings. (Android Only)',
    action: (component) => {
      if (Platform.OS === 'android') {
        requestExternalStoragePermission(function () {
          extractFromAssetsIfMissing('Form_example.pdf', function () {
            component.props.navigation.navigate('DefaultAnnotationSettings');
          });
        });
      } else {
        component.props.navigation.navigate('DefaultAnnotationSettings');
      }
    },
  },
  {
    name: 'Instant Example',
    description: 'Shows the Native Swift Instant Example. (iOS only)',
    action: (component) => {
      if (Platform.OS === 'ios') {
        component.props.navigation.push('InstantExample');
      }
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
          onDocumentDigitallySigned={(event) => {
            this.setState({
              documentPath: event.nativeEvent.signedDocumentPath,
            });
          }}
        />
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Button
              onPress={() => {
                // This will open the native signature dialog.
                if (Platform.OS === 'android') {
                  UIManager.dispatchViewManagerCommand(
                    findNodeHandle(this.refs.pdfView),
                    'startSigning',
                    [],
                  );
                } else {
                  NativeModules.CustomPdfViewManager.startSigning(
                    findNodeHandle(this.refs.pdfView),
                  );
                }
              }}
              title="Start Signing"
            />
          </View>
        </SafeAreaView>
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
          onDocumentWatermarked={(event) => {
            this.setState({
              documentPath: event.nativeEvent.watermarkedDocumentPath,
            });
          }}
        />
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Button
              onPress={() => {
                // This will create a watermark in native code.
                if (Platform.OS === 'android') {
                  UIManager.dispatchViewManagerCommand(
                    findNodeHandle(this.refs.pdfView),
                    'createWatermark',
                    [],
                  );
                } else {
                  NativeModules.CustomPdfViewManager.createWatermark(
                    findNodeHandle(this.refs.pdfView),
                  );
                }
              }}
              title="Create Watermark"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

class WatermarkStartupScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      // This tag tells our CustomPdfView to apply the watermark to the document before loading it.
      documentPath: FORM_DOCUMENT + '|ADD_WATERMARK',
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomPdfView
          ref="pdfView"
          document={this.state.documentPath}
          style={{flex: 1}}
          onDocumentWatermarked={(event) => {
            this.setState({
              documentPath: event.nativeEvent.watermarkedDocumentPath,
            });
          }}
        />
      </View>
    );
  }
}

class InstantExampleScreen extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1}}>
        {Platform.OS === 'ios' && <CustomPdfView ref="pdfView" />}
        {Platform.OS === 'ios' && (
          <Button
            onPress={() => {
              NativeModules.CustomPdfViewManager.presentInstantExample(
                findNodeHandle(this.refs.pdfView),
              );
            }}
            title="Present Instant Example"
          />
        )}
        {Platform.OS === 'android' && (
          <Text>This example isn't supported on Android!</Text>
        )}
      </View>
    );
  }
}

class DefaultAnnotationSettingsScreen extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1}}>
        {Platform.OS === 'android' && (
          <CustomPdfView
            ref="pdfView"
            document={FORM_DOCUMENT}
            style={{flex: 1}}
            // This way only the ink tool and the button to open the inspector is show.
            // If you don't need the inspector you can remove the "picker" option completely
            // and only configure the tool using the AnnotationConfiguration.
            // See CustomPdfViewManager#setDocument() for how to apply the custom configuration.
            menuItemGrouping={['pen', 'picker']}
          />
        )}
        {Platform.OS === 'ios' && (
          <Text>This example isn't supported on iOS!</Text>
        )}
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
      InstantExample: {
        screen: InstantExampleScreen,
      },
      DefaultAnnotationSettings: {
        screen: DefaultAnnotationSettingsScreen,
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
