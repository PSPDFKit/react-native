## Native Catalog (Android)

This second, Android only, Catalog example serves to show you how you can leverage the `PdfView` in your own view manager to provide more advanced integrations with PSPDFKit while still using react-native where possible.

### Running this Sample

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

4. Native Catalog app is now ready to launch. From `samples/NativeCatalog` directory run `react-native run-android`.

### Examples

#### Manual Signing

This example shows you how to use the `SignaturePickerFragment` and `SignatureSignerDialog` to digitally sign a document after a react button was pressed. The relevant part is the `performInkSigning` method in the `CustomPdfViewManager`.

#### Watermark

This example shows you how to use the `PdfProcessor` to put a watermark on the currently displayed document, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager`.