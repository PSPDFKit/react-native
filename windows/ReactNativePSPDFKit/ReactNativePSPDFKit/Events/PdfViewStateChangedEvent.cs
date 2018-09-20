using Newtonsoft.Json.Linq;
using ReactNative.UIManager.Events;

namespace ReactNativePSPDFKit.Events
{
    /**
     * Event sent by the {@link com.pspdfkit.views.PdfView} containing info about the current state.
     */
    public class PdfViewStateChangedEvent : Event {

        public const string EVENT_NAME = "pdfViewStateChanged";

        private readonly bool _documentIsLoaded;
        private readonly int _currentPageIndex;
        private readonly int _pageCount;
        private readonly bool _annotationCreationActive;
        private readonly bool _annotationEditingActive;
        private readonly bool _textSelectionActive;
        private readonly bool _formEditingActive;

        public PdfViewStateChangedEvent(int viewTag) : base(viewTag)
        {
            
            this._documentIsLoaded = false;
            this._currentPageIndex = -1;
            this._pageCount = -1;
            this._annotationCreationActive = false;
            this._annotationEditingActive = false;
            this._textSelectionActive = false;
            this._formEditingActive = false;
        }

        public PdfViewStateChangedEvent(int viewTag,
                                        int currentPageIndex,
                                        int pageCount,
                                        bool annotationCreationActive,
                                        bool annotationEditingActive,
                                        bool textSelectionActive,
                                        bool formEditingActive) : base(viewTag)
        {
            this._documentIsLoaded = true;
            this._currentPageIndex = currentPageIndex;
            this._pageCount = pageCount;
            this._annotationCreationActive = annotationCreationActive;
            this._annotationEditingActive = annotationEditingActive;
            this._textSelectionActive = textSelectionActive;
            this._formEditingActive = formEditingActive;
        }

        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter rctEventEmitter)
        {
            var eventData = new JObject
            {
                { "documentLoaded", _documentIsLoaded },
                { "currentPageIndex", _currentPageIndex },
                { "pageCount", _pageCount },
                { "annotationCreationActive", _annotationCreationActive },
                { "annotationEditingActive", _annotationEditingActive },
                { "textSelectionActive", _textSelectionActive },
                { "formEditingActive", _formEditingActive }
            };
            
            rctEventEmitter.receiveEvent(ViewTag, EventName, eventData);
        }
    }
}
