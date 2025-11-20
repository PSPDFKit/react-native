import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';

import LinkButton from './linkButton';
import PrimaryButton from './primaryButton';

interface LinkButtonStyle {
  container?: { marginRight?: number };
}

const UrlInput = ({
  shouldRender = false,
  // @ts-ignore
  onCancel,
  placeholder = '',
  // @ts-ignore
  onConnect,
  defaultURL = '',
}) => {
  const [urlText, setUrlText] = useState(defaultURL);

  return (
    <Modal
      visible={shouldRender}
      transparent={true}
      presentationStyle={'overFullScreen'}
    >
      <View style={styles.modalContainer}>
        <View style={styles.contentView}>
          <Text style={styles.title}>Enter Document URL</Text>
          <TextInput
            placeholder={placeholder}
            onChangeText={text => setUrlText(text)}
            defaultValue={urlText}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <View style={styles.footer}>
            <LinkButton
              title={'Cancel'}
              onPress={onCancel}
              style={{ container: { marginRight: 10 } }}
            />
            <PrimaryButton
              title={'Connect'}
              onPress={() => onConnect(urlText)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UrlInput;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    justifyContent: 'center',
  },
  contentView: {
    backgroundColor: 'white',
    width: '80%',
    marginBottom: 100,
    borderRadius: 5,
    padding: 15,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  input: {
    fontSize: 18,
    height: 40,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderColor: '#cfcfcf',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
  },
  title: {
    fontSize: 19,
    height: 25,
    marginBottom: 15,
  },
});
