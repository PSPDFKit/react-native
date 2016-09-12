//
//  RCTConvert+PSPDFConfiguration.m
//  RCTPSPDFKit
//
//  Created by Robert Wijas on 12/09/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTConvert+PSPDFConfiguration.h"

@implementation RCTConvert (PSPDFConfiguration)

#define SET(property, type) if (dictionary[@#property]) builder.property = [self type:dictionary[@#property]];

+ (PSPDFConfiguration *)PSPDFConfiguration:(id)json {
  NSDictionary *dictionary = [self NSDictionary:json];

  return [PSPDFConfiguration configurationWithBuilder:^(PSPDFConfigurationBuilder * _Nonnull builder) {

    SET(margin, UIEdgeInsets)
    SET(padding, UIEdgeInsets)
    SET(pagePadding, CGFloat)
    SET(renderingMode, PSPDFPageRenderingMode)
    SET(doubleTapAction, PSPDFTapAction)
    SET(formElementZoomEnabled, BOOL)
    SET(scrollOnTapPageEndEnabled, BOOL)
    SET(scrollOnTapPageEndAnimationEnabled, BOOL)
    SET(scrollOnTapPageEndMargin, CGFloat)
    SET(textSelectionEnabled, BOOL)
    SET(imageSelectionEnabled, BOOL)
    SET(textSelectionMode, PSPDFTextSelectionMode)
    SET(textSelectionShouldSnapToWord, BOOL)
    SET(typesShowingColorPresets, PSPDFAnnotationType)
    SET(freeTextAccessoryViewEnabled, BOOL)
    SET(bookmarkSortOrder, PSPDFBookmarkManagerSortOrder)
    SET(internalTapGesturesEnabled, BOOL)
    SET(useParentNavigationBar, BOOL)
    SET(shouldRestoreNavigationBarStyle, BOOL)
    SET(linkAction, PSPDFLinkAction)
    SET(allowedMenuActions, PSPDFTextSelectionMenuAction)
    SET(HUDViewMode, PSPDFHUDViewMode)
    SET(HUDViewAnimation, PSPDFHUDViewAnimation)
    SET(thumbnailBarMode, PSPDFThumbnailBarMode)
    SET(pageLabelEnabled, BOOL)
    SET(documentLabelEnabled, PSPDFAdaptiveConditional)
    SET(shouldHideHUDOnPageChange, BOOL)
    SET(shouldShowHUDOnViewWillAppear, BOOL)
    SET(allowToolbarTitleChange, BOOL)
    SET(renderAnimationEnabled, BOOL)
    SET(renderStatusViewPosition, PSPDFRenderStatusViewPosition)
    SET(pageMode, PSPDFPageMode)
    SET(scrubberBarType, PSPDFScrubberBarType)
    SET(thumbnailGrouping, PSPDFThumbnailGrouping)
    SET(pageTransition, PSPDFPageTransition)
    SET(scrollDirection, PSPDFScrollDirection)
    SET(scrollViewInsetAdjustment, PSPDFScrollInsetAdjustment)
    SET(doublePageModeOnFirstPage, BOOL)
    SET(zoomingSmallDocumentsEnabled, BOOL)
    SET(pageCurlDirectionLeftToRight, BOOL)
    SET(fitToWidthEnabled, BOOL)
    SET(showsHorizontalScrollIndicator, BOOL)
    SET(showsVerticalScrollIndicator, BOOL)
    SET(alwaysBouncePages, BOOL)
    SET(fixedVerticalPositionForFitToWidthEnabledMode, BOOL)
    SET(clipToPageBoundaries, BOOL)
    SET(minimumZoomScale, float)
    SET(maximumZoomScale, float)
    SET(shadowEnabled, BOOL)
    SET(shadowOpacity, CGFloat)
    SET(shouldHideNavigationBarWithHUD, BOOL)
    SET(shouldHideStatusBar, BOOL)
    SET(shouldHideStatusBarWithHUD, BOOL)
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
    SET(signatureSavingEnabled, BOOL)
    SET(customerSignatureFeatureEnabled, BOOL)
    SET(naturalSignatureDrawingEnabled, BOOL)
    // currently unsupported: SET(*galleryConfiguration, PSPDFGalleryConfiguration)
    SET(showBackActionButton, BOOL)
    SET(showForwardActionButton, BOOL)
    SET(showBackForwardActionButtonLabels, BOOL)
    // currently unsupported: SET(*applicationActivities, NSArray)
    SET(printSharingOptions, PSPDFDocumentSharingOptions)
    SET(openInSharingOptions, PSPDFDocumentSharingOptions)
    SET(mailSharingOptions, PSPDFDocumentSharingOptions)
    SET(messageSharingOptions, PSPDFDocumentSharingOptions)
    SET(settingsOptions, PSPDFSettingsOptions)
  }];
}

