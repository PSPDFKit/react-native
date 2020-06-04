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
2. Install dependencies: run `yarn install` from the `samples/NativeCatalog` directory.
3. `cd ios` then run `pod install`.
4. The Native Catalog app is now ready to launch. From `samples/NativeCatalog` directory run `react-native run-ios`.

### Examples

#### Manual Signing

This example shows you how to use the `SignaturePickerFragment` and `SignatureSignerDialog` on Android and `PSPDFSignatureViewController` on iOS to digitally sign a document after a react button was pressed. The relevant part is the `performInkSigning` method in the `CustomPdfViewManager` on Android and `-[CustomPDFView startSigning]` on iOS.

#### Watermark

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.

#### Watermark on Startup

This example shows you how to use the `PdfProcessor` on Android and `PSPDFRenderDrawBlock` on iOS to put a watermark on the currently displayed document on startup, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager` and `-[CustomPDFViewcreateWatermarkAndReloadData:]` on iOS.

#### Instant Example

In this example, we bridged the native iOS Instant example from [PSPDFKit Catalog](https://pspdfkit.com/guides/ios/current/getting-started/example-projects/#pspdfcatalog) over to React Natice.