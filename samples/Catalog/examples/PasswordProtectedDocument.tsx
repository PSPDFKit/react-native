import React from 'react';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { examplePasswordDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class PasswordProtectedDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();
    hideToolbar(navigation);
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={examplePasswordDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
            documentPassword: 'myPassword'
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