RCT_ENUM_CONVERTER(PSPDFScrollDirection,
                   (@{@"horizontal" : @(PSPDFScrollDirectionHorizontal),
                      @"vertical" : @(PSPDFScrollDirectionVertical)}),
                   PSPDFScrollDirectionHorizontal,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFPageRenderingMode,
                   (@{@"thumbnailThenFullPage" : @(PSPDFPageRenderingModeThumbnailThenFullPage),
                      @"thumbnailIfInMemoryTheFullPage" : @(PSPDFPageRenderingModeThumbnailIfInMemoryThenFullPage),
                      @"fullPage" : @(PSPDFPageRenderingModeFullPage),
                      @"fullPageBlocking" : @(PSPDFPageRenderingModeFullPageBlocking),
                      @"thumbnailThenRender" : @(PSPDFPageRenderingModeThumbnailThenRender),
                      @"render" : @(PSPDFPageRenderingModeRender)}),
                   PSPDFPageRenderingModeThumbnailThenFullPage,
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
                      @"browserLegacy" : @(PSPDFLinkActionInlineBrowserLegacy)}),
                   PSPDFLinkActionNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFHUDViewMode,
                   (@{@"always" : @(PSPDFHUDViewModeAlways),
                      @"automatic" : @(PSPDFHUDViewModeAutomatic),
                      @"automaticNoFirstLastPage" : @(PSPDFHUDViewModeAutomaticNoFirstLastPage),
                      @"never" : @(PSPDFHUDViewModeNever)}),
                   PSPDFHUDViewModeAutomatic,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFHUDViewAnimation,
                   (@{@"none" : @(PSPDFHUDViewAnimationNone),
                      @"fade" : @(PSPDFHUDViewAnimationFade),
                      @"slide" : @(PSPDFHUDViewAnimationSlide)}),
                   PSPDFHUDViewAnimationNone,
                   unsignedIntegerValue)

RCT_ENUM_CONVERTER(PSPDFThumbnailBarMode,
                   (@{@"none" : @(PSPDFThumbnailBarModeNone),
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
                   (@{@"scrollPerPage" : @(PSPDFPageTransitionScrollPerPage),
                      @"scrollContinuous" : @(PSPDFPageTransitionScrollContinuous),
                      @"curl" : @(PSPDFPageTransitionCurl)}),
                   PSPDFPageTransitionScrollPerPage,
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

RCT_MULTI_ENUM_CONVERTER(PSPDFAnnotationType,
                         (@{@"none" : @(PSPDFAnnotationTypeNone),
                            @"undefined" : @(PSPDFAnnotationTypeUndefined),
                            @"link" : @(PSPDFAnnotationTypeLink),
                            @"highlight" : @(PSPDFAnnotationTypeHighlight),
                            @"strikeOut" : @(PSPDFAnnotationTypeStrikeOut),
                            @"underline" : @(PSPDFAnnotationTypeUnderline),
                            @"squiggly" : @(PSPDFAnnotationTypeSquiggly),
                            @"freeText" : @(PSPDFAnnotationTypeFreeText),
                            @"ink" : @(PSPDFAnnotationTypeInk),
                            @"square" : @(PSPDFAnnotationTypeSquare),
                            @"circle" : @(PSPDFAnnotationTypeCircle),
                            @"line" : @(PSPDFAnnotationTypeLine),
                            @"note" : @(PSPDFAnnotationTypeNote),
                            @"stamp" : @(PSPDFAnnotationTypeStamp),
                            @"caret" : @(PSPDFAnnotationTypeCaret),
                            @"richMedia" : @(PSPDFAnnotationTypeRichMedia),
                            @"screen" : @(PSPDFAnnotationTypeScreen),
                            @"widget" : @(PSPDFAnnotationTypeWidget),
                            @"file" : @(PSPDFAnnotationTypeFile),
                            @"sound" : @(PSPDFAnnotationTypeSound),
                            @"polygon" : @(PSPDFAnnotationTypePolygon),
                            @"polyLine" : @(PSPDFAnnotationTypePolyLine),
                            @"popup" : @(PSPDFAnnotationTypePopup),
                            @"watermark" : @(PSPDFAnnotationTypeWatermark),
                            @"trapNet" : @(PSPDFAnnotationTypeTrapNet),
                            @"threeDimensional" : @(PSPDFAnnotationTypeThreeDimensional),
                            @"redact" : @(PSPDFAnnotationTypeRedact),
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

RCT_MULTI_ENUM_CONVERTER(PSPDFDocumentSharingOptions,
                         (@{@"none" : @(PSPDFDocumentSharingOptionNone),
                            @"currentPageOnly" : @(PSPDFDocumentSharingOptionCurrentPageOnly),
                            @"pageRange" : @(PSPDFDocumentSharingOptionPageRange),
                            @"allPages" : @(PSPDFDocumentSharingOptionAllPages),
                            @"annotatedPages" : @(PSPDFDocumentSharingOptionAnnotatedPages),
                            @"embedAnnotations" : @(PSPDFDocumentSharingOptionEmbedAnnotations),
                            @"flattenAnnotations" : @(PSPDFDocumentSharingOptionFlattenAnnotations),
                            @"annotationsSummary" : @(PSPDFDocumentSharingOptionAnnotationsSummary),
                            @"removeAnnotations" : @(PSPDFDocumentSharingOptionRemoveAnnotations),
                            @"originalFile" : @(PSPDFDocumentSharingOptionOriginalFile),
                            @"image" : @(PSPDFDocumentSharingOptionImage)}),
                         PSPDFDocumentSharingOptionNone,
                         unsignedIntegerValue)

RCT_MULTI_ENUM_CONVERTER(PSPDFSettingsOptions,
                         (@{@"none" : @(PSPDFSettingsOptionNone),
                            @"scrollDirection" : @(PSPDFSettingsOptionScrollDirection),
                            @"pageTransition" : @(PSPDFSettingsOptionPageTransition),
                            @"appearance" : @(PSPDFSettingsOptionAppearance),
                            @"brightness" : @(PSPDFSettingsOptionBrightness),
                            @"all" : @(PSPDFSettingsOptionAll)}),
                         PSPDFSettingsOptionAll,
                         unsignedIntegerValue)

@end
