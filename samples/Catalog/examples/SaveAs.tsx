import React, { useRef } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View, Platform } from 'react-native';
import fileSystem from 'react-native-fs';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { Nutrient } from '../helpers/Nutrient';

export const SaveAs = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={writableDocumentPath}
        disableAutomaticSaving={true}
        fragmentTag="PDF1"
        showNavigationButtonInToolbar={true}
        onNavigationButtonClicked={() => navigation.goBack()}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
        }}
        pageIndex={3}
        style={styles.colorView(pspdfkitColor)}
      />
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={() => {
              const newDocumentPath =
                fileSystem.DocumentDirectoryPath + '/newdocument.pdf';
              fileSystem
                .exists(newDocumentPath)
                .then(exists => {
                  if (exists) {
                    fileSystem.unlink(newDocumentPath);
                  }
                })
                .then(() => {
                  pdfRef.current
                    ?.getDocument()
                    .save()
                    .then(_saved => {
                      Nutrient.processAnnotations(
                        Annotation.Change.EMBED,
                        ['all'],
                        writableDocumentPath,
                        newDocumentPath,
                        null,
                      )
                        .then(success => {
                          if (success) {
                            Alert.alert(
                              'Nutrient',
                              `Document saved as ${newDocumentPath}`,
                            );
                          } else {
                            Alert.alert('Nutrient', 'Failed to save document');
                          }
                        })
                        .catch(error => {
                          Alert.alert('Nutrient', JSON.stringify(error));
                        });
                    })
                    .catch(error => {
                      Alert.alert('Nutrient', JSON.stringify(error));
                    });
                });
            }}
          >
            <Text style={styles.button}>Save As</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  colorView: (color: any) => ({ flex: 1, color }),
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
