package com.pspdfkit.views;

import android.content.Context;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;

import com.pspdfkit.configuration.PdfConfiguration;
import com.pspdfkit.configuration.activity.PdfActivityConfiguration;
import com.pspdfkit.document.PdfDocument;
import com.pspdfkit.listeners.SimpleDocumentListener;
import com.pspdfkit.ui.PdfFragment;

/**
 * This view displays a {@link com.pspdfkit.ui.PdfFragment} and all associated toolbars.
 */
public class PdfView extends FrameLayout {

    private FragmentManager fragmentManager;
    private String fragmentTag;
    private PdfActivityConfiguration configuration;

    public PdfView(@NonNull Context context) {
        super(context);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public PdfView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {

    }

    public void setFragmentManager(FragmentManager fragmentManager) {
        this.fragmentManager = fragmentManager;
    }

    public void setFragmentTag(String fragmentTag) {
        this.fragmentTag = fragmentTag;
        setupFragment();
    }

    public void setConfiguration(PdfActivityConfiguration configuration) {
        this.configuration = configuration;
        setupFragment();
    }

    private void setupFragment() {
        if (fragmentTag != null && configuration != null) {
            PdfFragment pdfFragment = (PdfFragment) fragmentManager.findFragmentByTag(fragmentTag);
            if (pdfFragment == null) {
                pdfFragment = PdfFragment.newInstance(Uri.parse("file:///android_asset/Annual Report.pdf"), new PdfConfiguration.Builder().build());
            } else {
                fragmentManager.beginTransaction()
                        .remove(pdfFragment)
                        .commitNow();
            }
            pdfFragment.addDocumentListener(new SimpleDocumentListener() {
                @Override
                public void onDocumentLoaded(@NonNull PdfDocument document) {
                    manuallyLayoutChildren();
                }
            });

            final Fragment fragment = pdfFragment;
            getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                    getViewTreeObserver().removeOnGlobalLayoutListener(this);
                    fragmentManager.beginTransaction()
                            .add(getId(), fragment, fragmentTag)
                            .commit();
                }
            });
        }
    }

    private void manuallyLayoutChildren() {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(MeasureSpec.makeMeasureSpec(getMeasuredWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getMeasuredHeight(), MeasureSpec.EXACTLY));
            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight());
        }
    }
}
