/*
 * ReactPdfUiFragment.java
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

package com.pspdfkit.views;

import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.pspdfkit.react.R;
import com.pspdfkit.react.helper.PSPDFKitUtils;
import com.pspdfkit.ui.PdfActivity;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfUiFragment;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This {@link PdfUiFragment} provides additional callbacks to improve integration into react native.
 * <p/>
 * <ul>
 * <li>A callback when the configuration was changed.</li>
 * <li>A method to show and hide the navigation button in the toolbar, as well as a callback for when it is clicked.</li>
 * </ul>
 */
public class ReactPdfUiFragment extends PdfUiFragment {

    private static final String TOOLBAR_ITEM_SEARCH = "searchButtonItem";
    private static final String TOOLBAR_ITEM_READER_VIEW = "readerViewButtonItem";
    private static final String TOOLBAR_ITEM_ANNOTATIONS = "annotationButtonItem";
    private static final String TOOLBAR_ITEM_THUMBNAILS = "thumbnailsButtonItem";
    private static final String TOOLBAR_ITEM_SHARE = "shareButtonItem";
    private static final String TOOLBAR_ITEM_SETTINGS = "settingsButtonItem";
    private static final String TOOLBAR_ITEM_OUTLINE = "outlineButtonItem";
    private static final String TOOLBAR_ITEM_DOCUMENT_INFO_VIEW = "documentInfoViewButtonItem";

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
    private ArrayList<String> staticStockToolbarItems = new ArrayList<>(
            Arrays.asList(
                    TOOLBAR_ITEM_SEARCH,
                    TOOLBAR_ITEM_READER_VIEW,
                    TOOLBAR_ITEM_ANNOTATIONS,
                    TOOLBAR_ITEM_THUMBNAILS,
                    TOOLBAR_ITEM_SHARE,
                    TOOLBAR_ITEM_SETTINGS,
                    TOOLBAR_ITEM_OUTLINE,
                    TOOLBAR_ITEM_DOCUMENT_INFO_VIEW));

    @Nullable private ReactPdfUiFragmentListener reactPdfUiFragmentListener;

    @Nullable private int configSaveId;

    private final FragmentManager.FragmentLifecycleCallbacks fragmentLifecycleCallbacks = new FragmentManager.FragmentLifecycleCallbacks() {
        @Override
        public void onFragmentCreated(@NonNull FragmentManager fm, @NonNull Fragment f, @Nullable Bundle savedInstanceState) {
            super.onFragmentCreated(fm, f, savedInstanceState);
            // Whenever a new PdfFragment is created that means the configuration has changed.
            if (f instanceof PdfFragment) {
                if (reactPdfUiFragmentListener != null) {
                    reactPdfUiFragmentListener.onConfigurationChanged(ReactPdfUiFragment.this);
                }
            }
        }
    };

    void setReactPdfUiFragmentListener(@Nullable ReactPdfUiFragmentListener listener) {
        this.reactPdfUiFragmentListener = listener;
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

        /** Called when the configuration changed, reset your {@link com.pspdfkit.ui.PdfFragment} and {@link PdfUiFragment} listeners in here. */
        void onConfigurationChanged(@NonNull PdfUiFragment pdfUiFragment);

        /** Called when the back navigation button was clicked. */
        void onNavigationButtonClicked(@NonNull PdfUiFragment pdfUiFragment);
    }

