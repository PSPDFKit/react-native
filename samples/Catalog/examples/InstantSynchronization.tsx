import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Switch, Text, TextInput, View } from 'react-native';

import { NutrientInstantView, Toolbar } from '@nutrient-sdk/react-native';
import PrimaryButton from '../components/primaryButton';
import UrlInput from '../components/urlInput';
import { pspdfkitColor } from '../configuration/Constants';
import { loadDocument } from '../helpers/api/ApiClient';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import defaultStyles from '../styles/styles';

export default function InstantSynchronization({ navigation }: any) {
  useBaseExampleAutoHidingHeader(navigation);
  const [documentURL, setDocumentURL] = useState('');
  const [isUrlInputPresented, setIsUrlInputPresented] = useState(false);
  const [instantDocument, setInstantDocument] = useState<any>(null);

  const syncHeaderVisibility = useCallback(() => {
    if (!navigation) return;
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  useEffect(() => {
    syncHeaderVisibility();
  }, [syncHeaderVisibility, instantDocument]);

  const openInstantLink = async () => {
    await Linking.openURL('https://www.nutrient.io/demo/instant-collaboration');
  };

  const toggleOption = (type: string) => {
    switch (type) {
      case 'isUrlInputPresented':
        setIsUrlInputPresented(value => !value);
        return;
      default:
        return;
    }
  };

  const onCloseModal = () => {
    setIsUrlInputPresented(false);
  };

  const onConnect = async (url: any) => {
    setDocumentURL(url);
    try {
      onCloseModal();
      const response = await loadDocument(url);
      setInstantDocument({
        serverUrl: response.serverUrl,
        jwt: response.jwt,
      });
    } catch (error: any) {
      Alert.alert('Nutrient', error.message);
    }
  };

  if (instantDocument) {
    return (
      <NutrientInstantView
        style={{ flex: 1 }}
        documentInfo={instantDocument}
        configuration={{
          userInterfaceViewMode: 'alwaysVisible',
          iOSUseParentNavigationBar: true,
          androidRemoveStatusBarOffset: true,
        }}
        toolbar={{
          rightBarButtonItems: {
            viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
            animated: true,
            buttons: [
              Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM,
              Toolbar.DefaultToolbarButton.ANNOTATION_BUTTON_ITEM,
            ],
          },
          toolbarMenuItems: {
            buttons: [
              Toolbar.DefaultToolbarButton.SEARCH_BUTTON_ITEM,
              Toolbar.DefaultToolbarButton.ANNOTATION_BUTTON_ITEM,
            ],
          },
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <UrlInput
        shouldRender={isUrlInputPresented}
        onCancel={onCloseModal}
        defaultURL={documentURL}
        placeholder={'Enter Document URL'}
        onConnect={onConnect}
      />
      <View>
        <Text style={defaultStyles.text}>
          Copy the collaboration URL from{' '}
          <Text style={defaultStyles.linkText} onPress={openInstantLink}>
            https://www.nutrient.io/demo/instant-collaboration
          </Text>{' '}
          to connect to the document shown in your browser:
        </Text>
        <PrimaryButton
          title={'Enter Document URL'}
          style={styles.bottomMargin}
          onPress={() => toggleOption('isUrlInputPresented')}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  bottomMargin: {
    container: {
      marginBottom: 20,
    },
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
  delayContainer: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
  },
};
