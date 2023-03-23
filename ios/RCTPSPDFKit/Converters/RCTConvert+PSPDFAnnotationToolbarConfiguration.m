//
//  Copyright © 2018-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFAnnotationToolbarConfiguration.h"

@implementation RCTConvert (PSPDFAnnotationToolbarConfiguration)

+ (PSPDFAnnotationToolbarConfiguration *)PSPDFAnnotationToolbarConfiguration:(id)json {
  NSArray *itemsToParse = [RCTConvert NSArray:json];
  NSMutableArray *parsedItems = [NSMutableArray arrayWithCapacity:itemsToParse.count];
  for (id itemToParse in itemsToParse) {
    if ([itemToParse isKindOfClass:[NSDictionary class]]) {
      NSDictionary *dict = itemToParse;
      NSArray *subArray = dict[@"items"];
      NSMutableArray *subItems = [NSMutableArray arrayWithCapacity:subArray.count];
      for (id subItem in subArray) {
        if (subItem) {
          PSPDFAnnotationString annotationString = [RCTConvert PSPDFAnnotationStringFromName:subItem];
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
  
  static NSDictionary *nameToAnnotationStringMapping;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSMutableDictionary *mapping = [[NSMutableDictionary alloc] init];
    
    [mapping setValue:PSPDFAnnotationStringLink forKeyPath:@"link"];
    [mapping setValue:PSPDFAnnotationStringHighlight forKeyPath:@"highlight"];
    [mapping setValue:PSPDFAnnotationMenuStrikeout forKeyPath:@"strikeout"];
    [mapping setValue:PSPDFAnnotationStringUnderline forKeyPath:@"underline"];
    [mapping setValue:PSPDFAnnotationMenuSquiggle forKeyPath:@"squiggly"];
    [mapping setValue:PSPDFAnnotationStringNote forKeyPath:@"note"];
    [mapping setValue:PSPDFAnnotationStringFreeText forKeyPath:@"freetext"];
    [mapping setValue:PSPDFAnnotationStringInk forKeyPath:@"ink"];
    [mapping setValue:PSPDFAnnotationStringSquare forKeyPath:@"square"];
    [mapping setValue:PSPDFAnnotationStringCircle forKeyPath:@"circle"];
    [mapping setValue:PSPDFAnnotationStringLine forKeyPath:@"line"];
    [mapping setValue:PSPDFAnnotationStringPolygon forKeyPath:@"polygon"];
    [mapping setValue:PSPDFAnnotationStringPolyLine forKeyPath:@"polyline"];
    [mapping setValue:PSPDFAnnotationStringSignature forKeyPath:@"signature"];
    [mapping setValue:PSPDFAnnotationStringStamp forKeyPath:@"stamp"];
    [mapping setValue:PSPDFAnnotationStringEraser forKeyPath:@"eraser"];
    [mapping setValue:PSPDFAnnotationStringSound forKeyPath:@"sound"];
    [mapping setValue:PSPDFAnnotationStringImage forKeyPath:@"image"];
    [mapping setValue:PSPDFAnnotationStringRedaction forKeyPath:@"redaction"];

    nameToAnnotationStringMapping = [[NSDictionary alloc] initWithDictionary:mapping];
  });
  
  return nameToAnnotationStringMapping[name];
}

@end
