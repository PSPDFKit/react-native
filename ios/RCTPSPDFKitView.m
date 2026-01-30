//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitView.h"
#import <React/RCTUtils.h>
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFViewMode.h"
#import "RCTConvert+UIBarButtonItem.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTConvert+PSPDFConfiguration.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#define VALIDATE_DOCUMENT(document, ...) { if (!document.isValid) { NSLog(@"Document is invalid."); NSString *errorCode = (document.isEncrypted) ? @"ENCRYPTED" : @"CORRUPTED"; NSString *errorMessage = (document.isEncrypted) ? @"Could not open document. Document is encrypted." : @"Could not open document: Invalid format or corrupted."; [NutrientNotificationCenter.shared documentLoadFailedWithCode:errorCode message:errorMessage componentID:self.componentID]; if (self.onDocumentLoadFailed) { self.onDocumentLoadFailed(@{ @"error": errorMessage }); } if ([self.delegate respondsToSelector:@selector(pspdfView:didFailToLoadDocumentWithError:)]) { BOOL shouldCallDelegate = YES; if ([self.delegate respondsToSelector:@selector(isEventEmitterReady)]) { shouldCallDelegate = [(id<RCTPSPDFKitViewDelegate>)self.delegate isEventEmitterReady]; } if (shouldCallDelegate) { [self.delegate pspdfView:self didFailToLoadDocumentWithError:errorMessage]; } else { [_sessionStorage addPendingCallback:CallbackTypeOnDocumentLoadFailed]; } } return __VA_ARGS__; }}

@interface RCTPSPDFKitViewController : PSPDFViewController
@property (nonatomic, strong) SessionStorage *sessionStorage;
@end

@interface RCTPSPDFKitView ()<PSPDFDocumentDelegate, PSPDFViewControllerDelegate, PSPDFFlexibleToolbarContainerDelegate, PDFDocumentManagerDelegate, PSPDFDocumentViewControllerDelegate>

@property (nonatomic, nullable) UIViewController *topController;
@property (nonatomic, strong) SessionStorage *sessionStorage;
@property (nonatomic) BOOL isPropsSet;
@property (nonatomic, strong) UITapGestureRecognizer *tapGestureRecognizer;

@end

@implementation RCTPSPDFKitView

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _pdfController = [[RCTPSPDFKitViewController alloc] init];
    _pdfController.delegate = self;
    _pdfController.annotationToolbarController.delegate = self;
    _sessionStorage = [SessionStorage new];
    ((RCTPSPDFKitViewController *)_pdfController).sessionStorage = _sessionStorage;
    
    // Store the closeButton's target and selector in order to call it later.
      [_sessionStorage setCloseButtonAttributes:@{@"target" : _pdfController.closeButtonItem.target,
                                                  @"action" : NSStringFromSelector(_pdfController.closeButtonItem.action)}];
      
    [_pdfController.closeButtonItem setTarget:self];
    [_pdfController.closeButtonItem setAction:@selector(closeButtonPressed:)];
    _closeButton = _pdfController.closeButtonItem;
    
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationChangedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsAddedNotification object:nil];
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(annotationChangedNotification:) name:PSPDFAnnotationsRemovedNotification object:nil];

    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(spreadIndexDidChange:) name:PSPDFDocumentViewControllerSpreadIndexDidChangeNotification object:nil];
      
    [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(documentDidFinishRendering) name:PSPDFDocumentViewControllerDidConfigureSpreadViewNotification object:nil];
      
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(bookmarksDidChange:)
                                                 name:PSPDFBookmarksChangedNotification
                                               object:nil];
  }
    
  return self;
}

- (void)setDocument:(PSPDFDocument *)document {
    self.pdfController.document = document;
}

- (void)removeFromSuperview {
  // When the React Native `PSPDFKitView` in unmounted, we need to dismiss the `PSPDFViewController` to avoid orphan popovers.
  // See https://github.com/PSPDFKit/react-native/issues/277
  [self.pdfController dismissViewControllerAnimated:NO completion:NULL];
  [super removeFromSuperview];
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
    self.topController = [[PSPDFNavigationController alloc] initWithRootViewController:self.pdfController];
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

#if !RCT_NEW_ARCH_ENABLED
  // In Old Architecture, mirror reactTag to componentID so NotificationCenter can route events
  self.componentID = [self.reactTag integerValue];
#endif

  self.pdfController.pageIndex = self.pageIndex;
}

- (void)destroyViewControllerRelationship {
  if (self.topController.parentViewController) {
    [self.topController willMoveToParentViewController:nil];
    [self.topController removeFromParentViewController];
  }
    self.pdfController.document = nil;
}

