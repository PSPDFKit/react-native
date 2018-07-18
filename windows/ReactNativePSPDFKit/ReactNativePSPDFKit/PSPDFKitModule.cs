using PSPDFKit.Document;
using PSPDFKit.UI;
using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A bridge to the PSPDFKit SDK.
    /// </summary>
    class PSPDFKitModule : ReactContextNativeModuleBase
    {
        private PSPDFKitViewManger _pspdfKitViewManger;
        private string VERSION_KEY = "versionString";

        public PSPDFKitModule(ReactContext reactContext, PSPDFKitViewManger pspdfKitViewManger) : base(reactContext)
        {
            _pspdfKitViewManger = pspdfKitViewManger;
        }

        /// <summary>
        /// Open the native file picker for the user to select a pdf.
        /// </summary>
        [ReactMethod]
        public void OpenFile()
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
        /// Opens the native file picker.
        /// </summary>
        /// <returns>The file chosen in the file picker.</returns>
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

        /// <summary>
        /// Call to the PDFView to open a file. Fails if file is null.
        /// </summary>
        /// <param name="file">File to open</param>
        private async Task LoadFileAsync(Windows.Storage.StorageFile file)
        {
            if (file == null) return;

            await _pspdfKitViewManger.OpenFileAsync(file);
        }

        /// <summary>
        /// Constants that can be used in the JS
        /// </summary>
        public override IReadOnlyDictionary<string, object> Constants
        {
            get
            {
                return new Dictionary<string, object>
                {
                    { VERSION_KEY, typeof(PSPDFKit.Sdk).GetTypeInfo().Assembly.GetName().Version.ToString() },
                };
            }
        }

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name
        {
            get
            {
                return "ReactPSPDFKit";
            }
        }
    }
}
