import React from 'react';
import {
  Linking,
  NativeEventEmitter,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import PrimaryButton from '../components/primaryButton';
import UrlInput from '../components/urlInput';
import { pspdfkitColor } from '../configuration/Constants';
import { loadDocument } from '../helpers/api/ApiClient';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { PSPDFKit } from '../helpers/PSPDFKit';
import defaultStyles from '../styles/styles';

export default class InstantSynchronization extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;
  PSPdfKitEmitter = null;
  subscription = null;
  constructor(props) {
    super(props);
    this.pdfRef = React.createRef();
    this.state = {
      shouldListenForChanges: true,
      documentURL: '',
      areCommentsEnabled: false,
      isUrlInputPresented: false,
      syncAnnotations: true,
    };
  }

  componentDidMount() {
    this.PSPdfKitEmitter = new NativeEventEmitter(PSPDFKit);
    this.subscription = this.PSPdfKitEmitter.addListener(
      'didFailAuthenticationFor',
      data => {
        console.log('didFailAuthenticationFor', data);
      },
    );
  }

  updateSyncDelay = async delayValue => {
    this.setState({ delay: delayValue });
  };

  openInstantLink = async () => {
    await Linking.openURL('https://pspdfkit.com/instant/try', 'self');
  };

  toggleOption = type => {
    switch (type) {
      case 'shouldListenForChanges':
        return this.setState({
          shouldListenForChanges: !this.state.shouldListenForChanges,
        });

      case 'areCommentsEnabled':
        return this.setState({
          areCommentsEnabled: !this.state.areCommentsEnabled,
        });

      case 'isUrlInputPresented':
        return this.setState({
          isUrlInputPresented: !this.state.isUrlInputPresented,
        });
      default:
        return;
    }
  };

  onCloseModal = () => {
    this.setState({
      isUrlInputPresented: false,
    });
  };

  onConnect = async url => {
    // Load Instant Document from URL
    this.setState({ documentURL: url });
    try {
      this.onCloseModal();
      await loadDocument(url, async documentData => {
        // Note: In order to open document from PSPDFKit demo examples, you will need correct license key (demo or full) .
        PSPDFKit.setLicenseKey('Enter your license key here');
        PSPDFKit.presentInstant(documentData.serverUrl, documentData.jwt, {
          enableInstantComments: this.state.areCommentsEnabled,
          listenToServerChanges: this.state.shouldListenForChanges,
          delay: this.state.delay ?? '1',
          syncAnnotations: this.state.syncAnnotations ?? true,
        }).then(async () => {
          // You can change properties after the document is presented programmatically like in this examples:
          await PSPDFKit.setDelayForSyncingLocalChanges(
            parseFloat(this.state.delay),
          );
          await PSPDFKit.setListenToServerChanges(
            this.state.enableListenToServerChanges,
          );
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <UrlInput
          shouldRender={this.state.isUrlInputPresented}
          onCancel={this.onCloseModal}
          defaultURL={''}
          placeholder={'Enter Document URL'}
          onConnect={url => this.onConnect(url)}
        />
        <View>
          <Text style={defaultStyles.text}>
            Copy the collaboration URL from{' '}
            <Text style={defaultStyles.linkText} onPress={this.openInstantLink}>
              pspdfkit.com/instant/try
            </Text>{' '}
            to connect to the document shown in your browser:
          </Text>
          <PrimaryButton
            title={'Enter Document URL'}
            style={styles.bottomMargin}
            onPress={() => this.toggleOption('isUrlInputPresented')}
          />
        </View>
        <View style={styles.delayContainer}>
          <Text style={defaultStyles.text}>
            Delay for syncing local changes:{' '}
          </Text>
          <TextInput
            onChangeText={text => this.updateSyncDelay(text)}
            style={defaultStyles.textInput}
            keyboardType={'numeric'}
          />
        </View>
        <View style={defaultStyles.horizontalContainer}>
          <Text style={[defaultStyles.text, defaultStyles.flex]}>
            Listen to server changes:{' '}
          </Text>
          <Switch
            value={this.state.shouldListenForChanges}
            trackColor={{ false: '#767577', true: pspdfkitColor }}
            onValueChange={() => {
              this.toggleOption('shouldListenForChanges');
            }}
          />
        </View>
        <View style={defaultStyles.horizontalContainer}>
          <Text style={[defaultStyles.text, defaultStyles.flex]}>
            Enable comments:{' '}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: pspdfkitColor }}
            value={this.state.areCommentsEnabled}
            onValueChange={() => this.toggleOption('areCommentsEnabled')}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  bottomMargin: {
    container: {
      marginBottom: 20,
    },
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
  delayContainer: { flexDirection: 'row', justifyContent: 'space-between' },
};
