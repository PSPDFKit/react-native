using PSPDFKit;
using ReactNative.UIManager;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitViewManger : SimpleViewManager<PDFViewPage>
    {
        private API _API;
        public PSPDFKitViewManger(API api)
        {
            _API = api;
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
            return new PDFViewPage(_API);
        }
    }
}