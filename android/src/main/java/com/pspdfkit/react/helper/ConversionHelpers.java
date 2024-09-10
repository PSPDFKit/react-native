/*
 * ConversionHelpers.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2024 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.helper;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.pspdfkit.annotations.AnnotationFlags;
import com.pspdfkit.annotations.AnnotationType;
import com.pspdfkit.ui.toolbar.ContextualToolbarMenuItem;

import java.util.ArrayList;
import java.util.EnumSet;

public class ConversionHelpers {

    public static EnumSet<AnnotationType> getAnnotationTypes(@Nullable final ReadableArray types) {
        if (types == null) {
            return EnumSet.allOf(AnnotationType.class);
        }

        EnumSet<AnnotationType> convertedTypes = EnumSet.noneOf(AnnotationType.class);

        for (int i = 0; i < types.size(); i++) {
            String type = types.getString(i);
            switch (type.toLowerCase()) {
                case "pspdfkit/link":
                case "link":
                    convertedTypes.add(AnnotationType.LINK);
                    break;
                case "pspdfkit/ink":
                case "ink":
                    convertedTypes.add(AnnotationType.INK);
                    break;
                case "pspdfkit/markup/highlight":
                case "highlight":
                    convertedTypes.add(AnnotationType.HIGHLIGHT);
                    break;
                case "pspdfkit/image":
                case "image":
                case "pspdfkit/stamp":
                case "stamp":
                    convertedTypes.add(AnnotationType.STAMP);
                    break;
                case "pspdfkit/markup/squiggly":
                case "squiggly":
                    convertedTypes.add(AnnotationType.SQUIGGLY);
                    break;
                case "pspdfkit/markup/strikeout":
                case "strikeout":
                    convertedTypes.add(AnnotationType.STRIKEOUT);
                    break;
                case "pspdfkit/markup/underline":
                case "underline":
                    convertedTypes.add(AnnotationType.UNDERLINE);
                    break;
                case "pspdfkit/note":
                case "note":
                    convertedTypes.add(AnnotationType.NOTE);
                    break;
                case "pspdfkit/shape/ellipse":
                case "ellipse":
                    convertedTypes.add(AnnotationType.CIRCLE);
                    break;
                case "pspdfkit/shape/line":
                case "line":
                    convertedTypes.add(AnnotationType.LINE);
                    break;
                case "pspdfkit/shape/polygon":
                case "polygon":
                    convertedTypes.add(AnnotationType.POLYGON);
                    break;
                case "pspdfkit/shape/polyline":
                case "polyline":
                    convertedTypes.add(AnnotationType.POLYLINE);
                    break;
                case "pspdfkit/shape/rectangle":
                case "square":
                    convertedTypes.add(AnnotationType.SQUARE);
                    break;
                case "pspdfkit/caret":
                case "caret":
                    convertedTypes.add(AnnotationType.CARET);
                    break;
                case "pspdfkit/text":
                case "freetext":
                    convertedTypes.add(AnnotationType.FREETEXT);
                    break;
                case "pspdfkit/richmedia":
                case "richmedia":
                    convertedTypes.add(AnnotationType.RICHMEDIA);
                    break;
                case "pspdfkit/widget":
                case "widget":
                    convertedTypes.add(AnnotationType.WIDGET);
                    break;
                case "pspdfkit/watermark":
                case "watermark":
                    convertedTypes.add(AnnotationType.WATERMARK);
                    break;
                case "pspdfkit/file":
                case "file":
                    convertedTypes.add(AnnotationType.FILE);
                    break;
                case "pspdfkit/sound":
                case "sound":
                    convertedTypes.add(AnnotationType.SOUND);
                    break;
                case "pspdfkit/popup":
                case "popup":
                    convertedTypes.add(AnnotationType.POPUP);
                    break;
                case "pspdfkit/trapnet":
                case "trapnet":
                    convertedTypes.add(AnnotationType.TRAPNET);
                    break;
                case "pspdfkit/type3d":
                case "threedimensional":
                    convertedTypes.add(AnnotationType.TYPE3D);
                    break;
                case "pspdfkit/redact":
                case "redaction":
                    convertedTypes.add(AnnotationType.REDACT);
                    break;
                case "all":
                default:
                    return EnumSet.allOf(AnnotationType.class);
            }
        }
        return convertedTypes;
    }

    public static EnumSet<AnnotationFlags> getAnnotationFlags(final ReadableArray flags) {

        EnumSet<AnnotationFlags> convertedFlags = EnumSet.noneOf(AnnotationFlags.class);

        for (int i = 0; i < flags.size(); i++) {
            String flag = flags.getString(i);
            switch (flag) {
                case "hidden":
                    convertedFlags.add(AnnotationFlags.HIDDEN);
                    break;
                case "invisible":
                    convertedFlags.add(AnnotationFlags.INVISIBLE);
                    break;
                case "locked":
                    convertedFlags.add(AnnotationFlags.LOCKED);
                    break;
                case "lockedContents":
                    convertedFlags.add(AnnotationFlags.LOCKEDCONTENTS);
                    break;
                case "print":
                    convertedFlags.add(AnnotationFlags.PRINT);
                    break;
                case "readOnly":
                    convertedFlags.add(AnnotationFlags.READONLY);
                    break;
                case "noView":
                    convertedFlags.add(AnnotationFlags.NOVIEW);
                    break;
                case "noZoom":
                    convertedFlags.add(AnnotationFlags.NOZOOM);
                    break;
                default:
                    break;
            }
        }
        return convertedFlags;
    }

    public static ArrayList<String> convertAnnotationFlags(final EnumSet<AnnotationFlags> flags) {

        ArrayList<String> stringFlags = new ArrayList<String>();

        if (flags.contains(AnnotationFlags.HIDDEN)) {
            stringFlags.add("hidden");
        }
        if (flags.contains(AnnotationFlags.INVISIBLE)) {
            stringFlags.add("invisible");
        }
        if (flags.contains(AnnotationFlags.LOCKED)) {
            stringFlags.add("locked");
        }
        if (flags.contains(AnnotationFlags.LOCKEDCONTENTS)) {
            stringFlags.add("lockedContents");
        }
        if (flags.contains(AnnotationFlags.PRINT)) {
            stringFlags.add("print");
        }
        if (flags.contains(AnnotationFlags.READONLY)) {
            stringFlags.add("readOnly");
        }
        if (flags.contains(AnnotationFlags.NOVIEW)) {
            stringFlags.add("noView");
        }
        if (flags.contains(AnnotationFlags.NOZOOM)) {
            stringFlags.add("noZoom");
        }

        return stringFlags;
    }

    public static ContextualToolbarMenuItem.Position getContextualToolbarMenuItemPosition(final String position) {
        switch (position.toLowerCase()) {
            case "start":
                return ContextualToolbarMenuItem.Position.START;
            case "end":
                return ContextualToolbarMenuItem.Position.END;
            default:
                return ContextualToolbarMenuItem.Position.END;
        }
    }
}
