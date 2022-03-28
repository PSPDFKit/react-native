import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Button, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {pspdfkitColor, writableDocumentPath} from '../configuration/Constants';
import React from 'react';

export class ManualSave extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          pageIndex={3}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={{flex: 1}}>
            <Button
              onPress={() => {
                // Manual Save
                this.refs.pdfView
                  .saveCurrentDocument()
                  .then(saved => {
                    if (saved) {
                      alert('Successfully saved current document.');
                    } else {
                      alert('Document was not saved as it was not modified.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
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
