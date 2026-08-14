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
import { computeOverlayItemLayout } from './overlayLayout';

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

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let subscription: { remove: () => void } | undefined;

    const onViewportChanged = (
      payload: NotificationCenter.DocumentViewportChangedPayload,
    ) => {
      if (!cancelled) {
        setViewport(payload);
      }
    };

    const trySubscribe = () => {
      if (cancelled) {
        return;
      }
      const api = viewRef?.current;
      const notificationCenter = api?.getNotificationCenter();
      if (!api || !notificationCenter) {
        // The native view may not be mounted yet; retry until it is.
        retryTimer = setTimeout(trySubscribe, 100);
        return;
      }
      subscription = notificationCenter.subscribe(
        NotificationCenter.DocumentEvent.VIEWPORT_CHANGED,
        onViewportChanged as (payload: any) => void,
      );
      // Pull the current state so items position before the first scroll/zoom.
      Promise.resolve(api.getViewportState())
        .then(state => {
          if (!cancelled && state) {
            setViewport(state);
          }
        })
        .catch(() => {
          /* No page visible yet; the event will deliver the first state. */
        });
    };

    trySubscribe();

    return () => {
      cancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      subscription?.remove();
    };
  }, [viewRef]);

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
    const generation = ++generationRef.current;
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
