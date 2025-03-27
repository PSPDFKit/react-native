import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class ManualSave extends BaseExampleAutoHidingHeaderComponent {
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
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={[
            'note',
            { key: 'markup', items: ['freetext', 'freetext_callout'] },
            { key: 'markup', items: ['pen', 'magic_ink', 'highlighter'] },
            { key: 'drawing', items: ['arrow', 'line', 'square', 'circle', 'polygon', 'polyline', 'cloudy_polygon'] },
            { key: 'measurement', items: ['distance', 'perimeter', 'area_polygon', 'area_square', 'area_circle'] },
            { key: 'multimedia', items: ['image', 'stamp', 'signature', 'link', 'camera'] },
            'eraser'
          ]}
          pageIndex={3}
          style={styles.pdfColor}
        />
        <View style={styles.wrapper}>
          <View style={styles.flex}>
            <Button
              accessibilityLabel={'Save Button'}
              testID={'Save Button'}
              onPress={() => {
                // Manual Save
                this.pdfRef?.current?.getDocument().save()
                  .then(saved => {
                    if (saved) {
                      Alert.alert(
                        'PSPDFKit',
                        'Successfully saved current document.',
                      );
                    } else {
                      Alert.alert(
                        'PSPDFKit',
                        'Document was not saved as it was not modified.',
                      );
                    }
                  })
                  .catch(error => {
                    Alert.alert('PSPDFKit', JSON.stringify(error));
                  });
              }}
              title="Save"
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
