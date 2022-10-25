import { Platform } from 'react-native';

export const hideToolbar = navigation => {
  if (Platform.OS === 'android') {
    navigation.setOptions({
      // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
      headerShown: false,
    });
  }
};
