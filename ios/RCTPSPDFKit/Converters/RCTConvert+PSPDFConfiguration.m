//
//  Copyright © 2016-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFConfiguration.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

#define PageTransitionMap @{@"scrollPerSpread" : @(PSPDFPageTransitionScrollPerSpread), \
                            @"scrollContinuous" : @(PSPDFPageTransitionScrollContinuous), \
                            @"curl" : @(PSPDFPageTransitionCurl)} \

#define PageModeMap @{@"single" : @(PSPDFPageModeSingle), \
                      @"double" : @(PSPDFPageModeDouble), \
                      @"automatic" : @(PSPDFPageModeAutomatic)} \

#define ScrollDirectionMap @{@"horizontal" : @(PSPDFScrollDirectionHorizontal), \
                             @"vertical" : @(PSPDFScrollDirectionVertical)} \

#define AppearanceModeMap @{@"default" : @(PSPDFAppearanceModeDefault), \
                            @"sepia" : @(PSPDFAppearanceModeSepia), \
                            @"night" : @(PSPDFAppearanceModeNight), \
                            @"all" : @(PSPDFAppearanceModeAll)} \

#define SpreadFittingMap @{@"fit" : @(PSPDFConfigurationSpreadFittingFit), \
                           @"fill" : @(PSPDFConfigurationSpreadFittingFill), \
                           @"adaptive" : @(PSPDFConfigurationSpreadFittingAdaptive)} \

#define SignatureSavingStrategyMap @{@"alwaysSave" : @(PSPDFSignatureSavingStrategyAlwaysSave), \
                                     @"neverSave" : @(PSPDFSignatureSavingStrategyNeverSave), \
                                     @"saveIfSelected" : @(PSPDFSignatureSavingStrategySaveIfSelected)} \

#define DoubleTapActionMap @{@"none" : @(PSPDFTapActionNone), \
                             @"zoom" : @(PSPDFTapActionZoom), \
                             @"smartZoom" : @(PSPDFTapActionSmartZoom)} \

#define TextSelectionModeMap @{@"regular" : @(PSPDFTextSelectionModeRegular), \
                               @"simple" : @(PSPDFTextSelectionModeSimple), \
                               @"automatic": @(PSPDFTextSelectionModeAutomatic)} \

#define TypesShowingColorPresetsMap @{@"none" : @(PSPDFAnnotationTypeNone), \
                                    @"undefined" : @(PSPDFAnnotationTypeUndefined), \
                                    PSPDFAnnotationStringLink : @(PSPDFAnnotationTypeLink), \
                                    PSPDFAnnotationStringHighlight : @(PSPDFAnnotationTypeHighlight), \
                                    PSPDFAnnotationStringStrikeOut : @(PSPDFAnnotationTypeStrikeOut), \
                                    PSPDFAnnotationStringUnderline : @(PSPDFAnnotationTypeUnderline), \
                                    PSPDFAnnotationStringSquiggly : @(PSPDFAnnotationTypeSquiggly), \
                                    PSPDFAnnotationStringFreeText : @(PSPDFAnnotationTypeFreeText), \
                                    PSPDFAnnotationStringInk : @(PSPDFAnnotationTypeInk), \
                                    PSPDFAnnotationStringSquare : @(PSPDFAnnotationTypeSquare), \
                                    PSPDFAnnotationStringCircle : @(PSPDFAnnotationTypeCircle), \
                                    PSPDFAnnotationStringLine : @(PSPDFAnnotationTypeLine), \
                                    PSPDFAnnotationStringNote : @(PSPDFAnnotationTypeNote), \
                                    PSPDFAnnotationStringStamp : @(PSPDFAnnotationTypeStamp), \
                                    PSPDFAnnotationStringCaret : @(PSPDFAnnotationTypeCaret), \
                                    PSPDFAnnotationStringRichMedia : @(PSPDFAnnotationTypeRichMedia), \
                                    PSPDFAnnotationStringScreen : @(PSPDFAnnotationTypeScreen), \
                                    PSPDFAnnotationStringWidget : @(PSPDFAnnotationTypeWidget), \
                                    PSPDFAnnotationStringFile : @(PSPDFAnnotationTypeFile), \
                                    PSPDFAnnotationStringSound : @(PSPDFAnnotationTypeSound), \
                                    PSPDFAnnotationStringPolygon : @(PSPDFAnnotationTypePolygon), \
                                    PSPDFAnnotationStringPolyLine : @(PSPDFAnnotationTypePolyLine), \
                                    PSPDFAnnotationStringPopup : @(PSPDFAnnotationTypePopup), \
                                    PSPDFAnnotationStringWatermark : @(PSPDFAnnotationTypeWatermark), \
                                    PSPDFAnnotationStringTrapNet : @(PSPDFAnnotationTypeTrapNet), \
                                    PSPDFAnnotationString3D : @(PSPDFAnnotationTypeThreeDimensional), \
                                    PSPDFAnnotationStringRedaction : @(PSPDFAnnotationTypeRedaction), \
                                    @"all" : @(PSPDFAnnotationTypeAll)} \

#define RenderStatusViewPositionMap @{@"top" : @(PSPDFRenderStatusViewPositionTop), \
                                      @"centered" : @(PSPDFRenderStatusViewPositionCentered)} \

