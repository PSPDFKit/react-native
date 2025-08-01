import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { PDFConfiguration } from '@nutrient-sdk/react-native';

import {
  pspdfkitColor,
  exampleDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Nutrient } from '../helpers/Nutrient';

export class GetConfiguration extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightblue'),
            iOSTypesShowingColorPresets: [
              'Caret'
            ],
            editableAnnotationTypes: [
              PDFConfiguration.EditableAnnotationTypes['3D'],
              PDFConfiguration.EditableAnnotationTypes.FREE_TEXT
            ],
            documentLabelEnabled: true,
          }}
          style={styles.pdfColor}
        />
        <View style={styles.column}>
          <View style={styles.horizontalContainer}>
            <TouchableOpacity
              accessibilityLabel={'Get Configuration'}
              testID={'Get Configuration'}
              onPress={ async () => {
                const configuration = await this.pdfRef?.current?.getConfiguration().catch(error => {
                  Alert.alert('Nutrient', JSON.stringify(error));
                });
                Alert.alert(
                  'Nutrient',
                  'Current Configuration: ' + JSON.stringify(configuration),
                );
              }}
            >
              <Text style={styles.button}>Get Configuration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel={'Present with Configuration'}
              testID={'Present with Configuration'}
              onPress={ async () => {
                const configuration = await this.pdfRef?.current?.getConfiguration().catch(error => {
                  Alert.alert('Nutrient', JSON.stringify(error));
                });
                // Retrieve and re-apply configuration
                Nutrient.present(exampleDocumentPath, configuration!);
              }}
            >
              <Text style={styles.button}>Present with Configuration</Text>
            </TouchableOpacity>
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
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 44,
    paddingVertical: 10,
  },
};
