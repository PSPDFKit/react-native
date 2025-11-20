//
//  NutrientPropsMeasurementConfigurationHelper.h
//

#import <Foundation/Foundation.h>

@class PSPDFDocument;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsMeasurementConfigurationHelper : NSObject

+ (BOOL)setMeasurementValueConfigurations:(NSArray *)configurations document:(PSPDFDocument *)document;
+ (NSArray *)getMeasurementValueConfigurations:(PSPDFDocument *)document;

@end

NS_ASSUME_NONNULL_END
