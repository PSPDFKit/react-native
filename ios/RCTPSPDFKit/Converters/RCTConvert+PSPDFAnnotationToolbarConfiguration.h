//
//  Copyright © 2018-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <React/RCTConvert.h>
@import PSPDFKit;
@import PSPDFKitUI;

@interface RCTConvert (PSPDFAnnotationToolbarConfiguration)

+ (PSPDFAnnotationToolbarConfiguration *)PSPDFAnnotationToolbarConfiguration:(id)json;
+ (PSPDFAnnotationString)PSPDFAnnotationStringFromName:(NSString *)name;
+ (PSPDFAnnotationVariantString)PSPDFAnnotationVariantStringFromName:(NSString *)name;

@end
