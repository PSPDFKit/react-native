import {
  computeOverlayItemLayout,
  computeOverlayItemScreenPoint,
  isPullCurrent,
  OVERLAY_SUBSCRIBE_GAVE_UP,
  shouldResubscribeOverlay,
} from '../src/overlay/overlayLayout';

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

describe('computeOverlayItemScreenPoint', () => {
  // A4 anchored 40 points above the top of the viewport, at 1:1.
  const viewport = {
    pageIndex: 2,
    pdfToScreenScale: 1,
    pageSize: { width: 595, height: 842 },
    contentOffset: { x: 0, y: 40 },
  };

  test("the page's top-left lands where contentOffset says the page starts", () => {
    const point = computeOverlayItemScreenPoint(
      { x: 0, y: viewport.pageSize.height },
      2,
      viewport,
    );
    expect(point).toEqual({ x: 0, y: -40 });
  });

  test('y is measured down from the top of the page, not up from its bottom', () => {
    // 142 PDF points below the page's top edge, which is itself 40 above the viewport.
    const point = computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, viewport);
    expect(point).toEqual({ x: 100, y: 102 });
  });

  test('pdfToScreenScale scales the distance from the page corner', () => {
    const zoomed = { ...viewport, pdfToScreenScale: 2 };
    const point = computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, zoomed);
    expect(point).toEqual({ x: 200, y: 244 }); // (842 - 700) * 2 - 40
  });

  test('returns null for an item on a page the payload does not describe', () => {
    expect(computeOverlayItemScreenPoint({ x: 100, y: 700 }, 3, viewport)).toBeNull();
  });

  test('returns null when no viewport state has arrived yet', () => {
    expect(computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, null)).toBeNull();
  });

  test('returns null when the native side reports no usable scale', () => {
    // An older native build that predates pdfToScreenScale; the caller must fall
    // back to convertPointToScreen rather than place the item at a wrong spot.
    const legacy = { ...viewport, pdfToScreenScale: undefined };
    expect(computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, legacy)).toBeNull();
    expect(
      computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, { ...viewport, pdfToScreenScale: 0 }),
    ).toBeNull();
  });

  test('returns null when the native side reports no page size', () => {
    const legacy = { ...viewport, pageSize: undefined };
    expect(computeOverlayItemScreenPoint({ x: 100, y: 700 }, 2, legacy)).toBeNull();
  });
});

describe('shouldResubscribeOverlay', () => {
  const viewA = { name: 'a' };
  const viewB = { name: 'b' };

  test('the same view instance does not resubscribe', () => {
    expect(shouldResubscribeOverlay(viewA, viewA)).toBe(false);
  });

  test('a remounted view resubscribes', () => {
    // A `key` change gives a brand new instance with its own NotificationCenter and component
    // id, so the old subscription would keep filtering the new view's events out.
    expect(shouldResubscribeOverlay(viewB, viewA)).toBe(true);
  });

  test('an empty ref is the same whether it reads undefined or null', () => {
    // `useRef<NutrientView>(null)` and `useRef<NutrientView>()` differ here, and comparing them
    // raw would report a change on every commit; the resubscribe counter would then climb until
    // React gave up with "Maximum update depth exceeded".
    expect(shouldResubscribeOverlay(undefined, null)).toBe(false);
    expect(shouldResubscribeOverlay(null, undefined)).toBe(false);
    expect(shouldResubscribeOverlay(null, null)).toBe(false);
  });

  test('a view appearing behind a previously empty ref resubscribes', () => {
    expect(shouldResubscribeOverlay(viewA, null)).toBe(true);
    expect(shouldResubscribeOverlay(viewA, undefined)).toBe(true);
  });

  test('a view going away resubscribes, so the stale subscription is dropped', () => {
    expect(shouldResubscribeOverlay(null, viewA)).toBe(true);
  });

  test('giving up on the view currently behind the ref still resubscribes', () => {
    // The case the instance-vs-instance comparison cannot see: the subscribe loop ran out of
    // attempts against a view whose `getNotificationCenter()` stayed undefined, and the ref still
    // holds that same view. Recording the instance would compare equal forever.
    expect(shouldResubscribeOverlay(viewA, OVERLAY_SUBSCRIBE_GAVE_UP)).toBe(true);
  });

  test('giving up on an empty ref resubscribes once a view turns up', () => {
    expect(shouldResubscribeOverlay(null, OVERLAY_SUBSCRIBE_GAVE_UP)).toBe(true);
    expect(shouldResubscribeOverlay(viewB, OVERLAY_SUBSCRIBE_GAVE_UP)).toBe(true);
  });

  test('the marker is never what a ref holds, so it cannot mask a real view', () => {
    expect(shouldResubscribeOverlay(OVERLAY_SUBSCRIBE_GAVE_UP, viewA)).toBe(true);
  });
});

describe('isPullCurrent', () => {
  test('a pull at the live generation is current', () => {
    expect(isPullCurrent(false, 3, 3)).toBe(true);
  });

  test('a pull superseded by a newer generation is not', () => {
    // What a live viewport event or a document swap does: bump the generation, so a
    // `getViewportState` still in flight cannot land on top of newer geometry.
    expect(isPullCurrent(false, 2, 3)).toBe(false);
  });

  test('a cancelled effect makes every pull stale, including one at the live generation', () => {
    expect(isPullCurrent(true, 3, 3)).toBe(false);
    expect(isPullCurrent(true, 2, 3)).toBe(false);
  });

  test('generation 0 against 0 is current, so the very first pull is not dropped', () => {
    // Guards the shape of the check: anything truthiness-based on the generation would
    // discard the first pull, which is the only thing that places items before a scroll.
    expect(isPullCurrent(false, 0, 0)).toBe(true);
  });
});
