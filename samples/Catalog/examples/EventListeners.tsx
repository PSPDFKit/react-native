import React from 'react';
import { Alert, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class EventListeners extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<PSPDFKitView>();
    hideToolbar(navigation);
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={exampleDocumentPath}
          ref={this.pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfColor}
          // Event Listeners
          onAnnotationsChanged={(event: {
            error: any;
            change: string;
            annotations: any;
          }) => {
            if (event.error) {
              Alert.alert(event.error);
            } else {
              Alert.alert(
                'PSPDFKit',
                'Annotations ' +
                  event.change +
                  ': ' +
                  JSON.stringify(event.annotations),
              );
            }
          }}
          onAnnotationTapped={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              Alert.alert(
                'PSPDFKit',
                'Tapped on Annotation: ' + JSON.stringify(event),
              );
            }
          }}
          onDocumentSaved={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              Alert.alert('PSPDFKit', 'Document Saved!');
            }
          }}
          onDocumentLoaded={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              Alert.alert('PSPDFKit', 'Document Loaded!');
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
