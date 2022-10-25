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
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      shouldReturn: false,
      documentPath: formDocumentPath,
    };

    hideToolbar(navigation);

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

  goBack() {
    this.props.navigation.goBack(null);
  }

  render() {
    const { shouldReturn } = this.state;
    return (
      <View style={styles.flex}>
        {!shouldReturn && (
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
        )}
        <SafeAreaView style={styles.row}>
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

const styles = {
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
