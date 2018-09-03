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
using PSPDFKit.Document;
using PSPDFKit.UI;
using Windows.Storage;
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;
using PSPDFKit.Pdf.Annotation;
using ReactNative.UIManager;
using ReactNative.UIManager.Events;
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
            if(_pdfViewInitialised)
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

        internal async Task ExportCurrentDocument()
        {
            try
            {
                // Get the StorageFile
                var file = PDFView.Controller?.GetPdfDocument()?.DocumentSource.GetFile();
                if (file != null)
                {
                    // Save it.
                    await PDFView.Document.ExportAsync(file);
                }

                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDocumentSavedEvent(this.GetTag())
                );
            }
            catch (Exception e)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                    new PdfViewDocumentSaveFailedEvent(this.GetTag(), e.Message)
                );
            }
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

        private void DocumentOnAnnotationsCreated(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                        new PdfViewAnnotationChangedEvent(this.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_ADDED, annotation)
                    );
            }
        }

        private void DocumentOnAnnotationsUpdated(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                        new PdfViewAnnotationChangedEvent(this.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_CHANGED, annotation)
                    );
            }
        }

        private void DocumentOnAnnotationsDeleted(object sender, IList<IAnnotation> annotationList)
        {
            foreach (var annotation in annotationList)
            {
                this.GetReactContext().GetNativeModule<UIManagerModule>().EventDispatcher.DispatchEvent(
                        new PdfViewAnnotationChangedEvent(this.GetTag(),
                            PdfViewAnnotationChangedEvent.EVENT_TYPE_REMOVED, annotation)
                    );
            }
        }
    }
}
