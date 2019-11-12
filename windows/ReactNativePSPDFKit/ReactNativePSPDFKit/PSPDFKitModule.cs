//
//  Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
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
using Newtonsoft.Json.Linq;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A bridge to the PSPDFKit SDK.
    /// </summary>
    class PSPDFKitModule : ReactContextNativeModuleBase
    {
        private readonly PSPDFKitViewManger _viewManager;
        private string VERSION_KEY = "versionString";

        public PSPDFKitModule(ReactContext reactContext, PSPDFKitViewManger viewManager) : base(reactContext)
        {
            _viewManager = viewManager;
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
        ///
        /// Promise will resolve is the file opened correctly. Errors will also be propagated
        /// to the promise.
        /// 
        /// </summary>
        [ReactMethod]
        public void Present(string assetPath, JObject configuration, IPromise promise)
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                try
                {
                    var file = await StorageFile.GetFileFromPathAsync(assetPath);

                    await LoadFileAsync(file);

                    if (_viewManager != null)
                    {
                        _viewManager.SetConfiguration(_viewManager.PdfViewPage, configuration);
                    }
                    else
                    {
                        throw new Exception("PDFViewManager: is not ready or unavailable.");
                    }

                    promise.Resolve(null);
                }
                catch (Exception e)
                {
                    promise.Reject(e);
                }
            });
        }

        /// <summary>
        /// Opens the native file picker.
        /// </summary>
        /// <returns>The file chosen in the file picker.</returns>
        private static async Task<StorageFile> PickPDF()
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
        private async Task LoadFileAsync(StorageFile file)
        {
            if (file == null) throw new Exception("File cannot be null");
            if(_viewManager != null)
            {
                await _viewManager.OpenFileAsync(file);
            }
            else
            {
                throw new Exception("PDFViewManager: is not ready or unavailable.");
            }
        }

        /// <summary>
        /// Constants that can be used in the JS
        /// </summary>
        [Obsolete]
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
