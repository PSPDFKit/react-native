using PSPDFKit;
using System;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A webview which will hold the pdf render
    /// </summary>
    public sealed partial class PDFViewPage : Page
    {

        API _API;
        string _license;

        public PDFViewPage(API api, string license)
        {
            _API = api;
            _license = license;
            InitializeComponent();
        }

        private void PDFView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            _API.InitializeWithWebView(_license, "", sender);
        }
    }
}
