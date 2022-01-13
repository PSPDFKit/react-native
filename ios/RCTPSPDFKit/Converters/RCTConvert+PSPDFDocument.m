//
//  Copyright © 2016-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument:(NSString *)string {
  NSURL *url;

  if ([string hasPrefix:@"/"]) {
    url = [NSURL fileURLWithPath:string];
  } else {
    url = [NSBundle.mainBundle URLForResource:string withExtension:nil];
  }

  NSString *fileExtension = url.pathExtension.lowercaseString;
  BOOL isImageFile = [fileExtension isEqualToString:@"png"] || [fileExtension isEqualToString:@"jpeg"] || [fileExtension isEqualToString:@"jpg"] || [fileExtension isEqualToString:@"tiff"] || [fileExtension isEqualToString:@"tif"];
  if (isImageFile) {
    return [[PSPDFImageDocument alloc] initWithImageURL:url];
  } else {
    return [[PSPDFDocument alloc] initWithURL:url];
  }
}

@end
