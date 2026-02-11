//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RCTPSPDFKitViewDelegate;

@interface RCTPSPDFKitView: UIView

@property (nonatomic, readonly) PSPDFViewController *pdfController;
@property (nonatomic) BOOL hideNavigationBar;
@property (nonatomic, readonly) UIBarButtonItem *closeButton;
@property (nonatomic) BOOL disableDefaultActionForTappedAnnotations;
@property (nonatomic) BOOL disableAutomaticSaving;
@property (nonatomic) PSPDFPageIndex pageIndex;
@property (nonatomic, copy, nullable) NSString *annotationAuthorName;
@property (nonatomic) PSPDFImageSaveMode imageSaveMode;
@property (nonatomic, copy) RCTBubblingEventBlock onCloseButtonPressed;
@property (nonatomic, copy) RCTBubblingEventBlock onDocumentSaved;
@property (nonatomic, copy) RCTBubblingEventBlock onDocumentSaveFailed;
@property (nonatomic, copy) RCTBubblingEventBlock onDocumentLoadFailed;
@property (nonatomic, copy) RCTBubblingEventBlock onAnnotationTapped;
@property (nonatomic, copy) RCTBubblingEventBlock onAnnotationsChanged;
@property (nonatomic, copy) RCTBubblingEventBlock onStateChanged;
@property (nonatomic, copy) RCTBubblingEventBlock onDocumentLoaded;
@property (nonatomic, copy) RCTBubblingEventBlock onReady;
@property (nonatomic, copy) RCTBubblingEventBlock onCustomToolbarButtonTapped;
@property (nonatomic, copy) RCTBubblingEventBlock onCustomAnnotationContextualMenuItemTapped;
@property (nonatomic, copy, nullable) NSArray<NSString *> *availableFontNames;
@property (nonatomic, copy, nullable) NSString *selectedFontName;
@property (nonatomic) BOOL showDownloadableFonts;
@property (nonatomic) id configurationJSON;
@property (nonatomic, weak, nullable) id<RCTPSPDFKitViewDelegate> delegate;
// Unified integer component identifier used for events (reactTag in old arch, nativeID in new arch)
@property (nonatomic, assign) NSInteger componentID;

- (void)processPendingCallbacks;

/// Annotation Toolbar
- (BOOL)enterAnnotationCreationMode:(PSPDFAnnotationString)annotationType withVariant:(PSPDFAnnotationVariantString)annotationVariant;
- (BOOL)exitCurrentlyActiveMode;

/// Content editing
- (void)enterContentEditingMode;

/// Document
- (void)setDocument:(PSPDFDocument *)document;
- (BOOL)saveCurrentDocumentWithError:(NSError *_Nullable *)error;
- (void)updatePageIndex:(PSPDFPageIndex)pageIndex;

/// Configuration
- (void)applyDocumentConfiguration:(id)configuration;

- (BOOL)clearSelectedAnnotations;
- (BOOL)selectAnnotations:(NSArray<NSDictionary *> *)annotationsJSON showContextualMenu:(BOOL)showContextualMenu;
- (void)setExcludedAnnotations:(NSArray *)annotations;
- (BOOL)setUserInterfaceVisible:(BOOL)visible;

/// Forms
- (NSDictionary<NSString *, NSString *> *)getFormFieldValue:(NSString *)fullyQualifiedName;
- (BOOL)setFormFieldValue:(NSString *)value fullyQualifiedName:(NSString *)fullyQualifiedName;

/// Toolbar buttons customizations
- (void)setLeftBarButtonItems:(nullable NSArray <NSString *> *)items forViewMode:(nullable NSString *) viewMode animated:(BOOL)animated;
- (void)setRightBarButtonItems:(nullable NSArray <NSString *> *)items forViewMode:(nullable NSString *) viewMode animated:(BOOL)animated;
- (NSArray <NSString *> *)getLeftBarButtonItemsForViewMode:(NSString *)viewMode;
- (NSArray <NSString *> *)getRightBarButtonItemsForViewMode:(NSString *)viewMode;

/// XFDF
- (NSDictionary *)importXFDF:(NSString *)filePath withError:(NSError *_Nullable *)error;
- (NSDictionary *)exportXFDF:(NSString *)filePath withError:(NSError *_Nullable *)error;

/// Annotation Contextual Menu Customization
- (void)setAnnotationContextualMenuItems:(NSDictionary *)items;

@end

@protocol RCTPSPDFKitViewDelegate <NSObject>
@optional
/** Check if event emitter is ready (for New Architecture Fabric) */
- (BOOL)isEventEmitterReady;
- (void)pspdfViewDidDocumentLoad:(RCTPSPDFKitView *)view;
- (void)pspdfViewDidReady:(RCTPSPDFKitView *)view;
- (void)pspdfView:(RCTPSPDFKitView *)view didChangeState:(NSDictionary *)state;
- (void)pspdfView:(RCTPSPDFKitView *)view didTapCustomToolbarButtonWithId:(NSString *)buttonId;
- (void)pspdfView:(RCTPSPDFKitView *)view didTapCustomAnnotationMenuItemWithId:(NSString *)itemId;
- (void)pspdfViewDidPressCloseButton:(RCTPSPDFKitView *)view;
- (void)pspdfView:(RCTPSPDFKitView *)view didFailToLoadDocumentWithError:(NSString *)error;
- (void)pspdfViewDidSaveDocument:(RCTPSPDFKitView *)view;
- (void)pspdfView:(RCTPSPDFKitView *)view didFailToSaveDocumentWithError:(NSString *)error;
/** Annotation changes callback for New Architecture bridging */
- (void)pspdfView:(RCTPSPDFKitView *)view didChangeAnnotationsWithChange:(NSString *)change annotationsJSONString:(NSString *)annotationsJSONString;
@end

NS_ASSUME_NONNULL_END
