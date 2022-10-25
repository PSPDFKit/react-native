import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import fileSystem from 'react-native-fs';
import { PSPDFKit } from '../helpers/PSPDFKit';
import React from 'react';
import { hideToolbar } from '../helpers/NavigationHelper';

export class AnnotationProcessing extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();

    hideToolbar(navigation);

    navigation.addListener('beforeRemove', e => {
      this.pdfRef?.current?.destroyView();
    });
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.removeListener('beforeRemove');
  }

  render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
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
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, embed all the annotations
                          PSPDFKit.processAnnotations(
                            'embed',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with embedded annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to embed annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
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
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, flatten all the annotations
                          PSPDFKit.processAnnotations(
                            'flatten',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with flattened annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to embed annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
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
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, remove all the annotations
                          PSPDFKit.processAnnotations(
                            'remove',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with removed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to remove annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
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
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(success => {
                          // Then, print all the annotations
                          PSPDFKit.processAnnotations(
                            'print',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(successResult => {
                              if (successResult) {
                                // And finally, present the newly processed document with printed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to print annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  marginLeft: { marginLeft: 10 },
};
