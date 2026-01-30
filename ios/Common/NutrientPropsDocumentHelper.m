//
//  NutrientPropsDocumentHelper.m
//

#import "NutrientPropsDocumentHelper.h"

#import "RCTPSPDFKitViewManager.h"
#import "RCTPSPDFKitView.h"
#import "RCTConvert+PSPDFDocument.h"
#import "RCTConvert+PSPDFAnnotationToolbarConfiguration.h"
#import "RCTConvert+PSPDFConfiguration.h"
#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@class CustomFontPickerViewController;

#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>
#import <React/RCTConvert.h>

@implementation NutrientPropsDocumentHelper

+ (void)applyDocumentFromJSON:(id)json remoteDocumentConfig:(NSDictionary *)remoteDocumentConfig toView:(RCTPSPDFKitView *)view usingManager:(PDFDocumentManager *)manager withReference:(NSNumber *)identifier {
	if (!json) { return; }
	view.pdfController.document = [RCTConvert PSPDFDocument:json
									 remoteDocumentConfig:remoteDocumentConfig];
	view.pdfController.document.delegate = (id<PSPDFDocumentDelegate>)view;

#if RCT_NEW_ARCH_ENABLED
	[manager setDocument:view.pdfController.document reference:identifier];
#else
    [manager setDocument:view.pdfController.document reference:view.reactTag];
#endif
	[manager setDelegate:(id<PDFDocumentManagerDelegate>)view];

	if (view.annotationAuthorName) {
		view.pdfController.document.defaultAnnotationUsername = view.annotationAuthorName;
	}

	view.pdfController.pageIndex = view.pageIndex;

	if ([view.pdfController.document isKindOfClass:[PSPDFImageDocument class]]) {
		PSPDFImageDocument *imageDocument = (PSPDFImageDocument *)view.pdfController.document;
		imageDocument.imageSaveMode = view.imageSaveMode;
	}
}

+ (void)applyPageIndexFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	PSPDFPageIndex idx = [RCTConvert NSUInteger:json];
	view.pageIndex = idx;
	view.pdfController.pageIndex = idx;
}

+ (void)applyConfigurationFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
    [view applyDocumentConfiguration:json];
}

+ (void)applyAnnotationAuthorNameFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	view.pdfController.document.defaultAnnotationUsername = json;
	view.annotationAuthorName = json;
}

+ (void)applyImageSaveModeFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	view.imageSaveMode = [RCTConvert PSPDFImageSaveMode:json];
	if ([view.pdfController.document isKindOfClass:PSPDFImageDocument.class]) {
		PSPDFImageDocument *imageDoc = (PSPDFImageDocument *)view.pdfController.document;
		imageDoc.imageSaveMode = view.imageSaveMode;
	}
}

+ (void)applyDisableAutomaticSavingFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	view.disableAutomaticSaving = [RCTConvert BOOL:json];
	[view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
		builder.autosaveEnabled = !view.disableAutomaticSaving;
	}];
}

+ (void)applyMenuItemGroupingFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	PSPDFAnnotationToolbarConfiguration *configuration = [RCTConvert PSPDFAnnotationToolbarConfiguration:json];
	view.pdfController.annotationToolbarController.annotationToolbar.configurations = @[configuration];
}

// Annotation presets
+ (void)applyAnnotationPresetsFromJSON:(NSDictionary *)json toView:(RCTPSPDFKitView *)view {
	if (json == nil) { return; }
	// The Swift converter expects a [String: [String: Any]] dictionary
	[AnnotationsConfigurationsConverter convertAnnotationConfigurationsWithAnnotationPreset:json];
}

@end 
