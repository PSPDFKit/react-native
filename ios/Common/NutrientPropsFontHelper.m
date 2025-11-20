//
//  NutrientPropsFontHelper.m
//

#import "NutrientPropsFontHelper.h"

#import "RCTPSPDFKitView.h"
#import <React/RCTConvert.h>
#import <PSPDFKit/PSPDFKit.h>
#import <PSPDFKitUI/PSPDFKitUI.h>

// Static variables for CustomFontPickerViewController
static NSString *staticSelectedFontName;
static NSArray<NSString *>*staticAvailableFontNames;
static BOOL staticShowDownloadableFonts = YES;

// Custom font picker subclass to allow customizations.
@interface CustomFontPickerViewController : PSPDFFontPickerViewController
@end

@implementation CustomFontPickerViewController

- (NSArray *)customFontFamilyDescriptors {
  NSMutableArray *fontFamilyDescription = [NSMutableArray array];
  for (NSString *fontName in staticAvailableFontNames) {
    [fontFamilyDescription addObject:[[UIFontDescriptor alloc] initWithFontAttributes:@{UIFontDescriptorNameAttribute: fontName}]];
  }

  return fontFamilyDescription;
}

- (UIFont *)customSelectedFont {
  // We bailout early if the passed selected font name is nil.
  if (!staticSelectedFontName) {
    return nil;
  }
  UIFontDescriptor *fontDescriptor = [[UIFontDescriptor alloc] initWithFontAttributes:@{UIFontDescriptorNameAttribute: staticSelectedFontName}];
  return [UIFont fontWithDescriptor:fontDescriptor size:12.0];
}

- (instancetype)initWithFontFamilyDescriptors:(NSArray *)fontFamilyDescriptors {
  // Override the default font family descriptors if custom font descriptors are specified.
  NSArray *customFontFamilyDescriptors = [self customFontFamilyDescriptors];
  if (customFontFamilyDescriptors.count) {
    fontFamilyDescriptors = customFontFamilyDescriptors;
  }
  return [super initWithFontFamilyDescriptors:fontFamilyDescriptors];
}

- (void)dealloc {
  // Reset the static variables.
  staticSelectedFontName = nil;
  staticAvailableFontNames = nil;
  staticShowDownloadableFonts = YES;
}

-(void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];

  // Customize the font picker before it appears.
  self.showDownloadableFonts = staticShowDownloadableFonts;
  self.selectedFont = [self customSelectedFont];
}

@end

@implementation NutrientPropsFontHelper

+ (void)applyAvailableFontNamesFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (json && [RCTConvert NSArray:json]) {
		view.availableFontNames = [RCTConvert NSArray:json];
		staticAvailableFontNames = view.availableFontNames;
	}
}

+ (void)applySelectedFontNameFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (json && [RCTConvert NSString:json]) {
		view.selectedFontName = [RCTConvert NSString:json];
		staticSelectedFontName = view.selectedFontName;
	}
}

+ (void)applyShowDownloadableFontsFromJSON:(id)json toView:(RCTPSPDFKitView *)view {
	if (json) {
		view.showDownloadableFonts = [RCTConvert BOOL:json];
		staticShowDownloadableFonts = view.showDownloadableFonts;
	}
}

+ (void)configureCustomFontPickerForView:(RCTPSPDFKitView *)view {
	[view.pdfController updateConfigurationWithBuilder:^(PSPDFConfigurationBuilder *builder) {
		[builder overrideClass:PSPDFFontPickerViewController.class withClass:CustomFontPickerViewController.class];
	}];
}

@end 