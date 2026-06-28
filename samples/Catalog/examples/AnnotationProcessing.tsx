import React, { useEffect, useRef } from 'react';
import { Alert, Button, processColor, View, TouchableOpacity, Text } from 'react-native';
import fileSystem from 'react-native-fs';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';
import { Nutrient } from '../helpers/Nutrient';

export const AnnotationProcessing = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  return (
    <View style={styles.flex}>
      <NutrientView
          ref={pdfRef}
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfColor}
      />
      <View style={styles.column}>
          <View style={styles.wrapper}>
            <View>
              <TouchableOpacity
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/embedded.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    // First, save all annotations in the current document.
                    .then(() => {
                      pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, embed all the annotations
                          Nutrient.processAnnotations(
                            Annotation.Change.EMBED,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with embedded annotations.
                                Nutrient.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'Nutrient',
                                  'Failed to embed annotations.',
                                );
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
                <Text style={styles.button}>Embed Annotations</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.marginLeft}>
              <TouchableOpacity
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/flattened.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, flatten all the annotations
                          Nutrient.processAnnotations(
                            Annotation.Change.FLATTEN,
                            [Annotation.Type.INK, Annotation.Type.STAMP],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with flattened annotations.
                                Nutrient.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'Nutrient',
                                  'Failed to embed annotations.',
                                );
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
                <Text style={styles.button}>Flatten Annotations</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.wrapper}>
            <View>
              <TouchableOpacity
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/removed.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, remove all the annotations
                          Nutrient.processAnnotations(
                            Annotation.Change.REMOVE,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with removed annotations.
                                Nutrient.present(processedDocumentPath, {});
                              } else {
                                Alert.alert('Failed to remove annotations.');
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
                <Text style={styles.button}>Remove Annotations</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.marginLeft}>
              <TouchableOpacity
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/printed.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      pdfRef.current?.getDocument()
                        ?.save()
                        .then(_success => {
                          // Then, print all the annotations
                          Nutrient.processAnnotations(
                            Annotation.Change.PRINT,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(successResult => {
                              if (successResult) {
                                // And finally, present the newly processed document with printed annotations.
                                Nutrient.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'Nutrient',
                                  'Failed to print annotations.',
                                );
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
                <Text style={styles.button}>Print Annotations</Text>
              </TouchableOpacity>
            </View>
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
  },
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 5,
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
  marginLeft: { marginLeft: 10 },
};