#define UserInterfaceViewModeMap @{@"automatic" : @(PSPDFUserInterfaceViewModeAutomatic), \
                                   @"automaticBorderPages" : @(PSPDFUserInterfaceViewModeAutomaticNoFirstLastPage), \
                                   @"automaticNoFirstLastPage" : @(PSPDFUserInterfaceViewModeAutomaticNoFirstLastPage), \
                                   @"always" : @(PSPDFUserInterfaceViewModeAlways), \
                                   @"alwaysVisible" : @(PSPDFUserInterfaceViewModeAlways), \
                                   @"alwaysHidden" : @(PSPDFUserInterfaceViewModeNever), \
                                   @"never" : @(PSPDFUserInterfaceViewModeNever)} \

#define SearchModeMap @{@"modal" : @(PSPDFSearchModeModal), \
                        @"inline" : @(PSPDFSearchModeInline)} \

#define AllowedMenuActionsMap @{@"none" : @(PSPDFTextSelectionMenuActionNone), \
                                @"search" : @(PSPDFTextSelectionMenuActionSearch), \
                                @"define" : @(PSPDFTextSelectionMenuActionDefine), \
                                @"wikipedia" : @(PSPDFTextSelectionMenuActionWikipedia), \
                                @"speak" : @(PSPDFTextSelectionMenuActionSpeak), \
                                @"all" : @(PSPDFTextSelectionMenuActionAll)} \

#define SettingsOptionsMap @{@"scrollDirection" : @(PSPDFSettingsOptionScrollDirection), \
                             @"pageTransition" : @(PSPDFSettingsOptionPageTransition), \
                             @"appearance" : @(PSPDFSettingsOptionAppearance), \
                             @"brightness" : @(PSPDFSettingsOptionBrightness), \
                             @"pageMode" : @(PSPDFSettingsOptionPageMode), \
                             @"spreadFitting" : @(PSPDFSettingsOptionSpreadFitting), \
                             @"default" : @(PSPDFSettingsOptionDefault), \
                             @"all" : @(PSPDFSettingsOptionAll)} \

#define ThumbnailBarMap @{@"none" : @(PSPDFThumbnailBarModeNone), \
                          @"default": @(PSPDFThumbnailBarModeFloatingScrubberBar), \
                          @"floating" : @(PSPDFThumbnailBarModeFloatingScrubberBar), \
                          @"scrubberBar" : @(PSPDFThumbnailBarModeScrubberBar), \
                          @"pinned" : @(PSPDFThumbnailBarModeScrubberBar), \
                          @"scrollable" : @(PSPDFThumbnailBarModeScrollable)} \

#define ScrubberBarTypeMap @{@"horizontal" : @(PSPDFScrubberBarTypeHorizontal), \
                             @"verticalLeft" : @(PSPDFScrubberBarTypeVerticalLeft), \
                             @"verticalRight" : @(PSPDFScrubberBarTypeVerticalRight)} \

#define ThumbnailGroupingMap @{@"automatic" : @(PSPDFThumbnailGroupingAutomatic), \
                               @"never" : @(PSPDFThumbnailGroupingNever), \
                               @"always" : @(PSPDFThumbnailGroupingAlways)} \

#define LinkActionMap @{@"none" : @(PSPDFLinkActionNone), \
                        @"alertView" : @(PSPDFLinkActionAlertView), \
                        @"openSafari" : @(PSPDFLinkActionOpenSafari), \
                        @"inlineBrowser" : @(PSPDFLinkActionInlineBrowser), \
                        @"InlineWebViewController" : @(PSPDFLinkActionInlineWebViewController)} \

#define DrawCreateModeMap @{@"separate" : @(PSPDFDrawCreateModeSeparate), \
                            @"mergeIfPossible" : @(PSPDFDrawCreateModeMergeIfPossible)} \

#define BookmarkSortOrderMap @{@"custom" : @(PSPDFBookmarkManagerSortOrderCustom), \
                               @"pageBased" : @(PSPDFBookmarkManagerSortOrderPageBased)} \

#define SignatureCreationModeMap @{@"draw": @(PSPDFSignatureCreationModeDraw), \
                                   @"image": @(PSPDFSignatureCreationModeImage), \
                                   @"type": @(PSPDFSignatureCreationModeType)} \

@implementation RCTConvert (PSPDFConfiguration)

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json {
   return [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {
      [builder setupFromJSON:json];
   }];
}

+ (NSString *)removePrefixForKey:(NSString *)key {
   // If the key length is less than 4, we return it without any modification.
   if (([key hasPrefix:@"iOS"] || [key hasPrefix:@"ios"]) && key.length > 4) {
      NSString *prefixRemoved = [key substringFromIndex:3]; // Discard the first 3 letters (iOS).
      NSString *firstLetterLowerCase = [[prefixRemoved substringToIndex:1] lowercaseString]; // Extract and lowercase the first letter.
      NSString *everythingExceptFirstLetter = [prefixRemoved substringFromIndex:1];  // Extract everything except the first letter.
      NSString *cleanedKey = [NSString stringWithFormat:@"%@%@", firstLetterLowerCase, everythingExceptFirstLetter]; // Join the two strings.
      return cleanedKey;
   } else {
      return key;
   }
}

+ (NSDictionary *)processConfigurationOptionsDictionaryForPrefix:(NSDictionary *)dictionary {
   NSMutableDictionary *output = [NSMutableDictionary new];
   for (NSString *key in dictionary) {
      id value = [dictionary valueForKey:key];
      [output setValue:value forKey:[self removePrefixForKey:key]];
   }
   return [NSDictionary dictionaryWithDictionary:output];
}

