//
//  Copyright © 2016-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"
#import "RCTPSPDFKitView.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@implementation RCTConvert (PSPDFDocument)

+ (PSPDFDocument *)PSPDFDocument:(NSString *)urlString remoteDocumentConfig:(NSDictionary *)remoteDocumentConfig {
    NSURL* url = [RCTConvert parseURL:urlString];
    
    PSPDFDocument *document = nil;
    NSString *outputFilePath = remoteDocumentConfig[@"outputFilePath"];
    BOOL overwriteExisting = [remoteDocumentConfig[@"overwriteExisting"] boolValue];
    
    if ([[url scheme] containsString:@"http"] && outputFilePath != nil) {
        NSURL *destination = [RCTConvert parseURL:outputFilePath];
        RemoteDocumentDownloader *downloader = [[RemoteDocumentDownloader alloc] initWithRemoteURL:url destinationFileURL:destination cleanup:overwriteExisting];
        PSPDFCoordinatedFileDataProvider *provider = [[PSPDFCoordinatedFileDataProvider alloc] initWithFileURL:destination progress:downloader.progress];
        document = [[PSPDFDocument alloc] initWithDataProviders:@[provider]];
    } else {
        document = [RCTConvert PSPDFDocument:urlString];
    }
    return document;
}

+ (PSPDFDocument *)PSPDFDocument: (NSString *)urlString {
    NSURL* url = [self parseURL: urlString];

    NSString *fileExtension = url.pathExtension.lowercaseString;

    BOOL isImageFile = [fileExtension isEqualToString: @"png"] || [fileExtension isEqualToString: @"jpeg"] || [fileExtension isEqualToString: @"jpg"] || [fileExtension isEqualToString: @"tiff"] || [fileExtension isEqualToString:@"tif"];

    if (isImageFile) {
        PSPDFImageDocument *imageDocument = [[PSPDFImageDocument alloc] initWithImageURL: url];
        [imageDocument waitUntilLoaded];
        return imageDocument;
    }

    return [[PSPDFDocument alloc] initWithURL: url];
}

+ (NSURL*)parseURL:(NSString*)urlString {
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
    
    if (url == nil && [urlString containsString:@"http"]) {
        url = [NSURL URLWithString:urlString];
    }

    return url;
}

@end
