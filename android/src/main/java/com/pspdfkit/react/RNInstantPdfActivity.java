package com.pspdfkit.react;

///  Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
///
///  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
///  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
///  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
///  This notice may not be removed from this file.
///

import android.util.Log;

import androidx.annotation.NonNull;

import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.instant.document.InstantPdfDocument;
import com.pspdfkit.instant.exceptions.InstantException;
import com.pspdfkit.instant.ui.InstantPdfActivity;

public class RNInstantPdfActivity extends InstantPdfActivity {

    @Override
    public void onDocumentLoaded(@NonNull PdfDocument document) {
        super.onDocumentLoaded(document);
    }

    @Override
    public void onSyncError(@NonNull InstantPdfDocument instantDocument, @NonNull InstantException error) {
        super.onSyncError(instantDocument, error);
    }

    @Override
    public void onSyncFinished(@NonNull InstantPdfDocument instantDocument) {
        super.onSyncFinished(instantDocument);
        Log.d("RNInstant::::::", "onSyncFinished: ");
    }

    @Override
    public void onSyncStarted(@NonNull InstantPdfDocument instantDocument) {
        super.onSyncStarted(instantDocument);
        Log.d("RNInstant::::::", "onSyncStarted: ");
    }
}
