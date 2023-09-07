## Native Catalog

This second Catalog example serves to show you how you can leverage `PdfView` (Android) and `PSPDFViewController` (iOS) in your own view manager to provide more advanced integrations with PSPDFKit while still using React Native where possible.

### Running this Sample on Android

#### Requirements

- A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI).
- The [latest stable version of Android Studio](https://developer.android.com/studio).
- The [Android NDK](https://developer.android.com/studio/projects/install-ndk).
- An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds.html) or a hardware device.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`
2. Step into the NativeCatalog project's directory: `cd react-native/samples/NativeCatalog `
3. Install dependencies: `yarn install`
4. The NativeCatalog app is now ready to launch: `react-native run-android`

### Running this Sample on iOS

- A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI).
- The latest [stable version of Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12).
- The [latest stable version of CocoaPods](https://github.com/CocoaPods/CocoaPods/releases). If you don’t already have CocoaPods installed, follow the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#installation) to install CocoaPods on your Mac.

#### Getting Started

1. Clone the repository: `git clone https://github.com/PSPDFKit/react-native.git`
2. Step into the NativeCatalog project's directory: `cd react-native/samples/NativeCatalog `
3. Install dependencies: `yarn install`
4. Go to the iOS folder: `cd iOS`
5. Install the iOS pods: `pod install`
6. Go back to the NativeCatalog directory: `cd ..`
7. The NativeCatalog app is now ready to launch: `react-native run-ios`

### Examples

#### Manual Signing

This example shows you how to use the `SignaturePickerFragment` and `SignatureSignerDialog` on Android and `PSPDFSignatureViewController` on iOS to digitally sign a document after a react button was pressed. The relevant part is the `performInkSigning` method in the `CustomPdfViewManager` on Android and `-[CustomPDFView startSigning]` on iOS.

#### Watermark

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.

#### Watermark on Startup

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document on startup, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.

#### Default Annotation Settings (Android only)

This example shows you how to change the default settings of the ink annotation when displaying a PDF file.

#### Instant Example (iOS only)

In this example, we bridged the native iOS Instant example from [PSPDFKit Catalog](https://pspdfkit.com/guides/ios/current/getting-started/example-projects/#pspdfcatalog) over to React Native.
