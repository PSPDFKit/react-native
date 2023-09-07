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

NSString *const annotationLink = @"link";
NSString *const annotationStrikeOut = @"strikeout";
NSString *const annotationUnderline = @"underline";
NSString *const annotationSquiggly = @"squiggly";
NSString *const annotationNote = @"note";
NSString *const annotationFreeText = @"freetext";
NSString *const annotationInk = @"ink";
NSString *const annotationLine = @"line";
NSString *const annotationSquare = @"square";
NSString *const annotationCircle = @"circle";
NSString *const annotationPolygon = @"polygon";
NSString *const annotationPolyLine = @"polyline";
NSString *const annotationSignature = @"signature";
NSString *const annotationStamp = @"stamp";
NSString *const annotationEraser = @"eraser";
NSString *const annotationSound = @"sound";
NSString *const annotationImage = @"image";
NSString *const annotationRedaction = @"redaction";
NSString *const annotationDistanceMeasurement = @"distance";
NSString *const annotationPerimeterMeasurement = @"perimeter";
NSString *const annotationPolygonalAreaMeasurement = @"area_polygon";
NSString *const annotationEllipticalAreaMeasurement = @"area_circle";
NSString *const annotationSquareAreaMeasurement = @"area_square";
NSString *const annotationInkPen = @"pen";
NSString *const annotationInkMagic = @"magic_ink";
NSString *const annotationInkHighlighter = @"highlighter";
NSString *const annotationLineArrow = @"arrow";
NSString *const annotationFreeTextCallout = @"freetext_callout";
NSString *const annotationPolygonCloud = @"cloudy_polygon";
NSString *const annotationTextHighlighter = @"highlight";

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
          [subItems addObject:[PSPDFAnnotationGroupItem itemWithType:annotationString variant:[RCTConvert PSPDFAnnotationVariantStringFromName:subItem] configurationBlock: [RCTConvert PSPDFAnnotationGroupItemConfigurationBlockFromName:subItem]]];
        }
      }
      [parsedItems addObject:[PSPDFAnnotationGroup groupWithItems:subItems]];
    } else {
      PSPDFAnnotationString annotationString = [RCTConvert PSPDFAnnotationStringFromName:itemToParse];
      if (annotationString) {
        [parsedItems addObject:[PSPDFAnnotationGroup groupWithItems:@[[PSPDFAnnotationGroupItem itemWithType:annotationString variant:[RCTConvert PSPDFAnnotationVariantStringFromName:itemToParse] configurationBlock:[RCTConvert PSPDFAnnotationGroupItemConfigurationBlockFromName:itemToParse]]]]];
      }
    }
  }
  return  [[PSPDFAnnotationToolbarConfiguration alloc] initWithAnnotationGroups:parsedItems];
}

+ (PSPDFAnnotationString)PSPDFAnnotationStringFromName:(NSString *)name {

  static NSDictionary *nameToAnnotationStringMapping;
    
    nameToAnnotationStringMapping = @{
      annotationLink: PSPDFAnnotationStringLink,
      annotationStrikeOut: PSPDFAnnotationStringStrikeOut,
      annotationUnderline: PSPDFAnnotationStringUnderline,
      annotationSquiggly: PSPDFAnnotationStringSquiggly,
      annotationNote: PSPDFAnnotationStringNote,
      annotationFreeText: PSPDFAnnotationStringFreeText,
      annotationInk: PSPDFAnnotationStringInk,
      annotationLine: PSPDFAnnotationStringLine,
      annotationSquare: PSPDFAnnotationStringSquare,
      annotationCircle: PSPDFAnnotationStringCircle,
      annotationPolygon: PSPDFAnnotationStringPolygon,
      annotationPolyLine: PSPDFAnnotationStringPolyLine,
      annotationSignature: PSPDFAnnotationStringSignature,
      annotationStamp: PSPDFAnnotationStringStamp,
      annotationEraser: PSPDFAnnotationStringEraser,
      annotationSound: PSPDFAnnotationStringSound,
      annotationImage: PSPDFAnnotationStringImage,
      annotationRedaction: PSPDFAnnotationStringRedaction,
      annotationDistanceMeasurement: PSPDFAnnotationStringLine,
      annotationPerimeterMeasurement: PSPDFAnnotationStringPolyLine,
      annotationPolygonalAreaMeasurement: PSPDFAnnotationStringPolygon,
      annotationEllipticalAreaMeasurement: PSPDFAnnotationStringCircle,
      annotationSquareAreaMeasurement: PSPDFAnnotationStringSquare,
      annotationInkPen: PSPDFAnnotationStringInk,
      annotationInkMagic: PSPDFAnnotationStringInk,
      annotationInkHighlighter: PSPDFAnnotationStringInk,
      annotationLineArrow: PSPDFAnnotationStringLine,
      annotationFreeTextCallout: PSPDFAnnotationStringFreeText,
      annotationPolygonCloud: PSPDFAnnotationStringPolygon,
      annotationTextHighlighter: PSPDFAnnotationStringHighlight
    };

  return nameToAnnotationStringMapping[name];
}

