import React, { useEffect, useRef } from 'react';
import { Alert, processColor, View } from 'react-native';
import NutrientView, { Annotation, ShouldExecuteActionEvent } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';

export const AnnotationPresetCustomization = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <NutrientView
          ref={pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          onShouldExecuteAction={(event: ShouldExecuteActionEvent) => {
            // Inspect the actionType and URL and optionally allow the action to proceed
            pdfRef.current?.executeAction(event.requestId, true);
          }}
          annotationContextualMenu={{
            buttons: [
              // System annotation menu items (only applied when retainSuggestedMenuItems is false).
              Annotation.TextSelectionMenuItem.COPY,
              Annotation.TextSelectionMenuItem.DELETE,
              {
                id: 'custom_annotation_item',
                image: 'example_annotation_icon',
                title: 'Custom',
                titleRes: 'custom_annotation_item_title',
                selectable: false,
              },
            ],
            retainSuggestedMenuItems: false,
          }}
          textSelectionContextualMenu={{
            buttons: [
              Annotation.TextSelectionMenuItem.COPY,
              {
                id: 'custom_text_item',
                image: 'example_annotation_icon',
                title: 'Text Action',
                titleRes: 'custom_text_item_title',
              },
            ],
            retainSuggestedMenuItems: false,
          }}
          onCustomAnnotationContextualMenuItemTapped={(result: any) => {
            Alert.alert(
              'Nutrient',
              `Custom annotation contextual menu item tapped: ${JSON.stringify(result)}`,
            );
          }}
          onCustomTextSelectionContextualMenuItemTapped={(result: any) => {
            Alert.alert(
              'Nutrient',
              `Custom text selection contextual menu item tapped: ${JSON.stringify(result)}`,
            );
          }}
          annotationPresets={{
            arrow: {
              defaultColor: '#000000',
              defaultBorderStyle: 'dashed_1_3'
            },
            inkPen: {
              defaultThickness: 50,
              defaultColor: '#99cc00',
              availableColors: ['#99cc00', '#ffcc00', '#ff9900', '#ff0000', '#000000'],
              minimumAlpha: 0.5,
              forceDefaults: true
            },
            freeText: {
              defaultTextSize: 40,
              defaultColor: '#FF0000',
            },
            line: {
              defaultColor: '#99cc00',
              defaultLineEnd: 'openArrow,openArrow',
              defaultBorderStyle: Annotation.BorderStyle.DASHED_3_3,
            },
            measurementAreaRect: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            square: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3'
            },
            measurementAreaEllipse: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementAreaPolygon: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementDistance: {
              defaultLineEnd: 'circle,circle',
              defaultColor: '#99cc00',
              defaultThickness: 5,
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementPerimeter: {
              defaultLineEnd: 'circle,circle',
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            }
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
      />
    </View>
  );
};
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
