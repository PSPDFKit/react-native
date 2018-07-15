using System;
using System.Threading.Tasks;
using PSPDFKit.Document;
using PSPDFKit.UI;
using Windows.Storage;
using Windows.UI.Popups;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace ReactNativePSPDFKit
{
    public sealed partial class PDFViewPage : Page
    {
        private ViewState _viewStateCache = new ViewState();
        private StorageFile _fileToOpen = null;
        private bool _pdfViewInitialised = false;
        
        public PDFViewPage()
        {
            InitializeComponent();

            PDFView.InitializationCompletedHandler += PDFView_InitializationCompletedHandlerAsync;
        }

        /// <summary>
        /// Take the file and call the conroller to open the document.
        /// </summary>
        /// <param name="file">File to open.</param>
        internal async Task OpenFileAsync(StorageFile file)
        {
            _fileToOpen = file;

            if(_pdfViewInitialised)
            {
                try
                {
                    await PDFView.Controller.ShowDocumentAsync(DocumentSource.CreateFromStorageFile(file));
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

        private async void PDFView_InitializationCompletedHandlerAsync(PdfView sender, PSPDFKit.Pdf.Document args)
        {
            await PDFView.Controller.ShowDocumentWithViewStateAsync(DocumentSource.CreateFromStorageFile(_fileToOpen), _viewStateCache);
            _pdfViewInitialised = true;
        }
    }
}
