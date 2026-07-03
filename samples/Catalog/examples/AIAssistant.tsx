import React, { useEffect, useRef } from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { Toolbar, AIAssistantConfiguration } from '@nutrient-sdk/react-native';

import { exampleAIPath, pspdfkitColor } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';
import { Nutrient } from '../helpers/Nutrient';
import { createAIAssistantConfig } from '../helpers/AIAssistant/AIAssistantHelper';

export const AIAssistant = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  const documentId = Nutrient.getDocumentProperties(exampleAIPath).documentId;
  const aiAssistantConfig = createAIAssistantConfig(
    documentId.toLowerCase(),
    'my-session-id',
  );

  return (
    <View style={styles.flex}>
      <NutrientView
          ref={pdfRef}
          document={exampleAIPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
            aiAssistantConfiguration: aiAssistantConfig
          }}
          toolbar={{
            // iOS only.
            rightBarButtonItems: {
              viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
              animated: true,
              buttons: [
                Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.ANNOTATION_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.AI_ASSISTANT_BUTTON_ITEM,
              ],
            },
            // Android only.
            toolbarMenuItems: {
              buttons: [
                Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.ANNOTATION_BUTTON_ITEM,
                Toolbar.DefaultToolbarButton.AI_ASSISTANT_BUTTON_ITEM,
              ],
            },
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
      />
    </View>
  );
};
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    height: 50,
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    flex: 1,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
  },
};