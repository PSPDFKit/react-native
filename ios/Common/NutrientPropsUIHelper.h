//
//  NutrientPropsUIHelper.h
//

#import <Foundation/Foundation.h>

@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsUIHelper : NSObject

+ (void)applyToolbarTitleFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)applyShowCloseButtonFromJSON:(id)json toView:(RCTPSPDFKitView *)view;

@end

NS_ASSUME_NONNULL_END 