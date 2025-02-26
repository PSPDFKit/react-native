//
//  Copyright © 2019-2025 PSPDFKit GmbH. All rights reserved.
//
//  The PSPDFKit Sample applications are licensed with a modified BSD license.
//  Please see License for details. This notice may not be removed from this file.
//

import Instant
import PSPDFKit

/**
 Downloads and shows a document managed by Instant, and shows a
 button to share the document URL so you can see Instant syncing.
 */
class InstantDocumentViewController: InstantViewController {
    private let documentInfo: InstantDocumentInfo
    private let client: InstantClient
    private let documentDescriptor: InstantDocumentDescriptor

    init(documentInfo: InstantDocumentInfo) throws {
        /*
         Create the Instant objects with the information from the PSPDFKit for Web examples server.

         The `PSPDFDocument` you get from Instant does not retain the objects that create it,
         so we need to keep references to the client and document descriptor otherwise with no
         strong references they would deallocate and syncing would stop.
         */
        client = try InstantClient(serverURL: documentInfo.serverURL)

        documentDescriptor = try client.documentDescriptor(forJWT: documentInfo.jwt)

        // Store document info for sharing later.
        self.documentInfo = documentInfo

        // Tell Instant to download the document from Web examples server’s Nutrient Document Engine instance.
        do {
            try documentDescriptor.download(usingJWT: documentInfo.jwt)
        } catch InstantError.alreadyDownloaded {
            // This is fine, we only have to reauthenticate. Any other errors are passed up.
            documentDescriptor.reauthenticate(withJWT: documentInfo.jwt)
        }

        // Get the `PSPDFDocument` from Instant.
        let pdfDocument = documentDescriptor.editableDocument

        // Set the document on the `PSPDFInstantViewController` (the superclass) so it can show the download progress, and then show the document.
        super.init(document: pdfDocument, configuration: PDFConfiguration {
            $0.pageTransition = .scrollContinuous
            $0.scrollDirection = .vertical
        })

        let collaborateItem = UIBarButtonItem(title: "Collaborate", style: .plain, target: self, action: #selector(showCollaborationOptions(_:)))
        let barButtonItems = [collaborateItem, annotationButtonItem]
        navigationItem.setRightBarButtonItems(barButtonItems, for: .document, animated: false)
    }

    @available(*, unavailable)
    required init?(coder decoder: NSCoder) {
        fatalError("init(coder:) is not supported.")
    }

    deinit {
        do {
            /*
             Since this demo is ephemeral, clean up immediately.
             Note that this also cancels syncing that is in-progress.
             */
            try documentDescriptor.removeLocalStorage()
        } catch {
            print("Could not remove Instant document storage: \(error)")
        }
    }

    private let notificationNames: [Notification.Name] = [.PSPDFInstantDidFailDownload, .PSPDFInstantDidFailSyncing, .PSPDFInstantDidFailAuthentication, .PSPDFInstantDidFailReauthentication]

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        for name in notificationNames {
            NotificationCenter.default.addObserver(self, selector: #selector(showError(notification:)), name: name, object: documentDescriptor)
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        for name in notificationNames {
            NotificationCenter.default.removeObserver(self, name: name, object: documentDescriptor)
        }
    }

    @objc private func showError(notification: Notification) {
        // Notifications from Instant will be posted on a background thread.
        DispatchQueue.main.async {

            let title: String
            switch notification.name {
            case .PSPDFInstantDidFailDownload:
                title = "Couldn’t Download Document"
            case .PSPDFInstantDidFailSyncing:
                title = "Couldn’t Sync"
            case .PSPDFInstantDidFailAuthentication:
                title = "Couldn’t Authenticate"
            case .PSPDFInstantDidFailReauthentication:
                title = "Couldn’t Reauthenticate"
            default:
                fatalError("Unexpected notification name \(notification.name)")
            }

            let error = notification.userInfo?[PSPDFInstantErrorKey] as? NSError

            let alertController = UIAlertController(title: title, message: error?.localizedDescription, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "OK", style: .cancel))
            self.psc_frontmost.present(alertController, animated: true, completion: nil)
        }
    }

    @objc private func showCollaborationOptions(_ sender: UIBarButtonItem) {
        let alertController = UIAlertController(title: documentInfo.serverURL.absoluteString, message: nil, preferredStyle: .actionSheet)
        alertController.popoverPresentationController?.barButtonItem = sender

        alertController.addAction(UIAlertAction(title: "Open in Safari", style: .default, handler: { [unowned self] _ in
            UIApplication.shared.open(self.documentInfo.serverURL, options: [:], completionHandler: nil)
        }))
        alertController.addAction(UIAlertAction(title: "Share Document Link", style: .default, handler: { [unowned self] _ in
            let activityViewController = UIActivityViewController(activityItems: [self.documentInfo.serverURL], applicationActivities: nil)
            activityViewController.popoverPresentationController?.barButtonItem = sender

            self.present(activityViewController, animated: true)
        }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel))

        present(alertController, animated: true)
    }
}
