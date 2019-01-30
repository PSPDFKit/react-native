//
//  Copyright © 2016-2018 PSPDFKit GmbH. All rights reserved.
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

#define PROPERTY(property) NSStringFromSelector(@selector(property))

@import PSPDFKit;
@import PSPDFKitUI;

@implementation RCTPSPDFKitManager

RCT_EXPORT_MODULE(PSPDFKit)

RCT_EXPORT_METHOD(setLicenseKey:(NSString *)licenseKey) {
  [PSPDFKit setLicenseKey:licenseKey];
}

RCT_EXPORT_METHOD(present:(PSPDFDocument *)document withConfiguration:(PSPDFConfiguration *)configuration) {
  PSPDFViewController *pdfViewController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];

  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:pdfViewController];

  UIViewController *presentingViewController = RCTPresentedViewController();
  [presentingViewController presentViewController:navigationController animated:YES completion:nil];
}

RCT_EXPORT_METHOD(dismiss) {
  UIViewController *presentedViewController = RCTPresentedViewController();
  NSAssert([presentedViewController isKindOfClass:UINavigationController.class], @"Presented view controller needs to be a UINavigationController");
  UINavigationController *navigationController = (UINavigationController *)presentedViewController;
  NSAssert(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class], @"Presented view controller needs to contain a PSPDFViewController");
  [navigationController dismissViewControllerAnimated:true completion:nil];
}

RCT_EXPORT_METHOD(setPageIndex:(NSUInteger)pageIndex animated:(BOOL)animated) {
  UIViewController *presentedViewController = RCTPresentedViewController();
  NSAssert([presentedViewController isKindOfClass:UINavigationController.class], @"Presented view controller needs to be a UINavigationController");
  UINavigationController *navigationController = (UINavigationController *)presentedViewController;
  NSAssert(navigationController.viewControllers.count == 1 && [navigationController.viewControllers.firstObject isKindOfClass:PSPDFViewController.class], @"Presented view controller needs to contain a PSPDFViewController");
  PSPDFViewController *pdfViewController = (PSPDFViewController *)navigationController.viewControllers.firstObject;

  [pdfViewController setPageIndex:pageIndex animated:animated];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport {
  return @{PROPERTY(versionString): PSPDFKit.versionString,
           PROPERTY(versionNumber): PSPDFKit.versionNumber,
           PROPERTY(buildNumber): @(PSPDFKit.buildNumber)};
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
