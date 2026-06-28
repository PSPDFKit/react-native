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
var NutrientInstantViewNativeComponent_1 = __importDefault(require("./specs/NutrientInstantViewNativeComponent"));
var PDFDocument_1 = require("./document/PDFDocument");
var NotificationCenter_1 = require("./notification-center/NotificationCenter");
// @ts-ignore
var NativeNutrientInstantViewTurboModule_1 = __importDefault(require("./specs/NativeNutrientInstantViewTurboModule"));
var NutrientInstantViewFabric = forwardRef(function (props, ref) {
    var _a;
    var instanceId = useMemo(function () { return Math.floor(Math.random() * 1000000000); }, []);
    var pdfDocumentInstance = null;
    var notificationCenterInstance = null;
    useImperativeHandle(ref, function () { return ({
        getDocument: function () {
            if (pdfDocumentInstance == null) {
                pdfDocumentInstance = new PDFDocument_1.PDFDocument(instanceId);
            }
            return pdfDocumentInstance;
        },
        getNotificationCenter: function () {
            if (notificationCenterInstance == null) {
                notificationCenterInstance = new NotificationCenter_1.NotificationCenter(instanceId);
            }
            return notificationCenterInstance;
        },
        enterAnnotationCreationMode: function (annotationType) {
            return NativeNutrientInstantViewTurboModule_1.default.enterAnnotationCreationMode(instanceId.toString(), annotationType);
        },
        enterContentEditingMode: function () {
            return NativeNutrientInstantViewTurboModule_1.default.enterContentEditingMode(instanceId.toString());
        },
        exitCurrentlyActiveMode: function () {
            return NativeNutrientInstantViewTurboModule_1.default.exitCurrentlyActiveMode(instanceId.toString());
        },
        setToolbar: function (toolbar) {
            NativeNutrientInstantViewTurboModule_1.default.setToolbar(instanceId.toString(), JSON.stringify(toolbar));
        },
        getToolbar: function (viewMode) {
            return NativeNutrientInstantViewTurboModule_1.default.getToolbar(instanceId.toString(), viewMode);
        },
        setPageIndex: function (pageIndex, animated) {
            return NativeNutrientInstantViewTurboModule_1.default.setPageIndex(instanceId.toString(), pageIndex, animated);
        },
        setMeasurementValueConfigurations: function (configurations) {
            return NativeNutrientInstantViewTurboModule_1.default.setMeasurementValueConfigurations(instanceId.toString(), configurations);
        },
        getMeasurementValueConfigurations: function () {
            return NativeNutrientInstantViewTurboModule_1.default.getMeasurementValueConfigurations(instanceId.toString());
        },
        getConfiguration: function () {
            return NativeNutrientInstantViewTurboModule_1.default.getConfiguration(instanceId.toString());
        },
        setExcludedAnnotations: function (annotations) {
            NativeNutrientInstantViewTurboModule_1.default.setExcludedAnnotations(instanceId.toString(), annotations);
        },
        setUserInterfaceVisible: function (visible) {
            return NativeNutrientInstantViewTurboModule_1.default.setUserInterfaceVisible(instanceId.toString(), visible);
        },
        destroyView: function () {
            NativeNutrientInstantViewTurboModule_1.default.destroyView(instanceId.toString());
        },
        executeAction: function (requestId, allow) {
            return NativeNutrientInstantViewTurboModule_1.default.executeAction(instanceId.toString(), requestId, allow);
        },
    }); }, [instanceId]);
    var fabricProps = __assign(__assign({}, props), { disableDefaultActionForTappedAnnotations: props.disableDefaultActionForTappedAnnotations === true, configurationJSONString: props.configuration ? JSON.stringify(props.configuration) : undefined, toolbarJSONString: props.toolbar ? JSON.stringify(props.toolbar) : undefined, menuItemGroupingJSONString: props.menuItemGrouping
            ? JSON.stringify(props.menuItemGrouping)
            : undefined, annotationContextualMenuJSONString: props.annotationContextualMenu
            ? JSON.stringify(props.annotationContextualMenu)
            : undefined, textSelectionContextualMenuJSONString: props.textSelectionContextualMenu
            ? JSON.stringify(props.textSelectionContextualMenu)
            : undefined, availableFontNamesJSONString: props.availableFontNames
            ? JSON.stringify(props.availableFontNames)
            : undefined, fragmentTag: (_a = props.fragmentTag) !== null && _a !== void 0 ? _a : 'NutrientInstantView.FragmentTag', onCustomToolbarButtonTapped: props.onCustomToolbarButtonTapped
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
                props.onCloseButtonPressed({});
            }
            : undefined, onShouldExecuteAction: props.onShouldExecuteAction
            ? function (e) {
                var _a;
                var native = (_a = e === null || e === void 0 ? void 0 : e.nativeEvent) !== null && _a !== void 0 ? _a : e;
                props.onShouldExecuteAction(native);
            }
            : undefined, onReady: props.onReady
            ? function (_e) {
                props.onReady({});
            }
            : undefined, hasShouldExecuteAction: !!props.onShouldExecuteAction, nativeID: instanceId.toString() });
    try {
        return React.createElement(NutrientInstantViewNativeComponent_1.default, fabricProps);
    }
    catch (error) {
        return React.createElement('View', { style: { backgroundColor: 'red', width: 100, height: 100 } }, React.createElement('Text', {}, 'Fabric Error'));
    }
});
NutrientInstantViewFabric.displayName = 'NutrientInstantViewFabric';
exports.default = NutrientInstantViewFabric;
