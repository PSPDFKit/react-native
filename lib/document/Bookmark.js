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
    function Bookmark() {
    }
    return Bookmark;
}());
exports.Bookmark = Bookmark;
