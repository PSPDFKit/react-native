import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView, { PDFConfiguration } from 'react-native-pspdfkit';

import {
  formDocumentName,
  formDocumentPath,
  pspdfkitColor,
  writableFormDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

export class ProgrammaticFormFilling extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
    this.state = {
      documentPath: formDocumentPath,
    };
  }

  override componentDidMount() {
    this.setState({ alertVisible: false });
    extractFromAssetsIfMissing(formDocumentName, () => {
      this.setState({ documentPath: writableFormDocumentPath });
    });
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={this.state.documentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgray'),
            documentLabelEnabled: true,
            firstPageAlwaysSingle: false,
            disableAutomaticSaving: true,
            signatureSavingStrategy: 'saveIfSelected',
            iOSFileConflictResolution: PDFConfiguration.IOSFileConflictResolution.CLOSE,
          }}
          onAnnotationsChanged={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              if (this.state.alertVisible === false) {
                Alert.alert(
                  'PSPDFKit',
                  'Annotations changed: ' + JSON.stringify(event),
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.setState({ alertVisible: false });
                      },
                    },
                  ],
                );
                this.setState({ alertVisible: true });
              }
            }
          }}
          style={styles.pdfColor}
        />
        <View style={styles.wrapperView}>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                const forms = this.pdfRef.current?.getDocument().forms;
                if (!forms) {
                  Alert.alert('PSPDFKit', 'Failed to get forms instance');
                  return;
                }

                // Fill Text Form Fields.
                forms.updateTextFormFieldValue('Name_Last', 'Appleseed').then(result => {
                  if (result) {
                    console.log('Successfully set the form field value.');
                  } else {
                    Alert.alert('PSPDFKit', 'Failed to set form field value.');
                  }
                }).catch(error => {
                  Alert.alert('PSPDFKit', JSON.stringify(error));
                });

                forms.updateTextFormFieldValue('Name_First', 'John')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('Address_1', '1 Infinite Loop')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('City', 'Cupertino')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('STATE', 'CA')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('SSN', '123456789')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('Telephone_Home', '(123) 456-7890')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateTextFormFieldValue('Birthdate', '1/1/1983')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });

                // Select a button form elements.
                forms.updateButtonFormFieldValue('Sex.0', true)
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
                forms.updateButtonFormFieldValue('PHD', true)
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Failed to set form field value.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
              }}
              title="Fill Form"
              accessibilityLabel="Fill Form"
            />
          </View>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                // Get all form elements and filter out the 'Name_Last' element
                const document = this.pdfRef.current?.getDocument();
                const formElements = await document?.forms.getFormElements();
                const formElement = formElements?.find(element => element.fullyQualifiedFieldName === 'Name_Last');
                Alert.alert('PSPDFKit', JSON.stringify(formElement?.formField?.value));
              }}
              title="Get Last Name Value"
              accessibilityLabel="Get Last Name Value"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  marginLeft: { marginLeft: 10 },
  wrapperView: {
    flexDirection: 'row' as 'row',
    height: 60,
    alignItems: 'center' as 'center',
    padding: 10,
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
