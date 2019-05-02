using System;
using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System.Collections.Generic;
using RNFS;

namespace Catalog
{
    class MainReactNativeHost : ReactNativeHost
    {
        public override string MainComponentName => "Catalog";

#if !BUNDLE || DEBUG
        public override bool UseDeveloperSupport => true;
#else
        public override bool UseDeveloperSupport => false;
#endif

        protected override string JavaScriptMainModuleName => "index";

#if BUNDLE
        protected override string JavaScriptBundleFile => "ms-appx:///ReactAssets/index.windows.bundle";
#endif

        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
            new ReactNativePSPDFKit.PSPDFKitPackage(),
            // Comment out the package above and uncomment the line below if you require an external theme.
//            new ReactNativePSPDFKit.PSPDFKitPackage(new Uri("ms-appx-web:///Assets/css/greenTheme.css")),
            new RNFSPackage()
        };
    }
}
