using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ReactNative.UIManager.Events;

namespace ReactNativePSPDFKit.Events
{
    /**
     * Event sent by the PDFViewPage when the document save succeeded
     */
    class PdfViewDocumentSavedEvent : Event
    {

        public const string EVENT_NAME = "pdfViewDocumentSaved";

        public PdfViewDocumentSavedEvent(int viewId) : base(viewId)
        {
        }


        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            rctEventEmitter.receiveEvent(ViewTag, EventName, null);
        }
    }
}
