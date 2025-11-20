//
//  NutrientPropsAnnotationsHelper.m
//

#import "NutrientPropsAnnotationsHelper.h"

#import "RCTPSPDFKitView.h"
#import <React/RCTConvert.h>

#if __has_include("PSPDFKitReactNativeiOS-Swift.h")
#import "PSPDFKitReactNativeiOS-Swift.h"
#else
#import <PSPDFKitReactNativeiOS/PSPDFKitReactNativeiOS-Swift.h>
#endif

@implementation NutrientPropsAnnotationsHelper

+ (void)applyAnnotationPresetsFromJSON:(id)json {
	if (json) {
		[AnnotationsConfigurationsConverter convertAnnotationConfigurationsWithAnnotationPreset:json];
	}
}

+ (void)applyAnnotationContextualMenuFromJSON:(NSDictionary *)annotationContextualMenu toView:(RCTPSPDFKitView *)view {
	if (!annotationContextualMenu) { return; }
	[view setAnnotationContextualMenuItems:annotationContextualMenu];
}

@end 