//
//  NutrientModuleCommon.h
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h> // for RCTPromiseResolveBlock / RCTPromiseRejectBlock
#import <PSPDFKit/PSPDFKit.h>     // for PSPDFDocument, PSPDFAnnotationChange
#import <PSPDFKitUI/PSPDFKitUI.h> // for PSPDFConfiguration

NS_ASSUME_NONNULL_BEGIN

@interface NutrientModuleCommon : NSObject

+ (NSNumber *)setLicenseKey:(NSString * _Nullable)licenseKey;
+ (NSNumber *)setLicenseKeysWithAndroid:(NSString * _Nullable)androidLicenseKey iOS:(NSString * _Nullable)iOSLicenseKey;
+ (NSDictionary *)documentPropertiesForPath:(NSString * _Nullable)documentPath;

// Present/dismiss
+ (void)presentDocument:(PSPDFDocument *)document
        configuration:(PSPDFConfiguration *)configuration
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject;

+ (void)dismissWithResolve:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject;

// Navigation
+ (void)setPageIndex:(NSUInteger)pageIndex
            animated:(BOOL)animated
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject;

// Instant
+ (void)presentInstant:(NSDictionary *)documentData
        configuration:(NSDictionary *)configuration
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject;

+ (void)setDelayForSyncingLocalChanges:(NSNumber *)delay
                               resolve:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject;

// Processing
+ (void)processAnnotationsChange:(PSPDFAnnotationChange)annotationChange
                 annotationTypes:(NSArray *)annotationTypes
                   sourceDocument:(PSPDFDocument *)sourceDocument
            processedDocumentPath:(NSString *)processedDocumentPath
                           password:(NSString * _Nullable)password
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject;

// Listener lifecycle
+ (NSNumber *)handleListenerAdded:(NSString *)event;
+ (NSNumber *)handleListenerRemoved:(NSString * _Nullable)event isLast:(BOOL)isLast;

@end

NS_ASSUME_NONNULL_END


