﻿using System;
using System.Collections.Generic;
using Microsoft.Toolkit.Uwp.UI.Controls.TextToolbarButtons;
using Newtonsoft.Json.Linq;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager.Events;
using IToolbarItem = PSPDFKit.UI.ToolbarComponents.IToolbarItem;

namespace ReactNativePSPDFKit.Events
{
    /**
     * Event sent by the PDFViewPage when the document save failed.
     */
    class PdfViewDataReturnedEvent : Event
    {

        public const string EVENT_NAME = "pdfViewDataReturn";

        private readonly JObject _payload = new JObject();

        public PdfViewDataReturnedEvent(int viewId, int requestId, IEnumerable<IAnnotation> annotationsToSerialize) :
            base(viewId)
        {
            _payload.Add("requestId", requestId);
            try
            {
                var annotationsSerialized = new JArray();
                foreach (var annotation in annotationsToSerialize)
                {
                    annotationsSerialized.Add(JToken.Parse(annotation.ToJson().Stringify()));
                }

                var annotations = new JObject
                {
                    { "annotations",annotationsSerialized}
                };
                _payload.Add("result", annotations);
            }
            catch (Exception e)
            {
                _payload.Add("error", e.Message);
            }
        }

        public PdfViewDataReturnedEvent(int viewId, int requestId, IEnumerable<IToolbarItem> toolbarItems) :
            base(viewId)
        {
            _payload.Add("requestId", requestId);
            try
            {
                var toolbarItemsJson = PSPDFKit.UI.ToolbarComponents.Factory.ToJsonArray(toolbarItems);
                
                _payload.Add("result", JArray.Parse(toolbarItemsJson.ToString()));
            }
            catch (Exception e)
            {
                _payload.Add("error", e.Message);
            }
        }

        public PdfViewDataReturnedEvent(int viewId, int requestId, string errorMessage) : base(viewId)
        {
            _payload.Add("requestId", requestId);
            _payload.Add("error", errorMessage);
        }

        public override string EventName => EVENT_NAME;

        public override void Dispatch(RCTEventEmitter eventEmitter)
        {
            eventEmitter.receiveEvent(ViewTag, EventName, _payload);
        }
    }
}
