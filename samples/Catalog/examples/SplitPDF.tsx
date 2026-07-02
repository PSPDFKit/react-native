import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, processColor, View } from 'react-native';
import NutrientView, { NotificationCenter } from '@nutrient-sdk/react-native';

import {
  exampleDocumentPath,
  formDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';

export const SplitPDF = ({ navigation }: any) => {
  const [dimensions, setDimensions] = useState<any>(undefined);
  const pdfRef1 = useRef<NutrientView | null>(null);
  const pdfRef2 = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    pdfRef1.current?.getNotificationCenter().subscribe(
      NotificationCenter.DocumentEvent.LOADED,
      (event: any) => {
        console.log(JSON.stringify(event));
      },
    );

    pdfRef2.current?.getNotificationCenter().subscribe(
      NotificationCenter.DocumentEvent.LOADED,
      (event: any) => {
        console.log(JSON.stringify(event));
      },
    );

    pdfRef1.current?.getNotificationCenter().subscribe(
      NotificationCenter.DocumentEvent.TAPPED,
      (event: any) => {
        console.log(JSON.stringify(event));
      },
    );

    pdfRef2.current?.getNotificationCenter().subscribe(
      NotificationCenter.DocumentEvent.TAPPED,
      (event: any) => {
        console.log(JSON.stringify(event));
      },
    );

    const timeoutId = setTimeout(() => {
      pdfRef1.current?.getNotificationCenter().unsubscribeAllEvents();
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      pdfRef1.current?.getNotificationCenter().unsubscribeAllEvents();
      pdfRef2.current?.getNotificationCenter().unsubscribeAllEvents();
    };
  }, []);

  const getOptimalLayoutDirection = () => {
    const width = dimensions ? dimensions.width : Dimensions.get('window').width;
    return width > 450 ? 'row' : 'column';
  };

  const onLayout = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const layoutDirection = getOptimalLayoutDirection();
  return (
    <View style={styles.wrapper(layoutDirection)} onLayout={onLayout}>
      <NutrientView
          ref={pdfRef1}
          document={formDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          fragmentTag='fragmentTag1'
          style={styles.pdfView}
      />
      <NutrientView
          ref={pdfRef2}
          document={exampleDocumentPath}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          fragmentTag='fragmentTag2'
          style={styles.pdfColor}
      />
    </View>
  );
};
const styles = {
  wrapper: (layoutDirection: any) => ({
    flex: 1,
    flexDirection: layoutDirection,
    justifyContent: 'center' as 'center',
  }),
  pdfView: { flex: 1, color: pspdfkitColor },
  pdfColor: { flex: 1, color: '#9932CC' },
};
