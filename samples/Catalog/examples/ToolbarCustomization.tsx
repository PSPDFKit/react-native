import React from 'react';
import { Alert, Button, Platform, processColor, View } from 'react-native';
import PSPDFKitView, { Toolbar } from 'react-native-pspdfkit';

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
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          toolbar={{
            // iOS only.
            leftBarButtonItems: {
              viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
              animated: true,
              buttons: [
                Toolbar.DefaultToolbarButton.EMAIL_BUTTON_ITEM,
              ],
            },
            // iOS only.
            rightBarButtonItems: {
              viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
              animated: true,
              buttons: [
                {
                  image: 'example_toolbar_icon',
                  id: 'myCustomButton'
                }
              ],
            },
            // Android only.
            toolbarMenuItems: {
              buttons: [
                {
                  image: 'example_toolbar_icon', 
                  id: 'custom_action',
                  title: 'Android title',
                  showAsAction: true
                },
                Toolbar.DefaultToolbarButton.SETTINGS_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.ANNOTATION_BUTTON_ITEM,
              ],
            },
          }}
          onCustomToolbarButtonTapped={(event: any) => {
            Alert.alert('PSPDFKit', `Custom button tapped: ${JSON.stringify(event)}`);
          }}
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
                const toolbar: Toolbar = {
                  leftBarButtonItems: {
                    viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
                    animated: true,
                    buttons: [
                      Toolbar.DefaultToolbarButton.SETTINGS_BUTTON_ITEM,
                      {
                        image: 'example_toolbar_icon',
                        id: 'myCustomButton1'
                      }
                    ],
                  },
                  rightBarButtonItems: {
                    viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
                    animated: true,
                    buttons: [
                      Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM
                      
                    ],
                  },
                  toolbarMenuItems: {
                    buttons: [
                      Toolbar.DefaultToolbarButton.THUMBNAILS_BUTTON_ITEM,
                      {
                        image: 'example_toolbar_icon', 
                        id: 'custom_action',
                        title: 'Android title',
                        showAsAction: true
                      },
                    ],
                  },
              };
              this.pdfRef.current?.setToolbar(toolbar);
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
                const toolbarItems = await this.pdfRef.current?.getToolbar();
                Alert.alert('PSPDFKit', JSON.stringify(toolbarItems));
              }}
              title="Get Toolbar Items"
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
