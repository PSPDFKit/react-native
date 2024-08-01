//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
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

@interface RCT_EXTERN_MODULE(PDFDocumentManager, NSObject)

RCT_EXTERN_METHOD(getDocumentId:(NSNumber _Nonnull)reference onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(invalidateCache:(NSNumber _Nonnull)reference onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(invalidateCacheForPage:(NSNumber _Nonnull)reference pageIndex:(NSInteger)pageIndex onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(save:(NSNumber _Nonnull)reference onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getAllUnsavedAnnotations:(NSNumber _Nonnull)reference onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getAnnotations:(NSNumber _Nonnull)reference type:(NSString *)type onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(getAnnotationsForPage:(NSNumber _Nonnull)reference pageIndex:(NSInteger)pageIndex type:(NSString *)type onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(removeAnnotations:(NSNumber _Nonnull)reference instantJSON:(NSArray<NSDictionary *> *)instantJSON onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(addAnnotations:(NSNumber _Nonnull)reference instantJSON:(NSDictionary *)instantJSON onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(importXFDF:(NSNumber _Nonnull)reference filePath:(NSString *)filePath onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(exportXFDF:(NSNumber _Nonnull)reference filePath:(NSString *)filePath onSuccess:(RCTPromiseResolveBlock)resolve onError:(RCTPromiseRejectBlock)reject);

@end
