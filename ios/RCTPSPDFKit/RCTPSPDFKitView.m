//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
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
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#define VALIDATE_DOCUMENT(document, ...) { if (!document.isValid) { NSLog(@"Document is invalid."); if (self.onDocumentLoadFailed) { self.onDocumentLoadFailed(@{@"error": @"Document is invalid."}); } return __VA_ARGS__; }}

@interface RCTPSPDFKitViewController : PSPDFViewController
@end

@interface RCTPSPDFKitView ()<PSPDFDocumentDelegate, PSPDFViewControllerDelegate, PSPDFFlexibleToolbarContainerDelegate>

@property (nonatomic, nullable) UIViewController *topController;
@property (nonatomic, strong) SessionStorage *sessionStorage;

@end

@implementation RCTPSPDFKitView

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _pdfController = [[RCTPSPDFKitViewController alloc] init];
    _pdfController.delegate = self;
    _pdfController.annotationToolbarController.delegate = self;
    _sessionStorage = [SessionStorage new];
    
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
  }
  
  return self;
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

  self.pdfController.pageIndex = self.pageIndex;
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

- (BOOL)enterAnnotationCreationMode {
  [self.pdfController setViewMode:PSPDFViewModeDocument animated:YES];
  [self.pdfController.annotationToolbarController updateHostView:self container:nil viewController:self.pdfController];
  return [self.pdfController.annotationToolbarController showToolbarAnimated:YES completion:NULL];
}

- (BOOL)exitCurrentlyActiveMode {
  if ([self.pdfController.annotationToolbarController isToolbarVisible]) {
    return [self.pdfController.annotationToolbarController hideToolbarAnimated:YES completion:NULL];
  }
  return true;
}

- (BOOL)saveCurrentDocumentWithError:(NSError *_Nullable *)error {
  return [self.pdfController.document saveWithOptions:nil error:error];
}

// MARK: - PSPDFDocumentDelegate

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

// MARK: - PSPDFViewControllerDelegate

- (BOOL)pdfViewController:(PSPDFViewController *)pdfController didTapOnAnnotation:(PSPDFAnnotation *)annotation annotationPoint:(CGPoint)annotationPoint annotationView:(UIView<PSPDFAnnotationPresenting> *)annotationView pageView:(PSPDFPageView *)pageView viewPoint:(CGPoint)viewPoint {
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
  [self onStateChangedForPDFViewController:pdfController pageView:pageView pageAtIndex:pageIndex];
}

- (void)pdfViewController:(PSPDFViewController *)pdfController didChangeDocument:(nullable PSPDFDocument *)document {
  VALIDATE_DOCUMENT(document)
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
  if (self.onAnnotationsChanged) {
    self.onAnnotationsChanged(@{@"change" : change, @"annotations" : annotationsJSON});
  }
}

- (void)spreadIndexDidChange:(NSNotification *)notification {
    PSPDFDocumentViewController *documentViewController = self.pdfController.documentViewController;
    if (notification.object != documentViewController) { return; }
    PSPDFPageIndex pageIndex = [documentViewController.layout pageRangeForSpreadAtIndex:documentViewController.spreadIndex].location;
    PSPDFPageView *pageView = [self.pdfController pageViewForPageAtIndex:pageIndex];
    [self onStateChangedForPDFViewController:self.pdfController pageView:pageView pageAtIndex:pageIndex];
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
                            imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
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
                              imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
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

// MARK: - Helpers

- (void)onStateChangedForPDFViewController:(PSPDFViewController *)pdfController pageView:(PSPDFPageView *)pageView pageAtIndex:(NSInteger)pageIndex {
  if (self.onStateChanged) {
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
    
    self.onStateChanged(@{@"documentLoaded" : @(isDocumentLoaded),
                          @"currentPageIndex" : @(pdfController.pageIndex),
                          @"pageCount" : @(pageCount),
                          @"annotationCreationActive" : @(isAnnotationToolBarVisible),
                          @"affectedPageIndex": @(pageIndex),
                          @"annotationEditingActive" : @(hasSelectedAnnotations),
                          @"textSelectionActive" : @(hasSelectedText),
                          @"formEditingActive" : @(isFormEditingActive)
    });
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
            self.onCustomToolbarButtonTapped(@{@"id" : customId});
        }
    }
}

- (void)handleCustomAnnotationContextualMenuItemEvent:(id)sender {
    UIAction *actionButton = (UIAction *)sender;
    if (self.onCustomAnnotationContextualMenuItemTapped) {
        NSString *customId = actionButton.identifier;
        if (customId != nil) {
            self.onCustomAnnotationContextualMenuItemTapped(@{@"id" : customId});
        }
    }
}

@end

@implementation RCTPSPDFKitViewController

- (void)viewWillTransitionToSize:(CGSize)newSize withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator {
  [super viewWillTransitionToSize:newSize withTransitionCoordinator:coordinator];
  
  /* Workaround for internal issue 25653:
   We re-apply the current view state to workaround an issue where the last page view would be layed out incorrectly
   in single page mode and scroll per spread page trasition after device rotation.

   We do this because the `PSPDFViewController` is not embedded as recommended in
   https://pspdfkit.com/guides/ios/current/customizing-the-interface/embedding-the-pdfviewcontroller-inside-a-custom-container-view-controller
   and because React Native itself handles the React Native view.

   TL;DR: We are adding the `PSPDFViewController` to `RCTPSPDFKitView` and not to the container controller's view.
   */
  [coordinator animateAlongsideTransition:NULL completion:^(id<UIViewControllerTransitionCoordinatorContext> context) {
    [self applyViewState:self.viewState animateIfPossible:NO];
  }];
}

@end
