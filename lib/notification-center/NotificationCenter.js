"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
var react_native_1 = require("react-native");
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
     * @method subscribe
     * @memberof NotificationCenter
     * @param {string} event The event to subscribe to.
     * @param {any} callback The callback to be called when the event is triggered.
     * @description Subscribes to a given Notification Center event.
     * @example
     * this.pdfRef.current?.notificationCenter().subscribe('documentLoaded', (result) => {
     *   console.log('Document Callback: ' + result);
     * });
     */
    NotificationCenter.prototype.subscribe = function (event, callback) {
        var _this = this;
        var subscription = this.eventEmitter.addListener(event, function (payload) {
            // Only deliver events to the specific ref it is subscribed to. Allow any analytics events to be delivered since they are not associated with a specific view.
            if ((payload === null || payload === void 0 ? void 0 : payload.componentID) === (0, react_native_1.findNodeHandle)(_this.pdfViewRef) || event === NotificationCenter.AnalyticsEvent.ANALYTICS)
                callback(payload.data);
        });
        this.subscribedEvents.set(event, subscription);
        react_native_1.NativeModules.Nutrient.handleListenerAdded(event, (0, react_native_1.findNodeHandle)(this.pdfViewRef));
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
            react_native_1.NativeModules.Nutrient.handleListenerRemoved(event, (0, react_native_1.findNodeHandle)(this.pdfViewRef));
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
            react_native_1.NativeModules.Nutrient.handleListenerRemoved(event, (0, react_native_1.findNodeHandle)(_this.pdfViewRef));
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
