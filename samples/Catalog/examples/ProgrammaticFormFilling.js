import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { formDocumentPath, pspdfkitColor } from '../configuration/Constants';
import React from 'react';
export class ProgrammaticFormFilling extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();

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
          document={formDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfColor}
        />
        <View style={styles.wrapperView}>
          <View style={styles.marginLeft}>
            <Button
              onPress={() => {
                // Fill Text Form Fields.
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
                this.pdfRef.current
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
              accessibilityLabel="Fill Form"
            />
          </View>
          <View style={styles.marginLeft}>
            <Button
              onPress={async () => {
                // Get the First Name Value.
                const firstNameValue =
                  await this.pdfRef.current.getFormFieldValue('Name_Last');
                alert(JSON.stringify(firstNameValue));
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
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    padding: 10,
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
