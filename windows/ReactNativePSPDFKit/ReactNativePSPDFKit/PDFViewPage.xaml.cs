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
    /// <summary>
    /// A webview which will hold the pdf render
    /// </summary>
    public sealed partial class PDFViewPage : Page
    {

        Controller _controller;
        const string _css = "ms-appx-web:///Assets/pspdfkit/windows.css";

        public PDFViewPage()
        {
            InitializeComponent();
        }

        private void PDFView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            _controller = new Controller(sender, _css);
        }

        /// <summary>
        /// Take the file and call the conroller to open the document.
        /// </summary>
        /// <param name="file">File to open.</param>
        internal async void OpenFile(StorageFile file)
        {
            try
            {
                await _controller.ShowDocumentAsync(DocumentSource.CreateFromStorageFile(file));
            }
            catch (Exception e)
            {
                // Show a dialog with the exception message.
                var dialog = new MessageDialog(e.Message);
                await dialog.ShowAsync();
            }
        }
    }
}
