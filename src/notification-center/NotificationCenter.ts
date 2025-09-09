import {
    findNodeHandle,
    NativeModules,
    NativeEventEmitter
    // @ts-ignore
  } from 'react-native';

  /**
   * @class NotificationCenter
   * @description The Notification Center for the Nutrient React Native SDK.
   * @hideconstructor
   */
  export class NotificationCenter {
  
    subscribedEvents = new Map<string, any>();
    eventEmitter = new NativeEventEmitter(NativeModules.Nutrient);
    pdfViewRef: any;

    /**
     * @ignore
     */
     constructor(pdfViewRef: any) {
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
    subscribe(event: string, callback: any): void {
      const subscription = this.eventEmitter.addListener(event, (payload: any) => {
        // Only deliver events to the specific ref it is subscribed to. Allow any analytics events to be delivered since they are not associated with a specific view.
        if (payload?.componentID === findNodeHandle(this.pdfViewRef) || event === NotificationCenter.AnalyticsEvent.ANALYTICS) callback(payload.data);
      });
      this.subscribedEvents.set(event, subscription);
      NativeModules.Nutrient.handleListenerAdded(event, findNodeHandle(this.pdfViewRef));
    }

   /**
    * @method unsubscribe
    * @memberof NotificationCenter
    * @param {string} event The event to unsubscribe from.
    * @description Unsubscribes from a given Notification Center event.
    * @example
    * this.pdfRef.current?.notificationCenter().unsubscribe('documentLoaded');
    */
    unsubscribe(event: string): void {
      const subscription = this.subscribedEvents.get(event);
      if (subscription) {
        subscription.remove();
        this.subscribedEvents.delete(event);
        NativeModules.Nutrient.handleListenerRemoved(event, findNodeHandle(this.pdfViewRef));
      }
    }

   /**
    * @method unsubscribeAllEvents
    * @memberof NotificationCenter
    * @description Unsubscribes from all Notification Center events.
    * @example
    * this.pdfRef.current?.notificationCenter().unsubscribeAllEvents();
    */
   unsubscribeAllEvents(): void {
    this.subscribedEvents.forEach((subscription: any, event: string) => {
      subscription.remove();
      this.subscribedEvents.delete(event);
      NativeModules.Nutrient.handleListenerRemoved(event, findNodeHandle(this.pdfViewRef));
    });
  }
  }

  export namespace NotificationCenter {
    /**
     * Document events.
     * @readonly
     * @enum {string} DocumentEvent
     */
    export const DocumentEvent = {
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
     } as const;

     /**
     * Annotation events.
     * @readonly
     * @enum {string} AnnotationsEvent
     */
    export const AnnotationsEvent = {
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
    } as const;

    /**
     * Text Selection events.
     * @readonly
     * @enum {string} TextEvent
     */
    export const TextEvent = {
      /**
       * Called when a text selection has been made.
       */
       SELECTED: 'textSelected',
    } as const;

    /**
     * FormField events.
     * @readonly
     * @enum {string} FormFieldEvent
     */
    export const FormFieldEvent = {
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
    } as const;

    /**
     * Bookmarks events.
     * @readonly
     * @enum {string} BookmarksEvent
     */
    export const BookmarksEvent = {
      /**
       * Called when the bookmarks have been changed.
       */
      CHANGED: 'bookmarksChanged',
    } as const;

    /**
     * Analytics events.
     * @readonly
     * @enum {string} AnalyticsEvent
     */
    export const AnalyticsEvent = {
     /**
      * Called when any analytics event has been triggered.
      */
      ANALYTICS: 'analytics',
    } as const;

    export type DocumentEvent = ValueOf<typeof DocumentEvent>;
    export type AnnotationsEvent = ValueOf<typeof AnnotationsEvent>;
    export type TextEvent = ValueOf<typeof TextEvent>;
    export type FormFieldEvent = ValueOf<typeof FormFieldEvent>;
    export type AnalyticsEvent = ValueOf<typeof AnalyticsEvent>;
    export type BookmarksEvent = ValueOf<typeof BookmarksEvent>;
    type ValueOf<T> = T[keyof T];
}