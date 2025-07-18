import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import PSPDFKitView, { FormField, PDFConfiguration } from 'react-native-pspdfkit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class PSPDFKitViewComponent extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;
  
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
            iOSDocumentInfoOptions: [PDFConfiguration.IOSDocumentInfoOption.OUTLINE, PDFConfiguration.IOSDocumentInfoOption.ANNOTATIONS],
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
                <TouchableOpacity onPress={ async () => {
                  const document = this.pdfRef.current?.getDocument();
                  Alert.alert(
                    'PSPDFKit',
                    'Document ID: ' + await document?.getDocumentId(),
                  );
                }}>
                  <Text style={styles.button}>{'Get Document ID'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ async () => {
                  const documentProperties = PSPDFKit.getDocumentProperties(exampleDocumentPath);
                  Alert.alert('PSPDFKit', 
                    'Document Properties: ' + JSON.stringify(documentProperties));
                    console.log('Document Properties: ', documentProperties);
                }}>
                  <Text style={styles.button}>{'Get Document Props'}</Text>
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
  },
};