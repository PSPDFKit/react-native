import React, { useEffect, useRef, useState } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { NotificationCenter, PDFConfiguration } from '@nutrient-sdk/react-native';

import {
  formDocumentName,
  formDocumentPath,
  pspdfkitColor,
  writableFormDocumentPath,
} from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

export const ProgrammaticFormFilling = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const alertShowingRef = useRef(false);
  const [documentPath, setDocumentPath] = useState(formDocumentPath);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    extractFromAssetsIfMissing(formDocumentName, () => {
      setDocumentPath(writableFormDocumentPath);
    });

    const center = pdfRef.current?.getNotificationCenter();
    center?.subscribe(NotificationCenter.FormFieldEvent.VALUES_UPDATED, (event: any) => {
      console.log(JSON.stringify(event));
    });

    return () => {
      center?.unsubscribeAllEvents();
    };
  }, []);

  const handleFillFormPress = async () => {
    const forms = pdfRef.current?.getDocument().forms;
    if (!forms) {
      showAlertOnce('Nutrient', 'Failed to get forms instance');
      return;
    }

    // Fill Text Form Fields.
    forms.updateTextFormFieldValue('Name_Last', 'Appleseed').then(result => {
      if (result) {
        console.log('Successfully set the form field value.');
      } else {
        showAlertOnce('Nutrient', 'Failed to set form field value.');
      }
    }).catch(error => {
      showAlertOnce('Nutrient', JSON.stringify(error));
    });

    forms.updateTextFormFieldValue('Name_First', 'John')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Address_1', '1 Infinite Loop')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('City', 'Cupertino')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('STATE', 'CA')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('SSN', '123456789')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Telephone_Home', '(123) 456-7890')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateTextFormFieldValue('Birthdate', '1/1/1983')
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });

    // Select a button form elements.
    forms.updateButtonFormFieldValue('Sex.0', true)
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
    forms.updateButtonFormFieldValue('PHD', true)
      .then(result => {
        if (result) {
          console.log('Successfully set the form field value.');
        } else {
          showAlertOnce('Nutrient', 'Failed to set form field value.');
        }
      })
      .catch(error => {
        showAlertOnce('Nutrient', JSON.stringify(error));
      });
  }

  const showAlertOnce = (title: string, message: string) => {
    if (alertShowingRef.current) {
      return; // Skip if alert is already showing
    }
    alertShowingRef.current = true;
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => { alertShowingRef.current = false; } }
    ]);
  }

  const handleAddFormFields = async () => {
    try {
      const document = pdfRef.current?.getDocument();
      // Get all text rects for page 0
      const textRects = await document?.getPageTextRects(0);
      if (!textRects || textRects.length === 0) {
        showAlertOnce('Nutrient', 'No text found on page');
        return;
      }

      // Find the first occurrence of "NAME" (case-insensitive)
      const nameRect = textRects.find(rect => 
        rect.text.toUpperCase() === 'NAME'
      );

      if (!nameRect) {
        showAlertOnce('Nutrient', 'Could not find "NAME" on the page');
        return;
      }

      // Find "EMPLOYEE SIGNATURE" - it might be split into multiple words
      let employeeSignatureRect = null;
      let employeeIndex = -1;

      // First, find "EMPLOYEE" and "SIGNATURE" separately
      for (let i = 0; i < textRects.length; i++) {
        const rect = textRects[i];
        if (!rect) continue;
        if (rect.text.toUpperCase() === 'EMPLOYEE') {
          employeeIndex = i;
        }
        if (rect.text.toUpperCase() === 'SIGNATURE' && employeeIndex >= 0 && i === employeeIndex + 1) {
          // Use the "SIGNATURE" rect as our reference point
          employeeSignatureRect = rect;
          break;
        }
      }

      // If not found as separate words, try to find it as a single word
      if (!employeeSignatureRect) {
        const foundRect = textRects.find(rect => 
          rect.text.toUpperCase().includes('EMPLOYEE') && 
          rect.text.toUpperCase().includes('SIGNATURE')
        );
        if (foundRect) {
          employeeSignatureRect = foundRect;
        }
      }

      if (!employeeSignatureRect) {
        showAlertOnce('Nutrient', 'Could not find "EMPLOYEE SIGNATURE" on the page');
        return;
      }

      // Calculate position for text field above "NAME"
      const nameSpacing = 5;
      const nameFieldHeight = 20;
      const nameFieldWidth = 200;

      const nameFrame = nameRect.frame;
      const nameFieldBbox = {
        left: nameFrame.x,
        top: nameFrame.y + nameSpacing + nameFieldHeight,
        right: nameFrame.x + nameFieldWidth,
        bottom: nameFrame.y + nameSpacing
      };

      // Calculate position for signature field below "EMPLOYEE SIGNATURE"
      const signatureSpacing = 5;
      const signatureFieldHeight = 50;
      const signatureFieldWidth = 200;

      const signatureFrame = employeeSignatureRect.frame;
      const signatureFieldBbox = {
        left: signatureFrame.x,
        top: signatureFrame.y - signatureSpacing,
        right: signatureFrame.x + signatureFieldWidth,
        bottom: signatureFrame.y - signatureSpacing - signatureFieldHeight
      };

      // Add both fields
      const nameFieldResult = await document?.forms.addTextFormField({
        pageIndex: 0,
        bbox: nameFieldBbox,
        fullyQualifiedName: 'NameFieldTest'
      });

      const signatureFieldResult = await document?.forms.addElectronicSignatureFormField({
        pageIndex: 0,
        bbox: signatureFieldBbox,
        fullyQualifiedName: 'EmployeeSignatureFieldTest'
      });

      if (nameFieldResult && signatureFieldResult) {
        showAlertOnce('Nutrient', 'Both form fields added successfully');
      } else if (nameFieldResult) {
        showAlertOnce('Nutrient', 'Text field added, but signature field failed');
      } else if (signatureFieldResult) {
        showAlertOnce('Nutrient', 'Signature field added, but text field failed');
      } else {
        showAlertOnce('Nutrient', 'Failed to add form fields');
      }
    } catch (error) {
      showAlertOnce('Nutrient', `Error: ${JSON.stringify(error)}`);
    }
  };

  return (
      <View style={styles.flex}>
        <NutrientView
          ref={pdfRef}
          document={documentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgray'),
            documentLabelEnabled: true,
            firstPageAlwaysSingle: false,
            disableAutomaticSaving: true,
            signatureSavingStrategy: 'saveIfSelected',
            iOSFileConflictResolution: PDFConfiguration.IOSFileConflictResolution.CLOSE,
          }}
          onAnnotationsChanged={(event: { error: any }) => {
            if (alertShowingRef.current) {
              return; // Skip if alert is already showing
            }
            alertShowingRef.current = true;
            if (event.error) {
              Alert.alert('Nutrient', event.error, [
                { text: 'OK', onPress: () => { alertShowingRef.current = false; } }
              ]);
            } else {
              Alert.alert(
                'Nutrient',
                'Annotations changed: ' + JSON.stringify(event),
                [{ text: 'OK', onPress: () => { alertShowingRef.current = false; } }]
              );
            }
          }}
          style={styles.pdfColor}
        />
        {renderWithBaseExampleSafeArea(insets => (
          <View style={[styles.column, { paddingBottom: insets.bottom }]}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity
                  onPress={() => handleFillFormPress()}
                  accessibilityLabel="Fill Form"
                >
                  <Text style={styles.button}>Fill Form</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAddFormFields()}
                  accessibilityLabel="Add FormFields"
                >
                  <Text style={styles.button}>Add FormFields</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
  );
};

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
