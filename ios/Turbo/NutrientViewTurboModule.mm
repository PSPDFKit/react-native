//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//
#if RCT_NEW_ARCH_ENABLED

#import "NutrientViewTurboModule.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

#import <React/RCTBridge.h>

#import <nutrient_sdk_react_native_codegen/nutrient_sdk_react_native_codegen.h>

#import "RCTPSPDFKitView.h"
#import "RCTConvert+PSPDFAnnotation.h"
#import "RCTConvert+PSPDFConfiguration.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTConvert+PSPDFAnnotationToolbarConfiguration.h"
#import "RCTConvert+PSPDFViewMode.h"
#import "RCTConvert+PSPDFConfiguration.h"
#import "NutrientViewRegistry.h"
#import "NutrientPropsToolbarHelper.h"
#import "NutrientPropsMeasurementConfigurationHelper.h"

@interface NutrientViewTurboModule ()<NativeNutrientViewTurboModuleSpec>
@end

// Currently there is no way to access the other modules, aside from using the bridge
@interface RCTBridge (Private)
+ (RCTBridge *)currentBridge;
@end

@implementation NutrientViewTurboModule

RCT_EXPORT_MODULE();

- (NSError *)_makeErrorWithCode:(NSString *)code message:(NSString *)message {
    NSDictionary *userInfo = message ? @{ NSLocalizedDescriptionKey: message } : nil;
    return [NSError errorWithDomain:@"NutrientViewTurboModule" code:0 userInfo:userInfo];
}

// Standard error codes
#define ERR_VIEW_NOT_FOUND @"VIEW_NOT_FOUND"
#define ERR_ANNOTATION     @"ANNOTATION_ERROR"
#define ERR_MODE           @"MODE_ERROR"
#define ERR_OPERATION      @"OPERATION_FAILED"
#define ERR_CONFIG         @"CONFIGURATION_ERROR"
#define ERR_TOOLBAR        @"TOOLBAR_ERROR"
#define ERR_MEASURE_CFG    @"MEASUREMENT_CONFIG_ERROR"
#define ERR_INVALID_ARGS   @"INVALID_ARGS"

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeNutrientViewTurboModuleSpecJSI>(params);
}

- (void)enterAnnotationCreationMode:(nonnull NSString *)reference annotationType:(nonnull NSString *)annotationType resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        PSPDFAnnotationString convertedAnnotationType = [RCTConvert PSPDFAnnotationStringFromName:annotationType];
        PSPDFAnnotationVariantString convertedAnnotationVariant = nil;
        // Handle possible variant
        if (convertedAnnotationType == PSPDFAnnotationStringInk) {
            convertedAnnotationVariant = [RCTConvert PSPDFAnnotationVariantStringFromName:annotationType];
        }
        
        BOOL success = [view enterAnnotationCreationMode:convertedAnnotationType withVariant:convertedAnnotationVariant];
        if (success) {
            resolve(@(success));
        } else {
            reject(ERR_ANNOTATION, @"enterAnnotationCreationMode failed", [self _makeErrorWithCode:ERR_ANNOTATION message:@"enterAnnotationCreationMode failed"]);
        }
    });
}

- (void)exitCurrentlyActiveMode:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        BOOL success = [view exitCurrentlyActiveMode];
        if (success) {
            resolve(@(success));
        } else {
            reject(ERR_MODE, @"exitCurrentlyActiveMode failed", [self _makeErrorWithCode:ERR_MODE message:@"exitCurrentlyActiveMode failed"]);
        }
    });
}

- (void)getConfiguration:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        NSDictionary *configuration = [RCTConvert convertConfiguration:view.pdfController];
        if (configuration) {
            resolve(configuration);
        } else {
            reject(ERR_CONFIG, @"getConfiguration failed", [self _makeErrorWithCode:ERR_CONFIG message:@"getConfiguration failed"]);
        }
    });
}

- (void)getMeasurementValueConfigurations:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        NSArray *result = [NutrientPropsMeasurementConfigurationHelper getMeasurementValueConfigurations:view.pdfController.document];
        NSDictionary *configs = [NSDictionary dictionaryWithObject:result
                                                            forKey:@"measurementValueConfigurations"];
      if (configs) {
        resolve(configs);
      } else {
        reject(ERR_MEASURE_CFG, @"getMeasurementValueConfigurations failed", [self _makeErrorWithCode:ERR_MEASURE_CFG message:@"getMeasurementValueConfigurations failed"]);
      }
    });
}

- (void)getToolbar:(nonnull NSString *)reference viewMode:(nonnull NSString *)viewMode resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
      
        NSArray *leftItems = [view getLeftBarButtonItemsForViewMode:viewMode];
        NSArray *rightItems = [view getRightBarButtonItemsForViewMode:viewMode];
        
        NSDictionary *toolbar = @{
            @"viewMode" : viewMode == nil ? [RCTConvert PSPDFViewModeString:view.pdfController.viewMode] : viewMode,
            @"leftBarButtonItems" : leftItems,
            @"rightBarButtonItems" : rightItems
        };
        
      if (toolbar) {
        resolve(toolbar);
      } else {
        reject(ERR_TOOLBAR, @"getToolbar failed", [self _makeErrorWithCode:ERR_TOOLBAR message:@"getToolbar failed"]);
      }
    });
}

