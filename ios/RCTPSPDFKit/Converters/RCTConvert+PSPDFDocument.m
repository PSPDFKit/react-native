//
//  RCTConvert+PSPDFDocument.m
//  RCTPSPDFKit
//
//  Created by Robert Wijas on 12/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument:(NSString *)string {
  NSString *documentPath = [[NSBundle mainBundle] pathForResource:string ofType:nil];

  return [PSPDFDocument documentWithURL:[NSURL fileURLWithPath:documentPath]];
}

@end