- (void)closeButtonPressed:(nullable id)sender {
  if (self.onCloseButtonPressed) {
    self.onCloseButtonPressed(@{});
  } else {
      // Invoke the closeButtonItem's default behaviour
      id target = [_sessionStorage getCloseButtonAttributes][@"target"];
      NSString *action = [_sessionStorage getCloseButtonAttributes][@"action"];
      
      if (target != nil && action != nil) {
          SEL selector = NSSelectorFromString(action);
          IMP imp = [target methodForSelector:selector];
          void (*func)(id, SEL) = (void *)imp;
          func(target, selector);
      }
  }
  if ([self.delegate respondsToSelector:@selector(pspdfViewDidPressCloseButton:)]) {
    [self.delegate pspdfViewDidPressCloseButton:self];
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

- (BOOL)enterAnnotationCreationMode:(PSPDFAnnotationString)annotationType withVariant:(PSPDFAnnotationVariantString)annotationVariant {
  [self.pdfController setViewMode:PSPDFViewModeDocument animated:YES];
  [self.pdfController.annotationToolbarController updateHostView:self container:nil viewController:self.pdfController];
    if (annotationType != nil) {
        [self.pdfController.annotationStateManager setState:annotationType];
        [self.pdfController.annotationStateManager setVariant:annotationVariant];
    }
    
    // If already in editing mode, just change the tool
    if ([self.pdfController.annotationToolbarController isToolbarVisible]) {
        return YES;
    } else {
        return [self.pdfController.annotationToolbarController showToolbarAnimated:YES completion:NULL];
    }
}

- (BOOL)exitCurrentlyActiveMode {
  if ([self.pdfController.annotationToolbarController isToolbarVisible]) {
    return [self.pdfController.annotationToolbarController hideToolbarAnimated:YES completion:NULL];
  }
  return true;
}

- (BOOL)clearSelectedAnnotations {
    if (self.pdfController.visiblePageViews.count >= 1) {
        PSPDFPageView * pageView = self.pdfController.visiblePageViews[0];
        pageView.selectedAnnotations = @[];
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)selectAnnotations:(NSArray<NSDictionary *> *)annotationsJSON showContextualMenu:(BOOL)showContextualMenu {
    if (self.pdfController.visiblePageViews.count >= 1 && annotationsJSON.count > 0) {
        PSPDFDocument *document = self.pdfController.document;
        VALIDATE_DOCUMENT(document, NO)
        
        NSMutableArray *annotationsToSelect = [NSMutableArray new];
        NSArray<PSPDFAnnotation *> *allAnnotations = [[document allAnnotationsOfType:PSPDFAnnotationTypeAll].allValues valueForKeyPath:@"@unionOfArrays.self"];
        for (PSPDFAnnotation *annotation in allAnnotations) {
            for (NSDictionary *annotationJSON in annotationsJSON) {
                // Try to find the annotation according to either uuid or name
                if ((![annotationJSON[@"uuid"] isEqual:[NSNull null]] &&
                     ![annotation.uuid isEqual:[NSNull null]] &&
                     [annotation.uuid isEqualToString:annotationJSON[@"uuid"]]) ||
                    (![annotationJSON[@"name"] isEqual:[NSNull null]] &&
                     ![annotation.name isEqual:[NSNull null]] &&
                     [annotation.name isEqualToString:annotationJSON[@"name"]])) {
                          [annotationsToSelect addObject:annotation];
                          break;
                     }
              }
        }
        
        PSPDFPageView * pageView = self.pdfController.visiblePageViews[0];
        [pageView selectAnnotations:annotationsToSelect presentMenu:showContextualMenu animated:YES];
        return YES;
    } else {
        return NO;
    }
}

- (BOOL)saveCurrentDocumentWithError:(NSError *_Nullable *)error {
  return [self.pdfController.document saveWithOptions:nil error:error];
}

// MARK: - PSPDFDocumentDelegate

- (void)pdfDocumentDidSave:(nonnull PSPDFDocument *)document {
  if (self.onDocumentSaved) {
    self.onDocumentSaved(@{});
  }
  if ([self.delegate respondsToSelector:@selector(pspdfViewDidSaveDocument:)]) {
    [self.delegate pspdfViewDidSaveDocument:self];
  }
}

- (void)pdfDocument:(PSPDFDocument *)document saveDidFailWithError:(NSError *)error {
  if (self.onDocumentSaveFailed) {
    self.onDocumentSaveFailed(@{ @"error": error.description });
  }
  if ([self.delegate respondsToSelector:@selector(pspdfView:didFailToSaveDocumentWithError:)]) {
    [self.delegate pspdfView:self didFailToSaveDocumentWithError:error.description];
  }
}

// MARK: - PSPDFViewControllerDelegate

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController didTapOnAnnotation:(PSPDFAnnotation *)annotation annotationPoint:(CGPoint)annotationPoint annotationView:(UIView<PSPDFAnnotationPresenting> *)annotationView pageView:(PSPDFPageView *)pageView viewPoint:(CGPoint)viewPoint {
    [NutrientNotificationCenter.shared didTapAnnotationWithAnnotation:annotation annotationPoint:annotationPoint documentID:pdfController.document.documentIdString componentID:self.componentID];
    
  if (self.onAnnotationTapped) {
    NSData *annotationData = [annotation generateInstantJSONWithError:NULL];
    if (annotationData != nil) {
        NSDictionary *annotationDictionary = [NSJSONSerialization JSONObjectWithData:annotationData options:kNilOptions error:NULL];
        NSMutableDictionary *updatedDictionary = [[NSMutableDictionary alloc] initWithDictionary:annotationDictionary];
        [updatedDictionary setObject:annotation.uuid forKey:@"uuid"];
        self.onAnnotationTapped(updatedDictionary);
    }
  }
  return self.disableDefaultActionForTappedAnnotations;
}

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController shouldSaveDocument:(nonnull PSPDFDocument *)document withOptions:(NSDictionary<PSPDFDocumentSaveOption,id> *__autoreleasing  _Nonnull * _Nonnull)options {
  return !self.disableAutomaticSaving;
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didConfigurePageView:(PSPDFPageView *)pageView forPageAtIndex:(NSInteger)pageIndex {
  [self onStateChangedForPDFViewController:pdfController pageView:pageView pageAtIndex:pageIndex];
}

- (void)pdfViewController:(PSPDFViewController *)pdfController willBeginDisplayingPageView:(PSPDFPageView *)pageView forPageAtIndex:(NSInteger)pageIndex {
    BOOL hasPageClickGesture = NO;
    for (UIGestureRecognizer *gesture in pageView.gestureRecognizers) {
        if ([gesture.name isEqualToString:@"reactNativePageClick"]) {
            hasPageClickGesture = YES;
            break;
        }
    }
    if (hasPageClickGesture == NO) {
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] init];
        tapGestureRecognizer.name = @"reactNativePageClick";
        [tapGestureRecognizer addTarget:self action:@selector(tapGestureRecognizerDidChangeState:)];
        [_pdfController.interactions.allInteractions allowSimultaneousRecognitionWithGestureRecognizer:tapGestureRecognizer];
        [pageView addGestureRecognizer:tapGestureRecognizer];
    }
    
  [self onStateChangedForPDFViewController:pdfController pageView:pageView pageAtIndex:pageIndex];
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didChangeDocument:(nullable PSPDFDocument *)document {
    if (!document.isValid) {
        
        // For New Architecture (Fabric), check if event emitter is ready before calling delegate
        BOOL shouldCallDelegate = YES;
        if ([self.delegate respondsToSelector:@selector(isEventEmitterReady)]) {
            shouldCallDelegate = [(id<RCTPSPDFKitViewDelegate>)self.delegate isEventEmitterReady];
        }
        
        if ([self.delegate respondsToSelector:@selector(pspdfViewDidReady:)]) {
            if (shouldCallDelegate) {
                [self.delegate pspdfViewDidReady:self];
            } else {
                [_sessionStorage addPendingCallback:CallbackTypeOnReady];
            }
        }
        
        if ([self.delegate respondsToSelector:@selector(pspdfView:didFailToLoadDocumentWithError:)]) {
            if (shouldCallDelegate) {
                NSString *errorCode = (document && document.isEncrypted) ? @"ENCRYPTED" : @"CORRUPTED";
                NSString *errorMessage = (document && document.isEncrypted) ? @"Could not open document. Document is encrypted." : @"Could not open document: Invalid format or corrupted.";
                [self.delegate pspdfView:self didFailToLoadDocumentWithError:errorMessage];
                [NutrientNotificationCenter.shared documentLoadFailedWithCode:errorCode message:errorMessage componentID:self.componentID];
            } else {
                [_sessionStorage addPendingCallback:CallbackTypeOnDocumentLoadFailed];
            }
        }
        
        if ([self isPropsSet] == YES) {
            if (self.onReady) {
                self.onReady(@{});
            }
            if (self.onDocumentLoadFailed) {
                self.onDocumentLoadFailed(@{});
                NSString *errorCode = (document && document.isEncrypted) ? @"ENCRYPTED" : @"CORRUPTED";
                NSString *errorMessage = (document && document.isEncrypted) ? @"Could not open document. Document is encrypted." : @"Could not open document: Invalid format or corrupted.";
                [NutrientNotificationCenter.shared documentLoadFailedWithCode:errorCode message:errorMessage componentID:self.componentID];
            }
        } else {
            [_sessionStorage addPendingCallback:CallbackTypeOnReady];
            [_sessionStorage addPendingCallback:CallbackTypeOnDocumentLoadFailed];
        }
    }
}

- (UIMenu *)pdfViewController:(PSPDFViewController *)sender menuForAnnotations:(NSArray<PSPDFAnnotation *> *)annotations onPageView:(PSPDFPageView *)pageView appearance:(PSPDFEditMenuAppearance)appearance suggestedMenu:(UIMenu *)suggestedMenu {
    
    NSDictionary *annotationButtons = [_sessionStorage getAnnotationContextualMenuItems];
    
    if (annotationButtons[@"appearance"] == nil ||
        appearance == [RCTConvert PSPDFEditMenuAppearance:annotationButtons[@"appearance"]]) {
        
        if ([annotationButtons count] > 0) {
            UIMenu *newMenu;
            NSArray *items = annotationButtons[@"buttons"];
            
            if (annotationButtons[@"retainSuggestedMenuItems"] == nil || [annotationButtons[@"retainSuggestedMenuItems"] boolValue] == YES) {
                if (annotationButtons[@"position"] != nil && [annotationButtons[@"position"] isEqualToString:@"start"]) {
                    newMenu = [suggestedMenu menuByReplacingChildren:[items arrayByAddingObjectsFromArray:suggestedMenu.children]];
                } else {
                    newMenu = [suggestedMenu menuByReplacingChildren:[suggestedMenu.children arrayByAddingObjectsFromArray:items]];
                }
            } else {
                newMenu = [suggestedMenu menuByReplacingChildren:items];
            }
            return newMenu;
        } else {
            return suggestedMenu;
        }
    } else {
        return suggestedMenu;
    }
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didSelectAnnotations:(NSArray<PSPDFAnnotation *> *)annotations onPageView:(PSPDFPageView *)pageView {
    [NutrientNotificationCenter.shared didSelectAnnotationsWithAnnotations:annotations documentID:pdfController.document.documentIdString componentID:self.componentID];
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didDeselectAnnotations:(NSArray<PSPDFAnnotation *> *)annotations onPageView:(PSPDFPageView *)pageView {
    [NutrientNotificationCenter.shared didDeselectAnnotationsWithAnnotations:annotations documentID:pdfController.document.documentIdString componentID:self.componentID];
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didSelectText:(NSString *)text withGlyphs:(NSArray<PSPDFGlyph *> *)glyphs atRect:(CGRect)rect onPageView:(PSPDFPageView *)pageView {
    [NutrientNotificationCenter.shared didSelectTextWithText:text rect:rect documentID:pdfController.document.documentIdString componentID:self.componentID];
}

- (NSArray<PSPDFAnnotation *> *)pdfViewController:(PSPDFViewController *)pdfController shouldSelectAnnotations:(NSArray<PSPDFAnnotation *> *)annotations onPageView:(PSPDFPageView *)pageView {
    
    NSArray *excludedAnnotations = [_sessionStorage getExcludedAnnotations];
    
    if (excludedAnnotations.count == 0) {
        return annotations;
    }
    
    NSPredicate *predicate = [NSPredicate predicateWithBlock:^BOOL(PSPDFAnnotation *annotation, NSDictionary *bindings) {
        for (NSString *excludedUUID in excludedAnnotations) {
            if ([annotation.uuid isEqualToString:excludedUUID] ||
                (annotation.name && [annotation.name isEqualToString:excludedUUID])) {
                return NO; // Exclude this annotation
            }
        }
        return YES; // Include this annotation
    }];
    
    return [annotations filteredArrayUsingPredicate:predicate];
}

// MARK: - PSPDFDocumentViewControllerDelegate

- (void)documentViewController:(PSPDFDocumentViewController *)documentViewController didChangeContinuousSpreadIndex:(CGFloat)oldContinuousSpreadIndex {
    [NutrientNotificationCenter.shared documentScrolledWithSpreadIndex:oldContinuousSpreadIndex
                                                       scrollDirection:_pdfController.configuration.scrollDirection
                                                            documentID:_pdfController.document.documentIdString
                                                            componentID:self.componentID];
}

// MARK: - PSPDFFlexibleToolbarContainerDelegate

- (void)flexibleToolbarContainerDidShow:(PSPDFFlexibleToolbarContainer *)container {
  PSPDFPageIndex pageIndex = self.pdfController.pageIndex;
  PSPDFPageView *pageView = [self.pdfController pageViewForPageAtIndex:pageIndex];
  [self onStateChangedForPDFViewController:self.pdfController pageView:pageView pageAtIndex:pageIndex];
}

- (void)flexibleToolbarContainerDidHide:(PSPDFFlexibleToolbarContainer *)container {
  PSPDFPageIndex pageIndex = self.pdfController.pageIndex;
  PSPDFPageView *pageView = [self.pdfController pageViewForPageAtIndex:pageIndex];
  [self onStateChangedForPDFViewController:self.pdfController pageView:pageView pageAtIndex:pageIndex];
}

// MARK: - Instant JSON

- (NSDictionary<NSString *, NSArray<NSDictionary *> *> *)getAnnotations:(PSPDFPageIndex)pageIndex type:(PSPDFAnnotationType)type error:(NSError *_Nullable *)error {
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, nil);
  
  NSArray <PSPDFAnnotation *> *annotations = [document annotationsForPageAtIndex:pageIndex type:type];
  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONFromAnnotations:annotations error:error];
  return @{@"annotations" : annotationsJSON};
}

- (BOOL)addAnnotation:(id)jsonAnnotation error:(NSError *_Nullable *)error {
  NSData *data;
  if ([jsonAnnotation isKindOfClass:NSString.class]) {
    data = [jsonAnnotation dataUsingEncoding:NSUTF8StringEncoding];
  } else if ([jsonAnnotation isKindOfClass:NSDictionary.class])  {
    data = [NSJSONSerialization dataWithJSONObject:jsonAnnotation options:0 error:error];
  } else {
    NSLog(@"Invalid JSON Annotation.");
    return NO;
  }
  
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, NO)
  PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;
  
  BOOL success = NO;
  if (data) {
    PSPDFAnnotation *annotation = [PSPDFAnnotation annotationFromInstantJSON:data documentProvider:documentProvider error:error];
    if (annotation) {
      success = [document addAnnotations:@[annotation] options:nil];
    }
  }
  
  if (!success) {
    NSLog(@"Failed to add annotation.");
  }
  
  return success;
}

- (BOOL)removeAnnotations:(NSArray<NSDictionary *> *)annotationsJSON {
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, NO)

  NSMutableArray *annotationsToRemove = [NSMutableArray new];
  NSArray<PSPDFAnnotation *> *allAnnotations = [[document allAnnotationsOfType:PSPDFAnnotationTypeAll].allValues valueForKeyPath:@"@unionOfArrays.self"];
  for (PSPDFAnnotation *annotation in allAnnotations) {
      for (NSDictionary *annotationJSON in annotationsJSON) {
          // Try to remove the annotation according to either uuid or name
          if ((![annotationJSON[@"uuid"] isEqual:[NSNull null]] &&
               ![annotation.uuid isEqual:[NSNull null]] &&
               [annotation.uuid isEqualToString:annotationJSON[@"uuid"]]) ||
              (![annotationJSON[@"name"] isEqual:[NSNull null]] &&
               ![annotation.name isEqual:[NSNull null]] &&
               [annotation.name isEqualToString:annotationJSON[@"name"]])) {
                    [annotationsToRemove addObject:annotation];
                    break;
               }
        }
  }
  BOOL success = [document removeAnnotations:annotationsToRemove options:nil];
  return success;
}

- (NSDictionary<NSString *, NSArray<NSDictionary *> *> *)getAllUnsavedAnnotationsWithError:(NSError *_Nullable *)error {
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, nil)
  
  PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;
  NSData *data = [document generateInstantJSONFromDocumentProvider:documentProvider error:error];
  NSDictionary *annotationsJSON = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:error];
  return annotationsJSON;
}

