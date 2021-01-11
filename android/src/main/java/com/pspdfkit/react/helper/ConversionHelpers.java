/*
 * ConversionHelpers.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021 PSPDFKit GmbH. All rights reserved.
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
        if ("pspdfkit/ink".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.INK);
        }
        if ("pspdfkit/link".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.LINK);
        }
        if ("pspdfkit/markup/highlight".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.HIGHLIGHT);
        }
        if ("pspdfkit/markup/squiggly".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.SQUIGGLY);
        }
        if ("pspdfkit/markup/strikeout".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.STRIKEOUT);
        }
        if ("pspdfkit/markup/underline".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.UNDERLINE);
        }
        if ("pspdfkit/note".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.NOTE);
        }
        if ("pspdfkit/shape/ellipse".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.CIRCLE);
        }
        if ("pspdfkit/shape/line".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.LINE);
        }
        if ("pspdfkit/shape/polygon".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.POLYGON);
        }
        if ("pspdfkit/shape/polyline".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.POLYLINE);
        }
        if ("pspdfkit/shape/rectangle".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.SQUARE);
        }
        if ("pspdfkit/text".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.FREETEXT);
        }
        if ("pspdfkit/stamp".equalsIgnoreCase(type)) {
            return EnumSet.of(AnnotationType.STAMP);
        }
        return EnumSet.noneOf(AnnotationType.class);
    }
}
