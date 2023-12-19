import { Component } from 'react';
import { Platform } from 'react-native';

interface IProps {
  navigation?: any;
  route?: any;
}

export class BaseExampleAutoHidingHeaderComponent extends Component<
  IProps,
  any
> {
  constructor(props: any) {
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
