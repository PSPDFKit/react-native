//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RCTInstantPSPDFKitViewDelegate;

/// View that hosts InstantDocumentViewController for embedded Instant documents (New Architecture only).
@interface RCTInstantPSPDFKitView : UIView

@property (nonatomic, readonly) PSPDFViewController *pdfController; // InstantDocumentViewController as base for helper compatibility
@property (nonatomic) BOOL disableDefaultActionForTappedAnnotations;
@property (nonatomic) PSPDFPageIndex pageIndex;
@property (nonatomic, copy, nullable) NSString *annotationAuthorName;
@property (nonatomic, assign) BOOL hasShouldExecuteAction;
@property (nonatomic, weak, nullable) id<RCTInstantPSPDFKitViewDelegate> delegate;
@property (nonatomic, assign) NSInteger componentID;

/// Set Instant document info: @{ @"serverUrl": @"...", @"jwt": @"..." }. Creates InstantDocumentViewController.
- (void)setDocumentInfo:(nullable NSDictionary *)info configuration:(nullable NSDictionary *)configuration;

- (void)processPendingCallbacks;

- (BOOL)enterAnnotationCreationMode:(PSPDFAnnotationString)annotationType withVariant:(PSPDFAnnotationVariantString)annotationVariant;
- (BOOL)exitCurrentlyActiveMode;
- (void)enterContentEditingMode;
- (void)updatePageIndex:(PSPDFPageIndex)pageIndex;
- (void)applyDocumentConfiguration:(id)configuration;
- (void)setExcludedAnnotations:(NSArray *)annotations;
- (BOOL)setUserInterfaceVisible:(BOOL)visible;
- (BOOL)executePendingActionWithRequestId:(NSString *)requestId allow:(BOOL)allow;

- (void)setLeftBarButtonItems:(nullable NSArray *)items forViewMode:(nullable NSString *)viewMode animated:(BOOL)animated;
- (void)setRightBarButtonItems:(nullable NSArray *)items forViewMode:(nullable NSString *)viewMode animated:(BOOL)animated;
- (NSArray<NSString *> *)getLeftBarButtonItemsForViewMode:(NSString *)viewMode;
- (NSArray<NSString *> *)getRightBarButtonItemsForViewMode:(NSString *)viewMode;

@end

@protocol RCTInstantPSPDFKitViewDelegate <NSObject>
@optional
- (BOOL)isEventEmitterReady;
- (void)pspdfViewDidDocumentLoad:(RCTInstantPSPDFKitView *)view;
- (void)pspdfViewDidReady:(RCTInstantPSPDFKitView *)view;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didChangeState:(NSDictionary *)state;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didTapCustomToolbarButtonWithId:(NSString *)buttonId;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didTapCustomAnnotationMenuItemWithId:(NSString *)itemId;
- (void)pspdfViewDidPressCloseButton:(RCTInstantPSPDFKitView *)view;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didFailToLoadDocumentWithError:(NSString *)error;
- (void)pspdfViewDidSaveDocument:(RCTInstantPSPDFKitView *)view;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didFailToSaveDocumentWithError:(NSString *)error;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didChangeAnnotationsWithChange:(NSString *)change annotationsJSONString:(NSString *)annotationsJSONString;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didTapAnnotation:(PSPDFAnnotation *)annotation;
- (void)pspdfView:(RCTInstantPSPDFKitView *)view didRequestShouldExecuteActionWithPayload:(NSDictionary *)payload;
@end

NS_ASSUME_NONNULL_END
