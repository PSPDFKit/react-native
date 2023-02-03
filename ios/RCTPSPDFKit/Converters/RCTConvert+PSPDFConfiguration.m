//
//  Copyright © 2016-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+PSPDFConfiguration.h"

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
                   (@{@"horizontal" : @(PSPDFScrollDirectionHorizontal),
                      @"vertical" : @(PSPDFScrollDirectionVertical)}),
                   PSPDFScrollDirectionHorizontal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFTapAction,
                   (@{@"none" : @(PSPDFTapActionNone),
                      @"zoom" : @(PSPDFTapActionZoom),
                      @"smartZoom" : @(PSPDFTapActionSmartZoom)}),
                   PSPDFTapActionNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFTextSelectionMode,
                   (@{@"regular" : @(PSPDFTextSelectionModeRegular),
                      @"simple" : @(PSPDFTextSelectionModeSimple)}),
                   PSPDFTextSelectionModeRegular,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFBookmarkManagerSortOrder,
                   (@{@"custom" : @(PSPDFBookmarkManagerSortOrderCustom),
                      @"pageBased" : @(PSPDFBookmarkManagerSortOrderPageBased)}),
                   PSPDFBookmarkManagerSortOrderPageBased,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFLinkAction,
                   (@{@"none" : @(PSPDFLinkActionNone),
                      @"alertView" : @(PSPDFLinkActionAlertView),
                      @"openSafari" : @(PSPDFLinkActionOpenSafari),
                      @"inlineBrowser" : @(PSPDFLinkActionInlineBrowser),
                      @"InlineWebViewController" : @(PSPDFLinkActionInlineWebViewController)}),
                   PSPDFLinkActionNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFUserInterfaceViewMode,
                   (@{@"automatic" : @(PSPDFUserInterfaceViewModeAutomatic),
                      @"automaticBorderPages" : @(PSPDFUserInterfaceViewModeAutomaticNoFirstLastPage),
                      @"automaticNoFirstLastPage" : @(PSPDFUserInterfaceViewModeAutomaticNoFirstLastPage),
                      @"always" : @(PSPDFUserInterfaceViewModeAlways),
                      @"alwaysVisible" : @(PSPDFUserInterfaceViewModeAlways),
                      @"alwaysHidden" : @(PSPDFUserInterfaceViewModeNever),
                      @"never" : @(PSPDFUserInterfaceViewModeNever)}),
                   PSPDFUserInterfaceViewModeAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFUserInterfaceViewAnimation,
                   (@{@"none" : @(PSPDFUserInterfaceViewAnimationNone),
                      @"fade" : @(PSPDFUserInterfaceViewAnimationFade),
                      @"slide" : @(PSPDFUserInterfaceViewAnimationSlide)}),
                   PSPDFUserInterfaceViewAnimationNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFThumbnailBarMode,
                   (@{@"none" : @(PSPDFThumbnailBarModeNone),
                      @"default": @(PSPDFThumbnailBarModeFloatingScrubberBar),
                      @"floating" : @(PSPDFThumbnailBarModeFloatingScrubberBar),
                      @"scrubberBar" : @(PSPDFThumbnailBarModeScrubberBar),
                      @"pinned" : @(PSPDFThumbnailBarModeScrubberBar),
                      @"scrollable" : @(PSPDFThumbnailBarModeScrollable)}),
                   PSPDFThumbnailBarModeFloatingScrubberBar,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFAdaptiveConditional,
                   (@{@(NO) : @(PSPDFAdaptiveConditionalNO),
                      @(YES) : @(PSPDFAdaptiveConditionalYES),
                      @"Adaptive" : @(PSPDFAdaptiveConditionalAdaptive)}),
                   PSPDFAdaptiveConditionalAdaptive,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFRenderStatusViewPosition,
                   (@{@"top" : @(PSPDFRenderStatusViewPositionTop),
                      @"centered" : @(PSPDFRenderStatusViewPositionCentered)}),
                   PSPDFRenderStatusViewPositionTop,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFPageMode,
                   (@{@"single" : @(PSPDFPageModeSingle),
                      @"double" : @(PSPDFPageModeDouble),
                      @"automatic" : @(PSPDFPageModeAutomatic)}),
                   PSPDFPageModeAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFScrubberBarType,
                   (@{@"horizontal" : @(PSPDFScrubberBarTypeHorizontal),
                      @"verticalLeft" : @(PSPDFScrubberBarTypeVerticalLeft),
                      @"verticalRight" : @(PSPDFScrubberBarTypeVerticalRight)}),
                   PSPDFScrubberBarTypeHorizontal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFThumbnailGrouping,
                   (@{@"automatic" : @(PSPDFThumbnailGroupingAutomatic),
                      @"never" : @(PSPDFThumbnailGroupingNever),
                      @"always" : @(PSPDFThumbnailGroupingAlways)}),
                   PSPDFThumbnailGroupingAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFPageTransition,
                   (@{@"scrollPerSpread" : @(PSPDFPageTransitionScrollPerSpread),
                      @"scrollContinuous" : @(PSPDFPageTransitionScrollContinuous),
                      @"curl" : @(PSPDFPageTransitionCurl)}),
                   PSPDFPageTransitionScrollPerSpread,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFScrollInsetAdjustment,
                   (@{@"none" : @(PSPDFScrollInsetAdjustmentNone),
                      @"fixedElements" : @(PSPDFScrollInsetAdjustmentFixedElements),
                      @"allElements" : @(PSPDFScrollInsetAdjustmentAllElements)}),
                   PSPDFScrollInsetAdjustmentNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFDrawCreateMode,
                   (@{@"separate" : @(PSPDFDrawCreateModeSeparate),
                      @"mergeIfPossible" : @(PSPDFDrawCreateModeMergeIfPossible)}),
                   PSPDFDrawCreateModeMergeIfPossible,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFSearchMode,
                   (@{@"modal" : @(PSPDFSearchModeModal),
                      @"inline" : @(PSPDFSearchModeInline)}),
                   PSPDFSearchModeModal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFSignatureSavingStrategy,
                   (@{@"alwaysSave" : @(PSPDFSignatureSavingStrategyAlwaysSave),
                      @"neverSave" : @(PSPDFSignatureSavingStrategyNeverSave),
                      @"saveIfSelected" : @(PSPDFSignatureSavingStrategySaveIfSelected)}),
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
                         (@{@"none" : @(PSPDFAnnotationTypeNone),
                            @"undefined" : @(PSPDFAnnotationTypeUndefined),
                            PSPDFAnnotationStringLink : @(PSPDFAnnotationTypeLink),
                            PSPDFAnnotationStringHighlight : @(PSPDFAnnotationTypeHighlight),
                            PSPDFAnnotationStringStrikeOut : @(PSPDFAnnotationTypeStrikeOut),
                            PSPDFAnnotationStringUnderline : @(PSPDFAnnotationTypeUnderline),
                            PSPDFAnnotationStringSquiggly : @(PSPDFAnnotationTypeSquiggly),
                            PSPDFAnnotationStringFreeText : @(PSPDFAnnotationTypeFreeText),
                            PSPDFAnnotationStringInk : @(PSPDFAnnotationTypeInk),
                            PSPDFAnnotationStringSquare : @(PSPDFAnnotationTypeSquare),
                            PSPDFAnnotationStringCircle : @(PSPDFAnnotationTypeCircle),
                            PSPDFAnnotationStringLine : @(PSPDFAnnotationTypeLine),
                            PSPDFAnnotationStringNote : @(PSPDFAnnotationTypeNote),
                            PSPDFAnnotationStringStamp : @(PSPDFAnnotationTypeStamp),
                            PSPDFAnnotationStringCaret : @(PSPDFAnnotationTypeCaret),
                            PSPDFAnnotationStringRichMedia : @(PSPDFAnnotationTypeRichMedia),
                            PSPDFAnnotationStringScreen : @(PSPDFAnnotationTypeScreen),
                            PSPDFAnnotationStringWidget : @(PSPDFAnnotationTypeWidget),
                            PSPDFAnnotationStringFile : @(PSPDFAnnotationTypeFile),
                            PSPDFAnnotationStringSound : @(PSPDFAnnotationTypeSound),
                            PSPDFAnnotationStringPolygon : @(PSPDFAnnotationTypePolygon),
                            PSPDFAnnotationStringPolyLine : @(PSPDFAnnotationTypePolyLine),
                            PSPDFAnnotationStringPopup : @(PSPDFAnnotationTypePopup),
                            PSPDFAnnotationStringWatermark : @(PSPDFAnnotationTypeWatermark),
                            PSPDFAnnotationStringTrapNet : @(PSPDFAnnotationTypeTrapNet),
                            PSPDFAnnotationString3D : @(PSPDFAnnotationTypeThreeDimensional),
                            PSPDFAnnotationStringRedaction : @(PSPDFAnnotationTypeRedaction),
                            @"all" : @(PSPDFAnnotationTypeAll)}),
                         PSPDFAnnotationTypeNone,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFTextSelectionMenuAction,
                         (@{@"none" : @(PSPDFTextSelectionMenuActionNone),
                            @"search" : @(PSPDFTextSelectionMenuActionSearch),
                            @"define" : @(PSPDFTextSelectionMenuActionDefine),
                            @"wikipedia" : @(PSPDFTextSelectionMenuActionWikipedia),
                            @"speak" : @(PSPDFTextSelectionMenuActionSpeak),
                            @"all" : @(PSPDFTextSelectionMenuActionAll)}),
                         PSPDFTextSelectionMenuActionNone,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFAppearanceMode,
                         (@{@"default" : @(PSPDFAppearanceModeDefault),
                            @"sepia" : @(PSPDFAppearanceModeSepia),
                            @"night" : @(PSPDFAppearanceModeNight),
                            @"all" : @(PSPDFAppearanceModeAll)}),
                         PSPDFAppearanceModeDefault,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFSettingsOptions,
                         (@{@"scrollDirection" : @(PSPDFSettingsOptionScrollDirection),
                            @"pageTransition" : @(PSPDFSettingsOptionPageTransition),
                            @"appearance" : @(PSPDFSettingsOptionAppearance),
                            @"brightness" : @(PSPDFSettingsOptionBrightness),
                            @"pageMode" : @(PSPDFSettingsOptionPageMode),
                            @"spreadFitting" : @(PSPDFSettingsOptionSpreadFitting),
                            @"default" : @(PSPDFSettingsOptionDefault),
                            @"all" : @(PSPDFSettingsOptionAll)}),
                         PSPDFSettingsOptionAll,
                         unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFConfigurationSpreadFitting,
                   (@{@"fit" : @(PSPDFConfigurationSpreadFittingFit),
                      @"fill" : @(PSPDFConfigurationSpreadFittingFill),
                      @"adaptive" : @(PSPDFConfigurationSpreadFittingAdaptive)}),
                   PSPDFScrollInsetAdjustmentNone,
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
  SET(scrollViewInsetAdjustment, PSPDFScrollInsetAdjustment)
  SET(formElementZoomEnabled, BOOL)
  SET_PROPERTY(enableTextSelection, textSelectionEnabled, BOOL)
  SET(imageSelectionEnabled, BOOL)
  SET(textSelectionShouldSnapToWord, BOOL)
  SET(freeTextAccessoryViewEnabled, BOOL)
  SET(internalTapGesturesEnabled, BOOL)
  SET(autosaveEnabled, BOOL)
  SET(allowBackgroundSaving, BOOL)
  SET(signatureSavingStrategy, PSPDFSignatureSavingStrategy)
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
  SET(allowedMenuActions, PSPDFTextSelectionMenuAction)
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

@end
