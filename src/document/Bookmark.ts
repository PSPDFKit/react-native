/**
 * A Bookmark is a named location in a document.
 * @interface Bookmark
 * @memberof Bookmark
 * @property {string} [name] - The bookmark name. This is optional.
 * @property {string} displayName - The bookmark display name.
 * @property {string} identifier - A string uniquely identifying the bookmark.
 * @property {number} pageIndex - The page index on which the bookmark is located.
 */
export interface Bookmark {
    /**
     * The bookmark name. This is optional.
     */
    name?: string;
    /**
     * The bookmark display name.
     */
    displayName: string;
    /**
     * A string uniquely identifying the bookmark.
     */
    identifier: string;
    /**
     * The page index on which the bookmark is located.
     */
    pageIndex: number;
}
