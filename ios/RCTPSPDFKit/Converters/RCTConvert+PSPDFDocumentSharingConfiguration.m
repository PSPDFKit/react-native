//
//  RCTConvert+PSPDFDocumentSharingConfiguration.m
//  RCTPSPDFKit
//
//  Created by Oscar Swanros on 10/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTConvert+PSPDFDocumentSharingConfiguration.h"

@implementation RCTConvert (PSPDFDocumentSharingConfiguration)

+ (PSPDFDocumentSharingConfiguration *)PSPDFDocumentSharingConfiguration:(id)json {
  return [PSPDFDocumentSharingConfiguration configurationWithBuilder:^(PSPDFDocumentSharingConfigurationBuilder * builder) {
    [builder setupFromJSON:json];
  }];
}

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingFileFormatOptions,
                         (@{@"PDF" : @(PSPDFDocumentSharingFileFormatOptionPDF),
                            @"original": @(PSPDFDocumentSharingFileFormatOptionOriginal),
                            @"image": @(PSPDFDocumentSharingFileFormatOptionImage)}),
                         PSPDFDocumentSharingFileFormatOptionPDF,
                         unsignedIntegerValue);

RCT_CONVERTER(PSPDFDocumentSharingDestination, PSPDFDocumentSharingDestination, stringValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingAnnotationOptions,
                         (@{@"embed": @(PSPDFDocumentSharingAnnotationOptionEmbed),
                            @"flatten": @(PSPDFDocumentSharingAnnotationOptionFlatten),
                            @"flatten_for_print": @(PSPDFDocumentSharingAnnotationOptionFlattenForPrint),
                            @"summary": @(PSPDFDocumentSharingAnnotationOptionSummary),
                            @"remove": @(PSPDFDocumentSharingAnnotationOptionRemove)
                            }),
                         PSPDFDocumentSharingAnnotationOptionEmbed,
                         unsignedIntegerValue);

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingPagesOptions,
                         (@{@"all": @(PSPDFDocumentSharingPagesOptionAll),
                            @"range": @(PSPDFDocumentSharingPagesOptionRange),
                            @"current": @(PSPDFDocumentSharingPagesOptionCurrent),
                            @"annotated": @(PSPDFDocumentSharingPagesOptionAnnotated)}),
                         PSPDFDocumentSharingPagesOptionAll,
                         unsignedIntegerValue)

@end

#define SET(property, type) if (dictionary[@#property]) self.property = [RCTConvert type:dictionary[@#property]];

@implementation PSPDFDocumentSharingConfigurationBuilder (RNAdditions)

- (void)setupFromJSON:(id)json {
  NSDictionary *dictionary = [RCTConvert NSDictionary:json];
  
  SET(pageSelectionOptions, PSPDFDocumentSharingPagesOptions)
  SET(fileFormatOptions, PSPDFDocumentSharingFileFormatOptions)
  SET(annotationOptions, PSPDFDocumentSharingAnnotationOptions)
  SET(applicationActivities, NSArray)
  SET(excludedActivityTypes, NSArray)
  SET(destination, PSPDFDocumentSharingDestination)
}

@end
