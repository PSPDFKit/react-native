import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import React from 'react';
import {exampleDocumentPath, pspdfkitColor} from '../configuration/Constants';

export class PSPDFKitViewComponent extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            allowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={event => {
            this.props.navigation.goBack();
          }}
          menuItemGrouping={[
            'freetext',
            {key: 'markup', items: ['highlight', 'underline']},
            'ink',
            'image',
          ]}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}
