import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import RNFS from 'react-native-fs';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class PSPDFKitViewComponent extends BaseExampleAutoHidingHeaderComponent {
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
          document={exampleDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
        <View style={styles.wrapper}>
          <View style={styles.flex}>
            <Button
              accessibilityLabel={'Get Document Info'}
              testID={'Get Document Info'}
              onPress={ async () => {
                const document = this.pdfRef.current?.getDocument();
                Alert.alert(
                  'PSPDFKit',
                  'Document ID: ' + await document?.getDocumentId(),
                );
              }}
              title="Get Document Info"
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
};
