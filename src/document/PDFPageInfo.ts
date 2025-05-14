/**
 * @interface PDFPageInfo
 */
export class PDFPageInfo {
    /**
     * The angle the PDF page is displayed at in clockwise degrees.
     */
    savedRotation: PDFPageInfo.PDFRotation;
}

export namespace PDFPageInfo {
    /**
     * The rotation of the page.
     * @readonly
     * @enum {string} PDFRotation
     */
     export const PDFRotation = {
       /**
        * The page is displayed without rotation.
        */
        ROTATION0: 0,
       /**
        * The page is displayed 90 degrees clockwise.
        */
        ROTATION90: 90,
       /**
        * The page is displayed upside-down.
        */
        ROTATION180: 180,
       /**
        * The page is displayed 90 degrees counterclockwise.
        */
        ROTATION270: 270,
     } as const;

     export type PDFRotation = ValueOf<typeof PDFRotation>;
     type ValueOf<T> = T[keyof T];
}