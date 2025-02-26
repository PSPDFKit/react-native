/**
 * The annotation menu item used to display a custom button on the annotation menu.
 * @typedef AnnotationContextualMenuItem
 * @memberof Annotation
 * @property {string} id The unique identifier for the custom annotation menu button. This will be used to identify the button in the ```onCustomAnnotationContextualMenuItemTapped``` callback. On Android the ID needs to be specified as a resource item inside your application's ```ids.xml``` file.
 * @property {string} image The image name (iOS) or resource ID (Android) for the toolbar button. Images must be included in the application bundle on iOS and specified as a drawable resource on Android. System image names can also be used on iOS, for example ```multiply.circle.fill```. On iOS the image will only be used if no title is specified.
 * @property {string} [title] The title of the toolbar button. If no title is set, the image will be used.
 * @property {boolean} [selectable] Whether the button should be selectable or not. If the button is selectable, it will remain highlighted after being tapped (Android only).
 */
/**
 * The object to customize the menu shown when selecting an annotation.
 * @typedef AnnotationContextualMenu
 * @memberof Annotation
 * @property { AnnotationContextualMenuItem[] } buttons The annotation menu items to display when an annotation is selected.
 * @property { Annotation.ContextualMenuType } [menuType] Specifies the type of annotation menu to customize.
 * @property { Boolean } [retainSuggestedMenuItems] Specifies whether the PSPDFKit suggested annotation menu items should be retained when custom annotation menu items are set.
 * @property { Annotation.ContextualMenuAppearance } [appearance] Specifies for which appearance mode this change should apply to (iOS only).
 * @property { Annotation.ContextualMenuItemPosition } [position] The position where the buttons should be added in the menu.
 */
/**
 * The object to configure annotation presets.
 * @typedef AnnotationPresetConfiguration
 * @memberof Annotation
 * @property { AnnotationPresetInk } [inkPen] The inkPen annotation preset configuration.
 * @property { AnnotationPresetInk } [inkMagic] The inkMagic annotation preset configuration.
 * @property { AnnotationPresetInk } [inkHighlighter] The inkHighlighter annotation preset configuration.
 * @property { AnnotationPresetFreeText } [freeText] The freeText annotation preset configuration.
 * @property { AnnotationPresetFreeText } [freeTextCallout] The freeTextCallout annotation preset configuration.
 * @property { AnnotationPresetStamp } [stamp] The stamp annotation preset configuration.
 * @property { AnnotationPresetNote } [note] The note annotation preset configuration.
 * @property { AnnotationPresetMarkup } [highlight] The highlight annotation preset configuration.
 * @property { AnnotationPresetMarkup } [underline] The underline annotation preset configuration.
 * @property { AnnotationPresetMarkup } [squiggly] The squiggly annotation preset configuration.
 * @property { AnnotationPresetMarkup } [strikeOut] The strikeOut annotation preset configuration.
 * @property { AnnotationPresetShape } [square] The square annotation preset configuration.
 * @property { AnnotationPresetShape } [circle] The circle annotation preset configuration.
 * @property { AnnotationPresetLine } [line] The line annotation preset configuration.
 * @property { AnnotationPresetLine } [arrow] The arrow annotation preset configuration.
 * @property { AnnotationPresetEraser } [eraser] The eraser annotation preset configuration.
 * @property { AnnotationPresetFile } [file] The file annotation preset configuration.
 * @property { AnnotationPresetShape } [polygon] The polygon annotation preset configuration.
 * @property { AnnotationPresetLine } [polyline] The polyline annotation preset configuration.
 * @property { AnnotationPresetSound } [sound] The sound annotation preset configuration.
 * @property { AnnotationPresetRedact } [redaction] The redaction annotation preset configuration.
 * @property { AnnotationPresetStamp } [image] The image annotation preset configuration.
 * @property { AnnotationPresetSound } [audio] The audio annotation preset configuration.
 * @property { AnnotationPresetMeasurementArea } [measurementAreaRect] The measurementAreaRect annotation preset configuration.
 * @property { AnnotationPresetMeasurementArea } [measurementAreaPolygon] The measurementAreaPolygon annotation preset configuration.
 * @property { AnnotationPresetMeasurementArea } [measurementAreaEllipse] The measurementAreaEllipse annotation preset configuration.
 * @property { AnnotationPresetMeasurementPerimeter} [measurementPerimeter] The measurementPerimeter annotation preset configuration.
 * @property { AnnotationPresetMeasurementDistance } [measurementDistance] The measurementDistance annotation preset configuration.
 */