- (void)clearSelectedAnnotations:(nonnull NSString *)reference resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        [view clearSelectedAnnotations];
        resolve(@YES);
    });
}

- (void)selectAnnotations:(nonnull NSString *)reference annotationsJSONString:(nonnull NSString *)annotationsJSONString showContextualMenu:(nonnull NSNumber *)showContextualMenu resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        // Parse JSON string to array of dictionaries
        NSData *data = [annotationsJSONString dataUsingEncoding:NSUTF8StringEncoding];
        NSError *error;
        NSArray *annotationsArray = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
        
        if (error || ![annotationsArray isKindOfClass:[NSArray class]]) {
            reject(ERR_INVALID_ARGS, @"Invalid JSON string for annotations", error ?: [self _makeErrorWithCode:ERR_INVALID_ARGS message:@"Invalid JSON string for annotations"]);
            return;
        }
        
        // Extract only uuid and name properties as expected by selectAnnotations
        NSMutableArray *annotationsJSON = [NSMutableArray array];
        for (id annotation in annotationsArray) {
            if ([annotation isKindOfClass:[NSDictionary class]]) {
                NSDictionary *annotationDict = (NSDictionary *)annotation;
                NSMutableDictionary *simplifiedDict = [NSMutableDictionary dictionary];
                
                // Only include uuid and name properties
                if (annotationDict[@"uuid"]) {
                    simplifiedDict[@"uuid"] = annotationDict[@"uuid"];
                }
                if (annotationDict[@"name"]) {
                    simplifiedDict[@"name"] = annotationDict[@"name"];
                }
                
                [annotationsJSON addObject:[simplifiedDict copy]];
            }
        }
        
        BOOL showMenu = showContextualMenu ? [showContextualMenu boolValue] : NO;
        BOOL success = [view selectAnnotations:annotationsJSON showContextualMenu:showMenu];
        resolve(@(success));
    });
}

- (void)setExcludedAnnotations:(nonnull NSString *)reference annotations:(nonnull NSArray *)annotations { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            return;
        }
        
        [view setExcludedAnnotations:annotations];
    });
}

- (void)setUserInterfaceVisible:(nonnull NSString *)reference visible:(nonnull NSNumber *)visible resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        BOOL success = [view setUserInterfaceVisible:[visible boolValue]];
        if (success) {
            resolve(@(success));
        } else {
            reject(ERR_OPERATION, @"setUserInterfaceVisible failed", [self _makeErrorWithCode:ERR_OPERATION message:@"setUserInterfaceVisible failed"]);
        }
    });
}

- (void)setMeasurementValueConfigurations:(nonnull NSString *)reference configurations:(nonnull NSArray *)configurations resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        BOOL success = [NutrientPropsMeasurementConfigurationHelper setMeasurementValueConfigurations:configurations
                                                                                               document:view.pdfController.document];
        success ? resolve(@YES) : reject(ERR_MEASURE_CFG, @"Failed to set all measurement configuration.", [self _makeErrorWithCode:ERR_MEASURE_CFG message:@"Failed to set all measurement configuration."]);
    });
}

- (void)setPageIndex:(NSString *)reference
           pageIndex:(double)pageIndex
            animated:(BOOL)animated
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            reject(ERR_VIEW_NOT_FOUND, @"Fabric view not found for reference", [self _makeErrorWithCode:ERR_VIEW_NOT_FOUND message:@"Fabric view not found for reference"]);
            return;
        }
        
        [view updatePageIndex:pageIndex];
        resolve(@YES);
    });
}

- (void)setToolbar:(nonnull NSString *)reference toolbar:(nonnull NSString *)toolbarJSONString { 
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTPSPDFKitView *view = [[NutrientViewRegistry shared] viewForId:reference];
        if (!view) {
            return;
        }
        
        NSDictionary *toolbarDict = [self dictionaryFromJSONString:toolbarJSONString];
        if (toolbarDict) {
            [NutrientPropsToolbarHelper applyToolbarFromJSON:toolbarDict toView:view];
        }
    });
}

- (void)destroyView:(nonnull NSString *)reference { 
    // No-Op. Only Android.
}

- (NSDictionary *)dictionaryFromJSONString:(NSString *)jsonString {
    if (jsonString == nil) { return nil; }
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    if (data == nil) { return nil; }
    NSError *error = nil;
    id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (error != nil || obj == nil) { return nil; }
    if ([obj isKindOfClass:[NSDictionary class]]) {
        return (NSDictionary *)obj;
    }
    return nil;
}

@end 

#endif // RCT_NEW_ARCH_ENABLED
