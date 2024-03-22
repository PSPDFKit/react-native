import React from 'react';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { pspdfkitColor, tiffImagePath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class OpenImageDocument extends BaseExampleAutoHidingHeaderComponent {
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
          document={tiffImagePath}
          ref={this.pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            showPageLabels: false,
            iOSUseParentNavigationBar: false,
            iOSAllowToolbarTitleChange: false,
          }}
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
