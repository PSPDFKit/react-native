## PSPDFKit for React Native

### iOS

#### Requirements
- Xcode 8.2.1
- PSPDFKit >=6.4
- react-native >= 0.41.2

#### Getting Started

Lets create a simple app that integrates `PSPDFKit.framework` and uses the `react-native-pspdfkit` module.

1. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`
2. Create the app with `react-native init YourApp`.
3. Step into your newly created app folder: `cd YourApp`
4. Install `react-native-pspdfkit` from GitHub: `yarn add github:PSPDFKit/react-native`
5. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit` 
6. Create the folder `ios/PSPDFKit` and copy `PSPDFKit.framework` into it.
7. Open `ios/YourApp.xcodeproj` in Xcode: `open ios/YourApp.xcodeproj`
8. Make sure the deployment target is set to 9.0 or higher:
![Deployment Target](screenshots/deployment-target.png)
9. Change "View controller-based status bar appearance" to `YES` in `Info.plist`:
![View Controller-Based Status Bar Appearance](screenshots/view-controller-based-status-bar-appearance.png)
10. Open `node_modules/react-native-pspdfkit/ios` and drag and drop `RCTPSPDFKit.xcodproj` into the YourApp Xcode project:
![Project Dependency](screenshots/project-dependency.png)
11. Link with the `libRCTPSPDFKit.a` static library:
![Linking Static Library](screenshots/linking-static-library.png)
12. Embed `PSPDFKit.framework` by drag and dropping it into the "Embedded Binaries" section of the "YourApp" target (Select "Create groups"). This will also add it to the "Linked Framworks and Libraries" section:
![Embedding PSPDFKit](screenshots/embedding-pspdfkit.png)
13. Add a PDF by drag and dropping it into your Xcode project (Select "Create groups" and add to target "YourApp"). This will add the document to the "Copy Bundle Resources" build phase:
![Adding PDF](screenshots/adding-pdf.png)
14. Replace the default component from `index.ios.js` with a simple touch area to present the bundled PDF:

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
```

Your app is now ready to launch. Run the app in Xcode or type `react-native run-ios` in the terminal.

#### Configuration

You can configure the presentation with a configuration dictionary which is a mirror of the [`PSPDFConfiguration`](https://pspdfkit.com/api/ios/Classes/PSPDFConfiguration.html) class.

Example:

```javascript
PSPDFKit.present('document.pdf', {
  thumbnailBarMode: 'scrollable',
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical'
})
```
  
#### Running Catalog Project

- Copy `PSPDFKit.framework` into the `PSPDFKit` directory.
- Install dependencies: `yarn install` in `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
- Run the app with `react-native-cli`: `react-native run-ios`

### Android

#### Requirements

- Android SDK
- Android Build Tools 23.0.1 (React Native)
- Android Build Tools 25.0.2 (PSPDFKit module)
- PSPDFKit >= 3.0.0
- react-native >= 0.41.2

#### Getting Started

Let's create a simple app that integrates PSPDFKit and uses the react-native-pspdfkit module.

1. Make sure `react-native-cli` is installed: `yarn global add react-native-cli`
2. Create the app with `react-native init YourApp`.
3. Step into your newly created app folder: `cd YourApp`.
4. Install `react-native-pspdfkit` from GitHub: `yarn add github:PSPDFKit/react-native`.
5. Link module `react-native-pspdfkit`: `react-native link react-native-pspdfkit`.
6. Add PSPDFKit repository to `YourApp/android/build.gradle` so PSPDFKit library can be downloaded:

  ```diff
    allprojects {
        repositories {
            mavenLocal()
            jcenter()
  +         maven {
  +             url 'https://customers.pspdfkit.com/maven/'

  +             credentials {
  +                 username 'pspdfkit'
  +                 password 'YOUR_MAVEN_KEY_GOES_HERE'
  +             }
  +         }
            maven {
                // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                url "$rootDir/../node_modules/react-native/android"
            }
        }
    }
  ```

7. PSPDFKit targets modern platforms, so you'll have to update `compileSdkVersion` and `targetSdkVersion` to at least API 25 (note **three** places to edit):
    
   ```diff
   ...
   android {
   -   compileSdkVersion 23
   +   compileSdkVersion 25
   -   buildToolsVersion "23.0.1"
   +   buildToolsVersion "25.0.2" 

   defaultConfig {
       applicationId "com.yourapp"
       minSdkVersion 16
   -   targetSdkVersion 22
   +   targetSdkVersion 25
       versionCode 1
       versionName "1.0"
       ndk {
           abiFilters "armeabi-v7a", "x86"
       }
   }
   ...
   ```
     
8. Enter your PSPDFKit license key into `YourApp/android/app/src/main/AndroidManifest.xml` file: 

  ```diff
     <application>
        ...

  +      <meta-data
  +          android:name="pspdfkit_license_key"
  +          android:value="YOUR_LICENSE_KEY_GOES_HERE"/>

     </application> 
  ```

9. Set primary color. In `YourApp/android/app/src/main/res/values/styles.xml` replace
  ```xml    
<!-- Customize your theme here. -->
  ```
with
  ```xml    
<item name="colorPrimary">#3C97C9</item>
  ```     
10. Replace the default component from `YourApp/index.android.js` with a simple touch area to present a PDF document from the local device filesystem:
        
   ```javascript
   import React, { Component } from 'react';
   import {
     AppRegistry,
     StyleSheet,
     NativeModules,
     Text,
     TouchableHighlight,
     View,
     PermissionsAndroid
   } from 'react-native';
	
   var PSPDFKit = NativeModules.PSPDFKit;
	
   const DOCUMENT = "file:///sdcard/document.pdf";
   const LICENSE = "LICENSE_KEY_GOES_HERE";
   const CONFIGURATION = {
     scrollContinuously : false,
     showPageNumberOverlay : true,
     pageScrollDirection : "vertical"
   };
	
   // Change 'YourApp' to your app's name.
   class YourApp extends Component {
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
       )
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         console.log("Write external storage permission granted")
         PSPDFKit.present(DOCUMENT, CONFIGURATION);
       } else {
         console.log("Write external storage permission denied")
       }
     } catch (err) {
       console.warn(err)
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
11. Before launching the app you need to copy a PDF document onto your development device or emulator.

	```bash
	adb push /path/to/your/document.pdf /sdcard/document.pdf
	```

12. Your app is now ready to launch.  From `YourApp` directory run `react-native run-android`.

	```bash
	react-native run-android
	```

#### Running Catalog Project

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. Install dependencies: run `yarn install` from `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
3. Add your customer portal password to `samples/Catalog/build.gradle`:

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
	startPage : 3,
	scrollContinuously : false,
	showPageNumberOverlay : true,
	grayScale : true,
	showPageLabels : false,
	pageScrollDirection : "vertical"
};
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

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2017 PSPDFKit GmbH.

See LICENSE for details.
