//
//  Copyright © 2016-2022 PSPDFKit GmbH. All rights reserved.
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

#define PROPERTY(property) NSStringFromSelector(@selector(property))

@import PSPDFKit;
@import PSPDFKitUI;

@implementation RCTPSPDFKitManager

PSPDFSettingKey const PSPDFSettingKeyHybridEnvironment = @"com.pspdfkit.hybrid-environment";

RCT_EXPORT_MODULE(PSPDFKit)

RCT_REMAP_METHOD(setLicenseKey, setLicenseKey:(nullable NSString *)licenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [PSPDFKitGlobal setLicenseKey:licenseKey options:@{PSPDFSettingKeyHybridEnvironment: @"ReactNative"}];
  resolve(@(YES));
}

RCT_REMAP_METHOD(setLicenseKeys, setLicenseKeys:(nullable NSString *)androidLicenseKey iOSLicenseKey:(nullable NSString *)iOSLicenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  // Here, we ignore the `androidLicenseKey` parameter and only care about `iOSLicenseKey`.
  // `androidLicenseKey` will be used to activate the license on Android.
  [PSPDFKitGlobal setLicenseKey:iOSLicenseKey options:@{PSPDFSettingKeyHybridEnvironment: @"ReactNative"}];
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

// MARK: - Annotation Processing

RCT_REMAP_METHOD(processAnnotations, processAnnotations:(PSPDFAnnotationChange)annotationChange annotationType:(PSPDFAnnotationType)annotationType sourceDocument:(PSPDFDocument *)sourceDocument processedDocumentPath:(nonnull NSString *)processedDocumentPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSURL *processedDocumentURL = [NSURL fileURLWithPath:processedDocumentPath];

  // Create a processor configuration with the current document.
  PSPDFProcessorConfiguration *configuration = [[PSPDFProcessorConfiguration alloc] initWithDocument:sourceDocument];

  // Modify annotations.
  [configuration modifyAnnotationsOfTypes:annotationType change:annotationChange];

  // Create the PDF processor and write the processed file.
  PSPDFProcessor *processor = [[PSPDFProcessor alloc] initWithConfiguration:configuration securityOptions:nil];
  BOOL success = [processor writeToFileURL:processedDocumentURL error:&error];
  if (success) {
    resolve(@(success));
  } else {
    reject(@"error", @"Failed to process annotations.", error);
  }
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
