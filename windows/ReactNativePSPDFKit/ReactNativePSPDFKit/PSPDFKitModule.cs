//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using PSPDFKit;
using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.UI.Popups;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A bridge to the PSPDFKit SDK.
    /// </summary>
    class PSPDFKitModule : ReactContextNativeModuleBase
    {
        private readonly PDFViewPage _pdfViewPage;
        private string VERSION_KEY = "versionString";

        public PSPDFKitModule(ReactContext reactContext, PDFViewPage pdfViewPage) : base(reactContext)
        {
            _pdfViewPage = pdfViewPage;
        }

        /// <summary>
        /// Open the native file picker for the user to select a pdf.
        /// </summary>
        [ReactMethod]
        public void OpenFilePicker()
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                var file = await PickPDF();
                if (file != null)
                {
                    await LoadFileAsync(file);
                }
            });
        }

        /// <summary>
        /// Open a file from a path presented from javascript.
        /// Files loaded in the Visual studio Project's Assets.
        /// See https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions
        /// </summary>
        [ReactMethod]
        public void Present(string assetPath)
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                try
                {
                    var file = await StorageFile.GetFileFromPathAsync(assetPath);

                    await LoadFileAsync(file);
                }
                catch (Exception e)
                {
                    var dialog = new MessageDialog("Unable to open the file specified.");
                    await dialog.ShowAsync();
                }
            });
        }

        /// <summary>
        /// Opens the native file picker.
        /// </summary>
        /// <returns>The file chosen in the file picker.</returns>
        private static async Task<Windows.Storage.StorageFile> PickPDF()
        {
            var picker = new Windows.Storage.Pickers.FileOpenPicker
            {
                ViewMode = Windows.Storage.Pickers.PickerViewMode.Thumbnail,
                SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.DocumentsLibrary
            };
            picker.FileTypeFilter.Add(".pdf");

            return await picker.PickSingleFileAsync();
        }

        /// <summary>
        /// Call to the PDFView to open a file. Fails if file is null.
        /// </summary>
        /// <param name="file">File to open</param>
        private async Task LoadFileAsync(Windows.Storage.StorageFile file)
        {
            if (file == null) return;

            await _pdfViewPage.OpenFileAsync(file);
        }

        /// <summary>
        /// Constants that can be used in the JS
        /// </summary>
        public override IReadOnlyDictionary<string, object> Constants => new Dictionary<string, object>
        {
            { VERSION_KEY, typeof(Sdk).GetTypeInfo().Assembly.GetName().Version.ToString() },
        };

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "ReactPSPDFKit";
    }
}
