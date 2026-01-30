//
//  Copyright © 2016-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import React
import PSPDFKit
import React_RCTAppDelegate
import ReactAppDependencyProvider

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()
        
        reactNativeDelegate = delegate
        reactNativeFactory = factory
        
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // Set up PSPDFKit-specific customizations
        let tintColor = UIColor(red: 0.40, green: 0.35, blue: 0.29, alpha: 1.0)
        window?.tintColor = tintColor
        
        UINavigationBar.appearance().tintColor = tintColor // Back button and bar button items
        UINavigationBar.appearance().titleTextAttributes = [NSAttributedString.Key.foregroundColor: tintColor] // Title color
        
        factory.startReactNative(withModuleName: "Catalog", in: window, launchOptions: launchOptions)
        
        return true
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
    
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
} 
