//
//  RCTPSPDFKit.m
//  PSPDFKit
//
//  Copyright (c) 2016 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKit.h"

#import "RCTLog.h"
#import "RCTUtils.h"
#import "RCTConvert.h"

@import PSPDFKit;

@implementation RCTPSPDFKit

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setLicenseKey:(NSString *)licenseKey) {
  [PSPDFKit setLicenseKey:licenseKey];
}

RCT_EXPORT_METHOD(present:(PSPDFDocument *)document withConfiguration:(PSPDFConfiguration *)configuration) {
  PSPDFViewController *pdfViewController = [[PSPDFViewController alloc] initWithDocument:document configuration:configuration];

  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:pdfViewController];

  UIViewController *presentingViewController = RCTPresentedViewController();
  [presentingViewController presentViewController:navigationController animated:YES completion:nil];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport
{
  return @{@"versionString": [PSPDFKit versionString],
           @"versionNumber": [PSPDFKit versionNumber],
           @"version": @([PSPDFKit version]),
           @"buildNumber": @([PSPDFKit buildNumber])};
}
@end
