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
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager;
using ReactNativePSPDFKit.Events;

namespace ReactNativePSPDFKit
{
    public sealed partial class PDFViewPage : Page
    {
        private StorageFile _fileToOpen;
        private bool _pdfViewInitialised = false;
        public readonly PdfView Pdfview;

        public PDFViewPage()
        {
            InitializeComponent();
            Pdfview = PDFView;

            PDFView.OnSuspendUnloading += (sender, args) =>
            {
                // Reset the displated document.
                // This is a work aronud to ensure that if the user navigates away from
                // the Page and then back, a document will still be shown.
                _fileToOpen = null;

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
        /// Only set the document to show if there is no document staged yet.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        internal async Task SetDefaultDocument(StorageFile file)
        {
            if (_fileToOpen != null) return;

            await OpenFileAsync(file);
        }

        /// <summary>
        /// Take the file and call the conroller to open the document.
        /// </summary>
        /// <param name="file">File to open.</param>
        internal async Task OpenFileAsync(StorageFile file)
        {
            _fileToOpen = file;

            // If the PdfView is already initialised we can show the new document.
            if (_pdfViewInitialised)
            {
                try
                {
                    await PDFView.OpenStorageFileAsync(file);
                }
                catch (Exception e)
                {
                    // Show a dialog with the exception message.
                    var dialog = new MessageDialog(e.Message);
                    await dialog.ShowAsync();
                }
            }
        }

        internal async Task ExportCurrentDocument(int requestId)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    // Get the StorageFile
                    if (_fileToOpen != null)
                    {
                        // Save it.
                        await PDFView.Document.ExportAsync(_fileToOpen);
                    }
                }
            );
        }

        internal async Task GetAnnotations(int requestId, int pageIndex)
        {
            try
            {
                var annotations = await Pdfview.Document.GetAnnotationsAsync(pageIndex);

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
                var toolbarItems = Pdfview.Controller.GetToolbarItems();

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
                    await Pdfview.Controller.SetToolbarItemsAsync(toolbarItems.ToList());
                }
            );
        }

        internal async Task CreateAnnotation(int requestId, string annotationJsonString)
        {
            await RunOperationAndFireEvent(requestId,
                async () =>
                {
                    await Pdfview.Document.CreateAnnotationAsync(
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
                    await Pdfview.Document.DeleteAnnotationAsync(annotation.Id);
                }
            );
        }

        internal async Task SetInteractionMode(int requestId, InteractionMode interactionMode)
        {
            await RunOperationAndFireEvent(requestId,
                async () => { await Pdfview.Controller.SetInteractionModeAsync(interactionMode); }
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

        private async void PDFView_InitializationCompletedHandlerAsync(PdfView sender, PSPDFKit.Pdf.Document document)
        {
            // If we already have a file to open lets proceed with that here.
            if (_fileToOpen != null)
            {
                await PDFView.OpenStorageFileAsync(_fileToOpen);
            }

            _pdfViewInitialised = true;
        }

        private void DocumentOnAnnotationsCreated(object sender, IList<IAnnotation> annotations)
        {
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