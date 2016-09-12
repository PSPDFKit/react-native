/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  NativeModules,
  processColor
} from 'react-native';

var PSPDFKit = NativeModules.PSPDFKit;

var examples = [
  {
    name: "Debug Log",
    action: () => {
      console.log(PSPDFKit)
      // console.log(NativeModules)
    }
  },
  {
    name: "Default Controller",
    action: () => {
      PSPDFKit.present('PDFs/PSPDFKit 5 QuickStart Guide.pdf')
    }
  },
  {
    name: "Configured Controller",
    action: () => {
      PSPDFKit.present('PDFs/PSPDFKit 5 QuickStart Guide.pdf', {
        scrollDirection: "horizontal",
        backgroundColor: processColor('white'),
        thumbnailBarMode: 'scrollable',
        pageTransition: 'scrollContinuous',
        scrollDirection: 'vertical'
      })
    }
  }
]

class Catalog extends Component {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(examples)
    };
  }
  
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        style={styles.list}
      />
    );
  }
  
  _renderRow(example: object) {
    return (
      <TouchableHighlight onPress={example.action} style={styles.row}>
        <Text style={styles.text}>{example.name}</Text>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  list: {
    paddingTop: 20
  },
  text: {
    marginTop: 1,
    padding: 10
  }
});

AppRegistry.registerComponent('Catalog', () => Catalog);
