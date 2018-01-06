using PSPDFKit;
using ReactNative.UIManager;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitViewManger : SimpleViewManager<PDFViewPage>
    {
        private API _API;
        private string _license;

        public PSPDFKitViewManger(API api, string license)
        {
            _API = api;
            _license = license;
        }

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name
        {
            get
            {
                return "ReactPSPDFKitView";
            }
        }

        protected override PDFViewPage CreateViewInstance(ThemedReactContext reactContext)
        {
            return new PDFViewPage(_API, _license);
        }
    }
}