- (NSDictionary<NSString *, NSArray<NSDictionary *> *> *)getAllAnnotations:(PSPDFAnnotationType)type error:(NSError *_Nullable *)error {
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, nil)

  NSArray<PSPDFAnnotation *> *annotations = [[document allAnnotationsOfType:type].allValues valueForKeyPath:@"@unionOfArrays.self"];
  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONFromAnnotations:annotations error:error];
  return @{@"annotations" : annotationsJSON};
}

- (BOOL)addAnnotations:(id)jsonAnnotations error:(NSError *_Nullable *)error {
  NSData *data;
  if ([jsonAnnotations isKindOfClass:NSString.class]) {
    data = [jsonAnnotations dataUsingEncoding:NSUTF8StringEncoding];
  } else if ([jsonAnnotations isKindOfClass:NSDictionary.class])  {
    data = [NSJSONSerialization dataWithJSONObject:jsonAnnotations options:0 error:error];
  } else {
    NSLog(@"Invalid JSON Annotations.");
    return NO;
  }
  
  PSPDFDataContainerProvider *dataContainerProvider = [[PSPDFDataContainerProvider alloc] initWithData:data];
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, NO)
  [document clearCache];
  PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;
  BOOL success = [document applyInstantJSONFromDataProvider:dataContainerProvider toDocumentProvider:documentProvider lenient:NO error:error];
  if (!success) {
    NSLog(@"Failed to add annotations.");
  }
  
  [self.pdfController reloadData];
  return success;
}

