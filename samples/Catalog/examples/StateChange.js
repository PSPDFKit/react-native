import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Button, processColor, Text, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import React from 'react';

export class StateChange extends BaseExampleAutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      pageCount: 0,
      annotationCreationActive: false,
      annotationEditingActive: false,
    };
  }

  render() {
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
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={[
            'freetext',
            { key: 'markup', items: ['highlight', 'underline'] },
            'ink',
            'image',
          ]}
          pageIndex={this.state.currentPageIndex}
          style={styles.pdfColor}
          onStateChanged={event => {
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
              onPress={() => {
                if (
                  this.state.annotationCreationActive ||
                  this.state.annotationEditingActive
                ) {
                  this.refs.pdfView.exitCurrentlyActiveMode();
                } else {
                  this.refs.pdfView.enterAnnotationCreationMode();
                }
              }}
              title={buttonTitle}
            />
          </View>
          <View style={styles.annotationContainer}>
            <Text style={styles.flex}>
              {'Page ' +
                (this.state.currentPageIndex + 1) +
                ' of ' +
                this.state.pageCount}
            </Text>
            <Button
              onPress={() => {
                this.setState(previousState => {
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
                onPress={() => {
                  this.setState(previousState => {
                    return {
                      currentPageIndex: previousState.currentPageIndex + 1,
                    };
                  });
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
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  annotationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
