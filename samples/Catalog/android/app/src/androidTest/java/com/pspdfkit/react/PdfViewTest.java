package com.pspdfkit.react;

import android.graphics.RectF;
import android.support.test.InstrumentationRegistry;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;

import com.pspdfkit.annotations.FreeTextAnnotation;
import com.pspdfkit.preferences.PSPDFKitPreferences;
import com.pspdfkit.react.helper.JsonUtilities;
import com.pspdfkit.react.test.TestActivity;
import com.pspdfkit.ui.PdfFragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.isRoot;
import static android.support.test.espresso.matcher.ViewMatchers.withId;
import static android.support.test.espresso.matcher.ViewMatchers.withText;
import static com.pspdfkit.react.utils.ViewActions.waitForView;
import static com.pspdfkit.react.utils.ViewActions.waitForViewNotDisplayed;
import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertFalse;

@RunWith(AndroidJUnit4.class)
public class PdfViewTest {
    @Rule
    public ActivityTestRule<TestActivity> activityRule = new ActivityTestRule<>(TestActivity.class);

    @Before
    public void clearAnnotationCreator() {
        PSPDFKitPreferences.get(InstrumentationRegistry.getTargetContext()).resetAnnotationCreator();
        TestingModule.resetValues();
    }

    @Test
    public void testAuthorNameProp() {
        // AuthorNameScreen.js

        // Pre Condition: No annotation creator is set.
        assertFalse(PSPDFKitPreferences.get(activityRule.getActivity()).isAnnotationCreatorSet());

        // Wait until react is loaded.
        onView(isRoot()).perform(waitForView(withText("Test Cases")));

        // Open the screen containing the logic we want to test.
        onView(withText("AuthorName")).perform(click());

        // Check that annotation creator is set.
        assertEquals("Author", PSPDFKitPreferences.get(activityRule.getActivity()).getAnnotationCreator(null));
    }

    @Test
    public void testEnterAndExitAnnotationCreation() {
        // AnnotationToolbarScreen.js

        // Wait until react is loaded.
        onView(isRoot()).perform(waitForView(withText("Test Cases")));

        // Open the screen containing the logic we want to test.
        onView(withText("AnnotationToolbar")).perform(click());

        // Open toolbar and check that it is displayed,
        onView(withText("OPEN")).perform(click());
        onView(withId(R.id.pspdf__annotation_creation_toolbar)).check(matches(isDisplayed()));

        // Now close it again.
        onView(withText("CLOSE")).perform(click());
        onView(isRoot()).perform(waitForViewNotDisplayed(withId(R.id.pspdf__annotation_creation_toolbar)));
    }

    @Test
    public void testGetEmptyAnnotations() throws InterruptedException {
        // GetAnnotationsScreen.js

        // Wait until react is loaded.
        onView(isRoot()).perform(waitForView(withText("Test Cases")));

        // Open the screen containing the logic we want to test.
        onView(withText("GetAnnotations")).perform(click());

        // Get annotations for first page should return nothing.
        onView(withText("GET")).perform(click());
        String annotations = TestingModule.getValue("annotations");

        assertEquals("{\"annotations\":[]}", annotations);
    }

    @Test
    public void testGetAnnotation() throws InterruptedException, JSONException {
        // GetAnnotationsScreen.js

        // Wait until react is loaded.
        onView(isRoot()).perform(waitForView(withText("Test Cases")));

        // Open the screen containing the logic we want to test.
        onView(withText("GetAnnotations")).perform(click());

        PdfFragment fragment = (PdfFragment) activityRule.getActivity().getSupportFragmentManager().findFragmentByTag("PDF1");
        FreeTextAnnotation annotation = new FreeTextAnnotation(0, new RectF(0, 0, 100, 100), "Test");
        fragment.getDocument().getAnnotationProvider().addAnnotationToPage(annotation);

        // Get annotations for first page should return nothing.
        onView(withText("GET")).perform(click());
        JSONObject annotations = new JSONObject(TestingModule.getValue("annotations"));
        
        JSONObject originalInstantJson = new JSONObject(annotation.toInstantJson());
        assertEquals(JsonUtilities.jsonObjectToMap(originalInstantJson), JsonUtilities.jsonObjectToMap(annotations.getJSONArray("annotations").getJSONObject(0)));
    }

}
