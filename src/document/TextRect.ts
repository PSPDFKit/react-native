/**
 * @interface TextRectFrame
 * @description Represents the bounding frame of a text element in PDF coordinates.
 */
export interface TextRectFrame {
    /**
     * The x coordinate of the frame origin in PDF coordinates.
     */
    x: number;
    /**
     * The y coordinate of the frame origin in PDF coordinates.
     */
    y: number;
    /**
     * The width of the frame in PDF coordinates.
     */
    width: number;
    /**
     * The height of the frame in PDF coordinates.
     */
    height: number;
}

/**
 * @interface TextRect
 * @description Represents a word with its bounding frame position on a PDF page.
 */
export interface TextRect {
    /**
     * The text content of the word.
     */
    text: string;
    /**
     * The bounding frame of the word in PDF coordinates.
     */
    frame: TextRectFrame;
}

