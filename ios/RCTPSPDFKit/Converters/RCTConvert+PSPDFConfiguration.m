//
//  RCTConvert+PSPDFConfiguration.m
//  RCTPSPDFKit
//
//  Created by Robert Wijas on 12/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTConvert+PSPDFConfiguration.h"

@implementation RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json {
  NSDictionary *dictionary = [self NSDictionary:json];

  return [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
    builder.scrollDirection = [self PSPDFScrollDirection:dictionary[@"scrollDirection"]];
    builder.backgroundColor = [self UIColor:dictionary[@"backgroundColor"]];
  }];
}

RCT_ENUM_CONVERTER(PSPDFScrollDirection,
                   (@{@"horizontal" : @(PSPDFScrollDirectionHorizontal),
                      @"vertical" : @(PSPDFScrollDirectionVertical)}),
                   PSPDFScrollDirectionHorizontal,
                   unsignedIntegerValue)

@end
