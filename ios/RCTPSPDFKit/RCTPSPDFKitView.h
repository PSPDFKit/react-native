//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
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

@interface RCTPSPDFKitView: UIView

@property (nonatomic, readonly) PSPDFViewController *pdfController;
@property (nonatomic) BOOL hideNavigationBar;

@property (nonatomic, readonly) UIBarButtonItem *closeButton;
@property (nonatomic, copy) RCTBubblingEventBlock onCloseButtonPressed;

@end