/**
 * The object to customize the ink annotation presets.
 * @typedef AnnotationPresetInk
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string } defaultFillColor
 * @property { number } defaultAlpha
 * @property { number } defaultThickness
 * @property { Annotation.BlendMode } blendMode
 * @property { string[] } availableColors
 * @property { string[] } availableFillColors
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefault
 * @property { string[] } supportedProperties
 * @property { string } aggregationStrategy
 */
/**
 * The object to customize the free text annotation presets.
 * @typedef AnnotationPresetFreeText
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string[] } availableColors
 * @property { boolean } customColorPickerEnabled
 * @property { number } defaultTextSize
 * @property { number } minimumTextSize
 * @property { number } maximumTextSize
 * @property { string } defaultFont
 * @property { string[] } availableFonts
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } previewEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the shape annotation presets.
 * @typedef AnnotationPresetShape
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string } defaultFillColor
 * @property { number } defaultAlpha
 * @property { number } defaultThickness
 * @property { string[] } availableColors
 * @property { string[] } availableFillColors
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { Annotation.BorderStyle } defaultBorderStyle
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the line annotation presets.
 * @typedef AnnotationPresetLine
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string[] } availableColors
 * @property { string } defaultFillColor
 * @property { string[] } availableFillColors
 * @property { boolean } customColorPickerEnabled
 * @property { number } defaultThickness
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { number } defaultAlpha
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { string } defaultLineEnd Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
 * @property { Annotation.LineEnd[] } availableLineEnds
 * @property { Annotation.BorderStyle } defaultBorderStyle
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the markup annotation presets.
 * @typedef AnnotationPresetMarkup
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { number } defaultAlpha
 * @property { string[] } availableColors
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the eraser annotation presets.
 * @typedef AnnotationPresetEraser
 * @memberof Annotation
 * @property { number } defaultThickness
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the stamp annotation presets.
 * @typedef AnnotationPresetStamp
 * @memberof Annotation
 * @property { string[] } availableStampItems
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the note annotation presets.
 * @typedef AnnotationPresetNote
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string[] } availableColors
 * @property { boolean } customColorPickerEnabled
 * @property { string } defaultIconName
 * @property { string[] } availableIconNames
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the file annotation presets.
 * @typedef AnnotationPresetFile
 * @memberof Annotation
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the redact annotation presets.
 * @typedef AnnotationPresetRedact
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { string } defaultFillColor
 * @property { string[] } availableColors
 * @property { string[] } availableFillColors
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { boolean } forceDefaults
 * @property { string[] } supportedProperties
 */
/**
 * The object to customize the sound annotation presets.
 * @typedef AnnotationPresetSound
 * @memberof Annotation
 * @property { number } audioSamplingRate
 * @property { number } audioRecordingTimeLimit
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the measurement area annotation presets.
 * @typedef AnnotationPresetMeasurementArea
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { number } defaultAlpha
 * @property { number } defaultThickness
 * @property { Annotation.BorderStyle } defaultBorderStyle
 * @property { string[] } availableColors
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the measurement perimeter annotation presets.
 * @typedef AnnotationPresetMeasurementPerimeter
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { number } defaultAlpha
 * @property { number } defaultThickness
 * @property { Annotation.BorderStyle } defaultBorderStyle
 * @property { string[] } availableColors
 * @property { string } defaultLineEnd Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
 * @property { Annotation.LineEnd[] } availableLineEnds
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */
/**
 * The object to customize the measurement distance annotation presets.
 * @typedef AnnotationPresetMeasurementDistance
 * @memberof Annotation
 * @property { string } defaultColor
 * @property { number } defaultAlpha
 * @property { number } defaultThickness
 * @property { Annotation.BorderStyle } defaultBorderStyle
 * @property { string } defaultLineEnd Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
 * @property { Annotation.LineEnd[] } availableLineEnds
 * @property { string[] } availableColors
 * @property { number } minimumAlpha
 * @property { number } maximumAlpha
 * @property { number } minimumThickness
 * @property { number } maximumThickness
 * @property { boolean } customColorPickerEnabled
 * @property { boolean } previewEnabled
 * @property { boolean } zIndexEditingEnabled
 * @property { string[] } supportedProperties
 * @property { boolean } forceDefaults
 */

