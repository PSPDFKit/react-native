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
using System.IO;
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
        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "ReactPSPDFKitLibrary";

        private readonly Dictionary<string, Library> _libraries = new Dictionary<string, Library>();

        public LibraryModule(ReactContext reactContext, string license) : base(reactContext)
        {
            Sdk.Initialize(license);
        }

        public override void OnReactInstanceDispose()
        {
            DisposeNativeLibraries();
        }

        /// <summary>
        /// Open a FTS library, the library will be created if it does not yet exist.
        /// Multiple libraries maybe open at once. Use the name to reference each library.
        /// Promise will resolve with true if library is opened.
        /// <param name="libraryName">Name to give the library</param>
        /// </summary>
        [ReactMethod]
        public async void OpenLibrary(string libraryName, IPromise promise)
        {
            if (_libraries.ContainsKey(libraryName))
            {
                promise.Resolve(null);
                return;
            }

            try
            {
                _libraries.Add(libraryName, await Library.OpenLibraryAsync(libraryName).AsTask().ConfigureAwait(false));
                
                promise.Resolve(null);
            }
            catch (Exception e)
            {
                promise.Reject(e);
            }
        }

        /// Enqueue the given path in the library requested.
        /// The Promise will resolve null when library has added the documents.
        /// If the library is not open the promise will reject.
        /// If the folder is inaccessable the promise will reject.
        /// <param name="libraryName">name of the library to use.</param>
        /// <param name="path">A path to a folder to index. The application must have permission to the path. Please use RNFS.</param>
        /// See https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions
        [ReactMethod]
        public async void EnqueueDocumentsInFolder(string libraryName, string path, IPromise promise)
        {
            if (!_libraries.ContainsKey(libraryName))
            {
                promise.Reject(new Exception($"Library {libraryName} has not been opened."));
                return;
            }

            try
            {
                var storageFolder = await StorageFolder.GetFolderFromPathAsync(path).AsTask().ConfigureAwait(false); ;
                // Queue up the PDFs in the folder for indexing.
                await EnqueueDocuments(_libraries[libraryName], storageFolder).ConfigureAwait(false); ;

                promise.Resolve(null);
            }
            catch (Exception e)
            {
                promise.Reject(e);
            }
        }

        /// <summary>
        /// Enqueue a folder chosen by the native picker.
        /// The Promise will resolve null when library has added the documents.
        /// Promise will reject if folder is inaccessible.
        /// <param name="libraryName">Name to give the library</param>
        /// </summary>
        [ReactMethod]
        public async void EnqueueDocumentsInFolderPicker(string libraryName, IPromise promise)
        {
            if (!_libraries.ContainsKey(libraryName))
            {
                promise.Reject(new Exception($"Library {libraryName} has not been opened."));
                return;
            }

            try
            {
                // Allow the user to choose a folder to index.
                var folderPicker = new Windows.Storage.Pickers.FolderPicker
                {
                    SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Desktop
                };
                folderPicker.FileTypeFilter.Add("*");

                StorageFolder folder = null;
                await CoreApplication.MainView.Dispatcher.AwaitableRunAsync(async () => {
                    folder = await folderPicker.PickSingleFolderAsync();
                }).ConfigureAwait(false); ;

                // Queue up the PDFs in the folder for indexing.
                await EnqueueDocuments(_libraries[libraryName], folder).ConfigureAwait(false); ;

                promise.Resolve(null);
            }
            catch (Exception e)
            {
                promise.Reject(e);
            }
        }

        private static async Task EnqueueDocuments(Library library, StorageFolder folder)
        {
            if (folder == null)
            {
                throw new FileNotFoundException("Folder not accessible");
            }
            // Queue up the PDFs in the folder for indexing.
            await library.EnqueueDocumentsInFolderAsync(folder).AsTask().ConfigureAwait(false);
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
            try
            {
                // If the library is not found KeyNotFoundException will be thrown and the promise will be rejected.
                var library = _libraries[libraryName];
                    
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
                
                // Ensure all indexing is complete before search.
                await library.WaitForAllIndexingTasksToFinishAsync().AsTask().ConfigureAwait(false);

                // We can do the searching in the background as the callbacks will receive the results.
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                library.SearchAsync(libraryQuery);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

                if (previewsFromHandlerTcs != null)
                {
                    var previewResults = await previewsFromHandlerTcs.Task.ConfigureAwait(false);
                    promise.Resolve(JsonUtils.PreviewResultsToJson(previewResults));
                }

                if (resultsFromHandlerTcs != null)
                {
                    var resultsFromHandler = await resultsFromHandlerTcs.Task.ConfigureAwait(false);
                    promise.Resolve(JsonUtils.SearchResultsToJson(resultsFromHandler));
                }
            }
            catch (Exception e)
            {
                promise.Reject(e);
            }
        }

        [ReactMethod]
        public async void DeleteAllLibraries()
        {
            // We have to ensure that we remove all handles to the database before deleting.
            DisposeNativeLibraries();
            await Library.DeleteAllLibrariesAsync().AsTask().ConfigureAwait(false); ;
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

        private void DisposeNativeLibraries()
        {
            foreach (var library in _libraries.Values)
            {
                library.Dispose();
            }
            _libraries.Clear();
        }
    }
}
