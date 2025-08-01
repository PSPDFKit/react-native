## Catalog

The project contains a large set of sample code, which illustrates how to set up and customize Nutrient for various use cases. You can run the Catalog app on Android and iOS.

### Running the Catalog on Android

#### Requirements

- A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI).
- The [latest stable version of Android Studio](https://developer.android.com/studio).
- The [Android NDK](https://developer.android.com/studio/projects/install-ndk).
- An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds.html) or a hardware device.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`
2. Step into the Catalog project's directory: `cd react-native/samples/Catalog`
3. Install dependencies: `yarn install`
4. The Catalog app is now ready to launch: `react-native run-android`

### Running the Catalog on iOS

#### Requirements

- A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI).
- The latest [stable version of Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12).
- The [latest stable version of CocoaPods](https://github.com/CocoaPods/CocoaPods/releases). If you don’t already have CocoaPods installed, follow the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#installation) to install CocoaPods on your Mac.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`
2. Step into the Catalog project's directory: `cd react-native/samples/Catalog`
3. Install dependencies: `yarn install`
4. Go to the iOS folder: `cd iOS`
5. Install the iOS pods: `pod install`
6. Go back to the Catalog directory: `cd ..`
7. The Catalog app is now ready to launch: `react-native run-ios`

### Troubleshooting

**Note:** If you get an error about `config.h` not being found check out [this blog post](https://tuntunir.blogspot.com/2018/02/react-native-fatal-error-configh-file.html) for information on how to fix it.
