package com.pspdfkit.views;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.ui.PdfUiFragment;

/** This {@link PdfUiFragment} reports when the {@link PdfActivityConfiguration} was changed. */
public class ConfigurationChangeReportingPdfUiFragment extends PdfUiFragment {

    @Nullable private OnConfigurationChangedListener onConfigurationChangedListener;

    public void setOnConfigurationChangedListener(@Nullable OnConfigurationChangedListener listener) {
        this.onConfigurationChangedListener = listener;
    }

    @Override
    public void performApplyConfiguration(@NonNull PdfActivityConfiguration configuration) {
        super.performApplyConfiguration(configuration);

        if (this.onConfigurationChangedListener != null) {
            onConfigurationChangedListener.onConfigurationChanged();
        }
    }

    /** Listener that is notified when the user changes the configuration (scroll direction etc.) via the UI. */
    public interface OnConfigurationChangedListener {

        /** Called when the configuration changed, reset your {@link com.pspdfkit.ui.PdfFragment} listeners in here. */
        void onConfigurationChanged();
    }
}
