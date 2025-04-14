import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import fileSystem from 'react-native-fs';
import PSPDFKitView, { Annotation } from 'react-native-pspdfkit';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class SaveAs extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey')
          }}
          pageIndex={3}
          style={styles.colorView(pspdfkitColor)}
        />
        {this.renderWithSafeArea(insets => (
          <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
            <View style={styles.flex}>
              <Button
                onPress={() => {
                  // Ensure that the path to the new document is a writable document path
                  // You can use a React Native package like https://github.com/rnmods/react-native-document-picker to allow users of your application to select the path and the file name for the new document
                  const newDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/newdocument.pdf';
                  // Delete the document if it already exists in that path.
                  fileSystem
                    .exists(newDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(newDocumentPath);
                      }
                    })
                    // First, save all annotations in the current document.
                    .then(() => {
                      this.pdfRef?.current?.getDocument().save()
                        .then(_saved => {
                          // Then, embed all the annotations
                          PSPDFKit.processAnnotations(
                            Annotation.Change.EMBED,
                            ['all'],
                            writableDocumentPath,
                            newDocumentPath,
                            null
                          )
                            .then(success => {
                              if (success) {
                                Alert.alert(
                                  'PSPDFKit',
                                  `Document saved as ${newDocumentPath}`,
                                );
                              } else {
                                Alert.alert(
                                  'PSPDFKit',
                                  'Failed to save document',
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
                title="Save As"
              />
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  colorView: (color: any) => ({ flex: 1, color }),
  buttonContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
};
