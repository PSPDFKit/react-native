//
//  CustomPdfView.m
//  NativeCatalog
//
//  Copyright © 2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "CustomPdfView.h"
#import <React/RCTUtils.h>

@interface CustomDigitalSignatureCoordinator: PSPDFDigitalSignatureCoordinator
+ (void)setPDFView:(CustomPdfView *)pdfView;
@end

@interface CustomPdfView()
@property (nonatomic, nullable) UIViewController *topController;
@end

@implementation CustomPdfView

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _pdfController = [[PSPDFViewController alloc] initWithDocument:nil configuration:[PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
      [builder overrideClass:PSPDFDigitalSignatureCoordinator.class withClass:CustomDigitalSignatureCoordinator.class];
    }]];
  }

  [CustomDigitalSignatureCoordinator setPDFView:self];
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

  if (self.pdfController.configuration.useParentNavigationBar) {
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

- (UIViewController *)pspdf_parentViewController {
  UIResponder *parentResponder = self;
  while ((parentResponder = parentResponder.nextResponder)) {
    if ([parentResponder isKindOfClass:UIViewController.class]) {
      return (UIViewController *)parentResponder;
    }
  }
  return nil;
}

- (BOOL)startSigning {
  NSURL *samplesURL = [NSBundle.mainBundle.resourceURL URLByAppendingPathComponent:@"PDFs"];
  NSURL *p12URL = [samplesURL URLByAppendingPathComponent:@"JohnAppleseed.p12"];

  NSData *p12data = [NSData dataWithContentsOfURL:p12URL];
  NSAssert(p12data, @"Error reading p12 data from %@", p12URL);
  PSPDFPKCS12 *p12 = [[PSPDFPKCS12 alloc] initWithData:p12data];
  PSPDFPKCS12Signer *signer = [[PSPDFPKCS12Signer alloc] initWithDisplayName:@"John Appleseed" PKCS12:p12];
  signer.reason = @"Contract agreement";
  PSPDFSignatureManager *signatureManager = PSPDFKitGlobal.sharedInstance.signatureManager;
  [signatureManager clearRegisteredSigners];
  [signatureManager registerSigner:signer];

  [signatureManager clearTrustedCertificates];

  // Add certs to trust store for the signature validation process
  NSURL *certURL = [samplesURL URLByAppendingPathComponent:@"JohnAppleseed.p7c"];
  NSData *certData = [NSData dataWithContentsOfURL:certURL];

  NSError *error;
  NSArray *certificates = [PSPDFX509 certificatesFromPKCS7Data:certData error:&error];
  NSAssert(error == nil, @"Error loading certificates - %@", error.localizedDescription);
  for (PSPDFX509 *x509 in certificates) {
      [signatureManager addTrustedCertificate:x509];
  }

  PSPDFDocument *document = _pdfController.document;
  NSArray *annotations = [document annotationsForPageAtIndex:0 type:PSPDFAnnotationTypeWidget];
  PSPDFSignatureFormElement *signatureFormElement;
  for (PSPDFAnnotation *annotation in annotations) {
      if ([annotation isKindOfClass:PSPDFSignatureFormElement.class]) {
          signatureFormElement = (PSPDFSignatureFormElement *)annotation;
          break;
      }
  }

  if (!signatureFormElement) {
    return NO;
  }
  PSPDFPageView *pageView = [_pdfController pageViewForPageAtIndex:signatureFormElement.pageIndex];
  [pageView selectAnnotation:signatureFormElement animated:YES];

  return YES;
}

- (BOOL)createWatermark {
  PSPDFDocument *document = _pdfController.document;

  const PSPDFRenderDrawBlock drawBlock = ^(CGContextRef context, NSUInteger page, CGRect cropBox, PSPDFRenderOptions *options) {
      // Careful, this code is executed on background threads. Only use thread-safe drawing methods.

      // Set up the text and it's drawing attributes.
      NSString *overlayText = @"Watermark";
      UIFont *font = [UIFont fontWithName:@"Helvetica-Bold" size:24.];
      UIColor *textColor = UIColor.redColor;
      NSDictionary *attributes = @{NSFontAttributeName: font, NSForegroundColorAttributeName: textColor};

      // Set text drawing mode (fill).
      CGContextSetTextDrawingMode(context, kCGTextFill);

      // Calculate the font box to center the text on the page.
      CGSize boundingBox = [overlayText sizeWithAttributes:attributes];
      CGPoint point = CGPointMake(__tg_round((cropBox.size.width - boundingBox.width) / 2), __tg_round((cropBox.size.height - boundingBox.height) / 2));

      // Finally draw the text.
      [overlayText drawAtPoint:point withAttributes:attributes];
  };

  [document updateRenderOptionsForType:PSPDFRenderTypeAll withBlock:^(PSPDFRenderOptions * _Nonnull options) {
      options.drawBlock = drawBlock;
  }];

  [_pdfController reloadData];
  return YES;
}

@end

@implementation CustomDigitalSignatureCoordinator

static CustomPdfView *customPdfView;
+ (void)setPDFView:(CustomPdfView *)pdfView {
  customPdfView = pdfView;
}

- (void)presentSignedDocument:(PSPDFDocument *)signedDocument showingPageIndex:(PSPDFPageIndex)pageIndex withPresentationContext:(id<PSPDFPresentationContext>)presentationContext {
  [super presentSignedDocument:signedDocument showingPageIndex:pageIndex withPresentationContext:presentationContext];
  if (customPdfView.onDocumentDigitallySigned) {
    customPdfView.onDocumentDigitallySigned(@{@"signedDocumentPath": signedDocument.fileURL.path});
  }
}

@end

