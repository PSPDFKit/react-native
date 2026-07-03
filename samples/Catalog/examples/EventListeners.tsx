import React, { useEffect, useRef, useState } from 'react';
import { Alert, processColor, View } from 'react-native';
import NutrientView, { NotificationCenter, Toolbar } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, formDocumentName, formDocumentPath, pspdfkitColor, writableFormDocumentPath } from '../configuration/Constants';
import { useBaseExampleAutoHidingHeader } from '../helpers/ExampleScreenLayoutHelpers';
import { hideToolbar } from '../helpers/NavigationHelper';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

export const EventListeners = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const [documentPath, setDocumentPath] = useState(formDocumentPath);
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    hideToolbar(navigation);
  }, [navigation]);

  useEffect(() => {
    extractFromAssetsIfMissing(formDocumentName, () => {
      setDocumentPath(writableFormDocumentPath);
    });

    const center = pdfRef.current?.getNotificationCenter();
    center?.subscribe(
      NotificationCenter.TextEvent.SELECTED,
      (payload: NotificationCenter.TextSelectedPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.DocumentEvent.LOADED,
      (payload: NotificationCenter.DocumentLoadedPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.DocumentEvent.PAGE_CHANGED,
      (payload: NotificationCenter.DocumentPageChangedPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.DocumentEvent.SCROLLED,
      (payload: NotificationCenter.DocumentScrolledPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.DocumentEvent.TAPPED,
      (payload: NotificationCenter.DocumentTappedPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.ADDED,
      (payload: NotificationCenter.AnnotationsAddedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.REMOVED,
      (payload: NotificationCenter.AnnotationsRemovedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.CHANGED,
      (payload: NotificationCenter.AnnotationChangedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.FormFieldEvent.SELECTED,
      (payload: NotificationCenter.FormFieldSelectedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.FormFieldEvent.DESELECTED,
      (payload: NotificationCenter.FormFieldDeselectedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.FormFieldEvent.VALUES_UPDATED,
      (payload: NotificationCenter.FormFieldValuesUpdatedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.SELECTED,
      (payload: NotificationCenter.AnnotationsSelectedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.DESELECTED,
      (payload: NotificationCenter.AnnotationsDeselectedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnnotationsEvent.TAPPED,
      (payload: NotificationCenter.AnnotationTappedPayload) =>
        Alert.alert('Nutrient', JSON.stringify(payload)),
    );
    center?.subscribe(
      NotificationCenter.AnalyticsEvent.ANALYTICS,
      (payload: NotificationCenter.AnalyticsPayload) => console.log(payload),
    );
    center?.subscribe(
      NotificationCenter.BookmarksEvent.CHANGED,
      (payload: NotificationCenter.BookmarksChangedPayload) =>
        Alert.alert('Nutrient', 'Bookmarks Changed: ' + JSON.stringify(payload)),
    );

    return () => {
      center?.unsubscribeAllEvents();
    };
  }, []);

  return (
    <View style={styles.flex}>
      <NutrientView
          document={documentPath}
          ref={pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          toolbar={{
            // iOS only.
            leftBarButtonItems: {
              viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
              animated: true,
              buttons: [
                Toolbar.DefaultToolbarButton.BOOKMARK_BUTTON_ITEM,
              ],
            },
          }}
          style={styles.pdfColor}
          // Event Listeners
          onDocumentSaved={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('Nutrient', event.error);
            } else {
              Alert.alert('Nutrient', 'Document Saved!');
            }
          }}
          onDocumentLoaded={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('Nutrient', event.error);
            } else {
              Alert.alert('Nutrient', 'Document Loaded!');
            }
          }}
      />
    </View>
  );
};
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
