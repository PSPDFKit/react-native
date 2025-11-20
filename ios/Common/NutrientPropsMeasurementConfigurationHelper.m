//
//  NutrientPropsMeasurementConfigurationHelper.m
//

#import "NutrientPropsMeasurementConfigurationHelper.h"

#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#import <PSPDFKit/PSPDFKit.h>

@implementation NutrientPropsMeasurementConfigurationHelper

+ (BOOL)setMeasurementValueConfigurations:(NSArray *)configurations document:(PSPDFDocument *)document {
    BOOL success = YES;
    for (NSDictionary *config in configurations) {
        BOOL result = [PspdfkitMeasurementConverter addMeasurementValueConfigurationWithDocument:document
                                                                                   configuration:config];
        if (result == NO) {
            success = NO;
        }
    }
    return success;
}

+ (NSArray *)getMeasurementValueConfigurations:(PSPDFDocument *)document {
    return [PspdfkitMeasurementConverter getMeasurementValueConfigurationsWithDocument:document];
}

@end
