using PSPDFKit;
using PSPDFKit.PDF;
using System;
using System.Data;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Media;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>

    public sealed partial class PDFViewPage : Page
    {

        PSPDFKit.API _API;
        const string _license = "Insert license key here";
        const string _css = "ms-appx-web:///Assets/pspdfkit/windows.css";

        public PDFViewPage()
        {
            InitializeComponent();
        }


        private void PDFView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            _API = new PSPDFKit.API();
            _API.InitializeWithWebView(_license, sender);
        }

        private async void Button_Click_View_Open(object sender, RoutedEventArgs e)
        {
            var file = await PickPDF();
            if (file != null)
            {
                LoadViaAPI(file);
            }
        }

        private async void LoadViaAPI(Windows.Storage.StorageFile file)
        {
            if (file == null) return;

            await _API.OpenAsync(file);
        }

        private async Task<Windows.Storage.StorageFile> PickPDF()
        {
            var picker = new Windows.Storage.Pickers.FileOpenPicker
            {
                ViewMode = Windows.Storage.Pickers.PickerViewMode.Thumbnail,
                SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary
            };
            picker.FileTypeFilter.Add(".pdf");

            return await picker.PickSingleFileAsync();
        }
    }
}
