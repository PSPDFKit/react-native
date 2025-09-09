//
//  Copyright © 2016-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitManager.h"

#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFAnnotationChange.h"
#import "RCTConvert+PSPDFDocument.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif
#import "RCTConvert+PSPDFConfiguration.h"

#define PROPERTY(property) NSStringFromSelector(@selector(property))

@import PSPDFKit;
@import PSPDFKitUI;
@import Instant;

@implementation RCTPSPDFKitManager

PSPDFSettingKey const PSPDFSettingKeyHybridEnvironment = @"com.pspdfkit.hybrid-environment";

RCT_EXPORT_MODULE(Nutrient)

- (void)setBridge:(RCTBridge *)bridge {
    [super setBridge:bridge];
    [NutrientNotificationCenter.shared setEventEmitter:self];
}

RCT_REMAP_METHOD(setLicenseKey, setLicenseKey:(nullable NSString *)licenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (![licenseKey isEqual:[NSNull null]]) {
    [PSPDFKitGlobal setLicenseKey:licenseKey options:@{PSPDFSettingKeyHybridEnvironment: @"ReactNative"}];
  }
  resolve(@(YES));
}

RCT_REMAP_METHOD(setLicenseKeys, setLicenseKeys:(nullable NSString *)androidLicenseKey iOSLicenseKey:(nullable NSString *)iOSLicenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  // Here, we ignore the `androidLicenseKey` parameter and only care about `iOSLicenseKey`.
  // `androidLicenseKey` will be used to activate the license on Android.
  if (![iOSLicenseKey isEqual:[NSNull null]]) {
    [PSPDFKitGlobal setLicenseKey:iOSLicenseKey options:@{PSPDFSettingKeyHybridEnvironment: @"ReactNative"}];
  }
  resolve(@(YES));
}

RCT_REMAP_METHOD(present, present:(PSPDFDocument *)document withConfiguration:(PSPDFConfiguration *)configuration resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  PSPDFViewController *pdfViewController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];
  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:pdfViewController];
  navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
  UIViewController *presentingViewController = RCTPresentedViewController();

  if (presentingViewController) {
    [presentingViewController presentViewController:navigationController animated:YES completion:^{
      resolve(@(YES));
    }];
  } else {
    reject(@"error", @"Failed to present document.", nil);
  }
}

RCT_REMAP_METHOD(dismiss, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIViewController *presentedViewController = RCTPresentedViewController();
  NSAssert([presentedViewController isKindOfClass:UINavigationController.class], @"Presented view controller needs to be a UINavigationController");
  UINavigationController *navigationController = (UINavigationController *)presentedViewController;
  NSAssert(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class], @"Presented view controller needs to contain a PSPDFViewController");

  if (navigationController) {
    [navigationController dismissViewControllerAnimated:YES completion:^{
      resolve(@(YES));
    }];
  } else {
    reject(@"error", @"Failed to dismiss", nil);
  }
}

RCT_REMAP_METHOD(setPageIndex, setPageIndex:(NSUInteger)pageIndex animated:(BOOL)animated resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIViewController *presentedViewController = RCTPresentedViewController();
  NSAssert([presentedViewController isKindOfClass:UINavigationController.class], @"Presented view controller needs to be a UINavigationController");
  UINavigationController *navigationController = (UINavigationController *)presentedViewController;
  NSAssert(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class], @"Presented view controller needs to contain a PSPDFViewController");

  PSPDFViewController *pdfViewController = (PSPDFViewController *)navigationController.viewControllers.firstObject;
  // Validate the the page index is not out of bounds.
  if (pageIndex < pdfViewController.document.pageCount) {
    [pdfViewController setPageIndex:pageIndex animated:animated];
    resolve(@(YES));
  } else {
    reject(@"error", @"Failed to set page index: The page index is out of bounds", nil);
  }
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDocumentProperties:(NSString *)documentPath) {
    
    NSURL *url = [RCTConvert parseURL:documentPath];
    PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:url];
    
    if (document == nil) {
        return @{
            @"documentId": [NSNull null],
            @"pageCount": @0,
            @"isEncrypted": @NO
        };
    }
    
    return @{
        @"documentId": document.documentIdString,
        @"pageCount": @(document.pageCount),
        @"isEncrypted": @(document.isEncrypted)
    };
}

// MARK: - Annotation Processing

RCT_EXPORT_METHOD(processAnnotations:(PSPDFAnnotationChange)annotationChange annotationTypes:(NSArray *)annotationTypes sourceDocument:(nonnull PSPDFDocument *)sourceDocument processedDocumentPath:(nonnull NSString *)processedDocumentPath password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    if (password != nil) {
      [sourceDocument unlockWithPassword:password];
    }
    NSError *error;
    NSURL *processedDocumentURL = [NSURL fileURLWithPath:processedDocumentPath];
    // Create a processor configuration with the current document.
    PSPDFProcessorConfiguration *configuration = [[PSPDFProcessorConfiguration alloc] initWithDocument:sourceDocument];

    PSPDFAnnotationType types = [RCTConvert parseAnnotationTypes:annotationTypes];
    // Modify annotations.
    [configuration modifyAnnotationsOfTypes:types change:annotationChange];

    // Create the PDF processor and write the processed file.
    PSPDFProcessor *processor = [[PSPDFProcessor alloc] initWithConfiguration:configuration securityOptions:nil];
    BOOL success = [processor writeToFileURL:processedDocumentURL error:&error];
    
    if (success) {
        resolve(@(success));
    } else {
        reject(@"error", @"Failed to process annotations.", error);
    }
}

