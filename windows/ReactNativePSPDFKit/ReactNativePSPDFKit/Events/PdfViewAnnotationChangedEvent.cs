using Newtonsoft.Json.Linq;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager.Events;
using System.Collections.Generic;

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
        private readonly IList<IAnnotation> _annotations;

        public PdfViewAnnotationChangedEvent(int viewId, string eventType, IList<IAnnotation> annotations) : base(viewId)
        {
            _eventType = eventType;
            _annotations = annotations;
        }

        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            var annotationsJson = new JArray();
            foreach (var annotation in _annotations)
            {
                annotationsJson.Add(JObject.Parse(annotation.ToJson().Stringify()));
            }

            var eventData = new JObject
            {
                { "change", _eventType },
                { "annotations", annotationsJson }
            };

            rctEventEmitter.receiveEvent(ViewTag, EventName, eventData);
        }
    }
}
