//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
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

+ (NSDictionary *)instantJSONFromFormElement:(PSPDFFormElement *)formElement error:(NSError **)error {
    NSMutableDictionary *formElementJSON = [NSMutableDictionary new];

    NSMutableDictionary *additionalInfo = [NSMutableDictionary dictionaryWithObject:formElement.uuid forKey:@"uuid"];
    if (formElement.value != nil) {
        [additionalInfo setObject:formElement.value forKey:@"value"];
    }
    NSData *formElementData = [formElement generateInstantJSONWithError:error];
    if (formElementData) {
        NSMutableDictionary *formElementDictionary = [[NSJSONSerialization JSONObjectWithData:formElementData options:kNilOptions error:error] mutableCopy];
        [formElementJSON addEntriesFromDictionary:additionalInfo];
        if (formElementDictionary) {
            [formElementJSON addEntriesFromDictionary:formElementDictionary];
        }
    }

  return [formElementJSON copy];
}

+ (PSPDFAnnotationType)annotationTypeFromInstantJSONType:(NSString *)type {

    if (!type) {
        return PSPDFAnnotationTypeAll;
    }

    NSArray* keys = @[
        @"all",
        @"pspdfkit/ink",
        @"pspdfkit/link",
        @"pspdfkit/markup/highlight",
        @"pspdfkit/markup/squiggly",
        @"pspdfkit/markup/strikeout",
        @"pspdfkit/markup/underline",
        @"pspdfkit/note",
        @"pspdfkit/shape/ellipse",
        @"pspdfkit/shape/line",
        @"pspdfkit/shape/polygon",
        @"pspdfkit/shape/polyline",
        @"pspdfkit/shape/rectangle",
        @"pspdfkit/text",
        @"pspdfkit/stamp",
        @"pspdfkit/image",
        @"pspdfkit/caret",
        @"pspdfkit/richmedia",
        @"pspdfkit/widget",
        @"pspdfkit/watermark",
        @"pspdfkit/file",
        @"pspdfkit/sound",
        @"pspdfkit/popup",
        @"pspdfkit/trapnet",
        @"pspdfkit/type3d",
        @"pspdfkit/redact",
    ];

    // Return undefined type, if submitted type is not supported
    if(![keys containsObject: type.lowercaseString]) {
        return PSPDFAnnotationTypeUndefined;
    }

    switch([keys indexOfObject: type.lowercaseString]) {
        case 0:
            return PSPDFAnnotationTypeAll;
        case 1:
            return PSPDFAnnotationTypeInk;
        case 2:
            return PSPDFAnnotationTypeLink;
        case 3:
            return PSPDFAnnotationTypeHighlight;
        case 4:
            return PSPDFAnnotationTypeSquiggly;
        case 5:
            return PSPDFAnnotationTypeStrikeOut;
        case 6:
            return PSPDFAnnotationTypeUnderline;
        case 7:
            return PSPDFAnnotationTypeNote;
        case 8:
            return PSPDFAnnotationTypeCircle;
        case 9:
            return PSPDFAnnotationTypeLine;
        case 10:
            return PSPDFAnnotationTypePolygon;
        case 11:
            return PSPDFAnnotationTypePolyLine;
        case 12:
            return PSPDFAnnotationTypeSquare;
        case 13:
            return PSPDFAnnotationTypeFreeText;
        case 14:
            return PSPDFAnnotationTypeStamp;
        case 15:
            return PSPDFAnnotationTypeStamp;
        case 16:
            return PSPDFAnnotationTypeCaret;
        case 17:
            return PSPDFAnnotationTypeRichMedia;
        case 18:
            return PSPDFAnnotationTypeWidget;
        case 19:
            return PSPDFAnnotationTypeWatermark;
        case 20:
            return PSPDFAnnotationTypeFile;
        case 21:
            return PSPDFAnnotationTypeSound;
        case 22:
            return PSPDFAnnotationTypePopup;
        case 23:
            return PSPDFAnnotationTypeTrapNet;
        case 24:
            return PSPDFAnnotationTypeThreeDimensional;
        case 25:
            return PSPDFAnnotationTypeRedaction;

        default:
            return PSPDFAnnotationTypeAll;
    }
}

@end
