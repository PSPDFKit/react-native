import React, { Component } from 'react';
import { processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';

interface IProps {}

interface IState {
  annotationCreationActive?: boolean;
  annotationEditingActive?: boolean;
}

export class HiddenToolbar extends Component<IProps, IState> {
  pdfRef: React.RefObject<NutrientView | null>;

  static headerRight(params: { handleAnnotationButtonPress: () => void }) {
    return (
      <View style={styles.marginLeft}>
        <TouchableOpacity
          onPress={() => params.handleAnnotationButtonPress()}
        >
          <Text style={styles.button}>Annotations</Text>
        </TouchableOpacity>
      </View>
    );
  }

  static navigationOptions = ({ navigation }: { navigation: any }) => {
    const params = navigation.state.params || {};
    navigation.setOptions({
      title: 'HiddenToolbar',
      headerRight: () => this.headerRight(params),
    });
  };

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();

    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false,
    };
  }

  override componentDidMount() {
    // @ts-ignore
    const { navigation } = this.props;
    navigation.setOptions({
      handleAnnotationButtonPress: () => {
        if (
          this.state.annotationCreationActive ||
          this.state.annotationEditingActive
        ) {
          this.pdfRef.current?.exitCurrentlyActiveMode();
        } else {
          this.pdfRef.current?.enterAnnotationCreationMode();
        }
      },
    });
  }

  override render() {
    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            // If you want to hide the toolbar it's essential to also hide the document label overlay.
            documentLabelEnabled: false,
            // We want to keep the thumbnail bar always visible, but the automatic mode is also supported with hideDefaultToolbar.
            userInterfaceViewMode: 'alwaysVisible',
            iOSUseParentNavigationBar: true,
            // This will hide the main toolbar. A change to the application's styles.xml is required to fully hide the Android tabBar.
            androidShowDefaultToolbar: false,
            androidRemoveStatusBarOffset: true,
          }}
          disableAutomaticSaving={true}
          fragmentTag="PDF1"
          onStateChanged={(event: {
            annotationCreationActive: any;
            annotationEditingActive: any;
          }) => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
            });
          }}
          style={styles.pdfColor}
        />
      </View>
    );
  }
}

const styles = {
  marginLeft: { marginLeft: 10 },
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
};
