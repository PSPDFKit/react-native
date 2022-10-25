import { Component } from 'react';
import { Platform } from 'react-native';

export class BaseExampleAutoHidingHeaderComponent extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    if (Platform.OS === 'android') {
      navigation.setOptions({
        // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
        headerShown: false,
      });
    }
  }
}
