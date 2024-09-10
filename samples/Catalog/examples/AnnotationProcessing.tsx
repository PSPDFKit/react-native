import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import fileSystem from 'react-native-fs';
import PSPDFKitView, { Annotation } from 'react-native-pspdfkit';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class AnnotationProcessing extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<PSPDFKitView>();
    hideToolbar(navigation);
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
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
              <Button
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
                      this.pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, embed all the annotations
                          PSPDFKit.processAnnotations(
                            Annotation.Change.EMBED,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with embedded annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'PSPDFKit',
                                  'Failed to embed annotations.',
                                );
                              }
                            })
                            .catch(error => {
                              Alert.alert('PSPDFKit', JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          Alert.alert('PSPDFKit', JSON.stringify(error));
                        });
                    });
                }}
                title="Embed Annotations"
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
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
                      this.pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, flatten all the annotations
                          PSPDFKit.processAnnotations(
                            Annotation.Change.FLATTEN,
                            [Annotation.Type.INK, Annotation.Type.STAMP],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with flattened annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'PSPDFKit',
                                  'Failed to embed annotations.',
                                );
                              }
                            })
                            .catch(error => {
                              Alert.alert('PSPDFKit', JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          Alert.alert('PSPDFKit', JSON.stringify(error));
                        });
                    });
                }}
                title="Flatten Annotations"
              />
            </View>
          </View>
          <View style={styles.wrapper}>
            <View>
              <Button
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
                      this.pdfRef.current?.getDocument()
                        ?.save()
                        .then(_saved => {
                          // Then, remove all the annotations
                          PSPDFKit.processAnnotations(
                            Annotation.Change.REMOVE,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with removed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                Alert.alert('Failed to remove annotations.');
                              }
                            })
                            .catch(error => {
                              Alert.alert('PSPDFKit', JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          Alert.alert('PSPDFKit', JSON.stringify(error));
                        });
                    });
                }}
                title="Remove Annotations"
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
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
                      this.pdfRef.current?.getDocument()
                        ?.save()
                        .then(_success => {
                          // Then, print all the annotations
                          PSPDFKit.processAnnotations(
                            Annotation.Change.PRINT,
                            [Annotation.Type.ALL],
                            writableDocumentPath,
                            processedDocumentPath,
                            null
                          )
                            .then(successResult => {
                              if (successResult) {
                                // And finally, present the newly processed document with printed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                Alert.alert(
                                  'PSPDFKit',
                                  'Failed to print annotations.',
                                );
                              }
                            })
                            .catch(error => {
                              Alert.alert('PSPDFKit', JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          Alert.alert('PSPDFKit', JSON.stringify(error));
                        });
                    });
                }}
                title="Print Annotations"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

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
  marginLeft: { marginLeft: 10 },
};