/**
 * @namespace Annotation
 */
export class Annotation {}

 /**
  * The object to customize the menu shown when selecting an annotation.
  */
export interface AnnotationContextualMenu {
 /**
  * The annotation menu items to display when an annotation is selected.
  */
  buttons: AnnotationContextualMenuItem[];
 /**
  * Specifies whether the PSPDFKit suggested annotation menu items should be retained when custom annotation menu items are set.
  */
  retainSuggestedMenuItems?: Boolean;
 /**
  * Specifies the type of annotation menu to customize.
  */
  menuType?: Annotation.ContextualMenuType;
 /**
  * Specifies for which appearance mode this change should apply to (iOS only).
  */
  appearance?: Annotation.ContextualMenuAppearance;
 /**
  * The position where the buttons should be added in the menu.
  */
  position?: Annotation.ContextualMenuItemPosition;
}

 /**
  * The annotation menu item used to display a custom button on the annotation menu.
  */
export interface AnnotationContextualMenuItem {
 /**
  * The unique identifier for the custom annotation menu button. This will be used to identify the button in the ```onCustomAnnotationContextualMenuItemTapped``` callback. On Android the ID needs to be specified as a resource item inside your application's ```ids.xml``` file.
  */
  id: string;
 /**
  * The image name (iOS) or resource ID (Android) for the toolbar button. Images must be included in the application bundle on iOS and specified as a drawable resource on Android. System image names can also be used on iOS, for example ```multiply.circle.fill```. On iOS the image will only be used if no title is specified.
  */
  image: string;
 /**
  * The title of the toolbar button. If no title is set, the image will be used.
  */
  title?: string;
 /**
  * Whether the button should be selectable or not. If the button is selectable, it will remain highlighted after being tapped (Android only).
  */
  selectable?: boolean;
}

 /**
 * The object to customize the ink annotation presets.
 */
 export interface AnnotationPresetInk {
  defaultColor?: string;
  defaultFillColor?: string;
  defaultAlpha?: number;
  defaultThickness?: number;
  blendMode?: Annotation.BlendMode;
  availableColors?: string[]
  availableFillColors?: string[]
  minimumAlpha?: number;
  maximumAlpha?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  costomColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
  aggregationStrategy?: string;
 }

/**
 * The object to customize the freeText annotation presets.
 */
