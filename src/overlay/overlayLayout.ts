/**
 * Pure geometry helpers for the overlay, kept free of React/React Native imports
 * so they can be unit tested in isolation.
 */

/** A point in a 2D coordinate space. */
export type OverlayLayoutPoint = { x: number; y: number };

/** A size in a 2D coordinate space. */
export type OverlayLayoutSize = { width: number; height: number };

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
