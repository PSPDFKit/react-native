import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, Platform, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import React from 'react';

export class ToolbarCustomization extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={styles.fullScreen}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
          //Only IOS
          leftBarButtonItems={['settingsButtonItem']}
          rightBarButtonItems={[
            'searchButtonItem',
            'thumbnailsButtonItem',
            'annotationButtonItem',
          ]}
          //Only for Android.
          toolbarMenuItems={[
            'annotationButtonItem',
            'settingsButtonItem',
            'searchButtonItem',
            'thumbnailsButtonItem',
          ]}
          style={styles.pdfColor}
        />
        <View style={styles.wrapperView}>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                const items = ['searchButtonItem', 'readerViewButtonItem'];

                if (Platform.OS === 'ios') {
                  // Update the right bar buttons for iOS.
                  await this.refs.pdfView.setRightBarButtonItems(
                    items,
                    'document',
                    false,
                  );
                } else if (Platform.OS === 'android') {
                  // Update the toolbar menu items for Android.
                  await this.refs.pdfView.setToolbarMenuItems(items);
                }
              }}
              title="Set Toolbar Items"
            />
          </View>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                if (Platform.OS === 'android') {
                  alert('Not supported on Android');
                  return;
                }
                // Get the right bar buttons.
                const rightBarButtonItems =
                  await this.refs.pdfView.getRightBarButtonItemsForViewMode(
                    'document',
                  );
                alert(JSON.stringify(rightBarButtonItems));
              }}
              title="Get Bar Button Items"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  fullScreen: { flex: 1 },
  wrapperView: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    padding: 10,
  },
  marginLeft: { marginLeft: 10 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
