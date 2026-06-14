import React, { useLayoutEffect, useRef } from 'react';
import { processColor, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';

export const HiddenToolbar = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'HiddenToolbar',
      headerRight: undefined,
    });
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={exampleDocumentPath}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
          // If you want to hide the toolbar it's essential to also hide the document label overlay.
          documentLabelEnabled: false,
          // We want to keep the thumbnail bar always visible, but the automatic mode is also supported with hideDefaultToolbar.
        //  userInterfaceViewMode: 'never',
      //    iOSUseParentNavigationBar: true,
          // This will hide the main toolbar. A change to the application's styles.xml is required to fully hide the Android tabBar.
          androidShowDefaultToolbar: true,
          androidRemoveStatusBarOffset: true,
        }}
        disableAutomaticSaving={true}
        fragmentTag="PDF1"
        style={styles.pdfColor}
      />
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
