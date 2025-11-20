//
//  NutrientPropsFontHelper.h
//

#import <Foundation/Foundation.h>

@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsFontHelper : NSObject

+ (void)applyAvailableFontNamesFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)applySelectedFontNameFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)applyShowDownloadableFontsFromJSON:(id)json toView:(RCTPSPDFKitView *)view;
+ (void)configureCustomFontPickerForView:(RCTPSPDFKitView *)view;

@end

NS_ASSUME_NONNULL_END 