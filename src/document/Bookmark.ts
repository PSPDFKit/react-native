/**
 * @interface Bookmark
 */
export class Bookmark {
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