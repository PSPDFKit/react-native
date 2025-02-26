"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
var react_native_1 = require("react-native");
/**
 * @class NotificationCenter
 * @description The Notification Center for the Nutrient React Native SDK.
 *
 */
var NotificationCenter = /** @class */ (function () {
    /**
     * @ignore
     */
    function NotificationCenter(pdfViewRef) {
        this.subscribedEvents = new Map();
        this.eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.PSPDFKit);
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
        var subscription = this.eventEmitter.addListener(event, callback);
        this.subscribedEvents.set(event, subscription);
        react_native_1.NativeModules.PSPDFKit.handleListenerAdded(event);
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
            var isLast = this.subscribedEvents.size === 0 ? true : false;
            react_native_1.NativeModules.PSPDFKit.handleListenerRemoved(event, isLast);
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
            var isLast = _this.subscribedEvents.size === 0 ? true : false;
            react_native_1.NativeModules.PSPDFKit.handleListenerRemoved(event, isLast);
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
         * Called when a user taps on an annotation but before the SDK continues handling the touch in the ```annotationsSelected``` callback.
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
