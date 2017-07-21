Integrate PSPDFKit for React Native on iOS using CocoaPods


1. Create the app with react-native init YourApp.
2. Step into your newly created app folder: cd YourApp
3. Install react-native-pspdfkit from GitHub: yarn add github:PSPDFKit/react-native#rad/podspec (#rad/podspec is temporary, as the change is only on that branch)
4. IMPORTANT: Do not link module react-native-pspdfkit: Do not use react-native link react-native-pspdfkit
5. Create the folder PSPDFKit and copy PSPDFKit.framework into it.
6. Open ios/YourApp.xcodeproj in Xcode: open ios/YourApp.xcodeproj
7. Make sure the deployment target is set to 9.0 or higher: 
 deployment-target.png 

1. Change "View controller-based status bar appearance" to YES in Info.plist: 
 deployment-target.png 

1. Change your bundle ID to match the one for which you have a PSPDFKit license
2. Close the Xcode project
3. Run react-native run-ios to make sure your app runs before adding PSPDFKit
4. Go back to the terminal and run pod init
5. Replace the content of your newly created Podfile with this:


target 'YourApp' do
  # Native Navigation uses Swift, so this line is required!
  use_frameworks!


  pod 'react-native-pspdfkit', :path => '../node_modules/react-native-pspdfkit'


  # To use CocoaPods with React Native, you need to add this specific Yoga spec as well
  pod 'Yoga', :path => '../node_modules/react-native/ReactCommon/yoga/Yoga.podspec'


  # You don't necessarily need all of these subspecs, but this would be a typical setup.
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'RCTText',
    'RCTNetwork',
    'RCTWebSocket', # needed for debugging
    'RCTAnimation',
    'RCTImage',
    'RCTNetwork',
        'BatchedBridge', # https://github.com/facebook/react-native/issues/14749
    # Add any other subspecs you want to use in your project
  ]


  # Add any other dependencies here, including any 3rd party native libraries that you depend on for
  # React Native.
end


1. Run pod install
2. Open the newly created workspace: YourApp.workspace
3. Copy PSPDFKit into the Pods folder: YourApp/ios/Pods[a]
4. Drag and drop if from the Finder into the RCTPSPDFKit group:
 drag-and-drop.png 

1. Add it to the react-native-pspdfkit framework:
 add-to-react-native-pspdfkit.png 

1. Embed YourApp/ios/PSPDFKit/PSPDFKit.framework (not the copy from YourApp/ios/Pods/PSPDFKit.framework) by drag and dropping it into the "Embedded Binaries" section of the "YourApp" target (Select "Create groups"). This will also add it to the "Linked Frameworks and Libraries" section:
 embedding-pspdfkit.png 

1. Add a PDF by drag and dropping it into your Xcode project (Select "Create groups" and add to target "YourApp"). This will add the document to the "Copy Bundle Resources" build phase: 
 adding-pdf.png 

1. Replace the default component from index.ios.js with a simple touch area to present the bundled PDF:


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

PSPDFKit.setLicenseKey('INSERT_YOUR_LICENSE_KEY_HERE');

// Change 'YourApp' to your app's name.
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

// Change both 'YourApp's to your app's name.
AppRegistry.registerComponent('YourApp', () => YourApp);


[a]Symlink does not work. We have to have two instances of PSPDFKit.framework on disk. We need to do better here.