## PSPDFKit for React Native

### CocoaPods integration

#### Requirements
- Xcode 10.2.1
- PSPDFKit 8.4.0 for iOS or later
- react-native >= 0.59.9
- CocoaPods >= 1.7.2

#### Getting Started

Lets create a simple app that integrates PSPDFKit using CocoaPods.

1. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`
2. Create the app with `react-native init YourApp`.
3. Step into your newly created app folder: `cd YourApp`
4. Install `react-native-pspdfkit` from GitHub: `yarn add https://github.com/PSPDFKit/react-native`
5. Install all the dependencies for the project: `yarn install`. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
6. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit`.
7. Open ios/YourApp.xcodeproj in Xcode: open ios/YourApp.xcodeproj
8. Make sure the deployment target is set to 11.0 or higher: 
![Deployment Target](../screenshots/deployment-target.png)
9. Change "View controller-based status bar appearance" to `YES` in `Info.plist`:
    ![View Controller-Based Status Bar Appearance](../screenshots/view-controller-based-status-bar-appearance.png)
10. Link with the `libRCTPSPDFKit.a` static library (if `libRCTPSPDFKit.a` is already there but greyed out, delete it and link it again):
    ![Linking Static Library](../screenshots/linking-static-library.png)
11. Close the Xcode project
12. Go back to the Terminal, `cd ios` then run `pod init`
13. Replace the content of your newly created `Podfile` with this:

```podfile
target 'YourApp' do
  use_frameworks!

  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'

  # Your 'node_modules' directory is probably in the root of your project,
  # but if not, adjust the `:path` accordingly
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'CxxBridge', # Include this for RN >= 0.47
    'DevSupport', # Include this to enable In-App Devmenu if RN >= 0.43
    'RCTText',
    'RCTNetwork',
    'RCTWebSocket', # Needed for debugging
    'RCTAnimation', # Needed for FlatList and animations running on native UI thread
    # Add any other subspecs you want to use in your project
  ]
  # Explicitly include Yoga if you are using RN >= 0.42.0
  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

  # Third party deps podspec link
  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'
end
```

14. Run `pod install`
15. Open the newly created workspace: `YourApp.workspace`
16. Add a PDF by drag and dropping it into your Xcode project (Select "Create groups" and add to target "YourApp"). This will add the document to the "Copy Bundle Resources" build phase: 
![Adding PDF](../screenshots/adding-pdf.png)
17. Replace the default component from `index.ios.js` with a simple touch area to present the bundled PDF:

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

const PSPDFKit = NativeModules.PSPDFKit;

PSPDFKit.setLicenseKey('INSERT_YOUR_LICENSE_KEY_HERE');

// Change 'YourApp' to your app's name.
export default class YourApp extends Component<Props> {
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

// Change both 'YourApp's to your app's name.
AppRegistry.registerComponent('YourApp', () => YourApp);
```

Your app is now ready to launch. Run the app in Xcode or type `react-native run-ios` in the terminal.