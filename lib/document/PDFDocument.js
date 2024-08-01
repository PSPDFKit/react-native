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
     * If a document identifier is not available, a generated UID value is returned.
     * @example
     * const documentId = await this.pdfRef.current?.getDocument()?.getDocumentId();
     * @returns { Promise<string> } A promise containing the document identifier.
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
     * const result = await this.pdfRef.current?.getDocument()?.invalidateCacheForPage(0);
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the cache was invalidated, ```false``` otherwise.
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
     * const result = await this.pdfRef.current?.getDocument()?.invalidateCache();
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the cache was invalidated, ```false``` otherwise.
     */
    PDFDocument.prototype.invalidateCache = function () {
        return react_native_1.NativeModules.PDFDocumentManager.invalidateCache((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method save
     * @memberof PDFDocument
     * @description Saves the document asynchronously.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.save();
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the document was saved, ```false``` otherwise.
     */
    PDFDocument.prototype.save = function () {
        return react_native_1.NativeModules.PDFDocumentManager.save((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method getAllUnsavedAnnotations
     * @memberof PDFDocument
     * @description Gets all the unsaved changes to annotations in the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.getAllUnsavedAnnotations();
     * @returns { Promise<Record<string, any>> } A promise containing the unsaved annotations as an array, wrapped in a Map with the mandatory 'annotations' key.
     */
    PDFDocument.prototype.getAllUnsavedAnnotations = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getAllUnsavedAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method getAnnotations
     * @memberof PDFDocument
     * @param {string} [type] The type of annotation to get. If not specified, all annotation types are returned.
     * @description Gets all the annotations in the document for a specified type.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.getAnnotations("pspdfkit/ink");
     * @returns { Promise<Array<any>> } A promise containing the annotations of the document as an array.
     */
    PDFDocument.prototype.getAnnotations = function (type) {
        return react_native_1.NativeModules.PDFDocumentManager.getAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), type);
    };
    /**
     * @method getAnnotationsForPage
     * @memberof PDFDocument
     * @param {number} pageIndex The page index to get annotations for. Starts at 0.
     * @param {string} [type] The type of annotation to get. If not specified, all annotation types are returned.
     * @description Gets all the annotations in the document for a specified type.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.getAnnotationsForPage(0, "pspdfkit/ink");
     * @returns { Promise<Array<any>> } A promise containing the annotations for the specified page of the document as an array.
     */
    PDFDocument.prototype.getAnnotationsForPage = function (pageIndex, type) {
        return react_native_1.NativeModules.PDFDocumentManager.getAnnotationsForPage((0, react_native_1.findNodeHandle)(this.pdfViewRef), pageIndex, type);
    };
    /**
     * @method removeAnnotations
     * @memberof PDFDocument
     * @param {Array} instantJSON An array of the annotations to remove in InstantJSON format. Should not include the "annotations" key as used in the ```addAnnotations``` API.
     * @description Removes all the specified annotations from the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.removeAnnotations(annotations);
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the annotations were removed, ```false``` otherwise.
     */
    PDFDocument.prototype.removeAnnotations = function (instantJSON) {
        return react_native_1.NativeModules.PDFDocumentManager.removeAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), instantJSON);
    };
    /**
     * @method addAnnotations
     * @memberof PDFDocument
     * @param {Record} instantJSON The annotations to add to the document in InstantJSON format. Ensure that the "annotations" key is included with an array of all the annotations as value.
     * @description Adds all the specified annotations in the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.addAnnotations(annotations);
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the annotations were added, ```false``` otherwise.
     */
    PDFDocument.prototype.addAnnotations = function (instantJSON) {
        return react_native_1.NativeModules.PDFDocumentManager.addAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), instantJSON);
    };
    /**
     * @method importXFDF
     * @memberof PDFDocument
     * @param {string} filePath The path to the XFDF file to import.
     * @description Imports the supplied XFDF file into the current document.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.importXFDF('path/to/XFDF.xfdf');
     * @returns { Promise<any> } A promise containing an object with the result. ```true``` if the xfdf file was imported successfully, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.importXFDF = function (filePath) {
        return react_native_1.NativeModules.PDFDocumentManager.importXFDF((0, react_native_1.findNodeHandle)(this.pdfViewRef), filePath);
    };
    /**
     * @method exportXFDF
     * @memberof PDFDocument
     * @param {string} filePath The path where the XFDF file should be exported to.
     * @description Exports the annotations from the current document to a XFDF file.
     * @example
     * const result = await this.pdfRef.current?.getDocument()?.exportXFDF('path/to/XFDF.xfdf');
     * @returns { Promise<any> } A promise containing an object with the exported file path and result. ```true``` if the xfdf file was exported successfully, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.exportXFDF = function (filePath) {
        return react_native_1.NativeModules.PDFDocumentManager.exportXFDF((0, react_native_1.findNodeHandle)(this.pdfViewRef), filePath);
    };
    return PDFDocument;
}());
exports.PDFDocument = PDFDocument;
