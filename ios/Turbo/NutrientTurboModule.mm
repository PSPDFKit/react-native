//
//  Copyright © 2025 PSPDFKit GmbH.
//
#if RCT_NEW_ARCH_ENABLED

#import "NutrientTurboModule.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTLog.h>

#import <PSPDFKit/PSPDFKit.h>
#import "NutrientModuleCommon.h"
#import "NutrientNotificationCenterBridge.h"
#import "RCTConvert+PSPDFAnnotationChange.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTConvert+PSPDFConfiguration.h"

@interface RCTBridge (Private)
+ (RCTBridge *)currentBridge;
@end

@interface NutrientTurboModule ()<NativeNutrientModuleSpec, NutrientNotificationCenterDelegate> {
  NSMutableSet<NSString *> *_activeEvents;
}
@end

@implementation NutrientTurboModule

RCT_EXPORT_MODULE(Nutrient);

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNutrientModuleSpecJSI>(params);
}

#pragma mark - Init / Dealloc

- (instancetype)init {
    if (self = [super init]) {
        [NutrientNotificationCenterBridge setDelegate:self];
    }
    return self;
}

- (void)dealloc {
    [NutrientNotificationCenterBridge clearDelegate];
}

#pragma mark - Constants

- (NSString *)versionString {
  return PSPDFKitGlobal.versionString;
}

#pragma mark - Spec methods (stubs)

- (void)present:(NSString *)document configuration:(NSDictionary *)configuration resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [NutrientModuleCommon presentDocument:[RCTConvert PSPDFDocument:document] configuration:[RCTConvert PSPDFConfiguration:configuration] resolve:resolve reject:reject];
}

- (void)presentInstant:(NSDictionary *)documentData configuration:(NSDictionary *)configuration resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [NutrientModuleCommon presentInstant:documentData configuration:configuration resolve:resolve reject:reject];
}

- (void)dismiss:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [NutrientModuleCommon dismissWithResolve:resolve reject:reject];
}

- (void)setPageIndex:(double)pageIndex animated:(BOOL)animated {
  [NutrientModuleCommon setPageIndex:(NSUInteger)pageIndex
                             animated:animated
                              resolve:^(__unused id result) {
                                // no-op for TurboModule (void in spec)
                              }
                               reject:^(__unused NSString *code, __unused NSString *message, __unused NSError *error) {
                                 RCTLogInfo(@"setPageIndex (Turbo) failed: %@", message ?: @"");
                               }];
}

- (NSNumber *)setLicenseKey:(NSString * _Nullable)licenseKey {
  return [NutrientModuleCommon setLicenseKey:licenseKey];
}

- (NSDictionary *)getDocumentProperties:(NSString * _Nullable)documentPath {
  return [NutrientModuleCommon documentPropertiesForPath:documentPath];
}

- (NSNumber *)setLicenseKeys:(NSString * _Nullable)androidLicenseKey iOSLicenseKey:(NSString * _Nullable)iOSLicenseKey {
  return [NutrientModuleCommon setLicenseKey:iOSLicenseKey];
}

- (void)handleListenerAdded:(NSString *)event componentId:(double)componentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  if (_activeEvents == nil) {
    _activeEvents = [NSMutableSet new];
  }
  if (event != nil) {
    [_activeEvents addObject:event];
  }
  resolve([NutrientModuleCommon handleListenerAdded:event]);
}

- (void)handleListenerRemoved:(NSString *)event componentId:(double)componentId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  if (_activeEvents != nil && event != nil) {
    [_activeEvents removeObject:event];
  }
  // If our local list is empty, mark as last
  BOOL noneLeft = (_activeEvents == nil || _activeEvents.count == 0);
  resolve([NutrientModuleCommon handleListenerRemoved:event isLast:noneLeft]);
}

// Required for NativeEventEmitter compatibility in TurboModule (no-op under Turbo)
- (void)addListener:(NSString *)eventName { /* no-op */ }
- (void)removeListeners:(double)count { /* no-op */ }

- (void)processAnnotations:(nonnull NSString *)annotationChange
           annotationTypes:(NSArray * _Nullable)annotationTypes
        sourceDocumentPath:(nonnull NSString *)sourceDocumentPath
     processedDocumentPath:(nonnull NSString *)processedDocumentPath
                  password:(NSString * _Nullable)password
                   resolve:(nonnull RCTPromiseResolveBlock)resolve
                    reject:(nonnull RCTPromiseRejectBlock)reject {

    [NutrientModuleCommon processAnnotationsChange:[RCTConvert PSPDFAnnotationChange:annotationChange]
                                   annotationTypes:annotationTypes
                                    sourceDocument:[RCTConvert PSPDFDocument:sourceDocumentPath]
                             processedDocumentPath:processedDocumentPath
                                          password:password
                                           resolve:resolve
                                            reject:reject];
}


#pragma mark - NutrientNotificationCenterDelegate (emit via codegen)

- (void)nncDocumentLoaded:(NSDictionary *)payload { [self emitDocumentLoaded:payload]; }
- (void)nncDocumentLoadFailed:(NSDictionary *)payload { [self emitDocumentLoadFailed:payload]; }
- (void)nncDocumentPageChanged:(NSDictionary *)payload { [self emitDocumentPageChanged:payload]; }
- (void)nncDocumentScrolled:(NSDictionary *)payload { [self emitDocumentScrolled:payload]; }
- (void)nncDocumentTapped:(NSDictionary *)payload { [self emitDocumentTapped:payload]; }
- (void)nncAnnotationsAdded:(NSDictionary *)payload { [self emitAnnotationsAdded:payload]; }
- (void)nncAnnotationChanged:(NSDictionary *)payload { [self emitAnnotationChanged:payload]; }
- (void)nncAnnotationsRemoved:(NSDictionary *)payload { [self emitAnnotationsRemoved:payload]; }
- (void)nncAnnotationsSelected:(NSDictionary *)payload { [self emitAnnotationsSelected:payload]; }
- (void)nncAnnotationsDeselected:(NSDictionary *)payload { [self emitAnnotationsDeselected:payload]; }
- (void)nncAnnotationTapped:(NSDictionary *)payload { [self emitAnnotationTapped:payload]; }
- (void)nncTextSelected:(NSDictionary *)payload { [self emitTextSelected:payload]; }
- (void)nncFormFieldValuesUpdated:(NSDictionary *)payload { [self emitFormFieldValuesUpdated:payload]; }
- (void)nncFormFieldSelected:(NSDictionary *)payload { [self emitFormFieldSelected:payload]; }
- (void)nncFormFieldDeselected:(NSDictionary *)payload { [self emitFormFieldDeselected:payload]; }
- (void)nncAnalytics:(NSDictionary *)payload { [self emitAnalytics:payload]; }
- (void)nncBookmarksChanged:(NSDictionary *)payload { [self emitBookmarksChanged:payload]; }

@end

#endif // RCT_NEW_ARCH_ENABLED
