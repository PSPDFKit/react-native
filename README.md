## PSPDFKit for React Native

### iOS

#### Requirements
- Xcode 8
- PSPDFKit 6
- react-native >= 0.33.0

#### Getting Started

Lets create a simple app that integrates PSPDFKit.framework and `react-native-pspdfkit` module.

1. Make sure react-native-cli is installed.
1. create the app with `react-native init YourApp`
1. step into your newly created app folder: `cd YourApp`
1. install _react-native-pspdfkit_ from github: `react-native install github:PSPDFKit/react-native`
1. copy PSPDFKit.framework to `YourApp/ios/PSPDFKit`
1. open TestApp.xcodeproj in Xcode
1. make sure deployment target is set to 9.0 or higher
1. add React project dependency (add project reference, link with static lib)
1. add PSPDFKit.framework and make sure it's embedded
1. add sample PDF to your project
1. replace default component from `index.ios.js` with simple touch area to present bundled pdf

```javascript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NativeModules,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

var PSPDFKit = NativeModules.PSPDFKit;

class YourApp extends Component {
  _onPressButton() {
    PSPDFKit.present('document.pdf', {})
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text style={styles.text}>Tap to Open Document</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('YourApp', () => YourApp);
```

Your app should be ready to launch. Run the app in Xcode or type `react-native run-ios` in the terminal.

#### Configuration

You can configure the presentation with configuration dictionary which is a mirror of [PSPDFConfiguration](https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html) object. Example:

```javascript
PSPDFKit.present('PDFs/PSPDFKit 5 QuickStart Guide.pdf', {
  scrollDirection: "horizontal",
  backgroundColor: processColor('white'),
  thumbnailBarMode: 'scrollable',
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical'
})
```
  
#### Running Catalog Project

- copy PSPDFKit.framework to `PSPDFKit` directory
- install npm packages: `npm install` in `samples/Catalog` directory
- run app with react-native-cli: `react-native run-ios`

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2016 PSPDFKit GmbH.

See LICENSE for details.
