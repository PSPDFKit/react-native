//
//  Copyright © 2017-2025 PSPDFKit GmbH. All rights reserved.
//
//  The PSPDFKit Sample applications are licensed with a modified BSD license.
//  Please see License for details. This notice may not be removed from this file.
//

import Instant

/**
 This example connects to our public PSPDFKit for Web examples server and downloads documents using PSPDFKit Instant.
 You can then collaboratively annotate these documents using Instant.
 Each document on the PSPDFKit for Web examples server can be accessed via its URL.

 The example lets you either create a new collaboration group then share the URL,
 or join an existing collaboration group by entering a URL.
 To speed this up, the URL can be read from a QR code.

 Other supported clients include:

 - PSPDFKit Instant Live Demo: https://pspdfkit.com/instant/demo/
 - PSPDFKit for Web examples: https://web-examples.our.services.nutrient-powered.io
 - PDF Viewer for iOS and Android: https://pdfviewer.io
 - PSPDFKit Catalog example app for Android

 As is usually the case with Instant, most of the code here deals with communicating with the
 particular server backend (our Web examples server in this case), so is not particularly useful
 as example code. The same applies to the other files in this folder.

 The code actually interacting with the Instant framework API is in `InstantDocumentViewController.swift`.
 */

/// Shows UI to either start a new collaboration session or join an existing session.
@objc class InstantExampleViewController: UITableViewController {

    private lazy var apiClient = WebExamplesAPIClient(presentingViewController: self)
    private lazy var instantDocumentPresenter = InstantDocumentPresenter(presentingViewController: self)

    /// A reference to the text field in the cell so it can be disabled when starting a new group to avoid duplicate network requests.
    weak var codeTextField: UITextField?

    init() {
        super.init(style: .grouped)
        title = "PSPDFKit Instant"

        // Since this demo is ephemeral, we want to ensure we start with a clean slate each time.
        // The InstantDocumentViewController tries to clean up when it deallocates but that can’t catch every case.
        do {
            try FileManager.default.removeItem(at: InstantClient.dataDirectory)
        } catch {
            switch error {
            case CocoaError.fileNoSuchFile,
                 CocoaError.fileReadNoSuchFile:
                // If the directory does not exist, it is technically an error, but a happy one.
                break
            default:
                print("Could not remove Instant data directory: \(error)")
            }
        }
    }

