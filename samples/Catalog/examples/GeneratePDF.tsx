import React, { useRef } from 'react';
import { processColor, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { pspdfkitColor } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';

export const GeneratePDF = ({ route, navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);
  const { fullPath } = route.params;

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={fullPath}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
        }}
        style={styles.pdfColor}
      />
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
