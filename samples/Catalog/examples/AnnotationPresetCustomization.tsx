import React from 'react';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

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
            allowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
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
