//
//  PSPDFKitManager.m
//  PSPDFKit
//
//  Created by Robert Wijas on 01/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "PSPDFKitManager.h"
#import "RCTLog.h"
#import "RCTUtils.h"
#import "RCTConvert.h"

@import PSPDFKit;

@implementation PSPDFKitManager

RCT_EXPORT_MODULE(PSPDFKit);

RCT_EXPORT_METHOD(test) {
  RCTLogInfo(@"testing...");
}

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

@interface RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument:(NSString *)string;

@end

@implementation RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument:(NSString *)string {
  NSString *documentPath = [[NSBundle mainBundle] pathForResource:string ofType:nil];

  return [PSPDFDocument documentWithURL:[NSURL fileURLWithPath:documentPath]];
}

@end

@interface RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json;

@end

@implementation RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json {
  NSDictionary *dictionary = [self NSDictionary:json];

  return [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
    builder.scrollDirection = [self PSPDFScrollDirection:dictionary[@"scrollDirection"]];
    builder.backgroundColor = [self UIColor:dictionary[@"backgroundColor"]];
  }];
}

RCT_ENUM_CONVERTER(PSPDFScrollDirection,
                   (@{@"horizontal" : @(PSPDFScrollDirectionHorizontal),
                      @"vertical" : @(PSPDFScrollDirectionVertical)}),
                   PSPDFScrollDirectionHorizontal,
                   unsignedIntegerValue)

@end

