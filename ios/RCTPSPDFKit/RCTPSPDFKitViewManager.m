//
//  Copyright © 2018-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitViewManager.h"
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTConvert+PSPDFAnnotationToolbarConfiguration.h"
#import "RCTConvert+PSPDFViewMode.h"
#import "RCTPSPDFKitView.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#import <React/RCTUIManager.h>

@import PSPDFKit;
@import PSPDFKitUI;

// Static variables to allow communication between the React Native View Props and the custom font picker view controller.
static NSString *staticSelectedFontName;
static NSArray<NSString *>*staticAvailableFontNames;

/** Defaults to YES.

 @see https://pspdfkit.com/api/ios/Classes/PSPDFFontPickerViewController.html#/c:objc(cs)PSPDFFontPickerViewController(py)showDownloadableFonts
 */
static BOOL staticShowDownloadableFonts = YES;

// Custom font picker subclass to allow customizations.
@interface CustomFontPickerViewController : PSPDFFontPickerViewController
@end

@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, PSPDFDocument, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document = [RCTConvert PSPDFDocument:json];
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;

    // The following properties need to be set after the document is set.
    // We set them again here when we're certain the document exists.
    if (view.annotationAuthorName) {
      view.pdfController.document.defaultAnnotationUsername = view.annotationAuthorName;
    }

    view.pdfController.pageIndex = view.pageIndex;

      // Update measurement scale and precision after document is created and remove it from memory after reading
      [PspdfkitMeasurementConvertor setConfig: _configuration document: view.pdfController.document];
      _configuration = nil;
      if(view.onDocumentLoaded) {
          view.onDocumentLoaded(@{});
      }
    }
}

RCT_CUSTOM_VIEW_PROPERTY(pageIndex, PSPDFPageIndex, RCTPSPDFKitView) {
  if (json) {
    PSPDFPageIndex idx = [RCTConvert NSUInteger:json];
    view.pageIndex = idx;
    view.pdfController.pageIndex = idx;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(configuration, PSPDFConfiguration, RCTPSPDFKitView) {
    if (json) {
        [view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
            [builder overrideClass:PSPDFFontPickerViewController.class withClass:CustomFontPickerViewController.class];
            [builder setupFromJSON:json];
            _configuration = json;
        }];

        [self postProcessConfigurationOptionsWithJSON: json forPDFViewController: view.pdfController];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(annotationPresets, Dictionary , RCTPSPDFKitView) {
   // Call AnnotationConfigurationConvertor with the configuration dictionary
   if (json) {
       [AnnotationsConfigurationsConvertor convertAnnotationConfigurationsWithAnnotationPreset:json];
   }
}

// These options are configuration options in Android, but not on iOS, so we apply them
// after we update the actual configuration.
- (void)postProcessConfigurationOptionsWithJSON:(id)json forPDFViewController:(PSPDFViewController *)controller {
  if (json) {
    NSDictionary *dictionary = [RCTConvert processConfigurationOptionsDictionaryForPrefix:[RCTConvert NSDictionary:json]];
    if (dictionary[@"toolbarTitle"]) {
      NSString *title = [RCTConvert NSString:dictionary[@"toolbarTitle"]];
      controller.title = title;
    }
    if (dictionary[@"invertColors"]) {
      BOOL shouldInvertColors = [RCTConvert BOOL:dictionary[@"invertColors"]];
      controller.appearanceModeManager.appearanceMode = shouldInvertColors ? PSPDFAppearanceModeNight : PSPDFAppearanceModeDefault;
    }
  }
}

RCT_CUSTOM_VIEW_PROPERTY(annotationAuthorName, NSString, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document.defaultAnnotationUsername = json;
    view.annotationAuthorName = json;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(menuItemGrouping, PSPDFAnnotationToolbarConfiguration, RCTPSPDFKitView) {
  if (json) {
    PSPDFAnnotationToolbarConfiguration *configuration = [RCTConvert PSPDFAnnotationToolbarConfiguration:json];
    view.pdfController.annotationToolbarController.annotationToolbar.configurations = @[configuration];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(leftBarButtonItems, NSArray<UIBarButtonItem *>, RCTPSPDFKitView) {
  if (json) {
    NSArray *leftBarButtonItems = [RCTConvert NSArray:json];
    [view setLeftBarButtonItems:leftBarButtonItems forViewMode:nil animated:NO];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(rightBarButtonItems, NSArray<UIBarButtonItem *>, RCTPSPDFKitView) {
  if (json) {
    NSArray *rightBarButtonItems = [RCTConvert NSArray:json];
    [view setRightBarButtonItems:rightBarButtonItems forViewMode:nil animated:NO];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(toolbarTitle, NSString, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.title = json;
  }
}

RCT_EXPORT_VIEW_PROPERTY(hideNavigationBar, BOOL)

RCT_EXPORT_VIEW_PROPERTY(disableDefaultActionForTappedAnnotations, BOOL)

RCT_CUSTOM_VIEW_PROPERTY(disableAutomaticSaving, BOOL, RCTPSPDFKitView) {
  if (json) {
    view.disableAutomaticSaving = [RCTConvert BOOL:json];
    [view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
      // Disable autosave in the configuration.
      builder.autosaveEnabled = !view.disableAutomaticSaving;
    }];
  }
}

RCT_REMAP_VIEW_PROPERTY(color, tintColor, UIColor)

RCT_CUSTOM_VIEW_PROPERTY(showCloseButton, BOOL, RCTPSPDFKitView) {
  if (json && [RCTConvert BOOL:json]) {
      NSMutableArray *leftBarButtons = [[NSMutableArray alloc] initWithArray:view.pdfController.navigationItem.leftBarButtonItems];
      if (leftBarButtons == nil) {
          leftBarButtons = [NSMutableArray new];
      }
      if (![leftBarButtons containsObject:view.closeButton]) {
          [leftBarButtons addObject:view.closeButton];
      }
      view.pdfController.navigationItem.leftBarButtonItems = leftBarButtons;
  }
}

RCT_EXPORT_VIEW_PROPERTY(onCloseButtonPressed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaved, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaveFailed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentLoadFailed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationTapped, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationsChanged, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentLoaded, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(availableFontNames, NSArray, RCTPSPDFKitView) {
  if (json && [RCTConvert NSArray:json]) {
    view.availableFontNames = [RCTConvert NSArray:json];
    staticAvailableFontNames = view.availableFontNames;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(selectedFontName, NSString, RCTPSPDFKitView) {
  if (json && [RCTConvert NSString:json]) {
    view.selectedFontName = [RCTConvert NSString:json];
    staticSelectedFontName = view.selectedFontName;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(showDownloadableFonts, BOOL, RCTPSPDFKitView) {
  if (json) {
    view.showDownloadableFonts = [RCTConvert BOOL:json];
    staticShowDownloadableFonts = view.showDownloadableFonts;
  }
}

RCT_EXPORT_METHOD(enterAnnotationCreationMode:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component enterAnnotationCreationMode];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to enter annotation creation mode.", nil);
    }
  });
}

RCT_EXPORT_METHOD(exitCurrentlyActiveMode:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component exitCurrentlyActiveMode];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to exit currently active mode.", nil);
    }
  });
}

RCT_EXPORT_METHOD(saveCurrentDocument:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component saveCurrentDocumentWithError:&error];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to save document.", error);
    }
  });
}

RCT_REMAP_METHOD(getAnnotations, getAnnotations:(nonnull NSNumber *)pageIndex type:(NSString *)type reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    NSDictionary *annotations = [component getAnnotations:(PSPDFPageIndex)pageIndex.integerValue type:[RCTConvert annotationTypeFromInstantJSONType:type] error:&error];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get annotations.", error);
    }
  });
}

