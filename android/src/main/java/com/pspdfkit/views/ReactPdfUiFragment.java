package com.pspdfkit.views;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.react.R;
import com.pspdfkit.ui.PdfUiFragment;

/**
 * This {@link PdfUiFragment} provides additional callbacks to improve integration into react native.
 * <p/>
 * <ul>
 * <li>A callback when the configuration was changed.</li>
 * <li>A method to show and hide the navigation button in the toolbar, as well as a callback for when it is clicked.</li>
 * </ul>
 */
public class ReactPdfUiFragment extends PdfUiFragment {

    @Nullable private ReactPdfUiFragmentListener reactPdfUiFragmentListener;

    void setReactPdfUiFragmentListener(@Nullable ReactPdfUiFragmentListener listener) {
        this.reactPdfUiFragmentListener = listener;
    }

    @Override
    public void performApplyConfiguration(@NonNull PdfActivityConfiguration configuration) {
        super.performApplyConfiguration(configuration);

        if (this.reactPdfUiFragmentListener != null) {
            reactPdfUiFragmentListener.onConfigurationChanged(this);
        }
    }

    /** When set to true will add a navigation arrow to the toolbar. */
    void setShowNavigationButtonInToolbar(final boolean showNavigationButtonInToolbar) {
        if (getView() == null) {
            return;
        }
        Toolbar toolbar = getView().findViewById(R.id.pspdf__toolbar_main);
        if (showNavigationButtonInToolbar) {
            toolbar.setNavigationIcon(R.drawable.pspdf__ic_navigation_arrow);
            toolbar.setNavigationOnClickListener(v -> {
                if (reactPdfUiFragmentListener != null) {
                    reactPdfUiFragmentListener.onNavigationButtonClicked(this);
                }
            });
        } else {
            toolbar.setNavigationIcon(null);
            toolbar.setNavigationOnClickListener(null);
        }
    }

    /**
     * Listener that notifies of actions taken directly in the PdfUiFragment.
     */
    public interface ReactPdfUiFragmentListener {

        /** Called when the configuration changed, reset your {@link com.pspdfkit.ui.PdfFragment} listeners in here. */
        void onConfigurationChanged(@NonNull PdfUiFragment pdfUiFragment);

        /** Called when the back navigation button was clicked. */
        void onNavigationButtonClicked(@NonNull PdfUiFragment pdfUiFragment);
    }
}
