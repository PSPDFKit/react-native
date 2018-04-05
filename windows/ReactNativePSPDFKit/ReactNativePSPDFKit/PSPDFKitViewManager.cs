using System;
using System.Threading.Tasks;
using PSPDFKit;
using PSPDFKit.Document;
using PSPDFKit.UI;
using ReactNative.UIManager;
using Windows.Storage;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitViewManger : SimpleViewManager<PDFViewPage>
    {
        private PDFViewPage _pdfViewPage;

        public PSPDFKitViewManger()
        {
            _pdfViewPage = new PDFViewPage();
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
            return _pdfViewPage;
        }

        internal void OpenFile(StorageFile file)
        {
            _pdfViewPage.OpenFile(file);
        }
    }
}