- (BOOL)setAnnotationFlags:(NSString *)uuid flags:(NSArray<NSString *> *)flags {
    
    PSPDFDocument *document = self.pdfController.document;
    VALIDATE_DOCUMENT(document, nil);
    
    NSArray<PSPDFAnnotation *> *allAnnotations = [[document allAnnotationsOfType:PSPDFAnnotationTypeAll].allValues valueForKeyPath:@"@unionOfArrays.self"];
    for (PSPDFAnnotation *annotation in allAnnotations) {
      if ([annotation.uuid isEqualToString:uuid] ||
          (![annotation.name isEqual:[NSNull null]] &&
           [annotation.name isEqualToString:uuid])) {
          NSUInteger convertedFlags = [RCTConvert parseAnnotationFlags:flags];
          [annotation setFlags:convertedFlags];
          [document.documentProviders.firstObject.annotationManager updateAnnotations:@[annotation] animated:YES];
          return YES;
      }
    }
    return NO;
}

- (NSArray <NSString *> *)getAnnotationFlags:(NSString *)uuid {
    
    PSPDFDocument *document = self.pdfController.document;
    VALIDATE_DOCUMENT(document, nil);
    
    NSArray<PSPDFAnnotation *> *allAnnotations = [[document allAnnotationsOfType:PSPDFAnnotationTypeAll].allValues valueForKeyPath:@"@unionOfArrays.self"];
    for (PSPDFAnnotation *annotation in allAnnotations) {
        if ([annotation.uuid isEqualToString:uuid] ||
            (![annotation.name isEqual:[NSNull null]] &&
             [annotation.name isEqualToString:uuid])) {
          PSPDFAnnotationFlags flags = annotation.flags;
          NSArray <NSString *>* convertedFlags = [RCTConvert convertAnnotationFlags:flags];
          return convertedFlags;
      }
    }
    return @[];
}

// MARK: - XFDF

- (NSDictionary *)importXFDF:(NSString *)filePath withError:(NSError *_Nullable *)error {
  
    NSURL *externalAnnotationsFile = [RCTConvert parseURL:filePath];
    PSPDFDocument *document = self.pdfController.document;
    VALIDATE_DOCUMENT(document, nil)
    
    PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;
    PSPDFFileDataProvider *dataProvider = [[PSPDFFileDataProvider alloc] initWithFileURL:externalAnnotationsFile];

    PSPDFXFDFParser *parser = [[PSPDFXFDFParser alloc] initWithDataProvider:dataProvider documentProvider:documentProvider];
    NSArray<PSPDFAnnotation *> *annotations = [parser parseWithError:error];

    BOOL result = [document addAnnotations:annotations options:nil];
    NSDictionary *response = @{@"success" : @(result)};
    return response;
}

- (NSDictionary *)exportXFDF:(NSString *)filePath withError:(NSError *_Nullable *)error {
    
    NSURL *externalAnnotationsFile = [RCTConvert parseURL:filePath];
    PSPDFDocument *document = self.pdfController.document;
    VALIDATE_DOCUMENT(document, nil)
    
    PSPDFDocumentProvider *documentProvider = document.documentProviders.firstObject;
    
    NSMutableArray<PSPDFAnnotation *> *annotations = [NSMutableArray<PSPDFAnnotation *> array];
    for (NSArray<PSPDFAnnotation *> *pageAnnotations in [document allAnnotationsOfType:PSPDFAnnotationTypeAll].allValues) {
        [annotations addObjectsFromArray:pageAnnotations];
    }
    
    PSPDFFileDataSink *dataSink = [[PSPDFFileDataSink alloc] initWithFileURL:externalAnnotationsFile options:PSPDFDataSinkOptionNone error:error];
    BOOL result = [[PSPDFXFDFWriter new] writeAnnotations:annotations toDataSink:dataSink documentProvider:documentProvider error:error];
    NSDictionary *response = @{@"success" : @(result), @"filePath" : filePath};
    return response;
}

// MARK: - Forms

- (NSDictionary<NSString *, id> *)getFormFieldValue:(NSString *)fullyQualifiedName {
  if (fullyQualifiedName.length == 0) {
    NSLog(@"Invalid fully qualified name.");
    return nil;
  }
  
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, nil)
  
  for (PSPDFFormElement *formElement in document.formParser.forms) {
    if ([formElement.fullyQualifiedFieldName isEqualToString:fullyQualifiedName]) {
      id formFieldValue = formElement.value;
      return @{@"value": formFieldValue ?: [NSNull new]};
    }
  }
  
  return @{@"error": @"Failed to get the form field value."};
}

