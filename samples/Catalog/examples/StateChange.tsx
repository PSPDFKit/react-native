import React from 'react';
import { Alert, processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

export class StateChange extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

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
        <NutrientView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            showPageLabels: true,
          }}
          menuItemGrouping={[
            {
              key: 'drawing',
              items: [
                'pen',
              ],
            },
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
        <View style={styles.column}>
          <View style={styles.annotationContainer}>
            <TouchableOpacity
              accessibilityLabel="Change state"
              testID="Change state"
              onPress={() => {
                if (
                  this.state.annotationCreationActive ||
                  this.state.annotationEditingActive
                ) {
                  this.pdfRef.current?.exitCurrentlyActiveMode();
                } else {
                  this.pdfRef.current?.enterAnnotationCreationMode(Annotation.Type.PEN);
                }
              }}
            >
              <Text style={styles.button}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontalContainer}>
            <Text accessibilityLabel="Page Number" style={styles.pageText}>
              {'Page ' +
                (this.state.currentPageIndex + 1) +
                ' of ' +
                this.state.pageCount}
            </Text>
            <TouchableOpacity
              accessibilityLabel="Previous Page"
              onPress={() => {
                this.setState((previousState: { currentPageIndex: number }) => {
                  return {
                    currentPageIndex: previousState.currentPageIndex - 1,
                  };
                });
              }}
              disabled={this.state.currentPageIndex === 0}
            >
              <Text style={[styles.button, this.state.currentPageIndex === 0 && styles.disabledButton]}>Previous Page</Text>
            </TouchableOpacity>
            <TouchableOpacity
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
            >
              <Text style={[styles.button, this.state.currentPageIndex === this.state.pageCount - 1 && styles.disabledButton]}>Next Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  annotationContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    padding: 10,
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 44,
    paddingVertical: 10,
  },
  disabledButton: {
    color: '#999999',
  },
  pageText: {
    fontSize: 16,
    color: pspdfkitColor,
    flex: 1,
  },
};
