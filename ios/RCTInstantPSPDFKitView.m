//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//

#if RCT_NEW_ARCH_ENABLED

#import "RCTInstantPSPDFKitView.h"
#import <Instant/Instant.h>
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+UIBarButtonItem.h"
#import "RCTConvert+PSPDFViewMode.h"
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@interface RCTInstantPSPDFKitView ()
@property (nonatomic, strong, nullable) InstantDocumentViewController *instantController;
@property (nonatomic, strong, nullable) UIViewController *topController;
@property (nonatomic, strong, nullable) NSDictionary *pendingDocumentInfo;
@property (nonatomic, strong, nullable) NSDictionary *pendingConfiguration;
@end

@implementation RCTInstantPSPDFKitView

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _pageIndex = 0;
  }
  return self;
}

- (PSPDFViewController *)pdfController {
  return (PSPDFViewController *)self.instantController;
}

- (void)setDocumentInfo:(NSDictionary *)info configuration:(NSDictionary *)configuration {
  if (!info || ![info isKindOfClass:[NSDictionary class]]) return;
  _pendingDocumentInfo = [info copy];
  _pendingConfiguration = [configuration copy];
  [self tryCreateInstantController];
}

- (void)tryCreateInstantController {
  if (!_pendingDocumentInfo || !self.window) return;

  NSDictionary *docDict = _pendingDocumentInfo;
  NSString *jwt = docDict[@"jwt"];
  NSString *serverUrlStr = docDict[@"serverUrl"];
  if (!jwt.length || !serverUrlStr.length) return;
  NSURL *serverUrl = [NSURL URLWithString:serverUrlStr];
  if (!serverUrl) return;

  NSError *error = nil;
  InstantDocumentInfo *documentInfo = [[InstantDocumentInfo alloc] initWithServerURL:serverUrl jwt:jwt];
  NSMutableDictionary *parsedConfig = [[RCTConvert processConfigurationOptionsDictionaryForPrefix:_pendingConfiguration] mutableCopy];
  if (!_pendingConfiguration[@"enableInstantComments"]) {
    parsedConfig[@"enableInstantComments"] = @YES;
  }
  NSNumber *delay = _pendingConfiguration[@"delay"] ? @([_pendingConfiguration[@"delay"] intValue]) : @0;
  [parsedConfig removeObjectForKey:@"delay"];

  PSPDFConfiguration *pdfConfiguration = [[PSPDFConfiguration defaultConfiguration] configurationUpdatedWithBuilder:^(PSPDFConfigurationBuilder *builder) {
    if ([_pendingConfiguration[@"enableInstantComments"] isEqual:@YES]) {
      NSMutableSet *editable = [builder.editableAnnotationTypes mutableCopy];
      if (editable) {
        [editable addObject:PSPDFAnnotationStringInstantCommentMarker];
        builder.editableAnnotationTypes = editable;
      }
    }
    [builder setupFromJSON:parsedConfig];
  }];

  InstantDocumentViewController *vc = [[InstantDocumentViewController alloc] initWithDocumentInfo:documentInfo configuration:pdfConfiguration error:&error];
  if (!vc) {
    // Mirror NutrientView: emit NotificationCenter documentLoadFailed.
    NSString *message = error.localizedDescription ?: @"Failed to create Instant view controller";
    [NutrientNotificationCenter.shared documentLoadFailedWithCode:@"CORRUPTED"
                                                          message:message
                                                      componentID:self.componentID];
    if ([self.delegate respondsToSelector:@selector(pspdfView:didFailToLoadDocumentWithError:)]) {
      [self.delegate pspdfView:self didFailToLoadDocumentWithError:message];
    }
    return;
  }
  if (delay.doubleValue > 0) {
    vc.documentDescriptor.delayForSyncingLocalChanges = delay.doubleValue;
  }

  vc.delegate = (id<PSPDFViewControllerDelegate>)self;
  _instantController = vc;
  _pendingDocumentInfo = nil;
  _pendingConfiguration = nil;

  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];
  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(spreadIndexDidChange:) name:PSPDFDocumentViewControllerSpreadIndexDidChangeNotification object:nil];
  [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(documentDidFinishRendering) name:PSPDFDocumentViewControllerDidConfigureSpreadViewNotification object:nil];

  [self didMoveToWindow];
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (!self.window) return;
  [self tryCreateInstantController];
  if (!self.instantController || _topController != nil) return;
  UIViewController *controller = [self pspdf_parentViewController];
  if (!controller) return;

  _topController = [[PSPDFNavigationController alloc] initWithRootViewController:self.instantController];
  UIView *topView = _topController.view;
  topView.translatesAutoresizingMaskIntoConstraints = NO;
  [self addSubview:topView];
  [controller addChildViewController:_topController];
  [_topController didMoveToParentViewController:controller];
  [NSLayoutConstraint activateConstraints:@[
    [topView.topAnchor constraintEqualToAnchor:self.topAnchor],
    [topView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
    [topView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
    [topView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
  ]];
  self.instantController.pageIndex = self.pageIndex;
}

- (UIViewController *)pspdf_parentViewController {
  UIResponder *r = self;
  while ((r = r.nextResponder)) {
    if ([r isKindOfClass:UIViewController.class]) return (UIViewController *)r;
  }
  return nil;
}

- (void)dealloc {
  [NSNotificationCenter.defaultCenter removeObserver:self];
  if (_topController.parentViewController) {
    [_topController willMoveToParentViewController:nil];
    [_topController removeFromParentViewController];
  }
  _instantController.document = nil;
}

- (void)processPendingCallbacks { /* no-op for Instant */ }

#pragma mark - PSPDFViewControllerDelegate (forward to our delegate)

- (void)pdfViewControllerDidDismiss:(PSPDFViewController *)pdfController {
  if ([self.delegate respondsToSelector:@selector(pspdfViewDidReady:)]) {
    [self.delegate pspdfViewDidReady:self];
  }
}

#pragma mark - Notifications

- (void)documentDidFinishRendering {
  if (self.instantController.document.isValid) {
    // Forward to NotificationCenter (New Architecture path uses delegate on NutrientTurboModule).
    [NutrientNotificationCenter.shared documentLoadedWithDocumentID:self.instantController.document.documentIdString
                                                        componentID:self.componentID];
    if ([self.delegate respondsToSelector:@selector(pspdfViewDidDocumentLoad:)]) {
      [self.delegate pspdfViewDidDocumentLoad:self];
    }
  }
  if ([self.delegate respondsToSelector:@selector(pspdfViewDidReady:)]) {
    [self.delegate pspdfViewDidReady:self];
  }
}

- (void)spreadIndexDidChange:(NSNotification *)note {
  if (note.object != self.instantController) return;
  // Document page changed.
  PSPDFDocumentViewController *documentViewController = self.instantController.documentViewController;
  PSPDFPageIndex pageIndex = [documentViewController.layout pageRangeForSpreadAtIndex:documentViewController.spreadIndex].location;
  [NutrientNotificationCenter.shared documentPageChangedWithPageIndex:pageIndex >= self.instantController.document.pageCount ? 0 : pageIndex
                                                           documentID:self.instantController.document.documentIdString
                                                          componentID:self.componentID];

  if ([self.delegate respondsToSelector:@selector(pspdfView:didChangeState:)]) {
    [self.delegate pspdfView:self didChangeState:@{}];
  }
}

- (void)annotationChangedNotification:(NSNotification *)note {
  // Route full annotation payload to NotificationCenter (matches NutrientView semantics).
  [NutrientNotificationCenter.shared annotationsChangedWithNotification:note
                                                             documentID:self.instantController.document.documentIdString
                                                            componentID:self.componentID];

  // Fabric delegate path: we currently emit only the change type and an empty annotations payload.
  NSString *change = @"modified";
  if ([note.name isEqualToString:PSPDFAnnotationsAddedNotification]) change = @"added";
  else if ([note.name isEqualToString:PSPDFAnnotationsRemovedNotification]) change = @"removed";
  NSString *jsonStr = @"[]";
  if ([self.delegate respondsToSelector:@selector(pspdfView:didChangeAnnotationsWithChange:annotationsJSONString:)]) {
    [self.delegate pspdfView:self didChangeAnnotationsWithChange:change annotationsJSONString:jsonStr];
  }
}

#pragma mark - Toolbar / actions (forward to instantController)

- (BOOL)enterAnnotationCreationMode:(PSPDFAnnotationString)annotationType withVariant:(PSPDFAnnotationVariantString)annotationVariant {
  // Not yet exposed by the Instant controller API in this integration.
  return NO;
}

- (BOOL)exitCurrentlyActiveMode {
  // Not yet exposed by the Instant controller API in this integration.
  return NO;
}

- (void)enterContentEditingMode {
  [self.instantController setViewMode:PSPDFViewModeDocumentEditor animated:YES];
}

- (void)updatePageIndex:(PSPDFPageIndex)pageIndex {
  _pageIndex = pageIndex;
  self.instantController.pageIndex = pageIndex;
}

- (void)applyDocumentConfiguration:(id)configuration {
  if (!self.instantController) return;
  NSDictionary *dict = [RCTConvert processConfigurationOptionsDictionaryForPrefix:[RCTConvert NSDictionary:configuration]];
  [self.instantController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
    [builder setupFromJSON:dict];
  }];
}

- (void)setExcludedAnnotations:(NSArray *)annotations {
  // Instant: no-op or forward if API exists
}

- (BOOL)setUserInterfaceVisible:(BOOL)visible {
  if (!self.instantController) return NO;
  [self.instantController setUserInterfaceVisible:visible animated:YES];
  return YES;
}

- (BOOL)executePendingActionWithRequestId:(NSString *)requestId allow:(BOOL)allow {
  // Not yet exposed by the Instant controller API in this integration.
  return NO;
}

- (void)setLeftBarButtonItems:(NSArray *)items forViewMode:(NSString *)viewMode animated:(BOOL)animated {
  if (!self.instantController) return;
  NSMutableArray *leftItems = [NSMutableArray array];
  for (id item in items) {
    if ([item isKindOfClass:[NSString class]]) {
      UIBarButtonItem *bbi = [RCTConvert uiBarButtonItemFrom:item forViewController:self.instantController];
      if (bbi) [leftItems addObject:bbi];
    }
  }
  if (viewMode.length) {
    [self.instantController.navigationItem setLeftBarButtonItems:[leftItems copy] forViewMode:[RCTConvert PSPDFViewMode:viewMode] animated:animated];
  } else {
    [self.instantController.navigationItem setLeftBarButtonItems:[leftItems copy] animated:animated];
  }
}

- (void)setRightBarButtonItems:(NSArray *)items forViewMode:(NSString *)viewMode animated:(BOOL)animated {
  if (!self.instantController) return;
  NSMutableArray *rightItems = [NSMutableArray array];
  for (id item in items) {
    if ([item isKindOfClass:[NSString class]]) {
      UIBarButtonItem *bbi = [RCTConvert uiBarButtonItemFrom:item forViewController:self.instantController];
      if (bbi) [rightItems addObject:bbi];
    }
  }
  if (viewMode.length) {
    [self.instantController.navigationItem setRightBarButtonItems:[rightItems copy] forViewMode:[RCTConvert PSPDFViewMode:viewMode] animated:animated];
  } else {
    [self.instantController.navigationItem setRightBarButtonItems:[rightItems copy] animated:animated];
  }
}

- (NSArray<NSString *> *)getLeftBarButtonItemsForViewMode:(NSString *)viewMode {
  if (!self.instantController) return @[];
  NSArray *items = viewMode.length
    ? [self.instantController.navigationItem leftBarButtonItemsForViewMode:[RCTConvert PSPDFViewMode:viewMode]]
    : [self.instantController.navigationItem leftBarButtonItems];
  return [self stringArrayFromBarButtonItems:items];
}

- (NSArray<NSString *> *)getRightBarButtonItemsForViewMode:(NSString *)viewMode {
  if (!self.instantController) return @[];
  NSArray *items = viewMode.length
    ? [self.instantController.navigationItem rightBarButtonItemsForViewMode:[RCTConvert PSPDFViewMode:viewMode]]
    : [self.instantController.navigationItem rightBarButtonItems];
  return [self stringArrayFromBarButtonItems:items];
}

- (NSArray<NSString *> *)stringArrayFromBarButtonItems:(NSArray<UIBarButtonItem *> *)barButtonItems {
  NSMutableArray<NSString *> *result = [NSMutableArray array];
  for (UIBarButtonItem *bbi in barButtonItems) {
    NSString *s = [RCTConvert stringBarButtonItemFrom:bbi forViewController:self.instantController];
    if (s.length) [result addObject:s];
  }
  return [result copy];
}

@end

#endif
