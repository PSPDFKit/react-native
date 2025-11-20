//
//  NutrientPropsToolbarHelper.m
//

#import "NutrientPropsToolbarHelper.h"

#import "RCTPSPDFKitView.h"
#import "RCTConvert+PSPDFViewMode.h"
#import <React/RCTConvert.h>

@implementation NutrientPropsToolbarHelper

+ (void)applyLeftBarButtonItemsFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	NSArray *leftBarButtonItems = [RCTConvert NSArray:json];
	[view setLeftBarButtonItems:leftBarButtonItems forViewMode:nil animated:NO];
}

+ (void)applyRightBarButtonItemsFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (!json) { return; }
	NSArray *rightBarButtonItems = [RCTConvert NSArray:json];
	[view setRightBarButtonItems:rightBarButtonItems forViewMode:nil animated:NO];
}

+ (void)applyToolbarFromJSON:(NSDictionary *)toolbar toView:(RCTPSPDFKitView *)view {
	if (!toolbar) { return; }
	NSDictionary *left = [toolbar objectForKey:@"leftBarButtonItems"];
	if (left != nil) {
		[view setLeftBarButtonItems:[left objectForKey:@"buttons"]
						  forViewMode:[left objectForKey:@"viewMode"]
							animated:[left objectForKey:@"animated"]];
	}
	NSDictionary *right = [toolbar objectForKey:@"rightBarButtonItems"];
	if (right != nil) {
		[view setRightBarButtonItems:[right objectForKey:@"buttons"]
						   forViewMode:[right objectForKey:@"viewMode"]
						   	animated:[right objectForKey:@"animated"]];
	}
}

+ (NSDictionary *)composeToolbarForView:(RCTPSPDFKitView *)view viewMode:(nullable NSString *)viewMode {
	NSArray *leftItems = [view getLeftBarButtonItemsForViewMode:viewMode];
	NSArray *rightItems = [view getRightBarButtonItemsForViewMode:viewMode];
	return @{ @"viewMode": viewMode == nil ? [RCTConvert PSPDFViewModeString:view.pdfController.viewMode] : viewMode,
			  @"leftBarButtonItems": leftItems ?: @[],
			  @"rightBarButtonItems": rightItems ?: @[] };
}

@end 