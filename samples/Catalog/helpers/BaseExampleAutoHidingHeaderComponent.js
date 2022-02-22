import {Component} from 'react';

export class BaseExampleAutoHidingHeaderComponent extends Component {
  static navigationOptions = ({navigation}) => {
    if (Platform.OS === 'android') {
      return {
        // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
        headerShown: false,
      };
    }
  };
}
