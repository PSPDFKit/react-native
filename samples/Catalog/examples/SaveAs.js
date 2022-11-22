import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import React from 'react';
import fileSystem from 'react-native-fs';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class SaveAs extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;

  constructor(props) {
    super(props);
    this.pdfRef = React.createRef();
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
          pageIndex={3}
          style={styles.colorView(pspdfkitColor)}
        />
        <View style={styles.buttonContainer}>
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
                    this.pdfRef.current
                      .saveCurrentDocument()
                      .then(saved => {
                        // Then, embed all the annotations
                        PSPDFKit.processAnnotations(
                          'embed',
                          'all',
                          writableDocumentPath,
                          newDocumentPath,
                        )
                          .then(success => {
                            if (success) {
                              alert(`Document saved as ${newDocumentPath}`);
                            } else {
                              alert('Failed to save document');
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
              title="Save As"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  colorView: color => ({ flex: 1, color }),
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
};
