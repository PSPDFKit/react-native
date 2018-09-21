//
//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using PSPDFKit;
using PSPDFKit.Search;
using PSPDFKitFoundation.Search;
using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.UI.Popups;
using Newtonsoft.Json.Linq;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A bridge to the PSPDFKit SDK.
    /// </summary>
    class PSPDFKitModule : ReactContextNativeModuleBase
    {
        private readonly PDFViewPage _pdfViewPage;
        private string VERSION_KEY = "versionString";
        private readonly Dictionary<string,Library> _libraries = new Dictionary<string, Library>();

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
                    var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri(assetPath));

                    await LoadFileAsync(file);
                }
                catch (Exception)
                {
                    var dialog = new MessageDialog("Unable to open the file specified.");
                    await dialog.ShowAsync();
                }
            });
        }

        /// <summary>
        /// Open a search library from a ms path.
        /// Multiple libraries maybe open at once. Use the name to reference each library.
        /// Promise will resolve with true if library is opened. Promise will reject if folder is inaccessible.
        /// <param name="libraryName">Name to give the library</param>
        /// <param name="uri">A path to a folder to index. The application must have permission to the path.</param>
        /// See https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions
        /// </summary>
        [ReactMethod]
        public void OpenLibrary(string libraryName, string path, IPromise promise)
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                try
                {
                    Sdk.Initialize(_pdfViewPage.Pdfview.License);

                    // If we have already opened a library with the same name, reject.
                    if (_libraries.ContainsKey(libraryName))
                    {
                        promise.Reject(new Exception($"{libraryName} has already been added."));
                        return;
                    }
                    _libraries.Add(libraryName, await Library.OpenLibraryAsync(libraryName));

                    var storageFolder = await StorageFolder.GetFolderFromPathAsync(path);
                    
                    // Queue up the PDFs in the folder for indexing.
                    await _libraries[libraryName].EnqueueDocumentsInFolderAsync(storageFolder);

                    promise.Resolve(true);
                }
                catch (Exception e)
                {
                    promise.Reject(e);
                }
            });
        }

        /// <summary>
        /// Open a search library with the use of a folder picker.
        /// Multiple libraries maybe open at once. Use the name to reference each library.
        /// Promise will resolve with true if library is opened. Promise will reject if folder is inaccessible.
        /// <param name="libraryName">Name to give the library</param>
        /// </summary>
        [ReactMethod]
        public void OpenLibraryPicker(string libraryName, IPromise promise)
        { 
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                try
                {
                    Sdk.Initialize(_pdfViewPage.Pdfview.License);

                    // If we have already opened a library with the same name, reject.
                    if (_libraries.ContainsKey(libraryName))
                    {
                        promise.Reject(new Exception($"{libraryName} has already been added."));
                        return;
                    }
                    _libraries.Add(libraryName, await Library.OpenLibraryAsync(libraryName));

                    // Allow the user to choose a folder to index.
                    var folderPicker = new Windows.Storage.Pickers.FolderPicker
                    {
                        SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Desktop
                    };
                    folderPicker.FileTypeFilter.Add("*");

                    var folder = await folderPicker.PickSingleFolderAsync();
                    if (folder != null)
                    {
                        // Queue up the PDFs in the folder for indexing.
                        await _libraries[libraryName].EnqueueDocumentsInFolderAsync(folder);

                        promise.Resolve(true);
                    } else
                    {
                        promise.Reject(new System.IO.FileNotFoundException("Folder not accessible"));
                    }
                }
                catch (Exception e)
                {
                    promise.Reject(e);
                }
            });
        }

        /// <summary>
        /// Search a given library for the searchTerm and provide a promise
        /// to retreive the page indexes of found instances.
        /// 
        /// Json return example
        /// [
        ///     {
        ///         "uid": "{2B94FFD0-F846-4902-8A11-75C3D1E5B2A3}/default.pdf",
        ///         "pageResults": [ 2 ]
        ///     }
        /// ]
        /// or if previews are generated.
        /// [
        ///     {
        ///         "uid": "{2B94FFD0-F846-4902-8A11-75C3D1E5B2A3}/default.pdf",
        ///         "pageIndex": 2,
        ///         "previewText": "example in PSPDFKit.",
        ///         "rangeInText": {
        ///             "position": 27,
        ///             "length": 8
        ///         },
        ///         "rangeInPreviewText": {
        ///             "position": 11,
        ///             "length": 8
        ///         },
        ///         "annotationId": 55
        ///     },
        /// ]
        /// 
        /// </summary>
        /// <param name="libraryName">Name of library to search.</param>
        /// <param name="searchLibraryQuery">Configuration of query </param>
        /// Example of configuration. All Items except search string are optional.
        /// const libraryConfiguration = {
        ///     searchString: "pspdfkit",
        ///     excludeAnnotations: false,
        ///     excludeDocumentText: false,
        ///     matchExactPhrases: false,
        ///     maximumSearchResultsPerDocument: 0,
        ///     maximumSearchResultsTotal: 500,
        ///     maximumPreviewResultsPerDocument: 0,
        ///     maximumPreviewResultsTotal: 500,
        ///     generateTextPreviews: true,
        ///     previewRange: { position: 20, length: 120 }
        /// }
        [ReactMethod]
        public void SearchLibrary(string libraryName, JObject searchLibraryQuery, IPromise promise)
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                // Find the library to search and reject if not present.
                if (!_libraries.TryGetValue(libraryName, out var library))
                {
                    promise.Resolve(new Exception($"Library {libraryName} not loaded. Please use OpenLibrary."));
                    return;
                }
                await library.WaitForAllIndexingTasksToFinishAsync();

                var libraryQuery = JsonUtils.ToLibraryQuery(searchLibraryQuery);

                TaskCompletionSource<IList<LibraryPreviewResult>> previewsFromHandlerTcs = null;
                TaskCompletionSource<IDictionary<string, LibraryQueryResult>> resultsFromHandlerTcs = null;
                if (libraryQuery.GenerateTextPreviews)
                {
                    previewsFromHandlerTcs = GetPreviewCompleteTcs(library);
                }
                else
                {
                    resultsFromHandlerTcs = GetSearchCompleteTcs(library);
                }

                // We can do the searching in the background as the callbacks will receive the results.
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                library.SearchAsync(libraryQuery);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

                if (libraryQuery.GenerateTextPreviews)
                {
                    var previewResults = await previewsFromHandlerTcs.Task;
                    promise.Resolve(JsonUtils.PreviewResultsToJson(previewResults));
                }
                else
                {
                    var resultsFromHandler = await resultsFromHandlerTcs.Task;
                    promise.Resolve(JsonUtils.SearchResultsToJson(resultsFromHandler));
                }
            });
        }

        [ReactMethod]
        public void DeleteAllLibraries()
        {
            DispatcherHelpers.RunOnDispatcher(async () =>
            {
                foreach (var library in _libraries.Values)
                {
                    await library.CancelAllTasksAsync();
                }
                await Library.DeleteAllLibrariesAsync(); });
        }
        

        private static TaskCompletionSource<IDictionary<string, LibraryQueryResult>> GetSearchCompleteTcs(Library library)
        {
            var resultsFromHandlerTcs = new TaskCompletionSource<IDictionary<string, LibraryQueryResult>>();
            void SearchHandler(object sender, IDictionary<string, LibraryQueryResult> args)
            {
                library.OnSearchComplete -= SearchHandler;
                resultsFromHandlerTcs.SetResult(args);
            }

            library.OnSearchComplete += SearchHandler;

            return resultsFromHandlerTcs;
        }

        private static TaskCompletionSource<IList<LibraryPreviewResult>> GetPreviewCompleteTcs(Library library)
        {
            var previewsFromHandlerTcs = new TaskCompletionSource<IList<LibraryPreviewResult>>();
            void Previewhandler(object sender, IList<LibraryPreviewResult> args)
            {
                library.OnSearchPreviewComplete -= Previewhandler;
                previewsFromHandlerTcs.SetResult(args);
            }

            library.OnSearchPreviewComplete += Previewhandler;

            return previewsFromHandlerTcs;
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
