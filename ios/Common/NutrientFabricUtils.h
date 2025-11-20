#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NutrientFabricUtils : NSObject

/// Parses a JSON string into an NSDictionary. Returns nil on error or non-dictionary root.
+ (nullable NSDictionary *)dictionaryFromJSONString:(nullable NSString *)jsonString;

/// Converts annotation presets struct to NSDictionary matching AnnotationPresetConfiguration shape
/// Note: This method expects a pointer to NutrientViewAnnotationPresetsStruct
+ (NSDictionary *)convertAnnotationPresetsToDictionary:(const void *)presetsPtr;

+ (id)objectFromJSONString:(NSString *)jsonString;
+ (NSArray<NSString *> *)stringArrayFromJSONString:(NSString *)jsonString;

@end

NS_ASSUME_NONNULL_END
