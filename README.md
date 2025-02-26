# Nutrient React Native SDK

![Nutrient React Native SDK](https://github.com/PSPDFKit/react-native/blob/master/article-header.png?raw=true)

This library requires a valid license of the Nutrient SDK. Licenses are per platform.

The Nutrient React Native SDK exposes the most often used APIs from Nutrient. Many of our partners end up forking this repository and adding some custom code to achieve even greater integration with their products, using native code.

Windows is not currently supported, please use version [1.24.9](https://github.com/PSPDFKit/react-native/releases/tag/1.24.9) instead.

### Nutrient

The [Nutrient SDK](https://nutrient.io/) is a framework that allows you to view, annotate, sign, and fill PDF forms on iOS, Android, Windows, macOS, and Web.

[Nutrient Collaboration ](https://www.nutrient.io/sdk/solutions/collaboration) adds real-time collaboration features to seamlessly share, edit, and annotate PDF documents.

# Support, Issues and License Questions

Nutrient offers support for customers with an active SDK license via https://support.nutrient.io/hc/en-us/requests/new.

Are you evaluating our SDK? That's great, we're happy to help out! The Nutrient React Native  SDK is a commercial product and requires the purchase of a license key when used in production. By default, this library will initialize in demo mode, placing a watermark on each PDF and limiting usage to 60 minutes.

To purchase a license for production use, please reach out to us via https://www.nutrient.io/sdk/contact-sales.

To initialize the Nutrient React Native SDK using a license key, call either of the following before using any other Nutrient SDK APIs or features:

To set the license key for both Android and iOS, use:

```
PSPDFKit.setLicenseKeys('YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE', 'YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE');
```

To set the license key for the currently running platform, use:

```
PSPDFKit.setLicenseKey('YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE');
```

### Requirements

- A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI. If you’re using Expo, [check out our blog post](https://www.nutrient.io/blog/how-to-use-pspdfkit-for-react-native-with-expo/) on the topic.

#### iOS

- The [latest stable version of Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
- The [latest stable version of CocoaPods](https://github.com/CocoaPods/CocoaPods/releases). If you don’t already have CocoaPods installed, follow the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#installation) to install CocoaPods on your Mac.

#### Android

- The [latest stable version of Android Studio](https://developer.android.com/studio)
- The [Android NDK](https://developer.android.com/studio/projects/install-ndk)
- An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds.html) or a hardware device

### Installation

The Nutrient React Native SDK dependency is installed from the GitHub repository and not the `npm` registry. To install the Nutrient React Native SDK, run `yarn add react-native-pspdfkit@github:PSPDFKit/react-native` in your project directory or `npm install github:PSPDFKit/react-native` if you’re using `npm`.

### Getting Started

See our [Getting Started on React Native guide](https://www.nutrient.io/getting-started/react-native/?react-native-platform=android-ios&project=new-project) to integrate the SDK into your new or existing application, or follow the steps below:

1. In the terminal app, change the current working directory to the location you wish to save your project. In this example, we’ll use the `~/Documents` directory:

   ```bash
   cd ~/Documents
   ```

1. Create the React Native project by running the following command:

   ```bash
   npx react-native init PSPDFKitDemo
   ```

1. In the terminal app, change the location of the current working directory inside the newly created project:

   ```bash
   cd PSPDFKitDemo
   ```

1. Add the Nutrient React Native SDK:

   ```bash
   yarn add react-native-pspdfkit@github:PSPDFKit/react-native
   ```

1. Install all the dependencies for the project:

   ```bash
   yarn install
   ```

1. Open your project's `build.gradle` file:

   ```bash
   open android/build.gradle
   ```

1. Add the Nutrient repository to download the Nutrient SDK:

    ```diff
      allprojects {
        repositories {
          mavenLocal()
    +       maven {
    +         url 'https://my.nutrient.io/maven/'
    +       }
        }
      }
    ```

1. Open the app’s build.gradle file:

    ```diff
    ...
      android {
    -  compileSdkVersion rootProject.ext.compileSdkVersion
    +  compileSdkVersion 35
    ...
      defaultConfig {
        applicationId "com.pspdfkitdemo"
    -     minSdkVersion rootProject.ext.minSdkVersion
    +     minSdkVersion 21
          targetSdkVersion rootProject.ext.targetSdkVersion
          versionCode 1
          versionName "1.0"
      }
    }
    ...
    ```

1. Open your project’s Podfile:

   ```bash
   open ios/Podfile
   ```

1. Update the minimum iOS platform version in the Podfile:

    ```diff
    ...
    - platform :ios, min_ios_version_supported
    + platform :ios, '16.0'
    ...
    ```

1. Change the location of the current working directory to the `ios` folder:

   ```bash
   cd ios
   ```

1. Install the CocoaPods dependencies:

   ```bash
   pod install
   ```

1. Open your project’s Workspace in Xcode:

   ```bash
   open PSPDFKitDemo.xcworkspace
   ```

1. Make sure the deployment target is set to 16.0 or higher:

   ![deployment-target](./screenshots/deployment-target.png)

1. Change View controller-based status bar appearance to `YES` in your project’s `Info.plist`:

   ![view-controller-based-status-bar-appearance](./screenshots/view-controller-based-status-bar-appearance.png)

1. Add the PDF document you want to display to your application by dragging it into your project. On the dialog that’s displayed, select Finish to accept the default integration options. You can use <a href="https://www.nutrient.io/downloads/pspdfkit-ios-quickstart-guide.pdf" download="Document.pdf">this QuickStart Guide PDF</a> as an example.

   ![drag-and-drop-document](./screenshots/drag-and-drop-document.png)

1. Change the location of the current working directory back to the root project folder:

   ```bash
   cd ..
   ```

1. Create the `assets` directory:

   ```bash
   mkdir android/app/src/main/assets
   ```

1. Copy a PDF document into your Android assets directory:

   ```bash
   cp ~/Downloads/Document.pdf android/app/src/main/assets/Document.pdf
   ```

1. Open your `App.tsx` file:

   ```bash
   open App.tsx
   ```

1. Replace the entire contents of `App.tsx` with the following code snippet:

    ```typescript
    import React, {Component} from 'react';
    import {Platform} from 'react-native';
    import PSPDFKitView from 'react-native-pspdfkit';
    import { NativeModules } from 'react-native';

    const PSPDFKit = NativeModules.PSPDFKit;
    PSPDFKit.setLicenseKey(null);

    const DOCUMENT =
      Platform.OS === 'ios' ? 'Document.pdf' : 'file:///android_asset/Document.pdf';
    export default class PSPDFKitDemo extends Component<{}> {
      render() {
        var pdfRef: React.RefObject<PSPDFKitView> = React.createRef();
        return (
          <PSPDFKitView
            document={DOCUMENT}
            configuration={{
              showThumbnailBar: 'scrollable',
              pageTransition: 'scrollContinuous',
              scrollDirection: 'vertical',
            }}
            ref={pdfRef}
            fragmentTag="PDF1"
            style={{flex: 1}}
          />
        );
      }
    }
    ```

1. The app is now ready to launch! Go back to the terminal app and run:

   ```bash
   react-native run-ios
   ```

   ```bash
   react-native run-android
   ```

### Running the example Catalog application

Take a look at the instructions to get started [here](/samples/Catalog/README.md#running-this-sample-on-ios) for iOS and [here](/samples/Catalog/README.md#running-this-sample-on-android) for Android.

### Configuration

The behaviour of the `PSPDFKitView` component can be customized using the configuration object. Refer to the [`PDFConfiguration`](https://www.nutrient.io/api/react-native/PDFConfiguration.html) API documentation. The `PDFConfiguration` object can be passed as parameter in when creating the `PSPDFKitView` component, or when using the `PSPDFKit.present()` Native Module API.

```typescript
const configuration: PDFConfiguration = {
  showPageLabels: false,
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical',
  showThumbnailBar: 'scrollable'
};
```

## Updates

Some releases contain changes that require updates to your project settings or application code. Take a look at our [Upgrade and Migration guides](https://www.nutrient.io/guides/react-native/upgrade/) after updating your Nutrient React Native SDK dependency.

# Troubleshooting

For Troubleshooting common issues you might encounter when setting up the Nutrient React Native SDK, please refer to the [Troubleshooting](https://www.nutrient.io/guides/react-native/troubleshoot/) section.

## License

This project can be used for evaluation or if you have a valid Nutrient license.
All items and source code Copyright © 2010-2025 PSPDFKit GmbH.

See [LICENSE](./LICENSE) for details.
