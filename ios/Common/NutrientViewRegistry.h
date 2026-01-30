//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <Foundation/Foundation.h>

@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

/**
 * Singleton registry for managing NutrientView instances across Fabric components and TurboModules.
 * Uses nativeId as the key to bridge communication between Fabric views and TurboModule methods.
 */
@interface NutrientViewRegistry : NSObject

/**
 * Returns the shared singleton instance.
 */
+ (instancetype)shared;

/**
 * Registers a NutrientView with the given nativeId.
 * @param view The RCTPSPDFKitView instance to register
 * @param nativeId The unique identifier for this view
 */
- (void)registerView:(RCTPSPDFKitView *)view withId:(NSString *)nativeId;

/**
 * Retrieves a NutrientView by its nativeId.
 * @param nativeId The unique identifier for the view
 * @return The RCTPSPDFKitView instance, or nil if not found
 */
- (nullable RCTPSPDFKitView *)viewForId:(NSString *)nativeId;

/**
 * Unregisters a NutrientView by its nativeId.
 * @param nativeId The unique identifier for the view to unregister
 */
- (void)unregisterViewWithId:(NSString *)nativeId;

/**
 * Returns the total number of registered views.
 */
- (NSUInteger)registeredViewCount;

@end

NS_ASSUME_NONNULL_END 