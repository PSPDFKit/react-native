import examples from '../ExamplesNavigationMenu';

const { View, Image, Text, FlatList } = require('react-native');
const { Nutrient } = require('../helpers/Nutrient');
import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';

import { pspdfkitColor } from '../configuration/Constants';
import styles from '../styles/styles';

// Helper to get version string that works in both Paper and New Architecture
const getVersionString = (): string => {
  // @ts-ignore - versionString can be either a function (New Arch) or property (Paper)
  if (typeof Nutrient.versionString === 'function') {
    // New Architecture: versionString is a function
    // @ts-ignore
    return (Nutrient.versionString as () => string)();
  } else {
    // Paper: versionString is a property
    // @ts-ignore
    return Nutrient.versionString as string;
  }
};

class HomeScreen extends Component {
  exampleList = examples.filter(item => item && item?.name !== null);

  renderRow = ({ item }: { item: any }) => {
    return (
      <TouchableHighlight
        accessibilityLabel={item.name}
        onPress={() => {
          item.action(this);
        }}
        style={styles.rowContent}
        underlayColor={pspdfkitColor}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  renderSeparator(sectionId: any, rowId: React.Key | null | undefined) {
    return <View key={rowId} style={styles.separator} />;
  }

  override render() {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo-flat.png')}
            style={styles.logo}
          />
          <Text style={styles.version}>{getVersionString()}</Text>
        </View>
        <FlatList
          nativeID="catalog_list"
          data={this.exampleList}
          renderItem={this.renderRow}
          ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
          contentInset={{ bottom: 22 }}
        />
      </View>
    );
  }
}

export default HomeScreen;
