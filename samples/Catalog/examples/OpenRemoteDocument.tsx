import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import PSPDFKitView, { RemoteDocumentConfiguration } from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import RNFS from 'react-native-fs';

export class OpenRemoteDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

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
        {this.renderWithSafeArea(insets => (
          <View style={[styles.column, { paddingBottom: insets.bottom }]}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={async () => {
                  const document = this.pdfRef.current?.getDocument();
                  Alert.alert(
                    'PSPDFKit',
                    'Document ID: ' + await document?.getDocumentId(),
                  );
                }}>
                  <Text style={styles.button}>{'Get Document ID'}</Text>
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
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    flex: 1,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
  },
};
