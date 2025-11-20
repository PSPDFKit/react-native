//
//  Copyright © 2019-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import React

@objc extension RCTConvert {
    
    @objc public static func bookmarksToJSON(_ bookmarks: [Bookmark]) -> Array<Dictionary<String, Any>> {
        
        var bookmarksArray = Array<Dictionary<String, Any>>()
        
        for bookmark in bookmarks {
            var bookmarkDictionary = Dictionary<String, Any>()
            
            bookmarkDictionary["displayName"] = bookmark.displayName
            bookmarkDictionary["identifier"] = bookmark.identifier
            bookmarkDictionary["pageIndex"] = bookmark.pageIndex
            if let name = bookmark.name {
                bookmarkDictionary["name"] = name
            }
            
            bookmarksArray.append(bookmarkDictionary)
        }
        
        return bookmarksArray
    }
    
    @objc public static func JSONToBookmarks(_ bookmarks: Array<Dictionary<String, Any>>) -> [Bookmark] {
        
        var bookmarksArray = [Bookmark]()
        
        for bookmarkDict in bookmarks {
            guard let displayName = bookmarkDict["displayName"] as? String,
                  let identifier = bookmarkDict["identifier"] as? String,
                  let pageIndex = bookmarkDict["pageIndex"] as? Int else {
                continue // Skip invalid bookmark entries
            }
            
            let name = bookmarkDict["name"] as? String
            
            let action = GoToAction(pageIndex: PageIndex(pageIndex))
            let bookmark = Bookmark(identifier: identifier, action: action, name: name == nil ? displayName : name, sortKey: nil)
            
            bookmarksArray.append(bookmark)
        }
        
        return bookmarksArray
    }
}
