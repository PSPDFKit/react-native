import React from 'react';
import { Alert, Platform, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { PDFConfiguration, Toolbar } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class ToolbarCustomization extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          menuItemGrouping={['ink', 'highlight', 'note', 'signature']}
          disableAutomaticSaving={true}
          configuration={{
            iOSFileConflictResolution: PDFConfiguration.IOSFileConflictResolution.CLOSE,
            userInterfaceViewMode: 'alwaysVisible',
            iOSBackgroundColor: processColor('lightgrey'),
            enableAnnotationEditing: true,
            documentLabelEnabled: false,
            iOSAllowToolbarTitleChange: false,
            pageMode: 'single',
            signatureSavingStrategy: 'alwaysSave',
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
            Alert.alert('Nutrient', `Custom button tapped: ${JSON.stringify(event)}`);
          }}
          style={styles.pdfColor}
        />
        {this.renderWithSafeArea(insets => (
          <View style={[styles.column, { paddingBottom: insets.bottom }]}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={async () => {
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
                accessibilityLabel="Set Toolbar Items"
              >
                <Text style={styles.button}>Set Toolbar</Text>
              </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  if (Platform.OS === 'android') {
                    Alert.alert('Nutrient', 'Not supported on Android');
                    return;
                  }
                  const toolbarItems = await this.pdfRef.current?.getToolbar();
                  Alert.alert('Nutrient', JSON.stringify(toolbarItems));
                }}
              >
                <Text style={styles.button}>Get Toolbar</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    height: 50,
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    flex: 1,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
};
