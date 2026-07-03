import React, { useEffect, useRef } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { pspdfkitColor, exampleReportPath, writableXFDFPath } from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';
import RNFS from 'react-native-fs';

export const XFDF = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <NutrientView
          ref={pdfRef}
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
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.column, { paddingBottom: insets.bottom }]}>
          <View>
            <View style={styles.horizontalContainer}>
              <TouchableOpacity
                onPress={async () => {
                  const result = await pdfRef.current
                    ?.getDocument()
                    .importXFDF(writableXFDFPath);
                  Alert.alert('Nutrient', 'Import XFDF result: ' + JSON.stringify(result));
                  console.log('Import XFDF result: ', result);
                }}
              >
                <Text style={styles.button}>{'Import XFDF'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const outputFile = RNFS.TemporaryDirectoryPath + '/test.xfdf';
                  if (await RNFS.exists(outputFile)) {
                    await RNFS.unlink(outputFile);
                  }
                  const result = await pdfRef.current
                    ?.getDocument()
                    .exportXFDF(outputFile);
                  Alert.alert('Nutrient', 'Export XFDF result: ' + JSON.stringify(result));
                  console.log('Export XFDF result: ', result);
                }}
              >
                <Text style={styles.button}>{'Export XFDF'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

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
