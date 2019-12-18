import React, {Component} from 'react';
import {
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

const RNFS = require('react-native-fs');
const PSPDFKit = NativeModules.PSPDFKit;

export async function requestExternalStoragePermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write external storage permission granted');
      callback();
    } else {
      console.log('Write external storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export function extractFromAssetsIfMissing(assetFile, callback) {
  RNFS.exists('/sdcard/' + assetFile)
    .then(exist => {
      if (exist) {
        console.log(assetFile + ' exists in the external storage directory.');
        callback();
      } else {
        console.log(
          assetFile +
            ' does not exist, extracting it from assets folder to the external storage directory.',
        );
        RNFS.existsAssets(assetFile)
          .then(exist => {
            // Check if the file is present in the assets folder.
            if (exist) {
              // File exists so it can be extracted to the external storage directory.
              RNFS.copyFileAssets(assetFile, '/sdcard/' + assetFile)
                .then(() => {
                  // File copied successfully from assets folder to external storage directory.
                  callback();
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              // File does not exist, it should never happen.
              throw new Error(
                assetFile +
                  " couldn't be extracted as it was not found in the project assets folder.",
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(error => {
      console.log(error);
    });
}

export class CatalogScreen extends Component<{}> {
  static navigationOptions = {
    title: 'Catalog',
  };

  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.navigation.getParam('examples'),
    };
  }

  render() {
    return (
      <View style={styles.page}>
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
          keyExtractor={item => item.name}
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
        underlayColor="#209cca50">
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

var styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  page: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#eee',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  version: {
    color: '#666666',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    marginTop: 40,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  list: {},
  name: {
    color: '#209cca',
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
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
});
