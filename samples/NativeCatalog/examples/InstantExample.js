import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, findNodeHandle, NativeModules, View } from 'react-native';
import { CustomPdfView } from '../configuration/Constants';
import React from 'react';

export class InstantExample extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={styles.flex}>
        <CustomPdfView ref="pdfView" />
        <Button
          onPress={() => {
            NativeModules.CustomPdfViewManager.presentInstantExample(
              findNodeHandle(this.refs.pdfView),
            );
          }}
          title="Present Instant Example"
        />
      </View>
    );
  }
}

const styles = { flex: { flex: 1 } };
