import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { NotificationCenter } from '../notification-center/NotificationCenter';
import {
  computeOverlayItemLayout,
  computeOverlayItemScreenPoint,
  isPullCurrent,
  OVERLAY_SUBSCRIBE_GAVE_UP,
  shouldResubscribeOverlay,
} from './overlayLayout';

/**
 * A point in a 2D coordinate space.
 */
export type NutrientOverlayPoint = { x: number; y: number };

/**
 * The subset of the `NutrientView` imperative API that the overlay needs. A
 * `React.RefObject<NutrientView>` satisfies this structurally, so consumers can
 * pass their existing view ref directly.
 */
export interface NutrientOverlayViewRef {
  getNotificationCenter: () => {
    subscribe: (
      event: string,
      callback: (payload: any) => void,
    ) => { remove: () => void };
  } | undefined;
  convertPointToScreen: (
    pageIndex: number,
    point: NutrientOverlayPoint,
  ) => Promise<NutrientOverlayPoint | null | undefined> | undefined;
  getViewportState: () =>
    | Promise<NotificationCenter.DocumentViewportChangedPayload | null | undefined>
    | undefined;
}

interface OverlayContextValue {
  viewRef: React.RefObject<any> | null;
  viewport: NotificationCenter.DocumentViewportChangedPayload | null;
}

const OverlayContext = createContext<OverlayContextValue>({
  viewRef: null,
  viewport: null,
});

/**
 * How long the overlay keeps asking for the first viewport state: this many attempts,
 * {@link INITIAL_STATE_RETRY_DELAY_MS} apart. Around five seconds on iOS, where
 * `getViewportState` reports nothing until a page has been laid out. Longer on Android, where
 * a single attempt can itself take up to five seconds because `computeViewportResultAsync`
 * waits that long for a fragment.
 */
const INITIAL_STATE_ATTEMPTS = 50;

/**
 * How many times the overlay looks for the `NutrientView` behind its ref before giving up, at
 * {@link INITIAL_STATE_RETRY_DELAY_MS} apart. Only reached when the ref is still empty or its
 * component has no NotificationCenter yet, which lasts a commit or two, so five seconds is a wide
 * margin. Bounded rather than open-ended because an overlay pointed at a ref that never receives
 * a view would otherwise poll for as long as the screen is mounted. Giving up is not final: the
 * loop records {@link OVERLAY_SUBSCRIBE_GAVE_UP} on its way out, so the resubscribe watchdog
 * below starts it again on the next render, whether or not the ref changed in the meantime.
 */
const SUBSCRIBE_ATTEMPTS = 50;

/** Delay between attempts at the initial pull, and between attempts to find the view. */
const INITIAL_STATE_RETRY_DELAY_MS = 100;

/**
 * Props for {@link NutrientOverlay}.
 */
export interface NutrientOverlayProps {
  /**
   * A ref to the `NutrientView` the overlay tracks. Create it with
   * `useRef<NutrientView>(null)` and pass the same ref to `<NutrientView>`.
   * The overlay uses the {@link NutrientOverlayViewRef} subset of its API.
   */
  viewRef: React.RefObject<any>;
  /** Optional style applied to the overlay container. */
  style?: StyleProp<ViewStyle>;
  /** {@link NutrientOverlayItem} elements to render on top of the document. */
  children?: React.ReactNode;
}

/**
 * A transparent layer that renders React Native components anchored to
 * positions on the PDF, keeping them in sync with pan and zoom.
 *
 * Place it as a sibling of `<NutrientView>` inside a container the view fills,
 * so the overlay and the view share the same frame origin:
 *
 * ```tsx
 * <View style={{ flex: 1 }}>
 *   <NutrientView ref={viewRef} document={...} />
 *   <NutrientOverlay viewRef={viewRef}>
 *     <NutrientOverlayItem pageIndex={0} position={{ x: 100, y: 100 }}>
 *       <MyBadge />
 *     </NutrientOverlayItem>
 *   </NutrientOverlay>
 * </View>
 * ```
 *
 * This is the JS-positioned overlay: positions are recomputed from the
 * `documentViewportChanged` event, so items can visibly lag during a fast fling
 * or pinch. Native-driven, jank-free tracking is planned as a follow-up.
 */
