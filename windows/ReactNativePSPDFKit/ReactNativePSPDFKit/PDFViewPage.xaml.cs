//
//  Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Data.Json;
using PSPDFKit.UI;
using Windows.Storage;
using Windows.UI.Xaml.Controls;
using PSPDFKit.Pdf;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager;
using ReactNativePSPDFKit.Events;

namespace ReactNativePSPDFKit
{
    public sealed partial class PDFViewPage : Page
    {
        private bool _pdfViewInitialized = false;
        public readonly PdfView PdfView;
        private string _annotationCreatorName = null;

        public PDFViewPage()
        {
            InitializeComponent();
            PdfView = PDFView;

            PDFView.OnSuspendUnloading += (sender, args) =>
            {
                _pdfViewInitialized = false;
                args.Complete();
            };

            PDFView.OnDocumentOpened += (pdfView, document) =>
            {
                document.AnnotationsCreated += DocumentOnAnnotationsCreated;
                document.AnnotationsUpdated += DocumentOnAnnotationsUpdated;
                document.AnnotationsDeleted += DocumentOnAnnotationsDeleted;
            };
        }

        /// <summary>
        /// Take the file and call the controller to open the document.
        /// </summary>
        /// <param name="file">File to open.</param>
        internal async Task OpenFileAsync(StorageFile file)
        {
            // If the PdfView is already initialized we can show the new document.
            if (_pdfViewInitialized)
            {
                await PDFView.OpenStorageFileAsync(file);
            }
        }

        internal async Task ExportCurrentDocument(int requestId)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    var file = PDFView.Document.DocumentSource.GetFile();
                    if (file != null)
                    {
                        await PDFView.Document.ExportAsync(file);
                    }
                    else
                    {
                        throw new NotImplementedException("Only currently opened storage file saving is supported.");
                    }
                }
            );
        }

        internal async Task GetAnnotations(int requestId, int pageIndex)
        {
            try
            {
                var annotations = await PdfView.Document.GetAnnotationsAsync(pageIndex);

                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, annotations)
                );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, e.Message)
                );
            }
        }

        internal async Task GetAllAnnotations(int requestId)
        {
            try
            {
                var annotations = await PdfView.Document.GetAnnotationsAsync();

                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, annotations)
                );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, e.Message)
                );
            }
        }

        internal void GetToolbarItems(int requestId)
        {
            try
            {
                var toolbarItems = PdfView.Controller.GetToolbarItems();

                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, toolbarItems)
                );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDataReturnedEvent(this.GetTag(), requestId, e.Message)
                );
            }
        }

        internal async Task SetToolbarItems(int requestId, string toolbarItemsJson)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    var toolbarItems =
                        PSPDFKit.UI.ToolbarComponents.Factory.FromJsonArray(JsonArray.Parse(toolbarItemsJson));
                    await PdfView.Controller.SetToolbarItemsAsync(toolbarItems.ToList());
                }
            );
        }

        internal async Task CreateAnnotation(int requestId, string annotationJsonString)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    await PdfView.Document.CreateAnnotationAsync(
                        Factory.FromJson(JsonObject.Parse(annotationJsonString)));
                }
            );
        }

        internal async Task RemoveAnnotation(int requestId, string annotationJsonString)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    var annotation = Factory.FromJson(JsonObject.Parse(annotationJsonString));
                    await PdfView.Document.DeleteAnnotationAsync(annotation.Id);
                }
            );
        }

        internal async Task SetInteractionMode(int requestId, InteractionMode interactionMode)
        {
            await RunOperationAndFireEvent(requestId,
                async () => { await PdfView.Controller.SetInteractionModeAsync(interactionMode); }
            );
        }

        private async Task RunOperationAndFireEvent(int requestId, Func<Task> operation)
        {
            try
            {
                await operation();

                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewOperationResult(this.GetTag(), requestId)
                );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewOperationResult(this.GetTag(), requestId, e.Message)
                );
            }
        }

        internal async Task SetPageIndexAsync(int index)
        {
            await PDFView.Controller.SetCurrentPageIndexAsync(index);
        }

        internal void SetShowToolbar(bool showToolbar)
        {
            PDFView.ShowToolbar = showToolbar;
        }

        public void SetAnnotationCreatorName(string annotationAuthorName)
        {
            _annotationCreatorName = annotationAuthorName;
        }

        public void SetReadOnly(bool readOnly)
        {
            PdfView.ReadOnly = readOnly;
        }

        private void PDFView_InitializationCompletedHandlerAsync(PdfView sender, Document document)
        {
            _pdfViewInitialized = true;
        }

        private async void DocumentOnAnnotationsCreated(Document document, IList<IAnnotation> annotations)
        {
            // If we have an author name set, we want to add this.
            if (_annotationCreatorName != null)
            {
                foreach (var annotation in annotations)
                {
                    // If the create name is populated then it probably was created else where. 
                    if (annotation.CreatorName == null)
                    {
                        annotation.CreatorName = _annotationCreatorName;
                        await document.UpdateAnnotationAsync(annotation);
                    }
                }
            }

            this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                new PdfViewAnnotationChangedEvent(this.GetTag(),
                    PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotations)
            );
        }

        private void DocumentOnAnnotationsUpdated(object sender, IList<IAnnotation> annotations)
        {
            this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                new PdfViewAnnotationChangedEvent(this.GetTag(),
                    PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotations)
            );
        }

        private void DocumentOnAnnotationsDeleted(object sender, IList<IAnnotation> annotations)
        {
            this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                new PdfViewAnnotationChangedEvent(this.GetTag(),
                    PdfViewAnnotationChangedEvent.EVENT_TYPE_REMOVED, annotations)
            );
        }
    }
}