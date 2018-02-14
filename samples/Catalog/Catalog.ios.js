//  Copyright © 2016-2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  NativeModules,
  processColor
} from 'react-native';

var RNFS = require('react-native-fs');

var PSPDFKit = NativeModules.PSPDFKit;

var examples = [
  {
    name: "Open document using resource path",
    description: 'Open document from your resource bundle with relative path.',
    action: () => {
      PSPDFKit.present('PDFs/Annual Report.pdf', {})
    }
  },
  {
    name: "Open document with absolute path",
    description: 'Opens document from application Documents directory by passing the absolute path.',
    action: () => {
      const filename = 'Annual Report.pdf'
      
      const path = RNFS.DocumentDirectoryPath + '/' + filename
      const src = RNFS.MainBundlePath + '/PDFs/' + filename 
      
      RNFS.exists(path).then((exists) => {
        if (!exists) {
          return RNFS.copyFile(src, path)
        }
      }).then(() => {
        PSPDFKit.present(path, {})
        PSPDFKit.setPageIndex(3, false)
      }).catch((err) => {
        console.log(err.message, err.code);
      });
    }
  },
  {
    name: "Configured Controller",
    description: "You can configure the controller with dictionary representation of the PSPDFConfiguration object.",
    action: () => {
      PSPDFKit.present('PDFs/Annual Report.pdf', {
        scrollDirection: "horizontal",
        backgroundColor: processColor('white'),
        thumbnailBarMode: 'scrollable',
        pageTransition: 'scrollContinuous',
        scrollDirection: 'vertical'
      })
    }
  },
  {
    name: "Debug Log",
    description: "Action used for printing stuff during development and debugging.",
    action: () => {
      console.log(PSPDFKit)
      console.log(PSPDFKit.versionString)
      // console.log(NativeModules)
    }
  }
]

export default class Catalog extends Component<{}> {
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
      <View style={styles.page}>
        <View style={styles.header}>
          <Image source={require('./assets/logo-flat.png')} style={styles.logo} />
          <Text style={styles.version}>{PSPDFKit.versionString}</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </View>
    );
  }
  
  _renderSeparator(sectionId, rowId) {
    return (
      <View key={rowId} style={styles.separator} />
    );
  }
  
  _renderRow(example: object) {
    return (
      <TouchableHighlight onPress={example.action} style={styles.row} underlayColor='#209cca50'>
        <View style={styles.rowContent}>
          <Text style={styles.name}>{example.name}</Text>
          <Text style={styles.description}>{example.description}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const pspdfkitColor = "#209cca"

var styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10
  },
  page: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#eee'
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  version: {
    color: '#666666',
    marginTop: 10,
    marginBottom: 20
  },
  logo: {
    marginTop: 40
  },
  listContainer: {
    backgroundColor: 'white',
  },
  list: {
  },
  name: {
    color: '#209cca',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4
  },
  description: {
    color: "#666666",
    fontSize: 12
  },
  rowContent: {
    padding: 10
  }
});