export function NutrientOverlay(props: NutrientOverlayProps): React.ReactElement {
  const { viewRef, style, children } = props;
  const [viewport, setViewport] =
    useState<NotificationCenter.DocumentViewportChangedPayload | null>(null);

  // The `NutrientView` instance the current subscription belongs to, and a counter that forces
  // the subscription effect to re-run when that instance changes.
  const subscribedTo = useRef<any>(null);
  const [subscriptionGeneration, setSubscriptionGeneration] = useState(0);

  // Declared before the watchdog effect below on purpose. Effects run in declaration order and
  // refs are attached during commit, so by the time the watchdog compares, this has already
  // recorded the instance. The other way around, every mount subscribes, tears down and
  // subscribes again, and in that window there are no listeners at all. Neither platform
  // tracks listeners per view: Android turns the notification center off globally once the
  // last one goes (`PSPDFKitModule.setIsNotificationCenterInUse`) and the iOS TurboModule
  // keys `_activeEvents` by event name across the module, so events from any view are dropped
  // while it lasts.
  useEffect(() => {
    let cancelled = false;
    // One handle per loop. They cannot overlap today, since the pull only starts once the
    // subscribe loop has succeeded, but sharing a handle means whichever loop stops last silently
    // owns the cancellation of a loop it knows nothing about.
    let subscribeTimer: ReturnType<typeof setTimeout> | undefined;
    let pullTimer: ReturnType<typeof setTimeout> | undefined;
    let subscriptions: { remove: () => void }[] = [];
    // Tells pulls apart, so a `getViewportState` still in flight cannot land on top of newer
    // state, whether that came from the document that replaced the one it was asked about or
    // from a viewport event that arrived while it was resolving.
    let pullGeneration = 0;

    const onViewportChanged = (
      payload: NotificationCenter.DocumentViewportChangedPayload,
    ) => {
      if (cancelled) {
        return;
      }
      // A live event supersedes any pull still in flight or waiting to retry. Without this the
      // pull resolves afterwards with the geometry of a moment ago and moves every item back,
      // which is reachable on Android where a single `getViewportState` can sit inside
      // `computeViewportResultAsync` for seconds while the user is already scrolling.
      pullGeneration += 1;
      if (pullTimer) {
        clearTimeout(pullTimer);
        pullTimer = undefined;
      }
      setViewport(payload);
    };

    // Pull the current state so items position before the first scroll or zoom. Retried while
    // the view reports nothing: the page may not be laid out yet, and no event is emitted on
    // document load, so a single failed pull would leave items unplaced until the user
    // happens to scroll or zoom.
    const pullInitialState = (attemptsLeft: number, generation: number) => {
      const api = viewRef?.current;
      const retryOrGiveUp = () => {
        if (isPullCurrent(cancelled, generation, pullGeneration) && attemptsLeft > 0) {
          pullTimer = setTimeout(
            () => pullInitialState(attemptsLeft - 1, generation),
            INITIAL_STATE_RETRY_DELAY_MS,
          );
        }
      };
      if (!api) {
        retryOrGiveUp();
        return;
      }
      Promise.resolve(api.getViewportState())
        .then(state => {
          if (!isPullCurrent(cancelled, generation, pullGeneration)) {
            return;
          }
          if (state) {
            setViewport(state);
          } else {
            retryOrGiveUp();
          }
        })
        .catch(retryOrGiveUp);
    };

    const startPull = () => {
      pullGeneration += 1;
      if (pullTimer) {
        clearTimeout(pullTimer);
        pullTimer = undefined;
      }
      pullInitialState(INITIAL_STATE_ATTEMPTS, pullGeneration);
    };

    // Swapping the `document` prop keeps the same view instance, so the watchdog below cannot
    // see it, and no viewport event is emitted on load. Without this the overlay goes on
    // placing items with the previous document's `pageSize` and `contentOffset`.
    const onDocumentLoaded = () => {
      if (cancelled) {
        return;
      }
      setViewport(null);
      startPull();
    };

    const trySubscribe = (attemptsLeft: number) => {
      if (cancelled) {
        return;
      }
      const api = viewRef?.current;
      // Record the instance being subscribed to (or waited on) before bailing out, so the
      // watchdog below only re-runs this when the instance actually changes again.
      // `shouldResubscribeOverlay` normalizes both sides, so storing the raw value is fine.
      subscribedTo.current = api ?? null;
      const notificationCenter = api?.getNotificationCenter();
      if (!api || !notificationCenter) {
        // The native view may not be mounted yet; retry until it is.
        if (attemptsLeft > 0) {
          subscribeTimer = setTimeout(
            () => trySubscribe(attemptsLeft - 1),
            INITIAL_STATE_RETRY_DELAY_MS,
          );
        } else {
          // Out of attempts. Leave a marker instead of the instance, so the watchdog below sees a
          // difference on the next render and starts a fresh loop. Keeping the instance recorded
          // would make this the one case the watchdog cannot rescue: a ref that held the same
          // view for the whole five seconds compares equal forever, and the overlay stays dead.
          subscribedTo.current = OVERLAY_SUBSCRIBE_GAVE_UP;
        }
        return;
      }
      subscriptions = [
        notificationCenter.subscribe(
          NotificationCenter.DocumentEvent.VIEWPORT_CHANGED,
          onViewportChanged as (payload: any) => void,
        ),
        notificationCenter.subscribe(
          NotificationCenter.DocumentEvent.LOADED,
          onDocumentLoaded as (payload: any) => void,
        ),
      ];
      startPull();
    };

    trySubscribe(SUBSCRIBE_ATTEMPTS);

    return () => {
      cancelled = true;
      if (subscribeTimer) {
        clearTimeout(subscribeTimer);
      }
      if (pullTimer) {
        clearTimeout(pullTimer);
      }
      subscriptions.forEach(subscription => subscription.remove());
      subscriptions = [];
    };
  }, [viewRef, subscriptionGeneration]);

  // The resubscribe watchdog. `viewRef.current` is not reactive and the ref object itself never
  // changes, so no dependency array sees a remount of the view; compare after every render
  // instead. See `shouldResubscribeOverlay` for what that comparison has to get right.
  useEffect(() => {
    if (shouldResubscribeOverlay(viewRef?.current, subscribedTo.current)) {
      // Geometry from the previous view does not describe the new one; drop it so items hide
      // instead of sitting at a position computed for a document that is no longer shown.
      setViewport(null);
      setSubscriptionGeneration(generation => generation + 1);
    }
  });

  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="box-none">
      <OverlayContext.Provider value={{ viewRef, viewport }}>
        {children}
      </OverlayContext.Provider>
    </View>
  );
}

