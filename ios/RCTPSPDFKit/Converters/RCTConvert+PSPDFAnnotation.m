//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFAnnotation)

+ (NSArray <NSDictionary *> *)instantJSONFromAnnotations:(NSArray <PSPDFAnnotation *> *) annotations {
  NSMutableArray <NSDictionary *> *annotationsJSON = [NSMutableArray new];
  for (PSPDFAnnotation *annotation in annotations) {
    NSDictionary <NSString *, NSString *> *uuidDict = @{@"uuid" : [annotation valueForKey:@"uuid"]};
    NSData *annotationData = [annotation generateInstantJSONWithError:NULL];
    if (annotationData) {
      NSMutableDictionary *annotationDictionary = [[NSJSONSerialization JSONObjectWithData:annotationData options:kNilOptions error:NULL] mutableCopy];
      [annotationDictionary addEntriesFromDictionary:uuidDict];
      if (annotationDictionary) {
        [annotationsJSON addObject:annotationDictionary];
      }
    } else {
      // We only generate Instant JSON data for attached annotations. When an annotation is deleted, we only set the annotation uuid.
      [annotationsJSON addObject:uuidDict];
    }
  }

  return [annotationsJSON copy];
}

+ (PSPDFAnnotationType)annotationTypeFromInstantJSONType:(NSString *)type {
  if (!type) {
    return PSPDFAnnotationTypeAll;
  } else if ([type isEqualToString:@"pspdfkit/ink"]) {
    return PSPDFAnnotationTypeInk;
  } else if ([type isEqualToString:@"pspdfkit/link"]) {
    return PSPDFAnnotationTypeLink;
  } else if ([type isEqualToString:@"pspdfkit/markup/highlight"]) {
    return PSPDFAnnotationTypeHighlight;
  } else if ([type isEqualToString:@"pspdfkit/markup/squiggly"]) {
    return PSPDFAnnotationTypeSquiggly;
  } else if ([type isEqualToString:@"pspdfkit/markup/strikeout"]) {
    return PSPDFAnnotationTypeStrikeOut;
  } else if ([type isEqualToString:@"pspdfkit/markup/underline"]) {
    return PSPDFAnnotationTypeUnderline;
  } else if ([type isEqualToString:@"pspdfkit/note"]) {
    return PSPDFAnnotationTypeNote;
  } else if ([type isEqualToString:@"pspdfkit/shape/ellipse"]) {
    return PSPDFAnnotationTypeCircle;
  } else if ([type isEqualToString:@"pspdfkit/shape/line"]) {
    return PSPDFAnnotationTypeLine;
  } else if ([type isEqualToString:@"pspdfkit/shape/polygon"]) {
    return PSPDFAnnotationTypePolygon;
  } else if ([type isEqualToString:@"pspdfkit/shape/rectangle"]) {
    return PSPDFAnnotationTypeSquare;
  } else if ([type isEqualToString:@"pspdfkit/text"]) {
    return PSPDFAnnotationTypeFreeText;
  } else {
    return PSPDFAnnotationTypeUndefined;
  }
}

@end
