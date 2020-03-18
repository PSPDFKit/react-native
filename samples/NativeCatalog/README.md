## Native Catalog

This second, Android only, Catalog example serves to show you how you can leverage the `PdfView` in your own view manager to provide more advanced integrations with PSPDFKit while still using react-native where possible.

### Running this Sample on Android

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. Install dependencies: run `yarn install` from `samples/NativeCatalog` directory.
3. Add your customer portal password to `samples/NativeCatalog/android/build.gradle`:

```groovy
maven {
    url 'https://customers.pspdfkit.com/maven/'

    credentials {
        username 'pspdfkit'
        password 'YOUR_MAVEN_PASSWORD_GOES_HERE'
    }
}
```

4. The Native Catalog app is now ready to launch. From `samples/NativeCatalog` directory run `react-native run-android`.

### Running this Sample on iOS

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. Install dependencies: run `yarn install` from `samples/NativeCatalog` directory.
3. Open `samples/NativeCatalog/ios/Podile` in a text editor: `open samples/NativeCatalog/ios/Podfile` and add your CocoaPods URL.

```diff
platform :ios, '11.0'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target 'YourApp' do
  # Pods for YourApp
  pod 'React', :path => '../node_modules/react-native/'
  pod 'React-Core', :path => '../node_modules/react-native/React'
  pod 'React-DevSupport', :path => '../node_modules/react-native/React'
  pod 'React-fishhook', :path => '../node_modules/react-native/Libraries/fishhook'
  pod 'React-RCTActionSheet', :path => '../node_modules/react-native/Libraries/ActionSheetIOS'
  pod 'React-RCTAnimation', :path => '../node_modules/react-native/Libraries/NativeAnimation'
  pod 'React-RCTBlob', :path => '../node_modules/react-native/Libraries/Blob'
  pod 'React-RCTImage', :path => '../node_modules/react-native/Libraries/Image'
  pod 'React-RCTLinking', :path => '../node_modules/react-native/Libraries/LinkingIOS'
  pod 'React-RCTNetwork', :path => '../node_modules/react-native/Libraries/Network'
  pod 'React-RCTSettings', :path => '../node_modules/react-native/Libraries/Settings'
  pod 'React-RCTText', :path => '../node_modules/react-native/Libraries/Text'
  pod 'React-RCTVibration', :path => '../node_modules/react-native/Libraries/Vibration'
  pod 'React-RCTWebSocket', :path => '../node_modules/react-native/Libraries/WebSocket'

  pod 'React-cxxreact', :path => '../node_modules/react-native/ReactCommon/cxxreact'
  pod 'React-jsi', :path => '../node_modules/react-native/ReactCommon/jsi'
  pod 'React-jsiexecutor', :path => '../node_modules/react-native/ReactCommon/jsiexecutor'
  pod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector'
  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

  pod 'react-native-pspdfkit', :path => '../node_modules/react-native-pspdfkit'
- pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'
+ pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/USE_YOUR_OWN_COCOAPODS_KEY/pspdfkit/latest.podspec'

  use_native_modules!
end
```

4. `cd ios` then run `pod install`.
5. The Native Catalog app is now ready to launch. From `samples/NativeCatalog` directory run `react-native run-ios`.

### Examples

#### Manual Signing

This example shows you how to use the `SignaturePickerFragment` and `SignatureSignerDialog` on Android and `PSPDFSignatureViewController` on iOS to digitally sign a document after a react button was pressed. The relevant part is the `performInkSigning` method in the `CustomPdfViewManager` on Android and `-[CustomPDFView startSigning]` on iOS.

#### Watermark

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.

#### Watermark on Startup

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document on startup, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.
