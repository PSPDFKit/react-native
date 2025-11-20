"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFErrorCode = exports.DocumentLoadFailedCode = exports.NotificationCenter = void 0;
var react_native_1 = require("react-native");
// Detect New Architecture using shared ArchitectureDetector
var ArchitectureDetector_1 = require("../ArchitectureDetector");
var isNA = (0, ArchitectureDetector_1.isNewArchitectureEnabled)();
/**
 * @class NotificationCenter
 * @description The Notification Center for the Nutrient React Native SDK.
 * @hideconstructor
 */
var NotificationCenter = /** @class */ (function () {
    /**
     * @ignore
     */
    function NotificationCenter(pdfViewRef) {
        this.subscribedEvents = new Map();
        this.eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.Nutrient);
        this.pdfViewRef = pdfViewRef;
    }
    /**
     * @private
     * @method getComponentId
     * @description Helper method to get the current componentId dynamically.
     * This ensures we always use the latest value, even after hot reload.
     */
    NotificationCenter.prototype.getComponentId = function () {
        return isNA ? this.pdfViewRef : (0, react_native_1.findNodeHandle)(this.pdfViewRef);
    };
    /**
     * @private
     * @method shouldDeliverEvent
     * @description Checks if an event should be delivered to this component instance.
     * Events are delivered if the componentID matches, or if it's an analytics event (global).
     */
    NotificationCenter.prototype.shouldDeliverEvent = function (payload, event) {
        var currentComponentId = this.getComponentId();
        var payloadComponentId = payload === null || payload === void 0 ? void 0 : payload.componentID;
        var isAnalytics = event === NotificationCenter.AnalyticsEvent.ANALYTICS;
        return payloadComponentId === currentComponentId || isAnalytics;
    };
    /**
    * @method subscribe
    * @memberof NotificationCenter
    * @param {string} event The event to subscribe to. Use NotificationCenter.DocumentEvent, NotificationCenter.AnnotationsEvent, etc. for type-safe events.
    * @param {function} callback The callback to be called when the event is triggered. The payload type is automatically inferred based on the event type.
    * @description Subscribes to a given Notification Center event.
    * @example
    * this.pdfRef.current?.notificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (payload: NotificationCenter.DocumentLoadedPayload) => {
    *   console.log('Document ID: ' + payload.documentID); // payload is typed as DocumentLoadedPayload
    * });
    */
    NotificationCenter.prototype.subscribe = function (event, callback) {
        var _this = this;
        if (isNA) {
            // New Architecture: subscribe via typed TurboModule EventEmitter properties
            // Lazy load the codegen module to avoid import errors in Paper architecture
            try {
                // @ts-ignore - dynamically require to avoid import errors in Paper architecture
                var Nutrient = require('../specs/NativeNutrientModule').default;
                // @ts-ignore dynamic property access for event name
                var emitter = Nutrient[event];
                if (typeof emitter === 'function') {
                    var subscription = emitter(function (payload) {
                        if (_this.shouldDeliverEvent(payload, event)) {
                            callback(payload.data);
                        }
                    });
                    this.subscribedEvents.set(event, subscription);
                }
                else {
                    var subscription = this.eventEmitter.addListener(event, function (payload) {
                        if (_this.shouldDeliverEvent(payload, event)) {
                            callback(payload.data);
                        }
                    });
                    this.subscribedEvents.set(event, subscription);
                }
            }
            catch (e) {
                // Fallback to old emitter if codegen module is not available
                var subscription = this.eventEmitter.addListener(event, function (payload) {
                    if (_this.shouldDeliverEvent(payload, event)) {
                        callback(payload.data);
                    }
                });
                this.subscribedEvents.set(event, subscription);
            }
        }
        else {
            // Old Architecture: Use NativeEventEmitter
            var subscription = this.eventEmitter.addListener(event, function (payload) {
                // Only deliver events to the specific ref it is subscribed to. Allow any analytics events to be delivered since they are not associated with a specific view.
                if (_this.shouldDeliverEvent(payload, event)) {
                    callback(payload.data);
                }
            });
            this.subscribedEvents.set(event, subscription);
        }
        react_native_1.NativeModules.Nutrient.handleListenerAdded(event, this.getComponentId());
    };
    /**
     * @method unsubscribe
     * @memberof NotificationCenter
     * @param {string} event The event to unsubscribe from.
     * @description Unsubscribes from a given Notification Center event.
     * @example
     * this.pdfRef.current?.notificationCenter().unsubscribe('documentLoaded');
     */
    NotificationCenter.prototype.unsubscribe = function (event) {
        var subscription = this.subscribedEvents.get(event);
        if (subscription) {
            subscription.remove();
            this.subscribedEvents.delete(event);
            react_native_1.NativeModules.Nutrient.handleListenerRemoved(event, this.getComponentId());
        }
    };
    /**
     * @method unsubscribeAllEvents
     * @memberof NotificationCenter
     * @description Unsubscribes from all Notification Center events.
     * @example
     * this.pdfRef.current?.notificationCenter().unsubscribeAllEvents();
     */
    NotificationCenter.prototype.unsubscribeAllEvents = function () {
        var _this = this;
        this.subscribedEvents.forEach(function (subscription, event) {
            subscription.remove();
            _this.subscribedEvents.delete(event);
            react_native_1.NativeModules.Nutrient.handleListenerRemoved(event, _this.getComponentId());
        });
    };
    return NotificationCenter;
}());
exports.NotificationCenter = NotificationCenter;
(function (NotificationCenter) {
    /**
     * Document events.
     * @readonly
     * @enum {string} DocumentEvent
     */
    NotificationCenter.DocumentEvent = {
        /**
         * Called when the document has been loaded.
         */
        LOADED: 'documentLoaded',
        /**
         * Called when the document failed to load.
         */
        LOAD_FAILED: 'documentLoadFailed',
        /**
         * Called when the document page changed.
         */
        PAGE_CHANGED: 'documentPageChanged',
        /**
         * Called when the document is scrolled.
         */
        SCROLLED: 'documentScrolled',
        /**
         * Called when the document is tapped.
         */
        TAPPED: 'documentTapped',
    };
    /**
     * Document load failure error codes.
     * @readonly
     * @enum {string} DocumentLoadFailedCode
     */
    NotificationCenter.DocumentLoadFailedCode = {
        /**
         * Document is corrupted or invalid.
         */
        CORRUPT: 'CORRUPTED',
        /**
         * Document is encrypted and requires a password.
         */
        ENCRYPTED: 'ENCRYPTED',
    };
    /**
    * Annotation events.
    * @readonly
    * @enum {string} AnnotationsEvent
    */
    NotificationCenter.AnnotationsEvent = {
        /**
         * Called when one or more annotations have been added.
         */
        ADDED: 'annotationsAdded',
        /**
         * Called when an existing annotation has been changed.
         */
        CHANGED: 'annotationChanged',
        /**
         * Called when one or more annotations have been removed.
         */
        REMOVED: 'annotationsRemoved',
        /**
         * Called when one or more annotations have been selected.
         */
        SELECTED: 'annotationsSelected',
        /**
         * Called when one or more annotations have been deselected.
         */
        DESELECTED: 'annotationsDeselected',
        /**
         * Called when a user taps on an annotation.
         */
        TAPPED: 'annotationTapped',
    };
    /**
     * Text Selection events.
     * @readonly
     * @enum {string} TextEvent
     */
    NotificationCenter.TextEvent = {
        /**
         * Called when a text selection has been made.
         */
        SELECTED: 'textSelected',
    };
    /**
     * FormField events.
     * @readonly
     * @enum {string} FormFieldEvent
     */
    NotificationCenter.FormFieldEvent = {
        /**
         * Called when form field values have changed.
         */
        VALUES_UPDATED: 'formFieldValuesUpdated',
        /**
         * Called when a form field has been selected.
         */
        SELECTED: 'formFieldSelected',
        /**
         * Called when a form field has been deselected.
         */
        DESELECTED: 'formFieldDeselected',
    };
    /**
     * Bookmarks events.
     * @readonly
     * @enum {string} BookmarksEvent
     */
    NotificationCenter.BookmarksEvent = {
        /**
         * Called when the bookmarks have been changed.
         */
        CHANGED: 'bookmarksChanged',
    };
    /**
     * Analytics events.
     * @readonly
     * @enum {string} AnalyticsEvent
     */
    NotificationCenter.AnalyticsEvent = {
        /**
         * Called when any analytics event has been triggered.
         */
        ANALYTICS: 'analytics',
    };
})(NotificationCenter || (exports.NotificationCenter = NotificationCenter = {}));
// Re-export error code enum with a more convenient name
exports.DocumentLoadFailedCode = NotificationCenter.DocumentLoadFailedCode;
// Alias for convenience (users can use either name)
exports.PDFErrorCode = NotificationCenter.DocumentLoadFailedCode;
