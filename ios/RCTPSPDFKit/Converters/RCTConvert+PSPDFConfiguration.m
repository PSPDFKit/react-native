//
//  Copyright © 2016-2019 PSPDFKit GmbH. All rights reserved.
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
                   (@{@"always" : @(PSPDFUserInterfaceViewModeAlways),
                      @"alwaysVisible" : @(PSPDFUserInterfaceViewModeAlways),
                      @"automatic" : @(PSPDFUserInterfaceViewModeAutomatic),
                      @"automaticNoFirstLastPage" : @(PSPDFUserInterfaceViewModeAutomaticNoFirstLastPage),
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
                      @"default": @(PSPDFThumbnailBarModeScrubberBar),
                      @"scrubberBar" : @(PSPDFThumbnailBarModeScrubberBar),
                      @"scrollable" : @(PSPDFThumbnailBarModeScrollable)}),
                   PSPDFThumbnailBarModeNone,
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
  NSDictionary *dictionary = [RCTConvert NSDictionary:json];

  SET(doubleTapAction, PSPDFTapAction)
  SET(formElementZoomEnabled, BOOL)
  SET(scrollOnTapPageEndEnabled, BOOL)
  SET(scrollOnTapPageEndAnimationEnabled, BOOL)
  SET(scrollOnTapPageEndMargin, CGFloat)
  SET_PROPERTY(enableTextSelection, textSelectionEnabled, BOOL)
  SET(textSelectionEnabled, BOOL)
  SET(imageSelectionEnabled, BOOL)
  SET(textSelectionMode, PSPDFTextSelectionMode)
  SET(textSelectionShouldSnapToWord, BOOL)
  SET(typesShowingColorPresets, PSPDFAnnotationType)
  SET(freeTextAccessoryViewEnabled, BOOL)
  SET(bookmarkSortOrder, PSPDFBookmarkManagerSortOrder)
  SET(internalTapGesturesEnabled, BOOL)
  SET(useParentNavigationBar, BOOL)
  SET(linkAction, PSPDFLinkAction)
  SET(allowedMenuActions, PSPDFTextSelectionMenuAction)
  SET(userInterfaceViewMode, PSPDFUserInterfaceViewMode)
  SET(userInterfaceViewAnimation, PSPDFUserInterfaceViewAnimation)
  SET_PROPERTY(showThumbnailBar, thumbnailBarMode, PSPDFThumbnailBarMode)
  SET(thumbnailBarMode, PSPDFThumbnailBarMode)
  SET_PROPERTY(showPageLabels, pageLabelEnabled, BOOL)
  SET(pageLabelEnabled, BOOL)
  SET_PROPERTY(showDocumentLabel, documentLabelEnabled, PSPDFAdaptiveConditional)
  SET(documentLabelEnabled, PSPDFAdaptiveConditional)
  SET(shouldHideUserInterfaceOnPageChange, BOOL)
  SET(shouldShowUserInterfaceOnViewWillAppear, BOOL)
  SET(allowToolbarTitleChange, BOOL)
  SET(renderAnimationEnabled, BOOL)
  SET(renderStatusViewPosition, PSPDFRenderStatusViewPosition)
  SET(pageMode, PSPDFPageMode)
  SET(scrubberBarType, PSPDFScrubberBarType)
  SET(thumbnailGrouping, PSPDFThumbnailGrouping)
  SET(pageTransition, PSPDFPageTransition)
  SET_PROPERTY(pageScrollDirection, scrollDirection, PSPDFScrollDirection)
  SET(scrollDirection, PSPDFScrollDirection)
  SET(scrollViewInsetAdjustment, PSPDFScrollInsetAdjustment)
  SET(firstPageAlwaysSingle, BOOL)
  SET(spreadFitting, PSPDFConfigurationSpreadFitting)
  SET(clipToPageBoundaries, BOOL)
  SET(additionalScrollViewFrameInsets, UIEdgeInsets)
  SET(additionalContentInsets, UIEdgeInsets)
  SET(minimumZoomScale, float)
  SET(maximumZoomScale, float)
  SET(shadowEnabled, BOOL)
  SET(shadowOpacity, CGFloat)
  SET(shouldHideNavigationBarWithUserInterface, BOOL)
  SET(shouldHideStatusBar, BOOL)
  SET(shouldHideStatusBarWithUserInterface, BOOL)
  SET(backgroundColor, UIColor)
  SET(allowedAppearanceModes, PSPDFAppearanceMode)
  SET(thumbnailSize, CGSize)
  SET(thumbnailInteritemSpacing, CGFloat)
  SET(thumbnailLineSpacing, CGFloat)
  SET(thumbnailMargin, UIEdgeInsets)
  SET(annotationAnimationDuration, CGFloat)
  SET(annotationGroupingEnabled, BOOL)
  SET(createAnnotationMenuEnabled, BOOL)
  SET(naturalDrawingAnnotationEnabled, BOOL)
  SET(drawCreateMode, PSPDFDrawCreateMode)
  SET(showAnnotationMenuAfterCreation, BOOL)
  SET(shouldAskForAnnotationUsername, BOOL)
  SET(annotationEntersEditModeAfterSecondTapEnabled, BOOL)
  SET(autosaveEnabled, BOOL)
  SET(allowBackgroundSaving, BOOL)
  SET(soundAnnotationTimeLimit, NSTimeInterval)
  SET(shouldCacheThumbnails, BOOL)
  SET(shouldScrollToChangedPage, BOOL)
  SET(searchMode, PSPDFSearchMode)
  SET(searchResultZoomScale, CGFloat)
  SET(signatureSavingStrategy, PSPDFSignatureSavingStrategy)
  SET(naturalSignatureDrawingEnabled, BOOL)
  // currently unsupported: SET(*galleryConfiguration, PSPDFGalleryConfiguration)
  SET(showBackActionButton, BOOL)
  SET(showForwardActionButton, BOOL)
  SET(showBackForwardActionButtonLabels, BOOL)
  SET(settingsOptions, PSPDFSettingsOptions)
  SET(editableAnnotationTypes, NSSet)

  if (dictionary[@"inlineSearch"]) {
    self.searchMode = [RCTConvert BOOL:dictionary[@"inlineSearch"]] ? PSPDFSearchModeInline : PSPDFSearchModeModal;
  }

  if (dictionary[@"enableAnnotationEditing"] && [RCTConvert BOOL:dictionary[@"enableAnnotationEditing"]]) {
    self.editableAnnotationTypes = nil;
  }

  if (dictionary[@"sharingConfigurations"]) {
    [self setRCTSharingConfigurations:[RCTConvert NSArray:dictionary[@"sharingConfigurations"]]];
  }
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