export interface AnnotationPresetFreeText {
  defaultColor?: string;
  availableColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultTextSize?: number;
  minimumTextSize?: number;
  maximumTextSize?: number;
  defaultFont?: string;
  availableFonts?: string[];
  zIndexEditingEnabled?: boolean;
  previewEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the shape annotation presets.
 */
export interface AnnotationPresetShape {
  defaultColor?: string;
  defaultFillColor?: string;
  defaultAlpha?: number;
  defaultThickness?: number;
  availableColors?: string[];
  availableFillColors?: string[];
  minimumAlpha?: number;
  maximumAlpha?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  defaultBorderStyle?: Annotation.BorderStyle;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the line annotation presets.
 */
export interface AnnotationPresetLine {
  defaultColor?: string;
  availableColors?: string[];
  defaultFillColor?: string;
  availableFillColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultThickness?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  defaultAlpha?: number;
  minimumAlpha?: number;
  maximumAlpha?: number;
  /**
   * Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
   */
  defaultLineEnd?: string;
  availableLineEnds?: Annotation.LineEnd[];
  defaultBorderStyle?: Annotation.BorderStyle;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the markup annotation presets.
 */
export interface AnnotationPresetMarkup {
  defaultColor?: string;
  defaultAlpha?: number;
  availableColors?: string[];
  minimumAlpha?: number;
  maximumAlpha?: number;
  customColorPickerEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the eraser annotation presets.
 */
export interface AnnotationPresetEraser {
  defaultThickness?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the stamp annotation presets.
 */
export interface AnnotationPresetStamp {
  availableStampItems?: string[];
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the note annotation presets.
 */
export interface AnnotationPresetNote {
  defaultColor?: string;
  availableColors?: string[];
  customColorPickerEnabled?: boolean;
  defaultIconName?: string;
  availableIconNames?: string[];
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the file annotation presets.
 */
export interface AnnotationPresetFile {
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the redact annotation presets.
 */
export interface AnnotationPresetRedact {
  defaultColor?: string;
  defaultFillColor?: string;
  availableColors?: string[];
  availableFillColors?: string[];
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  forceDefaults?: boolean;
  supportedProperties?: string[];
}

/**
 * The object to customize the sound annotation presets.
 */
export interface AnnotationPresetSound {
  audioSamplingRate?: number;
  audioRecordingTimeLimit?: number;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the measurement area annotation presets.
 */
export interface AnnotationPresetMeasurementArea {
  defaultColor?: string;
  defaultAlpha?: number;
  defaultThickness?: number;
  defaultBorderStyle?: Annotation.BorderStyle; 
  availableColors?: string[];
  minimumAlpha?: number;
  maximumAlpha?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the measurement perimeter annotation presets.
 */
export interface AnnotationPresetMeasurementPerimeter {
  defaultColor?: string;
  defaultAlpha?: number;
  defaultBorderStyle?: Annotation.BorderStyle;
  defaultThickness?: number;
  availableColors?: string[];
  /**
   * Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
   */
  defaultLineEnd?: string;
  availableLineEnds?: Annotation.LineEnd[];
  minimumAlpha?: number;
  maximumAlpha?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

/**
 * The object to customize the measurement distance annotation presets.
 */
export interface AnnotationPresetMeasurementDistance {
  /**
   * Comma separated string of line ends. For example: 'openArrow,openArrow'. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.LineEnd} for available options.
   */
  defaultLineEnd?: string;
  availableLineEnds?: Annotation.LineEnd[];
  defaultBorderStyle?: Annotation.BorderStyle;
  defaultColor?: string;
  defaultAlpha?: number;
  defaultThickness?: number;
  availableColors?: string[];
  minimumAlpha?: number;
  maximumAlpha?: number;
  minimumThickness?: number;
  maximumThickness?: number;
  customColorPickerEnabled?: boolean;
  previewEnabled?: boolean;
  zIndexEditingEnabled?: boolean;
  supportedProperties?: string[];
  forceDefaults?: boolean;
}

