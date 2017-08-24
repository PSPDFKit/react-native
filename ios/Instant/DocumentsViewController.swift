//
//  DocumentsViewController.swift
//  PSPDFInstant-iOS-Example
//
//  Copyright © 2017 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import Instant

@objc(DocumentsViewController)
class DocumentsViewController: UITableViewController, PSPDFInstantClientDelegate {
    private let cellReuseIdentifier = "cell"

    struct RowData {
        let title: String
        let documentDescriptor: PSPDFInstantDocumentDescriptor
    }

    /// The array used in the table view data source methods.
    private var listData: [RowData] = [] {
        didSet {
            precondition(Thread.isMainThread)
            guard isViewLoaded else {
                return
            }
            tableView.reloadData()
        }
    }

    private var documentListFetchTask: URLSessionTask?

    /// Used to ensure we only push a view controller for the most recent document the user tapped on.
    private var documentIdentifierToShowOnFinishingDownload: String?

    /// Used to keep track of the last document shown in a view controller, so we can pop it if the document is removed remotely.
    private var lastShownDocumentIdentifier: String?

    /// Client for the PSPDFKit Server.
    let instantClient: PSPDFInstantClient

    /// Client for the example server, as a stand-in for your own backend.
    let apiClient: APIClient

    override init(style: UITableViewStyle) {
        self.instantClient = PSPDFInstantClient(serverURL: URL(string: "http://localhost:5000/")!)
        self.apiClient = APIClient(baseURL: URL(string: "http://localhost:3000/")!, userID: "test", password: "")

      super.init(style: style)
    }