RCT_ENUM_CONVERTER(PSPDFScrollDirection,
                   (ScrollDirectionMap),
                   PSPDFScrollDirectionHorizontal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFTapAction,
                   (DoubleTapActionMap),
                   PSPDFTapActionNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFTextSelectionMode,
                   (TextSelectionModeMap),
                   PSPDFTextSelectionModeRegular,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFBookmarkManagerSortOrder,
                   (BookmarkSortOrderMap),
                   PSPDFBookmarkManagerSortOrderPageBased,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFLinkAction,
                   (LinkActionMap),
                   PSPDFLinkActionNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFUserInterfaceViewMode,
                   (UserInterfaceViewModeMap),
                   PSPDFUserInterfaceViewModeAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFUserInterfaceViewAnimation,
                   (@{@"none" : @(PSPDFUserInterfaceViewAnimationNone),
                      @"fade" : @(PSPDFUserInterfaceViewAnimationFade),
                      @"slide" : @(PSPDFUserInterfaceViewAnimationSlide)}),
                   PSPDFUserInterfaceViewAnimationNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFThumbnailBarMode,
                   (ThumbnailBarMap),
                   PSPDFThumbnailBarModeFloatingScrubberBar,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFAdaptiveConditional,
                   (@{@(NO) : @(PSPDFAdaptiveConditionalNO),
                      @(YES) : @(PSPDFAdaptiveConditionalYES),
                      @"Adaptive" : @(PSPDFAdaptiveConditionalAdaptive)}),
                   PSPDFAdaptiveConditionalAdaptive,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFRenderStatusViewPosition,
                   (RenderStatusViewPositionMap),
                   PSPDFRenderStatusViewPositionTop,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFPageMode,
                   (PageModeMap),
                   PSPDFPageModeAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFScrubberBarType,
                   (ScrubberBarTypeMap),
                   PSPDFScrubberBarTypeHorizontal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFThumbnailGrouping,
                   (ThumbnailGroupingMap),
                   PSPDFThumbnailGroupingAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFPageTransition,
                   (PageTransitionMap),
                   PSPDFPageTransitionScrollPerSpread,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFDrawCreateMode,
                   (DrawCreateModeMap),
                   PSPDFDrawCreateModeMergeIfPossible,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFSearchMode,
                   (SearchModeMap),
                   PSPDFSearchModeModal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFSignatureSavingStrategy,
                   (SignatureSavingStrategyMap),
                   PSPDFSignatureSavingStrategyAlwaysSave,
                   unsignedIntegerValue)

/**
 Strings for reference:

 PSPDFAnnotationString const PSPDFAnnotationStringLink = @"Link";
 PSPDFAnnotationString const PSPDFAnnotationStringHighlight = @"Highlight";
 PSPDFAnnotationString const PSPDFAnnotationStringUnderline = @"Underline";
 PSPDFAnnotationString const PSPDFAnnotationStringSquiggly = @"Squiggly";
 PSPDFAnnotationString const PSPDFAnnotationStringStrikeOut = @"StrikeOut";
 PSPDFAnnotationString const PSPDFAnnotationStringNote = @"Text";
 PSPDFAnnotationString const PSPDFAnnotationStringCaret = @"Caret";
 PSPDFAnnotationString const PSPDFAnnotationStringFreeText = @"FreeText";
 PSPDFAnnotationString const PSPDFAnnotationStringInk = @"Ink";
 PSPDFAnnotationString const PSPDFAnnotationStringSquare = @"Square";
 PSPDFAnnotationString const PSPDFAnnotationStringCircle = @"Circle";
 PSPDFAnnotationString const PSPDFAnnotationStringLine = @"Line";
 PSPDFAnnotationString const PSPDFAnnotationStringSignature = @"Signature";
 PSPDFAnnotationString const PSPDFAnnotationStringStamp = @"Stamp";
 PSPDFAnnotationString const PSPDFAnnotationStringEraser = @"Eraser";
 PSPDFAnnotationString const PSPDFAnnotationStringImage = @"Image";
 PSPDFAnnotationString const PSPDFAnnotationStringWidget = @"Widget";
 PSPDFAnnotationString const PSPDFAnnotationStringFile = @"FileAttachment";
 PSPDFAnnotationString const PSPDFAnnotationStringSound = @"Sound";
 PSPDFAnnotationString const PSPDFAnnotationStringPolygon = @"Polygon";
 PSPDFAnnotationString const PSPDFAnnotationStringPolyLine = @"PolyLine";
 PSPDFAnnotationString const PSPDFAnnotationStringRichMedia = @"RichMedia";
 PSPDFAnnotationString const PSPDFAnnotationStringScreen = @"Screen";
 PSPDFAnnotationString const PSPDFAnnotationStringPopup = @"Popup";
 PSPDFAnnotationString const PSPDFAnnotationStringWatermark = @"Watermark";
 PSPDFAnnotationString const PSPDFAnnotationStringTrapNet = @"TrapNet";
 PSPDFAnnotationString const PSPDFAnnotationString3D = @"3D";
 PSPDFAnnotationString const PSPDFAnnotationStringRedaction = @"Redact";
 */

