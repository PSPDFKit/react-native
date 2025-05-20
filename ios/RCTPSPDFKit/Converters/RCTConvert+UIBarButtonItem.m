//
//  Copyright © 2019-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTConvert+UIBarButtonItem.h"

@implementation RCTConvert (UIBarButtonItem)

+ (NSString *)stringBarButtonItemFrom:(UIBarButtonItem *)barButtonItem forViewController:(PSPDFViewController *)pdfController {
  if (barButtonItem == pdfController.closeButtonItem) {
    return @"closeButtonItem";
  } else if (barButtonItem == pdfController.outlineButtonItem) {
    return @"outlineButtonItem";
  } else if (barButtonItem == pdfController.searchButtonItem) {
    return @"searchButtonItem";
  } else if (barButtonItem == pdfController.thumbnailsButtonItem) {
    return @"thumbnailsButtonItem";
  } else if (barButtonItem == pdfController.documentEditorButtonItem) {
    return @"documentEditorButtonItem";
  } else if (barButtonItem == pdfController.printButtonItem) {
    return @"printButtonItem";
  } else if (barButtonItem == pdfController.openInButtonItem) {
    return @"openInButtonItem";
  } else if (barButtonItem == pdfController.emailButtonItem) {
    return @"emailButtonItem";
  } else if (barButtonItem == pdfController.messageButtonItem) {
    return @"messageButtonItem";
  } else if (barButtonItem == pdfController.annotationButtonItem) {
    return @"annotationButtonItem";
  } else if (barButtonItem == pdfController.bookmarkButtonItem) {
    return @"bookmarkButtonItem";
  } else if (barButtonItem == pdfController.brightnessButtonItem) {
    return @"brightnessButtonItem";
  } else if (barButtonItem == pdfController.activityButtonItem) {
    return @"activityButtonItem";
  } else if (barButtonItem == pdfController.settingsButtonItem) {
    return @"settingsButtonItem";
  } else if (barButtonItem == pdfController.readerViewButtonItem) {
    return @"readerViewButtonItem";
  } else if (barButtonItem == pdfController.aiAssistantButtonItem) {
    return @"aiAssistantButtonItem";
  } else {
    return nil;
  }
}

+ (UIBarButtonItem *)uiBarButtonItemFrom:(NSString *)barButtonItem forViewController:(PSPDFViewController *)pdfController {
  if ([barButtonItem isEqualToString:@"closeButtonItem"]) {
    return pdfController.closeButtonItem;
  } else if ([barButtonItem isEqualToString:@"outlineButtonItem"]) {
    return pdfController.outlineButtonItem;
  } else if ([barButtonItem isEqualToString:@"searchButtonItem"]) {
    return pdfController.searchButtonItem;
  } else if ([barButtonItem isEqualToString:@"thumbnailsButtonItem"]) {
    return pdfController.thumbnailsButtonItem;
  } else if ([barButtonItem isEqualToString:@"documentEditorButtonItem"]) {
    return pdfController.documentEditorButtonItem;
  } else if ([barButtonItem isEqualToString:@"printButtonItem"]) {
    return pdfController.printButtonItem;
  } else if ([barButtonItem isEqualToString:@"openInButtonItem"]) {
    return pdfController.openInButtonItem;
  } else if ([barButtonItem isEqualToString:@"emailButtonItem"]) {
    return pdfController.emailButtonItem;
  } else if ([barButtonItem isEqualToString:@"messageButtonItem"]) {
    return pdfController.messageButtonItem;
  } else if ([barButtonItem isEqualToString:@"annotationButtonItem"]) {
    return pdfController.annotationButtonItem;
  } else if ([barButtonItem isEqualToString:@"bookmarkButtonItem"]) {
    return pdfController.bookmarkButtonItem;
  } else if ([barButtonItem isEqualToString:@"brightnessButtonItem"]) {
    return pdfController.brightnessButtonItem;
  } else if ([barButtonItem isEqualToString:@"activityButtonItem"]) {
    return pdfController.activityButtonItem;
  } else if ([barButtonItem isEqualToString:@"settingsButtonItem"]) {
    return pdfController.settingsButtonItem;
  } else if ([barButtonItem isEqualToString:@"readerViewButtonItem"]) {
    return pdfController.readerViewButtonItem;
  } else if ([barButtonItem isEqualToString:@"aiAssistantButtonItem"]) {
    return pdfController.aiAssistantButtonItem;
  } else {
    return nil;
  }
}

@end
