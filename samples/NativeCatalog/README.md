## Native Catalog (Android)

This second, Android only, Catalog example serves to show you how you can leverage the `PdfView` in your own view manager to provide more advanced integrations with PSPDFKit while still using react-native where possible.

### Examples

#### Manual Signing

This example shows you how to use the `SignaturePickerFragment` and `SignatureSignerDialog` to digitally sign a document after a react button was pressed. The relevant part is the `performInkSigning` method in the `CustomPdfViewManager`.

#### Watermark

This example shows you how to use the `PdfProcessor` to put a watermark on the currently displayed document, save it to a new path, and display it. The relevant part is the `performWatermarking` method in the `CustomPdfViewManager`.