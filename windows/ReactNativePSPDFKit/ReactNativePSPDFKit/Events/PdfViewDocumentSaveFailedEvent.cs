using Newtonsoft.Json.Linq;
using ReactNative.UIManager.Events;

namespace ReactNativePSPDFKit.Events
{
    /**
     * Event sent by the PDFViewPage when the document save failed.
     */
    class PdfViewDocumentSaveFailedEvent : Event {

        public const string EVENT_NAME = "pdfViewDocumentSaveFailed";

        private readonly string _error;

        public PdfViewDocumentSaveFailedEvent(int viewId, string error) : base(viewId)
        {
            this._error = error;
        }


        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            var eventData = new JObject
            {
                { "error", _error }
            };

            rctEventEmitter.receiveEvent(ViewTag, EventName, eventData);
        }
    }
}
