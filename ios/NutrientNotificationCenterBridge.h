//
//  NutrientNotificationCenterBridge.h
//  PSPDFKit
//
//  Copyright © 2025-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol NutrientNotificationCenterDelegate <NSObject>
- (void)nncDocumentLoaded:(NSDictionary *)payload;
- (void)nncDocumentLoadFailed:(NSDictionary *)payload;
- (void)nncDocumentPageChanged:(NSDictionary *)payload;
- (void)nncDocumentScrolled:(NSDictionary *)payload;
- (void)nncDocumentTapped:(NSDictionary *)payload;
- (void)nncAnnotationsAdded:(NSDictionary *)payload;
- (void)nncAnnotationChanged:(NSDictionary *)payload;
- (void)nncAnnotationsRemoved:(NSDictionary *)payload;
- (void)nncAnnotationsSelected:(NSDictionary *)payload;
- (void)nncAnnotationsDeselected:(NSDictionary *)payload;
- (void)nncAnnotationTapped:(NSDictionary *)payload;
- (void)nncTextSelected:(NSDictionary *)payload;
- (void)nncFormFieldValuesUpdated:(NSDictionary *)payload;
- (void)nncFormFieldSelected:(NSDictionary *)payload;
- (void)nncFormFieldDeselected:(NSDictionary *)payload;
- (void)nncAnalytics:(NSDictionary *)payload;
- (void)nncBookmarksChanged:(NSDictionary *)payload;
@end

@interface NutrientNotificationCenterBridge : NSObject

+ (void)setDelegate:(id<NutrientNotificationCenterDelegate>)delegate;
+ (void)clearDelegate;

@end

NS_ASSUME_NONNULL_END
