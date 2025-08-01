import React from 'react';
import { Alert, processColor, View } from 'react-native';
import NutrientView, { NotificationCenter, Toolbar } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, formDocumentName, formDocumentPath, pspdfkitColor, writableFormDocumentPath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

export class EventListeners extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<NutrientView>();
    this.state = {
      documentPath: formDocumentPath,
    };
    hideToolbar(navigation);
  }

  override componentDidMount() {

    extractFromAssetsIfMissing(formDocumentName, () => {
      this.setState({ documentPath: writableFormDocumentPath });
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.TextEvent.SELECTED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.PAGE_CHANGED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.SCROLLED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.TAPPED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.ADDED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.REMOVED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.CHANGED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.SELECTED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.DESELECTED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.VALUES_UPDATED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.SELECTED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.DESELECTED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.TAPPED, (event: any) => {
      Alert.alert('Nutrient', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnalyticsEvent.ANALYTICS, (event: any) => {
      console.log(event)
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.BookmarksEvent.CHANGED, (event: any) => {
      Alert.alert('Nutrient', 'Bookmarks Changed: ' + JSON.stringify(event));
    });
  }

  override componentWillUnmount () {
    this.pdfRef.current?.getNotificationCenter().unsubscribeAllEvents();
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
          document={this.state.documentPath}
          ref={this.pdfRef}
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
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