RCT_MULTI_ENUM_CONVERTER(PSPDFAnnotationType,
                         (TypesShowingColorPresetsMap),
                         PSPDFAnnotationTypeNone,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFAppearanceMode,
                         (AppearanceModeMap),
                         PSPDFAppearanceModeDefault,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFSettingsOptions,
                         (SettingsOptionsMap),
                         PSPDFSettingsOptionAll,
                         unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFConfigurationSpreadFitting,
                   (SpreadFittingMap),
                   PSPDFConfigurationSpreadFittingAdaptive,
                   unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingFileFormatOptions,
                         (@{@"PDF" : @(PSPDFDocumentSharingFileFormatOptionPDF),
                            @"original": @(PSPDFDocumentSharingFileFormatOptionOriginal),
                            @"image": @(PSPDFDocumentSharingFileFormatOptionImage)}),
                         PSPDFDocumentSharingFileFormatOptionPDF,
                         unsignedIntegerValue);

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingAnnotationOptions,
                         (@{@"embed": @(PSPDFDocumentSharingAnnotationOptionEmbed),
                            @"flatten": @(PSPDFDocumentSharingAnnotationOptionFlatten),
                            @"flatten_for_print": @(PSPDFDocumentSharingAnnotationOptionFlattenForPrint),
                            @"summary": @(PSPDFDocumentSharingAnnotationOptionSummary),
                            @"remove": @(PSPDFDocumentSharingAnnotationOptionRemove)
                            }),
                         PSPDFDocumentSharingAnnotationOptionEmbed,
                         unsignedIntegerValue);

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingPagesOptions,
                         (@{@"all": @(PSPDFDocumentSharingPagesOptionAll),
                            @"range": @(PSPDFDocumentSharingPagesOptionRange),
                            @"current": @(PSPDFDocumentSharingPagesOptionCurrent),
                            @"annotated": @(PSPDFDocumentSharingPagesOptionAnnotated)}),
                         PSPDFDocumentSharingPagesOptionAll,
                         unsignedIntegerValue)

+ (NSArray *)translateSize:(NSString *)input {
    return [RCTConvert stringToFloatArray:[[RCTConvert sanitiseSizeString:input] componentsSeparatedByString:@","]];
}

+ (NSArray *)stringToFloatArray:(NSArray *)stringArray {
    
    NSMutableArray *intArray = [NSMutableArray new];
    
    for (NSString *item in stringArray) {
        [intArray addObject:@([item floatValue])];
    }
    
    return intArray;
}

+ (NSString *)sanitiseSizeString:(NSString *)input {
    
    input = [input stringByReplacingOccurrencesOfString:@"{" withString:@""];
    input = [input stringByReplacingOccurrencesOfString:@"}" withString:@""];
    input = [input stringByReplacingOccurrencesOfString:@" " withString:@""];
    
    return input;
}

+ (NSString *)findKeyForValue:(NSUInteger)value
                 inDictionary:(NSDictionary *)dictionary {
    
    NSString *foundKey = @"";
    for (NSString* key in [dictionary allKeys]) {
        NSNumber *foundValue = [dictionary objectForKey:key];
        if([foundValue isEqual:@(value)]) {
            foundKey = key;
            break;
        }
    }
    return foundKey;
}

+ (NSArray *)findKeysForValues:(NSSet *)values
                 inDictionary:(NSDictionary *)dictionary {
    
    NSMutableArray *foundKeys = [NSMutableArray new];
    for (NSString *item in values) {
        if (dictionary[item]) {
            [foundKeys addObject:item];
        }
    }
    return foundKeys;
}

+ (BOOL)extractBooleanFrom:(NSUInteger)value
             positiveValue:(NSUInteger)positive {
    
    return value == positive;
}

