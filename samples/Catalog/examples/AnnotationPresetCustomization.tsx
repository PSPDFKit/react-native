import React from 'react';
import { Alert, processColor, View } from 'react-native';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class AnnotationPresetCustomization extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;
  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<NutrientView>();
    hideToolbar(navigation);
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
          }}
          annotationContextualMenu={
            {
              buttons: [
                {
                  id: 'custom_annotation_item',
                  image: 'example_annotation_icon',
                  title: 'Custom',
                  selectable: false,
                },
              ],
              retainSuggestedMenuItems: true,
            }
          }
          onCustomAnnotationContextualMenuItemTapped={
            (result: any) => {
              Alert.alert('Nutrient', `Custom annotation contextual menu item tapped: ${JSON.stringify(result)}`);
            }
          }
          annotationPresets={{
            arrow: {
              defaultColor: '#000000',
              defaultBorderStyle: 'dashed_1_3'
            },
            inkPen: {
              defaultThickness: 50,
              defaultColor: '#99cc00',
              availableColors: ['#99cc00', '#ffcc00', '#ff9900', '#ff0000', '#000000'],
              minimumAlpha: 0.5,
              forceDefaults: true
            },
            freeText: {
              defaultTextSize: 40,
              defaultColor: '#FF0000',
            },
            line: {
              defaultColor: '#99cc00',
              defaultLineEnd: 'openArrow,openArrow',
              defaultBorderStyle: Annotation.BorderStyle.DASHED_3_3,
            },
            measurementAreaRect: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            square: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3'
            },
            measurementAreaEllipse: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementAreaPolygon: {
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementDistance: {
              defaultLineEnd: 'circle,circle',
              defaultColor: '#99cc00',
              defaultThickness: 5,
              defaultBorderStyle: 'dashed_1_3',
            },
            measurementPerimeter: {
              defaultLineEnd: 'circle,circle',
              defaultColor: '#99cc00',
              defaultBorderStyle: 'dashed_1_3',
            }
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
