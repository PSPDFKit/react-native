/**
 * @interface BoundingBox
 * @description Represents a bounding box in PDF coordinates.
 * The format is [left, top, right, bottom] where:
 * - left: The left edge x-coordinate
 * - top: The top edge y-coordinate  
 * - right: The right edge x-coordinate
 * - bottom: The bottom edge y-coordinate
 */
export interface BoundingBox {
    /**
     * The left edge x-coordinate of the bounding box.
     */
    left: number;
    /**
     * The top edge y-coordinate of the bounding box.
     */
    top: number;
    /**
     * The right edge x-coordinate of the bounding box.
     */
    right: number;
    /**
     * The bottom edge y-coordinate of the bounding box.
     */
    bottom: number;
}

/**
 * @interface FormFieldConfiguration
 * @description Base configuration for adding a form field to a PDF document.
 */
export interface FormFieldConfiguration {
    /**
     * The zero-based page index where the form field should be added.
     */
    pageIndex: number;
    /**
     * The bounding box of the form field in PDF coordinates.
     * Can be provided as an object with left, top, right, bottom properties,
     * or as an array [left, top, right, bottom].
     */
    bbox: BoundingBox | [number, number, number, number];
    /**
     * The fully qualified name of the form field.
     * Form fields can form a hierarchy in the PDF form.
     * This combines all the parent names and separates them by a single dot
     * to create a string that can uniquely identify a form field across one PDF file.
     */
    fullyQualifiedName: string;
}

/**
 * @interface ElectronicSignatureFieldConfiguration
 * @description Configuration for adding an electronic signature field to a PDF document.
 */
export interface ElectronicSignatureFieldConfiguration extends FormFieldConfiguration {
    // Currently no additional properties beyond the base configuration
}

/**
 * @interface TextFormFieldConfiguration
 * @description Configuration for adding a text form field to a PDF document.
 */
export interface TextFormFieldConfiguration extends FormFieldConfiguration {
    // Currently no additional properties beyond the base configuration
}

