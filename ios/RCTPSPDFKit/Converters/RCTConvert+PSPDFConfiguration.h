//
//  RCTConvert+PSPDFConfiguration.h
//  RCTPSPDFKit
//
//  Created by Robert Wijas on 12/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTConvert.h"
@import PSPDFKit;

@interface RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json;

@end
