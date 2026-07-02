import React, { useRef, useState } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';

export const StateChange = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);
  const [state, setState] = useState({
    currentPageIndex: 0,
    pageCount: 0,
    annotationCreationActive: false,
    annotationEditingActive: false,
  });

  let buttonTitle;
  if (state.annotationCreationActive) {
      buttonTitle = 'Exit Annotation Creation Mode';
    } else if (state.annotationEditingActive) {
      buttonTitle = 'Exit Annotation Editing Mode';
  } else {
      buttonTitle = 'Enter Annotation Creation Mode';
  }
  return (
    <View style={styles.flex}>
      <NutrientView
          ref={pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            showPageLabels: true,
          }}
          menuItemGrouping={[
            {
              key: 'drawing',
              items: [
                'pen',
              ],
            },
          ]}
          pageIndex={state.currentPageIndex}
          style={styles.pdfColor}
          onStateChanged={(event: {
            currentPageIndex: any;
            annotationCreationActive: any;
            annotationEditingActive: any;
            pageCount: any;
          }) => {
            if (event.currentPageIndex !== state.currentPageIndex) {
              return;
            }

            setState(prev => ({
              ...prev,
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount,
            }));
          }}
      />
      <View style={styles.column}>
          <View style={styles.annotationContainer}>
            <TouchableOpacity
              accessibilityLabel="Change state"
              testID="Change state"
              onPress={() => {
                if (
                  state.annotationCreationActive ||
                  state.annotationEditingActive
                ) {
                  pdfRef.current?.exitCurrentlyActiveMode();
                } else {
                  pdfRef.current?.enterAnnotationCreationMode(Annotation.Type.PEN);
                }
              }}
            >
              <Text style={styles.button}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalContainer}>
            <Text accessibilityLabel="Page Number" style={styles.pageText}>
              {'Page ' +
                (state.currentPageIndex + 1) +
                ' of ' +
                state.pageCount}
            </Text>
            <TouchableOpacity
              accessibilityLabel="Previous Page"
              onPress={() => {
                setState(previousState => {
                  return {
                    ...previousState,
                    currentPageIndex: previousState.currentPageIndex - 1,
                  };
                });
              }}
              disabled={state.currentPageIndex === 0}
            >
              <Text style={[styles.button, state.currentPageIndex === 0 && styles.disabledButton]}>Previous Page</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Next Page"
              onPress={() => {
                setState(previousState => ({
                  ...previousState,
                  currentPageIndex: previousState.currentPageIndex + 1,
                }));
              }}
              disabled={
                state.currentPageIndex === state.pageCount - 1
              }
            >
              <Text style={[styles.button, state.currentPageIndex === state.pageCount - 1 && styles.disabledButton]}>Next Page</Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  annotationContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 44,
    paddingVertical: 10,
  },
  disabledButton: {
    color: '#999999',
  },
  pageText: {
    fontSize: 16,
    color: pspdfkitColor,
    flex: 1,
  },
};
