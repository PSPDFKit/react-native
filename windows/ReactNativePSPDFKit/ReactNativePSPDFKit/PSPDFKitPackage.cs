using PSPDFKit;
using PSPDFKit.Pdf;
using PSPDFKit.UI;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;

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
        private PSPDFKitViewManger _pspdfkitViewManger;

        public PSPDFKitPackage(string license)
        {
            Sdk.Initialize(license);
            _pspdfkitViewManger = new PSPDFKitViewManger();
        }

        /// <summary>
        /// Creates the PSPDFKitModule native modules to register with the react
        /// instance.
        /// </summary>
        /// <param name="reactContext">The react application context.</param>
        /// <returns>The list of native modules.</returns>
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            return new List<INativeModule>
            {
                new PSPDFKitModule(reactContext, _pspdfkitViewManger),
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
