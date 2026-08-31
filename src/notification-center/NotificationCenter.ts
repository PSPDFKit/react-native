import {
    findNodeHandle,
    NativeModules,
    NativeEventEmitter
    // @ts-ignore
  } from 'react-native';
// Detect New Architecture using shared ArchitectureDetector
import { isNewArchitectureEnabled } from '../ArchitectureDetector';
const isNA: boolean = isNewArchitectureEnabled();

  /**
   * @class NotificationCenter
   * @description The Notification Center for the Nutrient React Native SDK.
   * @hideconstructor
   */
  export class NotificationCenter {
  
    subscribedEvents = new Map<string, NotificationCenter.Subscription[]>();
    eventEmitter = new NativeEventEmitter(NativeModules.Nutrient);
    pdfViewRef: any;

    /**
     * @ignore
     */
     constructor(pdfViewRef: any) {
       this.pdfViewRef = pdfViewRef;
     }

    /**
     * @private
     * @method getComponentId
     * @description Helper method to get the current componentId dynamically.
     * This ensures we always use the latest value, even after hot reload.
     */
    private getComponentId(): any {
      return isNA ? this.pdfViewRef : findNodeHandle(this.pdfViewRef);
    }

    /**
     * @private
     * @method shouldDeliverEvent
     * @description Checks if an event should be delivered to this component instance.
     * Events are delivered if the componentID matches, or if it's an analytics event (global).
     */
    private shouldDeliverEvent(payload: any, event: string): boolean {
      const currentComponentId = this.getComponentId();
      const payloadComponentId = payload?.componentID;
      const isAnalytics = event === NotificationCenter.AnalyticsEvent.ANALYTICS;
      return payloadComponentId === currentComponentId || isAnalytics;
    }

    subscribe<T extends keyof NotificationCenter.EventPayloadMap>(
      event: T,
      callback: (payload: NotificationCenter.EventPayloadMap[T]) => void
    ): NotificationCenter.Subscription;
    subscribe(event: string, callback: (payload: any) => void): NotificationCenter.Subscription;
    /**
    * @method subscribe
    * @memberof NotificationCenter
    * @param {string} event The event to subscribe to. Use NotificationCenter.DocumentEvent, NotificationCenter.AnnotationsEvent, etc. for type-safe events.
    * @param {function} callback The callback to be called when the event is triggered. The payload type is automatically inferred based on the event type.
    * @returns {NotificationCenter.Subscription} A handle that removes this listener when its ``remove`` method is called. Multiple listeners can be subscribed to the same event; each handle removes only its own listener.
    * @description Subscribes to a given Notification Center event.
    * @example
    * const subscription = this.pdfRef.current?.notificationCenter().subscribe(NotificationCenter.DocumentEvent.LOADED, (payload: NotificationCenter.DocumentLoadedPayload) => {
    *   console.log('Document ID: ' + payload.documentID); // payload is typed as DocumentLoadedPayload
    * });
    * // Later:
    * subscription.remove();
    */
    subscribe<T extends keyof NotificationCenter.EventPayloadMap>(
      event: T | string,
      callback: (payload: NotificationCenter.EventPayloadMap[T] | any) => void
    ): NotificationCenter.Subscription {
      const deliver = (payload: any) => {
        // Only deliver events to the specific ref it is subscribed to. Allow any analytics events to be delivered since they are not associated with a specific view.
        if (this.shouldDeliverEvent(payload, event)) {
          callback(payload.data);
        }
      };

      let emitterSubscription: any;
      if (isNA) {
        // New Architecture: subscribe via typed TurboModule EventEmitter properties
        // Lazy load the codegen module to avoid import errors in Paper architecture
        try {
          // @ts-ignore - dynamically require to avoid import errors in Paper architecture
          const Nutrient = require('../specs/NativeNutrientModule').default;
          // @ts-ignore dynamic property access for event name
          const emitter = (Nutrient as any)[event];
          if (typeof emitter === 'function') {
            emitterSubscription = emitter(deliver);
          } else {
            emitterSubscription = this.eventEmitter.addListener(event, deliver);
          }
        } catch (e) {
          // Fallback to old emitter if codegen module is not available
          emitterSubscription = this.eventEmitter.addListener(event, deliver);
        }
      } else {
        // Old Architecture: Use NativeEventEmitter
        emitterSubscription = this.eventEmitter.addListener(event, deliver);
      }

      const subscription: NotificationCenter.Subscription = {
        remove: () => this.removeSubscription(event, subscription, emitterSubscription),
      };
      const subscriptions = this.subscribedEvents.get(event);
      if (subscriptions) {
        subscriptions.push(subscription);
      } else {
        this.subscribedEvents.set(event, [subscription]);
        // Notify native only for the first listener of an event, paired with
        // the notification for the last removal in removeSubscription.
        NativeModules.Nutrient.handleListenerAdded(event, this.getComponentId());
      }
      return subscription;
    }

    /**
     * @private
     * @method removeSubscription
     * @description Removes a single listener, notifying native when the last
     * listener for the event is gone. Safe to call more than once.
     */
    private removeSubscription(
      event: string,
      subscription: NotificationCenter.Subscription,
      emitterSubscription: any
    ): void {
      const subscriptions = this.subscribedEvents.get(event);
      if (!subscriptions || !subscriptions.includes(subscription)) {
        return;
      }
      emitterSubscription.remove();
      const remaining = subscriptions.filter(existing => existing !== subscription);
      if (remaining.length === 0) {
        this.subscribedEvents.delete(event);
        NativeModules.Nutrient.handleListenerRemoved(event, this.getComponentId());
      } else {
        this.subscribedEvents.set(event, remaining);
      }
    }

   /**
    * @method unsubscribe
    * @memberof NotificationCenter
    * @param {string} event The event to unsubscribe from.
    * @description Unsubscribes all listeners from a given Notification Center event. To remove a single listener, call ``remove`` on the subscription returned by ``subscribe`` instead.
    * @example
    * this.pdfRef.current?.notificationCenter().unsubscribe('documentLoaded');
    */
    unsubscribe(event: string): void {
      const subscriptions = this.subscribedEvents.get(event);
      if (subscriptions) {
        [...subscriptions].forEach(subscription => subscription.remove());
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
    Array.from(this.subscribedEvents.keys()).forEach(event =>
      this.unsubscribe(event),
    );
  }
  }

  export namespace NotificationCenter {
    /**
     * A handle to an active event listener, returned by ``subscribe``.
     * @interface Subscription
     */
    export interface Subscription {
      /**
       * Removes this listener. Safe to call more than once; only the first
       * call has an effect.
       */
      remove(): void;
    }

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
      * Called when the document viewport (zoom or scroll) changes. The payload carries
      * the current transformation state so custom overlays can be positioned in sync
      * with the rendered document.
      */
      VIEWPORT_CHANGED: 'documentViewportChanged',
     /**
      * Called when the document is tapped.
      */
       TAPPED: 'documentTapped',
     } as const;

    /**
     * Document load failure error codes.
     * @readonly
     * @enum {string} DocumentLoadFailedCode
     */
    export const DocumentLoadFailedCode = {
     /**
      * Document is corrupted or invalid.
      */
      CORRUPT: 'CORRUPTED',
     /**
      * Document is encrypted and requires a password.
      */
      ENCRYPTED: 'ENCRYPTED',
    } as const satisfies Record<string, string>;

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

    /**
     * Type-safe payload types for each event
     */
    export type DocumentLoadedPayload = {
      event: typeof DocumentEvent.LOADED;
      documentID: string;
    };

    export type DocumentLoadFailedPayload = {
      event: typeof DocumentEvent.LOAD_FAILED;
      code: typeof DocumentLoadFailedCode[keyof typeof DocumentLoadFailedCode];
      message: string;
    };

    export type DocumentPageChangedPayload = {
      event: typeof DocumentEvent.PAGE_CHANGED;
      pageIndex: number;
      documentID: string;
    };

    export type DocumentScrolledPayload = {
      event: typeof DocumentEvent.SCROLLED;
      scrollData: { currX?: number; currY?: number };
      documentID: string;
    };

    /**
     * Rectangle expressed in the document (PDF) coordinate space, in PDF points.
     */
    export type PdfRect = { x: number; y: number; width: number; height: number };

    /**
     * Size expressed in the document (PDF) coordinate space, in PDF points.
     */
    export type PdfSize = { width: number; height: number };

    export type DocumentViewportChangedPayload = {
      event: typeof DocumentEvent.VIEWPORT_CHANGED;
      /** Identifier of the document currently displayed. */
      documentID: string;
      /** The primary (most visible) page index for which `visiblePdfRect` is reported. */
      pageIndex: number;
      /**
       * Current zoom factor of the view, relative to the zoom level at which the page fits
       * the viewport. It is `1` at the fitting zoom level, so it is *not* the ratio between
       * PDF points and screen points: use `pdfToScreenScale` for that.
       */
      zoomScale: number;
      /**
       * Screen points per PDF point on `pageIndex`, at the current zoom level. Multiplying a
       * distance in PDF points by this value gives the distance on screen.
       */
      pdfToScreenScale: number;
      /**
       * Visible region of `pageIndex`, expressed in PDF points and clipped to the page, so it
       * is never larger than `pageSize` and never has a negative origin. Its origin is the
       * PDF's bottom-left, so `y` is the distance from the bottom of the page. All zeros while
       * the reported page is momentarily off screen, which can happen for a frame or two during
       * a fling; the other fields stay valid.
       */
      visiblePdfRect: PdfRect;
      /** Size of `pageIndex`, in PDF points. Accounts for page rotation. */
      pageSize: PdfSize;
      /**
       * Content offset of the scroll view, in screen points, relative to `pageIndex`'s
       * top-left: a `y` of `40` means the page's top edge sits 40 points above the top of the
       * viewport. Since `pageIndex` is whichever page is currently anchored, this jumps
       * discontinuously when the anchor page changes, e.g. scrolling past a page boundary. It
       * is not a document-absolute offset.
       */
      contentOffset: { x: number; y: number };
      /** Size of the viewport, in screen points. */
      viewportSize: { width: number; height: number };
    };

    export type DocumentTappedPayload = {
      event: typeof DocumentEvent.TAPPED;
      point: { x: number; y: number };
      pageIndex: number;
      documentID: string;
    };

    export type AnnotationsAddedPayload = {
      event: typeof AnnotationsEvent.ADDED;
      annotations: Record<string, any>[];
      documentID: string;
    };

    export type AnnotationChangedPayload = {
      event: typeof AnnotationsEvent.CHANGED;
      annotations: Record<string, any>[];
      documentID: string;
    };

    export type AnnotationsRemovedPayload = {
      event: typeof AnnotationsEvent.REMOVED;
      annotations: Record<string, any>[];
      documentID: string;
    };

    export type AnnotationsSelectedPayload = {
      event: typeof AnnotationsEvent.SELECTED;
      annotations: Record<string, any>[];
      documentID: string;
    };

    export type AnnotationsDeselectedPayload = {
      event: typeof AnnotationsEvent.DESELECTED;
      annotations: Record<string, any>[];
      documentID: string;
    };

    export type AnnotationTappedPayload = {
      event: typeof AnnotationsEvent.TAPPED;
      annotation: Record<string, any>;
      annotationPoint: { x: number; y: number };
      documentID: string;
    };

    export type TextSelectedPayload = {
      event: typeof TextEvent.SELECTED;
      text: string;
      rect?: { x: number; y: number; width: number; height: number };
      documentID: string;
    };

    export type FormFieldValuesUpdatedPayload = {
      event: typeof FormFieldEvent.VALUES_UPDATED;
      formField: Record<string, any>;
      documentID: string;
    };

    export type FormFieldSelectedPayload = {
      event: typeof FormFieldEvent.SELECTED;
      annotation?: Record<string, any>;
      formField?: Record<string, any>;
      documentID: string;
    };

    export type FormFieldDeselectedPayload = {
      event: typeof FormFieldEvent.DESELECTED;
      annotation?: Record<string, any>;
      formField?: Record<string, any>;
      documentID: string;
    };

    export type BookmarksChangedPayload = {
      event: typeof BookmarksEvent.CHANGED;
      bookmarks: Record<string, any>[];
      documentID: string;
    };

    export type AnalyticsPayload = {
      event: typeof AnalyticsEvent.ANALYTICS;
      analyticsEvent: string;
      attributes: Record<string, any>;
    };

    /**
     * Map of event names to their payload types using the constants defined above
     */
    export type EventPayloadMap = {
      [DocumentEvent.LOADED]: DocumentLoadedPayload;
      [DocumentEvent.LOAD_FAILED]: DocumentLoadFailedPayload;
      [DocumentEvent.PAGE_CHANGED]: DocumentPageChangedPayload;
      [DocumentEvent.SCROLLED]: DocumentScrolledPayload;
      [DocumentEvent.VIEWPORT_CHANGED]: DocumentViewportChangedPayload;
      [DocumentEvent.TAPPED]: DocumentTappedPayload;
      [AnnotationsEvent.ADDED]: AnnotationsAddedPayload;
      [AnnotationsEvent.CHANGED]: AnnotationChangedPayload;
      [AnnotationsEvent.REMOVED]: AnnotationsRemovedPayload;
      [AnnotationsEvent.SELECTED]: AnnotationsSelectedPayload;
      [AnnotationsEvent.DESELECTED]: AnnotationsDeselectedPayload;
      [AnnotationsEvent.TAPPED]: AnnotationTappedPayload;
      [TextEvent.SELECTED]: TextSelectedPayload;
      [FormFieldEvent.VALUES_UPDATED]: FormFieldValuesUpdatedPayload;
      [FormFieldEvent.SELECTED]: FormFieldSelectedPayload;
      [FormFieldEvent.DESELECTED]: FormFieldDeselectedPayload;
      [BookmarksEvent.CHANGED]: BookmarksChangedPayload;
      [AnalyticsEvent.ANALYTICS]: AnalyticsPayload;
    };

    export type DocumentEvent = ValueOf<typeof DocumentEvent>;
    export type AnnotationsEvent = ValueOf<typeof AnnotationsEvent>;
    export type TextEvent = ValueOf<typeof TextEvent>;
    export type FormFieldEvent = ValueOf<typeof FormFieldEvent>;
    export type AnalyticsEvent = ValueOf<typeof AnalyticsEvent>;
    export type BookmarksEvent = ValueOf<typeof BookmarksEvent>;
    export type DocumentLoadFailedCode = ValueOf<typeof DocumentLoadFailedCode>;
    type ValueOf<T> = T[keyof T];
}

