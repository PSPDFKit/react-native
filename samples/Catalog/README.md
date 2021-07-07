## Catalog

The project contains a large set of sample code, which illustrates how to set up and customize PSPDFKit for various use cases. You can run the Catalog app on Android and iOS.

### Running the Catalog on Android

#### Requirements

- The [latest stable version of Android Studio](https://developer.android.com/studio).
- The [Android NDK](https://developer.android.com/studio/projects/install-ndk).
- An [Android Virtual Device](Android Virtual Device) or a hardware device.
- React Native 0.60.4.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`.
2. Step into the Catalog project's directory: `cd react-native/samples/Catalog`
3. Install dependencies: run `yarn install`.
4. [Start your emulator](https://developer.android.com/studio/run/emulator#runningemulator).
5. Start the Metro bundler by running `react-native start`.
6. Catalog app is now ready to launch. From `samples/Catalog` directory run `react-native run-android`.

### Running the Catalog on iOS

#### Requirements

- The latest [Xcode](https://developer.apple.com/xcode/).
- the latest version of PSPDFKit for iOS.
- React Native 0.60.4.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`.
2. Step into your newly cloned folder: `cd react-native`  
3. Create a new `PSPDFKit` directory: `mkdir PSPDFKit`.
4. [Download the latest version of PSPDFKit for iOS](https://customers.pspdfkit.com/download/binary/ios/latest) and mount the DMG file.
5. Copy `PSPDFKit.xcframework` and `PSPDFKitUI.xcframework` into the `PSPDFKit` directory.
6. Step into the Catalog project's directory: `cd /samples/Catalog`
7. Install dependencies: `yarn install` in `samples/Catalog` directory. (Because of a [bug](https://github.com/yarnpkg/yarn/issues/2165) you may need to clean `yarn`'s cache with `yarn cache clean` before.)
8. Start the Metro bundler by running `react-native start`
9. Run the app with `react-native-cli`: `react-native run-ios`

### Troubleshooting

**Note:** If you get an error about `config.h` not being found check out [this blog post](https://tuntunir.blogspot.com/2018/02/react-native-fatal-error-configh-file.html) for information on how to fix it.
