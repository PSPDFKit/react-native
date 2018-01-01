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
        const string _license = "ENTER LICENSE KEY HERE";

        public PDFViewPage(API api)
        {
            _API = api;
            InitializeComponent();
        }

        private void PDFView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            _API.InitializeWithWebView(_license, sender);
        }
    }
}