    init(instantClient: PSPDFInstantClient, apiClient: APIClient) {
        self.instantClient = instantClient
        self.apiClient = apiClient

        super.init(style: .plain)

        instantClient.delegate = self
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.register(UITableViewCell.self, forCellReuseIdentifier: cellReuseIdentifier)
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(reloadList))
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(close))
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        if listData.isEmpty {
            reloadList()
        }
    }

    func close() {
      self.dismiss(animated: true) {

      }
    }

    func reloadList() {
        let task = apiClient.fetchDocumentListTask { result in
            switch result {
            case .failure(let reason):
                print("Could not fetch document list: \(reason)")
            case .success(let apiClientDocuments):
                if apiClientDocuments.isEmpty {
                    print("No documents found. Upload one at \(self.apiClient.baseURL)")
                }

                let newListData = apiClientDocuments.flatMap { document -> RowData? in
                    do {
                        let documentDescriptor = try self.instantClient.documentDescriptor(withIdentifier: document.identifier)
                        return RowData(title: document.title, documentDescriptor: documentDescriptor)
                    } catch {
                        print("Could not make document descriptor from \(document.identifier): \(error)")
                        return nil
                    }
                }

                DispatchQueue.main.async {
                    self.listData = newListData
                }
            }
        }

        documentListFetchTask?.cancel()
        documentListFetchTask = task
        task.resume()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        documentListFetchTask?.cancel()
        documentListFetchTask = nil
    }

    // MARK: - UITableViewDataSource

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listData.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let rowData = listData[indexPath.row]
        var text = rowData.title

        // For demonstration, add a cloud if the document has not been downloaded.
        if rowData.documentDescriptor.isDownloaded == false {
            text += " ☁️"
        }

        let cell = tableView.dequeueReusableCell(withIdentifier: cellReuseIdentifier, for: indexPath)
        cell.textLabel!.text = text

        return cell
    }

    // MARK: - UITableViewDelegate

    private var documentsBeingDownloaded: Set<String> = []

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let rowData = listData[indexPath.row]
        let descriptor = rowData.documentDescriptor
        let ID = descriptor.identifier

        if descriptor.isDownloaded {
            if let pdfDocument = descriptor.editableDocument {
                showPDFViewController(with: pdfDocument, documentIdentifier: descriptor.identifier)
            }
            return
        }

        documentIdentifierToShowOnFinishingDownload = ID

        guard documentsBeingDownloaded.insert(ID).inserted else {
            return
        }

        apiClient.fetchAuthenticationTokenTaskForDocument(with: ID, completionHandler: { result in
            DispatchQueue.main.async {
                switch result {
                case .failure(let reason):
                    print("Could not fetch authentication token for document ‘\(ID)’: \(reason)")
                    self.documentsBeingDownloaded.remove(ID)
                case .success(let JWT):
                    do {
                        try descriptor.downloadDocument(usingAuthenticationToken: JWT)
                    } catch {
                        print("Could not start downloading document with identifier \(descriptor.identifier): \(error)")
                        self.documentsBeingDownloaded.remove(ID)
                    }
                }
            }
        }).resume()
    }

    // MARK: -

    private func showPDFViewController(with document: PSPDFDocument, documentIdentifier: String) {
        documentIdentifierToShowOnFinishingDownload = nil

        let pdfViewController = PSPDFInstantViewController(document: document)
        let deleteItem = UIBarButtonItem(barButtonSystemItem: .trash, target: self, action: #selector(removeDocumentStorage(_:)))
        let barItems = [pdfViewController.thumbnailsButtonItem, pdfViewController.annotationButtonItem, deleteItem]
        pdfViewController.navigationItem.setRightBarButtonItems(barItems, for: .document, animated: false)
        self.navigationController?.pushViewController(pdfViewController, animated: true)
        lastShownDocumentIdentifier = documentIdentifier
    }

    @IBAction
    func removeDocumentStorage(_ sender: Any?) {
        guard
            let documentID = lastShownDocumentIdentifier,
            let documentDescriptor = try? instantClient.documentDescriptor(withIdentifier: documentID)
            else { return }
        do {
            try documentDescriptor.removeLocalStorage()
            tableView.reloadData()
        } catch {
            print(error)
        }
    }

    // MARK: - PSPDFInstantClientDelegate

    func instantClient(_ instantClient: PSPDFInstantClient, didFinishDownloadForDocument documentDescriptor: PSPDFInstantDocumentDescriptor) {
        DispatchQueue.main.async {
            self.documentsBeingDownloaded.remove(documentDescriptor.identifier)

            // Find matching document
            guard let row = self.listData.index(where: { $0.documentDescriptor === documentDescriptor }) else {
                return
            }

            self.tableView?.reloadRows(at: [IndexPath(row: row, section: 0)], with: .automatic)

            if documentDescriptor.identifier == self.documentIdentifierToShowOnFinishingDownload {
                if let document = documentDescriptor.editableDocument {
                    self.showPDFViewController(with: document, documentIdentifier: documentDescriptor.identifier)
                }
            }
        }
    }

    func instantClient(_ instantClient: PSPDFInstantClient, didFailDownloadForDocument documentDescriptor: PSPDFInstantDocumentDescriptor, error: Error) {
        print("Failed to download document: \(error)")

        DispatchQueue.main.async {
            self.documentsBeingDownloaded.remove(documentDescriptor.identifier)
        }
    }

    func instantClient(_ instantClient: PSPDFInstantClient, didFailSyncingDocument documentDescriptor: PSPDFInstantDocumentDescriptor, error: Error) {
        if case CocoaError.userCancelled = error {
            // We’re not really interested in cancellation: that error is only provided so you know when a sync ended
            return
        }
        print("Failed sync: \(error)")
    }

    private var documentsBeingAuthenticated: Set<String> = []

    func instantClient(_ instantClient: PSPDFInstantClient, didFailAuthenticationForDocument documentDescriptor: PSPDFInstantDocumentDescriptor) {
        DispatchQueue.main.async {
            let ID = documentDescriptor.identifier

            guard self.documentsBeingAuthenticated.insert(ID).inserted else {
                return
            }

            self.apiClient.fetchAuthenticationTokenTaskForDocument(with: ID, completionHandler: { result in
                DispatchQueue.main.async {
                    switch result {
                    case .failure(let reason):
                        print("Could not fetch authentication token for document ‘\(ID)’: \(reason)")
                        self.documentsBeingAuthenticated.remove(ID)
                    case .success(let JWT):
                        documentDescriptor.updateAuthenticationToken(JWT)
                    }
                }
            }).resume()
        }
    }

    func instantClient(_ instantClient: PSPDFInstantClient, didUpdateAuthenticationToken validJWT: String, forDocument documentDescriptor: PSPDFInstantDocumentDescriptor) {
        DispatchQueue.main.async {
            let ID = documentDescriptor.identifier
            self.documentsBeingAuthenticated.remove(ID)
        }
    }

    func instantClient(_ instantClient: PSPDFInstantClient, didFailUpdatingAuthenticationTokenForDocument documentDescriptor: PSPDFInstantDocumentDescriptor, error: Error) {
        DispatchQueue.main.async {
            let ID = documentDescriptor.identifier
            print("Could not update authentication token for document '\(ID)': \(error)")
            self.documentsBeingAuthenticated.remove(ID)

            if case PSPDFInstantError.accessDenied = error {
                // We’ve lost access to the document => purge its data from disk!
                try? documentDescriptor.removeLocalStorage()

                // Also, there’s no point of it being shown in the list anymore
                if let position = self.listData.index(where: { $0.documentDescriptor.identifier == ID }) {
                    print("Removing the document from the list — hint: if you think you should still be able to access the document, refresh the list")
                    self.listData.remove(at: position)
                }
            }
        }
    }
}
