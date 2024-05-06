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
import java.util.List;

public class ConversionHelpers {

    public static EnumSet<AnnotationType> getAnnotationTypeFromString(@Nullable final String type) {
        if (type == null || "all".equalsIgnoreCase(type)) {
            return EnumSet.allOf(AnnotationType.class);
        }

        switch (type.toLowerCase()) {
            case "pspdfkit/link":
                return EnumSet.of(AnnotationType.LINK);
            case "pspdfkit/ink":
                return EnumSet.of(AnnotationType.INK);
            case "pspdfkit/markup/highlight":
                return EnumSet.of(AnnotationType.HIGHLIGHT);
            case "pspdfkit/image":
            case "pspdfkit/stamp":
                return EnumSet.of(AnnotationType.STAMP);
            case "pspdfkit/markup/squiggly":
                return EnumSet.of(AnnotationType.SQUIGGLY);
            case "pspdfkit/markup/strikeout":
                return EnumSet.of(AnnotationType.STRIKEOUT);
            case "pspdfkit/markup/underline":
                return EnumSet.of(AnnotationType.UNDERLINE);
            case "pspdfkit/note":
                return EnumSet.of(AnnotationType.NOTE);
            case "pspdfkit/shape/ellipse":
                return EnumSet.of(AnnotationType.CIRCLE);
            case "pspdfkit/shape/line":
                return EnumSet.of(AnnotationType.LINE);
            case "pspdfkit/shape/polygon":
                return EnumSet.of(AnnotationType.POLYGON);
            case "pspdfkit/shape/polyline":
                return EnumSet.of(AnnotationType.POLYLINE);
            case "pspdfkit/shape/rectangle":
                return EnumSet.of(AnnotationType.SQUARE);
            case "pspdfkit/caret":
                return EnumSet.of(AnnotationType.CARET);
            case "pspdfkit/text":
                return EnumSet.of(AnnotationType.FREETEXT);
            case "pspdfkit/richmedia":
                return EnumSet.of(AnnotationType.RICHMEDIA);
            case "pspdfkit/widget":
                return EnumSet.of(AnnotationType.WIDGET);
            case "pspdfkit/watermark":
                return EnumSet.of(AnnotationType.WATERMARK);
            case "pspdfkit/file":
                return EnumSet.of(AnnotationType.FILE);
            case "pspdfkit/sound":
                return EnumSet.of(AnnotationType.SOUND);
            case "pspdfkit/popup":
                return EnumSet.of(AnnotationType.POPUP);
            case "pspdfkit/trapnet":
                return EnumSet.of(AnnotationType.TRAPNET);
            case "pspdfkit/type3d":
                return EnumSet.of(AnnotationType.TYPE3D);
            case "pspdfkit/redact":
                return EnumSet.of(AnnotationType.REDACT);

            case "all":
            default:
                return EnumSet.allOf(AnnotationType.class);
        }
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