+ (NSDictionary *)convertConfiguration:(PSPDFViewController *)viewController {
    
    PSPDFConfiguration *configuration = viewController.configuration;
    
    NSMutableDictionary *convertedConfiguration = [NSMutableDictionary new];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.scrollDirection
                                                     inDictionary:ScrollDirectionMap] forKey:@"scrollDirection"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.pageTransition
                                                     inDictionary:PageTransitionMap] forKey:@"pageTransition"];
    
    [convertedConfiguration setObject:@(configuration.textSelectionEnabled) forKey:@"enableTextSelection"];
    
    [convertedConfiguration setObject:@(configuration.autosaveEnabled) forKey:@"autosaveEnabled"];
    
    [convertedConfiguration setObject:!configuration.autosaveEnabled ? @YES : @NO forKey:@"disableAutomaticSaving"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.signatureSavingStrategy
                                                     inDictionary:SignatureSavingStrategyMap] forKey:@"signatureSavingStrategy"];
    
    [convertedConfiguration setObject:@(configuration.formElementZoomEnabled) forKey:@"iOSFormElementZoomEnabled"];
    
    [convertedConfiguration setObject:@(configuration.imageSelectionEnabled) forKey:@"iOSImageSelectionEnabled"];
    
    [convertedConfiguration setObject:@(configuration.textSelectionShouldSnapToWord) forKey:@"iOSTextSelectionShouldSnapToWord"];
    
    [convertedConfiguration setObject:@(configuration.freeTextAccessoryViewEnabled) forKey:@"iOSFreeTextAccessoryViewEnabled"];
    
    [convertedConfiguration setObject:@(configuration.internalTapGesturesEnabled) forKey:@"iOSInternalTapGesturesEnabled"];
    
    [convertedConfiguration setObject:@(configuration.allowBackgroundSaving) forKey:@"iOSAllowBackgroundSaving"];
    
    [convertedConfiguration setObject:@(configuration.minimumZoomScale) forKey:@"iOSMinimumZoomScale"];
    
    [convertedConfiguration setObject:@(configuration.maximumZoomScale) forKey:@"iOSMaximumZoomScale"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.doubleTapAction
                                                     inDictionary:DoubleTapActionMap] forKey:@"iOSDoubleTapAction"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.textSelectionMode
                                                     inDictionary:TextSelectionModeMap] forKey:@"iOSTextSelectionMode"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.typesShowingColorPresets
                                                     inDictionary:TypesShowingColorPresetsMap] forKey:@"iOSTypesShowingColorPresets"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.pageMode
                                                     inDictionary:PageModeMap] forKey:@"pageMode"];
    
    [convertedConfiguration setObject:@(configuration.firstPageAlwaysSingle) forKey:@"firstPageAlwaysSingle"];
    
    [convertedConfiguration setObject:@(configuration.pageLabelEnabled) forKey:@"showPageLabels"];
    
    [convertedConfiguration setObject:@([RCTConvert extractBooleanFrom:configuration.documentLabelEnabled
                                                         positiveValue:PSPDFAdaptiveConditionalYES]) forKey:@"documentLabelEnabled"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.spreadFitting
                                                     inDictionary:SpreadFittingMap] forKey:@"spreadFitting"];
    
    [convertedConfiguration setObject:viewController.appearanceModeManager.appearanceMode == PSPDFAppearanceModeNight ? @YES : @NO forKey:@"invertColors"];
    
    [convertedConfiguration setObject:@(configuration.clipToPageBoundaries) forKey:@"iOSClipToPageBoundaries"];

    [convertedConfiguration setObject:@(configuration.backgroundColor.hexa) forKey:@"iOSBackgroundColor"];
    
    [convertedConfiguration setObject:@(configuration.renderAnimationEnabled) forKey:@"iOSRenderAnimationEnabled"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.renderStatusViewPosition
                                                     inDictionary:RenderStatusViewPositionMap] forKey:@"iOSRenderStatusViewPosition"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.allowedAppearanceModes
                                                     inDictionary:AppearanceModeMap] forKey:@"allowedAppearanceModes"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.userInterfaceViewMode
                                                     inDictionary:UserInterfaceViewModeMap] forKey:@"userInterfaceViewMode"];

    [convertedConfiguration setObject:@([RCTConvert extractBooleanFrom:configuration.searchMode positiveValue:PSPDFSearchModeInline])  forKey:@"inlineSearch"];
    
    [convertedConfiguration setObject:@([RCTConvert extractBooleanFrom:configuration.userInterfaceViewMode positiveValue:PSPDFUserInterfaceViewModeNever]) forKey:@"immersiveMode"];
    
    [convertedConfiguration setObject:viewController.title == nil ? @"" : viewController.title forKey:@"toolbarTitle"];
    
    [convertedConfiguration setObject:@(configuration.shouldHideUserInterfaceOnPageChange) forKey:@"iOSShouldHideUserInterfaceOnPageChange"];
    
    [convertedConfiguration setObject:@(configuration.shouldShowUserInterfaceOnViewWillAppear) forKey:@"iOSShouldShowUserInterfaceOnViewWillAppear"];
    
    [convertedConfiguration setObject:@(configuration.shouldHideStatusBarWithUserInterface) forKey:@"iOSShouldHideStatusBarWithUserInterface"];
    
    [convertedConfiguration setObject:@(configuration.shouldHideNavigationBarWithUserInterface) forKey:@"iOSShouldHideNavigationBarWithUserInterface"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.searchMode
                                                     inDictionary:SearchModeMap] forKey:@"iOSSearchMode"];
    
    [convertedConfiguration setObject:@(configuration.scrollOnEdgeTapEnabled) forKey:@"iOSScrollOnEdgeTapEnabled"];
    
    [convertedConfiguration setObject:@(configuration.scrollOnEdgeTapMargin) forKey:@"iOSScrollOnEdgeTapMargin"];
    
    [convertedConfiguration setObject:@(configuration.useParentNavigationBar) forKey:@"iOSUseParentNavigationBar"];
    
    [convertedConfiguration setObject:@(configuration.allowToolbarTitleChange) forKey:@"iOSAllowToolbarTitleChange"];
    
    [convertedConfiguration setObject:@(configuration.shouldHideStatusBar) forKey:@"iOSShouldHideStatusBar"];
    
    [convertedConfiguration setObject:@(configuration.showBackActionButton) forKey:@"iOSShowBackActionButton"];
    
    [convertedConfiguration setObject:@(configuration.showForwardActionButton) forKey:@"iOSShowForwardActionButton"];
    
    [convertedConfiguration setObject:@(configuration.showBackForwardActionButtonLabels) forKey:@"iOSShowBackForwardActionButtonLabels"];
    
    [convertedConfiguration setObject:@(configuration.searchResultZoomScale) forKey:@"iOSSearchResultZoomScale"];
    
    [convertedConfiguration setObject:[RCTConvert translateSize:NSStringFromUIEdgeInsets(configuration.additionalScrollViewFrameInsets)] forKey:@"iOSAdditionalScrollViewFrameInsets"];
    [convertedConfiguration setObject:[RCTConvert translateSize:NSStringFromUIEdgeInsets(configuration.additionalContentInsets)] forKey:@"iOSAdditionalContentInsets"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.allowedMenuActions
                                                     inDictionary:AllowedMenuActionsMap] forKey:@"iOSAllowedMenuActions"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.settingsOptions
                                                     inDictionary:SettingsOptionsMap] forKey:@"iOSSettingsOptions"];
    
    [convertedConfiguration setObject:@(configuration.shadowEnabled) forKey:@"iOSShadowEnabled"];
    
    [convertedConfiguration setObject:@(configuration.shadowOpacity) forKey:@"iOSShadowOpacity"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.thumbnailBarMode
                                                     inDictionary:ThumbnailBarMap] forKey:@"showThumbnailBar"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.scrubberBarType
                                                     inDictionary:ScrubberBarTypeMap] forKey:@"iOSScrubberBarType"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.thumbnailGrouping
                                                     inDictionary:ThumbnailGroupingMap] forKey:@"iOSThumbnailGrouping"];
    
    [convertedConfiguration setObject:[RCTConvert translateSize:NSStringFromCGSize(configuration.thumbnailSize)] forKey:@"iOSThumbnailSize"];
    
    [convertedConfiguration setObject:@(configuration.thumbnailInteritemSpacing) forKey:@"iOSThumbnailInteritemSpacing"];
    
    [convertedConfiguration setObject:@(configuration.thumbnailLineSpacing) forKey:@"iOSThumbnailLineSpacing"];
    
    [convertedConfiguration setObject:[RCTConvert translateSize:NSStringFromUIEdgeInsets(configuration.thumbnailMargin)] forKey:@"iOSThumbnailMargin"];
    
    [convertedConfiguration setObject:@(configuration.shouldCacheThumbnails) forKey:@"iOSShouldCacheThumbnails"];
    
    [convertedConfiguration setObject:[RCTConvert findKeysForValues:configuration.editableAnnotationTypes
                                                     inDictionary:TypesShowingColorPresetsMap] forKey:@"editableAnnotationTypes"];
    
    // If there are editableAnnotationTypes set, returning enableAnnotationEditing = true would enable all annotations the next time the Configuration is applied to a new PDFViewController instance. So include only if editableAnnotationTypes are 0 or enableAnnotationEditing was explicitly disabled.
    if (configuration.editableAnnotationTypes.count == 0) {
        [convertedConfiguration setObject:@NO forKey:@"enableAnnotationEditing"];
    }
    
    [convertedConfiguration setObject:[configuration.editableAnnotationTypes containsObject:PSPDFAnnotationStringWidget] ? @YES : @NO forKey:@"enableFormEditing"];
    
    [convertedConfiguration setObject:@(configuration.shouldAskForAnnotationUsername) forKey:@"iOSShouldAskForAnnotationUsername"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.linkAction
                                                     inDictionary:LinkActionMap] forKey:@"iOSLinkAction"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.drawCreateMode
                                                     inDictionary:DrawCreateModeMap] forKey:@"iOSDrawCreateMode"];
    
    [convertedConfiguration setObject:@(configuration.annotationGroupingEnabled) forKey:@"iOSAnnotationGroupingEnabled"];
    
    [convertedConfiguration setObject:@(configuration.naturalDrawingAnnotationEnabled) forKey:@"iOSNaturalDrawingAnnotationEnabled"];
    
    [convertedConfiguration setObject:@(configuration.naturalSignatureDrawingEnabled) forKey:@"iOSNaturalSignatureDrawingEnabled"];
    
    [convertedConfiguration setObject:@(configuration.annotationEntersEditModeAfterSecondTapEnabled) forKey:@"iOSAnnotationEntersEditModeAfterSecondTapEnabled"];
    
    [convertedConfiguration setObject:@(configuration.createAnnotationMenuEnabled) forKey:@"iOSCreateAnnotationMenuEnabled"];
    
    [convertedConfiguration setObject:@(configuration.annotationAnimationDuration) forKey:@"iOSAnnotationAnimationDuration"];
    
    [convertedConfiguration setObject:@(configuration.soundAnnotationTimeLimit) forKey:@"iOSSoundAnnotationTimeLimit"];
    
    [convertedConfiguration setObject:[RCTConvert findKeyForValue:configuration.bookmarkSortOrder
                                                     inDictionary:BookmarkSortOrderMap] forKey:@"iOSBookmarkSortOrder"];
    
    [convertedConfiguration setObject:[RCTConvert findKeysForValues:[NSSet setWithArray:configuration.signatureCreationConfiguration.availableModes]
                                                       inDictionary:SignatureCreationModeMap]
                               forKey:@"signatureCreationModes"];
    
    NSMutableArray *signatureCreationColors = [NSMutableArray array];
    [configuration.signatureCreationConfiguration.colors enumerateObjectsUsingBlock:^(UIColor * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        
        // remove alpha
        NSString *hexColor = [NSString stringWithFormat:@"#%02lX", [obj hex]];
        
        [signatureCreationColors addObject:hexColor];
    }];
    [convertedConfiguration setObject:signatureCreationColors forKey:@"signatureCreationColors"];
    
    return convertedConfiguration;
}

