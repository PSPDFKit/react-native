//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
using Windows.Storage;
using Newtonsoft.Json.Linq;
using PSPDFKit.Pdf;
using PSPDFKit.Pdf.Annotation;
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
        private const int COMMAND_GET_ALL_UNSAVED_ANNOTATIONS = 6;
        private const int COMMAND_ADD_ANNOTATIONS = 7;
        private const int COMMAND_GET_FORM_FIELD_VALUE = 8;
        private const int COMMAND_SET_FORM_FIELD_VALUE = 9;

        internal readonly PDFViewPage PdfViewPage;

        public PSPDFKitViewManger()
        {
            PdfViewPage = new PDFViewPage();
            PdfViewPage.Pdfview.OnDocumentOpened += (pdfView, document) =>
            {
                document.AnnotationsCreated += DocumentOnAnnotationsCreated;
                document.AnnotationsUpdated += DocumentOnAnnotationsUpdated;
                document.AnnotationsDeleted += DocumentOnAnnotationsDeleted;
            };
        }

        private void DocumentOnAnnotationsCreated(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                PdfViewPage.GetReactContext()
                    .GetNativeModule<UIManagerModule>()
                    .EventDispatcher
                    .DispatchEvent(
                        new PdfViewAnnotationChangedEvent(PdfViewPage.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotation)
                    );
            }
        }

        private void DocumentOnAnnotationsUpdated(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                PdfViewPage.GetReactContext()
                    .GetNativeModule<UIManagerModule>()
                    .EventDispatcher
                    .DispatchEvent(
                        new PdfViewAnnotationChangedEvent(PdfViewPage.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation)
                    );
            }
        }

        private void DocumentOnAnnotationsDeleted(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                PdfViewPage.GetReactContext()
                    .GetNativeModule<UIManagerModule>()
                    .EventDispatcher
                    .DispatchEvent(
                        new PdfViewAnnotationChangedEvent(PdfViewPage.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_REMOVED, annotation)
                    );
            }
        }


        protected override PDFViewPage CreateViewInstance(ThemedReactContext reactContext)
        {
            return PdfViewPage;
        }

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "RCTPSPDFKitView";

        [ReactProp("document")]
        public async void SetDocumentAsync(PDFViewPage view, String document)
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

        public override IReadOnlyDictionary<string, object> CommandsMap => new Dictionary<string, object>
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
                "getAllUnsavedAnnotations", COMMAND_GET_ALL_UNSAVED_ANNOTATIONS
            },
            {
                "addAnnotations", COMMAND_ADD_ANNOTATIONS
            },
            {
                "getFormFieldValue", COMMAND_GET_FORM_FIELD_VALUE
            },
            {
                "setFormFieldValue", COMMAND_SET_FORM_FIELD_VALUE
            }

        };

        public override async void ReceiveCommand(PDFViewPage view, int commandId, JArray args)
        {
            switch (commandId)
            {
                case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                    await PdfViewPage.Pdfview.Controller.SetInteractionModeAsync(InteractionMode.Note);
                    break;
                case COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                    await PdfViewPage.Pdfview.Controller.SetInteractionModeAsync(InteractionMode.None);
                    break;
                case COMMAND_SAVE_CURRENT_DOCUMENT:
                    // TODO Save to current document?
                    // await PdfViewPage.Pdfview.Document.ExportAsync()
                    break;
                case COMMAND_GET_ANNOTATIONS:
                    break;
                case COMMAND_ADD_ANNOTATION:
                    break;
                case COMMAND_GET_ALL_UNSAVED_ANNOTATIONS:
                    break;
                case COMMAND_ADD_ANNOTATIONS:
                    break;
                case COMMAND_GET_FORM_FIELD_VALUE:
                    break;
                case COMMAND_SET_FORM_FIELD_VALUE:
                    break;
            }
        }

        public override IReadOnlyDictionary<string, object> ExportedCustomDirectEventTypeConstants =>
            new Dictionary<string, object>
            {
                {
                    PdfViewAnnotationChangedEvent.EVENT_NAME,
                    new Dictionary<string, object>
                    {
                        {"registrationName", "onAnnotationsChanged"},
                    }
                }
            };
    }
}