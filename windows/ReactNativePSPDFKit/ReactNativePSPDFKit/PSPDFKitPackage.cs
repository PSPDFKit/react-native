//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;
using Windows.UI.Xaml;

namespace ReactNativePSPDFKit
{
    /// <summary>
    /// Package defining core framework modules (e.g., <see cref="UIManagerModule"/>).
    /// It should be used for modules that require special integration with
    /// other framework parts (e.g., with the list of packages to load view
    /// managers from).
    /// </summary>
    public class PSPDFKitPackage : IReactPackage
    {
        private readonly PSPDFKitViewManger _pspdfkitViewManger;

        /// <summary>
        /// Creates a PSPDFKit package with the default settings.
        /// </summary>
        public PSPDFKitPackage()
        {
            _pspdfkitViewManger = new PSPDFKitViewManger(null);
        }

        /// <summary>
        /// Creates a PSPDFKit package with a theming css.
        /// <param name="cssResource">CSS theming file.</param>
        /// </summary>
        public PSPDFKitPackage(Uri cssResource)
        {
            _pspdfkitViewManger = new PSPDFKitViewManger(cssResource);
        }

        /// <summary>
        /// Creates the PSPDFKitModule native modules to register with the react
        /// instance.
        /// </summary>
        /// <param name="reactContext">The react application context.</param>
        /// <returns>The list of native modules.</returns>
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            object pspdfkitLicense;
            try
            {
                pspdfkitLicense = Application.Current.Resources["PSPDFKitLicense"];
            }
            catch (Exception)
            {
                throw new Exception("Please ensure you define PSPDFKitLicense. See https://github.com/PSPDFKit/react-native#running-catalog-project-2");
            }

            return new List<INativeModule>
            {
                new PSPDFKitModule(reactContext, _pspdfkitViewManger),
                new LibraryModule(reactContext, pspdfkitLicense as string)
            };
        }

        /// <summary>
        /// Creates the list of JavaScript modules to register with the
        /// react instance.
        /// </summary>
        /// <returns>The list of JavaScript modules.</returns>
        public IReadOnlyList<Type> CreateJavaScriptModulesConfig()
        {
            return new List<Type>(0);
        }

        /// <summary>
        /// Creates the PSPDFKit View manager that should be registered with
        /// the <see cref="UIManagerModule"/>.
        /// </summary>
        /// <param name="reactContext">The react application context.</param>
        /// <returns>The list of view managers.</returns>
        public IReadOnlyList<IViewManager> CreateViewManagers(ReactContext reactContext)
        {
            return new List<IViewManager>
            {
                _pspdfkitViewManger,
            };
        }
    }
}