@end

#define SET(property, type) if (dictionary[@#property]) self.property = [RCTConvert type:dictionary[@#property]];
#define SET_PROPERTY(reactProperty, property, type) if (dictionary[@#reactProperty]) self.property = [RCTConvert type:dictionary[@#reactProperty]];
#define SET_OBJECT(object, property, type) if (dictionary[@#property]) object.property = [RCTConvert type:dictionary[@#property]];

@implementation PSPDFConfigurationBuilder (RNAdditions)

- (void)setupFromJSON:(id)json {

  NSDictionary *dictionary = [RCTConvert processConfigurationOptionsDictionaryForPrefix:[RCTConvert NSDictionary:json]];

  // Document Interaction Options
  SET(scrollDirection, PSPDFScrollDirection)
  SET(pageTransition, PSPDFPageTransition)
  SET(shouldScrollToChangedPage, BOOL)
  SET(formElementZoomEnabled, BOOL)
  SET_PROPERTY(enableTextSelection, textSelectionEnabled, BOOL)
  SET(imageSelectionEnabled, BOOL)
  SET(textSelectionShouldSnapToWord, BOOL)
  SET(freeTextAccessoryViewEnabled, BOOL)
  SET(internalTapGesturesEnabled, BOOL)
  SET(autosaveEnabled, BOOL)
  SET(allowBackgroundSaving, BOOL)
  SET(signatureSavingStrategy, PSPDFSignatureSavingStrategy)
  if ([dictionary[@"signatureSavingStrategy"] isEqualToString:@"alwaysSave"] ||
      [dictionary[@"signatureSavingStrategy"] isEqualToString:@"saveIfSelected"] ) {
      self.signatureStore = [PSPDFKeychainSignatureStore new];
  }
  SET(minimumZoomScale, float)
  SET(maximumZoomScale, float)
  SET(doubleTapAction, PSPDFTapAction)
  SET(textSelectionMode, PSPDFTextSelectionMode)
  SET(typesShowingColorPresets, PSPDFAnnotationType)
  if (dictionary[@"disableAutomaticSaving"]) {
    self.autosaveEnabled = ![RCTConvert BOOL:dictionary[@"disableAutomaticSaving"]];
  }

  // Document Presentation Options
  SET_PROPERTY(showPageLabels, pageLabelEnabled, BOOL)
  SET(documentLabelEnabled, PSPDFAdaptiveConditional)
  SET(pageMode, PSPDFPageMode)
  SET(firstPageAlwaysSingle, BOOL)
  SET(clipToPageBoundaries, BOOL)
  SET(spreadFitting, PSPDFConfigurationSpreadFitting)
  SET(backgroundColor, UIColor)
  SET(renderAnimationEnabled, BOOL)
  SET(renderStatusViewPosition, PSPDFRenderStatusViewPosition)
  SET(allowedAppearanceModes, PSPDFAppearanceMode)
  if (dictionary[@"fitPageToWidth"]) {
    NSString *mode = [RCTConvert NSString:dictionary[@"fitPageToWidth"]];
    self.spreadFitting = [mode isEqualToString:@"fit"] ? PSPDFConfigurationSpreadFittingFit : PSPDFConfigurationSpreadFittingFill;
  }

  // User Interface Options
  SET(userInterfaceViewMode, PSPDFUserInterfaceViewMode)
  SET(userInterfaceViewAnimation, PSPDFUserInterfaceViewAnimation)
  SET(shouldHideUserInterfaceOnPageChange, BOOL)
  SET(shouldShowUserInterfaceOnViewWillAppear, BOOL)
  SET(shouldHideStatusBarWithUserInterface, BOOL)
  SET(shouldHideNavigationBarWithUserInterface, BOOL)
  SET(searchMode, PSPDFSearchMode)
  SET(scrollOnEdgeTapEnabled, BOOL)
  SET(scrollOnEdgeTapMargin, CGFloat)
  SET(useParentNavigationBar, BOOL)
  SET(allowToolbarTitleChange, BOOL)
  SET(shouldHideStatusBar, BOOL)
  SET(showBackActionButton, BOOL)
  SET(showForwardActionButton, BOOL)
  SET(showBackForwardActionButtonLabels, BOOL)
  SET(searchResultZoomScale, CGFloat)
  SET(additionalScrollViewFrameInsets, UIEdgeInsets)
  SET(additionalContentInsets, UIEdgeInsets)
  SET(settingsOptions, PSPDFSettingsOptions)
  SET(shadowEnabled, BOOL)
  SET(shadowOpacity, CGFloat)
  if (dictionary[@"immersiveMode"]) {
    self.userInterfaceViewMode = [RCTConvert BOOL:dictionary[@"immersiveMode"]] ? PSPDFUserInterfaceViewModeNever : PSPDFUserInterfaceViewModeAutomatic;
  }
  if (dictionary[@"inlineSearch"]) {
    self.searchMode = [RCTConvert BOOL:dictionary[@"inlineSearch"]] ? PSPDFSearchModeInline : PSPDFSearchModeModal;
  }

  // Thumbnail Options
  SET(thumbnailBarMode, PSPDFThumbnailBarMode)
  SET(scrubberBarType, PSPDFScrubberBarType)
  SET(thumbnailGrouping, PSPDFThumbnailGrouping)
  SET(thumbnailSize, CGSize)
  SET(thumbnailInteritemSpacing, CGFloat)
  SET(thumbnailLineSpacing, CGFloat)
  SET(thumbnailMargin, UIEdgeInsets)
  SET(shouldCacheThumbnails, BOOL)

  // Annotation, Forms and Bookmark Options
  SET(editableAnnotationTypes, NSSet)
  SET(shouldAskForAnnotationUsername, BOOL)
  SET(linkAction, PSPDFLinkAction)
  SET(drawCreateMode, PSPDFDrawCreateMode)
  SET(annotationGroupingEnabled, BOOL)
  SET(naturalDrawingAnnotationEnabled, BOOL)
  SET(naturalSignatureDrawingEnabled, BOOL)
  SET(annotationEntersEditModeAfterSecondTapEnabled, BOOL)
  SET(createAnnotationMenuEnabled, BOOL)
  SET(annotationAnimationDuration, CGFloat)
  SET(soundAnnotationTimeLimit, NSTimeInterval)
  SET(bookmarkSortOrder, PSPDFBookmarkManagerSortOrder)
  if (dictionary[@"sharingConfigurations"]) {
    [self setRCTSharingConfigurations:[RCTConvert NSArray:dictionary[@"sharingConfigurations"]]];
  }
  if (dictionary[@"enableAnnotationEditing"]) {
    BOOL enable = [RCTConvert BOOL:dictionary[@"enableAnnotationEditing"]];
    if (enable) {
      self.editableAnnotationTypes = [NSSet setWithArray:@[PSPDFAnnotationStringLink, PSPDFAnnotationStringHighlight, PSPDFAnnotationStringUnderline, PSPDFAnnotationStringSquiggly, PSPDFAnnotationStringStrikeOut, PSPDFAnnotationStringNote, PSPDFAnnotationStringCaret, PSPDFAnnotationStringFreeText, PSPDFAnnotationStringInk, PSPDFAnnotationStringSquare, PSPDFAnnotationStringCircle, PSPDFAnnotationStringLine, PSPDFAnnotationStringSignature, PSPDFAnnotationStringStamp, PSPDFAnnotationStringEraser, PSPDFAnnotationStringImage, PSPDFAnnotationStringWidget, PSPDFAnnotationStringFile, PSPDFAnnotationStringSound, PSPDFAnnotationStringPolygon, PSPDFAnnotationStringPolyLine, PSPDFAnnotationStringRichMedia, PSPDFAnnotationStringScreen, PSPDFAnnotationStringPopup, PSPDFAnnotationStringWatermark, PSPDFAnnotationStringTrapNet, PSPDFAnnotationString3D, PSPDFAnnotationStringRedaction]];
    } else {
      self.editableAnnotationTypes = nil;
    }
  }
  if (dictionary[@"enableFormEditing"]) {
    BOOL isFormEditingEnabled = [RCTConvert BOOL:dictionary[@"enableFormEditing"]];
    NSMutableSet *editableTypes = [self.editableAnnotationTypes mutableCopy];
    if (isFormEditingEnabled) {
      [editableTypes addObject:PSPDFAnnotationStringWidget];
    } else {
      [editableTypes removeObject:PSPDFAnnotationStringWidget];
    }
    self.editableAnnotationTypes = [editableTypes copy];
  }

  [self setRCTSignatureCreationConfiguration:dictionary];

  // Deprecated Options

  // Use `scrollDirection` instead.
  SET_PROPERTY(pageScrollDirection, scrollDirection, PSPDFScrollDirection)

  // Use `pageTransition` instead.
  if (dictionary[@"scrollContinuously"]) {
    self.pageTransition = [RCTConvert BOOL:dictionary[@"scrollContinuously"]] ? PSPDFPageTransitionScrollContinuous : PSPDFPageTransitionScrollPerSpread;
  }

  // Use `enableTextSelection` instead.
  SET(textSelectionEnabled, BOOL)

  // Use `showPageLabels` instead.
  SET(pageLabelEnabled, BOOL)

  // Use `showPageLabels` instead.
  SET_PROPERTY(showPageNumberOverlay, pageLabelEnabled, BOOL)

  // Use `documentLabelEnabled` instead.
  SET_PROPERTY(showDocumentLabel, documentLabelEnabled, PSPDFAdaptiveConditional)

  // Use `thumbnailBarMode` instead.
  SET_PROPERTY(showThumbnailBar, thumbnailBarMode, PSPDFThumbnailBarMode)
}