RCT_EXPORT_METHOD(addAnnotation:(id)jsonAnnotation reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component addAnnotation:jsonAnnotation error:&error];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to add annotation.", error);
    }
  });
}

RCT_EXPORT_METHOD(removeAnnotation:(id)jsonAnnotation reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component removeAnnotationWithUUID:jsonAnnotation[@"uuid"]];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to remove annotation.", nil);
    }
  });
}

RCT_EXPORT_METHOD(removeAnnotations:(id)jsonAnnotations reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"remove annotations %@", jsonAnnotations);
    if(![jsonAnnotations isKindOfClass: [NSArray class]]) {
        reject(@"error", @"Please provide list of annotation objects", nil);
        return;
    }
    NSMutableArray* annotationIDs = [@[] mutableCopy];
    for(NSDictionary* annotation in jsonAnnotations) {
        [annotationIDs addObject: annotation[@"uuid"]];
    }

    NSMutableArray* errors = [@[] mutableCopy];

    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        for(NSString* uuid in annotationIDs){
            BOOL isSuccessful = [component removeAnnotationWithUUID: uuid];
            NSLog(@"Deleted annotation %@", uuid);
            if(!isSuccessful) {
                [errors addObject: uuid];
            }
        }

        if([errors count] > 1) {
            NSString* errorMessage = [NSString stringWithFormat: @"Failed to remove annotations: %@", errors];
            reject(@"error", errorMessage, nil);
            return;
        }
        resolve(@(true));
    });
}

RCT_EXPORT_METHOD(getAllUnsavedAnnotations:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    NSDictionary *annotations = [component getAllUnsavedAnnotationsWithError:&error];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get annotations.", error);
    }
  });
}

RCT_EXPORT_METHOD(getAllAnnotations:(NSString *)type reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    NSDictionary *annotations = [component getAllAnnotations:[RCTConvert annotationTypeFromInstantJSONType:type] error:&error];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get all annotations.", error);
    }
  });
}

RCT_EXPORT_METHOD(addAnnotations:(id)jsonAnnotations reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component addAnnotations:jsonAnnotations error:&error];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to add annotations.", error);
    }
  });
}