+ (PSPDFAnnotationString)PSPDFAnnotationVariantStringFromName:(NSString *)name {

  static NSDictionary *nameToAnnotationStringMapping;

    nameToAnnotationStringMapping = @{
      annotationInkPen: PSPDFAnnotationVariantStringInkPen,
      annotationInkMagic: PSPDFAnnotationVariantStringInkMagic,
      annotationInkHighlighter: PSPDFAnnotationVariantStringInkHighlighter,
      annotationLineArrow: PSPDFAnnotationVariantStringLineArrow,
      annotationFreeTextCallout: PSPDFAnnotationVariantStringFreeTextCallout,
      annotationPolygonCloud: PSPDFAnnotationVariantStringPolygonCloud,
      annotationDistanceMeasurement: PSPDFAnnotationVariantStringDistanceMeasurement,
      annotationPerimeterMeasurement: PSPDFAnnotationVariantStringPerimeterMeasurement,
      annotationPolygonalAreaMeasurement: PSPDFAnnotationVariantStringPolygonalAreaMeasurement,
      annotationEllipticalAreaMeasurement: PSPDFAnnotationVariantStringEllipticalAreaMeasurement,
      annotationSquareAreaMeasurement: PSPDFAnnotationVariantStringRectangularAreaMeasurement
    };
    
  return nameToAnnotationStringMapping[name];
}

// This picks the configuration block for annotation tools so that the coreect icons are displayed.
+ (PSPDFAnnotationGroupItemConfigurationBlock) PSPDFAnnotationGroupItemConfigurationBlockFromName:(NSString *)name {
    
    // if measurement annotations
    NSArray *measurementAnnotations = @[annotationDistanceMeasurement, annotationPerimeterMeasurement, annotationPolygonalAreaMeasurement, annotationEllipticalAreaMeasurement, annotationSquareAreaMeasurement];
    if ([measurementAnnotations containsObject:name]) {
        return [PSPDFAnnotationGroupItem measurementConfigurationBlock];
    }

     // if line annotations
     NSArray *lineAnnotations = @[annotationLine, annotationLineArrow];
      if ([lineAnnotations containsObject:name]) {
          return [PSPDFAnnotationGroupItem lineConfigurationBlock];
      }

     // if ink annotations,
      NSArray *inkAnnotations = @[annotationInkPen, annotationInkMagic, annotationInkHighlighter];
      if ([inkAnnotations containsObject:name]) {
          return [PSPDFAnnotationGroupItem inkConfigurationBlock];
      }
     // if free text annotations
      NSArray *freeTextAnnotations = @[annotationFreeText, annotationFreeTextCallout];
      if ([freeTextAnnotations containsObject:name]) {
          return [PSPDFAnnotationGroupItem freeTextConfigurationBlock];
      }

     // if polygon annotations
      NSArray *polygonAnnotations = @[annotationPolygon, annotationPolygonCloud];
      if ([polygonAnnotations containsObject:name]) {
          return [PSPDFAnnotationGroupItem polygonConfigurationBlock];
      }
    
    return nil;
}

@end
