import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {View} from 'react-native';
import {CustomPdfView, formDocumentPath} from '../configuration/Constants';
import React from 'react';

export class DefaultAnnotationSettings extends BaseExampleAutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <CustomPdfView
          ref="pdfView"
          document={formDocumentPath}
          style={{flex: 1}}
          // This way only the ink tool and the button to open the inspector is shown.
          // If you don't need the inspector you can remove the "picker" option completely
          // and only configure the tool using the AnnotationConfiguration.
          // See CustomPdfViewManager#setDocument() for how to apply the custom configuration.
          menuItemGrouping={['pen', 'picker']}
          rightBarButtonItems={['annotationButtonItem']}
        />
      </View>
    );
  }
}
