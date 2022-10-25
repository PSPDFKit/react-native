import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import { withNavigation } from 'react-navigation';
import {
  Button,
  findNodeHandle,
  NativeModules,
  Platform,
  SafeAreaView,
  UIManager,
  View,
} from 'react-native';
import React from 'react';

class ManualSigning extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = React.createRef();

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      documentPath: formDocumentPath,
      shouldReturn: false,
    };

    navigation.addListener('beforeRemove', e => {
      if (Platform.OS !== 'android') {
        return;
      }
      const { shouldReturn } = this.state;
      if (!shouldReturn) {
        this.setState({ shouldReturn: true });
        e.preventDefault();
      }
      setTimeout(() => {
        this.goBack();
      }, 50);
    });
  }

  goBack(navigation) {
    this.props.navigation.goBack();
  }

  render() {
    const { shouldReturn } = this.state;

    return (
      <View style={styles.flex}>
        {!shouldReturn && (
          <CustomPdfView
            ref={this.pdfRef}
            document={this.state.documentPath}
            style={styles.flex}
            onDocumentDigitallySigned={event => {
              this.setState({
                documentPath: event.nativeEvent.signedDocumentPath,
              });
            }}
          />
        )}
        <SafeAreaView style={styles.row}>
          <View>
            <Button
              onPress={() => {
                // This will open the native signature dialog.
                if (Platform.OS === 'android') {
                  UIManager.dispatchViewManagerCommand(
                    findNodeHandle(this.refs.pdfView),
                    'startSigning',
                    [],
                  );
                } else {
                  NativeModules.CustomPdfViewManager.startSigning(
                    findNodeHandle(this.refs.pdfView),
                  );
                }
              }}
              title="Start Signing"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(ManualSigning);

const styles = {
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};
