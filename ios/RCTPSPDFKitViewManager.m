//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
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
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTPSPDFKitView.h"
#import "NutrientPropsFontHelper.h"
#import "NutrientPropsMeasurementConfigurationHelper.h"
#import "NutrientPropsUIHelper.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#import <React/RCTUIManager.h>

#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>

@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, PSPDFDocument, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document = [RCTConvert PSPDFDocument:json
                                       remoteDocumentConfig:[view.configurationJSON objectForKey:@"remoteDocumentConfiguration"]];
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;
      
    PDFDocumentManager *documentManager = [self.bridge moduleForClass:[PDFDocumentManager class]];
    [documentManager setDocument:view.pdfController.document reference:view.reactTag];
    [documentManager setView:view forReference:view.reactTag];
    [documentManager setDelegate:(id<PDFDocumentManagerDelegate>)view];

    // The following properties need to be set after the document is set.
    // We set them again here when we're certain the document exists.
    if (view.annotationAuthorName) {
      view.pdfController.document.defaultAnnotationUsername = view.annotationAuthorName;
    }
      
    view.pdfController.pageIndex = view.pageIndex;
      
    if ([view.pdfController.document isKindOfClass:[PSPDFImageDocument class]]) {
        PSPDFImageDocument *imageDocument = (PSPDFImageDocument *)view.pdfController.document;
        imageDocument.imageSaveMode = view.imageSaveMode;
    }
      
    [NutrientPropsFontHelper configureCustomFontPickerForView:view];
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
        view.configurationJSON = json;
    }
}

RCT_CUSTOM_VIEW_PROPERTY(annotationPresets, Dictionary , RCTPSPDFKitView) {
   // Call AnnotationConfigurationConverter with the configuration dictionary
   if (json) {
       [AnnotationsConfigurationsConverter convertAnnotationConfigurationsWithAnnotationPreset:json];
   }
}

RCT_CUSTOM_VIEW_PROPERTY(annotationAuthorName, NSString, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document.defaultAnnotationUsername = json;
    view.annotationAuthorName = json;
  }
}

RCT_CUSTOM_VIEW_PROPERTY(imageSaveMode, NSString, RCTPSPDFKitView) {
  if (json) {
      view.imageSaveMode = [RCTConvert PSPDFImageSaveMode:json];
      if ([view.pdfController.document isKindOfClass:PSPDFImageDocument.class]) {
          PSPDFImageDocument *imageDoc = (PSPDFImageDocument *)view.pdfController.document;
          imageDoc.imageSaveMode = view.imageSaveMode;
      }
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
  [NutrientPropsUIHelper applyShowCloseButtonFromJSON:json toView:view];
}

RCT_EXPORT_VIEW_PROPERTY(onCloseButtonPressed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaved, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaveFailed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentLoadFailed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationTapped, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationsChanged, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentLoaded, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onReady, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onCustomToolbarButtonTapped, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onCustomAnnotationContextualMenuItemTapped, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(availableFontNames, NSArray, RCTPSPDFKitView) {
  [NutrientPropsFontHelper applyAvailableFontNamesFromJSON:json toView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(selectedFontName, NSString, RCTPSPDFKitView) {
  [NutrientPropsFontHelper applySelectedFontNameFromJSON:json toView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(showDownloadableFonts, BOOL, RCTPSPDFKitView) {
  [NutrientPropsFontHelper applyShowDownloadableFontsFromJSON:json toView:view];
}

RCT_CUSTOM_VIEW_PROPERTY(toolbar, NSDictionary, RCTPSPDFKitView) {
  if (json) {
    NSDictionary *toolbar = [RCTConvert NSDictionary:json];

    if ([toolbar objectForKey:@"leftBarButtonItems"] != nil) {
      [view setLeftBarButtonItems:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"buttons"]
                      forViewMode:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"viewMode"]
                        animated:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"animated"]];
    }
  
    if ([toolbar objectForKey:@"rightBarButtonItems"] != nil) {
      [view setRightBarButtonItems:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"buttons"]
                      forViewMode:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"viewMode"]
                          animated:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"animated"]];
    }
  }
}

RCT_CUSTOM_VIEW_PROPERTY(annotationContextualMenu, NSDictionary, RCTPSPDFKitView) {
  if (json) {
      NSDictionary *annotationContextualMenu = [RCTConvert NSDictionary:json];
      [view setAnnotationContextualMenuItems:annotationContextualMenu];
  }
}

