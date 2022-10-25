import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  pspdfkitColor,
  writableDocumentPath,
} from '../configuration/Constants';
import React from 'react';

export class ManualSave extends BaseExampleAutoHidingHeaderComponent {
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
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={[
            'pen',
            'freetext',
            { key: 'markup', items: ['highlight', 'underline'] },
            'image',
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
                this.pdfRef?.current
                  ?.saveCurrentDocument()
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

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
};
