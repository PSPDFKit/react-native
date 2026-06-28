//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RCTInstantPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientInstantViewRegistry : NSObject
+ (instancetype)shared;
- (void)registerView:(RCTInstantPSPDFKitView *)view withId:(NSString *)nativeId;
- (nullable RCTInstantPSPDFKitView *)viewForId:(NSString *)nativeId;
- (void)unregisterViewWithId:(NSString *)nativeId;
- (NSUInteger)registeredViewCount;
@end

NS_ASSUME_NONNULL_END
