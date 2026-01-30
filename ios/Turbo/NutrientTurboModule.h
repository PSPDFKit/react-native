//
//  Copyright © 2025-2026 PSPDFKit GmbH.
//
#if RCT_NEW_ARCH_ENABLED

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#if __cplusplus
// Only Obj-C++ includers will see the real base/protocol
#import <nutrient_sdk_react_native_codegen/nutrient_sdk_react_native_codegen.h>
#define NUTRIENT_TM_BASE NativeNutrientModuleSpecBase
@protocol NativeNutrientModuleSpec;
#else
// Pure Obj-C/Swift includers see a harmless NSObject base
#define NUTRIENT_TM_BASE NSObject
@protocol NativeNutrientModuleSpec; // forward-declare to satisfy the type
#endif

@interface NutrientTurboModule : NUTRIENT_TM_BASE <NativeNutrientModuleSpec>
@end

#endif // RCT_NEW_ARCH_ENABLED
