"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var forwardRef = React.forwardRef, useImperativeHandle = React.useImperativeHandle, useMemo = React.useMemo;
var NutrientViewNativeComponent_1 = __importDefault(require("./specs/NutrientViewNativeComponent"));
var PDFDocument_1 = require("./document/PDFDocument");
var NotificationCenter_1 = require("./notification-center/NotificationCenter");
// @ts-ignore
var NativeNutrientViewTurboModule_1 = __importDefault(require("./specs/NativeNutrientViewTurboModule"));
// Fabric component using the actual native component
var NutrientViewFabric = forwardRef(function (props, ref) {
    var _a;
    // Generate a unique identifier for this component instance
    var instanceId = useMemo(function () { return Math.floor(Math.random() * 1000000000); }, []);
    // Store instances directly - same pattern as Paper's this._pdfDocument
    var pdfDocumentInstance = null;
    var notificationCenterInstance = null;
    useImperativeHandle(ref, function () { return ({
        getDocument: function () {
            if (pdfDocumentInstance == null) {
                // Pass the instanceId to PDFDocument constructor - same as Paper's this._componentRef.current
                pdfDocumentInstance = new PDFDocument_1.PDFDocument(instanceId);
            }
            return pdfDocumentInstance;
        },
        getNotificationCenter: function () {
            if (notificationCenterInstance == null) {
                // Pass the instanceId to NotificationCenter constructor - same as Paper's this._componentRef.current
                notificationCenterInstance = new NotificationCenter_1.NotificationCenter(instanceId);
            }
            return notificationCenterInstance;
        },
        // Expose all commands directly on the ref - Paper-style API with NativeModules
        enterAnnotationCreationMode: function (annotationType) {
            return NativeNutrientViewTurboModule_1.default.enterAnnotationCreationMode(instanceId.toString(), annotationType);
        },
        exitCurrentlyActiveMode: function () {
            return NativeNutrientViewTurboModule_1.default.exitCurrentlyActiveMode(instanceId.toString());
        },
        setToolbar: function (toolbar) {
            NativeNutrientViewTurboModule_1.default.setToolbar(instanceId.toString(), JSON.stringify(toolbar));
        },
        getToolbar: function (viewMode) {
            return NativeNutrientViewTurboModule_1.default.getToolbar(instanceId.toString(), viewMode);
        },
        clearSelectedAnnotations: function () {
            return NativeNutrientViewTurboModule_1.default.clearSelectedAnnotations(instanceId.toString());
        },
        selectAnnotations: function (annotations, showContextualMenu) {
            return NativeNutrientViewTurboModule_1.default.selectAnnotations(instanceId.toString(), JSON.stringify(annotations), showContextualMenu);
        },
        setPageIndex: function (pageIndex, animated) {
            return NativeNutrientViewTurboModule_1.default.setPageIndex(instanceId.toString(), pageIndex, animated);
        },
        setMeasurementValueConfigurations: function (configurations) {
            return NativeNutrientViewTurboModule_1.default.setMeasurementValueConfigurations(instanceId.toString(), configurations);
        },
        getMeasurementValueConfigurations: function () {
            return NativeNutrientViewTurboModule_1.default.getMeasurementValueConfigurations(instanceId.toString());
        },
        getConfiguration: function () {
            return NativeNutrientViewTurboModule_1.default.getConfiguration(instanceId.toString());
        },
        setExcludedAnnotations: function (annotations) {
            NativeNutrientViewTurboModule_1.default.setExcludedAnnotations(instanceId.toString(), annotations);
        },
        setUserInterfaceVisible: function (visible) {
            return NativeNutrientViewTurboModule_1.default.setUserInterfaceVisible(instanceId.toString(), visible);
        },
        destroyView: function () {
            NativeNutrientViewTurboModule_1.default.destroyView(instanceId.toString());
        }
    }); }, [instanceId]);
    var fabricProps = __assign(__assign({}, props), { configurationJSONString: props.configuration ? JSON.stringify(props.configuration) : undefined, toolbarJSONString: props.toolbar ? JSON.stringify(props.toolbar) : undefined, menuItemGroupingJSONString: props.menuItemGrouping
            ? JSON.stringify(props.menuItemGrouping)
            : undefined, annotationContextualMenuJSONString: props.annotationContextualMenu
            ? JSON.stringify(props.annotationContextualMenu)
            : undefined, availableFontNamesJSONString: props.availableFontNames
            ? JSON.stringify(props.availableFontNames)
            : undefined, 
        // Ensure parity with Paper default
        fragmentTag: (_a = props.fragmentTag) !== null && _a !== void 0 ? _a : 'NutrientView.FragmentTag', 
        // Back-compat wrapper: pass Paper-shaped payloads to user callbacks
        onDocumentLoaded: props.onDocumentLoaded
            ? function (e) {
                // Paper passed an empty object
                props.onDocumentLoaded({});
            }
            : undefined, onStateChanged: props.onStateChanged
            ? function (e) {
                var _a;
                // Same as Paper: pass event.nativeEvent directly
                props.onStateChanged((_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e);
            }
            : undefined, onCustomToolbarButtonTapped: props.onCustomToolbarButtonTapped
            ? function (e) {
                var _a, _b;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                var buttonId = (_b = native === null || native === void 0 ? void 0 : native.buttonId) !== null && _b !== void 0 ? _b : native === null || native === void 0 ? void 0 : native.id;
                props.onCustomToolbarButtonTapped({ id: buttonId });
            }
            : undefined, onCustomAnnotationContextualMenuItemTapped: props.onCustomAnnotationContextualMenuItemTapped
            ? function (e) {
                var _a;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                props.onCustomAnnotationContextualMenuItemTapped({ id: native === null || native === void 0 ? void 0 : native.id });
            }
            : undefined, onCloseButtonPressed: props.onCloseButtonPressed
            ? function (_e) {
                // Paper passed an empty object
                props.onCloseButtonPressed({});
            }
            : undefined, onDocumentLoadFailed: props.onDocumentLoadFailed
            ? function (e) {
                var _a, _b, _c, _d;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                props.onDocumentLoadFailed({
                    code: (_b = native === null || native === void 0 ? void 0 : native.code) !== null && _b !== void 0 ? _b : 'CORRUPTED',
                    message: (_d = (_c = native === null || native === void 0 ? void 0 : native.message) !== null && _c !== void 0 ? _c : native === null || native === void 0 ? void 0 : native.error) !== null && _d !== void 0 ? _d : 'Document failed to load'
                });
            }
            : undefined, onDocumentSaved: props.onDocumentSaved
            ? function (_e) {
                // Paper passed an empty object
                props.onDocumentSaved({});
            }
            : undefined, onDocumentSaveFailed: props.onDocumentSaveFailed
            ? function (e) {
                var _a;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                props.onDocumentSaveFailed({ error: native === null || native === void 0 ? void 0 : native.error });
            }
            : undefined, onAnnotationsChanged: props.onAnnotationsChanged
            ? function (e) {
                var _a;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                var change = native === null || native === void 0 ? void 0 : native.change;
                var json = native === null || native === void 0 ? void 0 : native.annotationsJSONString;
                var annotations = [];
                if (typeof json === 'string') {
                    try {
                        annotations = JSON.parse(json);
                    }
                    catch (_b) {
                        annotations = [];
                    }
                }
                props.onAnnotationsChanged({ change: change, annotations: annotations });
            }
            : undefined, onReady: props.onReady
            ? function (_e) {
                // Paper passed an empty object
                props.onReady({});
            }
            : undefined, 
        // Convert numeric instanceId to string for React Native nativeID
        nativeID: instanceId.toString() });
    try {
        // Render the native component that communicates with ReactPdfViewManagerFabric
        var nativeComponent = React.createElement(NutrientViewNativeComponent_1.default, fabricProps);
        return nativeComponent;
    }
    catch (error) {
        // Fallback to a simple view for debugging
        return React.createElement('View', {
            style: { backgroundColor: 'red', width: 100, height: 100 }
        }, React.createElement('Text', {}, 'Fabric Error'));
    }
});
NutrientViewFabric.displayName = 'NutrientViewFabric';
exports.default = NutrientViewFabric;