- (BOOL)setFormFieldValue:(NSString *)value fullyQualifiedName:(NSString *)fullyQualifiedName {
  if (fullyQualifiedName.length == 0) {
    NSLog(@"Invalid fully qualified name.");
    return NO;
  }
  
  PSPDFDocument *document = self.pdfController.document;
  VALIDATE_DOCUMENT(document, NO)

  BOOL success = NO;
  for (PSPDFFormElement *formElement in document.formParser.forms) {
    if ([formElement.fullyQualifiedFieldName isEqualToString:fullyQualifiedName]) {
      if ([formElement isKindOfClass:PSPDFButtonFormElement.class]) {
        if ([value isEqualToString:@"selected"]) {
          [(PSPDFButtonFormElement *)formElement select];
          success = YES;
        } else if ([value isEqualToString:@"deselected"]) {
          [(PSPDFButtonFormElement *)formElement deselect];
          success = YES;
        }
      } else if ([formElement isKindOfClass:PSPDFChoiceFormElement.class]) {
        ((PSPDFChoiceFormElement *)formElement).selectedIndices = [NSIndexSet indexSetWithIndex:value.integerValue];
        success = YES;
      } else if ([formElement isKindOfClass:PSPDFTextFieldFormElement.class]) {
        formElement.contents = value;
        success = YES;
      } else if ([formElement isKindOfClass:PSPDFSignatureFormElement.class]) {
        NSLog(@"Signature form elements are not supported.");
        success = NO;
      } else {
        NSLog(@"Unsupported form element.");
        success = NO;
      }
      break;
    }
  }
  return success;
}

// MARK: - Notifications

- (void)annotationChangedNotification:(NSNotification *)notification {
    [NutrientNotificationCenter.shared annotationsChangedWithNotification:notification
                                                               documentID:self.pdfController.document.documentIdString
                                                              componentID:self.componentID];
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
  
  NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONFromAnnotations:annotations error:NULL];
  // Fabric path: delegate with JSON string; Paper path: structured payload
  if ([self.delegate respondsToSelector:@selector(pspdfView:didChangeAnnotationsWithChange:annotationsJSONString:)]) {
    NSError *err = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:annotationsJSON options:0 error:&err];
    NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : @"[]";
    [self.delegate pspdfView:self didChangeAnnotationsWithChange:change annotationsJSONString:jsonString];
  } else if (self.onAnnotationsChanged) {
    self.onAnnotationsChanged(@{ @"change" : change, @"annotations" : annotationsJSON });
  }
}

- (void)bookmarksDidChange:(NSNotification *)notification {
    [NutrientNotificationCenter.shared bookmarksChangedWithNotification:notification
                                                             documentID:self.pdfController.document.documentIdString
                                                            componentID:self.componentID];
}

- (void)tapGestureRecognizerDidChangeState:(UIGestureRecognizer *)gestureRecognizer {
    if (gestureRecognizer.state == UIGestureRecognizerStateEnded) {
        // Calculates the CGPoint location on the specific page
        PSPDFDocumentViewController *documentViewController = self.pdfController.documentViewController;
        PSPDFPageIndex pageIndex = [documentViewController.layout pageRangeForSpreadAtIndex:documentViewController.spreadIndex].location;
        PSPDFPageView *pageView = [self.pdfController pageViewForPageAtIndex:pageIndex];
        CGPoint point = [gestureRecognizer locationInView:gestureRecognizer.view];
        
        // Uses visiblePageIndex to determine which page was clicked when pageMode is double (side-by-side on iPad)
        CGPoint visiblePoint = [gestureRecognizer locationInView:pageView];
        PSPDFPageView *visiblePageView = [documentViewController visiblePageViewAtPoint:visiblePoint];
        PSPDFPageIndex visiblePageIndex = visiblePageView.pageIndex;
        
        [NutrientNotificationCenter.shared didTapDocumentWithTapPoint:point
                                                            pageIndex:visiblePageIndex
                                                           documentID:self.pdfController.document.documentIdString
                                                          componentID:self.componentID];
    }
}

- (void)spreadIndexDidChange:(NSNotification *)notification {
    PSPDFDocumentViewController *documentViewController = self.pdfController.documentViewController;
    if (notification.object != documentViewController) { return; }
    PSPDFPageIndex pageIndex = [documentViewController.layout pageRangeForSpreadAtIndex:documentViewController.spreadIndex].location;
    PSPDFPageView *pageView = [self.pdfController pageViewForPageAtIndex:pageIndex];
    [self onStateChangedForPDFViewController:self.pdfController pageView:pageView pageAtIndex:pageIndex];
    [NutrientNotificationCenter.shared documentPageChangedWithPageIndex:pageIndex >= self.pdfController.document.pageCount ? 0 : pageIndex
                                                             documentID:self.pdfController.document.documentIdString
                                                            componentID:self.componentID];
    
}

- (void)documentDidFinishRendering {
    _pdfController.documentViewController.delegate = self;
    // Remove observer after the initial notification
    [NSNotificationCenter.defaultCenter removeObserver:self
                                                  name:PSPDFDocumentViewControllerDidConfigureSpreadViewNotification
                                                object:nil];
    
    // For New Architecture (Fabric), check if event emitter is ready before calling delegate
    BOOL shouldCallDelegate = YES;
    if ([self.delegate respondsToSelector:@selector(isEventEmitterReady)]) {
        shouldCallDelegate = [(id<RCTPSPDFKitViewDelegate>)self.delegate isEventEmitterReady];
    }
    
    if ([self.delegate respondsToSelector:@selector(pspdfViewDidDocumentLoad:)]) {
        if (shouldCallDelegate) {
            [self.delegate pspdfViewDidDocumentLoad:self];
            [NutrientNotificationCenter.shared documentLoadedWithDocumentID:_pdfController.document.documentIdString componentID:self.componentID];
        } else {
            [_sessionStorage addPendingCallback:CallbackTypeOnDocumentLoaded];
        }
    }
    
    if ([self.delegate respondsToSelector:@selector(pspdfViewDidReady:)]) {
        if (shouldCallDelegate) {
            [self.delegate pspdfViewDidReady:self];
        } else {
          [_sessionStorage addPendingCallback:CallbackTypeOnReady];
        }
    }
    
    if ([self isPropsSet] == YES) {
        if (self.onReady) {
            self.onReady(@{});
        }
        
        if (self.onDocumentLoaded) {
            self.onDocumentLoaded(@{});
            [NutrientNotificationCenter.shared documentLoadedWithDocumentID:_pdfController.document.documentIdString componentID:self.componentID];
        }
    } else {
        [_sessionStorage addPendingCallback:CallbackTypeOnReady];
        [_sessionStorage addPendingCallback:CallbackTypeOnDocumentLoaded];
    }
}

// MARK: - Customize the Toolbar

