//
//  scenedelegate.swift
//  facescanner
//
//

import UIKit

// handles window stuff and scene lifecycle
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    // properties

    // the main window
    var window: UIWindow?

    // scene lifecycle

    // called when the app window is being created
    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let _ = (scene as? UIWindowScene) else { return }
    }

    // called when the window is closing
    func sceneDidDisconnect(_ scene: UIScene) {
        // cleanup stuff when window closes
    }

    // called when the app becomes active
    func sceneDidBecomeActive(_ scene: UIScene) {
        // resume anything u paused
    }

    // called when something interrupts the app (phone call, notification)
    func sceneWillResignActive(_ scene: UIScene) {
        // pause stuff
    }

    // called when app comes back from background
    func sceneWillEnterForeground(_ scene: UIScene) {
        // undo whatever u did in background
    }

    // called when app goes to background
    func sceneDidEnterBackground(_ scene: UIScene) {
        // save data before the app is suspended
        (UIApplication.shared.delegate as? AppDelegate)?.saveContext()
    }

}

