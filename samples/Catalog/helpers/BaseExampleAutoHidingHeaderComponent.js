import { Component } from 'react';
import { Platform } from 'react-native';

export class BaseExampleAutoHidingHeaderComponent extends Component {
  static navigationOptions = () => {
    if (Platform.OS === 'android') {
      return {
        // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
        headerShown: false,
      };
    }
  };
}
