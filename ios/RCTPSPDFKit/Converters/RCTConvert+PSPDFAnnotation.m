//
//  Copyright © 2018-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFAnnotation)

+ (NSArray <NSDictionary *> *)instantJSONFromAnnotations:(NSArray <PSPDFAnnotation *> *) annotations error:(NSError **)error {
  NSMutableArray <NSDictionary *> *annotationsJSON = [NSMutableArray new];
  for (PSPDFAnnotation *annotation in annotations) {
    NSDictionary <NSString *, NSString *> *uuidDict = @{@"uuid" : annotation.uuid};
    NSData *annotationData = [annotation generateInstantJSONWithError:error];
    if (annotationData) {
      NSMutableDictionary *annotationDictionary = [[NSJSONSerialization JSONObjectWithData:annotationData options:kNilOptions error:error] mutableCopy];
      [annotationDictionary addEntriesFromDictionary:uuidDict];
      if (annotationDictionary) {
        [annotationsJSON addObject:annotationDictionary];
      }
    } else {
      // We only generate Instant JSON data for attached annotations. When an annotation is deleted, we only set the annotation uuid and name.
      [annotationsJSON addObject:@{@"uuid" : annotation.uuid, @"name" : annotation.name ?: [NSNull null], @"creatorName" : annotation.user ?: [NSNull null]}];
    }
  }

  return [annotationsJSON copy];
}

+ (PSPDFAnnotationType)annotationTypeFromInstantJSONType:(NSString *)type {

    if (!type) {
        return PSPDFAnnotationTypeAll;
    }

   NSDictionary* annotationTypes = @{
        @"all": @(PSPDFAnnotationTypeAll),
        @"pspdfkit/ink": @(PSPDFAnnotationTypeInk),
        @"pspdfkit/link": @(PSPDFAnnotationTypeLink),
        @"pspdfkit/markup/highlight": @(PSPDFAnnotationTypeHighlight),
        @"pspdfkit/markup/squiggly": @(PSPDFAnnotationTypeSquiggly),
        @"pspdfkit/markup/strikeout": @(PSPDFAnnotationTypeStrikeOut),
        @"pspdfkit/markup/underline":@(PSPDFAnnotationTypeUnderline),
        @"pspdfkit/note":@(PSPDFAnnotationTypeNote),
        @"pspdfkit/shape/ellipse": @(PSPDFAnnotationTypeCircle),
        @"pspdfkit/shape/line":@(PSPDFAnnotationTypeLine),
        @"pspdfkit/shape/polygon":@(PSPDFAnnotationTypePolygon),
        @"pspdfkit/shape/polyline":@(PSPDFAnnotationTypePolyLine),
        @"pspdfkit/shape/rectangle":@(PSPDFAnnotationTypeSquare),
        @"pspdfkit/text":@(PSPDFAnnotationTypeFreeText),
        @"pspdfkit/stamp":@(PSPDFAnnotationTypeStamp),
        @"pspdfkit/image":@(PSPDFAnnotationTypeStamp),
        @"pspdfkit/caret":@(PSPDFAnnotationTypeCaret),
        @"pspdfkit/richmedia":@(PSPDFAnnotationTypeRichMedia),
        @"pspdfkit/widget":@(PSPDFAnnotationTypeWidget),
        @"pspdfkit/watermark":@(PSPDFAnnotationTypeWatermark),
        @"pspdfkit/file":@(PSPDFAnnotationTypeFile),
        @"pspdfkit/sound":@(PSPDFAnnotationTypeSound),
        @"pspdfkit/popup":@(PSPDFAnnotationTypePopup),
        @"pspdfkit/trapnet":@(PSPDFAnnotationTypeTrapNet),
        @"pspdfkit/type3d":@(PSPDFAnnotationTypeThreeDimensional),
        @"pspdfkit/redact":@(PSPDFAnnotationTypeRedaction),
    };

    // Return undefined type, if submitted type is not supported
    if(![[annotationTypes allKeys] containsObject: type.lowercaseString]) {
        return PSPDFAnnotationTypeUndefined;
    }

    return (unsigned long) annotationTypes[type.lowercaseString];
}

@end
