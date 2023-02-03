/*
 * ConversionHelpers.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.helper;

import androidx.annotation.Nullable;

import com.pspdfkit.annotations.AnnotationType;

import java.util.EnumSet;

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
}
