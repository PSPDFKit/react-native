//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//

#if RCT_NEW_ARCH_ENABLED

#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>
#import <Instant/Instant.h>

#import "NutrientInstantView.h"
#import "RCTInstantPSPDFKitView.h"
#import <React/RCTConvert.h>
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif
#import "NutrientPropsDocumentHelper.h"
#import "NutrientPropsToolbarHelper.h"
#import "NutrientPropsAnnotationsHelper.h"
#import "NutrientPropsFontHelper.h"
#import "NutrientPropsUIHelper.h"
#import "NutrientInstantViewRegistry.h"
#import "NutrientFabricUtils.h"

#import <React/RCTConversions.h>
#import <React/RCTViewComponentView.h>
#import <React/UIView+React.h>

#import <react/renderer/components/nutrient_sdk_react_native_codegen/ComponentDescriptors.h>
#import <react/renderer/components/nutrient_sdk_react_native_codegen/Props.h>
#import <react/renderer/components/nutrient_sdk_react_native_codegen/EventEmitters.h>
#import <react/renderer/components/nutrient_sdk_react_native_codegen/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface NutrientInstantView () <RCTNutrientInstantViewViewProtocol, RCTComponentViewProtocol, RCTInstantPSPDFKitViewDelegate>
@end

@implementation NutrientInstantView {
  RCTInstantPSPDFKitView *_view;
  std::shared_ptr<const NutrientInstantViewEventEmitter> _eventEmitter;
  NSString *_document;
  NSString *_configurationJSONString;
  NSString *_toolbarJSONString;
  NSString *_menuItemGroupingJSONString;
  NSString *_textSelectionContextualMenuJSONString;
  NutrientInstantViewAnnotationPresetsStruct _annotationPresets;
  NSInteger _pageIndex;
  BOOL _disableDefaultActionForTappedAnnotations;
  NSString *_annotationAuthorName;
  NSString *_imageSaveMode;
  BOOL _showNavigationButtonInToolbar;
  NSString *_selectedFontName;
  NSString *_availableFontNamesJSONString;
  BOOL _showDownloadableFonts;
  BOOL _showCloseButton;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _pageIndex = 0;
    _view = [[RCTInstantPSPDFKitView alloc] initWithFrame:frame];
    _view.delegate = self;
    self.contentView = _view;
    _view.translatesAutoresizingMaskIntoConstraints = NO;
    [NSLayoutConstraint activateConstraints:@[
      [_view.topAnchor constraintEqualToAnchor:self.topAnchor],
      [_view.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
      [_view.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
      [_view.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
    ]];
  }
  return self;
}

#pragma mark - RCTInstantPSPDFKitViewDelegate

- (void)pspdfViewDidReady:(RCTInstantPSPDFKitView *)view {
  if (_eventEmitter) _eventEmitter->onReady({});
}

- (void)pspdfView:(RCTInstantPSPDFKitView *)view didTapCustomToolbarButtonWithId:(NSString *)buttonId {
  if (_eventEmitter) {
    std::string s = buttonId ? std::string([buttonId UTF8String]) : std::string("");
    _eventEmitter->onCustomToolbarButtonTapped({ s, s });
  }
}

- (void)pspdfView:(RCTInstantPSPDFKitView *)view didTapCustomAnnotationMenuItemWithId:(NSString *)itemId {
  if (_eventEmitter)
    _eventEmitter->onCustomAnnotationContextualMenuItemTapped({ itemId ? std::string([itemId UTF8String]) : std::string("") });
}

- (void)pspdfViewDidPressCloseButton:(RCTInstantPSPDFKitView *)view {
  if (_eventEmitter) _eventEmitter->onCloseButtonPressed({});
}

- (void)pspdfView:(RCTInstantPSPDFKitView *)view didRequestShouldExecuteActionWithPayload:(NSDictionary *)payload {
  if (!_eventEmitter || !payload) return;
  NSString *requestId = payload[@"requestId"];
  NSNumber *pageIndex = payload[@"pageIndex"];
  NSString *actionType = payload[@"actionType"];
  NSString *url = payload[@"url"];
  NutrientInstantViewEventEmitter::OnShouldExecuteAction p{
    requestId ? std::string([requestId UTF8String]) : std::string(""),
    pageIndex ? (int)pageIndex.integerValue : 0,
    actionType ? std::string([actionType UTF8String]) : std::string(""),
    url ? std::string([url UTF8String]) : std::string("")
  };
  _eventEmitter->onShouldExecuteAction(p);
}

- (BOOL)isEventEmitterReady {
  return _eventEmitter != nullptr;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  [super updateProps:props oldProps:oldProps];
  [[NutrientInstantViewRegistry shared] registerView:_view withId:self.nativeId];
  _view.componentID = [self.nativeId integerValue];

  auto newProps = std::static_pointer_cast<const NutrientInstantViewProps>(props);
  if (!newProps) return;

  NSDictionary *jsonConfig = nil;
  if (!newProps->configurationJSONString.empty()) {
    _configurationJSONString = RCTNSStringFromString(newProps->configurationJSONString);
    jsonConfig = [NutrientFabricUtils dictionaryFromJSONString:_configurationJSONString];
  }

  // documentInfo is a struct in generated props; when not set its fields are empty strings.
  {
    const auto &info = newProps->documentInfo;
    NSMutableDictionary *docDict = [NSMutableDictionary dictionary];
    if (!info.serverUrl.empty()) {
      [docDict setObject:RCTNSStringFromString(info.serverUrl) forKey:@"serverUrl"];
    }
    if (!info.jwt.empty()) {
      [docDict setObject:RCTNSStringFromString(info.jwt) forKey:@"jwt"];
    }
    if (docDict.count > 0) {
      [_view setDocumentInfo:docDict configuration:jsonConfig];
    }
  }

  _pageIndex = newProps->pageIndex;
  [_view updatePageIndex:(PSPDFPageIndex)_pageIndex];

  _disableDefaultActionForTappedAnnotations = newProps->disableDefaultActionForTappedAnnotations;
  _view.disableDefaultActionForTappedAnnotations = _disableDefaultActionForTappedAnnotations;
  _view.hasShouldExecuteAction = newProps->hasShouldExecuteAction;
  _showCloseButton = newProps->showCloseButton;
  [NutrientPropsUIHelper applyShowCloseButtonFromJSON:@(_showCloseButton) toView:(RCTPSPDFKitView *)_view];
  _showNavigationButtonInToolbar = newProps->showNavigationButtonInToolbar;

  if (!newProps->availableFontNamesJSONString.empty()) {
    _availableFontNamesJSONString = RCTNSStringFromString(newProps->availableFontNamesJSONString);
    NSArray *arr = [NutrientFabricUtils stringArrayFromJSONString:_availableFontNamesJSONString];
    if (arr) [NutrientPropsFontHelper applyAvailableFontNamesFromJSON:@{ @"availableFontNames": arr } toView:(RCTPSPDFKitView *)_view];
  }
  if (!newProps->selectedFontName.empty()) {
    _selectedFontName = RCTNSStringFromString(newProps->selectedFontName);
    [NutrientPropsFontHelper applySelectedFontNameFromJSON:_selectedFontName toView:(RCTPSPDFKitView *)_view];
  }
  // showDownloadableFonts is not wired for Instant view; ignore to avoid calling selectors
  // that only exist on RCTPSPDFKitView.
  _showDownloadableFonts = newProps->showDownloadableFonts;

  if (!newProps->menuItemGroupingJSONString.empty()) {
    _menuItemGroupingJSONString = RCTNSStringFromString(newProps->menuItemGroupingJSONString);
    id root = [NutrientFabricUtils objectFromJSONString:_menuItemGroupingJSONString];
    if ([root isKindOfClass:[NSArray class]])
      [NutrientPropsDocumentHelper applyMenuItemGroupingFromJSON:(NSArray *)root toView:(RCTPSPDFKitView *)_view];
  }
  if (!newProps->annotationAuthorName.empty()) {
    _annotationAuthorName = RCTNSStringFromString(newProps->annotationAuthorName);
    [NutrientPropsDocumentHelper applyAnnotationAuthorNameFromJSON:_annotationAuthorName toView:(RCTPSPDFKitView *)_view];
  }
  if (!newProps->imageSaveMode.empty()) {
    _imageSaveMode = RCTNSStringFromString(newProps->imageSaveMode);
    [NutrientPropsDocumentHelper applyImageSaveModeFromJSON:_imageSaveMode toView:(RCTPSPDFKitView *)_view];
  }

  if (jsonConfig)
    [NutrientPropsDocumentHelper applyConfigurationFromJSON:jsonConfig toView:(RCTPSPDFKitView *)_view];

  if (!newProps->toolbarJSONString.empty()) {
    _toolbarJSONString = RCTNSStringFromString(newProps->toolbarJSONString);
    NSDictionary *toolbarDict = [NutrientFabricUtils dictionaryFromJSONString:_toolbarJSONString];
    if (toolbarDict) [NutrientPropsToolbarHelper applyToolbarFromJSON:toolbarDict toView:(RCTPSPDFKitView *)_view];
  }

  _annotationPresets = newProps->annotationPresets;
  NSDictionary *presetsDict = [NutrientFabricUtils convertAnnotationPresetsToDictionary:&_annotationPresets];
  if (presetsDict) [NutrientPropsDocumentHelper applyAnnotationPresetsFromJSON:presetsDict toView:(RCTPSPDFKitView *)_view];

  if (!newProps->annotationContextualMenuJSONString.empty()) {
    NSDictionary *contextualMenuDict = [NutrientFabricUtils dictionaryFromJSONString:RCTNSStringFromString(newProps->annotationContextualMenuJSONString)];
    if (contextualMenuDict) [NutrientPropsAnnotationsHelper applyAnnotationContextualMenuFromJSON:contextualMenuDict toView:(RCTPSPDFKitView *)_view];
  }
  if (!newProps->textSelectionContextualMenuJSONString.empty()) {
    _textSelectionContextualMenuJSONString = RCTNSStringFromString(newProps->textSelectionContextualMenuJSONString);
    NSDictionary *textMenuDict = [NutrientFabricUtils dictionaryFromJSONString:_textSelectionContextualMenuJSONString];
    if (textMenuDict) [NutrientPropsAnnotationsHelper applyTextSelectionContextualMenuFromJSON:textMenuDict toView:(RCTPSPDFKitView *)_view];
  }
}

- (void)updateEventEmitter:(EventEmitter::Shared const &)eventEmitter {
  [super updateEventEmitter:eventEmitter];
  _eventEmitter = std::static_pointer_cast<const NutrientInstantViewEventEmitter>(eventEmitter);
  [_view processPendingCallbacks];
}

- (void)dealloc {
  if (self.nativeId) [[NutrientInstantViewRegistry shared] unregisterViewWithId:self.nativeId];
  if (_view) _view.delegate = nil;
  _eventEmitter = nullptr;
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  if (self.nativeId) [[NutrientInstantViewRegistry shared] unregisterViewWithId:self.nativeId];
  if (_view) _view.delegate = nil;
  _eventEmitter = nullptr;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<NutrientInstantViewComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> NutrientInstantViewCls(void) {
  return NutrientInstantView.class;
}

#endif
