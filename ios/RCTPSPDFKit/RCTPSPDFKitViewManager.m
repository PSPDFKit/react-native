//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitViewManager.h"
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTPSPDFKitView.h"
#import <React/RCTUIManager.h>

@import PSPDFKit;
@import PSPDFKitUI;

@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, pdfController.document, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document = [RCTConvert PSPDFDocument:json];
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;
  }
}

RCT_REMAP_VIEW_PROPERTY(pageIndex, pdfController.pageIndex, NSUInteger)

RCT_CUSTOM_VIEW_PROPERTY(configuration, PSPDFConfiguration, RCTPSPDFKitView) {
  if (json) {
    [view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
      [builder setupFromJSON:json];
    }];
  }
}

RCT_EXPORT_VIEW_PROPERTY(hideNavigationBar, BOOL)

RCT_EXPORT_VIEW_PROPERTY(disableDefaultActionForTappedAnnotations, BOOL)

RCT_EXPORT_VIEW_PROPERTY(disableAutomaticSaving, BOOL)

RCT_REMAP_VIEW_PROPERTY(color, tintColor, UIColor)

RCT_CUSTOM_VIEW_PROPERTY(showCloseButton, BOOL, RCTPSPDFKitView) {
  if (json && [RCTConvert BOOL:json]) {
    view.pdfController.navigationItem.leftBarButtonItems = @[view.closeButton];
  }
}

RCT_EXPORT_VIEW_PROPERTY(onCloseButtonPressed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaved, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onDocumentSaveFailed, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationTapped, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onAnnotationsChanged, RCTBubblingEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTBubblingEventBlock)

RCT_EXPORT_METHOD(saveCurrentDocument:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component saveCurrentDocument];
  });
}

- (UIView *)view {
  return [[RCTPSPDFKitView alloc] init];
}

@end
