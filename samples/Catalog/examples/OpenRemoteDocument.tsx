import React, { useEffect, useRef } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View, Platform } from 'react-native';
import NutrientView, { RemoteDocumentConfiguration } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';
import RNFS from 'react-native-fs';

export const OpenRemoteDocument = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  const myDocumentPath = RNFS.TemporaryDirectoryPath + '/test.pdf';

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document="https://www.nutrient.io/downloads/pspdfkit-react-native-quickstart-guide.pdf"
        configuration={{
          remoteDocumentConfiguration: {
            outputFilePath: myDocumentPath,
            overwriteExisting: true,
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
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={async () => {
              const document = pdfRef.current?.getDocument();
              Alert.alert(
                'Nutrient',
                'Document ID: ' + (await document?.getDocumentId()),
              );
            }}
          >
            <Text style={styles.button}>{'Get Document ID'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  buttonContainer: {
    width: '100%' as '100%',
    height: 80,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  fullWidthButton: {
    width: '100%' as '100%',
    height: '100%' as '100%',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    minHeight: 44,
  },
};
