//
//  Copyright © 2018-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
using Windows.Storage;
using Newtonsoft.Json.Linq;
using PSPDFKit.UI;
using ReactNativePSPDFKit.Events;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitViewManger : SimpleViewManager<PDFViewPage>
    {

        private const int COMMAND_ENTER_ANNOTATION_CREATION_MODE = 1;
        private const int COMMAND_EXIT_CURRENTLY_ACTIVE_MODE = 2;
        private const int COMMAND_SAVE_CURRENT_DOCUMENT = 3;
        private const int COMMAND_GET_ANNOTATIONS = 4;
        private const int COMMAND_ADD_ANNOTATION = 5;
        private const int COMMAND_GET_TOOLBAR_ITEMS = 6;
        private const int COMMAND_SET_TOOLBAR_ITEMS = 7;
        private const int COMMAND_REMOVE_ANNOTATION = 8;

        private readonly Uri _cssResource = null;
        internal PDFViewPage PdfViewPage;

        public PSPDFKitViewManger(Uri cssResource)
        {
            _cssResource = cssResource;
        }

        protected override PDFViewPage CreateViewInstance(ThemedReactContext reactContext)
        {
            PdfViewPage = new PDFViewPage();
            if(_cssResource != null)
            {
                PdfViewPage.Pdfview.Css = _cssResource;
            }
            return PdfViewPage;
        }

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "RCTPSPDFKitView";

        [ReactProp("document")]
        public async void SetDocumentAsync(PDFViewPage view, string document)
        {
            var storagefile = await StorageFile.GetFileFromApplicationUriAsync(new Uri(document));
            await view.SetDefaultDocument(storagefile);
        }

        [ReactProp("pageIndex")]
        public async void SetPageIndexAsync(PDFViewPage view, int pageIndex)
        {
            await view.SetPageIndexAsync(pageIndex);
        }

        [ReactProp("hideNavigationBar")]
        public void SetHideNavigationBar(PDFViewPage view, bool hideNavigationBar)
        {
            view.SetShowToolbar(!hideNavigationBar);
        }

        public override JObject ViewCommandsMap => new JObject
        {
            {
                "enterAnnotationCreationMode", COMMAND_ENTER_ANNOTATION_CREATION_MODE
            },
            {
                "exitCurrentlyActiveMode", COMMAND_EXIT_CURRENTLY_ACTIVE_MODE
            },
            {
                "saveCurrentDocument", COMMAND_SAVE_CURRENT_DOCUMENT
            },
            {
                "getAnnotations", COMMAND_GET_ANNOTATIONS
            },
            {
                "addAnnotation", COMMAND_ADD_ANNOTATION
            },
            {
                "removeAnnotation", COMMAND_REMOVE_ANNOTATION
            },
            {
                "getToolbarItems", COMMAND_GET_TOOLBAR_ITEMS
            },
            {
                "setToolbarItems", COMMAND_SET_TOOLBAR_ITEMS
            }
        };

        public override async void ReceiveCommand(PDFViewPage view, int commandId, JArray args)
        {
            switch (commandId)
            {
                case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                    await view.SetInteractionMode(args[0].Value<int>(), InteractionMode.Note);
                    break;
                case COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                    await view.SetInteractionMode(args[0].Value<int>(), InteractionMode.None);
                    break;
                case COMMAND_SAVE_CURRENT_DOCUMENT:
                    await view.ExportCurrentDocument(args[0].Value<int>());
                    break;
                case COMMAND_GET_ANNOTATIONS:
                    await view.GetAnnotations(args[0].Value<int>(), args[1].Value<int>());
                    break;
                case COMMAND_ADD_ANNOTATION:
                    await view.CreateAnnotation(args[0].Value<int>(), args[1].ToString());
                    break;
                case COMMAND_REMOVE_ANNOTATION:
                    await view.RemoveAnnotation(args[0].Value<int>(), args[1].ToString());
                    break;
                case COMMAND_GET_TOOLBAR_ITEMS:
                    view.GetToolbarItems(args[0].Value<int>());
                    break;
                case COMMAND_SET_TOOLBAR_ITEMS:
                    await view.SetToolbarItems(args[0].Value<int>(), args[1].ToString());
                    break;
            }
        }

        public override JObject CustomDirectEventTypeConstants =>
            new JObject
            {
                {
                    PdfViewAnnotationChangedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onAnnotationsChanged"},
                    }
                },
                {
                    PdfViewDocumentSavedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDocumentSaved"},
                    }
                },
                {
                    PdfViewDocumentSaveFailedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDocumentSaveFailed"},
                    }
                },
                {
                    PdfViewDataReturnedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDataReturned"},
                    }
                },
                {
                    PdfViewOperationResult.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onOperationResult"},
                    }
                }
            };
    }
}
