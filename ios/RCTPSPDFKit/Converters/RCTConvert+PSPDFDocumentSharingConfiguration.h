//
//  RCTConvert+PSPDFDocumentSharingConfiguration.h
//  RCTPSPDFKit
//
//  Created by Oscar Swanros on 10/12/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTConvert.h>
@import PSPDFKit;
@import PSPDFKitUI;

@interface RCTConvert (PSPDFDocumentSharingConfiguration)

+ (PSPDFDocumentSharingConfiguration *)PSPDFDocumentSharingConfiguration:(id)json;

@end

@interface PSPDFDocumentSharingConfigurationBuilder (RNAdditions)

- (void)setupFromJSON:(id)json;

@end
