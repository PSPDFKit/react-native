/*
 * ReactMainToolbar.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2022 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views;

import android.content.Context;
import android.util.AttributeSet;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.pspdfkit.ui.toolbar.MainToolbar;

/** Custom toolbar that allows us to force a visibility. */
public class ReactMainToolbar extends MainToolbar {

    private @Nullable Integer forcedVisibility;

    public ReactMainToolbar(@NonNull Context context) {
        super(context);
    }

    public ReactMainToolbar(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public ReactMainToolbar(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    /**
     * Sets a forced visibility that will override all future calls to {@link #setVisibility(int)}. The visibility will also immediately be applied.
     *
     * @param visibility The visibility to force or {@code null} to not force any specific visibility.
     */
    public void setForcedVisibility(@Nullable final Integer visibility) {
        forcedVisibility = visibility;
        if (forcedVisibility != null) {
            setVisibility(forcedVisibility);
        }
    }

    @Override
    public void setVisibility(int visibility) {
        if (forcedVisibility == null) {
            super.setVisibility(visibility);
        } else {
            super.setVisibility(forcedVisibility);
        }
    }
}
