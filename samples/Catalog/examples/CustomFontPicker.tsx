import React, { useEffect, useRef } from 'react';
import { processColor, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';

export const CustomFontPicker = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <NutrientView
        document={exampleDocumentPath}
        ref={pdfRef}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
          showThumbnailBar: 'scrubberBar',
          iOSUseParentNavigationBar: false,
        }}
        availableFontNames={[
          'Arial',
          'Calibri',
          'Times New Roman',
          'Roboto',
          'Helvetica',
          'Comic Sans MS',
        ]}
        selectedFontName={'Roboto'}
        showDownloadableFonts={false}
        style={styles.pdfColor}
      />
    </View>
  );
};
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
