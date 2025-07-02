"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFDocument = void 0;
var react_native_1 = require("react-native");
var AnnotationModels_1 = require("../annotations/AnnotationModels");
var Annotation_1 = require("../annotations/Annotation");
var FormField_1 = require("../forms/FormField");
var FormElement_1 = require("../forms/FormElement");
var Forms_1 = require("../forms/Forms");
/**
 * @class PDFDocument
 * @description The current document object loaded in the PSPDFKitView.
 * @hideconstructor
 */
var PDFDocument = /** @class */ (function () {
    /**
     * @ignore
     */
    function PDFDocument(pdfViewRef) {
        this.pdfViewRef = pdfViewRef;
        this.forms = new Forms_1.Forms(pdfViewRef);
    }
    /**
     * @method getDocumentId
     * @memberof PDFDocument
     * @description Returns a document identifier (inferred from a document provider if possible).
     * A permanent identifier based on the contents of the file at the time it was originally created.
     * If a document identifier is not available, a generated UID value is returned.
     * @example
     * const documentId = await this.pdfRef.current?.getDocument().getDocumentId();
     * @returns { Promise<string> } A promise containing the document identifier.
     */
    PDFDocument.prototype.getDocumentId = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getDocumentId((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method getPageCount
     * @memberof PDFDocument
     * @description Returns the number of pages in the document.
     * @example
     * const pageCount = await this.pdfRef.current?.getDocument().getPageCount();
     * @returns { Promise<number> } A promise containing the document page count.
     */
    PDFDocument.prototype.getPageCount = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getPageCount((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method isEncrypted
     * @memberof PDFDocument
     * @description Indicates if the PDF document is encrypted (password protected).
     * @example
     * const isEncrypted = await this.pdfRef.current?.getDocument().isEncrypted();
     * @returns { Promise<boolean> } A promise containing whether the document is encrypted.
     */
    PDFDocument.prototype.isEncrypted = function () {
        return react_native_1.NativeModules.PDFDocumentManager.isEncrypted((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method invalidateCacheForPage
     * @memberof PDFDocument
     * @param {number} pageIndex Zero-based page index of the page to refresh.
     * @description Invalidates the rendered cache of the given pageIndex for this document.
     * Use this method if a single page of the document is not updated after a change, or changed externally, and needs to be re-rendered.
     * @example
     * const result = await this.pdfRef.current?.getDocument().invalidateCacheForPage(0);
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
     * const result = await this.pdfRef.current?.getDocument().invalidateCache();
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
     * const result = await this.pdfRef.current?.getDocument().save();
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
     * const result = await this.pdfRef.current?.getDocument().getAllUnsavedAnnotations();
     * @returns { Promise<Record<string, any> | DocumentJSON> } A promise containing the unsaved annotations as an array, wrapped in a DocumentJSON object.
     */
    PDFDocument.prototype.getAllUnsavedAnnotations = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getAllUnsavedAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    /**
     * @method getAnnotations
     * @memberof PDFDocument
     * @param {string | Annotation.Type} [type] The type of annotation to get. If not specified, all annotation types are returned.
     * @description Gets all the annotations in the document for a specified type.
     * @example
     * const result = await this.pdfRef.current?.getDocument().getAnnotations(Annotation.Type.INK);
     * @returns { Promise<Array<AnnotationType | any>> } A promise containing the annotations of the document as an array of Annotation objects.
     */
    PDFDocument.prototype.getAnnotations = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var annotations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_1.NativeModules.PDFDocumentManager.getAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), type)];
                    case 1:
                        annotations = _a.sent();
                        // For backwards compatibility, return raw results if type is not an Annotation.Type value
                        if (type && !Object.values(Annotation_1.Annotation.Type).includes(type)) {
                            return [2 /*return*/, annotations];
                        }
                        return [2 /*return*/, annotations.map(function (annotation) {
                                // Convert each annotation based on its type
                                switch (annotation.type) {
                                    case 'pspdfkit/comment-marker':
                                    case 'comment-marker':
                                        return new AnnotationModels_1.CommentMarkerAnnotation(annotation);
                                    case 'pspdfkit/shape/ellipse':
                                    case 'shape/ellipse':
                                    case 'ellipse':
                                        return new AnnotationModels_1.EllipseShapeAnnotation(annotation);
                                    case 'pspdfkit/markup/highlight':
                                    case 'markup/highlight':
                                    case 'highlight':
                                        return new AnnotationModels_1.HighlightMarkupAnnotation(annotation);
                                    case 'pspdfkit/image':
                                    case 'image':
                                        return new AnnotationModels_1.ImageAnnotation(annotation);
                                    case 'pspdfkit/ink':
                                    case 'ink':
                                        return new AnnotationModels_1.InkAnnotation(annotation);
                                    case 'pspdfkit/shape/line':
                                    case 'shape/line':
                                    case 'line':
                                        return new AnnotationModels_1.LineShapeAnnotation(annotation);
                                    case 'pspdfkit/link':
                                    case 'link':
                                        return new AnnotationModels_1.LinkAnnotation(annotation);
                                    case 'pspdfkit/media':
                                    case 'media':
                                        return new AnnotationModels_1.MediaAnnotation(annotation);
                                    case 'pspdfkit/note':
                                    case 'note':
                                        return new AnnotationModels_1.NoteAnnotation(annotation);
                                    case 'pspdfkit/shape/polygon':
                                    case 'shape/polygon':
                                    case 'polygon':
                                        return new AnnotationModels_1.PolygonShapeAnnotation(annotation);
                                    case 'pspdfkit/shape/polyline':
                                    case 'shape/polyline':
                                    case 'polyline':
                                        return new AnnotationModels_1.PolylineShapeAnnotation(annotation);
                                    case 'pspdfkit/shape/rectangle':
                                    case 'shape/rectangle':
                                    case 'rectangle':
                                        return new AnnotationModels_1.RectangleShapeAnnotation(annotation);
                                    case 'pspdfkit/markup/redaction':
                                    case 'markup/redaction':
                                    case 'redaction':
                                        return new AnnotationModels_1.RedactionMarkupAnnotation(annotation);
                                    case 'pspdfkit/markup/squiggly':
                                    case 'markup/squiggly':
                                    case 'squiggly':
                                        return new AnnotationModels_1.SquigglyMarkupAnnotation(annotation);
                                    case 'pspdfkit/stamp':
                                    case 'stamp':
                                        return new AnnotationModels_1.StampAnnotation(annotation);
                                    case 'pspdfkit/markup/strikeout':
                                    case 'markup/strikeout':
                                    case 'strikeout':
                                        return new AnnotationModels_1.StrikeOutMarkupAnnotation(annotation);
                                    case 'pspdfkit/text':
                                    case 'text':
                                        return new AnnotationModels_1.TextAnnotation(annotation);
                                    case 'pspdfkit/markup/underline':
                                    case 'markup/underline':
                                    case 'underline':
                                        return new AnnotationModels_1.UnderlineMarkupAnnotation(annotation);
                                    case 'pspdfkit/widget':
                                    case 'widget':
                                        var widgetAnnotation = new AnnotationModels_1.WidgetAnnotation(annotation);
                                        if (annotation.formElement) {
                                            widgetAnnotation.formElement = new FormElement_1.FormElement(annotation.formElement);
                                            if (annotation.formElement.formField) {
                                                widgetAnnotation.formElement.formField = new FormField_1.FormField(annotation.formElement.formField);
                                            }
                                        }
                                        return widgetAnnotation;
                                    default:
                                        return undefined;
                                }
                            }).filter(Boolean)]; // Filter out undefined values
                }
            });
        });
    };
    /**
     * @method getAnnotationsForPage
     * @memberof PDFDocument
     * @param {number} pageIndex The page index to get annotations for. Starts at 0.
     * @param {string | Annotation.Type} [type] The type of annotation to get. If not specified, all annotation types are returned.
     * @description Gets all the annotations in the document for a specified type.
     * @example
     * const result = await this.pdfRef.current?.getDocument().getAnnotationsForPage(0, Annotation.Type.INK);
     * @returns { Promise<Array<AnnotationType | any>> } A promise containing the annotations for the specified page of the document as an array.
     */
    PDFDocument.prototype.getAnnotationsForPage = function (pageIndex, type) {
        return __awaiter(this, void 0, void 0, function () {
            var annotations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_1.NativeModules.PDFDocumentManager.getAnnotationsForPage((0, react_native_1.findNodeHandle)(this.pdfViewRef), pageIndex, type)];
                    case 1:
                        annotations = _a.sent();
                        // For backwards compatibility, return raw results if type is not an Annotation.Type value
                        if (type && !Object.values(Annotation_1.Annotation.Type).includes(type)) {
                            return [2 /*return*/, annotations];
                        }
                        return [2 /*return*/, annotations.map(function (annotation) {
                                // Convert each annotation based on its type
                                switch (annotation.type) {
                                    case 'pspdfkit/comment-marker':
                                    case 'comment-marker':
                                        return new AnnotationModels_1.CommentMarkerAnnotation(annotation);
                                    case 'pspdfkit/shape/ellipse':
                                    case 'shape/ellipse':
                                    case 'ellipse':
                                        return new AnnotationModels_1.EllipseShapeAnnotation(annotation);
                                    case 'pspdfkit/markup/highlight':
                                    case 'markup/highlight':
                                    case 'highlight':
                                        return new AnnotationModels_1.HighlightMarkupAnnotation(annotation);
                                    case 'pspdfkit/image':
                                    case 'image':
                                        return new AnnotationModels_1.ImageAnnotation(annotation);
                                    case 'pspdfkit/ink':
                                    case 'ink':
                                        return new AnnotationModels_1.InkAnnotation(annotation);
                                    case 'pspdfkit/shape/line':
                                    case 'shape/line':
                                    case 'line':
                                        return new AnnotationModels_1.LineShapeAnnotation(annotation);
                                    case 'pspdfkit/link':
                                    case 'link':
                                        return new AnnotationModels_1.LinkAnnotation(annotation);
                                    case 'pspdfkit/media':
                                    case 'media':
                                        return new AnnotationModels_1.MediaAnnotation(annotation);
                                    case 'pspdfkit/note':
                                    case 'note':
                                        return new AnnotationModels_1.NoteAnnotation(annotation);
                                    case 'pspdfkit/shape/polygon':
                                    case 'shape/polygon':
                                    case 'polygon':
                                        return new AnnotationModels_1.PolygonShapeAnnotation(annotation);
                                    case 'pspdfkit/shape/polyline':
                                    case 'shape/polyline':
                                    case 'polyline':
                                        return new AnnotationModels_1.PolylineShapeAnnotation(annotation);
                                    case 'pspdfkit/shape/rectangle':
                                    case 'shape/rectangle':
                                    case 'rectangle':
                                        return new AnnotationModels_1.RectangleShapeAnnotation(annotation);
                                    case 'pspdfkit/markup/redaction':
                                    case 'markup/redaction':
                                    case 'redaction':
                                        return new AnnotationModels_1.RedactionMarkupAnnotation(annotation);
                                    case 'pspdfkit/markup/squiggly':
                                    case 'markup/squiggly':
                                    case 'squiggly':
                                        return new AnnotationModels_1.SquigglyMarkupAnnotation(annotation);
                                    case 'pspdfkit/stamp':
                                    case 'stamp':
                                        return new AnnotationModels_1.StampAnnotation(annotation);
                                    case 'pspdfkit/markup/strikeout':
                                    case 'markup/strikeout':
                                    case 'strikeout':
                                        return new AnnotationModels_1.StrikeOutMarkupAnnotation(annotation);
                                    case 'pspdfkit/text':
                                    case 'text':
                                        return new AnnotationModels_1.TextAnnotation(annotation);
                                    case 'pspdfkit/markup/underline':
                                    case 'markup/underline':
                                    case 'underline':
                                        return new AnnotationModels_1.UnderlineMarkupAnnotation(annotation);
                                    case 'pspdfkit/widget':
                                    case 'widget':
                                        var widgetAnnotation = new AnnotationModels_1.WidgetAnnotation(annotation);
                                        if (annotation.formElement) {
                                            widgetAnnotation.formElement = new FormElement_1.FormElement(annotation.formElement);
                                            if (annotation.formElement.formField) {
                                                widgetAnnotation.formElement.formField = new FormField_1.FormField(annotation.formElement.formField);
                                            }
                                        }
                                        return widgetAnnotation;
                                    default:
                                        return undefined;
                                }
                            }).filter(Boolean)]; // Filter out undefined values
                }
            });
        });
    };
    /**
     * @method removeAnnotations
     * @memberof PDFDocument
     * @param {Array<any> | Array<AnnotationType>} annotations An array of the annotations to remove in InstantJSON format. Should not include the "annotations" key as used in the ```addAnnotations``` API.
     * @description Removes all the specified annotations from the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().removeAnnotations(annotations);
     * @returns { Promise<boolean> } A promise containing the result of the operation.
     */
    PDFDocument.prototype.removeAnnotations = function (annotations) {
        return react_native_1.NativeModules.PDFDocumentManager.removeAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), annotations);
    };
    /**
     * @method addAnnotations
     * @memberof PDFDocument
     * @param {Array<any> | Array<AnnotationType> | Record<string, any>} annotations Array of annotations in Instant JSON format to add to the document.
     * @param {Record<string, AnnotationAttachment>} [attachments] Map of attachments related to the annotations.
     * @description Adds all the specified annotations to the document. For complex annotations, use the ```applyInstantJSON``` API.
     * @example
     * const result = await this.pdfRef.current?.getDocument().addAnnotations(annotations);
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the annotations were added, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.addAnnotations = function (annotations, attachments) {
        if (attachments == null) {
            attachments = {};
        }
        return react_native_1.NativeModules.PDFDocumentManager.addAnnotations((0, react_native_1.findNodeHandle)(this.pdfViewRef), annotations, attachments);
    };
    /**
     * @method applyInstantJSON
     * @memberof PDFDocument
     * @param {Annotation.DocumentJSON} documentJSON The full Instant JSON object to add to the document as a ```DocumentJSON``` object.
     * @description Adds the specified Document JSON data to the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().applyInstantJSON(documentJSON);
     * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the document JSON was applied, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.applyInstantJSON = function (documentJSON) {
        return react_native_1.NativeModules.PDFDocumentManager.applyInstantJSON((0, react_native_1.findNodeHandle)(this.pdfViewRef), documentJSON);
    };
    /**
     * @method importXFDF
     * @memberof PDFDocument
     * @param {string} filePath The path to the XFDF file to import.
     * @description Imports the supplied XFDF file into the current document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().importXFDF('path/to/XFDF.xfdf');
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
     * const result = await this.pdfRef.current?.getDocument().exportXFDF('path/to/XFDF.xfdf');
     * @returns { Promise<any> } A promise containing an object with the exported file path and result. ```true``` if the xfdf file was exported successfully, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.exportXFDF = function (filePath) {
        return react_native_1.NativeModules.PDFDocumentManager.exportXFDF((0, react_native_1.findNodeHandle)(this.pdfViewRef), filePath);
    };
    /**
     * @method setPageIndex
     * @memberof PDFDocument
     * @param {number} pageIndex Zero-based page index of the page index to set the document to.
     * @description Used to set the current page of the document. Starts at 0.
     * @example
     * await this.pdfRef.current?.getDocument().setPageIndex(5);
     * @returns { Promise<void> } A promise returning when done.
     */
    PDFDocument.prototype.setPageIndex = function (pageIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = pageIndex < 0;
                        if (_a) return [3 /*break*/, 2];
                        _b = pageIndex;
                        return [4 /*yield*/, this.getPageCount()];
                    case 1:
                        _a = _b >= (_c.sent());
                        _c.label = 2;
                    case 2:
                        if (_a) {
                            return [2 /*return*/, Promise.reject(new Error('Page index out of bounds'))];
                        }
                        if (react_native_1.Platform.OS === 'android') {
                            react_native_1.UIManager.dispatchViewManagerCommand((0, react_native_1.findNodeHandle)(this.pdfViewRef), react_native_1.UIManager.getViewManagerConfig('RCTPSPDFKitView').Commands.setPageIndex, [pageIndex]);
                            return [2 /*return*/, Promise.resolve()];
                        }
                        else if (react_native_1.Platform.OS === 'ios') {
                            if (react_native_1.NativeModules.RCTPSPDFKitViewManager != null) {
                                react_native_1.NativeModules.RCTPSPDFKitViewManager.setPageIndex(pageIndex, (0, react_native_1.findNodeHandle)(this.pdfViewRef));
                            }
                            else {
                                react_native_1.NativeModules.PSPDFKitViewManager.setPageIndex(pageIndex, (0, react_native_1.findNodeHandle)(this.pdfViewRef));
                            }
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method getPageInfo
     * @memberof PDFDocument
     * @param {number} pageIndex Page index of the page info to get.
     * @description Returns cached rotation and aspect ratio data for specific page.
     * @example
     * const pageInfo = await this.pdfRef.current?.getDocument().getPageInfo(0);
     * @returns { Promise<PDFPageInfo> } A promise containing the page info.
     */
    PDFDocument.prototype.getPageInfo = function (pageIndex) {
        return react_native_1.NativeModules.PDFDocumentManager.getPageInfo((0, react_native_1.findNodeHandle)(this.pdfViewRef), pageIndex);
    };
    /**
     * @method addBookmarks
     * @memberof PDFDocument
     * @param {Array<Bookmark>} bookmarks The array of bookmarks to add.
     * @description Used to add bookmarks to the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().addBookmarks(bookmarks);
     * @returns { Promise<boolean> } Returns a promise containing the result of the operation. ```true``` if the bookmarks were added, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.addBookmarks = function (bookmarks) {
        return react_native_1.NativeModules.PDFDocumentManager.addBookmarks((0, react_native_1.findNodeHandle)(this.pdfViewRef), bookmarks);
    };
    /**
     * @method removeBookmarks
     * @memberof PDFDocument
     * @param {Array<Bookmark>} bookmarks The array of bookmarks to remove.
     * @description Used to remove bookmarks from the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().removeBookmarks(bookmarks);
     * @returns { Promise<boolean> } Returns a promise containing the result of the operation. ```true``` if the bookmarks were removed, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.removeBookmarks = function (bookmarks) {
        return react_native_1.NativeModules.PDFDocumentManager.removeBookmarks((0, react_native_1.findNodeHandle)(this.pdfViewRef), bookmarks);
    };
    /**
     * @method getBookmarks
     * @memberof PDFDocument
     * @description Used to get all bookmarks from the document.
     * @example
     * const result = await this.pdfRef.current?.getDocument().getBookmarks();
     * @returns { Promise<Array<Bookmark>> } Returns a promise containing an array of bookmarks.
     */
    PDFDocument.prototype.getBookmarks = function () {
        return react_native_1.NativeModules.PDFDocumentManager.getBookmarks((0, react_native_1.findNodeHandle)(this.pdfViewRef));
    };
    return PDFDocument;
}());
exports.PDFDocument = PDFDocument;
