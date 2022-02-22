import React, {Component} from 'react';
import {Button, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';

export class HiddenToolbar extends Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    return {
      title: 'HiddenToolbar',
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <Button
            onPress={() => params.handleAnnotationButtonPress()}
            title="Annotations"
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleAnnotationButtonPress: () => {
        if (
          this.state.annotationCreationActive ||
          this.state.annotationEditingActive
        ) {
          this.refs.pdfView.exitCurrentlyActiveMode();
        } else {
          this.refs.pdfView.enterAnnotationCreationMode();
        }
      },
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            // If you want to hide the toolbar it's essential to also hide the document label overlay.
            documentLabelEnabled: false,
            // We want to keep the thumbnail bar always visible, but the automatic mode is also supported with hideDefaultToolbar.
            userInterfaceViewMode: 'alwaysVisible',
            useParentNavigationBar: true,
          }}
          // This will just hide the toolbar, keeping the thumbnail bar visible.
          hideDefaultToolbar={true}
          disableAutomaticSaving={true}
          fragmentTag="PDF1"
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
            });
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}
