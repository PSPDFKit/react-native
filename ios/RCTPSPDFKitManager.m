//
//  Copyright © 2016-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTPSPDFKitManager.h"

#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFAnnotationChange.h"
#import "RCTConvert+PSPDFDocument.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif
#import "RCTConvert+PSPDFConfiguration.h"

#define PROPERTY(property) NSStringFromSelector(@selector(property))

#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>
#import <Instant/Instant.h>
#import "Common/NutrientModuleCommon.h"

@implementation RCTPSPDFKitManager

PSPDFSettingKey const PSPDFSettingKeyHybridEnvironment = @"com.pspdfkit.hybrid-environment";

#if !RCT_NEW_ARCH_ENABLED
RCT_EXPORT_MODULE(Nutrient)
#endif

- (void)setBridge:(RCTBridge *)bridge {
    [super setBridge:bridge];
    [NutrientNotificationCenter.shared setEventEmitter:self];
}

RCT_REMAP_METHOD(setLicenseKey, setLicenseKey:(nullable NSString *)licenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([NutrientModuleCommon setLicenseKey:licenseKey]);
}

RCT_REMAP_METHOD(setLicenseKeys, setLicenseKeys:(nullable NSString *)androidLicenseKey iOSLicenseKey:(nullable NSString *)iOSLicenseKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([NutrientModuleCommon setLicenseKeysWithAndroid:androidLicenseKey iOS:iOSLicenseKey]);
}

RCT_REMAP_METHOD(present, present:(PSPDFDocument *)document withConfiguration:(PSPDFConfiguration *)configuration resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon presentDocument:document configuration:configuration resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(dismiss, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon dismissWithResolve:resolve reject:reject];
}

RCT_REMAP_METHOD(setPageIndex, setPageIndex:(NSUInteger)pageIndex animated:(BOOL)animated resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon setPageIndex:pageIndex animated:animated resolve:resolve reject:reject];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDocumentProperties:(NSString *)documentPath) {
  return [NutrientModuleCommon documentPropertiesForPath:documentPath];
}

// MARK: - Annotation Processing

RCT_EXPORT_METHOD(processAnnotations:(PSPDFAnnotationChange)annotationChange annotationTypes:(NSArray *)annotationTypes sourceDocument:(nonnull PSPDFDocument *)sourceDocument processedDocumentPath:(nonnull NSString *)processedDocumentPath password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon processAnnotationsChange:annotationChange annotationTypes:annotationTypes sourceDocument:sourceDocument processedDocumentPath:processedDocumentPath password:password resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(presentInstant: (NSDictionary*)documentData configuration: (NSDictionary*)configuration resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon presentInstant:documentData configuration:configuration resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(setDelayForSyncingLocalChanges: (nonnull NSNumber*)delay resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [NutrientModuleCommon setDelayForSyncingLocalChanges:delay resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(handleListenerAdded:(nonnull NSString* )event
                  componentID:(nonnull NSNumber *)componentID
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([NutrientModuleCommon handleListenerAdded:event]);
}

RCT_EXPORT_METHOD(handleListenerRemoved:(nonnull NSString* )event
                  componentID:(nonnull NSNumber *)componentID
                  resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve([NutrientModuleCommon handleListenerRemoved:event isLast:NO]);
}

- (NSArray<NSString*> *)supportedEvents {
    return @[@"documentLoaded",
             @"documentLoadFailed",
             @"documentPageChanged",
             @"documentScrolled",
             @"documentTapped",
             @"annotationsAdded",
             @"annotationChanged",
             @"annotationsRemoved",
             @"annotationsSelected",
             @"annotationsDeselected",
             @"annotationTapped",
             @"textSelected",
             @"formFieldValuesUpdated",
             @"formFieldSelected",
             @"formFieldDeselected",
             @"analytics",
             @"bookmarksChanged"];
}

// Called by React Native when the first event is registered
- (void)startObserving {
    [NutrientNotificationCenter.shared setIsInUse:YES];
}

// Called by React Native when the last event is unregistered
- (void)stopObserving {
    [NutrientNotificationCenter.shared setIsInUse:NO];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport {
  return @{PROPERTY(versionString): PSPDFKitGlobal.versionString,
           PROPERTY(versionNumber): PSPDFKitGlobal.versionNumber,
           PROPERTY(buildNumber): @(PSPDFKitGlobal.buildNumber)};
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
