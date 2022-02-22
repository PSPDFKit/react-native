import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Button, processColor, Text, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
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
    let buttonTitle = '';
    if (this.state.annotationCreationActive) {
      buttonTitle = 'Exit Annotation Creation Mode';
    } else if (this.state.annotationEditingActive) {
      buttonTitle = 'Exit Annotation Editing Mode';
    } else {
      buttonTitle = 'Enter Annotation Creation Mode';
    }
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={[
            'freetext',
            {key: 'markup', items: ['highlight', 'underline']},
            'ink',
            'image',
          ]}
          pageIndex={this.state.currentPageIndex}
          style={{flex: 1, color: pspdfkitColor}}
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <Text style={{flex: 1}}>
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
              disabled={this.state.currentPageIndex == 0}
              title="Previous Page"
            />
            <View style={{marginLeft: 10}}>
              <Button
                onPress={() => {
                  this.setState(previousState => {
                    return {
                      currentPageIndex: previousState.currentPageIndex + 1,
                    };
                  });
                }}
                disabled={
                  this.state.currentPageIndex == this.state.pageCount - 1
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
