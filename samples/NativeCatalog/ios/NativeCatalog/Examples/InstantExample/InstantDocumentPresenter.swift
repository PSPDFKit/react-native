//
//  Copyright © 2018-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import PSPDFKitUI

/**
 Connects to our public PSPDFKit for Web examples server to present documents managed by PSPDFKit Instant.
 This is decoupled from any view controller in order to support loading documents by opening URLs.
 */
public class InstantDocumentPresenter {
    /**
     Interfaces with our Web examples server to create and access documents.
     In your own app you would connect to your own server backend to get Instant document identifiers and authentication tokens.
     */
    private lazy var apiClient = WebExamplesAPIClient(presentingViewController: presentingViewController)

    /// View controller that can present other view controllers.
    private weak var presentingViewController: UIViewController?

    /// Initialize a document presenter with a view controller that can present other view controllers.
    public init(presentingViewController: UIViewController) {
        self.presentingViewController = presentingViewController
    }

    /// Tries to create a new Instant session.
    public func createNewSession() {
        loadSession(loadingMessage: "Creating") { completion in
            self.apiClient.createNewSession(completion: completion)
        }
    }

    /**
     Tries to join an existing Instant session or shows an alert on failure.

     - Parameter urlString: An Instant document URL scanned from a barcode or entered by the user.
     */
    public func joinExistingSession(withURL urlString: String) {
        guard let url = URL(string: urlString) else {
            showAlert(withTitle: "Couldn’t Join Group", message: "This is not a link. Please enter an Instant document link.")
            return
        }

        loadSession(loadingMessage: "Verifying") { completion in
            self.apiClient.resolveExistingSessionURL(url, completion: completion)
        }
    }

    /**
     Loads an Instant session using the specified API call. The passed in closure should run an
     asynchronous API call. That closure will be passed another closure to run on completion.
     */
    private func loadSession(loadingMessage: String, APICall: @escaping (@escaping WebExamplesAPIClient.CompletionHandler) -> Void) {
        let progressHUDItem = StatusHUDItem.indeterminateProgress(withText: loadingMessage)
        progressHUDItem.setHUDStyle(.black)

        progressHUDItem.push(animated: true, on: presentingViewController?.view.window) {
            APICall { result in
                DispatchQueue.main.async {
                    progressHUDItem.pop(animated: true, completion: nil)

                    switch result {
                    case let .success(documentInfo):
                        do {
                            try self.openDocument(with: documentInfo)
                        } catch {
                            self.showAlert(withTitle: "Couldn’t Set Up Instant", message: error.localizedDescription)
                        }

                    case .failure(WebExamplesAPIClient.Failure.cancelled):
                        break // Do not show the alert if user cancelled the request themselves.

                    case let .failure(otherError):
                        self.showAlert(withTitle: "Couldn’t Get Instant Document Info", message: otherError.localizedDescription)
                    }
                }
            }
        }
    }

    private func openDocument(with info: InstantDocumentInfo) throws {
        let instantViewController = try InstantDocumentViewController(documentInfo: info)

        let navigationController = UINavigationController(rootViewController: instantViewController)
        navigationController.modalPresentationStyle = .fullScreen

        presentOnFrontmostViewController(navigationController)
    }

    private func showAlert(withTitle title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .cancel))

        presentOnFrontmostViewController(alertController)
    }

    private func presentOnFrontmostViewController(_ viewController: UIViewController) {
        guard let rootViewController = presentingViewController?.viewIfLoaded?.window?.rootViewController else {
            print("Couldn’t show view controller because no root view controller was found.")
            return
        }

        rootViewController.psc_frontmost.present(viewController, animated: true, completion: nil)
    }
}
