import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {CustomPdfView, formDocumentPath} from '../configuration/Constants';
import {
  Button,
  findNodeHandle,
  NativeModules,
  SafeAreaView,
  UIManager,
  View,
} from 'react-native';
import React from 'react';

export class Watermark extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {
      documentPath: formDocumentPath,
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
        <SafeAreaView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
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
