/*
 * PSPDFKitPackage.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2025 PSPDFKit GmbH. All rights reserved.
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
import com.pspdfkit.document.processor.PdfProcessor;
import com.pspdfkit.document.processor.PdfProcessorTask;
import com.pspdfkit.react.helper.RNConfigurationHelper;
import com.pspdfkit.react.helper.RNFileHelper;
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
            Context context = Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();
            WritableMap result = Arguments.createMap();
            result.putString("tempDir", context.getCacheDir().getAbsolutePath());
            callback.resolve(result);
        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generateBlankPDF(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("E_MISSING_FOLDER", "Cannot create documents folder");
                return;
            }

            double width = configuration.getDouble("width");
            double height = configuration.getDouble("height");


            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.getAbsolutePath());

            final PdfProcessorTask task = PdfProcessorTask.newPage(NewPage.patternPage(new Size((float) width, (float) height), PagePattern.BLANK).build());

            PdfProcessor.processDocumentAsync(task, outputFile)
                    .doFinally(() -> callback.resolve(result))
                    .doOnError(callback::reject)
                    .subscribe();
        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void generatePDFFromHtmlString(@NonNull ReadableMap configuration, String htmlString, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);

            WritableMap result = Arguments.createMap();
            assert outputFile != null;
            result.putString("fileURL", outputFile.toURI().toString());

            HtmlToPdfConverter.fromHTMLString(getContext(), htmlString)
                    .title("Converted document")
                    .convertToPdfAsync(outputFile)
                    .doFinally(() -> callback.resolve(result))
                    .doOnError((error) -> callback.reject(error))
                    .subscribe();

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @SuppressLint({"CheckResult", "SetJavaScriptEnabled"})
    @ReactMethod
    public void generatePDFFromHtmlURL(@NonNull ReadableMap configuration, String originUri, Promise callback) {
        try {
            if (!URLUtil.isValidUrl(originUri)) {
                callback.reject("E_NEW_INVALID_URL", "Please provide valid URL.");
                return;
            }

            Uri originURL = Uri.parse(originUri);
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("E_NEW_INVALID_FILE_PATH", "Please provide valid file path.");
                return;
            }

            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);

            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.getAbsolutePath());

            Context context = Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();

            final HtmlToPdfConverter converter = HtmlToPdfConverter.fromUri(context, originURL);
            boolean isJavascriptEnabled = !configuration.hasKey("enableJavascript") || configuration.getBoolean("enableJavaScript");
            converter.setJavaScriptEnabled(isJavascriptEnabled);

            converter.convertToPdfAsync(outputFile)
                    .doFinally(() -> callback.resolve(result))
                    .doOnError((error) -> callback.reject(error))
                    .subscribe(() -> {
                        callback.resolve(result);
                    }, throwable -> {
                        callback.reject(throwable);
                    });

        } catch (
                Exception e) {
            callback.reject(e);
        }

    }

    @SuppressLint("CheckResult")
    @ReactMethod
    public void generatePDFFromTemplate(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);

            if (outputFile == null) {
                callback.reject("ERROR_NEW_INVALID_FILE_PATH", "Please provide valid file path.");
                return;
            }

            WritableMap result = Arguments.createMap();
            result.putString("fileURL", outputFile.toURI().toString());
            RNFileHelper.deleteExistingFileIfNeeded(outputFile, configuration, callback);
            Context context = Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();

            RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, context);

            ReadableArray templates = configuration.getArray("templates");

            if (templates != null) {
                PdfProcessorTask pdfProcessorTask = PdfProcessorTask.empty();

                for (int i = 0; i < templates.size(); i++) {
                    configHelper.configuration = templates.getMap(i);
                    pdfProcessorTask.addNewPage(configHelper.parseConfiguration(), i);
                }
                PdfProcessor.processDocumentAsync(pdfProcessorTask, outputFile)
                        .doFinally(() -> callback.resolve(result))
                        .doOnError((error) -> callback.reject(error))
                        .subscribe();
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
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);
            Context context = Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();

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
                RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, context);
                NewPage newPage = configHelper.parseConfiguration("image", configuration.getArray("images").getMap(i)).get(0);
                if (newPage != null) {
                    pdfProcessorTask.addNewPage(newPage, i);
                }
            }

            PdfProcessor.processDocumentAsync(pdfProcessorTask, outputFile)
                    .doOnError((error) -> callback.reject(error))
                    .doFinally(() -> callback.resolve(result))
                    .subscribe();

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    @ReactMethod
    public void generatePDFFromDocuments(@NonNull ReadableMap configuration, Promise callback) {
        try {
            File outputFile = RNFileHelper.getFilePath(getContext(), configuration, callback);
            Context context = Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();

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
                RNConfigurationHelper configHelper = new RNConfigurationHelper(configuration, context);
                ArrayList<NewPage> newPages = configHelper.parseConfiguration("document", documents.getMap(i));
                for (int j = 0; j < newPages.size(); j++) {
                    pdfProcessorTask.addNewPage(newPages.get(j), totalPageCount);
                    totalPageCount++;
                }
            }

            PdfProcessor.processDocumentAsync(pdfProcessorTask, outputFile)
                    .doOnError(callback::reject)
                    .doFinally(() -> callback.resolve(result))
                    .subscribe();

        } catch (Exception e) {
            callback.reject(e);
        }
    }

    private Context getContext() {
        return Objects.requireNonNull(getCurrentActivity()).getApplication().getApplicationContext();
    }
}