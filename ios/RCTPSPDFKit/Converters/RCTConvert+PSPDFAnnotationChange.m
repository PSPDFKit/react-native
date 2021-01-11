//
//  Copyright © 2019-2021 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFAnnotationChange.h"

@implementation RCTConvert (PSPDFAnnotationChange)

+ (PSPDFAnnotationChange)PSPDFAnnotationChange:(NSString *)annotationChange {
  if ([annotationChange isEqualToString:@"flatten"]) {
    return PSPDFAnnotationChangeFlatten;
  } else if ([annotationChange isEqualToString:@"remove"]) {
    return PSPDFAnnotationChangeRemove;
  } else if ([annotationChange isEqualToString:@"embed"]) {
    return PSPDFAnnotationChangeEmbed;
  } else if ([annotationChange isEqualToString:@"print"]) {
    return PSPDFAnnotationChangePrint;
  } else {
    return PSPDFAnnotationChangeEmbed;
  }
}

@end
