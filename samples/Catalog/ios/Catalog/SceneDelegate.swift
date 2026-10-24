//
//  Copyright © 2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import React_RCTAppDelegate

// Apps built with the iOS 27 SDK must use the scene life cycle, or they fail to launch on iOS 27.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene,
              let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            return
        }

        let window = UIWindow(windowScene: windowScene)
        window.tintColor = AppDelegate.tintColor
        self.window = window
        appDelegate.window = window

        // No launch options are passed on. With the scene life cycle, a launch URL, user
        // activity or notification arrives in `connectionOptions`, not in the app delegate's
        // launch options, and React Native 0.83 has no scene-aware way to take them. The
        // Catalog handles none of them; an app that does has to hand them to React Native
        // itself, or `Linking.getInitialURL()` returns null on a cold start from a link.
        appDelegate.reactNativeFactory?.startReactNative(withModuleName: "Catalog", in: window)
    }

    // Drops the window when UIKit discards the scene, so it doesn't outlive it through
    // `AppDelegate.window`. A reconnected scene gets a new window and React Native view.
    func sceneDidDisconnect(_ scene: UIScene) {
        if let appDelegate = UIApplication.shared.delegate as? AppDelegate, appDelegate.window === window {
            appDelegate.window = nil
        }
        window = nil
    }
}
