using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager.Events;

namespace ReactNativePSPDFKit.Events
{
    /**
    * Event sent by the {@link com.pspdfkit.views.PdfView} when an annotation was selected.
    */
    class PdfViewAnnotationChangedEvent : Event
    {
        public const string EVENT_NAME = "pdfViewAnnotationChanged";
        public const string EVENT_TYPE_CHANGED = "changed";
        public const string EVENT_TYPE_ADDED = "added";
        public const string EVENT_TYPE_REMOVED = "removed";

        private readonly string _eventType;
        private readonly IAnnotation _annotation;

        public PdfViewAnnotationChangedEvent(int viewId, string eventType, IAnnotation annotation) : base(viewId)
        {
            this._eventType = eventType;
            this._annotation = annotation;
        }

        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            var eventData = new JObject
            {
                { "change", _eventType },
                { "annotations", JObject.Parse(_annotation.ToJson().Stringify()) }
            };

            rctEventEmitter.receiveEvent(ViewTag, EventName, eventData);
        }
    }
}