 /**
  * The object to configure annotation presets.
  */
 export interface AnnotationPresetConfiguration {
  /**
   * The Ink Pen preset configuration.
   */
  inkPen?: AnnotationPresetInk;
  /**
   * The Ink preset configuration.
   */
  inkMagic?: AnnotationPresetInk;
  /**
   * The Highlighter preset configuration.
   */
  inkHighlighter?: AnnotationPresetInk;
  /**
   * The Free Text preset configuration.
   */
  freeText?: AnnotationPresetFreeText;
  /**
   * The Free Text Callout preset configuration.
   */
  freeTextCallout?: AnnotationPresetFreeText;
  /**
   * The Stamp preset configuration.
   */
  stamp?: AnnotationPresetStamp;
  /**
   * The Note preset configuration.
   */
  note?: AnnotationPresetNote;
  /**
   * The Highlight preset configuration.
   */
  highlight?: AnnotationPresetMarkup;
  /**
   * The Underline preset configuration.
   */
  underline?: AnnotationPresetMarkup;
  /**
   * The Squiggly preset configuration.
   */
  squiggly?: AnnotationPresetMarkup;
  /**
   * The Strike Out preset configuration.
   */
  strikeOut?: AnnotationPresetMarkup;
  /**
   * The Square preset configuration.
   */
  square?: AnnotationPresetShape;
  /**
   * The Circle preset configuration.
   */
  circle?: AnnotationPresetShape;
  /**
   * The Line preset configuration.
   */
  line?: AnnotationPresetLine;
  /**
   * The Arrow preset configuration.
   */
  arrow?: AnnotationPresetLine;
  /**
   * The Eraser preset configuration.
   */
  eraser?: AnnotationPresetEraser;
  /**
   * The File preset configuration.
   */
  file?: AnnotationPresetFile;
  /**
   * The Polygon preset configuration.
   */
  polygon?: AnnotationPresetShape;
  /**
   * The Polyline preset configuration.
   */
  polyline?: AnnotationPresetLine;
  /**
   * The Sound preset configuration.
   */
  sound?: AnnotationPresetSound;
  /**
   * The Redaction preset configuration.
   */
  redaction?: AnnotationPresetRedact;
  /**
   * The Image preset configuration.
   */
  image?: AnnotationPresetStamp;
  /**
   * The Audio preset configuration.
   */
  audio?: AnnotationPresetSound;
  /**
   * The Measurement Area Rect preset configuration.
   */
  measurementAreaRect?: AnnotationPresetMeasurementArea;
  /**
   * The Measurement Area Polygon preset configuration.
   */
  measurementAreaPolygon?: AnnotationPresetMeasurementArea;
  /**
   * The Measurement Area Ellipse preset configuration.
   */
  measurementAreaEllipse?: AnnotationPresetMeasurementArea;
  /**
   * The Measurement Perimeter preset configuration.
   */
  measurementPerimeter?: AnnotationPresetMeasurementPerimeter;
  /**
   * The Measurement Distance preset configuration.
   */
  measurementDistance?: AnnotationPresetMeasurementDistance;
 }

export namespace Annotation {
    /**
     * A set of flags specifying various characteristics of the annotation.
     * @readonly
     * @enum {string} Flags
     */
     export const Flags = {
       /**
        * If set, do not display or print the annotation or allow it to interact with the user.
        */
        HIDDEN: 'hidden',
       /**
        * If set, ignore annotation AP stream if there is no handler available.
        */
        INVISIBLE: 'invisible',
       /**
        * If set, don’t allow the annotation to be deleted or its properties to be modified, except for contents.
        */
        LOCKED: 'locked',
       /**
        * If set, don’t allow the contents of the annotation to be modified by the user.
        */
        LOCKED_CONTENTS: 'lockedContents',
       /**
        * If set, print the annotation when the page is printed.
        */
        PRINT: 'print',
       /**
        * If set, don’t allow the annotation to be deleted or its properties to be modified, including contents.
        */
        READ_ONLY: 'readOnly',
       /**
        * If set, don’t display the annotation on the screen. (But printing might be allowed)
        */
        NO_VIEW: 'noView',
       /**
        * If set, don’t scale the annotation’s appearance to match the magnification of the page. Supported only for FILE and STAMP annotations. (Android only)
        */
        NO_ZOOM: 'noZoom'
     } as const;

     /**
     * The available appearance options of the edit menu. (iOS only)
     * @readonly
     * @enum {string} PDFViewMode
     */
    export const ContextualMenuAppearance = {
      /**
       * The edit menu appears as a horizontal bar.
       */
       HORIZONTAL_BAR: 'horizontalBar',
      /**
       * The edit menu appears as a context menu.
       */
       CONTEXT_MENU: 'contextMenu',
    } as const;

    /**
     * The type of annotation menu to customize.
     * @readonly
     * @enum {string} MenuType
     */
    export const ContextualMenuType = {
      /**
       * Customize the Annotation Selection Menu.
       */
       SELECTION: 'selection',
    } as const;

    /**
     * The position of the annotation menu items.
     * @readonly
     * @enum {string} Position
     */
    export const ContextualMenuItemPosition = {
      /**
       * Add the new buttons at the start of the menu.
       */
      START: 'start',
      /**
       * Add the new buttons at the end of the menu.
       */
      END: 'end',
    } as const;

    /**
     * The available annotation blend modes
     * @readonly
     * @enum {string} BlendMode
     */
    export const BlendMode = {
        NORMAL: 'normal',
        MULTIPLY: 'multiply',
        SCREEN: 'screen',
        OVERLAY: 'overlay',
        DARKEN: 'darken',
        LIGHTEN: 'lighten',
        COLOR_DODGE: 'colorDodge',
        COLOR_BURN: 'colorBurn',
        SOFT_LIGHT: 'softLight',
        HARD_LIGHT: 'hardLight',
        DIFFERENCE: 'difference',
        EXCLUSION: 'exclusion',
        HUE: 'hue',
        SATURATION: 'saturation',
        COLOR: 'color',
        LUMINOSITY: 'luminosity'
    } as const;

