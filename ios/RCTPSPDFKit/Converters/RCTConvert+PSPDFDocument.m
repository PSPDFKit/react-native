//
//  RCTConvert+PSPDFDocument.m
//  PSPDFKit
//
//  Copyright (c) 2016 PSPDFKit GmbH. All rights reserved.
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
    url = [[NSBundle mainBundle] URLForResource:string withExtension:nil];
  }

  return [PSPDFDocument documentWithURL:url];
}

@end
