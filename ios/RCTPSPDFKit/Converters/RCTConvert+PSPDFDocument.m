//
//  Copyright © 2016-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument: (NSString *)urlString {
    NSURL* url = [self parseURL: urlString];

    NSString *fileExtension = url.pathExtension.lowercaseString;

    BOOL isImageFile = [fileExtension isEqualToString: @"png"] || [fileExtension isEqualToString: @"jpeg"] || [fileExtension isEqualToString: @"jpg"] || [fileExtension isEqualToString: @"tiff"] || [fileExtension isEqualToString:@"tif"];

    if (isImageFile) {
        return [[PSPDFImageDocument alloc] initWithImageURL: url];
    }

    return [[PSPDFDocument alloc] initWithURL: url];
}

+ (NSURL*) parseURL: (NSString*) urlString {
    NSURL* url;

    if ([urlString hasPrefix: @"/"] || [urlString containsString: @"file:/"]) {
        if ([urlString hasPrefix:@"file:///"]) {
            urlString = [urlString substringFromIndex:7];
        }
        url = [NSURL fileURLWithPath: urlString];
    }

    if (url == nil) {
        url = [NSBundle.mainBundle URLForResource:urlString withExtension: nil];
    }

    if (url == nil && [urlString containsString: @".pdf"]) {
        url = [[NSBundle mainBundle] URLForResource: urlString withExtension: @"pdf"];
    }

    return url;
}

@end
