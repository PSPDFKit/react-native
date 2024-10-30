import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView, { RemoteDocumentConfiguration } from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import RNFS from 'react-native-fs';

export class OpenRemoteDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();
    hideToolbar(navigation);
  }

  override render() {
    const { navigation } = this.props;
    const myDocumentPath = RNFS.TemporaryDirectoryPath + '/test.pdf';

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document="https://pspdfkit.com/downloads/pspdfkit-react-native-quickstart-guide.pdf"
          configuration={{
            remoteDocumentConfiguration: {
              outputFilePath: myDocumentPath,
              overwriteExisting: true
            },
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
