import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { pspdfkitColor } from '../configuration/Constants';

const LinkButton = ({ title = '', style = {}, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore
      style={[styles.button, style?.container ?? {}]}
    >
      <Text style={[styles.link, style?.text ?? {}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'transparent',
  },
  link: {
    color: pspdfkitColor,
    fontSize: 18,
    fontWeight: '500',
  },
});
