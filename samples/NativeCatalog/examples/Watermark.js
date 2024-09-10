import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import {
  Button,
  findNodeHandle,
  NativeModules,
  Platform,
  SafeAreaView,
  UIManager,
  View,
} from 'react-native';
import React from 'react';
import { hideToolbar } from '../helpers/NavigationHelper';

export class Watermark extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject;

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.pdfRef = React.createRef();
    this.state = {
      shouldReturn: false,
      documentPath: formDocumentPath,
    };

    hideToolbar(navigation);
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
        <SafeAreaView style={styles.row}>
          <View>
            <Button
              onPress={() => {
                // This will create a watermark in native code.
                if (Platform.OS === 'android') {
                  UIManager.dispatchViewManagerCommand(
                    findNodeHandle(this.pdfRef.current),
                    'createWatermark',
                    [],
                  );
                } else {
                  NativeModules.CustomPdfViewManager.createWatermark(
                    findNodeHandle(this.pdfRef.current),
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

const styles = {
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
