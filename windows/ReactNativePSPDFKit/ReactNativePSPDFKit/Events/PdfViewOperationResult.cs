using Newtonsoft.Json.Linq;
using ReactNative.UIManager.Events;

namespace ReactNativePSPDFKit.Events
{
    class PdfViewOperationResult : Event
    {
        /**
         * Event sent by the PDFViewPage when a operation has succeeded
         */
        public const string EVENT_NAME = "pdfViewOperationSuccessful";

        private readonly JObject _payload = new JObject();

        public PdfViewOperationResult(int viewId, int requestId) : base(viewId)
        {
            _payload.Add("requestId", requestId);
            _payload.Add("success", true);
        }

        public PdfViewOperationResult(int viewId, int requestId, string errorMessage) : base(viewId)
        {
            _payload.Add("requestId", requestId);
            _payload.Add("success", false);
            _payload.Add("error", errorMessage);
        }

        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            rctEventEmitter.receiveEvent(ViewTag, EventName, _payload);
        }
    }
}