    /**
     * The available annotation line ends
     * @readonly
     * @enum {string} LineEnd
     */
    export const LineEnd = {
      NONE: 'none',
      OPEN_ARROW: 'openArrow',
      CLOSED_ARROW: 'closedArrow',
      CIRCLE: 'circle',
      SQUARE: 'square'
  } as const;

    /**
     * The available annotation border styles
     * @readonly
     * @enum {string} BorderStyle
     */
    export const BorderStyle = {
      SOLID: 'solid',
      DASHED_1_1: 'dashed_1_1',
      DASHED_1_3: 'dashed_1_3',
      DASHED_3_3: 'dashed_3_3',
      DASHED_6_6: 'dashed_6_6',
      BEVELED: 'beveled',
      INSET: 'inset',
      UNDERLINE: 'underline'
  } as const;

    /**
     * The available annotation types
     * @readonly
     * @enum {string} Type
     */
      export const Type = {
        ALL: 'all',
        INK: 'ink',
        LINK: 'link',
        HIGHLIGHT: 'highlight',
        SQUIGGLY: 'squiggly',
        STRIKE_OUT: 'strikeOut',
        UNDERLINE: 'underline',
        NOTE: 'note',
        LINE: 'line',
        POLYGON: 'polygon',
        POLYLINE: 'polyline',
        SQUARE: 'square',
        FREE_TEXT: 'freeText',
        STAMP: 'stamp',
        IMAGE: 'image',
        CARET: 'caret',
        RICH_MEDIA: 'richMedia',
        WIDGET: 'widget',
        WATERMARK: 'watermark',
        FILE: 'file',
        SOUND: 'sound',
        POPUP: 'popup',
        TRAP_NET: 'trapNet',
        THREE_DIMENSIONAL: 'threeDimensional',
        REDACTION: 'redaction',
        CIRCLE: 'circle',
        SIGNATURE: 'signature',
        ERASER: 'eraser',
        DISTANCE: 'distance',
        PERIMETER: 'perimeter',
        AREA: 'area',
        RECTANGLE: 'rectangle',
        ELLIPSE: 'ellipse',
        AREA_POLYGON: 'area_polygon',
        AREA_CIRCLE: 'area_circle',
        AREA_SQUARE: 'area_square',
        MAGIC_INK: 'magic_ink',
        HIGHLIGHTER: 'highlighter',
        LINE_ARROW: 'arrow',
        FREE_TEXT_CALLOUT: 'free_text_callout',
        CLOUDY_POLYGON: 'cloudy_polygon',
        MULTIMEDIA: 'multimedia',
        SELECTION_TOOL: 'selection_tool',
    } as const;

    /**
     * Specifies how a annotation should be included in the resulting document.
     * @readonly
     * @enum {string} Change
     */
        export const Change = {
         /**
          * The annotation will be flattened. It can no longer be modified in the resulting document.
          */
          FLATTEN: 'flatten',
         /**
          * The annotation will be removed.
          */
          REMOVE: 'remove',
         /**
          * The annotation will be embedded into the resulting document, allowing it to still be modified.
          */
          EMBED: 'embed',
         /**
          * Processes the document for printing. Flattens annotations that can be printed, removes the remaining ones.
          */
          PRINT: 'print',
      } as const;

    export type ContextualMenuAppearance = ValueOf<typeof ContextualMenuAppearance>;
    export type ContextualMenuType = ValueOf<typeof ContextualMenuType>;
    export type ContextualMenuItemPosition = ValueOf<typeof ContextualMenuItemPosition>;
    export type Flags = ValueOf<typeof Flags>;
    export type BlendMode = ValueOf<typeof BlendMode>;
    export type LineEnd = ValueOf<typeof LineEnd>;
    export type BorderStyle = ValueOf<typeof BorderStyle>;
    export type Type = ValueOf<typeof Type>;
    export type Change = ValueOf<typeof Change>;
    
    type ValueOf<T> = T[keyof T];
}