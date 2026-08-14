//
//  Copyright © 2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "RCTNoteAnnotationEditorDismissHandler.h"
#import <objc/runtime.h>

static const void *RCTNoteAnnotationEditorDismissHandlerKey = &RCTNoteAnnotationEditorDismissHandlerKey;

static BOOL RCTNoteContentsAreEqual(NSString *_Nullable lhs, NSString *_Nullable rhs);

@interface RCTNoteAnnotationEditorDismissHandler ()

/// The editor we are observing. Weak: the editor retains us via an associated object.
@property (nonatomic, weak) PSPDFNoteAnnotationViewController *noteController;

/// The delegate the SDK originally assigned (the presenting page view). We forward every
/// callback to it so the standard delete/clear/dismiss behavior keeps working.
@property (nonatomic, weak) id<PSPDFNoteAnnotationViewControllerDelegate> originalDelegate;

/// The comment text last known to be saved. Used to only dismiss when the comment actually
/// changes, so color/icon edits don't close the editor.
@property (nonatomic, copy, nullable) NSString *lastSavedContents;

@end

@implementation RCTNoteAnnotationEditorDismissHandler

+ (void)installOnNoteController:(PSPDFNoteAnnotationViewController *)noteController {
    if (noteController == nil) {
        return;
    }
    // Avoid installing twice for the same editor.
    if (objc_getAssociatedObject(noteController, RCTNoteAnnotationEditorDismissHandlerKey) != nil) {
        return;
    }

    RCTNoteAnnotationEditorDismissHandler *handler = [RCTNoteAnnotationEditorDismissHandler new];
    handler.noteController = noteController;
    handler.originalDelegate = noteController.delegate;
    handler.lastSavedContents = noteController.annotation.contents;
    noteController.delegate = handler;
    // Tie the handler's lifetime to the editor; the editor's `delegate` is weak.
    objc_setAssociatedObject(noteController, RCTNoteAnnotationEditorDismissHandlerKey, handler, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

#pragma mark - PSPDFNoteAnnotationViewControllerDelegate (forwarding)

- (void)noteAnnotationController:(PSPDFNoteAnnotationViewController *)noteController didChangeAnnotation:(PSPDFAnnotation *)annotation {
    if ([self.originalDelegate respondsToSelector:_cmd]) {
        [self.originalDelegate noteAnnotationController:noteController didChangeAnnotation:annotation];
    }
    [self dismissIfCommentSavedForAnnotation:annotation];
}

- (void)noteAnnotationController:(PSPDFNoteAnnotationViewController *)noteController didDeleteAnnotation:(PSPDFAnnotation *)annotation {
    if ([self.originalDelegate respondsToSelector:_cmd]) {
        [self.originalDelegate noteAnnotationController:noteController didDeleteAnnotation:annotation];
    }
}

- (void)noteAnnotationController:(PSPDFNoteAnnotationViewController *)noteController didClearContentsForAnnotation:(PSPDFAnnotation *)annotation {
    if ([self.originalDelegate respondsToSelector:_cmd]) {
        [self.originalDelegate noteAnnotationController:noteController didClearContentsForAnnotation:annotation];
    }
}

- (void)noteAnnotationController:(PSPDFNoteAnnotationViewController *)noteController willDismissWithAnnotation:(PSPDFAnnotation *)annotation {
    if ([self.originalDelegate respondsToSelector:_cmd]) {
        [self.originalDelegate noteAnnotationController:noteController willDismissWithAnnotation:annotation];
    }
}

#pragma mark - Helpers

- (void)dismissIfCommentSavedForAnnotation:(PSPDFAnnotation *)annotation {
    PSPDFNoteAnnotationViewController *noteController = self.noteController;
    if (noteController == nil) {
        return;
    }
    // Only react to the root annotation being edited; ignore reply-thread commits.
    if (annotation != noteController.annotation) {
        return;
    }
    // Only dismiss when the comment text actually changed, so color/icon edits don't close the editor.
    NSString *currentContents = annotation.contents;
    BOOL contentsChanged = !RCTNoteContentsAreEqual(currentContents, self.lastSavedContents);
    self.lastSavedContents = currentContents;
    if (!contentsChanged) {
        return;
    }
    // Defer so the SDK can finish handling the change before we tear down the editor.
    dispatch_async(dispatch_get_main_queue(), ^{
        [noteController dismissViewControllerAnimated:YES completion:nil];
    });
}

static BOOL RCTNoteContentsAreEqual(NSString *_Nullable lhs, NSString *_Nullable rhs) {
    if (lhs == rhs) {
        return YES;
    }
    if (lhs == nil || rhs == nil) {
        return NO;
    }
    return [lhs isEqualToString:rhs];
}

@end
