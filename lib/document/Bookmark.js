"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = void 0;
/**
 * A Bookmark is a named location in a document.
 * @interface Bookmark
 * @memberof Bookmark
 * @property {string} [name] - The bookmark name. This is optional.
 * @property {string} displayName - The bookmark display name.
 * @property {string} identifier - A string uniquely identifying the bookmark.
 * @property {number} pageIndex - The page index on which the bookmark is located.
 */
var Bookmark = /** @class */ (function () {
    function Bookmark(params) {
        var displayName = params.displayName, identifier = params.identifier, pageIndex = params.pageIndex, name = params.name;
        this.displayName = displayName;
        this.identifier = identifier;
        this.pageIndex = pageIndex;
        this.name = name;
    }
    return Bookmark;
}());
exports.Bookmark = Bookmark;
