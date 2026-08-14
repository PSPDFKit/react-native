"use strict";
/**
 * Pure geometry helpers for the overlay, kept free of React/React Native imports
 * so they can be unit tested in isolation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeOverlayItemLayout = computeOverlayItemLayout;
/**
 * Computes the absolute layout for an overlay item. When the item scales with
 * zoom, scaling is centered, so the layout position is offset by half the scaled
 * delta to keep the item's top-left anchored at `screen` without relying on
 * `transformOrigin` (unavailable before React Native 0.74).
 */
function computeOverlayItemLayout(screen, size, zoomScale, disableAutoZoom) {
    var scale = disableAutoZoom ? 1 : zoomScale;
    return {
        scale: scale,
        left: screen.x - (size.width * (1 - scale)) / 2,
        top: screen.y - (size.height * (1 - scale)) / 2,
    };
}
