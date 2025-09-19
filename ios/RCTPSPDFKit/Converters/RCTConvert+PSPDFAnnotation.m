//
//  Copyright © 2018-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@implementation RCTConvert (PSPDFAnnotation)

+ (NSArray <NSDictionary *> *)instantJSONFromAnnotations:(NSArray <PSPDFAnnotation *> *) annotations error:(NSError **)error {
  NSMutableArray <NSDictionary *> *annotationsJSON = [NSMutableArray new];
  for (PSPDFAnnotation *annotation in annotations) {
    // Keeping the uuid and isRequired props for backwards compatibility
    NSDictionary <NSString *, NSString *> *uuidDict = @{@"uuid" : annotation.uuid};
    NSData *annotationData = [annotation generateInstantJSONWithError:error];
    if (annotationData) {
      NSMutableDictionary *annotationDictionary = [[NSJSONSerialization JSONObjectWithData:annotationData options:kNilOptions error:error] mutableCopy];
      [annotationDictionary addEntriesFromDictionary:uuidDict];
      
      // If this is a Widget annotation, add the FormElement
      if ([annotation isKindOfClass:[PSPDFFormElement class]]) {
          PSPDFFormElement *formElement = (PSPDFFormElement *)annotation;
          annotationDictionary[@"isRequired"] = @(formElement.isRequired);
          NSDictionary *formElementJSON = [RCTConvert formElementToJSON:formElement];
          if (formElementJSON != nil) {
              annotationDictionary[@"formElement"] = formElementJSON;
          }
      }
        
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

+ (NSDictionary *)formElementToJSON:(PSPDFFormElement *)formElement {
    NSDictionary *formElementJSON;
    
    if ([formElement isKindOfClass:[PSPDFButtonFormElement class]]) {
        formElementJSON = [RCTConvert buttonFormElementToJSON:(PSPDFButtonFormElement *)formElement];
        NSMutableDictionary *mutableJSON = [formElementJSON mutableCopy];
        mutableJSON[@"type"] = @"button";
        formElementJSON = [mutableJSON copy];
    } else if ([formElement isKindOfClass:[PSPDFChoiceFormElement class]]) {
        formElementJSON = [RCTConvert choiceFormElementToJSON:(PSPDFChoiceFormElement *)formElement];
        NSMutableDictionary *mutableJSON = [formElementJSON mutableCopy];
        mutableJSON[@"type"] = @"choice";
        formElementJSON = [mutableJSON copy];
    } else if ([formElement isKindOfClass:[PSPDFSignatureFormElement class]]) {
        formElementJSON = [RCTConvert signatureFormElementToJSON:(PSPDFSignatureFormElement *)formElement];
        NSMutableDictionary *mutableJSON = [formElementJSON mutableCopy];
        mutableJSON[@"type"] = @"signature";
        formElementJSON = [mutableJSON copy];
    } else if ([formElement isKindOfClass:[PSPDFTextFieldFormElement class]]) {
        formElementJSON = [RCTConvert textFieldFormElementToJSON:(PSPDFTextFieldFormElement *)formElement];
        NSMutableDictionary *mutableJSON = [formElementJSON mutableCopy];
        mutableJSON[@"type"] = @"textField";
        formElementJSON = [mutableJSON copy];
    } else {
        return nil; // Return nil if no conditions match
    }
    
    return formElementJSON;
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
        
        // If this is a Widget annotation, add the FormElement
        if ([formElement isKindOfClass:[PSPDFFormElement class]]) {
            formElementDictionary[@"isRequired"] = @(formElement.isRequired);
            NSDictionary *formElementJSON = [RCTConvert formElementToJSON:formElement];
            if (formElementJSON != nil) {
                formElementDictionary[@"formElement"] = formElementJSON;
            }
        }
        
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

    NSString *normalizedType = [type.lowercaseString stringByReplacingOccurrencesOfString:@"pspdfkit/" withString:@""];
    
        if ([normalizedType isEqualToString:@"all"]) {
        return PSPDFAnnotationTypeAll;
    } else if ([normalizedType isEqualToString:@"ink"]) {
        return PSPDFAnnotationTypeInk;
    } else if ([normalizedType isEqualToString:@"link"]) {
        return PSPDFAnnotationTypeLink;
    } else if ([normalizedType isEqualToString:@"markup/highlight"] || [normalizedType isEqualToString:@"highlight"]) {
        return PSPDFAnnotationTypeHighlight;
    } else if ([normalizedType isEqualToString:@"markup/squiggly"] || [normalizedType isEqualToString:@"squiggly"]) {
        return PSPDFAnnotationTypeSquiggly;
    } else if ([normalizedType isEqualToString:@"markup/strikeout"] || [normalizedType isEqualToString:@"strikeout"]) {
        return PSPDFAnnotationTypeStrikeOut;
    } else if ([normalizedType isEqualToString:@"markup/underline"] || [normalizedType isEqualToString:@"underline"]) {
        return PSPDFAnnotationTypeUnderline;
    } else if ([normalizedType isEqualToString:@"note"]) {
        return PSPDFAnnotationTypeNote;
    } else if ([normalizedType isEqualToString:@"shape/ellipse"] || [normalizedType isEqualToString:@"ellipse"]) {
        return PSPDFAnnotationTypeCircle;
    } else if ([normalizedType isEqualToString:@"shape/line"] || [normalizedType isEqualToString:@"line"]) {
        return PSPDFAnnotationTypeLine;
    } else if ([normalizedType isEqualToString:@"shape/polygon"] || [normalizedType isEqualToString:@"polygon"]) {
        return PSPDFAnnotationTypePolygon;
    } else if ([normalizedType isEqualToString:@"shape/polyline"] || [normalizedType isEqualToString:@"polyline"]) {
        return PSPDFAnnotationTypePolyLine;
    } else if ([normalizedType isEqualToString:@"shape/rectangle"] || [normalizedType isEqualToString:@"rectangle"]) {
        return PSPDFAnnotationTypeSquare;
    } else if ([normalizedType isEqualToString:@"text"] || [normalizedType isEqualToString:@"freetext"]) {
        return PSPDFAnnotationTypeFreeText;
    } else if ([normalizedType isEqualToString:@"stamp"]) {
        return PSPDFAnnotationTypeStamp;
    } else if ([normalizedType isEqualToString:@"image"]) {
        return PSPDFAnnotationTypeStamp;
    } else if ([normalizedType isEqualToString:@"caret"]) {
        return PSPDFAnnotationTypeCaret;
    } else if ([normalizedType isEqualToString:@"richmedia"]) {
        return PSPDFAnnotationTypeRichMedia;
    } else if ([normalizedType isEqualToString:@"widget"]) {
        return PSPDFAnnotationTypeWidget;
    } else if ([normalizedType isEqualToString:@"watermark"]) {
        return PSPDFAnnotationTypeWatermark;
    } else if ([normalizedType isEqualToString:@"file"]) {
        return PSPDFAnnotationTypeFile;
    } else if ([normalizedType isEqualToString:@"sound"]) {
        return PSPDFAnnotationTypeSound;
    } else if ([normalizedType isEqualToString:@"popup"]) {
        return PSPDFAnnotationTypePopup;
    } else if ([normalizedType isEqualToString:@"trapnet"]) {
        return PSPDFAnnotationTypeTrapNet;
    } else if ([normalizedType isEqualToString:@"type3d"] || [normalizedType isEqualToString:@"threedimensional"]) {
        return PSPDFAnnotationTypeThreeDimensional;
    } else if ([normalizedType isEqualToString:@"redact"] || [normalizedType isEqualToString:@"redaction"]) {
        return PSPDFAnnotationTypeRedaction;
    }
    
    return PSPDFAnnotationTypeUndefined;
}

@end
