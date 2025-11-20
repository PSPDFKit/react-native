//
//  NutrientPropsAnnotationsHelper.h
//

#import <Foundation/Foundation.h>

@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsAnnotationsHelper : NSObject

+ (void)applyAnnotationPresetsFromJSON:(id)json;
+ (void)applyAnnotationContextualMenuFromJSON:(NSDictionary *)annotationContextualMenu toView:(RCTPSPDFKitView *)view;

@end

NS_ASSUME_NONNULL_END 