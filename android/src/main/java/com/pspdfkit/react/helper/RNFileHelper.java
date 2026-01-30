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

package com.pspdfkit.react.helper;

import android.content.Context;
import android.os.Environment;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import java.io.File;
import java.util.Locale;

public class RNFileHelper {
    static public @Nullable
    File getFilePath(Context context, @NonNull ReadableMap configuration, Promise callback) {
        @Nullable String filePath = configuration.getString("filePath");
        if (filePath != null) {
            if (!hasPdfExtension(filePath)) {
                filePath += ".pdf";
            }
            return new File(filePath);
        }

        @Nullable String name = configuration.getString("name");
        if (name == null) {
            callback.reject("E_NEW_MISSING_NAME", "Pls provide name for document");
            return null;
        }

        boolean folderExists = true;

        File folder = new File(context.getFilesDir() +
                File.separator);
        if (!folder.exists()) {
            folderExists = folder.mkdir();
        }

        if (!folderExists) {
            callback.reject("E_MISSING_FOLDER", "Cannot create documents folder");
            return null;
        }
        filePath = folder.getAbsolutePath() + System.getProperty("file.separator") + name;
        if (!hasPdfExtension(filePath)) {
            filePath += ".pdf";
        }
        return new File(filePath);
    }

    static public String getTemporaryDirectory(Context context) {
        File tempFolder = new File(context.getFilesDir() + File.separator);
        if (!tempFolder.exists()) {
            //noinspection ResultOfMethodCallIgnored
            tempFolder.mkdir();
        }
        return tempFolder.getAbsolutePath();
    }

    public static void deleteExistingFileIfNeeded(File outputFile, @NonNull ReadableMap configuration, Promise callback) {
        boolean shouldOverride = configuration.getBoolean("override");
        if (outputFile.exists() && !shouldOverride) {
            callback.reject("E_FILE_EXISTS", "File with the same name already exists");
        }
    }

    public static Boolean hasPdfExtension(String filePath) {
        return filePath.substring(filePath.length() - 4).toLowerCase(Locale.ROOT).equals(".pdf");
    }
}
