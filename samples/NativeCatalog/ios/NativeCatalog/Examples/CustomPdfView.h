//
//  Copyright © 2020 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@import PSPDFKit;
@import PSPDFKitUI;

NS_ASSUME_NONNULL_BEGIN

@interface CustomPdfView : UIView

@property (nonatomic, readonly) PSPDFViewController *pdfController;
@property (nonatomic, copy) RCTBubblingEventBlock onDocumentDigitallySigned;

- (BOOL)startSigning;
- (BOOL)createWatermarkAndReloadData:(BOOL)reloadData;

@end

NS_ASSUME_NONNULL_END
