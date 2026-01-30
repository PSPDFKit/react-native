//
//  NutrientNotificationCenterBridge.m
//  PSPDFKit
//
//  Copyright © 2025-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "NutrientNotificationCenterBridge.h"

#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@implementation NutrientNotificationCenterBridge

+ (void)setDelegate:(id<NutrientNotificationCenterDelegate>)delegate {
    [NutrientNotificationCenter shared].delegate = delegate;
}

+ (void)clearDelegate {
    [NutrientNotificationCenter shared].delegate = nil;
}

@end
