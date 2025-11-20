//
//  NutrientModuleCommon.m
//

#import "NutrientModuleCommon.h"
#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>
#import <Instant/Instant.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFAnnotationChange.h"
#import "RCTConvert+PSPDFDocument.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif
#import "RCTConvert+PSPDFConfiguration.h"

@implementation NutrientModuleCommon

+ (NSNumber *)setLicenseKey:(NSString * _Nullable)licenseKey {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (licenseKey && (id)licenseKey != (id)kCFNull) {
      [PSPDFKitGlobal setLicenseKey:licenseKey options:@{ @"com.pspdfkit.hybrid-environment": @"ReactNative" }];
    }
  });
  return @(YES);
}

+ (NSNumber *)setLicenseKeysWithAndroid:(NSString * _Nullable)androidLicenseKey iOS:(NSString * _Nullable)iOSLicenseKey {
  if (iOSLicenseKey && (id)iOSLicenseKey != (id)kCFNull) {
    [PSPDFKitGlobal setLicenseKey:iOSLicenseKey options:@{ @"com.pspdfkit.hybrid-environment": @"ReactNative" }];
  }
  return @(YES);
}

+ (NSDictionary *)documentPropertiesForPath:(NSString * _Nullable)documentPath {
  if (documentPath == nil) {
    return @{ @"documentId": [NSNull null], @"pageCount": @0, @"isEncrypted": @NO };
  }
  NSURL *url = [RCTConvert parseURL:documentPath];
  PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:url];
  if (!document) {
    return @{ @"documentId": [NSNull null], @"pageCount": @0, @"isEncrypted": @NO };
  }
  return @{ @"documentId": document.documentIdString ?: (id)[NSNull null],
            @"pageCount": @(document.pageCount),
            @"isEncrypted": @(document.isEncrypted) };
}

#pragma mark - Present/dismiss

+ (void)presentDocument:(PSPDFDocument *)document
        configuration:(PSPDFConfiguration *)configuration
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        PSPDFViewController *pdfViewController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:pdfViewController];
        navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
        UIViewController *presentingViewController = RCTPresentedViewController();
        if (presentingViewController) {
            
            [presentingViewController presentViewController:navigationController animated:YES completion:^{ resolve(@(YES)); }];
            
        } else {
            reject(@"error", @"Failed to present document.", nil);
        }
    });
}

+ (void)dismissWithResolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        if (![presentedViewController isKindOfClass:UINavigationController.class]) {
            reject(@"error", @"Presented view controller needs to be a UINavigationController", nil);
            return;
        }
        UINavigationController *navigationController = (UINavigationController *)presentedViewController;
        if (!(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class])) {
            reject(@"error", @"Presented view controller needs to contain a PSPDFViewController", nil);
            return;
        }
        [navigationController dismissViewControllerAnimated:YES completion:^{ resolve(@(YES)); }];
    });
}

#pragma mark - Navigation

+ (void)setPageIndex:(NSUInteger)pageIndex
            animated:(BOOL)animated
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *presentedViewController = RCTPresentedViewController();
        if (![presentedViewController isKindOfClass:UINavigationController.class]) {
            reject(@"error", @"Presented view controller needs to be a UINavigationController", nil);
            return;
        }
        UINavigationController *navigationController = (UINavigationController *)presentedViewController;
        if (!(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class])) {
            reject(@"error", @"Presented view controller needs to contain a PSPDFViewController", nil);
            return;
        }
        PSPDFViewController *pdfViewController = (PSPDFViewController *)navigationController.viewControllers.firstObject;
        if (pageIndex < pdfViewController.document.pageCount) {
            [pdfViewController setPageIndex:pageIndex animated:animated];
            resolve(@(YES));
        } else {
            reject(@"error", @"Failed to set page index: The page index is out of bounds", nil);
        }
    });
}

#pragma mark - Instant

