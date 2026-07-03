import examples from '../ExamplesNavigationMenu';

const { View, Image, Text, FlatList } = require('react-native');
const { Nutrient } = require('../helpers/Nutrient');
import React, { useMemo } from 'react';
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

const HomeScreen = (props: any) => {
  const exampleList = useMemo(
    () => examples.filter(item => item && item?.name !== null),
    [],
  );

  // Keep compatibility with menu actions that expect a class component instance.
  const actionContext = useMemo(() => ({ props }), [props]);

  const renderRow = ({ item }: { item: any }) => {
    return (
      <TouchableHighlight
        accessibilityLabel={item.name}
        onPress={() => {
          item.action(actionContext);
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

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-flat.png')} style={styles.logo} />
        <Text style={styles.version}>{getVersionString()}</Text>
      </View>
      <FlatList
        nativeID="catalog_list"
        data={exampleList}
        renderItem={renderRow}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        contentInset={{ bottom: 22 }}
      />
    </View>
  );
};

export default HomeScreen;
