//
//  Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using System;
using ReactNative.UIManager;
using ReactNative.UIManager.Annotations;
using Windows.Storage;
using Newtonsoft.Json.Linq;
using PSPDFKit.UI;
using ReactNativePSPDFKit.Events;

namespace ReactNativePSPDFKit
{
    public class PSPDFKitViewManger : SimpleViewManager<PDFViewPage>
    {

        private const int COMMAND_ENTER_ANNOTATION_CREATION_MODE = 1;
        private const int COMMAND_EXIT_CURRENTLY_ACTIVE_MODE = 2;
        private const int COMMAND_SAVE_CURRENT_DOCUMENT = 3;
        private const int COMMAND_GET_ANNOTATIONS = 4;
        private const int COMMAND_ADD_ANNOTATION = 5;
        private const int COMMAND_GET_TOOLBAR_ITEMS = 6;
        private const int COMMAND_SET_TOOLBAR_ITEMS = 7;

        internal readonly PDFViewPage PdfViewPage = new PDFViewPage();

        protected override PDFViewPage CreateViewInstance(ThemedReactContext reactContext)
        {
            return PdfViewPage;
        }

        /// <summary>
        /// The name to be used when creating the js modules
        /// </summary>
        public override string Name => "RCTPSPDFKitView";

        [ReactProp("document")]
        public async void SetDocumentAsync(PDFViewPage view, string document)
        {
            var storagefile = await StorageFile.GetFileFromApplicationUriAsync(new Uri(document));
            await view.SetDefaultDocument(storagefile);
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

        [ReactProp("pdfStyle")]
        public async void SetCustomCss(PDFViewPage view, JObject styleJObject)
        {
            var colorString = string.Empty;
            if (styleJObject.ContainsKey("highlightColor"))
            {
                var highlightColor = ColorHelpers.Parse(styleJObject["highlightColor"].Value<uint>());
                colorString += $"    --primary: {highlightColor.ToHexWithoutAlpha()};\r\n";
            }

            if (styleJObject.ContainsKey("primaryColor"))
            {
                var primaryColor = ColorHelpers.Parse(styleJObject["primaryColor"].Value<uint>());
                colorString += $"    --primary-dark-1: {primaryColor.ToHexWithoutAlpha()};\r\n";
            }

            if (styleJObject.ContainsKey("primaryDarkColor"))
            {
                var primaryDarkColor = ColorHelpers.Parse(styleJObject["primaryDarkColor"].Value<uint>());
                colorString += $"    --primary-dark-2: {primaryDarkColor.ToHexWithoutAlpha()};\r\n";
            }

            if (colorString.Length > 0)
            {
                var cssTemplate =
                    await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///ReactNativePSPDFKit/Assets/customTheme.css"));

                var cssTemplateString = await FileIO.ReadTextAsync(cssTemplate);
                cssTemplateString = cssTemplateString.Replace("${colors}", colorString);
                
                // We have to write a file in the temp folder due to permission issues.
                var storageFolder = ApplicationData.Current.TemporaryFolder;
                var sampleFile = await storageFolder.CreateFileAsync("windows.css", CreationCollisionOption.ReplaceExisting);
                await FileIO.WriteTextAsync(sampleFile, cssTemplateString);

                // Now we get the assets folder to copy the final css file into and move the previous file.
                var appInstalledFolder = Windows.ApplicationModel.Package.Current.InstalledLocation;
                var assetsFolder = await appInstalledFolder.GetFolderAsync("Assets");
                await sampleFile.MoveAsync(assetsFolder, "windows.css", NameCollisionOption.ReplaceExisting);

                // Pass the the css file to the pdf view in a web context.
                PdfViewPage.Pdfview.Css = new Uri("ms-appx-web:///Assets/windows.css");
            }
        }

        public override JObject ViewCommandsMap => new JObject
        {
            {
                "enterAnnotationCreationMode", COMMAND_ENTER_ANNOTATION_CREATION_MODE
            },
            {
                "exitCurrentlyActiveMode", COMMAND_EXIT_CURRENTLY_ACTIVE_MODE
            },
            {
                "saveCurrentDocument", COMMAND_SAVE_CURRENT_DOCUMENT
            },
            {
                "getAnnotations", COMMAND_GET_ANNOTATIONS
            },
            {
                "addAnnotation", COMMAND_ADD_ANNOTATION
            },
            {
                "getToolbarItems", COMMAND_GET_TOOLBAR_ITEMS
            },
            {
                "setToolbarItems", COMMAND_SET_TOOLBAR_ITEMS
            }
        };

        public override async void ReceiveCommand(PDFViewPage view, int commandId, JArray args)
        {
            switch (commandId)
            {
                case COMMAND_ENTER_ANNOTATION_CREATION_MODE:
                    await PdfViewPage.SetInteractionMode(args[0].Value<int>(), InteractionMode.Note);
                    break;
                case COMMAND_EXIT_CURRENTLY_ACTIVE_MODE:
                    await PdfViewPage.SetInteractionMode(args[0].Value<int>(), InteractionMode.None);
                    break;
                case COMMAND_SAVE_CURRENT_DOCUMENT:
                    await PdfViewPage.ExportCurrentDocument(args[0].Value<int>());
                    break;
                case COMMAND_GET_ANNOTATIONS:
                    await PdfViewPage.GetAnnotations(args[0].Value<int>(), args[1].Value<int>());
                    break;
                case COMMAND_ADD_ANNOTATION:
                    await PdfViewPage.CreateAnnotation(args[0].Value<int>(), args[1].ToString());
                    break;
                case COMMAND_GET_TOOLBAR_ITEMS:
                    PdfViewPage.GetToolbarItems(args[0].Value<int>());
                    break;
                case COMMAND_SET_TOOLBAR_ITEMS:
                    await PdfViewPage.SetToolbarItems(args[0].Value<int>(), args[1].ToString());
                    break;
            }
        }

        public override JObject CustomDirectEventTypeConstants =>
            new JObject
            {
                {
                    PdfViewAnnotationChangedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onAnnotationsChanged"},
                    }
                },
                {
                    PdfViewDocumentSavedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDocumentSaved"},
                    }
                },
                {
                    PdfViewDocumentSaveFailedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDocumentSaveFailed"},
                    }
                },
                {
                    PdfViewDataReturnedEvent.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onDataReturned"},
                    }
                },
                {
                    PdfViewOperationResult.EVENT_NAME,
                    new JObject
                    {
                        {"registrationName", "onOperationResult"},
                    }
                }
            };
    }
}
