package com.pspdfkit.react;

import android.graphics.RectF;

import androidx.test.InstrumentationRegistry;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

import com.pspdfkit.annotations.FreeTextAnnotation;
import com.pspdfkit.forms.TextFormField;
import com.pspdfkit.preferences.PSPDFKitPreferences;
import com.pspdfkit.react.helper.JsonUtilities;
import com.pspdfkit.react.test.TestActivity;
import com.pspdfkit.ui.PdfFragment;
import com.pspdfkit.ui.PdfUiFragment;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isRoot;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static com.pspdfkit.react.utils.ViewActions.waitForView;
import static com.pspdfkit.react.utils.ViewActions.waitForViewNotDisplayed;
import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertFalse;
import static junit.framework.Assert.assertNull;

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
    public void testAuthorNameProp() throws InterruptedException {
        // AuthorNameScreen.js

        // Pre Condition: No annotation creator is set.
        assertFalse(PSPDFKitPreferences.get(activityRule.getActivity()).isAnnotationCreatorSet());

        openExample("AuthorName");

        // Check that annotation creator is set.
        assertEquals("Author", PSPDFKitPreferences.get(activityRule.getActivity()).getAnnotationCreator(null));
    }

    @Test
    public void testEnterAndExitAnnotationCreation() throws InterruptedException {
        // AnnotationToolbarScreen.js

        openExample("AnnotationToolbar");

        // Open toolbar and check that it is displayed,
        onView(withText("OPEN")).perform(click());
        onView(isRoot()).perform(waitForView(withId(R.id.pspdf__annotation_creation_toolbar)));

        // Now close it again.
        onView(withText("CLOSE")).perform(click());
        onView(isRoot()).perform(waitForViewNotDisplayed(withId(R.id.pspdf__annotation_creation_toolbar)));
    }

    @Test
    public void testGetEmptyAnnotations() throws InterruptedException {
        // GetAnnotationsScreen.js

        openExample("GetAnnotations");

        // Get annotations for first page should return nothing.
        onView(withText("GET")).perform(click());
        String annotations = TestingModule.getValue("annotations");

        assertEquals("{\"annotations\":[]}", annotations);
    }

    @Test
    public void testGetAnnotation() throws InterruptedException, JSONException {
        // GetAnnotationsScreen.js

        openExample("GetAnnotations");

        PdfUiFragment fragment = (PdfUiFragment) activityRule.getActivity().getSupportFragmentManager().findFragmentByTag("PDF1");
        FreeTextAnnotation annotation = new FreeTextAnnotation(0, new RectF(0, 0, 100, 100), "Test");
        fragment.getDocument().getAnnotationProvider().addAnnotationToPage(annotation);

        // Get annotations for first page should return nothing.
        onView(withText("GET")).perform(click());
        JSONObject annotations = new JSONObject(TestingModule.getValue("annotations"));

        JSONObject originalInstantJson = new JSONObject(annotation.toInstantJson());
        assertEquals(JsonUtilities.jsonObjectToMap(originalInstantJson), JsonUtilities.jsonObjectToMap(annotations.getJSONArray("annotations").getJSONObject(0)));
    }

    @Test
    public void testGettingAnnotationsInComponentDidMount() throws InterruptedException {
        // GetAnnotationsScreen.js

        openExample("GetAnnotations");

        // The ComponentDidMount calls get annotations, make sure we don't crash.
        String annotations = TestingModule.getValue("on_load_annotations");

        assertEquals("{\"annotations\":[]}", annotations);
    }

    @Test
    public void testSettingsFormValues() throws InterruptedException {
        // FormsScreen.js

        openExample("Forms");

        // Check with the form provider that the fields are empty.
        PdfUiFragment fragment = (PdfUiFragment) activityRule.getActivity().getSupportFragmentManager().findFragmentByTag("PDF1");
        TextFormField lastname = (TextFormField) fragment.getDocument().getFormProvider().getFormFieldWithFullyQualifiedName("Name_Last");
        TextFormField firstname = (TextFormField)fragment.getDocument().getFormProvider().getFormFieldWithFullyQualifiedName("Name_First");
        assertNull(lastname.getFormElement().getText());
        assertNull(firstname.getFormElement().getText());

        // Perform setting the form values.
        onView(withText("SET")).perform(click());

        assertEquals("Appleseed", lastname.getFormElement().getText());
        assertEquals("John", firstname.getFormElement().getText());
    }

    @Test
    public void testGettingFormValues() throws InterruptedException {
        // FormsScreen.js

        openExample("Forms");

        // Check with the form provider that the fields are empty.
        PdfUiFragment fragment = (PdfUiFragment) activityRule.getActivity().getSupportFragmentManager().findFragmentByTag("PDF1");
        TextFormField lastname = (TextFormField) fragment.getDocument().getFormProvider().getFormFieldWithFullyQualifiedName("Name_Last");
        TextFormField firstname = (TextFormField)fragment.getDocument().getFormProvider().getFormFieldWithFullyQualifiedName("Name_First");
        assertNull(lastname.getFormElement().getText());
        assertNull(firstname.getFormElement().getText());

        // Set the form fields.
        lastname.getFormElement().setText("Appleseed");
        firstname.getFormElement().setText("John");

        // Get the form values in our react code.
        onView(withText("GET")).perform(click());

        assertEquals("{\"value\":\"Appleseed\"}", TestingModule.getValue("lastName"));
        assertEquals("{\"value\":\"John\"}", TestingModule.getValue("firstName"));
    }

    private void openExample(String exampleName) throws InterruptedException {
        // Wait until react is loaded.
        onView(isRoot()).perform(waitForView(withText("Test Cases")));

        // Open the screen containing the logic we want to test.
        onView(withText(exampleName)).perform(click());

        // Wait till react is ready.
        TestingModule.getValue("did_load");

        // And just give it a moment more.
        Thread.sleep(500);
    }

}
