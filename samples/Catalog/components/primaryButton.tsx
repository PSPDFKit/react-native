import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { pspdfkitColor } from '../configuration/Constants';

interface PrimaryButtonStyle {
  container?: ViewStyle;
  text?: TextStyle;
}

interface PrimaryButtonProps {
  title?: string;
  onPress?: () => void;
  style?: PrimaryButtonStyle;
}

const PrimaryButton = ({ title = '', onPress = () => {}, style = {} }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      // @ts-ignore
      style={[styles.primaryButton, style?.container ?? {}]}
      onPress={onPress}
    >
      <Text style={[styles.primaryButtonText, style?.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: pspdfkitColor,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 5,
  },
  primaryButtonText: {
    color: 'white',
    padding: 10,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '500',
  },
});
