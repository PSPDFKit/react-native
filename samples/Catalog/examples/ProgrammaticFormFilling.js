import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Button, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {formDocumentPath, pspdfkitColor} from '../configuration/Constants';
import React from 'react';

export class ProgrammaticFormFilling extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={formDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={{marginLeft: 10}}>
            <Button
              onPress={() => {
                // Fill Text Form Fields.
                this.refs.pdfView
                  .setFormFieldValue('Name_Last', 'Appleseed')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Name_First', 'John')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Address_1', '1 Infinite Loop')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('City', 'Cupertino')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('STATE', 'CA')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('SSN', '123456789')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Telephone_Home', '(123) 456-7890')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Birthdate', '1/1/1983')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });

                // Select a button form elements.
                this.refs.pdfView
                  .setFormFieldValue('Sex.0', 'selected')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('PHD', 'selected')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="Fill Form"
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Get the First Name Value.
                const firstNameValue =
                  await this.refs.pdfView.getFormFieldValue('Name_Last');
                alert(JSON.stringify(firstNameValue));
              }}
              title="Get Last Name Value"
            />
          </View>
        </View>
      </View>
    );
  }
}
