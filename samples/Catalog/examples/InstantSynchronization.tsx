import React from 'react';
import { Alert, Linking, Switch, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/primaryButton';
import UrlInput from '../components/urlInput';
import { pspdfkitColor } from '../configuration/Constants';
import { loadDocument } from '../helpers/api/ApiClient';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Nutrient } from '../helpers/Nutrient';
import defaultStyles from '../styles/styles';

export default class InstantSynchronization extends BaseExampleAutoHidingHeaderComponent {
  subscription = null;
  constructor(props: any) {
    super(props);
    this.state = {
      shouldListenForChanges: true,
      documentURL: '',
      areCommentsEnabled: false,
      isUrlInputPresented: false,
      syncAnnotations: true,
    };
  }

  updateSyncDelay = async (delayValue: string) => {
    this.setState({ delay: delayValue });
  };

  openInstantLink = async () => {
    await Linking.openURL('https://www.nutrient.io/demo/instant-collaboration');
  };

  toggleOption = (type: string) => {
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

  onConnect = async (url: any) => {
    // Load Instant Document from URL
    this.setState({ documentURL: url });
    try {
      this.onCloseModal();
      const response = await loadDocument(url);
      const documentData = {
        serverUrl: response.serverUrl,
        jwt: response.jwt,
      };
      Nutrient.presentInstant(documentData, {
        enableInstantComments: this.state.areCommentsEnabled,
        listenToServerChanges: this.state.shouldListenForChanges,
        delay: this.state.delay ?? '1',
        syncAnnotations: this.state.syncAnnotations ?? true,
      }).then(async () => {
        Nutrient.setLicenseKey(null);

        // You can change properties after the document is presented programmatically like in this examples:
        await Nutrient.setDelayForSyncingLocalChanges(
          parseFloat(this.state.delay),
        );
        await Nutrient.setListenToServerChanges(
          this.state.enableListenToServerChanges,
        );
      });
    } catch (error: any) {
      Alert.alert('Nutrient', error.message);
    }
  };

  override render() {
    return (
      <View style={styles.container}>
        <UrlInput
          shouldRender={this.state.isUrlInputPresented}
          onCancel={this.onCloseModal}
          defaultURL={''}
          placeholder={'Enter Document URL'}
          onConnect={(url: any) => this.onConnect(url)}
        />
        <View>
          <Text style={defaultStyles.text}>
            Copy the collaboration URL from{' '}
            <Text style={defaultStyles.linkText} onPress={this.openInstantLink}>
              https://www.nutrient.io/demo/instant-collaboration
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
  delayContainer: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
  },
};
