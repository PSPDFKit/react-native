//
//  Copyright © 2016-2020 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <React/RCTConvert.h>
@import PSPDFKit;
@import PSPDFKitUI;

@interface RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json;

@end

@interface PSPDFConfigurationBuilder (RNAdditions)

- (void)setupFromJSON:(id)json;

@end
