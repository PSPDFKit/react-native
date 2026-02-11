## 4.2.0 — 11 Feb 2026

- Removes the deprecated Annotation APIs from the `NutrientView` namespace, since they are available on `PDFDocument`. (J#HYB-945)
- Adds the `enterContentEditingMode` API to `NutrientView` to enter content editing mode programmatically. (J#HYB-943)
- Adds the `CONTENT_EDITING_BUTTON_ITEM` option to the list of available Toolbar buttons. (J#HYB-943)
- Updates for Nutrient Android SDK 11.0.0.

## 4.1.0 — 30 Jan 2026

- Adds the `updateAnnotations` API to `PDFDocument` to update existing annotation properties. (J#HYB-828)
- Adds the `setUserInterfaceVisible` API to `NutrientView` to toggle the visibility of the user interface controls. (J#HYB-923)
- Adds the `toolbarPosition` and `supportedToolbarPositions` options to the `PDFConfiguration` object to control the annotation toolbar position. (J#HYB-922)
- Adds the `addTextFormField` and `addElectronicSignatureFormField` APIs to support programmatic form field creation. (J#HYB-924)
- Updates the base `Annotation` model to expose the `group` property to control annotation grouping. (J#HYB-889)
- Updates for Nutrient Android SDK 10.10.1.
- Updates for Nutrient iOS SDK 26.4.0.
- Fixes an issue where the `RemoteDocumentConfiguration` wasn’t being applied on iOS when opening a remote document. (J#HYB-939)

## 4.0.1 — 28 Nov 2025

- Fixes an issue where the `setLicenseKeys` API could throw an error on iOS. (J#HYB-916)

## 4.0.0 — 20 Nov 2025

- Adds support for React Native’s new architecture. (J#HYB-847)
- Updates the `onDocumentLoadFailed` and `DocumentEvent.LOAD_FAILED` events to include a reason code and message. (J#HYB-903)
- Updates for Nutrient Android SDK 10.8.0.
- Updates for Nutrient iOS SDK 26.2.0.

## 3.2.0 — 20 Oct 2025

- Adds the page size to the existing `getPageInfo` API call. (J#HYB-888)
- Adds the `androidEnableStylusOnDetection` option to the `PDFConfiguration` object to control stylus detection on Android. (J#HYB-893)
- Updates for Nutrient Android SDK 10.7.0.
- Updates for Nutrient iOS SDK 26.1.0.
- Fixes image annotations being incorrectly placed when added on pages with a rotation or crop box. (J#IOS-767)
- Fixes an issue where the `presentInstant` API call would never resolve its promise on iOS. (J#HYB-894)
- Fixes an issue where the `onDocumentLoadFailed` callback wasn’t triggered for invalid documents on iOS. (J#HYB-885)

## 3.1.1 - 19 Sep 2025

- Fixes an issue where the `setLicenseKey` API didn’t run synchronously on Android. (J#HYB-881)
- Fixes an issue where the `FormFieldEvent.VALUES_UPDATED` event returned incomplete objects. (J#HYB-884)

## 3.1.0 - 10 Sep 2025

- Adds the `getOverlappingSignature` API to `SignatureFormElement` objects to retrieve overlapping signature annotations. (J#HYB-867)
- Updates `BookmarksEvent.CHANGED` to include entire `Bookmark` objects. (J#HYB-832)
- Updates the `SignatureFormElement` object to only include `SignatureInfo` when the Electronic Signatures license feature is present. (J#HYB-862)
- Updates to Nutrient iOS SDK 14.12.0.
- Fixes inconsistent behavior between iOS and Android for the `updateChoiceFormFieldValue` API. (J#HYB-873)
- Fixes an issue where the `updateFormField` APIs on Android used the `fieldName` rather than `fullyQualifiedName` as a reference. (J#HYB-869)
- Fixes an issue where certain `FormElement` properties were parsed incorrectly during the `getFormElements` API call. (J#HYB-858)
- Fixes an issue where calling `unsubscribeAllEvents` would result in all `NotificationCenter` listeners being removed on all active `NutrientView` instances. (J#HYB-866)
- Fixes an issue where `NotificationCenter` would deliver duplicate events if multiple `NutrientView` instances are active. (J#HYB-866)
- Fixes an issue where the `readerViewButtonItem` wasn’t being applied correctly on Android. (J#HYB-878)

## 3.0.1 - 01 Aug 2025

- Updates README.md with Nutrient rebranding changes. (J#HG-681)

## 3.0.0 - 01 Aug 2025

_[Migration guide](https://www.nutrient.io/guides/react-native/migration-guides/react-native-3-migration-guide/)._

- Adds the `onReady` callback to `NutrientView` to make functional component integration easier. (J#HYB-809)
- Updates SDK to Nutrient branding. The new package name is now `@nutrient-sdk/react-native`. (J#HG-681)
- Updates to Nutrient Android SDK 10.5.0.
- Updates to Nutrient iOS SDK 14.11.0.

## 2.19.1 - 24 Jul 2025

- Fixes an issue where `PSPDFKitView` component props weren’t reliably applied on Android. (J#HYB-836)

## 2.19.0 - 02 Jul 2025

- Adds the `androidRemoveStatusBarOffset` property to the `PDFConfiguration` object on Android. (J#HYB-802)
- Adds the `iOSFileConflictResolution` option to `PDFConfiguration` to manage file conflict resolution on iOS. (J#HYB-825)
- Adds the `iOSDocumentInfoOptions` option to `PDFConfiguration` to customize Document Info tabs on iOS. (J#HYB-826)
- Adds the `setExcludedAnnotations` API to exclude specified annotations completely from selection. (J#HYB-823)
- Adds the `bookmarksChanged` event to `NotificationCenter` to receive bookmark change events. (J#HYB-818)
- Adds the `getBookmarks`, `addBookmarks`, and `removeBookmarks` APIs to `PDFDocument` for bookmark management. (J#HYB-818)
- Updates to Nutrient Android SDK 10.4.1.
- Updates to Nutrient iOS SDK 14.10.0.
- Fixes an issue where the `enterAnnotationCreationMode` API does not honor annotation variant options. (J#HYB-814)
- Fixes an issue where the `enterAnnotationCreationMode` API on iOS could not change tools when already active. (J#HYB-815)
- Fixes an issue where `AnnotationsEvent.REMOVED` contained null `name` and `creatorName` properties on Android. (J#HYB-829)

## 2.18.1 - 24 Jun 2025

- Updates to Nutrient Android SDK 10.4.0.
- Fixes an issue where the `enterAnnotationCreationMode` and `exitCurrentlyActiveMode` calls on Android resolved before being complete. (J#HYB-824)
- Fixes an issue where setting the `pageIndex` property could result in a crash on Android. (J#HYB-817)
- Fixes an issue where the thumbnail pages could not be selected on iOS. (J#HYB-816)

## 2.18.0 - 20 May 2025

- Adds the new `AIAssistantConfiguration` class to configure AI Assistant, and also adds the new `aiAssistantButtonItem` option to the toolbar configuration. (J#HYB-743)
- Adds the new `getPageInfo` API to the `PDFDocument` class. (J#HYB-801)
- Updates to Nutrient Android SDK 10.2.0.
- Updates to Nutrient iOS SDK 14.8.0.
- Fixes an issue where the `setLicenseKeys` API could cause a crash on Android if called too early during the application lifecycle. (J#HYB-790)
- Fixes an issue where `NotificationCenter` events aren’t always delivered when running the Release build configuration on iOS. (J#HYB-793)
- Fixes an issue where toolbar button customization wasn’t persisted on Android during component reload. (J#HYB-800)
- Fixes an issue where the `onAnnotationTapped` callback wasn’t called reliably on Android. (J#HYB-805)

## 2.17.0 - 14 Apr 2025

- Adds the new `setPageIndex` API to the `PDFDocument` class. (J#HYB-699)
- Adds the `documentTapped` event to `NotificationCenter` to receive document tap events. (J#HYB-771)
- Adds support for using multiple `PSPDFKitView` components in the same `View`. (J#HYB-692)
- Adds TypeScript types for `FormElement` and `FormField` objects, and introduces new APIs to retrieve and update form annotation data. (J#HYB-612)
- Adds the new `applyTemplate` property to `ToolbarItem` to manage toolbar icon color preservation when being displayed. (J#HYB-741)
- Updates the `addAnnotations` API to accept optional annotation attachments. (J#HYB-782)
- Updates to Nutrient Android SDK 10.1.1.
- Updates to Nutrient iOS SDK 14.6.0.
- Fixes an issue where `selection_tool` wasn't being added to the `menuItemGrouping` configuration on iOS. (J#HYB-705)

## 2.16.1 - 27 Mar 2025

- Adds support for React Native 0.78. (J#HYB-737)
- Fixes an issue where a crash could occur during `onAnnotationChanged` event callbacks on Android. (J#HYB-738)

## 2.16.0 - 26 Feb 2025

- Adds the ability to merge entire PDF documents using the `generatePDFFromDocuments` Processor API. (J#HYB-579)
- Adds the ability to specify an annotation tool type to preselect when entering annotation creation mode using the `enterAnnotationCreationMode` API. (J#HYB-599)
- Adds the ability to specify whether the annotation contextual menu should be shown while calling the `selectAnnotations` API. (J#HYB-564)
- Adds TypeScript types to the different `Annotation` objects used by the annotation APIs on `PDFDocument`. (J#HYB-607)
- Adds the new `applyInstantJSON` API to apply full Document JSON to a document. (J#HYB-607)
- Adds the `documentScrolled` event to the `NotificationCenter` to receive document scroll events. (J#HYB-651)
- Adds support for `selection_tool` to the `menuItemGrouping` configuration. (J#HYB-646)
- Adds the `isRequired` property to results when querying document annotations. (J#HYB-606)
- Adds support for the latest React Native release. (J#HYB-674)
- Adds the `appearanceMode` property to the `PDFConfiguration` object on iOS. (J#HYB-673)
- Adds the new `getDocumentProperties` API to query document properties without the need to view the document. (J#HYB-676)
- Updates to Nutrient Android SDK 10.0.1.
- Updates to Nutrient iOS SDK 14.5.0.
- Updates Android `minSdkVersion` to API 24.
- Updates the iOS deployment target to iOS 16. (#46035)
- Fixes an issue where the `pageMargins` property used by the PDF generation API wasn’t being used by Android. (J#HYB-555)
- Fixes an issue where the `documentPageChanged` event fired while the page change was still in progress on iOS. (J#HYB-644)
- Fixes an issue where the `getConfiguration` API on Android returned inaccurate results. (J#HYB-648)
- Removes the measurements `point` unit, as it isn’t supported anymore. (#46035)
- Removes the `iOSAllowedMenuAction` configuration property, as it isn’t supported anymore. (#46035)

## 2.15.0 - 13 Dec 2024

- Adds a new `NotificationCenter` class that can be used to subscribe to Nutrient document, annotation, and analytics events. (J#HYB-448)
- Adds the ability to show or hide the back and forward action buttons using the new `showActionButtons` property. (J#HYB-98)
- Updates to Nutrient Android SDK 2024.8.1.
- Fixes an issue where the `exportXFDF` API on Android did not export all annotations. (J#HYB-546)
- Fixes an issue where the `exportXFDF` API on Android required the `Forms` license capability. (J#HYB-577)
- Fixes an issue where the back button was missing on Android when using the `PSPDFKit.present` API. (J#HYB-549)

## 2.14.0 - 30 Oct 2024

- Adds the ability to hide the main toolbar on Android using a combination of configuration and style properties. (J#HYB-431)
- Updates to Nutrient Android SDK 2024.6.1.
- Updates to Nutrient iOS SDK 14.1.1.
- Fixes an issue where the correct items weren’t rendered when using the `menuItemGrouping` configuration property. (J#HYB-432)
- Fixes an issue where a crash occurred when using the `toolbar.toolbarMenuItems` property and `enterAnnotationCreationMode` API on Android. (J#HYB-517)
- Fixes an issue where some annotations would not be deleted on iOS when using the `removeAnnotations` API. (J#HYB-518)

## 2.13.0 - 10 Sep 2024

- Adds TypeScript type support to the `annotationPresets` property on the `PSPDFKitView` component. (J#HYB-395)
- Adds support for a source document password to be specified when using the `processAnnotations` API. (J#HYB-453)
- Adds support to select and deselect annotations programmatically. (J#HYB-447)
- Updates to PSPDFKit 2024.5.1 for Android.
- Updates to PSPDFKit 13.9.1 for iOS.
- Fixes an issue where certain annotation presets weren’t applied correctly. (J#HYB-395)
- Fixes an issue where custom toolbar buttons were not applied on the Android toolbar. (J#HYB-482)
- Fixes an issue where the `annotationTypes` parameter wasn’t honored by the `processAnnotations` API. (J#HYB-495)
- Fixes an issue where the `onDocumentLoadFailed` callback was not triggered when an incorrect document password was specified on Android. (J#HYB-491)
- Fixes an issue where some measurement annotation presets were not applied when specified. (J#HYB-492)

## 2.12.0 - 01 Aug 2024

- Adds APIs belonging to the `PDFDocument` interface, moving them away from the global namespace. (J#HYB-406)
- Adds support for using `React.RefObject` as a `PSPDFKitView` ref property. (J#HYB-444)
- Updates for PSPDFKit 2024.3.1 for Android.
- Updates for PSPDFKit 13.8.0 for iOS.
- Fixes an issue where `PSPDFKitView` sometimes failed to load the document on React Native Android. (J#HYB-397)
- Fixes an issue where Instant JSON containing widgets was not applied using the `addAnnotations` API on iOS. (J#HYB-413)
- Fixes an issue where password protected documents could not be saved after annotation changes were made. (J#HYB-454)
- Fixes an issue where the `onDocumentLoaded` callback was not called reliably on iOS. (J#HYB-480)

## 2.11.0 - 07 Jun 2024

- Adds the ability to clear the document cache. (J#HYB-347)
- Adds support for opening PDF documents from a remote URL. (J#HYB-354)
- Updates `setAnnotationFlags` and `getAnnotationFlags` APIs to support using annotation `name` as an identifier. (J#HYB-372)
- Fixes an issue where calling `exitCurrentlyActiveMode` while not in annotation editing mode generates an exception on iOS. (J#HYB-373)
- Fixes an issue where the annotation `uuid` isn’t included in `onAnnotationTapped` callbacks. (J#HYB-374)
- Fixes an issue where Instant configuration wasn’t applied when using the `presentInstant` API on iOS. (J#HYB-375)

## 2.10.0 - 06 May 2024

- Adds the ability to define annotation behavior using flags. (J#HYB-283)
- Adds the ability to add custom menu items to the annotation selection menu. (J#HYB-280)
- Adds the `imageSaveMode` property to the `PSPDFKitView` component to specify how annotations should be treated when saving image documents. (J#HYB-334)
- Updates for PSPDFKit 13.5.0 for iOS.
- Fixes an issue where selecting a measurement annotation without the Measurement Tools license causes a crash. (J#HYB-318)
- Fixes an issue where the `removeAnnotation` API sometimes failed to remove an annotation on iOS. (J#HYB-43)

## 2.9.1 - 12 Apr 2024

- Adds the ability to import and export annotations from XFDF files. (J#HYB-293)
- Updates for PSPDFKit 2024.2.1 for Android.
- Fixes issue where password input UI for password-protected documents wasn't shown on Android. (J#HYB-285)

## 2.9.0 - 22 Mar 2024

- Adds new `getConfiguration` method to retrieve current PSPDFKitView configuration options. (J#HYB-192)
- Adds the option to open a password-protected document through configuration. (J#HYB-213)
- Adds the ability to add custom toolbar buttons to the PSPDFKit toolbar. (J#HYB-198)
- Adds support for the new `MeasurementValueConfiguration` configuration option, replacing the deprecated `setMeasurementScale` and `setMeasurementPrecision` methods. (J#HYB-205)
- Updates the `showPageLabels` property to also control page number overlay on Android. (J#HYB-223)
- Updates for PSPDFKit 2024.1.2 for Android.
- Updates for PSPDFKit 13.3.3 for iOS.
- Fixes issue of document URIs with file:/// scheme on iOS. (#43160)
- Fixes issue where the `onDocumentLoaded` callback was not called on Android. (#43187)
- Fixes the `signatureSavingStrategy` configuration option to save signatures if enabled. (J#HYB-210)
- Fixes `spreadFitting` configuration option behavior on iOS. (J#HYB-222)

## 2.8.1 - 27 Feb 2024

- Updates for PSPDFKit 13.3.1 for iOS. (#43565)
- Removes `scrollViewInsetAdjustment`, `spreadFitting` and `allowedMenuActions` configuration options which are deprecated in PSPDFKit for iOS. (#43565)

## 2.8.0 - 18 Dec 2023

- Adds TypeScript types support to PSPDFKit plugin. (#42380)
- Adds support for loading image documents using the PSPDFKit component on Android. (#42692)
- Updates plugin to target React Native 0.72.7. (#42800)
- Updates Android compileSdkVersion to API 34 and Gradle to 8. (#42380)
- Updates PSPDFKit for Android version to 8.10.0.
- Updates PSPDFKit for iOS version to 13.1.0.
- Fixes issue where building iOS project led to "'PSPDFKitReactNativeiOS-Swift.h' file not found" error. (#41986)
- Fixes issue where getAnnotations with invalid page index caused a crash on Android. (#42073)
- Fixes issue where onAnnotationsChanged event did not fire when a form field was updated on Android. (#42525)
- Fixes issue where annotation toolbar color picker wasn't added by default. (#42761)

## 2.7.0 - 07 Sep 2023

- Adds Annotation Preset customization. (#41528)
- Updates for PSPDFKit 8.8.1 for Android. (#41910)
- Updates for PSPDFKit 12.3.1 for iOS. (#41910)
- Updates the deployment target to iOS 15. (#39956)
- Fixes issue where configuration is overridden by ToolbarMenuItems. (#41681)
- Fixes issue where PDF generation returns "can not get property of null" on iOS. (#41247)
- Fixes annotation toolbar menu grouping customization values. (#41197)
- Fixes issue where the close button is not displayed on iOS. (#41710)
- Fixes issue where showCloseButton config removes all other BarButtonItems on iOS. (#41731)
- Fixes issue where presentInstant uses different parameters on iOS and Android. (#41922)

## 2.6.1 - 19 Jun 2023

- Updates for PSPDFKit 8.7.3 for Android. (#40880)
- Updates for PSPDFKit 12.3 for iOS. (##40880)
- Fixes issue when showThumbnailBar is set to pinned (#40807)

## 2.6.0 - 05 Jun 2023

- Adds measurement tools configurations (#40296)
- Updates for PSPDFKit 8.7.2 for Android. (#40697)
- Updates for PSPDFKit 12.2 for iOS. (#40697)
- Fixes annotation tools subgroups selection with menuItem grouping customization (#40593)

## 2.5.2 - 13 Apr 2023

- Fixes missing RXJava dependencies for Android. (#39813)

## 2.5.1 - 03 Apr 2023

- Updated NativeCatalog configuration and replaced deprecated AppDelegate.m
- Bumps PSPDFKit for Android version to 8.6.0

## 2.5.0 - 23 Mar 2023

- Added magic ink tool for Android annotation toolbar configuration. (#39174)
- Upgrades React Native dependencies and project configuration to 0.71.2
- Adds Instant JSON for React Native
- Updates for PSPDFKit for Android 8.5.1
- Updates for PSPDFKit for iOS 12.1.3
- PSPDFKit now requires React Native 0.71.0 or later.

## 2.4.2 - 01 Feb 2023

- Fixes bug issue for deleting multiple annotations (#38518)
- Bump PSPDFKit for Android version to 8.5.0
- Bump PSPDFKit for iOS version to 12.0.3
- Bump minimum SDK version compileSdkVersion to API 33

## 2.4.1 - 22 Nov 2022

- Updates for PSPDFKit 12.0.1 for iOS.
- Fixes Catalog example toolbar menu items not rendering. (#37368)
- Fixes the Annotation Processing Catalog example. (#37534)

## 2.4.0 - 25 Oct 2022

- Adds PDF generation from HTML, images and template. (#36736)
- Updates for PSPDFKit 8.4.1 for Android
- Updates for PSPDFKit 12.0 for iOS

## 2.3.1 - 22 Jul 2022

- Updates for PSPDFKit 8.2.1 for Android. (#34430)

## 2.3.0 - 19 Jul 2022

- Adds Android Toolbar menu customization from `PSPDFKitView` properties. (#33417)
- Adds handling multiple initializations exception. (#35079)
- Updates the deployment target to iOS 14.0. (#33871)
- Updates for PSPDFKit 11.4.0 for iOS. (#33485)
- PSPDFKit now requires React Native 0.68 or later. (#33875)
- PSPDFKit now requires Xcode 13.4.1 or later. (#32495)

## 2.2.2 - 15 Mar 2022

- Adds image support to `PSPDFKit.present()` on Android. (#33312)
- Adds a new **Save As** example to the Catalog example project. (#33376)
- Updates for PSPDFKit 11.3.0 for iOS. (#33485)
- Fixes React Native Annotation Processor API for Android. (#33189, #33302)

## 2.2.1 - 04 Mar 2022

- Updates for PSPDFKit 8.1.2 for Android. (#33315)
- Updates for PSPDFKit 11.2.4 for iOS. (#33315)
- Fixes React Native Annotation Processor Catalog example for Android.(#33189)

## 2.2.0 - 14 Feb 2022

- This release requires you to update your Android project's `compileSdkVersion` to version 31. Please refer to [our migration guide](https://www.nutrient.io/guides/react-native/migration-guides/react-native-2-2-migration-guide) for this release.
- Adds a `destroyView()` function to `PSPDFKitView` to be used as a workaround for crash caused by a [`react-native-screens` issue](https://github.com/software-mansion/react-native-screens/issues/1300) when navigating back. (#32960)
- Improves the file structure of the Catalog sample project for better readability. (#32685)
- Improves the file structure of the NativeCatalog sample project for better readability. (#32887)
- Updates for PSPDFKit 8.1.1 for Android. (#33017)
- Updates for PSPDFKit 11.2.2 for iOS. (#33017)
- Fixes an issue where the `spreadFitting` configuration value is inverted on Android. (#32789)
- Removes `signingConfig` from React Native Android's sample projects app-level `build.gradle` files. (#32767)

## 2.1.0 - 06 Jan 2022

- Adds documentation for all the configuration options. (#31898)
- Unifies the configuration options on Android and iOS. (#31898)
- PSPDFKit now requires React Native 0.66.4 or later. (#32495)
- PSPDFKit now requires Xcode 13.2.1 or later. (#32495)
- Updates for PSPDFKit 11.2 for iOS. (#32495)
- Fixes an issue where some examples using `Form_example.pdf` would not work. (#32495)

## 2.0.4 - 07 Dec 2021

- Updates the Xcode build settings of the Catalog and Native Catalog example projects to work on iOS simulators on Apple Silicon Macs. (#32129)
- Sets `currentPageIndex` in `onStateChanged` callbacks always to the currently visible page index. Also adds `affectedPageIndex` to get the page that is corresponding to the other states in the callback. (#31926)
- PSPDFKit now requires React Native 0.66.3 or later. (#32119)
- Updates for PSPDFKit 8.0.2 for Android. (#32119)

## 2.0.3 - 02 Nov 2021

- PSPDFKit now requires React Native 0.66.1 or later. (#31744)
- Updates for PSPDFKit 8.0.1 for Android. (#31744)
- Updates for PSPDFKit 11.1 for iOS. (#31654)
- Improves the repository's README. (#31633)

## 2.0.2 - 22 Oct 2021

- Update to PSPDFKit for Android 8.
- PSPDFKit now requires React Native 0.66.0 or later. (#31348)

## 2.0.1 - 05 Oct 2021

- Re-add Java 8 language features. (#31288)

## 2.0.0 - 28 Sep 2021

- Adds the ability to open TIFF images as Image Documents. (#30103)
- Adds a `setLicenseKeys` method which accepts both Android and iOS license keys. (#30943)
- Adds support for iOS 15. (#31008)
- PSPDFKit now requires React Native 0.65.1 or later. (#30947)
- PSPDFKit now requires Xcode 13 or later. (#31008)
- Updates `peerDependencies` and `devDependencies` in `package.json`. (#30947)
- Overhauls the Catalog and NativeCatalog example projects to use the newest version of React Native. (#29342)

## 1.32.2 - 30 Aug 2021

- Migrate from `ReactFragmentActivity` to `ReactActivity` for compatibility with React Native `0.65.1`. (#30771)

## 1.32.1 - 06 Aug 2021

- Adds missing `PSPDFSettingsOption` cases to the configuration for the iOS platform. (#30458)

## 1.32.0 - 23 Jul 2021

- Update for PSPDFKit 7 for Android. (#412)
- Bump minimum SDK version androidMinSdkVersion to API 21. (#412)

## 1.31.6 - 07 Jul 2021

- Fix Android Virtual Device link in the sample projects READMEs.

## 1.31.5 - 07 Jul 2021

- Update for PSPDFKit 10.5 for iOS. (#409)
- Update the minimum deployment target to iOS 13.0. (#409)
- Update the getting started instructions for the Catalog and NativeCatalog example projects. (#409)

## 1.31.4 - 29 Jun 2021

- Make sure page index is set when showing PDF. (#408)

## 1.31.3 - 22 Jun 2021

- Add new “How to Open a PDF in React Native Using the Document Picker" blog post in the “Announcements” section. (#407)

## 1.31.2 - 21 Jun 2021

- Bumped extend from 3.0.1 to 3.0.2 in /samples/Catalog. (#406)
- Bumped lodash from 4.17.15 to 4.17.21 in /samples/NativeCatalog. (#405)

## 1.31.1 - 21 Jun 2021

- Updated the Manual Signing example on iOS to use the new Electronic Signatures API. (#404)
- Bumped glob-parent from 5.1.0 to 5.1.2 in /samples/NativeCatalog. (#404)

## 1.31.0 - 26 May 2021

- Remove the trial license key requirement. (#403)
- Update to PSPDFKit for Android version 6.6.2. (#403)
- Update the README to clarify the Requirements section. (#403)
- Update the README to simplify the Getting Started section. (#403)

## 1.30.18 - 19 May 2021

- Adds a README file for the Catalog example project. (#402)
- Updates the ConfiguredPDFViewComponent iOS example to show the settings button in navigation bar. (#402)
- Fixes issue where the pageIndex prop needed to be set before the document prop. (#402)

## 1.30.17 - 13 May 2021

- Bumped hosted-git-info from 2.8.5 to 2.8.9 in /samples/NativeCatalog. (#401)

## 1.30.16 - 10 May 2021

- Bumped handlebars from 4.7.6 to 4.7.7 in /samples/Catalog. (#398)
- Bumped lodash from 4.17.19 to 4.17.21 in /samples/Catalog. (#399)
- Bumped hosted-git-info from 2.6.0 to 2.8.9 in /samples/Catalog. (#400)

## 1.30.15 - 07 May 2021

- Bumped acorn from 5.7.3 to 5.7.4 in /samples/NativeCatalog. (#397)

## 1.30.14 - 07 May 2021

- Bumped ini from 1.3.5 to 1.3.8 in /samples/NativeCatalog. (#394)
- Bumped handlebars from 4.5.1 to 4.7.7 in /samples/NativeCatalog. (#395)

## 1.30.12 - 07 May 2021

- Workaround a compile issue with Xcode 12.5 in the Catalog and NativeCatalog example projects. (#393)
- Bumped ua-parser-js from 0.7.18 to 0.7.28 in /samples/Catalog. (#393)

## 1.30.11 - 31 Mar 2021

- Fixed “TypeError: cb.apply is not a function” when running the Catalog example project. (#392)
- Bumped y18n from 3.2.1 to 3.2.2 in /samples/Catalog. (#392)

## 1.30.10 - 09 Mar 2021

- Exposes the Reader View button on iOS. (#391)

## 1.30.9 - 03 Mar 2021

- Updates the Getting Started instructions for Android and iOS. (#390)

## 1.30.8 - 11 Feb 2021

- Update to PSPDFKit for Android version 6.6.0.

## 1.30.7 - 09 Feb 2021

- Fixes issue where disableAutomaticSaving did not work on iOS when useParentNavigationBar was enabled. (#389)

## 1.30.6 - 02 Feb 2021

- Update for PSPDFKit 10.2 for iOS, Xcode 12.4 and React Native 0.63.4. (#387)
- Update LICENSE to 2021.

## 1.30.5 - 11 Jan 2021

- Updated installation steps for the iOS Catalog app. (Z-22173)
- Update copyright year to 2021. (#386)
- Fixed annotation tapped events not being emitted when editing is disabled on Android. (#385)
- Fixed stamps not being correctly detected. (#384)

## 1.30.4 - 15 Dec 2020

- Bump ini from 1.3.5 to 1.3.7 in /samples/Catalog. (#383)

## 1.30.3 - 16 Nov 2020

- Update for PSPDFKit 10.1 for iOS and Xcode 12.2. (#382)

## 1.30.2 - 30 Oct 2020

- Update to PSPDFKit 6.5.3 for Android. (#380)

## 1.30.1 - 13 Oct 2020

- Update to PSPDFKit for Android 6.5.2.
- Update to PSPDFKit for iOS 10.0.1.

## 1.30.0 - 22 Sep 2020

- Update for PSPDFKit 10 for iOS, iOS 14, and Xcode 12. (#378)

## 1.29.10 - 14 Sep 2020

- Fixes an issue on iOS where the last page view would be layed out incorrectly in single page mode and scroll per spread page trasition after device rotation. (#377)

## 1.29.9 - 08 Sep 2020

- Update Getting started instructions for React Native 0.63.2. (#376)
- Bump lodash from 4.17.10 to 4.17.19 in /samples/Catalog. (#374)

## 1.29.8 - 13 Aug 2020

- Fixes an issue that prevented you from adding images from the gallery or camera on Android when using the PSPDFKitView. (#375)

## 1.29.7 - 15 Jul 2020

- Update to PSPDFKit 6.5 for Android. (#373)

## 1.29.6 - 14 Jul 2020

- Update for PSPDFKit 9.5 for iOS. (#371)

## 1.29.5 - 07 Jul 2020

- Fixes an issue that prevented PSPDFKitView from loading. (#372).

## 1.29.4 - 18 Jun 2020

- Update for PSPDFKit 6.4 for Android. (#370)

## 1.29.3 - 17 Jun 2020

- Update for PSPDFKit 9.4 for iOS. (#369)

## 1.29.2 - 25 May 2020

- Adds Javascript API on to customize the font picker on Android and iOS. (#363)
- Updated the Catalog sample project dependencies. (#368)

## 1.29.1 - 27 Apr 2020

- Adds enableFormEditing to configuration. (#365)

## 1.29.0 - 24 Apr 2020

- Updates PSPDFKit for Android to 6.3. (#364)
- Resolves #352.
- Resolves #359.

## 1.28.7 - 15 Apr 2020

- Bridges the Instant Example from the iOS PSPDFKit Catalog to the NativeCatalog React Native project. (#362)

## 1.28.6 - 26 Mar 2020

- Add support for hiding the main toolbar on Android. (#360)

## 1.28.5 - 25 Mar 2020

- Fixes warning in the Xcode project by migrating the development region. (#361)

## 1.28.4 - 18 Mar 2020

- Adds Native Catalog sample project with advanced integration examples on iOS. (#339)

## 1.28.3 - 16 Mar 2020

- Reload the entire PSPDFViewController instead of only reloading the currently visible page when adding adding annotations via the addAnnotations API. (#357)

## 1.28.2 - 16 Mar 2020

- Updates to PSPDFKit for Android 6.2.0. (#353)

## 1.28.1 - 10 Mar 2020

- Put PSPDFKit on Gradle's api configuration making PSPDFKit classes available on an app's Java class path. (#355)

## 1.28.0 - 06 Mar 2020

- Add bookmark action configuration option. (#354)

## 1.27.5 - 19 Feb 2020

- Update README to mention the newly added annotation processing API. (#351)

## 1.27.4 - 19 Feb 2020

- Adds new API for annotation processing on Android and iOS. (#350)

## 1.27.3 - 12 Feb 2020

- Fix two navigation buttons being shown while the search is open. (#347)
- Return a promise when calling PSPDFKit.present(). (#348)
- Include uuid in annotation removed event. (#349)
- Return a promise when calling PSPDFKit.present(). (#348)
- Include creator name in annotation removed event. (#349)

## 1.27.2 - 04 Feb 2020

- Adds new toolbarTitle, and showSettingsMenu configuration options. (#345)
- Adds new showNavigationButtonInToolbar, and onNavigationButtonClicked props to PSPDFKitView. (#345)

## 1.27.1 - 03 Feb 2020

- Add new “How to Bridge Native iOS Code to React Native” blog post and video tutorial in the “Announcements” section. (#346)

## 1.27.0 - 30 Jan 2020

- The Android PdfView now internally uses the PdfUiFragment meaning it provides the same UI as the PdfActivity. #322

## 1.26.8 - 28 Jan 2020

- Adds instructions for how to use the Experimental Mac Catalyst Support. (#343)

## 1.26.7 - 21 Jan 2020

- Bumps PSPDFKit for Android version to 6.1.1. (#342)

## 1.26.6 - 10 Jan 2020

- Bumps PSPDFKit for Android version to 6.1. (#337)

## 1.26.5 - 13 Dec 2019

- Adds new Watermarking Example to Native Catalog. (#325)

## 1.26.4 - 05 Nov 2019

- Adds a new Native Catalog example for Android showing how to use the PdfView in your own bridge code. (#318)
- Adds PdfView#getFragment() method to make retrieving the current fragment easier.
- Adds PdfView#createDefaultEventRegistrationMap() method to make writing custom view manager easier.

## 1.26.3 - 28 Oct 2019

- Updates the PSPDFKit for Android version to 6.0.2. (#312)
- Add support for enableAnnotationEditing and editableAnnotationTypes prop to Android. (#311)
- Make saveCurrentDocument and setFormFieldValue return a promise on Android and iOS. (#308)

## 1.26.2 - 16 Oct 2019

- Adds the annotation name to the onAnnotationsChanged payload when annotation is removed on iOS. (#309)
- Fixes enableAnnotationEditing on iOS. (#310)

## 1.26.1 - 09 Oct 2019

- Force UIModalPresentationFullScreen for the native module on iOS 13. (#307)

## 1.26.0 - 23 Sep 2019

- Update for PSPDFKit 9 for iOS.

## 1.25.8 - 09 Sep 2019

- Add setLicenseKey method to Android. (#290)
- Add disableAutomaticSaving configuration to Android. (#289)

## 1.25.7 - 31 Aug 2019

- Added a comment to explain why we dismiss he PSPDFViewController in -[RCTPSPDFKitView removeFromSuperview]. (#287)

## 1.25.6 - 28 Aug 2019

- Fixed a crash that would occur when adding an invalid Instant JSON payload. (#284)

## 1.25.5 - 28 Aug 2019

- Dismiss the PDF view controller when the view component is unmounted to avoid orphan popovers. (#280)

## 1.25.4 - 14 Aug 2019

- Fixes reloading causing the PdfView to get into a state where it never loads. (#269)

## 1.25.3 - 13 Aug 2019

- Update the integration steps now that linking is automatic via CocoaPods. (#265)

## 1.25.2 - 09 Aug 2019

- Fixes issue with trial maven keys. (#266)
- Updates PSPDFKit for Android from 5.5.0 to 5.5.1.

## 1.25.1 - 08 Aug 2019

- Adds getAllAnnotations() JavaScript API to query all annotation from a document. (#167)

## 1.25.0 - 06 Aug 2019

- This release bumps the required react-native version to 0.60.4. (#263)
- The PSPDFKit version on Android was updated to 5.5.0.
- We now require AndroidX, make sure to look at the official release blog for more information on the migration.

## 1.24.9 - 25 Jul 2019

- Annotation modification methods now return a promise on Android (#251, #250)
- Changing the configuration prop now updates the PdfFragment on Android (#252)

## 1.24.8 - 25 Jul 2019

- Improves error handling for annotation manipulations functions on iOS. (#261)

## 1.24.7 - 18 Jul 2019

- React Native 0.60.x uses CocoaPods by default, so we've updated the iOS integration steps. See https://github.com/PSPDFKit/react-native#ios for more details. (#257)

## 1.24.6 - 16 Jul 2019

- Adds toolbarTitle Javascript API to override the iOS toolbar title. (#255)
- Updated the README to add a section about how to Customize the Toolbar Buttons. (#256)

## 1.24.5 - 15 Jul 2019

- Fixes memory leak issue in react native windows with newtonsoft.

## 1.24.4 - 11 Jul 2019

- Restores support for react-native 0.57 on Android.
- Adds onDocumentLoadFailed callback on iOS / Android
- Improves document path resolution on Android.

## 1.24.3 - 01 Jul 2019

- Bump version to 1.24.3 (#242)

## 1.24.2 - 19 Jun 2019

- Improves the CocoaPods integration. (#235)

## 1.24.1 - 14 Jun 2019

- Update the Android and iOS Catalog apps for React Native 0.59.9. (#193)

## 1.24.0 - 12 Jun 2019

- Adds Javascript API to customize the toolbar on iOS. (#233)

## 1.23.16 - 28 May 2019

- Merge pull request #232 from PSPDFKit/rad/fix-broken-link.
- Fix broken link in the README.

## 1.23.15 - 28 May 2019

- Merge pull request #227 from PSPDFKit/reinhard/add-page-mode-config.
- Fix for double page mode configuration missing on Android.

## 1.23.14 - 28 May 2019

- Create the PDFViewPage when asked to by react native. (#229)
- There was a lifetime issue when navigating back and forth between views. Now we create a view when react native wants to. The unloading is still handled in UWP.

## 1.23.13 - 22 May 2019

- Update wrapper to PSPDFKit for Windows 2.0 (#223)
- Update references
- Make JsonUtils compatible.
- update all nuget versions.
- removed alert from library search example as this is more than fast enough now.

## 1.23.12 - 22 May 2019

- Align annotations changed with ios (#224)
- This PR changes annotation events on UWP to pass back a list of annotations like Android and iOS does.

## 1.23.11 - 21 May 2019

- UWP: Remove Annotation (#222)
- Brings UWP removeAnnotation API inline with iOS and Android.
- Also fixes small typo with getAnnotations JSON reply.

## 1.23.10 - 07 May 2019

- Re-implement Css Customization (#221)
- As explained in #219 (comment) due to limitations with file permissions in UWP it was necessary to rework the CSS customization. Therefore now the viable solution is to provide a native option.
- In this PR I have reverted the previous CSS work and added the option to start the PSPDFKit react native package with a Uri parameter which will be passed as the CSS resource. Within this CSS resource, it's possible to set the main colors of the toolbar. As before.

## 1.23.9 - 30 Apr 2019

- Fix crash when null colors are passed (#218)
- JObject throws when checking for a null or undefined value. Instead of throwing we check for this and do not include the value allow the application to continue.

## 1.23.8 - 24 Apr 2019

- Merge pull request #210 from PSPDFKit/rad/update-for-PSPDFKit-8.3-ios.
- Update for PSPDFKit 8.3 for iOS.

## 1.23.7 - 17 Apr 2019

- Updated and tested 1.12. (#211)
- A simple update to PSPDFKit for Windows 1.12.
- All tested fine.

## 1.23.6 - 15 Apr 2019

- Merge pull request #209 from PSPDFKit/rad/document-validation-check
- Check if document is valid before adding or removing annotations

## 1.23.5 - 08 Apr 2019

- Fix set toolbar promise. (#208)
- Mistakenly did not handle the promise for set toolbar and therefore it was never fired. Same is true for the error.

## 1.23.4 - 02 Apr 2019

- Merge pull request #202 from PSPDFKit/github-templates.
- Add Github issue and pull request templates.

## 1.23.3 - 01 Apr 2019

- Merge pull request #201 from PSPDFKit/release-1.23.3.

## 1.23.2 - 22 Mar 2019

- Merge pull request #192 from PSPDFKit/release-1.23.2.

## 1.23.1 - 19 Mar 2019

- UWP: Update to PSPDFKit for Windows 1.11.0. (#186)

## 1.23.0 - 15 Jan 2019

- Update for PSPDFKit 8.1.3 for iOS.

## 1.22.0 - 15 Nov 2018

- Update PSPDFKit to 5.0.1 for Android (#141)

## 1.21.1 - 25 Oct 2018

- Remove invalid setting option on iOS. (8603e34)

## 1.21.0 - 17 Oct 2018

- Update for PSPDFKit 8 for iOS. (#131)

## 1.20.0 - 28 Aug 2018

- Adds the ability to programmatically toggle the annotation toolbar. (#105, #108)
- Adds Programmatic PDF form filling. (#106, #107)
- Adds Event Listeners Catalog example.
- Adds API and Catalog example to manually save a document.
- Add catalog example for changing pages. (#98)
- Adds getAnnotations to get all annotations of a page.
- Adds addAnnotation to add a single annotation using Instant JSON.
- Adds getAllUnsavedAnnotations to export the document Instant JSON.
- Adds addAnnotations to parse the document Instant JSON.
- Adds disableAutomaticSaving prop to disable automatic saving when exiting the document.
- Adds annotationAuthorName prop to set the annotation author used when creating annotations.
- Adds callbacks for when an annotation is added, changed or deleted.
