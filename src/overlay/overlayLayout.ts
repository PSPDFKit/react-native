/**
 * Pure geometry helpers for the overlay, kept free of React/React Native imports
 * so they can be unit tested in isolation.
 */

/** A point in a 2D coordinate space. */
export type OverlayLayoutPoint = { x: number; y: number };

/** A size in a 2D coordinate space. */
export type OverlayLayoutSize = { width: number; height: number };

/**
 * The part of the `documentViewportChanged` payload an item's position derives from.
 *
 * `pdfToScreenScale` and `pageSize` are required in the public
 * `NotificationCenter.DocumentViewportChangedPayload`, because a matched native build always
 * sends them and the documented formula would be unusable behind a null check. They are optional
 * here because this helper also receives payloads from a native side that predates them: in
 * React Native the JS package and the compiled native code are updated separately, so a consumer
 * who bumps the package without rebuilding pods or Gradle gets exactly that.
 */
export type OverlayViewportState = {
  pageIndex: number;
  pdfToScreenScale?: number;
  pageSize?: OverlayLayoutSize;
  contentOffset: OverlayLayoutPoint;
};

/**
 * Recorded in place of the view instance when the subscribe loop runs out of attempts, so the
 * next {@link shouldResubscribeOverlay} check reports a difference and a fresh loop starts.
 * Recording the instance there instead would compare equal for as long as the ref holds it, and
 * an overlay that gave up on a view whose `getNotificationCenter()` was still undefined would
 * never be looked at again. A ref can never hold this value, so it cannot mask a real view.
 */
export const OVERLAY_SUBSCRIBE_GAVE_UP: unknown = { subscribeGaveUp: true };

/**
 * Whether the overlay's subscription still belongs to the `NutrientView` its ref points at.
 *
 * Remounting the view (a `key` change to swap documents, or a conditional render) leaves the ref
 * pointing at a brand new instance with its own NotificationCenter and component id, so the
 * existing subscription stops delivering: events from the new view carry the new id and are
 * filtered out. No dependency array catches that, because the ref object itself never changes and
 * `.current` is not reactive, so the caller compares after every render.
 *
 * Also true against {@link OVERLAY_SUBSCRIBE_GAVE_UP}, which covers the case where the ref never
 * changed at all and the subscription simply never got made.
 *
 * Both sides are normalized with `?? null` first. Comparing the raw values instead would read a
 * ref created as `useRef<NutrientView>()`, whose `current` is `undefined` rather than `null`, as a
 * change on every single commit, and the resubscribe counter would climb until React gave up with
 * "Maximum update depth exceeded".
 */
export function shouldResubscribeOverlay(
  currentView: unknown,
  subscribedView: unknown,
): boolean {
  return (currentView ?? null) !== (subscribedView ?? null);
}

/**
 * Whether a `getViewportState` pull is still the one the overlay wants an answer from, so its
 * result may be applied and its retry may be scheduled.
 *
 * A pull carries the generation it started at, and the overlay bumps the live generation whenever
 * something newer describes the viewport: an incoming `documentViewportChanged` event, or a fresh
 * pull started because the document was swapped. Anything from an older generation has to be
 * dropped rather than applied, or it moves every item back to the geometry of a moment ago. That
 * is reachable on Android, where one `getViewportState` can sit inside `computeViewportResultAsync`
 * for seconds while the user is already scrolling.
 *
 * Named rather than compared inline because the two call sites need opposite polarities, one to
 * apply a result and one to schedule the next attempt, and an inverted comparison at either would
 * either strand the retry loop or resurrect stale geometry.
 */
export function isPullCurrent(
  cancelled: boolean,
  generation: number,
  currentGeneration: number,
): boolean {
  return !cancelled && generation === currentGeneration;
}

/**
 * Derives an overlay item's screen point from the `documentViewportChanged` payload already
 * delivered, so tracking a pan or zoom costs no native round-trip per item.
 *
 * Returns `null` when the payload cannot place the point, in which case the caller must fall
 * back to `convertPointToScreen`: that is the case for an item on a page other than the
 * viewport's anchor page (whose offset the payload does not describe), and for a payload from a
 * native side that predates `pdfToScreenScale`.
 *
 * The math mirrors what the native conversion does. `contentOffset` is the anchor page's
 * top-left in screen points, negated, so `-contentOffset` is where the page's top-left sits in
 * the viewport; an item's offset from there is its PDF-point distance scaled by
 * `pdfToScreenScale`. PDF space is y-up from the page's bottom-left while screen space is
 * y-down, hence measuring y from `pageSize.height` down.
 *
 * Deliberately not derived from `visiblePdfRect`: it is clipped to the page, so it stops
 * changing once an edge is reached, and `zoomScale` is fit-relative rather than the PDF-to-screen
 * ratio. Deriving from those two disagreed with `convertPointToScreen` by hundreds of points on
 * both platforms.
 */
export function computeOverlayItemScreenPoint(
  position: OverlayLayoutPoint,
  pageIndex: number,
  viewport: OverlayViewportState | null | undefined,
): OverlayLayoutPoint | null {
  if (!viewport || pageIndex !== viewport.pageIndex) {
    return null;
  }
  const { pdfToScreenScale: scale, pageSize, contentOffset } = viewport;
  // `> 0` also rejects NaN, and the typeof check rejects a scale a native build predating the
  // field never sent. See OverlayViewportState for why those are reachable here.
  if (typeof scale !== 'number' || !(scale > 0) || !pageSize || !contentOffset) {
    return null;
  }
  return {
    x: position.x * scale - contentOffset.x,
    y: (pageSize.height - position.y) * scale - contentOffset.y,
  };
}

/**
 * Computes the absolute layout for an overlay item. When the item scales with
 * zoom, scaling is centered, so the layout position is offset by half the scaled
 * delta to keep the item's top-left anchored at `screen` without relying on
 * `transformOrigin` (unavailable before React Native 0.74).
 */
export function computeOverlayItemLayout(
  screen: OverlayLayoutPoint,
  size: OverlayLayoutSize,
  zoomScale: number,
  disableAutoZoom: boolean,
): { left: number; top: number; scale: number } {
  const scale = disableAutoZoom ? 1 : zoomScale;
  return {
    scale,
    left: screen.x - (size.width * (1 - scale)) / 2,
    top: screen.y - (size.height * (1 - scale)) / 2,
  };
}