// Re-export payload types at top level for easier importing
export type DocumentLoadedPayload = NotificationCenter.DocumentLoadedPayload;
export type DocumentLoadFailedPayload = NotificationCenter.DocumentLoadFailedPayload;
// Re-export error code enum with a more convenient name
export const DocumentLoadFailedCode = NotificationCenter.DocumentLoadFailedCode;
export type DocumentLoadFailedCode = NotificationCenter.DocumentLoadFailedCode;

// Alias for convenience (users can use either name)
export const PDFErrorCode = NotificationCenter.DocumentLoadFailedCode;
export type PDFErrorCode = NotificationCenter.DocumentLoadFailedCode;
export type DocumentPageChangedPayload = NotificationCenter.DocumentPageChangedPayload;
export type DocumentScrolledPayload = NotificationCenter.DocumentScrolledPayload;
export type DocumentViewportChangedPayload = NotificationCenter.DocumentViewportChangedPayload;
export type DocumentTappedPayload = NotificationCenter.DocumentTappedPayload;
export type AnnotationsAddedPayload = NotificationCenter.AnnotationsAddedPayload;
export type AnnotationChangedPayload = NotificationCenter.AnnotationChangedPayload;
export type AnnotationsRemovedPayload = NotificationCenter.AnnotationsRemovedPayload;
export type AnnotationsSelectedPayload = NotificationCenter.AnnotationsSelectedPayload;
export type AnnotationsDeselectedPayload = NotificationCenter.AnnotationsDeselectedPayload;
export type AnnotationTappedPayload = NotificationCenter.AnnotationTappedPayload;
export type TextSelectedPayload = NotificationCenter.TextSelectedPayload;
export type FormFieldValuesUpdatedPayload = NotificationCenter.FormFieldValuesUpdatedPayload;
export type FormFieldSelectedPayload = NotificationCenter.FormFieldSelectedPayload;
export type FormFieldDeselectedPayload = NotificationCenter.FormFieldDeselectedPayload;
export type BookmarksChangedPayload = NotificationCenter.BookmarksChangedPayload;
export type AnalyticsPayload = NotificationCenter.AnalyticsPayload;
export type EventPayloadMap = NotificationCenter.EventPayloadMap;