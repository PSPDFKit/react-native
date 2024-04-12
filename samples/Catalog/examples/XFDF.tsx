import React from 'react';
import { Alert, Button, Platform, processColor, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { pspdfkitColor, exampleReportPath, writableXFDFPath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import { getOutputPath } from '../helpers/FileHelper';
import RNFS from 'react-native-fs';

export class XFDF extends BaseExampleAutoHidingHeaderComponent {
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
          document={exampleReportPath}
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
        <SafeAreaView>
          <View style={styles.column}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={ async () => {
                  const result = await this.pdfRef.current?.importXFDF(writableXFDFPath);
                  Alert.alert('PSPDFKit', 'Import XFDF result: ' + JSON.stringify(result));
                  console.log('Import XFDF result:', result);
                }}>
                  <Text style={styles.button}>{'Import XFDF'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ async () => {
                  const outputFile = RNFS.TemporaryDirectoryPath + '/test.xfdf';
                  const result = await this.pdfRef.current?.exportXFDF(outputFile);
                  Alert.alert('PSPDFKit', 'Export XFDF result:' + JSON.stringify(result));
                  console.log('Export XFDF result:', result);
                }}>
                  <Text style={styles.button}>{'Export XFDF'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
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
