import React from 'react';
import { Alert, processColor, View } from 'react-native';
import PSPDFKitView, { NotificationCenter } from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class EventListeners extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef<PSPDFKitView>();
    hideToolbar(navigation);
  }

  override componentDidMount() {
    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.TextEvent.SELECTED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.PAGE_CHANGED, (event: any) => {
      console.log(event);
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.ADDED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.REMOVED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.CHANGED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.SELECTED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.DESELECTED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.VALUES_UPDATED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.SELECTED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.DESELECTED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.TAPPED, (event: any) => {
      Alert.alert('PSPDFKit', JSON.stringify(event));
    });

    this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnalyticsEvent.ANALYTICS, (event: any) => {
      console.log(event)
    });
  }

  override componentWillUnmount () {
    this.pdfRef.current?.getNotificationCenter().unsubscribeAllEvents();
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={exampleDocumentPath}
          ref={this.pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          style={styles.pdfColor}
          // Event Listeners
          onDocumentSaved={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              Alert.alert('PSPDFKit', 'Document Saved!');
            }
          }}
          onDocumentLoaded={(event: { error: any }) => {
            if (event.error) {
              Alert.alert('PSPDFKit', event.error);
            } else {
              Alert.alert('PSPDFKit', 'Document Loaded!');
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
