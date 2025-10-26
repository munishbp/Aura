//
//  appdelegate.swift
//  facescanner
//
//

import UIKit
import CoreData

// the main app delegate that handles app startup
@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    // app lifecycle stuff

    // called when the app first launches
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // anything u need to do at startup goes here
        return true
    }

    // scene lifecycle

    // called when a new window is opened
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    // called when a window is closed
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // clean up stuff when windows close
    }

    // core data stuff

    // the container for storing data in core data
    // loads the database and saves stuff to disk
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "FaceScanner")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // if the database cant be created this crashes
                // can happen if no storage space or bad permissions
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()

    // saving stuff to core data

    // saves any changes to core data
    func saveContext () {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }

}