    @available(*, unavailable)
    required init?(coder decoder: NSCoder) {
        fatalError("init(coder:) is not supported.")
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.keyboardDismissMode = .onDrag
        tableView.cellLayoutMarginsFollowReadableWidth = true
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: CellIdentifier.newGroup.rawValue)
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: CellIdentifier.scanCode.rawValue)
        tableView.register(TextFieldCell.self, forCellReuseIdentifier: CellIdentifier.urlField.rawValue)
    }

    enum CellIdentifier: String {
        case newGroup = "new group"
        case scanCode = "scan code"
        case urlField = "url field"
    }

    struct Row {
        let identifier: CellIdentifier
        let allowsHighlight: Bool
    }

    struct Section {
        let header: String?
        let rows: [Row]
        let footer: String?
    }

    /// Data to show in the table view.
    private let sections: [Section] = [
        Section(header: "Seamless collaboration for PSPDFKit-powered apps", rows: [], footer: "The PSPDFKit SDKs support Instant out of the box. Just connect your app to an Instant Server (Nutrient Document Engine) and document management and syncing is taken care of."),
        Section(header: "Start a new group", rows: [Row(identifier: .newGroup, allowsHighlight: true)], footer: "Get a new document link, then collaborate by entering it in PSPDFKit Catalog on another device, or opening the document link in a web browser."),
        Section(header: "Join a group", rows: [Row(identifier: .scanCode, allowsHighlight: true), Row(identifier: .urlField, allowsHighlight: false)], footer: "Scan or enter a document link from PDF Viewer or PSPDFKit Catalog on another device, or from a web browser showing pspdfkit.com/instant/demo or web-examples.our.services.nutrient-powered.io."),
    ]

    override func numberOfSections(in tableView: UITableView) -> Int {
        return sections.count
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return sections[section].rows.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let row = sections[indexPath.section].rows[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: row.identifier.rawValue, for: indexPath)

        cell.textLabel?.textColor = tableView.tintColor
        cell.textLabel?.font = UIFont.preferredFont(forTextStyle: .headline)

        switch row.identifier {
        case .newGroup:
            cell.textLabel?.text = "Create Group"
            return cell

        case .scanCode:
            cell.textLabel?.text = "Scan QR Code"
            return cell

        case .urlField:
            let textField = (cell as! TextFieldCell).textField

            codeTextField = textField

            textField.delegate = self
            return cell
        }
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sections[section].header
    }

    override func tableView(_ tableView: UITableView, titleForFooterInSection section: Int) -> String? {
        return sections[section].footer
    }

    override func tableView(_ tableView: UITableView, shouldHighlightRowAt indexPath: IndexPath) -> Bool {
        return sections[indexPath.section].rows[indexPath.row].allowsHighlight
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let rowId = sections[indexPath.section].rows[indexPath.row].identifier

        switch rowId {
        case .newGroup:
            instantDocumentPresenter.createNewSession()
        case .scanCode:
            requestPermissionAndPresentScanner()
        case .urlField:
            fatalError("Shouldn’t be able to select URL field cell.")
        }
    }

    private func requestPermissionAndPresentScanner() {
        AVCaptureDevice.requestAccess(for: .video) { [weak self] (granted: Bool) -> Void in
            DispatchQueue.main.async {
                guard let self = self else {
                    return
                }
                if granted {
                    let scannerVC = ScannerViewController()
                    scannerVC.delegate = self
                    let navigationVC = UINavigationController(rootViewController: scannerVC)
                    navigationVC.modalPresentationStyle = .fullScreen

                    self.navigationController?.present(navigationVC, animated: true, completion: nil)
                } else {
                    self.tableView.selectRow(at: nil, animated: true, scrollPosition: .none)
                    self.showError(withTitle: "Camera Access Needed", message: "To scan QR codes, enable camera access in the Settings app.")
                }
            }
        }
    }

    private func showError(withTitle title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .cancel))

        present(alertController, animated: true, completion: nil)
    }
}

// MARK: - Text field delegate

extension InstantExampleViewController: UITextFieldDelegate {

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let text = textField.text else {
            return false
        }

        instantDocumentPresenter.joinExistingSession(withURL: text)
        return true
    }
}

// MARK: - Scanner view controller delegate

extension InstantExampleViewController: ScannerViewControllerDelegate {

    func scannerViewController(_ scannerViewController: ScannerViewController, didFinishScanningWith result: BarcodeScanResult) {
        if case .success(let barcode) = result {
            codeTextField?.text = barcode
        }

        self.dismiss(animated: true) {
            switch result {
            case .success(let barcode):
                self.instantDocumentPresenter.joinExistingSession(withURL: barcode)
            case .failure(let errorMessage):
                self.showError(withTitle: "Couldn’t Scan QR Code", message: errorMessage)
            }
        }
    }
}

// MARK: -

class TextFieldCell: UITableViewCell {
    let textField = UITextField()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        textField.placeholder = "Or Enter Document Link"

        textField.clearButtonMode = .always
        textField.keyboardType = .alphabet
        textField.autocorrectionType = .no
        textField.autocapitalizationType = .none
        textField.returnKeyType = .done

        textField.font = UIFont.preferredFont(forTextStyle: .headline)

        contentView.addSubview(textField)
    }

    required init?(coder decoder: NSCoder) {
        fatalError("init(coder:) is not supported.")
    }

    override func sizeThatFits(_ size: CGSize) -> CGSize {
        let availableWidth = size.width - layoutMargins.left - layoutMargins.right
        let height = layoutMargins.top + textField.sizeThatFits(CGSize(width: availableWidth, height: .greatestFiniteMagnitude)).height + layoutMargins.bottom
        return CGSize(width: size.width, height: max(height, 44))
    }

    override func layoutSubviews() {
        super.layoutSubviews()

        textField.frame = convert(bounds.inset(by: layoutMargins), to: contentView)
    }
}
