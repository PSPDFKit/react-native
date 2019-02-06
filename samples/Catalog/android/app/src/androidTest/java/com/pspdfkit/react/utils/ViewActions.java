/*
 *   Copyright © 2014-2019 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react.utils;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.test.espresso.PerformException;
import android.support.test.espresso.UiController;
import android.support.test.espresso.ViewAction;
import android.support.test.espresso.action.CoordinatesProvider;
import android.support.test.espresso.action.GeneralClickAction;
import android.support.test.espresso.action.GeneralLocation;
import android.support.test.espresso.action.GeneralSwipeAction;
import android.support.test.espresso.action.MotionEvents;
import android.support.test.espresso.action.Press;
import android.support.test.espresso.action.Swipe;
import android.support.test.espresso.action.Tap;
import android.support.test.espresso.util.HumanReadables;
import android.support.test.espresso.util.TreeIterables;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;

import org.hamcrest.Matcher;
import org.hamcrest.StringDescription;

import java.util.concurrent.TimeoutException;

import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static org.hamcrest.Matchers.any;

/**
 * Collection of useful custom Espresso view actions.
 */
public class ViewActions {

    public static final long DEFAULT_TIMEOUT = 10000L;

    /**
     * Allows to sleep a certain amount of milliseconds. Can be chained in view actions like<p>
     * <code>onView(..).perform(swipeLeft(), sleep(200), swipeRight());</code>
     */
    public static ViewAction sleep(final long time) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Sleeping " + time + " millis.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                uiController.loopMainThreadForAtLeast(time);
            }
        };
    }

    /**
     * Allows to wait for main thread idling while performing view actions. Can be chained in view
     * actions like<p>
     * <p>
     * <code>onView(..).perform(swipeLeft(), waitForIdle(), swipeRight());</code>
     */
    public static ViewAction waitForIdle() {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Waiting for idle sync.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                uiController.loopMainThreadUntilIdle();
            }
        };
    }

    /**
     * Performs a {@link android.support.test.espresso.action.ViewActions#click()} before sleeping the default tap timeout.
     */
    public static ViewAction tap() {
        return tapAt(GeneralLocation.VISIBLE_CENTER);
    }

    /**
     * Performs a {@link android.support.test.espresso.action.ViewActions#click()} before sleeping the default tap timeout.
     */
    public static ViewAction tapAt(final CoordinatesProvider at) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Tapping view.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                clickAt(at).perform(uiController, view);
                uiController.loopMainThreadForAtLeast(ViewConfiguration.getTapTimeout());
            }
        };
    }

    /**
     * Performs a {@link android.support.test.espresso.action.ViewActions#click()} at the coordinates returned by the given provider.
     */
    public static ViewAction clickAt(final CoordinatesProvider at) {
        return clickAt(at, null);
    }

    /**
     * Performs a {@link android.support.test.espresso.action.ViewActions#click()} at the coordinates returned by the given provider.
     */
    public static ViewAction clickAt(final CoordinatesProvider at, @Nullable ViewAction rollbackAction) {
        return new GeneralClickAction(Tap.SINGLE, at, Press.FINGER, rollbackAction);
    }

    public static ViewAction clickOnViewContent(final float x, final float y) {
        return new GeneralClickAction(Tap.SINGLE,
                new CoordinatesProvider() {
                    @Override
                    public float[] calculateCoordinates(View view) {
                        final int[] screenPos = new int[2];
                        view.getLocationOnScreen(screenPos);

                        return new float[]{x, y};
                    }
                }, Press.FINGER
        );
    }

    /**
     * Perform a double-click at the coordinates returned by the given {@link CoordinatesProvider}.
     */
    @NonNull
    public static GeneralClickAction doubleClickAt(CoordinatesProvider at) {
        return new GeneralClickAction(Tap.DOUBLE, at, Press.FINGER);
    }

    /**
     * Perform a long-press at the coordinates returned by the given {@link CoordinatesProvider}.
     */
    @NonNull
    public static GeneralClickAction longPressAt(CoordinatesProvider at) {
        return new GeneralClickAction(Tap.LONG, at, Press.FINGER);
    }

    /**
     * Perform a swipe gesture with the given speed, and accuracy.
     */
    @NonNull
    public static GeneralSwipeAction swipe(Swipe speed, CoordinatesProvider from, CoordinatesProvider to) {
        return new GeneralSwipeAction(speed, from, to, Press.FINGER);
    }

    /**
     * Injects {@link MotionEvent#ACTION_CANCEL} to existing gesture with the given <code>downEvent</code>.
     */
    public static ViewAction cancelMotion(final MotionEvent downEvent) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Canceling motion";
            }

            @Override
            public void perform(UiController uiController, View view) {
                MotionEvents.sendCancel(uiController, downEvent);
                uiController.loopMainThreadUntilIdle();
            }
        };
    }

    /**
     * Injects {@link MotionEvent#ACTION_UP} to existing gesture with the given <code>downEvent</code>.
     */
    public static ViewAction sendMotionEventUp(final MotionEvent downEvent) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Injecting ACTION_UP event.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                MotionEvents.sendUp(uiController, downEvent);
                uiController.loopMainThreadUntilIdle();
            }
        };
    }

    public static ViewAction waitForViewNotDisplayed(final Matcher<View> viewMatcher, final long millis) {
        return waitForView(viewMatcher, millis, false);
    }

    public static ViewAction waitForViewNotDisplayed(final Matcher<View> viewMatcher) {
        return waitForView(viewMatcher, DEFAULT_TIMEOUT, false);
    }

    /**
     * Waits for the view matched by <code>viewMatcher</code> to appear with a timeout of 10 seconds.
     */
    public static ViewAction waitForView(final Matcher<View> viewMatcher) {
        return waitForView(viewMatcher, DEFAULT_TIMEOUT, true);
    }

    public static ViewAction waitForView(final Matcher<View> viewMatcher, final long millis) {
        return waitForView(viewMatcher, millis, true);
    }

    public static ViewAction waitForView(final Matcher<View> viewMatcher, final long millis, final boolean waitForDisplayed) {
        return waitForView(viewMatcher, millis, waitForDisplayed, isDisplayed());
    }

    public static ViewAction waitForView(final Matcher<View> viewMatcher, final boolean waitForDisplayed) {
        return waitForView(viewMatcher, DEFAULT_TIMEOUT, waitForDisplayed, isDisplayed());
    }

    public static ViewAction waitForView(final Matcher<View> viewMatcher,
                                         final long millis,
                                         final boolean waitForFulfilledState,
                                         final Matcher<View> stateMatcher) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                final StringDescription matcherDescription = new StringDescription();
                final StringDescription stateDescription = new StringDescription();
                viewMatcher.describeTo(matcherDescription);
                stateMatcher.describeTo(stateDescription);
                return "wait for a specific view <" + matcherDescription.toString() + "> to be " + stateDescription.toString()
                        + " during " + millis + " millis.";
            }

            @Override
            public void perform(final UiController uiController, final View view) {
                uiController.loopMainThreadUntilIdle();
                final long startTime = System.currentTimeMillis();
                final long endTime = startTime + millis;

                do {
                    boolean viewHasDesiredState = false;
                    for (View child : TreeIterables.breadthFirstViewTraversal(view)) {
                        if (viewMatcher.matches(child) && stateMatcher.matches(child)) {
                            viewHasDesiredState = true;
                            break;
                        }
                    }

                    if (viewHasDesiredState == waitForFulfilledState) return;
                    uiController.loopMainThreadForAtLeast(50);
                }
                while (System.currentTimeMillis() < endTime);

                // timeout happens
                throw new PerformException.Builder()
                        .withActionDescription(this.getDescription())
                        .withViewDescription(HumanReadables.describe(view))
                        .withCause(new TimeoutException())
                        .build();
            }
        };
    }

    /**
     * Used as a rollback action, for retrying a tap three times (hard coded in Espresso).
     */
    public static ViewAction withRetry() {
        return new ViewAction() {

            @Override
            public Matcher<View> getConstraints() {
                return any(View.class);
            }

            @Override
            public String getDescription() {
                return "Retries without any special rollback.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                // This ViewAction is a rollback placeholder, without any real action.
            }
        };
    }

    /**
     * Performs a {@link android.support.test.espresso.action.ViewActions#click()} on a view with a given id.
     */
    public static ViewAction clickChildViewWithId(final int id) {
        return new ViewAction() {
            @Override
            public Matcher<View> getConstraints() {
                return null;
            }

            @Override
            public String getDescription() {
                return "Click on a child view with specified id.";
            }

            @Override
            public void perform(UiController uiController, View view) {
                View v = view.findViewById(id);
                v.performClick();
            }
        };
    }

}
