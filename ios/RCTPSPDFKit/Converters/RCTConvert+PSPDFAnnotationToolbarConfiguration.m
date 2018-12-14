//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFDocument.h"

@implementation RCTConvert (PSPDFAnnotationToolbarConfiguration)

+ (PSPDFAnnotationToolbarConfiguration *)PSPDFAnnotationToolbarConfiguration:(id)json {
  NSArray *itemsToParse = [RCTConvert NSArray:json];
  NSMutableArray *parsedItems = [NSMutableArray arrayWithCapacity:itemsToParse.count];
  for (int i = 0; i < itemsToParse.count; i++) {
    id itemToParse = itemsToParse[i];
    if ([itemToParse isKindOfClass:[NSDictionary class]]) {
      NSDictionary *dict = itemToParse;
      NSArray *subArray = dict[@"items"];
      NSMutableArray *subItems = [NSMutableArray arrayWithCapacity:subArray.count];
      for (int j = 0; j < subArray.count; j++) {
        id subItem = subArray[j];
        PSPDFAnnotationString annotationString = [RCTConvert PSPDFAnnotationStringFromName:subItem];
        if (subItem) {
          [subItems addObject:[PSPDFAnnotationGroupItem itemWithType:annotationString]];
        }
      }
      [parsedItems addObject:[PSPDFAnnotationGroup groupWithItems:subItems]];
    } else {
      PSPDFAnnotationString annotationString = [RCTConvert PSPDFAnnotationStringFromName:itemToParse];
      if (annotationString) {
        [parsedItems addObject:[PSPDFAnnotationGroup groupWithItems:@[[PSPDFAnnotationGroupItem itemWithType:annotationString]]]];
      }
    }
  }
  return  [[PSPDFAnnotationToolbarConfiguration alloc] initWithAnnotationGroups:parsedItems];
}

+ (PSPDFAnnotationString)PSPDFAnnotationStringFromName:(NSString *)name {
  if ([name isEqualToString:@"link"]) {
    return PSPDFAnnotationStringLink;
  } else if ([name isEqualToString:@"highlight"]) {
    return PSPDFAnnotationStringHighlight;
  } else if ([name isEqualToString:@"strikeout"]) {
    return PSPDFAnnotationMenuStrikeout;
  } else if ([name isEqualToString:@"underline"]) {
    return PSPDFAnnotationStringUnderline;
  } else if ([name isEqualToString:@"squiggly"]) {
    return PSPDFAnnotationMenuSquiggle;
  } else if ([name isEqualToString:@"note"]) {
    return PSPDFAnnotationStringNote;
  } else if ([name isEqualToString:@"freetext"]) {
    return PSPDFAnnotationStringFreeText;
  } else if ([name isEqualToString:@"ink"]) {
    return PSPDFAnnotationStringInk;
  } else if ([name isEqualToString:@"square"]) {
    return PSPDFAnnotationStringSquare;
  } else if ([name isEqualToString:@"circle"]) {
    return PSPDFAnnotationStringCircle;
  } else if ([name isEqualToString:@"line"]) {
    return PSPDFAnnotationStringLine;
  } else if ([name isEqualToString:@"polygon"]) {
    return PSPDFAnnotationStringPolygon;
  } else if ([name isEqualToString:@"polyline"]) {
    return PSPDFAnnotationStringPolyLine;
  } else if ([name isEqualToString:@"signature"]) {
    return PSPDFAnnotationStringSignature;
  } else if ([name isEqualToString:@"stamp"]) {
    return PSPDFAnnotationStringStamp;
  } else if ([name isEqualToString:@"eraser"]) {
    return PSPDFAnnotationStringEraser;
  } else if ([name isEqualToString:@"sound"]) {
    return PSPDFAnnotationStringSound;
  } else if ([name isEqualToString:@"image"]) {
    return PSPDFAnnotationStringImage;
  } else if ([name isEqualToString:@"redaction"]) {
    return PSPDFAnnotationStringRedaction;
  }
  
  return nil;
}

@end
