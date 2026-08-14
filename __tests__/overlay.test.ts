import { computeOverlayItemLayout } from '../src/overlay/overlayLayout';

describe('computeOverlayItemLayout', () => {
  const screen = { x: 100, y: 200 };
  const size = { width: 40, height: 20 };

  test('at zoom 1 the top-left sits exactly at the screen point', () => {
    const layout = computeOverlayItemLayout(screen, size, 1, false);
    expect(layout).toEqual({ scale: 1, left: 100, top: 200 });
  });

  test('scaling with zoom keeps the top-left anchored via a centering offset', () => {
    // At scale 2, a centered transform pushes the top-left inward by half the
    // scaled delta; the offset compensates so the corner stays at the anchor.
    const layout = computeOverlayItemLayout(screen, size, 2, false);
    expect(layout.scale).toBe(2);
    expect(layout.left).toBe(100 - (40 * (1 - 2)) / 2); // 100 + 20 = 120
    expect(layout.top).toBe(200 - (20 * (1 - 2)) / 2); // 200 + 10 = 210
  });

  test('zooming out below 1 offsets in the opposite direction', () => {
    const layout = computeOverlayItemLayout(screen, size, 0.5, false);
    expect(layout.scale).toBe(0.5);
    expect(layout.left).toBe(90); // 100 - (40 * 0.5) / 2
    expect(layout.top).toBe(195); // 200 - (20 * 0.5) / 2
  });

  test('disableAutoZoom pins scale to 1 regardless of zoom', () => {
    const layout = computeOverlayItemLayout(screen, size, 3, true);
    expect(layout).toEqual({ scale: 1, left: 100, top: 200 });
  });

  test('unmeasured size (0x0) positions at the anchor at any zoom', () => {
    const layout = computeOverlayItemLayout(
      screen,
      { width: 0, height: 0 },
      2.5,
      false,
    );
    expect(layout).toEqual({ scale: 2.5, left: 100, top: 200 });
  });
});
