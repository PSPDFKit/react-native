//  Copyright © 2016-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React from 'react';
import {
  FlatList,
  Image,
  NativeModules,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {BaseExampleAutoHidingHeaderComponent} from './helpers/BaseExampleAutoHidingHeaderComponent';
import {pspdfkitColor} from './configuration/Constants';
import {ManualSigning} from './examples/ManualSigning';
import {Watermark} from './examples/Watermark';
import {WatermarkStartup} from './examples/WatermarkStartup';
import {InstantExample} from './examples/InstantExample';
import {DefaultAnnotationSettings} from './examples/DefaultAnnotationSettings';

const PSPDFKit = NativeModules.PSPDFKit;

// By default, this example doesn't set a license key, but instead runs in trial mode (which is the default, and which requires no
// specific initialization). If you want to use a different license key for evaluation (e.g. a production license), you can uncomment
// the next line and set the license key.
//
// To set the license key for both platforms, use:
// PSPDFKit.setLicenseKeys("YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE", "YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE");
//
// To set the license key for the currently running platform, use:
// PSPDFKit.setLicenseKey("YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE");

const examples = [
  {
    key: 'item1',
    name: 'Manual Signing',
    description:
      'Show how to start the signing flow using a react-native button linked to CustomPdfView.',
    action: component => {
      component.props.navigation.navigate('ManualSigning');
    },
  },
  {
    key: 'item2',
    name: 'Watermark',
    description: 'Show how to watermark a PDF that is loaded in CustomPdfView.',
    action: component => {
      component.props.navigation.navigate('Watermark');
    },
  },
  {
    key: 'item3',
    name: 'Watermark on Startup',
    description:
      'Show how to watermark a PDF as soon as it is loaded in CustomPdfView.',
    action: component => {
      component.props.navigation.navigate('WatermarkStartup');
    },
  },
  Platform.OS === 'android' && {
    key: 'item4',
    name: 'Default Annotation Settings',
    description: 'Show how to configure default annotations settings.',
    action: component => {
      component.props.navigation.navigate('DefaultAnnotationSettings');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item5',
    name: 'Instant Example',
    description: 'Show the native Instant example.',
    action: component => {
      component.props.navigation.push('InstantExample');
    },
  },
];

class NativeCatalog extends BaseExampleAutoHidingHeaderComponent {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      dataSource: examples.filter(element => {
        return element != null && element != [];
      }),
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('./assets/logo-flat.png')}
            style={styles.logo}
          />
          <Text style={styles.version}>{PSPDFKit.versionString}</Text>
        </View>
        <FlatList
          data={this.state.dataSource}
          renderItem={this._renderRow}
          ItemSeparatorComponent={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
          contentInset={{bottom: 22}}
        />
      </View>
    );
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  _renderRow = ({item}) => {
    return (
      <TouchableHighlight
        onPress={() => {
          item.action(this);
        }}
        style={styles.row}
        underlayColor={pspdfkitColor}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

export default createAppContainer(
  createStackNavigator(
    {
      NativeCatalog: {
        screen: NativeCatalog,
      },
      ManualSigning: {
        screen: ManualSigning,
      },
      Watermark: {
        screen: Watermark,
      },
      WatermarkStartup: {
        screen: WatermarkStartup,
      },
      InstantExample: {
        screen: InstantExample,
      },
      DefaultAnnotationSettings: {
        screen: DefaultAnnotationSettings,
      },
    },
    {
      initialRouteName: 'NativeCatalog',
      initialRouteParams: {
        examples: examples,
      },
    },
  ),
);

var styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  version: {
    color: '#666666',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    marginTop: 20,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  list: {
    backgroundColor: '#eee',
  },
  name: {
    color: pspdfkitColor,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    color: '#666666',
    fontSize: 12,
  },
  rowContent: {
    padding: 10,
  },
});
