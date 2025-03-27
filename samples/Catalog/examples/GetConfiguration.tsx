import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView, { PDFConfiguration } from 'react-native-pspdfkit';

import {
  pspdfkitColor,
  exampleDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { PSPDFKit } from '../helpers/PSPDFKit';

export class GetConfiguration extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
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
        <View style={styles.wrapper}>
          <View style={styles.flex}>
            <Button
              accessibilityLabel={'Get Configuration'}
              testID={'Get Configuration'}
              onPress={ async () => {
                const configuration = await this.pdfRef?.current?.getConfiguration().catch(error => {
                  Alert.alert('PSPDFKit', JSON.stringify(error));
                });
                Alert.alert(
                  'PSPDFKit',
                  'Current Configuration: ' + JSON.stringify(configuration),
                );
              }}
              title="Get Configuration"
            />
            <Button
              accessibilityLabel={'Present with Configuration'}
              testID={'Present with Configuration'}
              onPress={ async () => {
                const configuration = await this.pdfRef?.current?.getConfiguration().catch(error => {
                  Alert.alert('PSPDFKit', JSON.stringify(error));
                });
                // Retrieve and re-apply configuration
                PSPDFKit.present(exampleDocumentPath, configuration!);
              }}
              title="Present with Configuration"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
};