RCT_EXPORT_METHOD(presentInstant: (NSDictionary*)documentData configuration: (NSDictionary*)configuration resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"presentInstant %@", configuration);

    NSString* jwt = [documentData objectForKey:@"jwt"];
    NSURL* serverUrl = [[NSURL alloc] initWithString: [documentData objectForKey:@"serverUrl"]];
    NSError *error;

    InstantDocumentInfo* documentInfo = [[InstantDocumentInfo alloc] initWithServerURL:serverUrl jwt:jwt];
    NSMutableDictionary* parsedConfig = [[RCTConvert processConfigurationOptionsDictionaryForPrefix: configuration] mutableCopy];
    if(![configuration objectForKey:@"enableInstantComments"]) {
        [parsedConfig setValue:@(YES) forKey: @"enableInstantComments"];
    }
    NSNumber* delay = [NSNumber numberWithInt:[configuration[@"delay"] intValue]];
    [parsedConfig removeObjectForKey:@"delay"];
    
    PSPDFConfiguration* pdfConfiguration = [[PSPDFConfiguration defaultConfiguration] configurationUpdatedWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
        if([[configuration objectForKey:@"enableInstantComments"]  isEqual:@(YES)]) {
            NSMutableSet *editableAnnotationTypes = [builder.editableAnnotationTypes mutableCopy];
            [editableAnnotationTypes addObject:PSPDFAnnotationStringInstantCommentMarker];
            builder.editableAnnotationTypes = editableAnnotationTypes;
        }
        [builder setupFromJSON:parsedConfig];
    }];

    InstantDocumentViewController *instantViewController = [[InstantDocumentViewController alloc] initWithDocumentInfo:documentInfo configuration:pdfConfiguration error:&error];

    if ([delay doubleValue] > 0) {
        instantViewController.documentDescriptor.delayForSyncingLocalChanges = [delay doubleValue];
    }

    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController: instantViewController];
    navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
    UIViewController *presentingViewController = RCTPresentedViewController();

    if (presentingViewController) {
        [presentingViewController showViewController: navigationController sender:self];
    } else {
        NSLog(@"Error presenting instant view controller %@", error.localizedDescription);
        NSString* errorMessage = [NSString stringWithFormat: @"Failed to present instant document. %@", error.localizedDescription];
        reject(@"error", errorMessage, nil);
    }
}

RCT_EXPORT_METHOD(setDelayForSyncingLocalChanges: (NSNumber*)delay resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    if (delay == nil || [delay doubleValue] < 0) {
        reject(@"error", @"Delay must be a positive number", nil);
    }
    UIViewController *presentingViewController = RCTPresentedViewController();

    // if pdfViewController is an instance of InstantDocumentViewController, then we can set the delay
    if ([presentingViewController isKindOfClass:[InstantDocumentViewController class]]) {
        InstantDocumentViewController *instantDocumentViewController = (InstantDocumentViewController *)presentingViewController;
        instantDocumentViewController.documentDescriptor.delayForSyncingLocalChanges = [delay doubleValue];
        resolve(@(YES));
    }

    reject(@"error", @"Delay can only be set for Instant documents", nil);
}

RCT_EXPORT_METHOD(handleListenerAdded:(nonnull NSString* )event
                  componentID:(NSNumber *)componentID
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if ([event isEqualToString:@"analytics"]) {
        [NutrientNotificationCenter.shared analyticsEnabled];
    }
    resolve(@1);
}

RCT_EXPORT_METHOD(handleListenerRemoved:(nonnull NSString* )event
                  componentID:(NSNumber *)componentID
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if ([event isEqualToString:@"analytics"]) {
        [NutrientNotificationCenter.shared analyticsDisabled];
    }
    resolve(@1);
}

- (NSArray<NSString*> *)supportedEvents {
    return @[@"documentLoaded",
             @"documentLoadFailed",
             @"documentPageChanged",
             @"documentScrolled",
             @"documentTapped",
             @"annotationsAdded",
             @"annotationChanged",
             @"annotationsRemoved",
             @"annotationsSelected",
             @"annotationsDeselected",
             @"annotationTapped",
             @"textSelected",
             @"formFieldValuesUpdated",
             @"formFieldSelected",
             @"formFieldDeselected",
             @"analytics",
             @"bookmarksChanged"];
}

// Called by React Native when the first event is registered
- (void)startObserving {
    [NutrientNotificationCenter.shared setIsInUse:YES];
}

// Called by React Native when the last event is unregistered
- (void)stopObserving {
    [NutrientNotificationCenter.shared setIsInUse:NO];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport {
  return @{PROPERTY(versionString): PSPDFKitGlobal.versionString,
           PROPERTY(versionNumber): PSPDFKitGlobal.versionNumber,
           PROPERTY(buildNumber): @(PSPDFKitGlobal.buildNumber)};
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
