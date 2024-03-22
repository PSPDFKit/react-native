/*
 * PSPDFKitPackage.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2024 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.helper;

import static com.pspdfkit.document.processor.NewPage.PAGE_SIZE_A4;

import android.content.Context;
import android.graphics.Color;
import android.graphics.RectF;
import android.net.Uri;

import androidx.annotation.ColorInt;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.document.PdfDocumentLoader;
import com.pspdfkit.document.processor.NewPage;
import com.pspdfkit.document.processor.PageImage;
import com.pspdfkit.document.processor.PagePattern;
import com.pspdfkit.document.processor.PagePosition;
import com.pspdfkit.utils.Size;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class RNConfigurationHelper {
    public ReadableMap configuration = null;
    private final Context context;

    public RNConfigurationHelper(Context context) {
        this.context = context;
    }

    public RNConfigurationHelper(ReadableMap configurationDictionary, Context context) {
        configuration = configurationDictionary;
        this.context = context;
    }

    public NewPage parseConfiguration(final String type, ReadableMap configuration) {
        NewPage.Builder pageBuilder;
        this.configuration = configuration;

        switch (type) {
            case "template":
                pageBuilder = newPageFromTemplate(configuration);
                break;
            case "image":
                pageBuilder = newPageFromImage(configuration);
                break;
            case "document":
                pageBuilder = newPageFromDocument(configuration);
                break;
            default:
                return null;
        }

        pageBuilder.rotation(parseRotation());
        pageBuilder.withMargins(parseMargins());
        pageBuilder.backgroundColor(parseBackgroundColor());
        return pageBuilder.build();
    }

    private NewPage.Builder newPageFromDocument(ReadableMap configuration) {
        String documentPath = configuration.getString("documentPath");
        int pageIndex = configuration.getInt("pageIndex");

        try {
            PdfDocument sourceDocument = PdfDocumentLoader.openDocument(context, Uri.parse(documentPath));
            assert (pageIndex >= 0 && pageIndex <= sourceDocument.getPageCount()-1);
            return NewPage.fromPage(sourceDocument, pageIndex);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public NewPage parseConfiguration() {

        NewPage.Builder pageBuilder = newPageFromTemplate(configuration);
        pageBuilder.rotation(parseRotation());
        pageBuilder.withMargins(parseMargins());
        pageBuilder.backgroundColor(parseBackgroundColor());

        return pageBuilder.build();
    }

    private NewPage.Builder newPageFromImage(ReadableMap configuration) {
        this.configuration = configuration;
        String imagePath = configuration.getString("imageUri");
        Size size = parseSize();
        PagePosition position = parsePosition(configuration);
        PageImage pageImage = new PageImage(this.context, Uri.parse(imagePath), position);
        pageImage.setJpegQuality(80);
        return NewPage.emptyPage(size).withPageItem(pageImage);
    }

    private PagePosition parsePosition(ReadableMap configuration) {
        String position = configuration.getString("position");
        if (position == null) {
            return PagePosition.CENTER;
        }
        switch (position) {
            case "top":
                return PagePosition.TOP;
            case "bottom":
                return PagePosition.BOTTOM;
            case "left":
                return PagePosition.LEFT;
            case "right":
                return PagePosition.RIGHT;
            case "topLeft":
                return PagePosition.TOP_LEFT;
            case "topRight":
                return PagePosition.TOP_RIGHT;
            case "bottomLeft":
                return PagePosition.BOTTOM_LEFT;
            case "bottomRight":
                return PagePosition.BOTTOM_RIGHT;
            default:
                return PagePosition.CENTER;
        }
    }

    public Size parseSize() {
        Size defaultSize = PAGE_SIZE_A4;

        if (configuration.hasKey("pageSize")) {
            @Nullable ReadableMap size = configuration.getMap("pageSize");
            double width = size.getDouble("width");
            double height = size.getDouble("height");

            if (width == 0) {
                width = defaultSize.width;
            }
            if (height == 0) {
                height = defaultSize.height;
            }

            return new Size((float) width, (float) height);
        }

        if (!configuration.hasKey("width") && !configuration.hasKey("height")) {
            return new Size((float) defaultSize.width, (float) defaultSize.height);
        }

        double width = configuration.hasKey("width") ? configuration.getDouble("width") : defaultSize.width;
        double height = configuration.hasKey("height") ? configuration.getDouble("height") : defaultSize.height;

        return new Size((float) width, (float) height);
    }

    private NewPage.Builder newPageFromTemplate(ReadableMap configuration) {
        NewPage.Builder page;
        String[] templates = {"dot5mm", "grid5mm", "lines5mm", "lines7mm"};
        PagePattern[] availablePatterns = {PagePattern.DOTS_5MM, PagePattern.GRID_5MM, PagePattern.LINES_5MM, PagePattern.LINES_7MM};

        @Nullable String template = this.configuration.getString("template");

        if (template != null) {
            PagePattern pattern = PagePattern.BLANK;
            if (Arrays.asList(templates).contains(template)) {
                int index = Arrays.asList(templates).indexOf(template);
                pattern = availablePatterns[index];
                return NewPage.patternPage(parseSize(), pattern);
            }
        }
        return NewPage.emptyPage(parseSize());
    }

    private RectF parseMargins() {
        RectF edgeInsets = new RectF();
        ReadableMap margins = configuration.getMap("margins");
        if (margins == null) {
            return new RectF(30, 15, 30, 15);
        }

        double top = margins.getDouble("top");
        double right = margins.getDouble("right");
        double bottom = margins.getDouble("bottom");
        double left = margins.getDouble("left");

        edgeInsets.top = (float) top;
        edgeInsets.right = (float) right;
        edgeInsets.bottom = (float) bottom;
        edgeInsets.left = (float) left;

        return edgeInsets;
    }

    private int parseRotation() {
        if (!configuration.hasKey("rotation")) {
            return 0;
        }
        int rawRotation = configuration.getInt("rotation");
        List<Integer> availableRotations = Arrays.asList(0, 90, 180, 270);

        if (rawRotation > 0 && availableRotations.contains(rawRotation)) {
            return rawRotation;
        }

        return 0;
    }

    @ColorInt
    private int parseBackgroundColor() {
        @Nullable String color = configuration.getString("backgroundColor");
        if (color == null) {
            return Color.parseColor("#FFFFFF");
        }

        if (color.contains("#")) {
            return Color.parseColor(color);
        }

        if (color.contains("rgb")) {
            return ColorHelper.rgb(color);
        }

        return Color.parseColor("#FFFFFF");
    }
}
