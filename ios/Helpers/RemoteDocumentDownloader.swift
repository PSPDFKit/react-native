//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

@objc public class RemoteDocumentDownloader: NSObject, URLSessionDelegate, URLSessionDownloadDelegate {
    
    @objc public let progress = Progress(totalUnitCount: 100)
    let downloadProgress = Progress(totalUnitCount: 1)
    let moveProgress = Progress(totalUnitCount: 1)

    let destinationFileURL: URL
    let remoteURL: URL

    var session: URLSession?
    var task: URLSessionDownloadTask?

    @objc public init(remoteURL: URL, destinationFileURL: URL, cleanup: Bool) {
        self.remoteURL = remoteURL
        self.destinationFileURL = destinationFileURL

        super.init()

        if (cleanup) {
            self.cleanup()
        }
        
        // Download the file using URLSession API.
        let session = URLSession(configuration: URLSessionConfiguration.default, delegate: self, delegateQueue: OperationQueue.main)
        self.session = session
        let task = session.downloadTask(with: remoteURL)
        self.task = task
        task.resume()

        progress.addChild(downloadProgress, withPendingUnitCount: 99)
        progress.addChild(moveProgress, withPendingUnitCount: 1)
    }

    func cleanup() {
        do {
            task?.cancel()
            session?.invalidateAndCancel()
            try FileManager().removeItem(at: destinationFileURL)
        } catch {
            print(error)
        }
    }
    
    public func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didFinishDownloadingTo location: URL) {
        try? FileManager().moveItem(at: location, to: destinationFileURL)
        // We must ensure that the complete progress (`progress`) only completes when the file is already at its final location.
        moveProgress.completedUnitCount = moveProgress.totalUnitCount
    }

    public func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didWriteData bytesWritten: Int64, totalBytesWritten: Int64, totalBytesExpectedToWrite: Int64) {
        downloadProgress.totalUnitCount = totalBytesExpectedToWrite
        downloadProgress.completedUnitCount = totalBytesWritten
    }

    public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error {
            print(error.localizedDescription)
            // Complete the progress.
            progress.completedUnitCount = progress.totalUnitCount
        }
    }
}
