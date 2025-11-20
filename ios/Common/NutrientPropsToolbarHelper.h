//
//  NutrientPropsToolbarHelper.h
//

#import <Foundation/Foundation.h>

@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsToolbarHelper : NSObject

+ (void)applyLeftBarButtonItemsFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)applyRightBarButtonItemsFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)applyToolbarFromJSON:(NSDictionary *)toolbar toView:(RCTPSPDFKitView *)view;
+ (NSDictionary *)composeToolbarForView:(RCTPSPDFKitView *)view viewMode:(nullable NSString *)viewMode;

@end

NS_ASSUME_NONNULL_END 