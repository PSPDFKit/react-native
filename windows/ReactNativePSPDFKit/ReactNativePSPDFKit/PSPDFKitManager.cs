using PSPDFKit;
using ReactNative.Bridge;
using ReactNative.UIManager;
using System.Collections.Generic;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitManager : SimpleViewManager<PDFViewPage>
    {
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
            return new PDFViewPage();
        }
    }
}