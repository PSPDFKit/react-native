//
//  Copyright © 2018-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(RNProcessor, RCTEventEmitter)
RCT_EXTERN_METHOD(generateBlankPDF: (NSDictionary *)configuration onSuccess: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(generatePDFFromHtmlString: (NSDictionary *)configuration html: (NSString*)html onSuccess: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(generatePDFFromHtmlURL: (NSDictionary *)configuration htmlURL: (NSString*)html onSuccess: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(getTemporaryDirectory: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(generatePDFFromTemplate: (NSDictionary *)configuration onSuccess: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(generatePDFFromImages: (NSDictionary *)configuration onSuccess: (RCTPromiseResolveBlock)resolve onError: (RCTPromiseRejectBlock)reject);
@end
