import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  NativeModules,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { pspdfkitColor } from '../configuration/Constants';

const Nutrient = NativeModules.Nutrient;
import { generatePDFMenu } from '../ExamplesNavigationMenu';
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

const GeneratePDFMenu = (props: any) => {
  // Keep compatibility with menu actions that expect a class component instance.
  const actionContext = useMemo(() => ({ props }), [props]);

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderRow = ({ item }: { item: any }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          item.action(actionContext);
        }}
        style={styles.rowContent}
        underlayColor={pspdfkitColor}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.description}>{item?.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-flat.png')} style={styles.logo} />
        <Text style={styles.version}>{getVersionString()}</Text>
      </View>
      <FlatList
        data={generatePDFMenu}
        renderItem={renderRow}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        contentInset={{ bottom: 22 }}
      />
    </View>
  );
};

export default GeneratePDFMenu;
