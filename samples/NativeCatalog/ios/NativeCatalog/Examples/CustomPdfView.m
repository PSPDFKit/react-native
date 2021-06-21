//
//  Copyright © 2020-2021 PSPDFKit GmbH. All rights reserved.
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

- (BOOL)startSigning {
  // Programmatically show the signature creation view controller
  if (@available(iOS 13.0, *)) {
    PSPDFSignatureCreationViewController *signatureController = [[PSPDFSignatureCreationViewController alloc] init];
    signatureController.configuration = [PSPDFSignatureCreationConfiguration configurationWithBuilder:^(PSPDFSignatureCreationConfigurationBuilder * _Nonnull builder) {
      builder.availableModes = @[@(PSPDFSignatureCreationModeDraw)];
    }];
    signatureController.delegate = self;
    [_pdfController presentViewController:signatureController animated:YES completion:NULL];
  } else {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"This example is not available on iOS 12" message:@"This example requires iOS 13 and later." preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"Dismiss" style:UIAlertActionStyleDefault handler:NULL]];
    [_pdfController presentViewController:alert animated:YES completion:NULL];
  }

  return YES;
}

#pragma mark - PSPDFSignatureViewControllerDelegate

- (void)signatureCreationViewControllerDidFinish:(PSPDFSignatureCreationViewController * _Nonnull)signatureController  API_AVAILABLE(ios(13.0)){
    [signatureController dismissViewControllerAnimated:YES completion:^{
      NSURL *samplesURL = [NSBundle.mainBundle.resourceURL URLByAppendingPathComponent:@"PDFs"];
      NSURL *p12URL = [samplesURL URLByAppendingPathComponent:@"JohnAppleseed.p12"];

      NSData *p12data = [NSData dataWithContentsOfURL:p12URL];
      NSAssert(p12data, @"Error reading p12 data from %@", p12URL);
      PSPDFPKCS12 *p12 = [[PSPDFPKCS12 alloc] initWithData:p12data];
      PSPDFPKCS12Signer *signer = [[PSPDFPKCS12Signer alloc] initWithDisplayName:@"John Appleseed" PKCS12:p12];
      signer.reason = @"Contract agreement";
      PSPDFSignatureManager *signatureManager = PSPDFKitGlobal.sharedInstance.signatureManager;
      [signatureManager clearRegisteredSigners];
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

      PSPDFDocument *document = self.pdfController.document;
      NSArray *annotations = [document annotationsForPageAtIndex:0 type:PSPDFAnnotationTypeWidget];
      PSPDFSignatureFormElement *signatureFormElement;
      for (PSPDFAnnotation *annotation in annotations) {
        if ([annotation isKindOfClass:PSPDFSignatureFormElement.class]) {
          signatureFormElement = (PSPDFSignatureFormElement *)annotation;
          break;
        }
      }

      // Prepare the lines and convert them from view space to PDF space. (PDF space is mirrored!)
      PSPDFPageInfo *pageInfo = [document pageInfoForPageAtIndex:0];
      NSArray *lines = PSPDFConvertViewLinesToPDFLines(signatureController.drawView.pointSequences, pageInfo, (CGRect){.size = pageInfo.size});

      // Create the ink annotation.
      PSPDFInkAnnotation *annotation = [[PSPDFInkAnnotation alloc] initWithLines:lines];
      annotation.name = @"Signature"; // Arbitrary string, will be persisted in the PDF.
      annotation.lineWidth = 3.0;
      // Set the bounding box to fit in the signature form element.
      annotation.boundingBox = CGRectMake(signatureFormElement.boundingBox.origin.x + 70, signatureFormElement.boundingBox.origin.y - 25, 50, 50);
      annotation.color = signatureController.drawView.strokeColor;
      annotation.naturalDrawingEnabled = signatureController.drawView.naturalDrawingEnabled;
      annotation.pageIndex = 0;

      // Add the ink annotation.
      [document addAnnotations:@[annotation] options:nil];

      NSString *fileName = [NSString stringWithFormat:@"%@.pdf", NSUUID.UUID.UUIDString];
      NSString *path = [NSTemporaryDirectory() stringByAppendingPathComponent:fileName];
      __block PSPDFDocument *signedDocument;

      // Sign the form element.
      [signer signFormElement:signatureFormElement usingPassword:@"test" writeTo:path appearance:nil biometricProperties:nil completion:^(BOOL success, PSPDFDocument *document, NSError *err) {
          signedDocument = document;
      }];

      // Replace the original document with the signed document.
      self.pdfController.document = signedDocument;
    }];
}

- (void)signatureCreationViewControllerDidCancel:(PSPDFSignatureCreationViewController * _Nonnull)signatureController  API_AVAILABLE(ios(13.0)){
    [signatureController dismissViewControllerAnimated:YES completion:NULL];
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
  instantExampleViewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[PSPDFKitGlobal imageNamed:@"x"] style:UIBarButtonItemStylePlain target:self action:@selector(closeInstantExampleButtonPressed:)];
  [presentingViewController presentViewController:self.topController animated:YES completion:NULL];
  return YES;
}

- (void)closeInstantExampleButtonPressed:(nullable id)sender {
  [self.topController dismissViewControllerAnimated:YES completion:NULL];
}

@end
