//
// Testing.js
//
// PSPDFKit
//
// Copyright © 2021 PSPDFKit GmbH. All rights reserved.
//
// THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
// AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
// UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
// This notice may not be removed from this file.
//

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  FlatList,
  NativeModules,
  processColor,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {
  StackNavigator,
  NavigationEvents,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

import styles from './styles';
import AuthorNameScreen from './AuthorNameScreen';
import AnnotationToolbarScreen from './AnnotationToolbarScreen';
import GetAnnotationsScreen from './GetAnnotationsScreen';
import FormsScreen from './FormsScreen';

import PSPDFKitView from 'react-native-pspdfkit';

var examples = [
  {
    name: 'AuthorName',
    action: component => {
      component.props.navigation.navigate('AuthorName');
    },
  },
  {
    name: 'AnnotationToolbar',
    action: component => {
      component.props.navigation.navigate('AnnotationToolbar');
    },
  },
  {
    name: 'GetAnnotations',
    action: component => {
      component.props.navigation.navigate('GetAnnotations');
    },
  },
  {
    name: 'Forms',
    action: component => {
      component.props.navigation.navigate('Forms');
    },
  },
];

class CatalogScreen extends Component<{}> {
  static navigationOptions = {
    title: 'Test Cases',
  };

  render() {
    return (
      <View style={styles.page}>
        <FlatList
          data={examples}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderRow}
          renderSeparator={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </View>
    );
  }

  _keyExtractor = (item, index) => item.name;

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  _renderRow = example => {
    console.log(example);
    return (
      <TouchableHighlight
        onPress={() => {
          example.item.action(this);
        }}
        style={styles.row}
        underlayColor="#209cca50"
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{example.item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

export default createAppContainer(
  createStackNavigator(
    {
      Catalog: {
        screen: CatalogScreen,
      },
      AuthorName: {
        screen: AuthorNameScreen,
      },
      AnnotationToolbar: {
        screen: AnnotationToolbarScreen,
      },
      GetAnnotations: {
        screen: GetAnnotationsScreen,
      },
      Forms: {
        screen: FormsScreen,
      },
    },
    {
      initialRouteName: 'Catalog',
    },
  ),
);
