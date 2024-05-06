import React from 'react';
import { Alert, processColor, View } from 'react-native';
import PSPDFKitView, { Annotation } from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class AnnotationPresetCustomization extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;
  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<PSPDFKitView>();
    hideToolbar(navigation);
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          annotationContextualMenu={
            {
              buttons: [
                {
                  id: 'custom_annotation_item',
                  image: 'example_annotation_icon',
                  title: 'Custom',
                  selectable: false,
                },
              ],
              retainSuggestedMenuItems: true,
            }
          }
          onCustomAnnotationContextualMenuItemTapped={
            (result: any) => {
              Alert.alert('PSPDFKit', `Custom annotation contextual menu item tapped: ${JSON.stringify(result)}`);
            }
          }
          annotationPresets={{
            inkPen: {
              defaultThickness: 50,
              minimumThickness: 1,
              maximumThickness: 60,
              defaultColor: '#99cc00',
            },
            freeText: {
              defaultTextSize: 20,
              defaultColor: '#FF0000',
            },
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
