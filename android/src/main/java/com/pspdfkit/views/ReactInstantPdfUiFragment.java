/*
 * ReactInstantPdfUiFragment.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views;

import android.os.Bundle;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentManager;

import com.pspdfkit.instant.ui.InstantPdfUiFragment;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfUiFragment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Instant version of {@link ReactPdfUiFragment}.
 *
 * Provides the same react-native integration hooks (toolbar button customization + navigation button
 * callback wiring) but is backed by Instant's {@link InstantPdfUiFragment}.
 */
public class ReactInstantPdfUiFragment extends InstantPdfUiFragment {

    // Static map to store configurations
    private static final Map<String, ToolbarConfig> configMap = new HashMap<>();

    // Inner class to hold all three properties together
    private static class ToolbarConfig {
        final ArrayList<String> stockToolbarItems;
        final ArrayList<HashMap> customToolbarItems;
        final MenuItemListener menuItemListener;

        ToolbarConfig(ArrayList<String> stockToolbarItems,
                      ArrayList<HashMap> customToolbarItems,
                      MenuItemListener menuItemListener) {
            this.stockToolbarItems = new ArrayList<>(stockToolbarItems);
            this.customToolbarItems = new ArrayList<>(customToolbarItems);
            this.menuItemListener = menuItemListener;
        }
    }

    private ArrayList<String> stockToolbarItems = new ArrayList<>();
    private ArrayList<HashMap> customToolbarItems = new ArrayList<>();
    private MenuItemListener menuItemListener;
    private final ReactToolbarItems.IconCache toolbarIconCache = new ReactToolbarItems.IconCache();

    @Nullable private ReactPdfUiFragmentListener reactPdfUiFragmentListener;

    @Nullable private int configSaveId;

    private final FragmentManager.FragmentLifecycleCallbacks fragmentLifecycleCallbacks =
            new FragmentManager.FragmentLifecycleCallbacks() {
                @Override
                public void onFragmentCreated(@NonNull androidx.fragment.app.FragmentManager fm,
                                               @NonNull androidx.fragment.app.Fragment f,
                                               @Nullable Bundle savedInstanceState) {
                    super.onFragmentCreated(fm, f, savedInstanceState);
                    // Whenever a new PdfFragment is created that means the configuration has changed.
                    if (f instanceof PdfFragment) {
                        if (reactPdfUiFragmentListener != null) {
                            reactPdfUiFragmentListener.onConfigurationChanged(ReactInstantPdfUiFragment.this);
                        }
                    }
                }
            };

    void setReactPdfUiFragmentListener(@Nullable ReactPdfUiFragmentListener listener) {
        this.reactPdfUiFragmentListener = listener;
    }

    /** When set to true will add a navigation arrow to the toolbar. */
    void setShowNavigationButtonInToolbar(final boolean showNavigationButtonInToolbar) {
        MainToolbarSupport.setNavigationButtonShown(this, showNavigationButtonInToolbar, () -> {
            if (reactPdfUiFragmentListener != null) {
                reactPdfUiFragmentListener.onNavigationButtonClicked(ReactInstantPdfUiFragment.this);
            }
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        // We want to get notified when a child PdfFragment is created so we can reattach our listeners.
        getChildFragmentManager().registerFragmentLifecycleCallbacks(fragmentLifecycleCallbacks, false);
    }

    @Override
    public void onStop() {
        super.onStop();
        getChildFragmentManager().unregisterFragmentLifecycleCallbacks(fragmentLifecycleCallbacks);
    }

    /**
     * Listener that notifies of actions taken directly in the PdfUiFragment.
     */
    public interface ReactPdfUiFragmentListener {
        /** Called when the configuration changed. */
        void onConfigurationChanged(@NonNull PdfUiFragment pdfUiFragment);

        /** Called when the back navigation button was clicked. */
        void onNavigationButtonClicked(@NonNull PdfUiFragment pdfUiFragment);
    }

    void setCustomToolbarItems(
            @NonNull ArrayList<String> stockToolbarItems,
            @NonNull ArrayList<HashMap> customToolbarItems,
            MenuItemListener listener
    ) {
        this.stockToolbarItems = stockToolbarItems;
        this.customToolbarItems = customToolbarItems;
        this.menuItemListener = listener;

        int fragmentId = this.configSaveId;
        if (fragmentId != View.NO_ID) {
            configMap.put(
                    String.valueOf(fragmentId),
                    new ToolbarConfig(stockToolbarItems, customToolbarItems, listener)
            );
        }

        // Re-run the provider so a later prop update reaches an already-built toolbar.
        if (getView() != null) {
            invalidateToolbarItems();
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.configSaveId = getId();

        int viewId = getId();
        if (viewId != View.NO_ID) {
            ToolbarConfig config = configMap.get(String.valueOf(viewId));
            if (config != null) {
                this.stockToolbarItems = new ArrayList<>(config.stockToolbarItems);
                this.customToolbarItems = new ArrayList<>(config.customToolbarItems);
                this.menuItemListener = config.menuItemListener;
            }
        }
    }

    /**
     * Publishes the configured toolbar items and routes taps on the custom ones.
     *
     * Replaces {@code onGenerateMenuItemIds} plus the {@code onCreate/onPrepareOptionsMenu}
     * pair: the Compose toolbars take a declarative provider that is re-run on every rebuild, so
     * the items no longer have to be re-applied to a {@code Menu} from a posted runnable.
     *
     * Registered once here and reading the current fields on each call, so
     * {@link #setCustomToolbarItems} never leaves a stale item list or click mapping behind.
     */
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        setToolbarItemsProvider(defaultItems ->
                ReactToolbarItems.buildItems(requireContext(), defaultItems, stockToolbarItems, customToolbarItems, toolbarIconCache));
        setOnToolbarItemClickListener(itemId ->
                ReactToolbarItems.onItemClick(requireContext(), itemId, customToolbarItems, menuItemListener));
    }
}
