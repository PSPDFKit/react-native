import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { NotificationCenter, PDFConfiguration } from '@nutrient-sdk/react-native';

import {
  formDocumentName,
  formDocumentPath,
  pspdfkitColor,
  writableFormDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

export class ProgrammaticFormFilling extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
    this.state = {
      documentPath: formDocumentPath,
    };
  }

  override componentDidMount() {
    extractFromAssetsIfMissing(formDocumentName, () => {
      this.setState({ documentPath: writableFormDocumentPath });
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.VALUES_UPDATED, (event: any) => {
      console.log(JSON.stringify(event));
    });
  }

  private async handleFillFormPress() {
    const forms = this.pdfRef.current?.getDocument().forms;
    if (!forms) {
      Alert.alert('Nutrient', 'Failed to get forms instance');
      return;
    }

    // Fill Text Form Fields.
    forms.updateTextFormFieldValue('Name_Last', 'Appleseed').then(result => {
      if (result) {
        console.log('Successfully set the form field value.');
      } else {
        Alert.alert('Nutrient', 'Failed to set form field value.');
      }
    }).catch(error => {
      Alert.alert('Nutrient', JSON.stringify(error));
    });

    forms.updateTextFormFieldValue('Name_First', 'John')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Address_1', '1 Infinite Loop')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('City', 'Cupertino')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('STATE', 'CA')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('SSN', '123456789')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Telephone_Home', '(123) 456-7890')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Birthdate', '1/1/1983')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });

    // Select a button form elements.
    forms.updateButtonFormFieldValue('Sex.0', true)
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
    forms.updateButtonFormFieldValue('PHD', true)
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          Alert.alert(
            'Nutrient',
            'Failed to set form field value.',
          );
        }
      })
      .catch(error => {
        Alert.alert('Nutrient', JSON.stringify(error));
      });
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
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
              Alert.alert('Nutrient', event.error);
            } else {
              Alert.alert(
                'Nutrient',
                'Annotations changed: ' + JSON.stringify(event),
              );
            }
          }}
          style={styles.pdfColor}
        />
        {this.renderWithSafeArea(insets => (
          <View style={[styles.column, { paddingBottom: insets.bottom }]}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity
                  onPress={() => this.handleFillFormPress()}
                  accessibilityLabel="Fill Form"
                >
                  <Text style={styles.button}>Fill Form</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    // Get all form elements and filter out the 'Name_Last' element
                    const document = this.pdfRef.current?.getDocument();
                    const formElements = await document?.forms.getFormElements();
                    const formElement = formElements?.find(element => element.fullyQualifiedFieldName === 'Name_Last');
                    Alert.alert('Nutrient', JSON.stringify(formElement?.formField?.value));
                  }}
                  accessibilityLabel="Get Last Name Value"
                >
                  <Text style={styles.button}>Get Last Name Value</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
    overflow: 'visible' as 'visible',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    padding: 10,
    // backgroundColor: 'lime', // Remove debug background
    overflow: 'visible' as 'visible',
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 24,
    paddingVertical: 10,
  },
};
