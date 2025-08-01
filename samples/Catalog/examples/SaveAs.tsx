import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View, Platform } from 'react-native';
import fileSystem from 'react-native-fs';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Nutrient } from '../helpers/Nutrient';

export class SaveAs extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <NutrientView
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
            <TouchableOpacity 
              style={styles.fullWidthButton}
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
                        Nutrient.processAnnotations(
                          Annotation.Change.EMBED,
                          ['all'],
                          writableDocumentPath,
                          newDocumentPath,
                          null
                        )
                          .then(success => {
                            if (success) {
                              Alert.alert(
                                'Nutrient',
                                `Document saved as ${newDocumentPath}`,
                              );
                            } else {
                              Alert.alert(
                                'Nutrient',
                                'Failed to save document',
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
              }}>
              <Text style={styles.button}>Save As</Text>
            </TouchableOpacity>
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
    width: '100%' as '100%',
    height: Platform.OS === 'ios' ? 80 : 60,
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
  },
};
