//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
#if RCT_NEW_ARCH_ENABLED

#import "NutrientInstantViewTurboModule.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <nutrient_sdk_react_native_codegen/nutrient_sdk_react_native_codegen.h>
#import "RCTInstantPSPDFKitView.h"
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFAnnotationToolbarConfiguration.h"
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTConvert+PSPDFViewMode.h"
#import "NutrientInstantViewRegistry.h"
#import "NutrientPropsToolbarHelper.h"
#import "NutrientPropsMeasurementConfigurationHelper.h"

@interface NutrientInstantViewTurboModule ()<NativeNutrientInstantViewTurboModuleSpec>
@end

@implementation NutrientInstantViewTurboModule

RCT_EXPORT_MODULE(NutrientInstantViewTurboModule);

- (NSError *)_makeErrorWithCode:(NSString *)code message:(NSString *)message {
  NSDictionary *userInfo = message ? @{ NSLocalizedDescriptionKey: message } : nil;
  return [NSError errorWithDomain:@"NutrientInstantViewTurboModule" code:0 userInfo:userInfo];
}

#define ERR_VIEW_NOT_FOUND @"VIEW_NOT_FOUND"
#define ERR_ANNOTATION     @"ANNOTATION_ERROR"
#define ERR_MODE           @"MODE_ERROR"
#define ERR_OPERATION      @"OPERATION_FAILED"
#define ERR_CONFIG         @"CONFIGURATION_ERROR"
#define ERR_TOOLBAR        @"TOOLBAR_ERROR"
#define ERR_MEASURE_CFG    @"MEASUREMENT_CONFIG_ERROR"

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeNutrientInstantViewTurboModuleSpecJSI>(params);
}

- (void)enterAnnotationCreationMode:(nonnull NSString *)reference annotationType:(nonnull NSString *)annotationType resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) {
      reject(ERR_VIEW_NOT_FOUND, @"Instant view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]);
      return;
    }
    PSPDFAnnotationString convertedType = [RCTConvert PSPDFAnnotationStringFromName:annotationType];
    PSPDFAnnotationVariantString variant = (convertedType == PSPDFAnnotationStringInk) ? [RCTConvert PSPDFAnnotationVariantStringFromName:annotationType] : nil;
    BOOL success = [view enterAnnotationCreationMode:convertedType withVariant:variant];
    success ? resolve(@YES) : reject(ERR_ANNOTATION, @"enterAnnotationCreationMode failed", [self _makeErrorWithCode:ERR_ANNOTATION message:nil]);
  });
}

- (void)enterContentEditingMode:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    [view enterContentEditingMode];
    resolve(@(YES));
  });
}

- (void)exitCurrentlyActiveMode:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    BOOL success = [view exitCurrentlyActiveMode];
    success ? resolve(@(success)) : reject(ERR_MODE, @"exitCurrentlyActiveMode failed", [self _makeErrorWithCode:ERR_MODE message:nil]);
  });
}

- (void)getConfiguration:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    NSDictionary *config = [RCTConvert convertConfiguration:view.pdfController];
    config ? resolve(config) : reject(ERR_CONFIG, @"getConfiguration failed", [self _makeErrorWithCode:ERR_CONFIG message:nil]);
  });
}

- (void)getMeasurementValueConfigurations:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    NSArray *result = [NutrientPropsMeasurementConfigurationHelper getMeasurementValueConfigurations:view.pdfController.document];
    resolve(result ? @{ @"measurementValueConfigurations": result } : @{});
  });
}

- (void)getToolbar:(nonnull NSString *)reference viewMode:(nonnull NSString *)viewMode resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    NSArray *left = [view getLeftBarButtonItemsForViewMode:viewMode];
    NSArray *right = [view getRightBarButtonItemsForViewMode:viewMode];
    resolve(@{ @"viewMode": viewMode ?: [RCTConvert PSPDFViewModeString:view.pdfController.viewMode], @"leftBarButtonItems": left ?: @[], @"rightBarButtonItems": right ?: @[] });
  });
}

- (void)setExcludedAnnotations:(nonnull NSString *)reference annotations:(nonnull NSArray *)annotations {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (view) [view setExcludedAnnotations:annotations];
  });
}

- (void)setUserInterfaceVisible:(nonnull NSString *)reference visible:(BOOL)visible resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    BOOL success = [view setUserInterfaceVisible:visible];
    success ? resolve(@(success)) : reject(ERR_OPERATION, @"setUserInterfaceVisible failed", [self _makeErrorWithCode:ERR_OPERATION message:nil]);
  });
}

- (void)executeAction:(nonnull NSString *)reference requestId:(nonnull NSString *)requestId allow:(BOOL)allow resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    BOOL success = [view executePendingActionWithRequestId:requestId allow:allow];
    resolve(@(success));
  });
}

- (void)setMeasurementValueConfigurations:(nonnull NSString *)reference configurations:(nonnull NSArray *)configurations resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    BOOL success = [NutrientPropsMeasurementConfigurationHelper setMeasurementValueConfigurations:configurations document:view.pdfController.document];
    success ? resolve(@YES) : reject(ERR_MEASURE_CFG, @"setMeasurementValueConfigurations failed", [self _makeErrorWithCode:ERR_MEASURE_CFG message:nil]);
  });
}

- (void)setPageIndex:(nonnull NSString *)reference pageIndex:(double)pageIndex animated:(BOOL)animated resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) { reject(ERR_VIEW_NOT_FOUND, @"Instant view not found", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:nil]); return; }
    [view updatePageIndex:(PSPDFPageIndex)pageIndex];
    resolve(@YES);
  });
}

- (void)setToolbar:(nonnull NSString *)reference toolbar:(nonnull NSString *)toolbarJSONString {
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTInstantPSPDFKitView *view = [[NutrientInstantViewRegistry shared] viewForId:reference];
    if (!view) return;
    NSData *data = [toolbarJSONString dataUsingEncoding:NSUTF8StringEncoding];
    if (!data) return;
    NSDictionary *toolbarDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
    if ([toolbarDict isKindOfClass:[NSDictionary class]])
      [NutrientPropsToolbarHelper applyToolbarFromJSON:toolbarDict toView:(RCTPSPDFKitView *)view];
  });
}

- (void)destroyView:(nonnull NSString *)reference {
  // No-op on iOS
}

@end

#endif