- (void)setRCTSharingConfigurations:(NSArray<NSDictionary *> *)sharingConfigurations {
  __block NSMutableArray<PSPDFDocumentSharingConfiguration *> *rnSharingConfigurations = [NSMutableArray new];
  [sharingConfigurations enumerateObjectsUsingBlock:^(NSDictionary *dictionary, NSUInteger idx, BOOL * _Nonnull stop) {
    PSPDFDocumentSharingConfiguration *rnSharingConfiguration = [PSPDFDocumentSharingConfiguration configurationWithBuilder:^(PSPDFDocumentSharingConfigurationBuilder * builder) {
      // Custom destination not yet supported.
      builder.destination = PSPDFDocumentSharingDestinationActivity;
      SET_OBJECT(builder, fileFormatOptions, PSPDFDocumentSharingFileFormatOptions)
      SET_OBJECT(builder, annotationOptions, PSPDFDocumentSharingAnnotationOptions)
      SET_OBJECT(builder, pageSelectionOptions, PSPDFDocumentSharingPagesOptions)
      SET_OBJECT(builder, applicationActivities, NSArray)
      SET_OBJECT(builder, excludedActivityTypes, NSArray)
    }];

    [rnSharingConfigurations addObject:rnSharingConfiguration];
  }];

  self.sharingConfigurations = rnSharingConfigurations;
}