RCT_EXPORT_METHOD(getFormFieldValue:(NSString *)fullyQualifiedName reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSDictionary *formElementDictionary = [component getFormFieldValue:fullyQualifiedName];
    if (formElementDictionary) {
      resolve(formElementDictionary);
    } else {
      reject(@"error", @"Failed to get form field value.", nil);
    }
  });
}

RCT_EXPORT_METHOD(setFormFieldValue:(nullable NSString *)value fullyQualifiedName:(NSString *)fullyQualifiedName reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component setFormFieldValue:value fullyQualifiedName:fullyQualifiedName];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to set form field value.", nil);
    }
  });
}

RCT_EXPORT_METHOD(setLeftBarButtonItems:(nullable NSArray *)items viewMode:(nullable NSString *)viewMode animated:(BOOL)animated reactTag:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component setLeftBarButtonItems:items forViewMode:viewMode animated:animated];
  });
}

RCT_EXPORT_METHOD(setRightBarButtonItems:(nullable NSArray *)items viewMode:(nullable NSString *)viewMode animated:(BOOL)animated reactTag:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component setRightBarButtonItems:items forViewMode:viewMode animated:animated];
  });
}

RCT_EXPORT_METHOD(getLeftBarButtonItemsForViewMode:(nullable NSString *)viewMode reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSArray *leftBarButtonItems = [component getLeftBarButtonItemsForViewMode:viewMode];
    if (leftBarButtonItems) {
      resolve(leftBarButtonItems);
    } else {
      reject(@"error", @"Failed to get the left bar button items.", nil);
    }
  });
}

RCT_EXPORT_METHOD(getRightBarButtonItemsForViewMode:(nullable NSString *)viewMode reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSArray *rightBarButtonItems = [component getRightBarButtonItemsForViewMode:viewMode];
    if (rightBarButtonItems) {
      resolve(rightBarButtonItems);
    } else {
      reject(@"error", @"Failed to get the right bar button items.", nil);
    }
  });
}

RCT_EXPORT_METHOD(setMeasurementConfig:(nullable NSDictionary*)config reactTag:(nonnull NSNumber*) reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        PSPDFMeasurementScale* scaleConfig = [PspdfkitMeasurementConvertor getScaleConfig: config];
        if (scaleConfig != nil) {
            component.pdfController.document.measurementScale = scaleConfig;
        }

        if([config objectForKey: @"precision"] != nil) {
        NSInteger precisionUnit =  [PspdfkitMeasurementConvertor getPrecisionInt: [config objectForKey: @"precision"]];

            component.pdfController.document.measurementPrecision = precisionUnit;
        }
    });
}

RCT_EXPORT_METHOD(setMeasurementScale:(nullable NSDictionary*)config reactTag:(nonnull NSNumber*) reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        PSPDFMeasurementScale* scaleConfig =  [PspdfkitMeasurementConvertor getScaleConfig: config];
        if (scaleConfig != nil) {
            component.pdfController.document.measurementScale = scaleConfig;
        }
    });
}

RCT_EXPORT_METHOD(setMeasurementPrecision:(NSString*)precision reactTag:(nonnull NSNumber*) reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        NSInteger precisionUnit =  [PspdfkitMeasurementConvertor getPrecisionInt: precision];

        component.pdfController.document.measurementPrecision = precisionUnit;
    });
}

- (UIView *)view {
  return [[RCTPSPDFKitView alloc] init];
}

@end

@implementation CustomFontPickerViewController

- (NSArray *)customFontFamilyDescriptors {
  NSMutableArray *fontFamilyDescription = [NSMutableArray array];
  for (NSString *fontName in staticAvailableFontNames) {
    [fontFamilyDescription addObject:[[UIFontDescriptor alloc] initWithFontAttributes:@{UIFontDescriptorNameAttribute: fontName}]];
  }

  return fontFamilyDescription;
}

- (UIFont *)customSelectedFont {
  // We bailout early if the passed selected font name is nil.
  if (!staticSelectedFontName) {
    return nil;
  }
  UIFontDescriptor *fontDescriptor = [[UIFontDescriptor alloc] initWithFontAttributes:@{UIFontDescriptorNameAttribute: staticSelectedFontName}];
  return [UIFont fontWithDescriptor:fontDescriptor size:12.0];
}

- (instancetype)initWithFontFamilyDescriptors:(NSArray *)fontFamilyDescriptors {
  // Override the default font family descriptors if custom font descriptors are specified.
  NSArray *customFontFamilyDescriptors = [self customFontFamilyDescriptors];
  if (customFontFamilyDescriptors.count) {
    fontFamilyDescriptors = customFontFamilyDescriptors;
  }
  return [super initWithFontFamilyDescriptors:fontFamilyDescriptors];
}

- (void)dealloc {
  // Reset the static variables.
  staticSelectedFontName = nil;
  staticAvailableFontNames = nil;
  staticShowDownloadableFonts = YES;
}

-(void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];

  // Customize the font picker before it appears.
  self.showDownloadableFonts = staticShowDownloadableFonts;
  self.selectedFont = [self customSelectedFont];
}

@end
