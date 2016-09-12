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
  NativeModules
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
    name: "Modal Presentation",
    action: () => {
      PSPDFKit.present('PDFs/PSPDFKit 5 QuickStart Guide.pdf')
    }
  },
  {
    name: "Modal Presentation with Configuration",
    action: () => {
      PSPDFKit.present('PDFs/PSPDFKit 5 QuickStart Guide.pdf', {
        scrollDirection: "horizontal"
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
// PSPDFKit.setLicenseKey("dJXHOUy+rIQ8XGp2tsqM1dziNxEjFGhUqCkO2c4USAC5dVygts4BQnfsjhZbX3Eq287A9JFaoSYLPuEeYobwrniESR1huzqEAUSE6z/eK5u6Fc8dYE9/nq5wPFij333lOi4q2twpWcVoZybJY6CDkOMd8168s9vvJq58KcDitzJuJuDw3L6ZGkbUEFJNLO3JOucBNukEQ6aTkBSzqTv6kzb3X1zSuUR1WPEJjx63EbTBpaPSKnSLjr81JMHqtiaVQ8V1+iFSnMP1DO7AKf232XQva8erw89YfwH0ut+VbKM9I1Ybwk0VGVJwBXBIjR2hURMnu0721BjUqcHCNNdeCeBoCm03N0knQjsED7P+boJOpLXob9sVi9OLVgs+e+eQcwiO4TgOQyMSlGM3v1caSgViDT26AnVBnwqqyAurvtiSbYlncfngOOOs1PESWbge")

AppRegistry.registerComponent('Catalog', () => Catalog);
