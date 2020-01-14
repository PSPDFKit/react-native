## React Native wrapper for PSPDFKit for iOS, Android & Windows UWP. (PDF SDK for React Native)

![PDF SDK for React Native](https://github.com/PSPDFKit/react-native/blob/master/article-header.png?raw=true)

This wrapper requires a valid license of PSPDFKit. Licenses are per platform. You can request [a trial license here](https://pspdfkit.com/try/).

This wrapper exposes the most often used APIs from PSPDFKit. Many of our partners end up forking this wrapper and adding some custom code to achieve even greater integration with their products, using native code.

_IMPORTANT_ : `react-native-pspdfkit` for windows does not yet support react-native 0.60.\*. Currently [`react-native-windows`][https://github.com/microsoft/react-native-windows/releases] is not keeping up pace with `react-native`, where the last official release was 0.60.\* and the last RC was 0.59.\*. We have tested and require 0.59.10 to keep version aligned as much as possible and will continue to support upon the `windows-support` branch.

#### Announcements

- [Announcement blog post](https://pspdfkit.com/blog/2016/react-native-module/)
- [React Native UI Component for iOS](https://pspdfkit.com/blog/2018/react-native-ui-component-for-ios/) ([See iOS](https://github.com/PSPDFKit/react-native#ios))
- [React Native UI Component for Android](https://pspdfkit.com/blog/2018/react-native-ui-component-for-android/) ([See Android](https://github.com/PSPDFKit/react-native#android))
- [PSPDFKit for Windows UWP with React
  Native](https://pspdfkit.com/blog/2018/introducing-pspdfkit-windows/#react-native-for-windows-support) ([See Windows UWP](https://github.com/PSPDFKit/react-native#windows-uwp))
- [How to Extend React Native APIs](https://pspdfkit.com/blog/2018/how-to-extend-react-native-api/)
- [Advanced Techniques for React Native UI Components](https://pspdfkit.com/blog/2018/advanced-techniques-for-react-native-ui-components/)
- [How to Extend React Native APIs for Windows](https://pspdfkit.com/blog/2019/how-to-extend-react-native-apis-for-windows/)

#### PSPDFKit

The [PSPDFKit SDK](https://pspdfkit.com/) is a framework that allows you to view, annotate, sign, and fill PDF forms on iOS, Android, Windows, macOS, and Web.

[PSPDFKit Instant](https://pspdfkit.com/instant) adds real-time collaboration features to seamlessly share, edit, and annotate PDF documents.

### iOS

#### Requirements

- Xcode 10.2.1
- PSPDFKit 8.4.2 for iOS or later
- react-native >= 0.60.3
- CocoaPods >= 1.7.4

#### Getting Started

Let's create a simple app that integrates PSPDFKit and uses the `react-native-pspdfkit` module.

1. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`
2. Create the app with `react-native init YourApp`.
3. Step into your newly created app folder: `cd YourApp`
4. Install `react-native-pspdfkit` from GitHub: `yarn add github:PSPDFKit/react-native`
5. Install all the dependencies for the project: `yarn install`. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
6. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit`.
7. Open `ios/Podile` in a text editor: `open ios/Podfile`, update the platform to iOS 11, and add your CocoaPods URL.

```diff
- platform :ios, '9.0'
+ platform :ios, '11.0'
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
+ pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'

  use_native_modules!
end
```

8. `cd ios` then run `pod install`.
9. Open `YourApp.xcworkspace` in Xcode: `open YourApp.xcworkspace`.
10. Make sure the deployment target is set to 11.0 or higher:
    ![Deployment Target](screenshots/deployment-target.png)
11. Change "View controller-based status bar appearance" to `YES` in `Info.plist`:
    ![View Controller-Based Status Bar Appearance](screenshots/view-controller-based-status-bar-appearance.png)
12. Add a PDF by drag and dropping it into your Xcode project (Select "Create groups" and add to target "YourApp"). This will add the document to the "Copy Bundle Resources" build phase:
    ![Adding PDF](screenshots/adding-pdf.png)
13. Replace the default component from `App.js` with a simple touch area to present the bundled PDF. (Note that you can also use a [Native UI Component](#native-ui-component) to show a PDF.)

```javascript
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  NativeModules,
  Text,
  TouchableHighlight,
  View
} from "react-native";

const PSPDFKit = NativeModules.PSPDFKit;

PSPDFKit.setLicenseKey("INSERT_YOUR_LICENSE_KEY_HERE");

// Change 'YourApp' to your app's name.
export default class YourApp extends Component<Props> {
  _onPressButton() {
    PSPDFKit.present("document.pdf", {});
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});

// Change both 'YourApp's to your app's name.
AppRegistry.registerComponent("YourApp", () => YourApp);
```

Your app is now ready to launch. Run the app in Xcode or go back to the Terminal, then run `cd ..`, and `react-native run-ios`.

### Usage

There are 2 different ways on how to use the PSPDFKit React Native wrapper on iOS.

- Present a document via a Native Module modally.
- Show a PSPDFKit view via a Native UI component.

Depending on your needs you might want to use one or the other.

### Native Module

Using the Native Module (`PSPDFKit.present()`), you can present a document with PSPDFKit modally in fullscreen.
You can specify the path to the document you want to present, and [configuration options](#configuration).

```javascript
import React, { Component } from "react";
import { NativeModules, Text, TouchableHighlight, View } from "react-native";

var PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey("YOUR_LICENSE_KEY_GOES_HERE");

export default class App extends Component<{}> {
  _onPressButton() {
    PSPDFKit.present("document.pdf", {
      pageTransition: "scrollContinuous",
      scrollDirection: "vertical",
      documentLabelEnabled: true
    });
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
```

### Native UI Component

With `PSPDFKitView` you can use PSPDFKit like any other React component in your app.
Using this approach, you have more flexibility over how a document is presented and displayed.

The layout is completely flexible, and can be adjust with flexbox.
Note that you still need to set your license key with the Native Module.

For all the `props` that you can pass to `PSPDFKitView`, have a look at the [source documentation](./index.js).

This is how you would show a PDF as a React component:

```javascript
import React, { Component } from "react";
import { NativeModules } from "react-native";
import PSPDFKitView from "react-native-pspdfkit";

var PSPDFKit = NativeModules.PSPDFKit;
PSPDFKit.setLicenseKey("YOUR_LICENSE_KEY_GOES_HERE");

export default class App extends Component<{}> {
  render() {
    return (
      <PSPDFKitView
        document={"document.pdf"}
        configuration={{
          pageTransition: "scrollContinuous",
          scrollDirection: "vertical",
          documentLabelEnabled: true
        }}
        style={{ flex: 1, color: "#267AD4" }}
      />
    );
  }
}
```

#### Configuration

You can configure the presentation with a configuration dictionary which is a mirror of the [`PSPDFConfiguration`](https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html) class.

Example - Native Module:

```javascript
PSPDFKit.present("document.pdf", {
  thumbnailBarMode: "scrollable",
  pageTransition: "scrollContinuous",
  scrollDirection: "vertical"
});
```

Example - Native UI Component:

```javascript
<PSPDFKitView
  document={"document.pdf"}
  configuration={{
    thumbnailBarMode: "scrollable",
    pageTransition: "scrollContinuous",
    scrollDirection: "vertical"
  }}
/>
```

#### Running Catalog Project

- Copy `PSPDFKit.framework` and `PSPDFKitUI.framework` into the `PSPDFKit` directory.
- Install dependencies: `yarn install` in `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
- Run the app with `react-native-cli`: `react-native run-ios`
- If you get an error about `config.h` not being found check out [this blog post](https://tuntunir.blogspot.com/2018/02/react-native-fatal-error-configh-file.html) for information on how to fix it.

#### Configuration Mapping

The PSPDFKit React Native iOS Wrapper maps most configuration options available in `PSPDFConfiguration` from JSON. Please refer to [`RCTConvert+PSPDFConfiguration.m`](./ios/RCTPSPDFKit/Converters/RCTConvert+PSPDFConfiguration.m#L267) for the complete list and for the exact naming of enum values.

Annotations are mapped based on their type name. This is case sensitive. For example, to limit annotation types to ink and highlight, use this:

```javascript
editableAnnotationTypes: ["Ink", "Highlight"];
```

#### Menu Item Mapping

The PSPDFKit React Native iOS Wrapper allows you to specify a custom grouping for the annotation creation toolbar. Please refer to [`RCTConvert+PSPDFAnnotationToolbarConfiguration.m`](./ios/RCTPSPDFKit/Converters/RCTConvert+PSPDFAnnotationToolbarConfiguration.m#L47) for the complete list of menu items. To set them just specify the `menuItemGrouping` prop on the `PSPDFKitView`. The format used is as follows:

```javascript
[
  menuItem,
  { key: menuItem, items: [subItem, subItem]},
  ...
]
```

#### Customize the Toolbar Buttons

You can customize the toolbar buttons on the Native UI View component by specifying the toolbar buttons using `setLeftBarButtonItems` and `setRightBarButtonItems`, like so:

```javascript
pdfView.setRightBarButtonItems(
  ["thumbnailsButtonItem", "searchButtonItem", "annotationButtonItem"],
  "document",
  false
);
```

Please refer to [`RCTConvert+UIBarButtonItem.m`](./ios/RCTPSPDFKit/Converters/RCTConvert%2BUIBarButtonItem.m#L14) for the complete list of bar button items.

Also, please take a look at the [ToolbarCustomization example from our Catalog app](./samples/Catalog/Catalog.ios.js#L805).

For a more detailed description of toolbar customizations, refer to our Customizing the Toolbar guide for [iOS](https://pspdfkit.com/guides/ios/current/customizing-the-interface/customizing-the-toolbar/) and [Android](https://pspdfkit.com/guides/android/current/customizing-the-interface/customizing-the-toolbar/).

### Android

#### Requirements

- Android SDK
- Android Build Tools 23.0.1 (React Native)
- Android Build Tools 28.0.3 (PSPDFKit module)
- Android Gradle plugin >= 3.2.1
- PSPDFKit >= 5.0.1
- react-native for example app >= 0.59.2
- react-native for Catalog app >= 0.57.8

#### Getting Started

Let's create a simple app that integrates PSPDFKit and uses the react-native-pspdfkit module.

1. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`
2. Create the app with `react-native init YourApp`.
3. Step into your newly created app folder: `cd YourApp`.
4. Add `react-native-pspdfkit` module from GitHub: `yarn add github:PSPDFKit/react-native`.
5. Install all the dependencies for the project: `yarn install`. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
6. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit`.
7. <a id="step-7"></a>Add PSPDFKit repository to `YourApp/android/build.gradle` so PSPDFKit library can be downloaded:

```diff
 allprojects {
     repositories {
         mavenLocal()
         google()
         jcenter()
+        maven {
+            url 'https://customers.pspdfkit.com/maven/'
+            credentials {
+                username 'pspdfkit'
+                password 'YOUR_MAVEN_KEY_GOES_HERE'
+            }
+        }
         maven {
             // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
             url "$rootDir/../node_modules/react-native/android"
         }
     }
 }
```

8. PSPDFKit targets modern platforms, so you'll have to set the `minSdkVersion` to 19. In `YourApp/android/build.gradle`:

```diff
...
 buildscript {
     ext {
         buildToolsVersion = "28.0.3"
-        minSdkVersion = 16
+        minSdkVersion = 19
         compileSdkVersion = 28
         targetSdkVersion = 28
         supportLibVersion = "28.0.0"
...
```

9. We will also need to enable MultiDex support. In `YourApp/android/app/build.gradle`:

```diff
...
  defaultConfig {
      applicationId "com.yourapp"
      minSdkVersion rootProject.ext.minSdkVersion
      targetSdkVersion rootProject.ext.targetSdkVersion
      versionCode 1
      versionName "1.0"
+     multiDexEnabled true
  }
...
```

10. <a id="step-10"></a>Enter your PSPDFKit license key into `YourApp/android/app/src/main/AndroidManifest.xml` file:

```diff
   <application>
      ...

+      <meta-data
+          android:name="pspdfkit_license_key"
+          android:value="YOUR_LICENSE_KEY_GOES_HERE"/>

   </application>
```

11. Set primary color. In `YourApp/android/app/src/main/res/values/styles.xml` replace

```xml
<!-- Customize your theme here. -->
```

with

```xml
<item name="colorPrimary">#3C97C9</item>
```

12. <a id="step-12"></a>Replace the default component from `YourApp/App.js` with a simple touch area to present a PDF document from the local device filesystem:

```javascript
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  NativeModules,
  Text,
  TouchableHighlight,
  View,
  PermissionsAndroid
} from "react-native";

var PSPDFKit = NativeModules.PSPDFKit;

const DOCUMENT = "file:///sdcard/document.pdf";
const CONFIGURATION = {
  scrollContinuously: false,
  showPageNumberOverlay: true,
  pageScrollDirection: "vertical"
};

// Change 'YourApp' to your app's name.
export default class YourApp extends Component<{}> {
  _onPressButton() {
    requestExternalStoragePermission();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{PSPDFKit.versionString}</Text>
        <TouchableHighlight onPress={this._onPressButton}>
          <Text style={styles.text}>Tap to Open Document</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

async function requestExternalStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Write external storage permission granted");
      PSPDFKit.present(DOCUMENT, CONFIGURATION);
    } else {
      console.log("Write external storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
```

13. Before launching the app you need to copy a PDF document onto your development device or emulator.

    ```bash
    adb push /path/to/your/document.pdf /sdcard/document.pdf
    ```

14. Your app is now ready to launch. From `YourApp` directory run `react-native run-android`.

    ```bash
    react-native run-android
    ```

#### Running Catalog Project

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. Install dependencies: run `yarn install` from `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
3. Add your customer portal password to `samples/Catalog/android/build.gradle`:

```groovy
      maven {
          url 'https://customers.pspdfkit.com/maven/'

          credentials {
              username 'pspdfkit'
              password 'YOUR_MAVEN_PASSWORD_GOES_HERE'
          }
      }
```

4. Update license key in `samples/Catalog/android/app/src/main/AndroidManifest.xml`:

```xml
   <application>
      ...

      <meta-data
          android:name="pspdfkit_license_key"
          android:value="YOUR_LICENSE_KEY_GOES_HERE"/>

   </application>
```

5. Catalog app is now ready to launch. From `samples/Catalog` directory run `react-native run-android`.

#### Configuration

##### Upload PDF to device

To copy a pdf document to your local device storage:

```bash
adb push "document.pdf" "/sdcard/document.pdf"
```

##### Bundle PDF inside the APK's assets

To bundle a pdf document in the Android app, simply copy it the Android `assets` folder, for the Catalog app is `samples/PDFs`.

##### Viewer options

You can configure the builder with a dictionary representation of the PSPDFConfiguration object. Check [`ConfigurationAdapter.java`](https://github.com/PSPDFKit/react-native/blob/master/android/src/main/java/com/pspdfkit/react/ConfigurationAdapter.java) for all the parameters available.

```javascript
const CONFIGURATION = {
  startPage: 3,
  scrollContinuously: false,
  showPageNumberOverlay: true,
  grayScale: true,
  showPageLabels: false,
  pageScrollDirection: "vertical"
};
```

#### Native UI Component

Just like on iOS we also support integrating PSPDFKit directly into the react-native view hierarchy. There are a few thing you need to consider when using this approach:

- Your activity hosting the react component needs to extend from `ReactFragmentActivity`.
- Because of [issues](https://github.com/facebook/react-native/issues/17968) in react-native our `PdfView` needs to call `layout` and `dispatchOnGlobalLayout` on every frame, this might negatively affect your apps performance or even cause it to misbehave.
- `PSPDFKitView` doesn't yet support all the features (outline, bookmarks, thubmnail grid, view settings) using `PSPDFKit.present` provides.

##### Menu Item Mapping

The PSPDFKit React Native Android Wrapper allows you to specify a custom grouping for the annotation creation toolbar. Please refer to [`ReactGroupingRule.java`](https://github.com/PSPDFKit/react-native/blob/master/android/src/main/java/com/pspdfkit/react/menu/ReactGroupingRule.java) for the complete list of menu items. To set them just specify the `menuItemGrouping` prop on the `PSPDFKitView`. The format used is as follows:

```
[
  menuItem,
  { key: menuItem, items: [subItem, subItem]},
  ...
]
```

#### Update

Upgrading yarn's lock file is required in order to update react-native-pspdfkit module in a project that has been already setup following the steps in [Getting Started](#getting-started-1) section.  
From root project folder (e.g.`YourApp` for upgrading example project) launch `yarn upgrade`.

##### Migrate from PSPDFKit version 2.9.x to 3.0.0

After launching `yarn upgrade`, apply [step 7](#step-7), [step 10](#step-10) and [step 12](#step-12) from [Getting Started](#getting-started-1) section.  
Enable MultiDex in `YourApp/android/app/build.gradle` (note **one** place to edit):

```diff
...
android {
    compileSdkVersion 25
    buildToolsVersion "25.0.2"

defaultConfig {
    applicationId "com.yourapp"
+   multiDexEnabled true
    minSdkVersion 16
    targetSdkVersion 25
    versionCode 1
    versionName "1.0"
    ndk {
        abiFilters "armeabi-v7a", "x86"
    }
}
...
```

Remove `pspdfkit-lib` folder in `YourApp/android/`.  
 In `YourApp/android/settings.gradle` remove the old reference to `pspdfkit-lib` (note **one** place to edit):

```diff
 project(':react-native-pspdfkit').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-pspdfkit/android')
 include ':app'
-include ':pspdfkit-lib'
```

##### Migrate from PSPDFKit version 3.3.3 to 4.0.x

After launching `yarn upgrade`, apply [step 6](#step-6), [step 8](#step-8) and [step 10](#step-10) from [Getting Started](#getting-started-1) section.  
Enable MultiDex in `YourApp/android/app/build.gradle` (note **four** place to edit):

```diff
...
android {
-   compileSdkVersion 25
+   compileSdkVersion 26
-   buildToolsVersion "25.0.2"
+   buildToolsVersion "26.0.1"

defaultConfig {
    applicationId "com.yourapp"
    multiDexEnabled true
-   minSdkVersion 16
+   minSdkVersion 19
-   targetSdkVersion 25
+   targetSdkVersion 26
    versionCode 1
    versionName "1.0"
    ndk {
        abiFilters "armeabi-v7a", "x86"
    }
}
...
```

#### API

##### Constants

The following constants are available on the PSPDFKit export:

- `versionString` (`String`) PSPDFKit version number.

##### `present(document : string, configuration : readable map) : void`

Shows the pdf `document` from the local device filesystem, or your app's assets.

- `file:///sdcard/document.pdf` will open the document from local device filesystem.
- `file:///android_asset/document.pdf` will open the document from your app's assets.

`configuration` can be empty `{}`.

### Windows UWP

#### Requirements

- Visual Studio Community 2017 or greater
- git
- cmake
- yarn
- PSPDFKit for Windows.vsix (installed)
- PowerShell

#### Getting Started

Let's create a simple app that integrates PSPDFKit and uses the react-native-pspdfkit module.

1. Open `PowerShell` as administrator.
2. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`.
3. Install Windows Tool for React Native: `yarn add global windows-build-tools`.
4. Open `x64 Native Tools Command Prompt for VS 2017` program.
5. Create the app with `react-native init --version=0.59.10 YourApp` in a location of your choice.
6. Step into your newly created app folder: `cd YourApp`.
7. Install the Windows helper plugin: `yarn add --dev rnpm-plugin-windows`.
8. Install `react-native-pspdfkit` from GitHub: `yarn add github:PSPDFKit/react-native#windows-support`.
9. Install `react-native-fs` from GitHub: `yarn add react-native-fs@2.14.1`.
10. Install all modules for Windows: `yarn install`. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
11. Initialize the windows project: `react-native windows`.
12. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit`.
13. Link module `react-native-fs`: `react-native link react-native-fs`.
14. Open the Visual Studio solution in `react-native\YourApp\windows`.
15. Accept and install any required extensions when prompted.
16. If the settings window opens, click on `Developer` and select `yes`.
17. Remove RNFS.NET46 project and add RNFS which supports UWP.
    Right click on `RNFS.NET46` -> Remove -> Ok.
    Right click on `Solution 'YourApp'` -> `Add` -> `Existing Project...` -> Navigate to `YourApp\node_modules\react-native-fs\windows\RNFS` and open `RNFS.csproj` 
18. Mark `PSPDFKit SDK`,`RNFS` and `Visual C++ Runtime` as dependencies for `YourApp`:
    Right click on `YourApp` -> Add -> Refererece... Click on Universal Windows -> Extensions and tick `PSPDFKit for UWP` and `Visual C++ 2015 Runtime for Universal Windows Platform Apps`, Click on Projects -> Tick `RNFS` then click ok.
    ![Add References Selection](screenshots/windowsAddReferences.PNG)
    ![Reference Checkboxes](screenshots/windowsSelectPSPDFKit+UWP.PNG)
19. Add an application resource to your `Appl.xaml` to reference your License key.

```diff
<rn:ReactApplication
    x:Class="Catalog.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:rn="using:ReactNative"
    RequestedTheme="Light">

+	<Application.Resources>
+		<ResourceDictionary>
+			<ResourceDictionary.MergedDictionaries>
+				<ResourceDictionary Source="License.xaml"/>
+			</ResourceDictionary.MergedDictionaries>
+		</ResourceDictionary>
+	</Application.Resources>

</rn:ReactApplication>
```

20. Create a new file resource called `License.xaml` with your PSPDFKit license key at the top level of the
    project. (Replace `ENTER LICENSE KEY HERE` with your key)

```xaml
<ResourceDictionary
	xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
	xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

	<x:String x:Key="PSPDFKitLicense">ENTER LICENSE KEY HERE</x:String>

</ResourceDictionary>
```

21. Change the Package Name of the application to match the bundle ID you registered with PSPDFKit. More details on this can be found in https://pspdfkit.com/guides/windows/current/faq/what-is-a-bundle-id/.
22. Change the target SDK of YourApp to >= 10.0.17134 and Min Version to >= 10.0.16299 : Right Click on YourApp -> Properties. Go to
    Application and change Target Version to >= 10.0.17134 and change Min Version to >= 10.0.16299.
    ![Change SDK Version](screenshots/changeVersionSDK.png)
23. Save Changes: File -> Save All
24. Add the `PSPDFKitView` and `PSPDFKit` module into your `App.windows.js` file, located at the base of `YourApp` folder, and add a open button to allow the user to navigate the file system.

```javascript
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  NativeModules,
  Button
} from "react-native";

var PSPDFKitView = require("react-native-pspdfkit");
var PSPDFKit = NativeModules.ReactPSPDFKit;

import {YellowBox} from "react-native";

YellowBox.ignoreWarnings([
  "Warning: Failed prop type: Invalid prop `accessibilityStates[0]`"
]);

export default class Catalog extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.page}>
        <PSPDFKitView ref="pdfView" style={styles.pdfView} />
        <View style={styles.footer}>
          <View style={styles.button}>
            <Button onPress={() => PSPDFKit.OpenFilePicker()} title="Open" />
          </View>
          <Text style={styles.version}>
            SDK Version : {PSPDFKit.versionString}
          </Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#eee"
  },
  pdfView: {
    flex: 1
  },
  button: {
    width: 100,
    margin: 20
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  version: {
    color: "#666666",
    margin: 20
  }
});
```

25. Now start the server on the command line: `react-native start`.
26. Press Yes when PowerShell wants to run.
27. Type 'y' when asking if you want to install the certificate.
28. Run the catalog project from Visual Studio by clicking `Local Machine` towards the top of the window. (Ensure x64 or x86 is selected)

#### Running Catalog Project

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. From the command promt `cd react-native\samples\Catalog`.
3. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`.
4. run `yarn install`. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
5. Open the UWP catalog solution in `react-native\samples\Catalog\windows`.
6. Accept and install any required extensions when prompted.
7. If the settings windows opens, click on `Developer` and selected `yes`.
8. Create a new file resouce called `License.xaml` with your PSPDFKit license key at the top level of the project. (Replace `ENTER LICENSE KEY HERE` with your key)

```xaml
	<ResourceDictionary
		xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
		xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

	  <x:String x:Key="PSPDFKitLicense">ENTER LICENSE KEY HERE</x:String>

	</ResourceDictionary>
```

9. From the command prompt run `react-native run-windows`.
10. Enter `y` to accept the certificate when prompted and allow socket access for reactive when prompted.
    (Note: On windows yarn does not link correctly, therefore any changes made in the ReactNativePSPDFKit project will have to be manually copied to the `windows` folder at the base of the repo in order to commit changes.)

#### API

##### Constants

The following constants are available on the PSPDFKit export:

- `versionString` (`String`) PSPDFKit version number.

##### `OpenFilePicker() : void`

Opens a file picker for the user to select a pdf from. When the user selects an item it will be displayed in the `<PSPDFKitView>`.

##### `Present(document : string) : void`

Opens a document in the available `<PSPDFKitView>`. If the element is not displayed `Present` will fail. The document has to be accessible by the application, for example needs to be located in the application assets.

```javascript
PSPDFKit.Present("ms-appx:///Assets/pdf/Business Report.pdf");
```

#### Theming support

It is possible to theme/customize the PdfView with the use of a CSS file. To do this simple pass a `Uri` within the web context to the instantiated [`PSPDFKitPackage`](https://github.com/PSPDFKit/react-native/blob/master/windows/ReactNativePSPDFKit/ReactNativePSPDFKit/PSPDFKitPackage.cs#L32).

To see this in action, make the following changes in [`samples/Catalog/windows/Catalog/MainReactNativeHost.cs`](https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/windows/Catalog/MainReactNativeHost.cs) and run the catalog the catalog.

```diff
protected override List<IReactPackage> Packages => new List<IReactPackage>
{
    new MainReactPackage(),
-   new ReactNativePSPDFKit.PSPDFKitPackage(),
+   new ReactNativePSPDFKit.PSPDFKitPackage(new Uri("ms-appx-web:///Assets/css/greenTheme.css")),
    new RNFSPackage()
};
```

The code above will pass an asset held in the `Catalog` project's `Assets/css` to the web context of PSPDFKit for Windows. The file can then be used to theme the view.

For more information on CSS Customization in PSPDFKit for Windows please refer to [CSS Customization](https://pspdfkit.com/guides/windows/current/customizing-the-interface/css-customization/)

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2019 PSPDFKit GmbH.

See LICENSE for details.

## Contributing

Please ensure [you signed our CLA](https://pspdfkit.com/guides/web/current/miscellaneous/contributing/) so we can accept your contributions.
