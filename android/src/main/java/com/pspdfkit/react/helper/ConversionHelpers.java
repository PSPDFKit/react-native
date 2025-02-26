/*
 * ConversionHelpers.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2025 PSPDFKit GmbH. All rights reserved.
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
import com.pspdfkit.ui.special_mode.controller.AnnotationTool;
import com.pspdfkit.ui.special_mode.controller.AnnotationToolVariant;

import java.util.ArrayList;
import java.util.EnumSet;

public class ConversionHelpers {

    /**
     * Result class for annotation tool conversion containing the tool and its optional variant.
     */
    public static class AnnotationToolResult {
        private final AnnotationTool annotationTool;
        private final @Nullable AnnotationToolVariant annotationToolVariant;

        public AnnotationToolResult(AnnotationTool annotationTool, @Nullable AnnotationToolVariant annotationToolVariant) {
            this.annotationTool = annotationTool;
            this.annotationToolVariant = annotationToolVariant;
        }

        public AnnotationTool getAnnotationTool() {
            return annotationTool;
        }

        public @Nullable AnnotationToolVariant getAnnotationToolVariant() {
            return annotationToolVariant;
        }
    }

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

    public static AnnotationToolResult convertAnnotationTool(String tool) {
        if (tool == null) {
            return new AnnotationToolResult(AnnotationTool.NONE, null);
        }

        return switch (tool.toLowerCase()) {
            case "highlight" ->
                    new AnnotationToolResult(AnnotationTool.HIGHLIGHT, null);
            case "highlighter" ->
                    new AnnotationToolResult(AnnotationTool.HIGHLIGHT, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.HIGHLIGHTER));
            case "ink", "pen" ->
                    new AnnotationToolResult(AnnotationTool.INK, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.PEN));
            case "magic_ink" ->
                    new AnnotationToolResult(AnnotationTool.INK, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.MAGIC));
            case "text", "freetext" ->
                    new AnnotationToolResult(AnnotationTool.FREETEXT, null);
            case "freetext_callout" ->
                    new AnnotationToolResult(AnnotationTool.FREETEXT, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.CALLOUT));
            case "note" ->
                    new AnnotationToolResult(AnnotationTool.NOTE, null);
            case "line" ->
                    new AnnotationToolResult(AnnotationTool.LINE, null);
            case "arrow" ->
                    new AnnotationToolResult(AnnotationTool.LINE, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.ARROW));
            case "square", "rectangle", "area_square" ->
                    new AnnotationToolResult(AnnotationTool.SQUARE, null);
            case "circle", "ellipse", "area_circle" ->
                    new AnnotationToolResult(AnnotationTool.CIRCLE, null);
            case "polygon", "area_polygon" ->
                    new AnnotationToolResult(AnnotationTool.POLYGON, null);
            case "cloudy_polygon" ->
                    new AnnotationToolResult(AnnotationTool.POLYGON, AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.CLOUDY));
            case "polyline" ->
                    new AnnotationToolResult(AnnotationTool.POLYLINE, null);
            case "strikeout" ->
                    new AnnotationToolResult(AnnotationTool.STRIKEOUT, null);
            case "underline" ->
                    new AnnotationToolResult(AnnotationTool.UNDERLINE, null);
            case "squiggly" ->
                    new AnnotationToolResult(AnnotationTool.SQUIGGLY, null);
            case "redaction"->
                    new AnnotationToolResult(AnnotationTool.REDACTION, null);
            case "stamp" ->
                    new AnnotationToolResult(AnnotationTool.STAMP, null);
            case "signature" ->
                    new AnnotationToolResult(AnnotationTool.SIGNATURE, null);
            case "image" ->
                    new AnnotationToolResult(AnnotationTool.IMAGE, null);
            case "sound" ->
                    new AnnotationToolResult(AnnotationTool.SOUND, null);
            case "distance" ->
                    new AnnotationToolResult(AnnotationTool.MEASUREMENT_DISTANCE, null);
            case "perimeter" ->
                    new AnnotationToolResult(AnnotationTool.MEASUREMENT_PERIMETER, null);
            case "eraser" ->
                    new AnnotationToolResult(AnnotationTool.ERASER, null);
            case "comment-marker" ->
                    new AnnotationToolResult(AnnotationTool.INSTANT_COMMENT_MARKER, null);
            case "selection_tool" ->
                    new AnnotationToolResult(AnnotationTool.ANNOTATION_MULTI_SELECTION, null);
            default -> new AnnotationToolResult(AnnotationTool.NONE, null);
        };
    }
}
