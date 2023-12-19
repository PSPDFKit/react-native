import React from 'react';
import { Button, processColor, Text, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class StateChange extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
    this.state = {
      currentPageIndex: 0,
      pageCount: 0,
      annotationCreationActive: false,
      annotationEditingActive: false,
    };
  }

  override render() {
    let buttonTitle;
    if (this.state.annotationCreationActive) {
      buttonTitle = 'Exit Annotation Creation Mode';
    } else if (this.state.annotationEditingActive) {
      buttonTitle = 'Exit Annotation Editing Mode';
    } else {
      buttonTitle = 'Enter Annotation Creation Mode';
    }
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showPageLabels: true,
          }}
          menuItemGrouping={[
            'freetext',
            { key: 'markup', items: ['highlight', 'underline'] },
            'ink',
            'image',
          ]}
          pageIndex={this.state.currentPageIndex}
          style={styles.pdfColor}
          onStateChanged={(event: {
            currentPageIndex: any;
            annotationCreationActive: any;
            annotationEditingActive: any;
            pageCount: any;
          }) => {
            if (event.currentPageIndex !== this.state.currentPageIndex) {
              return;
            }

            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount,
            });
          }}
        />
        <View style={styles.annotatoinWrapper}>
          <View style={styles.annotationContainer}>
            <Button
              accessibilityLabel="Change state"
              testID="Change state"
              // nativeID="change_state"
              onPress={() => {
                if (
                  this.state.annotationCreationActive ||
                  this.state.annotationEditingActive
                ) {
                  this.pdfRef.current?.exitCurrentlyActiveMode();
                } else {
                  this.pdfRef.current?.enterAnnotationCreationMode();
                }
              }}
              title={buttonTitle}
            />
          </View>
          <View style={styles.annotationContainer}>
            <Text accessibilityLabel="Page Number" style={styles.flex}>
              {'Page ' +
                (this.state.currentPageIndex + 1) +
                ' of ' +
                this.state.pageCount}
            </Text>
            <Button
              accessibilityLabel="Previous Page"
              onPress={() => {
                this.setState((previousState: { currentPageIndex: number }) => {
                  return {
                    currentPageIndex: previousState.currentPageIndex - 1,
                  };
                });
              }}
              disabled={this.state.currentPageIndex === 0}
              title="Previous Page"
            />
            <View style={styles.leftMargin}>
              <Button
                accessibilityLabel="Next Page"
                onPress={() => {
                  this.setState(
                    (previousState: { currentPageIndex: number }) => {
                      return {
                        currentPageIndex: previousState.currentPageIndex + 1,
                      };
                    },
                  );
                }}
                disabled={
                  this.state.currentPageIndex === this.state.pageCount - 1
                }
                title="Next Page"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  leftMargin: { marginLeft: 10 },
  annotatoinWrapper: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  annotationContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
