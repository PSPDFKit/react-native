"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFPageInfo = void 0;
/**
 * @interface PDFPageInfo
 */
var PDFPageInfo = /** @class */ (function () {
    function PDFPageInfo() {
    }
    return PDFPageInfo;
}());
exports.PDFPageInfo = PDFPageInfo;
(function (PDFPageInfo) {
    /**
     * The rotation of the page.
     * @readonly
     * @enum {string} PDFRotation
     */
    PDFPageInfo.PDFRotation = {
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
    };
})(PDFPageInfo || (exports.PDFPageInfo = PDFPageInfo = {}));
