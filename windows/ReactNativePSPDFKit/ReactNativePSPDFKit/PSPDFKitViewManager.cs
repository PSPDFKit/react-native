//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using System.Threading.Tasks;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
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

        protected override PDFViewPage CreateViewInstance(ThemedReactContext reactContext)
        {
            return _pdfViewPage;
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

        [ReactProp("document")]
        public async void SetDocumentAsync(PDFViewPage view, String document)
        {
            var storagefile = await StorageFile.GetFileFromApplicationUriAsync(new Uri(document));
            await view.OpenFileAsync(storagefile);
        }

        [ReactProp("pageIndex")]
        public async void SetPageIndexAsync(PDFViewPage view, int pageIndex)
        {
            await view.SetPageIndexAsync(pageIndex);
        }

        [ReactProp("hideNavigationBar")]
        public void SetHideNavigationBar(PDFViewPage view, bool hideNavigationBar)
        {
            view.SetShowToolbar(!hideNavigationBar);
        }

        /// <summary>
        /// Pass a file to the PDFView to display.
        /// </summary>
        /// <param name="file">file to be displayed</param>
        internal async Task OpenFileAsync(StorageFile file)
        {
            await _pdfViewPage.OpenFileAsync(file);
        }
    }
}