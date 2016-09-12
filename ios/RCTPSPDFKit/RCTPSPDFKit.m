//
//  RCTPSPDFKit.m
//  RCTPSPDFKit
//
//  Created by Robert Wijas on 09/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
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

RCT_EXPORT_METHOD(present:(PSPDFDocument *)document) {
  [self present:document withConfiguration:nil];
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

@end