- (void)setLeftBarButtonItems:(nullable NSArray *)items forViewMode:(nullable NSString *) viewMode animated:(BOOL)animated {
  NSMutableArray *leftItems = [NSMutableArray array];
  for (id item in items) {
      if ([item isKindOfClass:[NSString class]]) {
          UIBarButtonItem *barButtonItem = [RCTConvert uiBarButtonItemFrom:item forViewController:self.pdfController];
          if (barButtonItem && ![self.pdfController.navigationItem.rightBarButtonItems containsObject:barButtonItem]) {
            [leftItems addObject:barButtonItem];
          }
      } else if ([item isKindOfClass:[NSDictionary class]]) {
          UIImage *image = [[UIImage imageNamed:[item objectForKey:@"image"]]
                            imageWithRenderingMode:([item objectForKey:@"applyTemplate"] == nil || [[item objectForKey:@"applyTemplate"] isEqual:@YES]) ?
                            UIImageRenderingModeAlwaysTemplate : UIImageRenderingModeAlwaysOriginal];
          UIBarButtonItem *barButtonItem = [[UIBarButtonItem alloc] initWithImage:image style:UIBarButtonItemStylePlain target:self action:@selector(handleCustomBarButtonEvent:)];
          [_sessionStorage addBarButtonItem:barButtonItem key:[item objectForKey:@"id"]];
          if (barButtonItem && ![self.pdfController.navigationItem.rightBarButtonItems containsObject:barButtonItem]) {
            [leftItems addObject:barButtonItem];
          }
      }
  }
  
  if (viewMode.length) {
    [self.pdfController.navigationItem setLeftBarButtonItems:[leftItems copy] forViewMode:[RCTConvert PSPDFViewMode:viewMode] animated:animated];
  } else {
    [self.pdfController.navigationItem setLeftBarButtonItems:[leftItems copy] animated:animated];
  }
}

- (void)setRightBarButtonItems:(nullable NSArray <NSString *> *)items forViewMode:(nullable NSString *) viewMode animated:(BOOL)animated {
    NSMutableArray *rightItems = [NSMutableArray array];
    for (id item in items) {
        if ([item isKindOfClass:[NSString class]]) {
            UIBarButtonItem *barButtonItem = [RCTConvert uiBarButtonItemFrom:item forViewController:self.pdfController];
            if (barButtonItem && ![self.pdfController.navigationItem.leftBarButtonItems containsObject:barButtonItem]) {
              [rightItems addObject:barButtonItem];
            }
        } else if ([item isKindOfClass:[NSDictionary class]]) {
            UIImage *image = [[UIImage imageNamed:[item objectForKey:@"image"]]
                              imageWithRenderingMode:([item objectForKey:@"applyTemplate"] == nil || [[item objectForKey:@"applyTemplate"] isEqual:@YES]) ?
                              UIImageRenderingModeAlwaysTemplate : UIImageRenderingModeAlwaysOriginal];
            UIBarButtonItem *barButtonItem = [[UIBarButtonItem alloc] initWithImage:image style:UIBarButtonItemStylePlain target:self action:@selector(handleCustomBarButtonEvent:)];
            [_sessionStorage addBarButtonItem:barButtonItem key:[item objectForKey:@"id"]];
            if (barButtonItem && ![self.pdfController.navigationItem.leftBarButtonItems containsObject:barButtonItem]) {
              [rightItems addObject:barButtonItem];
            }
        }
    }
  
  if (viewMode.length) {
    [self.pdfController.navigationItem setRightBarButtonItems:[rightItems copy] forViewMode:[RCTConvert PSPDFViewMode:viewMode] animated:animated];
  } else {
    [self.pdfController.navigationItem setRightBarButtonItems:[rightItems copy] animated:animated];
  }
}

- (NSArray <NSString *> *)getLeftBarButtonItemsForViewMode:(NSString *)viewMode {
  NSArray *items;
  if (viewMode.length) {
    items = [self.pdfController.navigationItem leftBarButtonItemsForViewMode:[RCTConvert PSPDFViewMode:viewMode]];
  } else {
    items = [self.pdfController.navigationItem leftBarButtonItems];
  }
  
  return [self buttonItemsStringFromUIBarButtonItems:items];
}

- (NSArray <NSString *> *)getRightBarButtonItemsForViewMode:(NSString *)viewMode {
  NSArray *items;
  if (viewMode.length) {
    items = [self.pdfController.navigationItem rightBarButtonItemsForViewMode:[RCTConvert PSPDFViewMode:viewMode]];
  } else {
    items = [self.pdfController.navigationItem rightBarButtonItems];
  }
  
  return [self buttonItemsStringFromUIBarButtonItems:items];
}

// MARK: - Customize the Annotation Contextual Menu

- (void)setAnnotationContextualMenuItems:(NSDictionary *)items {
    
    NSArray *buttonItems = items[@"buttons"];
    
    NSMutableArray *updatedButtons = [NSMutableArray array];
    for (id item in buttonItems) {
        UIAction *menuAction = [UIAction actionWithTitle:item[@"title"] image:nil identifier:item[@"id"] handler:^(__kindof UIAction * _Nonnull action) {
          [self handleCustomAnnotationContextualMenuItemEvent:action];
        }];
        
        if (item[@"image"]) {
            // First check if the image specified is a system image
            UIImage *image = [UIImage systemImageNamed:item[@"image"]];
            // Otherwise lookup the image from the app bundle
            if (image == nil) {
                image = [[UIImage imageNamed:item[@"image"]]
                         imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
            }
            [menuAction setImage:image];
        }
        [updatedButtons addObject:menuAction];
    }
    
    NSMutableDictionary *updatedItems = [NSMutableDictionary dictionaryWithDictionary:items];
    [updatedItems setObject:updatedButtons forKey:@"buttons"];
    
    [_sessionStorage setAnnotationContextualMenuItems:updatedItems];
}

// MARK: - Specify Annotations that cannot be selected

- (void)setExcludedAnnotations:(NSArray *)annotations {
    [_sessionStorage setExcludedAnnotations:annotations];
}

- (BOOL)setUserInterfaceVisible:(BOOL)visible {
    [self.pdfController setUserInterfaceVisible:visible animated:YES];
    return YES;
}

// MARK: - Helpers

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
    [super didSetProps:changedProps];
    [self setIsPropsSet:YES];
    [self processPendingCallbacks];
    // Only apply config once all React props have been loaded
    if (_configurationJSON != nil) {
        [self applyDocumentConfiguration:_configurationJSON];
    }
}

- (void)processPendingCallbacks {
    NSArray *pending = [_sessionStorage getPendingCallbacks];
    [self processPendingCallbacks:pending];
}

