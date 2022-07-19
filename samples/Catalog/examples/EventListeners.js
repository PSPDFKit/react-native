import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import React from 'react';

export class EventListeners extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfColor}
          // Event Listeners
          onAnnotationsChanged={event => {
            if (event.error) {
              alert(event.error);
            } else {
              alert(
                'Annotations ' +
                  event.change +
                  ': ' +
                  JSON.stringify(event.annotations),
              );
            }
          }}
          onAnnotationTapped={event => {
            if (event.error) {
              alert(event.error);
            } else {
              alert('Tapped on Annotation: ' + JSON.stringify(event));
            }
          }}
          onDocumentSaved={event => {
            if (event.error) {
              alert(event.error);
            } else {
              alert('Document Saved!');
            }
          }}
        />
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
