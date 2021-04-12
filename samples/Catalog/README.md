## Catalog

The project contains a large set of code examples, which illustrate how to set up and customize PSPDFKit for various use cases. You can run the Catalog app on Android and iOS.

### Running the Catalog on Android

#### Requirements

- Android SDK
- Android NDK
- Android Build Tools 23.0.1 (React Native)
- Android Build Tools 28.0.3 (PSPDFKit module)
- Android Gradle plugin >= 3.4.1
- PSPDFKit >= 6.6.0
- react-native >= 0.63.2

#### Getting Started

1. Clone the repository. `git clone https://github.com/PSPDFKit/react-native.git`.
2. Install dependencies: run `yarn install` from `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
3. Update license key in `samples/Catalog/android/app/src/main/AndroidManifest.xml`:

```xml
   <application>
      ...

      <meta-data
          android:name="pspdfkit_license_key"
          android:value="YOUR_LICENSE_KEY_GOES_HERE"/>

   </application>
```

4. Catalog app is now ready to launch. From `samples/Catalog` directory run `react-native run-android`.

### Running the Catalog on iOS

#### Requirements

- The latest [Xcode](https://developer.apple.com/xcode/).
- PSPDFKit 10.2.1 for iOS or later
- react-native >= 0.63.4
- CocoaPods >= 1.10.1

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`.
2. Step into your newly cloned folder: `cd react-native` and create a new `PSPDFKit` directory: `mkdir PSPDFKit`.
3. [Download the latest version of PSPDFKit for iOS](https://customers.pspdfkit.com/download/binary/ios/latest) and mount the DMG file.
4. Copy `PSPDFKit.xcframework` and `PSPDFKitUI.xcframework` into the `PSPDFKit` directory.
5. Install dependencies: `yarn install` in `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
6. Run the app with `react-native-cli`: `react-native run-ios`

**Note:** If you get an error about `config.h` not being found check out [this blog post](https://tuntunir.blogspot.com/2018/02/react-native-fatal-error-configh-file.html) for information on how to fix it.
