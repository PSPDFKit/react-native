import React from 'react';
import { Dimensions, processColor, View } from 'react-native';
import NutrientView, { NotificationCenter } from '@nutrient-sdk/react-native';

import {
  exampleDocumentPath,
  formDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class SplitPDF extends BaseExampleAutoHidingHeaderComponent {
  pdfRef1: React.RefObject<NutrientView | null>;
  pdfRef2: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.state = { dimensions: undefined };
    this.pdfRef1 = React.createRef();
    this.pdfRef2 = React.createRef();
  }

  override componentDidMount() {

    this.pdfRef1.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (event: any) => {
      console.log(JSON.stringify(event));
    });

    this.pdfRef2.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (event: any) => {
      console.log(JSON.stringify(event));
    });

    this.pdfRef1.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.TAPPED, (event: any) => {
      console.log(JSON.stringify(event));
    });

    this.pdfRef2.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.TAPPED, (event: any) => {
      console.log(JSON.stringify(event));
    });

    setTimeout(() => {
      this.pdfRef1.current?.getNotificationCenter().unsubscribeAllEvents()
    }, 10000);

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.PAGE_CHANGED, (event: any) => {
    //   console.log(event);
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.SCROLLED, (event: any) => {
    //   console.log(event);
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.DocumentEvent.TAPPED, (event: any) => {
    //   console.log(event);
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.ADDED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.REMOVED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.CHANGED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.SELECTED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.DESELECTED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.FormFieldEvent.VALUES_UPDATED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.SELECTED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.DESELECTED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnnotationsEvent.TAPPED, (event: any) => {
    //   Alert.alert('Nutrient', JSON.stringify(event));
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.AnalyticsEvent.ANALYTICS, (event: any) => {
    //   console.log(event)
    // });

    // this.pdfRef.current?.getNotificationCenter().subscribe(NotificationCenter.BookmarksEvent.CHANGED, (event: any) => {
    //   Alert.alert('Nutrient', 'Bookmarks Changed: ' + JSON.stringify(event));
    // });
  }

  override render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View style={styles.wrapper(layoutDirection)} onLayout={this._onLayout}>
        <NutrientView
          ref={this.pdfRef1}
          document={formDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          fragmentTag='fragmentTag1'
          style={styles.pdfView}
        />
        <NutrientView
          ref={this.pdfRef2}
          document={exampleDocumentPath}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          fragmentTag='fragmentTag2'
          style={styles.pdfColor}
        />
      </View>
    );
  }

  _getOptimalLayoutDirection = () => {
    const width = this.state.dimensions
      ? this.state.dimensions.width
      : Dimensions.get('window').width;
    return width > 450 ? 'row' : 'column';
  };

  _onLayout = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };
}
const styles = {
  wrapper: (layoutDirection: any) => ({
    flex: 1,
    flexDirection: layoutDirection,
    justifyContent: 'center' as 'center',
  }),
  pdfView: { flex: 1, color: pspdfkitColor },
  pdfColor: { flex: 1, color: '#9932CC' },
};
