//
//  Copyright © 2020-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "CustomPdfView.h"
#import <React/RCTUtils.h>
#import "NativeCatalog-Swift.h"

@interface CustomPdfView()<PSPDFSignatureCreationViewControllerDelegate>
@property (nonatomic, nullable) UIViewController *topController;
@end

@implementation CustomPdfView

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _pdfController = [[PSPDFViewController alloc] initWithDocument:nil configuration:[PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
      // Disable annotation editing.
      builder.editableAnnotationTypes = nil;
    }]];
  }

  return self;
}

- (void)removeFromSuperview {
  // When the React Native PDF view in unmounted, we need to dismiss the `PSPDFViewController` to avoid orphan popovers.
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

  if (self.pdfController.configuration.useParentNavigationBar) {
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
}

- (void)destroyViewControllerRelationship {
  if (self.topController.parentViewController) {
    [self.topController willMoveToParentViewController:nil];
    [self.topController removeFromParentViewController];
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

- (BOOL)createWatermarkAndReloadData:(BOOL)reloadData {
  PSPDFDocument *document = _pdfController.document;
  const PSPDFRenderDrawBlock drawBlock = ^(CGContextRef context, NSUInteger page, CGRect cropBox, PSPDFRenderOptions *options) {
    NSString *text = @"My Watermark";
    NSStringDrawingContext *stringDrawingContext = [NSStringDrawingContext new];
    stringDrawingContext.minimumScaleFactor = 0.1;

    CGContextTranslateCTM(context, 0.0, cropBox.size.height / 2.);
    CGContextRotateCTM(context, -(CGFloat)M_PI / 4.);
    [text drawWithRect:cropBox options:NSStringDrawingUsesLineFragmentOrigin attributes:@{ NSFontAttributeName: [UIFont boldSystemFontOfSize:100], NSForegroundColorAttributeName: [UIColor.redColor colorWithAlphaComponent:0.5] } context:stringDrawingContext];
  };

  [document updateRenderOptionsForType:PSPDFRenderTypeAll withBlock:^(PSPDFRenderOptions * _Nonnull options) {
    options.drawBlock = drawBlock;
  }];

  if (reloadData) {
    [_pdfController reloadData];
  }
  return YES;
}

- (BOOL)presentInstantExample {
  UIViewController *presentingViewController = RCTPresentedViewController();
  InstantExampleViewController *instantExampleViewController = [[InstantExampleViewController alloc] init];
  self.topController = [[PSPDFNavigationController alloc] initWithRootViewController:instantExampleViewController];
  self.topController.modalPresentationStyle = UIModalPresentationFullScreen;
  instantExampleViewController.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemClose
                                                target:self
                                                action:@selector(closeInstantExampleButtonPressed:)];
  
  [presentingViewController presentViewController:self.topController animated:YES completion:NULL];
  return YES;
}

- (void)closeInstantExampleButtonPressed:(nullable id)sender {
  [self.topController dismissViewControllerAnimated:YES completion:NULL];
}

@end
