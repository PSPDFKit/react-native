import { Platform } from 'react-native';

// @ts-ignore
export const hideToolbar = navigation => {
  if (Platform.OS === 'android') {
    navigation.setOptions({
      // Since the NutrientView provides it's own toolbar and back button we don't need a header in Android.
      headerShown: false,
    });
  }
};