RCT_EXPORT_METHOD(setPageIndex:(NSInteger)pageIndex reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component updatePageIndex:pageIndex];
    resolve(@YES);
  });
}

RCT_EXPORT_METHOD(enterAnnotationCreationMode:(NSString *)annotationType reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    PSPDFAnnotationString convertedAnnotationType = [RCTConvert PSPDFAnnotationStringFromName:annotationType];
    PSPDFAnnotationVariantString convertedAnnotationVariant = nil;
    // Handle possible variant
    if (convertedAnnotationType == PSPDFAnnotationStringInk) {
        convertedAnnotationVariant = [RCTConvert PSPDFAnnotationVariantStringFromName:annotationType];
    }
      
    BOOL success = [component enterAnnotationCreationMode:convertedAnnotationType withVariant:convertedAnnotationVariant];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to enter annotation creation mode.", nil);
    }
  });
}

RCT_EXPORT_METHOD(enterContentEditingMode:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component enterContentEditingMode];
    resolve(@YES);
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

RCT_EXPORT_METHOD(setToolbar:(NSDictionary *)toolbar reactTag:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
     
      if ([toolbar objectForKey:@"leftBarButtonItems"] != nil) {
        [component setLeftBarButtonItems:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"buttons"]
                        forViewMode:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"viewMode"]
                          animated:[[toolbar objectForKey:@"leftBarButtonItems"] objectForKey:@"animated"]];
      }
    
      if ([toolbar objectForKey:@"rightBarButtonItems"] != nil) {
        [component setRightBarButtonItems:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"buttons"]
                        forViewMode:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"viewMode"]
                            animated:[[toolbar objectForKey:@"rightBarButtonItems"] objectForKey:@"animated"]];
      }
  });
}

RCT_EXPORT_METHOD(getToolbar:(nullable NSString *)viewMode reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    
      NSArray *leftItems = [component getLeftBarButtonItemsForViewMode:viewMode];
      NSArray *rightItems = [component getRightBarButtonItemsForViewMode:viewMode];
      
      NSDictionary *toolbar = @{
          @"viewMode" : viewMode == nil ? [RCTConvert PSPDFViewModeString:component.pdfController.viewMode] : viewMode,
          @"leftBarButtonItems" : leftItems,
          @"rightBarButtonItems" : rightItems
      };
      
    if (toolbar) {
      resolve(toolbar);
    } else {
      reject(@"error", @"Failed to retrieve toolbar.", nil);
    }
  });
}

RCT_EXPORT_METHOD(setMeasurementValueConfigurations:(nullable NSArray*)configs reactTag:(nonnull NSNumber*)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        
        BOOL success = [NutrientPropsMeasurementConfigurationHelper setMeasurementValueConfigurations:configs
                                                                                              document:component.pdfController.document];
        success ? resolve(@YES) : reject(@"error", @"Failed to set all measurement configuration.", nil);
    });
}

RCT_EXPORT_METHOD(getMeasurementValueConfigurations:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
      RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
      NSArray *result = [NutrientPropsMeasurementConfigurationHelper getMeasurementValueConfigurations:component.pdfController.document];
      NSDictionary *configs = [NSDictionary dictionaryWithObject:result
                                                          forKey:@"measurementValueConfigurations"];
    if (configs) {
      resolve(configs);
    } else {
      reject(@"error", @"Failed to retrieve Measurement configuration.", nil);
    }
  });
}

RCT_EXPORT_METHOD(getConfiguration:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSDictionary *configuration = [RCTConvert convertConfiguration:component.pdfController];
    if (configuration) {
      resolve(configuration);
    } else {
      reject(@"error", @"Failed to retrieve configuration.", nil);
    }
  });
}

RCT_EXPORT_METHOD(setExcludedAnnotations:(NSArray *)annotations reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
      RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
      [component setExcludedAnnotations:annotations];
      resolve(@YES);
  });
}

RCT_EXPORT_METHOD(setUserInterfaceVisible:(BOOL)visible reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component setUserInterfaceVisible:visible];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to set user interface visibility.", nil);
    }
  });
}

- (UIView *)view {
  // In legacy architecture (Paper), return the regular view
  return [[RCTPSPDFKitView alloc] init];
}
@end

