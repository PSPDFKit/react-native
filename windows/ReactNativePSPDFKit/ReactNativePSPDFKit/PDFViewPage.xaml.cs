using System;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>

    public sealed partial class PDFViewPage : Page
    {

        PSPDFKit.API _API;
        const string _license = "DhiwxApTjEEXYz2MCnLVepgxa50wbAcvHjQqaSBrSmMvlMuCrtcSmoNMxZyV1ABfzcLzk7s-ck2NNx_H4BTn-pPGD_KT64-9nGjEgbXp31RxQABlSIgS3IBofHUmNCiY8uXo8lV8PtY7twzXdcSiDMeAgxkal9uwGaE8SRpmw609I5G0m3nSj3O3pirOJ8n0PONbWCgo6P8bzwcM9pHrBkvugqqTzgEZUp3W24_8nkwYmBZxvk7iX_Oo6MQQSTyKqWMTCPKd-MScGSTKFMOAO_VvNsexNxht2s5iDh0z1D_ASee6N8RkZMWQb3bYBXR4rQlrUlQmw3zl4L-0wsu4wcamc10gFQeEp2BOTh5BFYVkxlxELnK8TxIJJI2O5BrHJIEDKnsP9Yxo-8kMX1M6d8aOqc-_wcwrWlWNjIi11g87a09-P_8yykoEQWthxHUBGwAmu7rlGAFv-VeYOXd_aYp25OPI3A6-YzDohxhkxee8ETEifn2W6wGnxLLN3gv6z22enArvqcKehfHghOd-8e6tqm4k0E-1B0SXQTI0vbiaNTTVxNAADgcB83wZNgArsne8YlOmCAMliLHj9tzggQ==";
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
