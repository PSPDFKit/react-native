import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { pspdfkitColor } from '../configuration/Constants';

export interface LinkButtonStyle {
  container?: ViewStyle;
  text?: TextStyle;
}

interface LinkButtonProps {
  title?: string;
  style?: LinkButtonStyle;
  onPress?: () => void;
}

const LinkButton = ({ title = '', style = {}, onPress = () => {} }: LinkButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore
      style={[styles.button, style?.container ?? {}]}
    >
      <Text style={[styles.link, style?.text]}>{title}</Text>
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
