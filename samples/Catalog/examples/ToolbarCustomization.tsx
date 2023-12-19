import React from 'react';
import { Alert, Button, Platform, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class ToolbarCustomization extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    return (
      <View style={styles.fullScreen}>
        <PSPDFKitView
          ref={this.pdfRef}
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
          menuItemGrouping={[
            {
              key: 'markup',
              items: ['squiggly', 'strikeout', 'underline'],
            },
            {
              key: 'writing',
              items: ['freetext', 'note'],
            },
            {
              key: 'drawing',
              items: [
                'line',
                'square',
                'circle',
                'polygon',
                'polyline',
                'arrow',
              ],
            },
            {
              key: 'measurement',
              items: ['area_square', 'perimeter', 'distance', 'area_circle'],
            },
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
                  await this.pdfRef.current?.setRightBarButtonItems(
                    items,
                    'document',
                    false,
                  );
                } else if (Platform.OS === 'android') {
                  // Update the toolbar menu items for Android.
                  await this.pdfRef.current?.setToolbarMenuItems(items);
                }
              }}
              title="Set Toolbar Items"
              accessibilityLabel="Set Toolbar Items"
            />
          </View>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                if (Platform.OS === 'android') {
                  Alert.alert('PSPDFKit', 'Not supported on Android');
                  return;
                }
                // Get the right bar buttons.
                const rightBarButtonItems =
                  await this.pdfRef.current?.getRightBarButtonItemsForViewMode(
                    'document',
                  );
                Alert.alert('PSPDFKit', JSON.stringify(rightBarButtonItems));
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
    flexDirection: 'row' as 'row',
    height: 60,
    alignItems: 'center' as 'center',
    padding: 10,
  },
  marginLeft: { marginLeft: 10 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
