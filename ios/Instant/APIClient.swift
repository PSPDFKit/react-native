//
//  APIClient.swift
//  PSPDFInstant-iOS-Example
//
//  Copyright © 2017 PSPDFKit. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

enum Result<Wrapped> {
    case failure(reason: String)
    case success(Wrapped)
}

/// Generates URL requests for using the API of the example server.
struct APIClient {
    let baseURL: URL
    let userID: String
    let password: String

    /// Models a document as returned by the example server API.
    struct Document {
        let title: String
        let identifier: String
    }

    func fetchDocumentListTask(completionHandler: @escaping (Result<[Document]>) -> Void) -> URLSessionTask {
        return URLSession.shared.dataTask(with: authorizedRequest(forEndpoint: "documents")) { data, response, error in
            switch resultFromJSONResponse(expectedStatusCode: 200, data: data, response: response, error: error) {

            case .failure(let reason):
                completionHandler(.failure(reason: reason))

            case .success(let jsonObject):
                guard let jsonDocuments = jsonObject["documents"] as? NSArray else {
                    completionHandler(.failure(reason: "Response is missing a documents array. \(jsonObject)"))
                    return
                }

                let documents = jsonDocuments.flatMap { document -> Document? in
                    guard let document = document as? NSDictionary else {
                        return nil
                    }
                    guard let title = document["title"] as? String, let identifier = document["id"] as? String else {
                        return nil
                    }

                    return Document(title: title, identifier: identifier)
                }

                completionHandler(.success(documents))
            }
        }
    }

    func fetchAuthenticationTokenTaskForDocument(with identifier: String, completionHandler: @escaping (Result<String>) -> Void) -> URLSessionTask {
        return URLSession.shared.dataTask(with: authorizedRequest(forEndpoint: "document/\(identifier)")) { data, response, error in
            switch resultFromJSONResponse(expectedStatusCode: 200, data: data, response: response, error: error) {

            case .failure(let reason):
                completionHandler(.failure(reason: reason))

            case .success(let jsonObject):
                guard let authenticationToken = jsonObject["token"] as? String else {
                    completionHandler(.failure(reason: "Response is missing token. \(jsonObject)"))
                    return
                }

                completionHandler(.success(authenticationToken))
            }
        }
    }

    private func authorizedRequest(forEndpoint endpoint: String) -> URLRequest {
        var request = URLRequest(url: baseURL.appendingPathComponent("api", isDirectory: true).appendingPathComponent(endpoint, isDirectory: false))
        let base64Encoded = "\(userID):\(password)".data(using: .utf8)!.base64EncodedString()
        request.setValue("Basic \(base64Encoded)", forHTTPHeaderField: "Authorization")
        return request
    }
}

private func resultFromJSONResponse(expectedStatusCode: Int, data: Data?, response: URLResponse?, error: Error?) -> Result<NSDictionary> {
    if let error = error {
        return .failure(reason: error.localizedDescription)
    }

    guard let httpResponse = response as? HTTPURLResponse else {
        return .failure(reason: "Response is not an HTTP response")
    }

    guard httpResponse.statusCode == expectedStatusCode else {
        return .failure(reason: "Status code is \(httpResponse.statusCode) (Response body: '\(describe(body: data))')")
    }

    guard let data = data else {
        return .failure(reason: "No data or error")
    }

    let object: Any
    do {
        object = try JSONSerialization.jsonObject(with: data, options: [])
    } catch {
        return .failure(reason: "Could not parse JSON: \(error)\nData: '\(describe(body: data))'")
    }
    guard let dictionary = object as? NSDictionary else {
        return .failure(reason: "JSON object has type \(type(of: object)) instead of \(NSDictionary.self)")
    }

    return .success(dictionary)
}

private func describe(body: Data?) -> String {
    guard let body = body else { return "<no body data>" }
    if let string = String(data: body, encoding: .utf8) {
        return string
    } else {
        return "Body isn’t even UTF-8…"
    }
}
