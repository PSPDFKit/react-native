package com.pspdfkit.react.helper

import com.facebook.react.bridge.ReadableArray
import com.pspdfkit.bookmarks.Bookmark

object BookmarkUtils {
    @JvmStatic
    fun bookmarksToJSON(bookmarks: List<Bookmark>): List<Map<String, Any>> {
        return bookmarks.map { bookmark ->
            val bookmarkDictionary = HashMap<String, Any>()

            bookmarkDictionary["displayName"] = bookmark.name ?: ""
            bookmarkDictionary["identifier"] = bookmark.uuid
            bookmarkDictionary["pageIndex"] = bookmark.pageIndex ?: 0

            bookmark.name?.let { name ->
                bookmarkDictionary["name"] = name
            }

            bookmarkDictionary
        }
    }

    @JvmStatic
    fun JSONToBookmarks(bookmarks: ReadableArray): List<Bookmark> {
        return (0 until bookmarks.size()).mapNotNull { index ->
            try {
                val bookmarkDict = bookmarks.getMap(index)

                val displayName = bookmarkDict?.getString("displayName")
                val identifier = bookmarkDict?.getString("identifier")
                val pageIndex = bookmarkDict?.getInt("pageIndex")
                val name = if (bookmarkDict?.hasKey("name") == true) bookmarkDict.getString("name") else null

                if (displayName != null && identifier != null && pageIndex != null) {
                    val finalName = name ?: displayName
                    Bookmark(identifier, finalName, pageIndex)
                } else {
                    null // Skip invalid entries
                }
            } catch (e: Exception) {
                null // Skip entries that cause exceptions
            }
        }
    }
}