- (void)processPendingCallbacks:(NSArray *)pending {
    for (int i = 0; i < pending.count; i++) {
        CallbackType callback = [pending[i] integerValue];
        switch (callback) {
            case CallbackTypeOnReady:
                if ([self.delegate respondsToSelector:@selector(pspdfViewDidReady:)]) {
                  [self.delegate pspdfViewDidReady:self];
                }
                if (self.onReady) {
                    self.onReady(@{});
                }
                break;
                
            case CallbackTypeOnDocumentLoaded:
                if ([self.delegate respondsToSelector:@selector(pspdfViewDidDocumentLoad:)]) {
                    [self.delegate pspdfViewDidDocumentLoad:self];
                    [NutrientNotificationCenter.shared documentLoadedWithDocumentID:_pdfController.document.documentIdString componentID:self.componentID];
                }
                if (self.onDocumentLoaded) {
                    self.onDocumentLoaded(@{});
                    [NutrientNotificationCenter.shared documentLoadedWithDocumentID:_pdfController.document.documentIdString componentID:self.componentID];
                }
                break;
                
            case CallbackTypeOnDocumentLoadFailed: {
                NSString *errorCode = (_pdfController.document && _pdfController.document.isEncrypted) ? @"ENCRYPTED" : @"CORRUPTED";
                NSString *errorMessage = (_pdfController.document && _pdfController.document.isEncrypted) ? @"Could not open document. Document is encrypted." : @"Could not open document: Invalid format or corrupted.";
                if ([self.delegate respondsToSelector:@selector(pspdfView:didFailToLoadDocumentWithError:)]) {
                    [self.delegate pspdfView:self didFailToLoadDocumentWithError:errorMessage];
                    [NutrientNotificationCenter.shared documentLoadFailedWithCode:errorCode message:errorMessage componentID:self.componentID];
                }
                if (self.onDocumentLoadFailed) {
                    self.onDocumentLoadFailed(@{});
                    [NutrientNotificationCenter.shared documentLoadFailedWithCode:errorCode message:errorMessage componentID:self.componentID];
                }
                break;
            }
                
            default:
                break;
        }
        [_sessionStorage removePendingCallback:callback];
    }
}

- (void)applyDocumentConfiguration:(id)configuration {
    [self.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
        [builder setupFromJSON:configuration];
    }];
    
    [self postProcessConfigurationOptionsWithJSON:configuration forPDFViewController:self.pdfController];
}

// These options are configuration options in Android, but not on iOS, so we apply them
// manually after we update the document configuration.
- (void)postProcessConfigurationOptionsWithJSON:(id)json forPDFViewController:(PSPDFViewController *)controller {
  if (json) {
    NSDictionary *dictionary = [RCTConvert processConfigurationOptionsDictionaryForPrefix:[RCTConvert NSDictionary:json]];
    if (dictionary[@"toolbarTitle"]) {
      NSString *title = [RCTConvert NSString:dictionary[@"toolbarTitle"]];
      controller.title = title;
    }
    if (dictionary[@"invertColors"]) {
      BOOL shouldInvertColors = [RCTConvert BOOL:dictionary[@"invertColors"]];
      controller.appearanceModeManager.appearanceMode = shouldInvertColors ? PSPDFAppearanceModeNight : PSPDFAppearanceModeDefault;
    }
      
    if ([dictionary objectForKey:@"documentPassword"]) {
        [controller.document unlockWithPassword:[dictionary objectForKey:@"documentPassword"]];
    }
      
    // Apply any measurementValueConfigurations once the document is loaded
    if ([dictionary objectForKey:@"measurementValueConfigurations"]) {
        NSArray *configs = [dictionary objectForKey:@"measurementValueConfigurations"];
          for (NSDictionary *config in configs) {
              [PspdfkitMeasurementConverter addMeasurementValueConfigurationWithDocument:controller.document
                                                                             configuration:config];
          }
      }
    
    if (dictionary[@"fileConflictResolution"]) {
        [_sessionStorage setFileConflictResolution:dictionary[@"fileConflictResolution"]];
    }
      
    if ([dictionary objectForKey:@"documentInfoOptions"]) {
      NSArray<NSString *> *iOSDocumentInfoOptions = [dictionary objectForKey:@"documentInfoOptions"];
      NSMutableArray<NSString *> *availableControllerOptions = [NSMutableArray array];

      for (NSString *optionString in iOSDocumentInfoOptions) {
          PSPDFDocumentInfoOption option = [RCTConvert PSPDFDocumentInfoOption:optionString];
          [availableControllerOptions addObject:option];
      }
      controller.documentInfoCoordinator.availableControllerOptions = [availableControllerOptions copy];
      }
      
    // Apply toolbar position configuration
    if ([dictionary objectForKey:@"toolbarPosition"] || [dictionary objectForKey:@"supportedToolbarPositions"]) {
        // Helper function to convert position string to enum
        PSPDFFlexibleToolbarPosition (^convertPositionString)(NSString *) = ^PSPDFFlexibleToolbarPosition(NSString *positionString) {
            if ([positionString isEqualToString:@"top"]) {
                return PSPDFFlexibleToolbarPositionTop;
            } else if ([positionString isEqualToString:@"left"]) {
                return PSPDFFlexibleToolbarPositionLeft;
            } else if ([positionString isEqualToString:@"right"]) {
                return PSPDFFlexibleToolbarPositionRight;
            }
            return PSPDFFlexibleToolbarPositionTop;
        };
        
        // Helper function to apply toolbar position configuration
        void (^applyToolbarPosition)(PSPDFFlexibleToolbar *) = ^(PSPDFFlexibleToolbar *toolbar) {
            if (toolbar != nil) {
                // Set supported toolbar positions
                if ([dictionary objectForKey:@"supportedToolbarPositions"]) {
                    NSArray<NSString *> *positions = [dictionary objectForKey:@"supportedToolbarPositions"];
                    PSPDFFlexibleToolbarPosition supportedPositions = 0;
                    for (NSString *positionString in positions) {
                        supportedPositions |= convertPositionString(positionString);
                    }
                    toolbar.supportedToolbarPositions = supportedPositions;
                }
                
                // Set toolbar position
                if ([dictionary objectForKey:@"toolbarPosition"]) {
                    NSString *positionString = [dictionary objectForKey:@"toolbarPosition"];
                    toolbar.toolbarPosition = convertPositionString(positionString);
                }
            }
        };
        
        // Apply to annotation toolbar
        PSPDFAnnotationToolbar *annotationToolbar = controller.annotationToolbarController.annotationToolbar;
        applyToolbarPosition(annotationToolbar);
        
        // Apply to document editor toolbar
        if (controller.documentEditorController != nil && 
            controller.documentEditorController.toolbarController != nil) {
            PSPDFFlexibleToolbar *documentEditorToolbar = controller.documentEditorController.toolbarController.documentEditorToolbar;
            applyToolbarPosition(documentEditorToolbar);
        }
    }
   }
}

