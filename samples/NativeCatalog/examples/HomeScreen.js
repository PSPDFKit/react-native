import React, { Component } from 'react';
import {
  FlatList,
  Image,
  NativeModules,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { pspdfkitColor } from '../configuration/Constants';
const PSPDFKit = NativeModules.PSPDFKit;
import styles from '../styles/styles';
import examples from '../ExamplesNavigationMenu';
class HomeScreen extends Component {
  render() {
    const exampleList = examples.filter(item => item?.name !== null);

    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo-flat.png')}
            style={styles.logo}
          />
          <Text style={styles.version}>{PSPDFKit.versionString}</Text>
        </View>
        <FlatList
          data={exampleList}
          renderItem={this._renderRow}
          ItemSeparatorComponent={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
          contentInset={{ bottom: 22 }}
        />
      </View>
    );
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  _renderRow = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          item.action(this);
        }}
        style={styles.row}
        underlayColor={pspdfkitColor}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.description}>{item?.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

export default HomeScreen;
