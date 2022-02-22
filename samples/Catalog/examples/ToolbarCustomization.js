import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Button, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import React from 'react';

export class ToolbarCustomization extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
          leftBarButtonItems={['settingsButtonItem']}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            padding: 10,
          }}>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Update the right bar buttons.
                await this.refs.pdfView.setRightBarButtonItems(
                  [
                    'thumbnailsButtonItem',
                    'searchButtonItem',
                    'annotationButtonItem',
                    'readerViewButtonItem',
                  ],
                  'document',
                  false,
                );
              }}
              title="Set Bar Button Items"
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Get the right bar buttons.
                const rightBarButtonItems =
                  await this.refs.pdfView.getRightBarButtonItemsForViewMode(
                    'document',
                  );
                alert(JSON.stringify(rightBarButtonItems));
              }}
              title="Get Bar Button Items"
            />
          </View>
        </View>
      </View>
    );
  }
}