- (void)onStateChangedForPDFViewController:(PSPDFViewController *)pdfController pageView:(PSPDFPageView *)pageView pageAtIndex:(NSInteger)pageIndex {
  
    BOOL isDocumentLoaded = [pdfController.document isValid];
    PSPDFPageCount pageCount = pdfController.document.pageCount;
    BOOL isAnnotationToolBarVisible = [pdfController.annotationToolbarController isToolbarVisible];
    BOOL hasSelectedAnnotations = pageView.selectedAnnotations.count > 0;
    BOOL hasSelectedText = pageView.selectionView.selectedText.length > 0;
    BOOL isFormEditingActive = NO;
    for (PSPDFAnnotation *annotation in pageView.selectedAnnotations) {
      if ([annotation isKindOfClass:PSPDFWidgetAnnotation.class]) {
        isFormEditingActive = YES;
        break;
      }
    }
    NSDictionary *stateDict = @{@"documentLoaded" : @(isDocumentLoaded),
                          @"currentPageIndex" : @(pdfController.pageIndex),
                          @"pageCount" : @(pageCount),
                          @"annotationCreationActive" : @(isAnnotationToolBarVisible),
                          @"affectedPageIndex": @(pageIndex),
                          @"annotationEditingActive" : @(hasSelectedAnnotations),
                          @"textSelectionActive" : @(hasSelectedText),
                          @"formEditingActive" : @(isFormEditingActive)
    };
    if (self.onStateChanged) {
        self.onStateChanged(stateDict);
    }
    if ([self.delegate respondsToSelector:@selector(pspdfView:didChangeState:)]) {
      [self.delegate pspdfView:self didChangeState:stateDict];
    }
}

- (NSArray <NSString *> *)buttonItemsStringFromUIBarButtonItems:(NSArray <UIBarButtonItem *> *)barButtonItems {
  NSMutableArray *barButtonItemsString = [NSMutableArray new];
  [barButtonItems enumerateObjectsUsingBlock:^(UIBarButtonItem * _Nonnull barButtonItem, NSUInteger idx, BOOL * _Nonnull stop) {
    NSString *buttonNameString = [RCTConvert stringBarButtonItemFrom:barButtonItem forViewController:self.pdfController];
    if (buttonNameString) {
        [barButtonItemsString addObject:buttonNameString];
    } else {
        NSString *customId = [self findCustomButtonID:barButtonItem];
        if (customId != nil) {
            [barButtonItemsString addObject:customId];
        }
    }
  }];
  return [barButtonItemsString copy];
}

- (NSString *)findCustomButtonID:(UIBarButtonItem *)barButton {
    NSString *foundKey = nil;
    NSArray *keys = [[_sessionStorage getBarButtonItems] allKeys];
    for (NSString *key in keys) {
        if ([[_sessionStorage getBarButtonItems] objectForKey:key] == barButton) {
            foundKey = key;
            break;
        }
    }
    return foundKey;
}

- (void)handleCustomBarButtonEvent:(id)sender {
    UIBarButtonItem *barButton = (UIBarButtonItem *)sender;
    if (self.onCustomToolbarButtonTapped) {
        NSString *customId = [self findCustomButtonID:barButton];
        if (customId != nil) {
            self.onCustomToolbarButtonTapped(@{ @"id" : customId });
        }
    }
    NSString *customId = [self findCustomButtonID:barButton];
    if (customId && [self.delegate respondsToSelector:@selector(pspdfView:didTapCustomToolbarButtonWithId:)]) {
        [self.delegate pspdfView:self didTapCustomToolbarButtonWithId:customId];
    }
}

- (void)handleCustomAnnotationContextualMenuItemEvent:(id)sender {
    UIAction *actionButton = (UIAction *)sender;
    if (self.onCustomAnnotationContextualMenuItemTapped) {
        NSString *customId = actionButton.identifier;
        if (customId != nil) {
            self.onCustomAnnotationContextualMenuItemTapped(@{ @"id" : customId });
        }
    }
    NSString *customId = actionButton.identifier;
    if (customId && [self.delegate respondsToSelector:@selector(pspdfView:didTapCustomAnnotationMenuItemWithId:)]) {
        [self.delegate pspdfView:self didTapCustomAnnotationMenuItemWithId:customId];
    }
}

- (void)updatePageIndex:(PSPDFPageIndex)pageIndex {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.pdfController.pageIndex = pageIndex;
    });
}

// MARK - Delegates

- (void)didReceiveAnnotationChangeWithChange:(NSString *)change annotations:(NSArray<PSPDFAnnotation *> *)annotations {
    
    NSArray <NSDictionary *> *annotationsJSON = [RCTConvert instantJSONFromAnnotations:annotations error:NULL];
    NSNotification *notification = [[NSNotification alloc] initWithName:PSPDFAnnotationsAddedNotification
                                                                 object:annotations
                                                               userInfo:nil];
    [NutrientNotificationCenter.shared annotationsChangedWithNotification:notification
                                                               documentID:self.pdfController.document.documentIdString
                                                              componentID:self.componentID];
    
    if ([self.delegate respondsToSelector:@selector(pspdfView:didChangeAnnotationsWithChange:annotationsJSONString:)]) {
        NSError *err = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:annotationsJSON options:0 error:&err];
        NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : @"[]";
        [self.delegate pspdfView:self didChangeAnnotationsWithChange:change annotationsJSONString:jsonString];
    } else if (self.onAnnotationsChanged) {
        self.onAnnotationsChanged(@{ @"change" : change, @"annotations" : annotationsJSON });
    }
}

- (void)reloadControllerData {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.pdfController reloadData];
    });
}

@end

@implementation RCTPSPDFKitViewController

- (void)viewWillTransitionToSize:(CGSize)newSize withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
  [super viewWillTransitionToSize:newSize withTransitionCoordinator:coordinator];
  
  /* Workaround for internal issue 25653:
   We re-apply the current view state to workaround an issue where the last page view would be layed out incorrectly
   in single page mode and scroll per spread page trasition after device rotation.

   We do this because the `PSPDFViewController` is not embedded as recommended in
   https://nutrient.io/guides/ios/current/customizing-the-interface/embedding-the-pdfviewcontroller-inside-a-custom-container-view-controller
   and because React Native itself handles the React Native view.

   TL;DR: We are adding the `PSPDFViewController` to `RCTPSPDFKitView` and not to the container controller's view.
   */
  [coordinator animateAlongsideTransition:NULL completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
    [self applyViewState:self.viewState animateIfPossible:NO];
  }];
}

- (BOOL)resolutionManager:(PSPDFConflictResolutionManager *)manager shouldPerformAutomaticResolutionForForDocument:(PSPDFDocument *)document dataProvider:(id<PSPDFCoordinatedFileDataProviding>)dataProvider conflictType:(PSPDFFileConflictType)type resolution:(inout PSPDFFileConflictResolution *)resolution {
        
    NSString *conflictResolution = [_sessionStorage getFileConflictResolution];

    if ([conflictResolution isEqualToString:@"default"]) {
        return [super resolutionManager:manager shouldPerformAutomaticResolutionForForDocument:document dataProvider:dataProvider conflictType:type resolution:resolution];
    } else if ([conflictResolution isEqualToString:@"close"]) {
        *resolution = PSPDFFileConflictResolutionClose;
        return YES;
    } else if ([conflictResolution isEqualToString:@"save"]) {
        *resolution = PSPDFFileConflictResolutionSave;
        return YES;
    } else if ([conflictResolution isEqualToString:@"reload"]) {
        *resolution = PSPDFFileConflictResolutionReload;
        return YES;
    }
    return NO;
}

@end
