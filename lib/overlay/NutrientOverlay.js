"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutrientOverlay = NutrientOverlay;
exports.NutrientOverlayItem = NutrientOverlayItem;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var NotificationCenter_1 = require("../notification-center/NotificationCenter");
var overlayLayout_1 = require("./overlayLayout");
var OverlayContext = (0, react_1.createContext)({
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
var INITIAL_STATE_ATTEMPTS = 50;
/**
 * How many times the overlay looks for the `NutrientView` behind its ref before giving up, at
 * {@link INITIAL_STATE_RETRY_DELAY_MS} apart. Only reached when the ref is still empty or its
 * component has no NotificationCenter yet, which lasts a commit or two, so five seconds is a wide
 * margin. Bounded rather than open-ended because an overlay pointed at a ref that never receives
 * a view would otherwise poll for as long as the screen is mounted. Giving up is not final: the
 * loop records {@link OVERLAY_SUBSCRIBE_GAVE_UP} on its way out, so the resubscribe watchdog
 * below starts it again on the next render, whether or not the ref changed in the meantime.
 */
var SUBSCRIBE_ATTEMPTS = 50;
/** Delay between attempts at the initial pull, and between attempts to find the view. */
var INITIAL_STATE_RETRY_DELAY_MS = 100;
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
function NutrientOverlay(props) {
    var viewRef = props.viewRef, style = props.style, children = props.children;
    var _a = (0, react_1.useState)(null), viewport = _a[0], setViewport = _a[1];
    // The `NutrientView` instance the current subscription belongs to, and a counter that forces
    // the subscription effect to re-run when that instance changes.
    var subscribedTo = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(0), subscriptionGeneration = _b[0], setSubscriptionGeneration = _b[1];
    // Declared before the watchdog effect below on purpose. Effects run in declaration order and
    // refs are attached during commit, so by the time the watchdog compares, this has already
    // recorded the instance. The other way around, every mount subscribes, tears down and
    // subscribes again, and in that window there are no listeners at all. Neither platform
    // tracks listeners per view: Android turns the notification center off globally once the
    // last one goes (`PSPDFKitModule.setIsNotificationCenterInUse`) and the iOS TurboModule
    // keys `_activeEvents` by event name across the module, so events from any view are dropped
    // while it lasts.
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        // One handle per loop. They cannot overlap today, since the pull only starts once the
        // subscribe loop has succeeded, but sharing a handle means whichever loop stops last silently
        // owns the cancellation of a loop it knows nothing about.
        var subscribeTimer;
        var pullTimer;
        var subscriptions = [];
        // Tells pulls apart, so a `getViewportState` still in flight cannot land on top of newer
        // state, whether that came from the document that replaced the one it was asked about or
        // from a viewport event that arrived while it was resolving.
        var pullGeneration = 0;
        var onViewportChanged = function (payload) {
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
        var pullInitialState = function (attemptsLeft, generation) {
            var api = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current;
            var retryOrGiveUp = function () {
                if ((0, overlayLayout_1.isPullCurrent)(cancelled, generation, pullGeneration) && attemptsLeft > 0) {
                    pullTimer = setTimeout(function () { return pullInitialState(attemptsLeft - 1, generation); }, INITIAL_STATE_RETRY_DELAY_MS);
                }
            };
            if (!api) {
                retryOrGiveUp();
                return;
            }
            Promise.resolve(api.getViewportState())
                .then(function (state) {
                if (!(0, overlayLayout_1.isPullCurrent)(cancelled, generation, pullGeneration)) {
                    return;
                }
                if (state) {
                    setViewport(state);
                }
                else {
                    retryOrGiveUp();
                }
            })
                .catch(retryOrGiveUp);
        };
        var startPull = function () {
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
        var onDocumentLoaded = function () {
            if (cancelled) {
                return;
            }
            setViewport(null);
            startPull();
        };
        var trySubscribe = function (attemptsLeft) {
            if (cancelled) {
                return;
            }
            var api = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current;
            // Record the instance being subscribed to (or waited on) before bailing out, so the
            // watchdog below only re-runs this when the instance actually changes again.
            // `shouldResubscribeOverlay` normalizes both sides, so storing the raw value is fine.
            subscribedTo.current = api !== null && api !== void 0 ? api : null;
            var notificationCenter = api === null || api === void 0 ? void 0 : api.getNotificationCenter();
            if (!api || !notificationCenter) {
                // The native view may not be mounted yet; retry until it is.
                if (attemptsLeft > 0) {
                    subscribeTimer = setTimeout(function () { return trySubscribe(attemptsLeft - 1); }, INITIAL_STATE_RETRY_DELAY_MS);
                }
                else {
                    // Out of attempts. Leave a marker instead of the instance, so the watchdog below sees a
                    // difference on the next render and starts a fresh loop. Keeping the instance recorded
                    // would make this the one case the watchdog cannot rescue: a ref that held the same
                    // view for the whole five seconds compares equal forever, and the overlay stays dead.
                    subscribedTo.current = overlayLayout_1.OVERLAY_SUBSCRIBE_GAVE_UP;
                }
                return;
            }
            subscriptions = [
                notificationCenter.subscribe(NotificationCenter_1.NotificationCenter.DocumentEvent.VIEWPORT_CHANGED, onViewportChanged),
                notificationCenter.subscribe(NotificationCenter_1.NotificationCenter.DocumentEvent.LOADED, onDocumentLoaded),
            ];
            startPull();
        };
        trySubscribe(SUBSCRIBE_ATTEMPTS);
        return function () {
            cancelled = true;
            if (subscribeTimer) {
                clearTimeout(subscribeTimer);
            }
            if (pullTimer) {
                clearTimeout(pullTimer);
            }
            subscriptions.forEach(function (subscription) { return subscription.remove(); });
            subscriptions = [];
        };
    }, [viewRef, subscriptionGeneration]);
    // The resubscribe watchdog. `viewRef.current` is not reactive and the ref object itself never
    // changes, so no dependency array sees a remount of the view; compare after every render
    // instead. See `shouldResubscribeOverlay` for what that comparison has to get right.
    (0, react_1.useEffect)(function () {
        if ((0, overlayLayout_1.shouldResubscribeOverlay)(viewRef === null || viewRef === void 0 ? void 0 : viewRef.current, subscribedTo.current)) {
            // Geometry from the previous view does not describe the new one; drop it so items hide
            // instead of sitting at a position computed for a document that is no longer shown.
            setViewport(null);
            setSubscriptionGeneration(function (generation) { return generation + 1; });
        }
    });
    return (react_1.default.createElement(react_native_1.View, { style: [react_native_1.StyleSheet.absoluteFill, style], pointerEvents: "box-none" },
        react_1.default.createElement(OverlayContext.Provider, { value: { viewRef: viewRef, viewport: viewport } }, children)));
}
/**
 * A single overlay element anchored to a PDF coordinate on a given page.
 * Must be rendered inside a {@link NutrientOverlay}.
 */
function NutrientOverlayItem(props) {
    var _a;
    var pageIndex = props.pageIndex, position = props.position, disableAutoZoom = props.disableAutoZoom, onAppear = props.onAppear, onDisappear = props.onDisappear, children = props.children;
    var _b = (0, react_1.useContext)(OverlayContext), viewRef = _b.viewRef, viewport = _b.viewport;
    var _c = (0, react_1.useState)(null), screen = _c[0], setScreen = _c[1];
    var _d = (0, react_1.useState)({ width: 0, height: 0 }), size = _d[0], setSize = _d[1];
    var visibleRef = (0, react_1.useRef)(false);
    // Guards against out-of-order async conversion results overwriting newer ones.
    var generationRef = (0, react_1.useRef)(0);
    // Kept in refs so effects that don't depend on these callbacks (the
    // unmount-only effect, and the viewport effect below) always call the
    // latest onAppear/onDisappear instead of a stale one from a prior render.
    var onAppearRef = (0, react_1.useRef)(onAppear);
    onAppearRef.current = onAppear;
    var onDisappearRef = (0, react_1.useRef)(onDisappear);
    onDisappearRef.current = onDisappear;
    var setHidden = function () {
        var _a;
        if (visibleRef.current) {
            visibleRef.current = false;
            (_a = onDisappearRef.current) === null || _a === void 0 ? void 0 : _a.call(onDisappearRef);
        }
        setScreen(null);
    };
    (0, react_1.useEffect)(function () {
        return function () {
            var _a;
            // Balance onAppear if the item unmounts while visible. No setState here:
            // the component is going away.
            if (visibleRef.current) {
                visibleRef.current = false;
                (_a = onDisappearRef.current) === null || _a === void 0 ? void 0 : _a.call(onDisappearRef);
            }
        };
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        var api = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current;
        if (!api || !viewport) {
            // The view is gone (e.g. `NutrientView` unmounted); don't leave a stale
            // item rendered at its last known position.
            setHidden();
            return;
        }
        // Bumped before either path runs, so a native round-trip still in flight from a previous
        // viewport event is discarded even when this run resolves synchronously below.
        var generation = ++generationRef.current;
        // Fast path: the payload already describes where this item's page sits, so position from
        // it directly. Without this, tracking a pinch or fling costs one native round-trip per
        // item per event, each resolving a frame or more after the state it was computed for.
        var derived = (0, overlayLayout_1.computeOverlayItemScreenPoint)(position, pageIndex, viewport);
        if (derived) {
            setScreen(derived);
            if (!visibleRef.current) {
                visibleRef.current = true;
                (_a = onAppearRef.current) === null || _a === void 0 ? void 0 : _a.call(onAppearRef);
            }
            return;
        }
        // Slow path: the item is on a page the payload does not describe, e.g. the second page
        // visible in a continuous layout. Ask the native side about that page specifically.
        var cancelled = false;
        Promise.resolve(api.convertPointToScreen(pageIndex, position))
            .then(function (point) {
            var _a;
            if (cancelled || generation !== generationRef.current) {
                return;
            }
            if (point && typeof point.x === 'number' && typeof point.y === 'number') {
                setScreen({ x: point.x, y: point.y });
                if (!visibleRef.current) {
                    visibleRef.current = true;
                    (_a = onAppearRef.current) === null || _a === void 0 ? void 0 : _a.call(onAppearRef);
                }
            }
            else {
                // The page is not currently visible.
                setHidden();
            }
        })
            .catch(function () {
            if (cancelled || generation !== generationRef.current) {
                return;
            }
            setHidden();
        });
        return function () {
            cancelled = true;
        };
        // `position` is spread into primitives so an inline object literal does not
        // refire the effect on every render.
    }, [viewRef, viewport, pageIndex, position.x, position.y]);
    var onLayout = function (event) {
        var _a = event.nativeEvent.layout, width = _a.width, height = _a.height;
        setSize({ width: width, height: height });
    };
    if (!screen) {
        return null;
    }
    var _e = (0, overlayLayout_1.computeOverlayItemLayout)(screen, size, (_a = viewport === null || viewport === void 0 ? void 0 : viewport.zoomScale) !== null && _a !== void 0 ? _a : 1, disableAutoZoom !== null && disableAutoZoom !== void 0 ? disableAutoZoom : false), left = _e.left, top = _e.top, scale = _e.scale;
    return (react_1.default.createElement(react_native_1.View, { pointerEvents: "box-none", onLayout: onLayout, style: [
            styles.item,
            { left: left, top: top },
            scale !== 1 ? { transform: [{ scale: scale }] } : null,
        ] }, children));
}
var styles = react_native_1.StyleSheet.create({
    item: {
        position: 'absolute',
    },
});
