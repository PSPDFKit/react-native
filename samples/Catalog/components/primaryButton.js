import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { pspdfkitColor } from '../configuration/Constants';

const PrimaryButton = ({ title = '', onPress = () => {}, style = {} }) => {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, style?.container ?? {}]}
      onPress={onPress}
    >
      <Text style={[styles.primaryButtonText, style?.text ?? {}]}>{title}</Text>
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