+ (void)presentInstant:(NSDictionary *)documentData
        configuration:(NSDictionary *)configuration
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString* jwt = documentData[@"jwt"];
        NSURL* serverUrl = [[NSURL alloc] initWithString: documentData[@"serverUrl"]];
        NSError *error;
        if (jwt.length == 0 || serverUrl == nil) {
            reject(@"error", @"serverUrl and jwt are required", nil);
            return;
        }
        
        InstantDocumentInfo* documentInfo = [[InstantDocumentInfo alloc] initWithServerURL:serverUrl jwt:jwt];
        NSMutableDictionary* parsedConfig = [[RCTConvert processConfigurationOptionsDictionaryForPrefix: configuration] mutableCopy];
        if(!configuration[@"enableInstantComments"]) {
            parsedConfig[@"enableInstantComments"] = @(YES);
        }
        NSNumber* delay = @([configuration[@"delay"] intValue]);
        [parsedConfig removeObjectForKey:@"delay"];
        
        PSPDFConfiguration* pdfConfiguration = [[PSPDFConfiguration defaultConfiguration] configurationUpdatedWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
            if([configuration[@"enableInstantComments"] isEqual:@(YES)]) {
                NSMutableSet *editableAnnotationTypes = [builder.editableAnnotationTypes mutableCopy];
                [editableAnnotationTypes addObject:PSPDFAnnotationStringInstantCommentMarker];
                builder.editableAnnotationTypes = editableAnnotationTypes;
            }
            [builder setupFromJSON:parsedConfig];
        }];
        
        InstantDocumentViewController *instantViewController = [[InstantDocumentViewController alloc] initWithDocumentInfo:documentInfo configuration:pdfConfiguration error:&error];
        if (delay.doubleValue > 0) {
            instantViewController.documentDescriptor.delayForSyncingLocalChanges = delay.doubleValue;
        }
        
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController: instantViewController];
        navigationController.modalPresentationStyle = UIModalPresentationFullScreen;
        UIViewController *presentingViewController = RCTPresentedViewController();
        if (presentingViewController) {
            [presentingViewController presentViewController:navigationController animated:YES completion:^{
                resolve(@1);
            }];
        } else {
            NSString* errorMessage = [NSString stringWithFormat: @"Failed to present instant document. %@", error.localizedDescription];
            reject(@"error", errorMessage, nil);
        }
    });
}

+ (void)setDelayForSyncingLocalChanges:(NSNumber *)delay
                               resolve:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject {
  if (delay == nil || delay.doubleValue < 0) {
    reject(@"error", @"Delay must be a positive number", nil);
    return;
  }
  UIViewController *presentedViewController = RCTPresentedViewController();
  if ([presentedViewController isKindOfClass:[InstantDocumentViewController class]]) {
    InstantDocumentViewController *instantDocumentViewController = (InstantDocumentViewController *)presentedViewController;
    instantDocumentViewController.documentDescriptor.delayForSyncingLocalChanges = delay.doubleValue;
    resolve(@(YES));
    return;
  }
  reject(@"error", @"Delay can only be set for Instant documents", nil);
}

#pragma mark - Processing

+ (void)processAnnotationsChange:(PSPDFAnnotationChange)annotationChange
                 annotationTypes:(NSArray *)annotationTypes
                   sourceDocument:(PSPDFDocument *)sourceDocument
            processedDocumentPath:(NSString *)processedDocumentPath
                           password:(NSString * _Nullable)password
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
  if (password != nil) {
    [sourceDocument unlockWithPassword:password];
  }
  NSError *error = nil;
  NSURL *processedDocumentURL = [NSURL fileURLWithPath:processedDocumentPath];
  PSPDFProcessorConfiguration *configuration = [[PSPDFProcessorConfiguration alloc] initWithDocument:sourceDocument];
  PSPDFAnnotationType types = [RCTConvert parseAnnotationTypes:annotationTypes];
  [configuration modifyAnnotationsOfTypes:types change:annotationChange];
  PSPDFProcessor *processor = [[PSPDFProcessor alloc] initWithConfiguration:configuration securityOptions:nil];
  BOOL success = [processor writeToFileURL:processedDocumentURL error:&error];
  if (success) {
    resolve(@(success));
  } else {
    reject(@"error", @"Failed to process annotations.", error);
  }
}

#pragma mark - Listener lifecycle

+ (NSNumber *)handleListenerAdded:(NSString *)event {
    [NutrientNotificationCenter.shared setIsInUse:YES];
    if ([event isEqualToString:@"analytics"]) {
        [NutrientNotificationCenter.shared analyticsEnabled];
    }
    return @1;
}

+ (NSNumber *)handleListenerRemoved:(NSString * _Nullable)event isLast:(BOOL)isLast {
  if (isLast) {
    [NutrientNotificationCenter.shared setIsInUse:NO];
  }
  if ([event isEqualToString:@"analytics"]) {
    [NutrientNotificationCenter.shared analyticsDisabled];
  }
  return @1;
}

@end


