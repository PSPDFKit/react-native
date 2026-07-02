import React, { useRef } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View, Platform } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';

export const ManualSave = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={writableDocumentPath}
        disableAutomaticSaving={true}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
        }}
        menuItemGrouping={[
          'note',
          { key: 'markup', items: ['freetext', 'freetext_callout'] },
          { key: 'markup', items: ['pen', 'magic_ink', 'highlighter'] },
          { key: 'drawing', items: ['arrow', 'line', 'square', 'circle', 'polygon', 'polyline', 'cloudy_polygon'] },
          { key: 'measurement', items: ['distance', 'perimeter', 'area_polygon', 'area_square', 'area_circle'] },
          { key: 'multimedia', items: ['image', 'stamp', 'signature', 'link', 'camera'] },
          'eraser',
        ]}
        pageIndex={3}
        style={styles.pdfColor}
      />
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            accessibilityLabel={'Save Button'}
            testID={'Save Button'}
            onPress={() => {
              pdfRef.current
                ?.getDocument()
                .save()
                .then(saved => {
                  if (saved) {
                    Alert.alert('Nutrient', 'Successfully saved current document.');
                  } else {
                    Alert.alert(
                      'Nutrient',
                      'Document was not saved as it was not modified.',
                    );
                  }
                })
                .catch(error => {
                  Alert.alert('Nutrient', JSON.stringify(error));
                });
            }}
          >
            <Text style={styles.button}>Save</Text>
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