/**
 * Props for {@link NutrientOverlayItem}.
 */
export interface NutrientOverlayItemProps {
  /** Index of the page the item is anchored to. Starts at 0. */
  pageIndex: number;
  /**
   * Position of the item's top-left corner, in PDF coordinates on `pageIndex`.
   */
  position: NutrientOverlayPoint;
  /**
   * When `true`, the item keeps a constant screen size regardless of zoom.
   * When `false` (the default) it scales with the document zoom, anchored at
   * `position`.
   */
  disableAutoZoom?: boolean;
  /** Called when the item becomes visible (its page enters the viewport). */
  onAppear?: () => void;
  /** Called when the item is no longer visible (its page leaves the viewport). */
  onDisappear?: () => void;
  /** The content rendered at `position`. */
  children?: React.ReactNode;
}

/**
 * A single overlay element anchored to a PDF coordinate on a given page.
 * Must be rendered inside a {@link NutrientOverlay}.
 */
export function NutrientOverlayItem(
  props: NutrientOverlayItemProps,
): React.ReactElement | null {
  const { pageIndex, position, disableAutoZoom, onAppear, onDisappear, children } =
    props;
  const { viewRef, viewport } = useContext(OverlayContext);

  const [screen, setScreen] = useState<NutrientOverlayPoint | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const visibleRef = useRef(false);
  // Guards against out-of-order async conversion results overwriting newer ones.
  const generationRef = useRef(0);

  // Kept in refs so effects that don't depend on these callbacks (the
  // unmount-only effect, and the viewport effect below) always call the
  // latest onAppear/onDisappear instead of a stale one from a prior render.
  const onAppearRef = useRef(onAppear);
  onAppearRef.current = onAppear;
  const onDisappearRef = useRef(onDisappear);
  onDisappearRef.current = onDisappear;

  const setHidden = () => {
    if (visibleRef.current) {
      visibleRef.current = false;
      onDisappearRef.current?.();
    }
    setScreen(null);
  };

  useEffect(() => {
    return () => {
      // Balance onAppear if the item unmounts while visible. No setState here:
      // the component is going away.
      if (visibleRef.current) {
        visibleRef.current = false;
        onDisappearRef.current?.();
      }
    };
  }, []);

  useEffect(() => {
    const api = viewRef?.current;
    if (!api || !viewport) {
      // The view is gone (e.g. `NutrientView` unmounted); don't leave a stale
      // item rendered at its last known position.
      setHidden();
      return;
    }
    // Bumped before either path runs, so a native round-trip still in flight from a previous
    // viewport event is discarded even when this run resolves synchronously below.
    const generation = ++generationRef.current;

    // Fast path: the payload already describes where this item's page sits, so position from
    // it directly. Without this, tracking a pinch or fling costs one native round-trip per
    // item per event, each resolving a frame or more after the state it was computed for.
    const derived = computeOverlayItemScreenPoint(position, pageIndex, viewport);
    if (derived) {
      setScreen(derived);
      if (!visibleRef.current) {
        visibleRef.current = true;
        onAppearRef.current?.();
      }
      return;
    }

    // Slow path: the item is on a page the payload does not describe, e.g. the second page
    // visible in a continuous layout. Ask the native side about that page specifically.
    let cancelled = false;
    Promise.resolve(api.convertPointToScreen(pageIndex, position))
      .then(point => {
        if (cancelled || generation !== generationRef.current) {
          return;
        }
        if (point && typeof point.x === 'number' && typeof point.y === 'number') {
          setScreen({ x: point.x, y: point.y });
          if (!visibleRef.current) {
            visibleRef.current = true;
            onAppearRef.current?.();
          }
        } else {
          // The page is not currently visible.
          setHidden();
        }
      })
      .catch(() => {
        if (cancelled || generation !== generationRef.current) {
          return;
        }
        setHidden();
      });
    return () => {
      cancelled = true;
    };
    // `position` is spread into primitives so an inline object literal does not
    // refire the effect on every render.
  }, [viewRef, viewport, pageIndex, position.x, position.y]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  if (!screen) {
    return null;
  }

  const { left, top, scale } = computeOverlayItemLayout(
    screen,
    size,
    viewport?.zoomScale ?? 1,
    disableAutoZoom ?? false,
  );

  return (
    <View
      pointerEvents="box-none"
      onLayout={onLayout}
      style={[
        styles.item,
        { left, top },
        scale !== 1 ? { transform: [{ scale }] } : null,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: 'absolute',
  },
});