- (void)setRCTSignatureCreationConfiguration:(NSDictionary *)configuration {
    PSPDFSignatureCreationConfigurationBuilder *builder = [PSPDFSignatureCreationConfigurationBuilder alloc];
    
    // important: set all default values
    [builder reset];
    
    if (configuration[@"signatureCreationModes"]) {
        NSSet *selectedModes = [NSSet setWithArray:[RCTConvert NSArray:configuration[@"signatureCreationModes"]]];
        
        NSMutableArray *mappedValues = [NSMutableArray array];
        for (NSString *signatureCreationModeString in selectedModes) {
            NSNumber *value = [SignatureCreationModeMap valueForKey:signatureCreationModeString];
            if (value != nil) {
                [mappedValues addObject:value];
            }
        }
        
        builder.availableModes = mappedValues;
    }
    
    if (configuration[@"signatureColorOptions"]) {
        NSArray *signatureColors = [RCTConvert NSArray:configuration[@"signatureColorOptions"]];
        
        NSMutableArray *resolvedColors = [NSMutableArray array];
        for (NSString *colorString in signatureColors) {
            if ([colorString hasPrefix:@"rgb("]) {
                [resolvedColors addObject: [UIColor rgb:colorString]];
            }
            else if ([colorString hasPrefix:@"#"]){
                [resolvedColors addObject: [[UIColor new] initWithHexString:colorString]];
            }
            else {
                [resolvedColors addObject: [UIColor colorFromName:colorString]];
            }
        }
        
        builder.colors = resolvedColors;
    }
    
    self.signatureCreationConfiguration = [builder build];
}

@end
