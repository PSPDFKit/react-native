//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using System.Threading.Tasks;
using PSPDFKit.Document;
using PSPDFKit.UI;
using Windows.Storage;
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;

namespace ReactNativePSPDFKit
{
    public sealed partial class PDFViewPage : Page
    {
        private readonly ViewState _viewStateCache = new ViewState();
        private StorageFile _fileToOpen = null;
        private bool _pdfViewInitialised = false;
        
        public PDFViewPage()
        {
            InitializeComponent();
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
                    await PDFView.Controller.ShowDocumentWithViewStateAsync(DocumentSource.CreateFromStorageFile(file), _viewStateCache);
                }
                catch (Exception e)
                {
                    // Show a dialog with the exception message.
                    var dialog = new MessageDialog(e.Message);
                    await dialog.ShowAsync();
                }
            }
        }

        internal async Task SetPageIndexAsync(int index)
        {
            _viewStateCache.CurrentPageIndex = index;

            // If the PdfView is already initialised we can change the page index.
            if (_pdfViewInitialised)
            {
                await PDFView.Controller.SetCurrentPageIndexAsync(index);
            }
        }

        internal void SetShowToolbar(bool showToolbar)
        {
            _viewStateCache.ShowToolbar = showToolbar;

            PDFView.ShowToolbar = showToolbar;
        }

        private async void PDFView_InitializationCompletedHandlerAsync(PdfView sender, PSPDFKit.Pdf.Document document)
        {
            // If we already have a file to open lets proceed with that here.
            if (_fileToOpen != null)
            {
                await PDFView.Controller.ShowDocumentWithViewStateAsync(DocumentSource.CreateFromStorageFile(_fileToOpen), _viewStateCache);
            }
            _pdfViewInitialised = true;
        }
    }
}
