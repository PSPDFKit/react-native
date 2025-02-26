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

public class InstantDocumentViewController: InstantViewController {
    private let documentInfo: InstantDocumentInfo
    @objc public let client: InstantClient
    @objc public let documentDescriptor: InstantDocumentDescriptor

    @objc var manager: RCTPSPDFKitManager?

    @objc public init(documentInfo: InstantDocumentInfo, configuration: PDFConfiguration) throws {
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
        super.init(document: pdfDocument, configuration:configuration)
    }

    @available(*, unavailable)
    required init?(coder decoder: NSCoder) {
        fatalError("init(coder:) is not supported.")
    }

    private let notificationNames: [Notification.Name] = [.PSPDFInstantDidFailDownload, .PSPDFInstantDidFailSyncing, .PSPDFInstantDidFailAuthentication, .PSPDFInstantDidFailReauthentication]

    override public func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

    }

    override public func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        for name in notificationNames {
            NotificationCenter.default.removeObserver(self, name: name, object: documentDescriptor)
        }
    }

}
