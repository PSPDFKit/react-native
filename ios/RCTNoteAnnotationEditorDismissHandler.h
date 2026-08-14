//
//  Copyright © 2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <PSPDFKitUI/PSPDFKitUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Adds save-and-dismiss behavior to a comment (note annotation) editor when the
/// `iOSNoteEditorDismissesOnSave` configuration option is enabled.
///
/// It interposes itself as the editor's delegate (forwarding every callback to the original
/// delegate) and dismisses the editor once the edited note's comment text is saved — so
/// tapping Done both saves and closes. The handler is kept alive for the editor's lifetime
/// via an associated object, so callers don't need to retain it.
@interface RCTNoteAnnotationEditorDismissHandler : NSObject <PSPDFNoteAnnotationViewControllerDelegate>

/// Installs the behavior on the given note editor. Safe to call more than once for the same
/// editor; subsequent calls are ignored.
+ (void)installOnNoteController:(PSPDFNoteAnnotationViewController *)noteController;

@end

NS_ASSUME_NONNULL_END