    void setCustomToolbarItems(@NonNull ArrayList<String> stockToolbarItems, @NonNull ArrayList<HashMap> customToolbarItems, MenuItemListener listener) {
        this.stockToolbarItems = stockToolbarItems;
        this.customToolbarItems = customToolbarItems;
        this.menuItemListener = listener;

        int fragmentId = this.configSaveId;

        if (fragmentId != View.NO_ID) {
            configMap.put(String.valueOf(fragmentId), new ToolbarConfig(stockToolbarItems, customToolbarItems, listener)
            );
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

    @NonNull
    @Override
    public List<Integer> onGenerateMenuItemIds(@NonNull List<Integer> menuItems) {
        // No items should be removed / added
        if (this.stockToolbarItems.isEmpty() && this.customToolbarItems.isEmpty()) {
            return menuItems;
        }

        ArrayList<String> itemsToRemove = new ArrayList<>(this.staticStockToolbarItems);
        itemsToRemove.removeAll(this.stockToolbarItems);

        for (String item : itemsToRemove) {
            switch (item) {
                case TOOLBAR_ITEM_SEARCH:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_SEARCH));
                    break;

                case TOOLBAR_ITEM_READER_VIEW:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_READER_VIEW));
                    break;

                case TOOLBAR_ITEM_ANNOTATIONS:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_EDIT_ANNOTATIONS));
                    break;

                case TOOLBAR_ITEM_THUMBNAILS:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_THUMBNAIL_GRID));
                    break;

                case TOOLBAR_ITEM_SHARE:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_SHARE));
                    break;

                case TOOLBAR_ITEM_SETTINGS:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_SETTINGS));
                    break;

                case TOOLBAR_ITEM_OUTLINE:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_OUTLINE));
                    break;

                case TOOLBAR_ITEM_DOCUMENT_INFO_VIEW:
                    menuItems.remove(Integer.valueOf(PdfActivity.MENU_OPTION_DOCUMENT_INFO));
                    break;
            }
        }

        for (HashMap item : customToolbarItems) {
            String customId = item.get("id").toString();
            int index = (Integer) item.get("index");
            int resId = PSPDFKitUtils.getCustomResourceId(customId, "id", getContext());
            menuItems.add(Math.min(menuItems.size(), index), resId);
        }
        return menuItems;
    }

    void setupOptionsMenu(@NonNull Menu menu) {
        for (HashMap item : customToolbarItems) {
            String customId = item.get("id").toString();
            String image = item.get("image").toString();
            String title = item.get("title") != null ? item.get("title").toString() : "";
            int resId = PSPDFKitUtils.getCustomResourceId(customId, "id", getContext());
            Boolean showAsAction = item.get("showAsAction") != null ? (Boolean) item.get("showAsAction") : true;
            Boolean applyTemplate = item.get("applyTemplate") != null ? (Boolean) item.get("applyTemplate") : true;
            MenuItem customMenuItem = menu.findItem(resId);
            customMenuItem.setTitle(title);
            int iconId = PSPDFKitUtils.getCustomResourceId(image, "drawable", getContext());
            customMenuItem.setIcon(iconId);
            customMenuItem.setShowAsAction(showAsAction == true ? MenuItem.SHOW_AS_ACTION_ALWAYS : MenuItem.SHOW_AS_ACTION_NEVER);
            customMenuItem.setOnMenuItemClickListener(this.menuItemListener);

            // Apply toolbar theme color to custom menu item icon
            Drawable customIcon = customMenuItem.getIcon();
            final TypedArray a = getContext().getTheme().obtainStyledAttributes(
                    null,
                    com.pspdfkit.R.styleable.pspdf__ActionBarIcons,
                    com.pspdfkit.R.attr.pspdf__actionBarIconsStyle,
                    com.pspdfkit.R.style.PSPDFKit_ActionBarIcons
            );
            int mainToolbarIconsColor = a.getColor(com.pspdfkit.R.styleable.pspdf__ActionBarIcons_pspdf__iconsColor, ContextCompat.getColor(getContext(), android.R.color.white));
            a.recycle();
            try {
                if (applyTemplate) {
                    DrawableCompat.setTint(customIcon, mainToolbarIconsColor);
                } else {
                    DrawableCompat.setTintList(customIcon, null);
                }
                customMenuItem.setIcon(customIcon);
            } catch (Exception e) {
                // Omit the icon if the image is missing
            }
        }
    }

    @Override
    public void onPrepareOptionsMenu(@NonNull Menu menu) {
        super.onPrepareOptionsMenu(menu);
        this.setupOptionsMenu(menu);
    }

    @Override
    public void onCreateOptionsMenu(@NonNull Menu menu, @NonNull MenuInflater inflater) {
        super.onCreateOptionsMenu(menu, inflater);
        this.setupOptionsMenu(menu);
    }
}
