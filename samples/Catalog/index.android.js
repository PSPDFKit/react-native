//
//  index.android.js
//  PSPDFKit
//
//  Copyright (c) 2016 PSPDFKit GmbH. All rights reserved.
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
  processColor,
  PermissionsAndroid
} from 'react-native';

var PSPDFKit = NativeModules.PSPDFKit;

const DOCUMENT = 'file:///sdcard/PSPDFKit 5 QuickStart Guide.pdf';
const CONFIGURATION = {
  startPage : 3,
  scrollContinuously : false,
  showPageNumberOverlay : true,
  grayScale : true,
  showPageLabels : false,
  pageScrollDirection : "vertical",
  showThumbnailBar : "scrollable"
};

var examples = [
  {
    name: "Open assets document",
    description: 'Open document from your project assets folder',
    action: () => {
      PSPDFKit.present('file:///android_asset/PSPDFKit 5 QuickStart Guide.pdf', {})
    }
  },
  {
    name: "Open local document",
    description: 'Opens document from external storage directory.',
    action: () => {
      requestExternalStoragePermission(function () { PSPDFKit.present(DOCUMENT, {}); });
    }
  },
  {
    name: "Configuration Builder",
    description: "You can configure the builder with dictionary representation of the PSPDFConfiguration object.",
    action: () => {
      requestExternalStoragePermission(function () { PSPDFKit.present(DOCUMENT, CONFIGURATION) });
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

async function requestExternalStoragePermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Write external storage permission granted")
      callback()
    } else {
      console.log("Write external storage permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

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

AppRegistry.registerComponent('Catalog', () => Catalog);
