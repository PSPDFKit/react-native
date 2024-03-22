/*
 * ReactPdfUiFragment.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2024 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.views;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import com.pspdfkit.react.R;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfUiFragment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This {@link PdfUiFragment} provides additional callbacks to improve integration into react native.
 * <p/>
 * <ul>
 * <li>A callback when the configuration was changed.</li>
 * <li>A method to show and hide the navigation button in the toolbar, as well as a callback for when it is clicked.</li>
 * </ul>
 */
public class ReactPdfUiFragment extends PdfUiFragment {

    private ArrayList<HashMap> customToolbarItems = new ArrayList<>();
    private MenuItemListener menuItemListener;

    @Nullable private ReactPdfUiFragmentListener reactPdfUiFragmentListener;

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

    private static int getCustomResourceId(@NonNull String resName, @NonNull String type, @NonNull Context context) {
        int resourceId = context.getResources().getIdentifier(resName, type, context.getPackageName());
        return resourceId;
    }

    void setCustomToolbarItems(@NonNull ArrayList<HashMap> customToolbarItems, MenuItemListener listener) {
        this.customToolbarItems = customToolbarItems;
        this.menuItemListener = listener;
    }

    @NonNull
    @Override
    public List<Integer> onGenerateMenuItemIds(@NonNull List<Integer> menuItems) {
        for (HashMap item : customToolbarItems) {
            String customId = item.get("id").toString();
            int index = (Integer) item.get("index");
            int resId = getCustomResourceId(customId, "id", getContext());
            menuItems.add(Math.min(menuItems.size(), index), resId);
        }
        return menuItems;
    }

    @Override
    public void onCreateOptionsMenu(@NonNull Menu menu, @NonNull MenuInflater inflater) {
        super.onCreateOptionsMenu(menu, inflater);

        for (HashMap item : customToolbarItems) {
            String customId = item.get("id").toString();
            String image = item.get("image").toString();
            String title = item.get("title") != null ? item.get("title").toString() : "";
            int resId = getCustomResourceId(customId, "id", getContext());
            Boolean showAsAction = item.get("showAsAction") != null ? (Boolean) item.get("showAsAction") : true;
            MenuItem customMenuItem = menu.findItem(resId);
            customMenuItem.setTitle(title);
            int iconId = getCustomResourceId(image, "drawable", getContext());
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
                DrawableCompat.setTint(customIcon, mainToolbarIconsColor);
                customMenuItem.setIcon(customIcon);
            } catch (Exception e) {
                // Omit the icon if the image is missing
            }
        }
    }
}
