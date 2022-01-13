//
//  Copyright © 2020-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "CustomPdfViewManager.h"
#import "CustomPdfView.h"
#import <React/RCTUIManager.h>
#import "RCTConvert+PSPDFDocument.h"

@implementation CustomPdfViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, PSPDFDocument, CustomPdfView) {
  if (json) {
    if ([json isKindOfClass:NSString.class]) {
      NSString *path = json;
      if ([path hasSuffix:@"|ADD_WATERMARK"]) {
        path = [path stringByReplacingOccurrencesOfString:@"|ADD_WATERMARK" withString:@""];
        view.pdfController.document = [RCTConvert PSPDFDocument:path];
        [view createWatermarkAndReloadData:NO];
        return;
      }
    }
    view.pdfController.document = [RCTConvert PSPDFDocument:json];
  }
}

RCT_EXPORT_VIEW_PROPERTY(onDocumentDigitallySigned, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(startSigning:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    CustomPdfView *component = (CustomPdfView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component startSigning];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to start signing document.", error);
    }
  });
}

RCT_EXPORT_METHOD(createWatermark:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    CustomPdfView *component = (CustomPdfView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component createWatermarkAndReloadData:YES];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to create watermark.", error);
    }
  });
}

RCT_EXPORT_METHOD(presentInstantExample:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    CustomPdfView *component = (CustomPdfView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSError *error;
    BOOL success = [component presentInstantExample];
    if (success) {
      resolve(@(success));
    } else {
      reject(@"error", @"Failed to present Instant Example.", error);
    }
  });
}

- (UIView *)view {
  return [[CustomPdfView alloc] init];
}

@end
