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
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        var retryTimer;
        var subscription;
        var onViewportChanged = function (payload) {
            if (!cancelled) {
                setViewport(payload);
            }
        };
        var trySubscribe = function () {
            if (cancelled) {
                return;
            }
            var api = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current;
            var notificationCenter = api === null || api === void 0 ? void 0 : api.getNotificationCenter();
            if (!api || !notificationCenter) {
                // The native view may not be mounted yet; retry until it is.
                retryTimer = setTimeout(trySubscribe, 100);
                return;
            }
            subscription = notificationCenter.subscribe(NotificationCenter_1.NotificationCenter.DocumentEvent.VIEWPORT_CHANGED, onViewportChanged);
            // Pull the current state so items position before the first scroll/zoom.
            Promise.resolve(api.getViewportState())
                .then(function (state) {
                if (!cancelled && state) {
                    setViewport(state);
                }
            })
                .catch(function () {
                /* No page visible yet; the event will deliver the first state. */
            });
        };
        trySubscribe();
        return function () {
            cancelled = true;
            if (retryTimer) {
                clearTimeout(retryTimer);
            }
            subscription === null || subscription === void 0 ? void 0 : subscription.remove();
        };
    }, [viewRef]);
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
        var api = viewRef === null || viewRef === void 0 ? void 0 : viewRef.current;
        if (!api || !viewport) {
            // The view is gone (e.g. `NutrientView` unmounted); don't leave a stale
            // item rendered at its last known position.
            setHidden();
            return;
        }
        var generation = ++generationRef.current;
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
