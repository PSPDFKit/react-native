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
using System.Threading.Tasks;
using Windows.ApplicationModel.Core;
using Windows.Storage;
using Microsoft.Toolkit.Uwp.Helpers;
using Newtonsoft.Json.Linq;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// A bridge to the PSPDFKit SDK.
    /// </summary>
    class LibraryModule : ReactContextNativeModuleBase
    {
        public LibraryModule(ReactContext reactContext, string license) : base(reactContext)
        {
            Sdk.Initialize(license);
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
        public async void OpenLibrary(string libraryName, string path, IPromise promise)
        {
            await CoreApplication.MainView.Dispatcher.AwaitableRunAsync(async () =>
            {
                try
                {
                    var storageFolder = await StorageFolder.GetFolderFromPathAsync(path);

                    using (var library = await Library.OpenLibraryAsync(libraryName))
                    {
                        // Queue up the PDFs in the folder for indexing.
                        await library.EnqueueDocumentsInFolderAsync(storageFolder);
                    }

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
        public async void OpenLibraryPicker(string libraryName, IPromise promise)
        {
            await CoreApplication.MainView.Dispatcher.AwaitableRunAsync(async () =>
            {
                try
                {
                    // Allow the user to choose a folder to index.
                    var folderPicker = new Windows.Storage.Pickers.FolderPicker
                    {
                        SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Desktop
                    };
                    folderPicker.FileTypeFilter.Add("*");

                    var folder = await folderPicker.PickSingleFolderAsync();
                    if (folder != null)
                    {
                        using (var library = await Library.OpenLibraryAsync(libraryName))
                        {
                            // Queue up the PDFs in the folder for indexing.
                            await library.EnqueueDocumentsInFolderAsync(folder);
                        }
                        promise.Resolve(true);
                    }
                    else
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
        public async void SearchLibrary(string libraryName, JObject searchLibraryQuery, IPromise promise)
        {
            await CoreApplication.MainView.Dispatcher.AwaitableRunAsync(async () =>
            {
                JToken resultJson = null;
                using (var library = await Library.OpenLibraryAsync(libraryName))
                {
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

                    if (previewsFromHandlerTcs != null)
                    {
                        var previewResults = await previewsFromHandlerTcs.Task;
                        resultJson = JsonUtils.PreviewResultsToJson(previewResults);
                    }

                    if (resultsFromHandlerTcs != null)
                    {
                        var resultsFromHandler = await resultsFromHandlerTcs.Task;
                        resultJson = JsonUtils.SearchResultsToJson(resultsFromHandler);
                    }
                }
                promise.Resolve(resultJson);
            });
        }

        [ReactMethod]
        public async void DeleteAllLibraries(IPromise promise)
        {
            await CoreApplication.MainView.Dispatcher.AwaitableRunAsync(async () =>
            {
                await Library.DeleteAllLibrariesAsync();
            });

            promise.Resolve(null);
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
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "ReactPSPDFKitLibrary";
    }
}
