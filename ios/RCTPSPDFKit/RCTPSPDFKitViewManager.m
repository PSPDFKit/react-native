//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
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
    view.pdfController.document = [RCTConvert PSPDFDocument:json 
                                       remoteDocumentConfig:[_configuration objectForKey:@"remoteDocumentConfiguration"]];
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;
      
    PDFDocumentManager *documentManager = [self.bridge moduleForClass:[PDFDocumentManager class]];
    [documentManager setDocument:view.pdfController.document reference:view.reactTag];

    // The following properties need to be set after the document is set.
    // We set them again here when we're certain the document exists.
    if (view.annotationAuthorName) {
      view.pdfController.document.defaultAnnotationUsername = view.annotationAuthorName;
    }

    view.pdfController.pageIndex = view.pageIndex;
    if ([_configuration objectForKey:@"documentPassword"]) {
        [view.pdfController.document unlockWithPassword:[_configuration objectForKey:@"documentPassword"]];
    }
      
    if ([view.pdfController.document isKindOfClass:[PSPDFImageDocument class]]) {
        PSPDFImageDocument *imageDocument = (PSPDFImageDocument *)view.pdfController.document;
        imageDocument.imageSaveMode = view.imageSaveMode;
    }

    // Apply any measurementValueConfigurations once the document is loaded
    if ([_configuration objectForKey:@"measurementValueConfigurations"]) {
        NSArray *configs = [_configuration objectForKey:@"measurementValueConfigurations"];
        for (NSDictionary *config in configs) {
            [PspdfkitMeasurementConvertor addMeasurementValueConfigurationWithDocument:view.pdfController.document
                                                                           configuration:config];
        }
    }
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

RCT_EXPORT_VIEW_PROPERTY(onCustomToolbarButtonTapped, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onCustomAnnotationContextualMenuItemTapped, RCTBubblingEventBlock)

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
    BOOL success = [component removeAnnotations:jsonAnnotation == nil ? @[] : @[jsonAnnotation]];
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
    
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
        BOOL success = [component removeAnnotations:jsonAnnotations == nil ? @[] : jsonAnnotations];
        if(!success) {
            NSString* errorMessage = [NSString stringWithFormat: @"Failed to remove annotations"];
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

RCT_REMAP_METHOD(setAnnotationFlags, setAnnotationFlags:(nonnull NSString *)uuid flags:(NSArray<NSString *> *)flags reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    BOOL success = [component setAnnotationFlags:uuid flags:flags];
    resolve(@(success));
  });
}

RCT_REMAP_METHOD(getAnnotationFlags, getAnnotationFlags:(nonnull NSString *)uuid reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSArray<NSString *>* result = [component getAnnotationFlags:uuid];
    resolve(result);
  });
}

RCT_EXPORT_METHOD(importXFDF:(id)filePath reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    NSDictionary *result = [component importXFDF:filePath withError:&error];
    if (result) {
      resolve(result);
    } else {
      reject(@"error", @"Failed to import XFDF.", error);
    }
  });
}

RCT_EXPORT_METHOD(exportXFDF:(id)filePath reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    NSDictionary *result = [component exportXFDF:filePath withError:&error];
    if (result) {
      resolve(result);
    } else {
      reject(@"error", @"Failed to export XFDF.", error);
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
        
        BOOL response = true;
        for (NSDictionary *config in configs) {
            BOOL result = [PspdfkitMeasurementConvertor addMeasurementValueConfigurationWithDocument:component.pdfController.document
                                                                                       configuration:config];
            if (result == false ) {
                response = false;
            }
        }
        // If any of the config in the array failed to set, reject the promise
        response ? resolve(@YES) : reject(@"error", @"Failed to set all measurement configuration.", nil);
    });
}

RCT_EXPORT_METHOD(getMeasurementValueConfigurations:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
      RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
      NSArray *result = [PspdfkitMeasurementConvertor getMeasurementValueConfigurationsWithDocument:component.pdfController.document];
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
