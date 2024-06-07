"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFDocument = void 0;
var react_native_1 = require("react-native");
/**
 * @class PDFDocument
 * @description The current document object loaded in the PSPDFKitView.
 *
 */
var PDFDocument = /** @class */ (function () {
    /**
     * @ignore
     */
    function PDFDocument(pdfViewRef) {
        this.pdfViewRef = pdfViewRef;
    }
    /**
     * @method getDocumentId
     * @memberof PDFDocument
     * @description Returns a document identifier (inferred from a document provider if possible).
     * A permanent identifier based on the contents of the file at the time it was originally created.
     * If a document identifier is not available, generated UID value is returned.
     * @example
     * const documentId = await this.pdfRef.current?.getDocument()?.getDocumentId();
     */
    PDFDocument.prototype.getDocumentId = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getDocumentId((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method invalidateCacheForPage
     * @memberof PDFDocument
     * @param {number} pageIndex Zero-based page index of the page to refresh.
     * @description Invalidates the rendered cache of the given pageIndex for this document.
     * Use this method if a single page of the document is not updated after a change, or changed externally, and needs to be re-rendered.
     * @example
     * const result = await this.pdfRef.current?.getDocument().invalidateCacheForPage(0);
     */
    PDFDocument.prototype.invalidateCacheForPage = function (pageIndex) {
        return react_native_1.NativeModules.PDFDocumentManager.invalidateCacheForPage((0, react_native_1.findNodeHandle)(this.pdfViewRef), pageIndex);
    };
    /**
     * @method invalidateCache
     * @memberof PDFDocument
     * @description Invalidates the rendered cache of all the pages for this document.
     * Use this method if the document is not updated after a change, or changed externally, and needs to be re-rendered.
     * @example
     * const result = await this.pdfRef.current?.getDocument().invalidateCache();
     */
    PDFDocument.prototype.invalidateCache = function () {
        return react_native_1.NativeModules.PDFDocumentManager.invalidateCache((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    return PDFDocument;
}());
exports.PDFDocument = PDFDocument;
