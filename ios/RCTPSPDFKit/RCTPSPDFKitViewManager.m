//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
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
#import "RCTPSPDFKitView.h"
#import <React/RCTUIManager.h>

@import PSPDFKit;
@import PSPDFKitUI;

// Custom annotation toolbar subclass that adds a "Clear" button that removes all visible annotations OR the current drawing view state.
@interface CustomButtonAnnotationToolbar : PSPDFAnnotationToolbar
@property (nonatomic) PSPDFToolbarButton *clearAnnotationsButton;
@end

@implementation RCTPSPDFKitViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(document, pdfController.document, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document = [RCTConvert PSPDFDocument:json];
    view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;

    // The author name may be set before the document exists. We set it again here when the document exists.
    if (view.annotationAuthorName) {
      view.pdfController.document.defaultAnnotationUsername = view.annotationAuthorName;
    }

    // Update the configuration to use the custom annotation tool bar.
    [view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
      [builder overrideClass:PSPDFAnnotationToolbar.class withClass:CustomButtonAnnotationToolbar.class];
    }];
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

RCT_CUSTOM_VIEW_PROPERTY(annotationAuthorName, pdfController.document.defaultAnnotationUsername, RCTPSPDFKitView) {
  if (json) {
    view.pdfController.document.defaultAnnotationUsername = json;
    view.annotationAuthorName = json;
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

RCT_REMAP_METHOD(getAnnotations, getAnnotations:(nonnull NSNumber *)pageIndex type:(NSString *)type reactTag:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSDictionary *annotations = [component getAnnotations:(PSPDFPageIndex)pageIndex.integerValue type:[RCTConvert annotationTypeFromInstantJSONType:type]];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get annotations", nil);
    }
  });
}

RCT_EXPORT_METHOD(addAnnotation:(NSString *)jsonAnnotation reactTag:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component addAnnotation:jsonAnnotation];
  });
}

RCT_EXPORT_METHOD(getAllUnsavedAnnotations:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    NSDictionary *annotations = [component getAllUnsavedAnnotations];
    if (annotations) {
      resolve(annotations);
    } else {
      reject(@"error", @"Failed to get annotations", nil);
    }
  });
}

RCT_EXPORT_METHOD(addAnnotations:(NSString *)jsonAnnotations reactTag:(nonnull NSNumber *)reactTag) {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTPSPDFKitView *component = (RCTPSPDFKitView *)[self.bridge.uiManager viewForReactTag:reactTag];
    [component addAnnotations:jsonAnnotations];
  });
}

- (UIView *)view {
  return [[RCTPSPDFKitView alloc] init];
}

@end

@implementation CustomButtonAnnotationToolbar

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Lifecycle

- (instancetype)initWithAnnotationStateManager:(PSPDFAnnotationStateManager *)annotationStateManager {
  if ((self = [super initWithAnnotationStateManager:annotationStateManager])) {
    // The biggest challenge here isn't the clear button, but correctly updating the clear button if we actually can clear something or not.
    NSNotificationCenter *dnc = NSNotificationCenter.defaultCenter;
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
    [dnc addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];

    // We could also use the delegate, but this is cleaner.
    [dnc addObserver:self selector:@selector(willShowSpreadViewNotification:) name:PSPDFDocumentViewControllerWillBeginDisplayingSpreadViewNotification object:nil];

    // Add clear button
    UIImage *clearImage = [[PSPDFKit imageNamed:@"trash"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    _clearAnnotationsButton = [PSPDFToolbarButton new];
    _clearAnnotationsButton.accessibilityLabel = @"Clear";
    [_clearAnnotationsButton setImage:clearImage];
    [_clearAnnotationsButton addTarget:self action:@selector(clearButtonPressed:) forControlEvents:UIControlEventTouchUpInside];

    [self updateClearAnnotationButton];
    self.additionalButtons = @[_clearAnnotationsButton];
  }
  return self;
}

- (void)dealloc {
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Clear Button Action

- (void)clearButtonPressed:(id)sender {
  // Iterate over all visible pages and remove all but links.
  PSPDFViewController *pdfController = self.annotationStateManager.pdfController;
  PSPDFDocument *document = pdfController.document;
  for (PSPDFPageView *pageView in pdfController.visiblePageViews) {
    NSArray<PSPDFAnnotation *> *annotations = [document annotationsForPageAtIndex:pageView.pageIndex type:PSPDFAnnotationTypeAll & ~(PSPDFAnnotationTypeLink | PSPDFAnnotationTypeWidget)];
    [document removeAnnotations:annotations options:nil];

    // Remove any annotation on the page as well (updates views)
    // Alternatively, you can call `reloadData` on the pdfController as well.
    for (PSPDFAnnotation *annotation in annotations) {
      [pageView removeAnnotation:annotation options:nil animated:YES];
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Notifications

// If we detect annotation changes, schedule a reload.
- (void)annotationChangedNotification:(NSNotification *)notification {
  // Re-evaluate toolbar button
  if (self.window) {
    [self updateClearAnnotationButton];
  }
}

- (void)willShowSpreadViewNotification:(NSNotification *)notification {
  [self updateClearAnnotationButton];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - PSPDFAnnotationStateManagerDelegate

- (void)annotationStateManager:(PSPDFAnnotationStateManager *)manager didChangeUndoState:(BOOL)undoEnabled redoState:(BOOL)redoEnabled {
  [super annotationStateManager:manager didChangeUndoState:undoEnabled redoState:redoEnabled];
  [self updateClearAnnotationButton];
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

- (void)updateClearAnnotationButton {
  __block BOOL annotationsFound = NO;
  PSPDFViewController *pdfController = self.annotationStateManager.pdfController;
  [pdfController.visiblePageIndexes enumerateIndexesUsingBlock:^(NSUInteger pageIndex, BOOL *stop) {
    NSArray<PSPDFAnnotation *> *annotations = [pdfController.document annotationsForPageAtIndex:pageIndex type:PSPDFAnnotationTypeAll & ~(PSPDFAnnotationTypeLink | PSPDFAnnotationTypeWidget)];
    if (annotations.count > 0) {
      annotationsFound = YES;
      *stop = YES;
    }
  }];
  self.clearAnnotationsButton.enabled = annotationsFound;
}

@end
