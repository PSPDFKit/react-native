/*
 * PSPDFKitPackage.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.Uri;
import android.webkit.URLUtil;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.pspdfkit.document.html.HtmlToPdfConverter;
import com.pspdfkit.document.processor.NewPage;
import com.pspdfkit.document.processor.PagePattern;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.react.helper.RNConfigurationHelper;
import com.pspdfkit.react.helper.RNFileHelper;
import com.pspdfkit.react.helper.SdkAsync;
import com.pspdfkit.utils.Size;

import java.io.File;
import java.util.ArrayList;
import java.util.Objects;

public class RNProcessor extends ReactContextBaseJavaModule {
    public RNProcessor(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNProcessor";
    }

    @ReactMethod
    public void getTemporaryDirectory(Promise callback) {
        try {
            WritableMap result = Arguments.createMap();
            result.putString("tempDir", getReactApplicationContext().getCacheDir().getAbsolutePath());
            callback.resolve(result);
        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generateBlankPDF(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("E_MISSING_FOLDER", "Cannot create documents folder");
                return;
            }

            double width = configuration.getDouble("width");
            double height = configuration.getDouble("height");


            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.getAbsolutePath());

            final PdfProcessorTask task = PdfProcessorTask.newPage(NewPage.patternPage(new Size((float) width, (float) height), PagePattern.BLANK).build());

            SdkAsync.processDocument(task, outputFile, resolveOnCompletion(callback, result));
        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generatePDFFromHtmlString(@NonNull ReadableMap configuration, String htmlString, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            WritableMap result = Arguments.createMap();
            assert outputFile != null;
            result.putString("fileURL", outputFile.toURI().toString());

            HtmlToPdfConverter converter = HtmlToPdfConverter.fromHTMLString(getReactApplicationContext(), htmlString, null)
                    .title("Converted document");
            SdkAsync.convertToPdf(converter, outputFile, resolveOnCompletion(callback, result));

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @ReactMethod
    public void generatePDFFromHtmlURL(@NonNull ReadableMap configuration, String originUri, Promise callback) {
        try {
            if (!URLUtil.isValidUrl(originUri)) {
                callback.reject("E_NEW_INVALID_URL", "Please provide valid URL.");
                return;
            }

            Uri originURL = Uri.parse(originUri);
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("E_NEW_INVALID_FILE_PATH", "Please provide valid file path.");
                return;
            }

            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);

            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.getAbsolutePath());

            final HtmlToPdfConverter converter = HtmlToPdfConverter.fromUri(getReactApplicationContext(), originURL);
            boolean isJavascriptEnabled = !configuration.hasKey("enableJavascript") || configuration.getBoolean("enableJavaScript");
            converter.setJavaScriptEnabled(isJavascriptEnabled);

            SdkAsync.convertToPdf(converter, outputFile, resolveOnCompletion(callback, result));

        } catch (
                Exception e) {
            callback.reject(e);
        }

    }

    @ReactMethod
    public void generatePDFFromTemplate(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("ERROR_NEW_INVALID_FILE_PATH", "Please provide valid file path.");
                return;
            }

            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.toURI().toString());
            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);

            RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, getReactApplicationContext());

            ReadableArray templates = configuration.getArray("templates");

            if (templates != null) {
                PdfProcessorTask pdfProcessorTask = PdfProcessorTask.empty();

                for (int i = 0; i < templates.size(); i++) {
                    configHelper.configuration = templates.getMap(i);
                    pdfProcessorTask.addNewPage(configHelper.parseConfiguration(), i);
                }
                SdkAsync.processDocument(pdfProcessorTask, outputFile, resolveOnCompletion(callback, result));
                return;
            }

            callback.reject("ERROR_NEW_INVALID_CONFIGURATION", "Please provide valid configuration object.");
        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generatePDFFromImages(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            WritableMap result = Arguments.createMap();
            assert outputFile != null;

            result.putString("fileURL", outputFile.toURI().toString());
            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);

            final PdfProcessorTask pdfProcessorTask = PdfProcessorTask.empty();

            @Nullable ReadableArray images = configuration.getArray("images");

            if (images == null) {
                callback.reject("ERROR_MISSING_IMAGES", "Please provide array of image objects.");
                return;
            }

            for (int i = 0; i < images.size(); i++) {
                RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, getReactApplicationContext());
                NewPage newPage = configHelper.parseConfiguration("image", configuration.getArray("images").getMap(i)).get(0);
                if (newPage != null) {
                    pdfProcessorTask.addNewPage(newPage, i);
                }
            }

            SdkAsync.processDocument(pdfProcessorTask, outputFile, resolveOnCompletion(callback, result));

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generatePDFFromDocuments(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getReactApplicationContext(), configuration, callback);

            WritableMap result = Arguments.createMap();
            assert outputFile != null;

            result.putString("fileURL", outputFile.toURI().toString());
            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);

            final PdfProcessorTask pdfProcessorTask = PdfProcessorTask.empty();

            @Nullable ReadableArray documents = configuration.getArray("documents");

            if (documents == null) {
                callback.reject("ERROR_MISSING_DOCUMENTS", "Please provide array of document objects.");
                return;
            }

            int totalPageCount = 0;
            for (int i = 0; i < documents.size(); i++) {
                RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, getReactApplicationContext());
                ArrayList<NewPage> newPages = configHelper.parseConfiguration("document", documents.getMap(i));
                for (int j = 0; j < newPages.size(); j++) {
                    pdfProcessorTask.addNewPage(newPages.get(j), totalPageCount);
                    totalPageCount++;
                }
            }

            SdkAsync.processDocument(pdfProcessorTask, outputFile, resolveOnCompletion(callback, result));

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    /** Resolves {@code callback} with {@code result} when the work completes, or rejects it with the failure. */
    private static SdkAsync.Completion resolveOnCompletion(@NonNull Promise callback, @NonNull WritableMap result) {
        return new SdkAsync.Completion() {
            @Override
            public void onComplete() {
                callback.resolve(result);
            }

            @Override
            public void onError(@NonNull Throwable error) {
                callback.reject(error);
            }
        };
    }
}