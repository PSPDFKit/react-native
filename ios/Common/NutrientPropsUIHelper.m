//
//  NutrientPropsUIHelper.m
//

#import "NutrientPropsUIHelper.h"

#import "RCTPSPDFKitView.h"
#import <React/RCTConvert.h>

@implementation NutrientPropsUIHelper

+ (void)applyToolbarTitleFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (json) {
		view.pdfController.title = json;
	}
}

+ (void)applyShowCloseButtonFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (json && [RCTConvert BOOL:json]) {
		NSMutableArray *leftBarButtons = [[NSMutableArray alloc] initWithArray:view.pdfController.navigationItem.leftBarButtonItems];
		if (leftBarButtons == nil) {
			leftBarButtons = [NSMutableArray new];
		}
		if (![leftBarButtons containsObject:view.closeButton]) {
			[leftBarButtons addObject:view.closeButton];
		}
		view.pdfController.navigationItem.leftBarButtonItems = leftBarButtons;
	}
}

@end 