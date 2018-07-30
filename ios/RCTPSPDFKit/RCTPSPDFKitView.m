//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitView.h"
#import <React/RCTUtils.h>
#import "RCTConvert+PSPDFAnnotation.h"

@interface RCTPSPDFKitView ()<PSPDFDocumentDelegate, PSPDFViewControllerDelegate>

@property (nonatomic, nullable) UIViewController *topController;

@end

@implementation RCTPSPDFKitView

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _pdfController = [[PSPDFViewController alloc] init];
    _pdfController.delegate = self;
    _closeButton = [[UIBarButtonItem alloc] initWithImage:[PSPDFKit imageNamed:@"x"] style:UIBarButtonItemStylePlain target:self action:@selector(closeButtonPressed:)];

    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];
  }

  return self;
}

- (void)dealloc {
  [self destroyViewControllerRelationship];
  [NSNotificationCenter.defaultCenter removeObserver:self];
}

- (void)didMoveToWindow {
  UIViewController *controller = self.pspdf_parentViewController;
  if (controller == nil || self.window == nil || self.topController != nil) {
    return;
  }

  if (self.pdfController.configuration.useParentNavigationBar || self.hideNavigationBar) {
    self.topController = self.pdfController;

  } else {
    self.topController = [[PSPDFNavigationController alloc] initWithRootViewController:self.pdfController];;
  }

  UIView *topControllerView = self.topController.view;
  topControllerView.translatesAutoresizingMaskIntoConstraints = NO;

  [self addSubview:topControllerView];
  [controller addChildViewController:self.topController];
  [self.topController didMoveToParentViewController:controller];

  [NSLayoutConstraint activateConstraints:
   @[[topControllerView.topAnchor constraintEqualToAnchor:self.topAnchor],
     [topControllerView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
     [topControllerView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
     [topControllerView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
     ]];
}

- (void)destroyViewControllerRelationship {
  if (self.topController.parentViewController) {
    [self.topController willMoveToParentViewController:nil];
    [self.topController removeFromParentViewController];
  }
}

- (void)closeButtonPressed:(nullable id)sender {
  if (self.onCloseButtonPressed) {
    self.onCloseButtonPressed(@{});

  } else {
    // try to be smart and pop if we are not displayed modally.
    BOOL shouldDismiss = YES;
    if (self.pdfController.navigationController) {
      UIViewController *topViewController = self.pdfController.navigationController.topViewController;
      UIViewController *parentViewController = self.pdfController.parentViewController;
      if ((topViewController == self.pdfController || topViewController == parentViewController) && self.pdfController.navigationController.viewControllers.count > 1) {
        [self.pdfController.navigationController popViewControllerAnimated:YES];
        shouldDismiss = NO;
      }
    }
    if (shouldDismiss) {
      [self.pdfController dismissViewControllerAnimated:YES completion:NULL];
    }
  }
}

- (UIViewController *)pspdf_parentViewController {
  UIResponder *parentResponder = self;
  while ((parentResponder = parentResponder.nextResponder)) {
    if ([parentResponder isKindOfClass:UIViewController.class]) {
      return (UIViewController *)parentResponder;
    }
  }
  return nil;
}

- (void)saveCurrentDocument {
  [self.pdfController.document saveWithOptions:nil error:NULL];
}

#pragma mark - PSPDFDocumentDelegate

- (void)pdfDocumentDidSave:(nonnull PSPDFDocument *)document {
  if (self.onDocumentSaved) {
    self.onDocumentSaved(@{});
  }
}

- (void)pdfDocument:(PSPDFDocument *)document saveDidFailWithError:(NSError *)error {
  if (self.onDocumentSaveFailed) {
    self.onDocumentSaveFailed(@{@"error": error.description});
  }
}

#pragma mark - PSPDFViewControllerDelegate

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController didTapOnAnnotation:(PSPDFAnnotation *)annotation annotationPoint:(CGPoint)annotationPoint annotationView:(UIView<PSPDFAnnotationPresenting> *)annotationView pageView:(PSPDFPageView *)pageView viewPoint:(CGPoint)viewPoint {
  if (self.onAnnotationTapped) {
    NSData *annotationData = [annotation generateInstantJSONWithError:NULL];
    NSDictionary *annotationDictionary = [NSJSONSerialization JSONObjectWithData:annotationData options:kNilOptions error:NULL];
    self.onAnnotationTapped(annotationDictionary);
  }
  return self.disableDefaultActionForTappedAnnotations;
}

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController shouldSaveDocument:(nonnull PSPDFDocument *)document withOptions:(NSDictionary<PSPDFDocumentSaveOption,id> *__autoreleasing  _Nonnull * _Nonnull)options {
  return !self.disableAutomaticSaving;
}

- (void)pdfViewController:(PSPDFViewController *)pdfController willBeginDisplayingPageView:(PSPDFPageView *)pageView forPageAtIndex:(NSInteger)pageIndex {
  if (self.onStateChanged) {
    self.onStateChanged(@{@"currentPageIndex" : @(pageIndex), @"pageCount" : @(pdfController.document.pageCount)});
  }
}

#pragma mark - Instant JSON

- (NSDictionary *)getAnnotations:(PSPDFPageIndex)pageIndex type:(PSPDFAnnotationType)type {
  NSArray <PSPDFAnnotation *>* annotations = [self.pdfController.document annotationsForPageAtIndex:pageIndex type:type];
  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONAnnotationsFromPSPDFAnnotationArray:annotations];
  return @{@"annotations" : annotationsJSON};
}

- (void)addAnnotation:(NSString *)jsonAnnotation {
  if (jsonAnnotation.length == 0) {
    NSLog(@"Invalid JSON Annotation.");
    return;
  }

  NSData *data = [jsonAnnotation dataUsingEncoding:NSUTF8StringEncoding];
  PSPDFDocument *document = self.pdfController.document;
  PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;

  BOOL success = NO;
  if (data) {
    PSPDFAnnotation *annotation = [PSPDFAnnotation annotationFromInstantJSON:data documentProvider:documentProvider error:NULL];
    success = [document addAnnotations:@[annotation] options:nil];
  }

  if (!success){
    NSLog(@"Failed to add annotation.");
  }
}

- (NSDictionary *)getAllUnsavedAnnotations {
  [self.pdfController.document saveWithOptions:nil error:NULL];
  PSPDFDocumentProvider *documentProvider = self.pdfController.document.documentProviders.firstObject;
  NSData *data = [self.pdfController.document generateInstantJSONFromDocumentProvider:documentProvider error:NULL];
  NSDictionary *annotationsJSON = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:NULL];
  return annotationsJSON;
}

- (void)addAnnotations:(NSString *)jsonAnnotations {
  if (jsonAnnotations.length == 0) {
    NSLog(@"Invalid JSON Annotations.");
    return;
  }
  
  NSData *data = [jsonAnnotations dataUsingEncoding:NSUTF8StringEncoding];
  PSPDFDataContainerProvider *dataContainerProvider = [[PSPDFDataContainerProvider alloc] initWithData:data];
  PSPDFDocument *document = self.pdfController.document;
  PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;

  BOOL success = [document applyInstantJSONFromDataProvider:dataContainerProvider toDocumentProvider:documentProvider error:NULL];
  if (success){
    [self.pdfController reloadData];
  } else {
    NSLog(@"Failed to add annotations.");
  }
}

#pragma mark - Notifications

- (void)annotationChangedNotification:(NSNotification *)notification {
  id object = notification.object;
  NSArray <PSPDFAnnotation *> *annotations;
  if ([object isKindOfClass:NSArray.class]) {
    annotations = object;
  } else if ([object isKindOfClass:PSPDFAnnotation.class]) {
    annotations = @[object];
  } else {
    if (self.onAnnotationsChanged) {
      self.onAnnotationsChanged(@{@"error" : @"Invalid annotation error."});
    }
    return;
  }

  NSString *name = notification.name;
  NSString *change;
  if ([name isEqualToString:PSPDFAnnotationChangedNotification]) {
    change = @"changed";
  } else if ([name isEqualToString:PSPDFAnnotationsAddedNotification]) {
    change = @"added";
  } else if ([name isEqualToString:PSPDFAnnotationsRemovedNotification]) {
    change = @"removed";
  }

  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONAnnotationsFromPSPDFAnnotationArray:annotations];
  if (self.onAnnotationsChanged) {
    self.onAnnotationsChanged(@{@"change" : change, @"annotations" : annotationsJSON});
  }
}

@end
