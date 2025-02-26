//
//  Copyright © 2019-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFViewMode.h"

@implementation RCTConvert (PSPDFViewMode)

+ (PSPDFViewMode)PSPDFViewMode:(NSString *)viewMode {
  if ([viewMode isEqualToString:@"document"]) {
    return PSPDFViewModeDocument;
  } else if ([viewMode isEqualToString:@"thumbnails"]) {
    return PSPDFViewModeThumbnails;
  } else if ([viewMode isEqualToString:@"documentEditor"]) {
    return PSPDFViewModeDocumentEditor;;
  } else {
    return PSPDFViewModeDocument;
  }
}

+ (NSString *)PSPDFViewModeString:(PSPDFViewMode)viewMode {
  if (viewMode == PSPDFViewModeDocument) {
    return @"document";
  } else if (viewMode == PSPDFViewModeThumbnails) {
    return @"thumbnails";
  } else if (viewMode == PSPDFViewModeDocumentEditor) {
    return @"documentEditor";
  } else {
      return @"document";
  }
}

@end
