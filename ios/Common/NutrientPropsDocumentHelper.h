//
//  NutrientPropsDocumentHelper.h
//
//  Shared helpers to apply document and configuration related props.
//

#import <Foundation/Foundation.h>

@class PDFDocumentManager;
@class RCTPSPDFKitView;

NS_ASSUME_NONNULL_BEGIN

@interface NutrientPropsDocumentHelper : NSObject

+ (void)applyDocumentFromJSON:(id)json
         remoteDocumentConfig:(nullable NSDictionary *)remoteDocumentConfig
                       toView:(RCTPSPDFKitView *)view
                 usingManager:(PDFDocumentManager *)manager
                withReference:(NSNumber *)identifier;

+ (void)applyPageIndexFromJSON:(id)json
							toView:(RCTPSPDFKitView *)view;

+ (void)applyConfigurationFromJSON:(id)json
								toView:(RCTPSPDFKitView *)view;

+ (void)applyAnnotationAuthorNameFromJSON:(id)json
									 toView:(RCTPSPDFKitView *)view;

+ (void)applyImageSaveModeFromJSON:(id)json
								  toView:(RCTPSPDFKitView *)view;

+ (void)applyDisableAutomaticSavingFromJSON:(id)json
										 toView:(RCTPSPDFKitView *)view;

+ (void)applyMenuItemGroupingFromJSON:(id)json
									  toView:(RCTPSPDFKitView *)view;

+ (void)applyAnnotationPresetsFromJSON:(NSDictionary *)json
									   toView:(RCTPSPDFKitView *)view;
@end

NS_ASSUME_NONNULL_END 