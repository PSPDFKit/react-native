//
//  Copyright © 2016-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <React/RCTConvert.h>
#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>

@interface RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json;

// When reading configuration options, we check not only for the given configuration string,
// but also for a string with the `iOS` prefix. For instance if the user enters
// `iOSPageScrollDirection`, it is considered a valid string equal to `pageScrollDirection`.
// This method will remove the iOS prefix from all the dictionary keys.
//
// When documenting, we always prefer configuration option strings:
//
// - No prefix          : If the key works for both iOS and Android.
// - `android` prefix   : If the key works only for Android.
// - `iOS` prefix       : If the key works only for iOS.
+ (NSDictionary *)processConfigurationOptionsDictionaryForPrefix:(NSDictionary *)dictionary;

+ (NSDictionary *)convertConfiguration:(PSPDFViewController *)viewController;

@end

@interface PSPDFConfigurationBuilder (RNAdditions)

- (void)setupFromJSON:(id)json;

@end
