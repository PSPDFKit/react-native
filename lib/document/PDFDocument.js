"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var ArchitectureDetector_1 = require("../ArchitectureDetector");
var AnnotationModels_1 = require("../annotations/AnnotationModels");
var Annotation_1 = require("../annotations/Annotation");
var FormField_1 = require("../forms/FormField");
var FormElement_1 = require("../forms/FormElement");
var Forms_1 = require("../forms/Forms");
/**
 * @class PDFDocument
 * @description The current document object loaded in the NutrientView.
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
     * @private
     * @method getRef
     * @description Helper method to get the appropriate ref for native module calls.
     * In Paper architecture, this uses findNodeHandle. In Fabric, this uses the pdfViewRef directly.
     * @returns {any} The ref to use for native module calls
     */
    PDFDocument.prototype.getRef = function () {
        var ref = (0, react_native_1.findNodeHandle)(this.pdfViewRef);
        if (ref == null) {
            // In fabric the pdfViewRef is a generated number and should be used directly
            ref = this.pdfViewRef;
        }
        return ref;
    };
    /**
     * @private
     * @method createAnnotationInstance
     * @description Creates an annotation instance from a raw annotation object based on its type.
     * @param {any} annotation The raw annotation object from native
     * @returns {any | undefined} The created annotation instance, or undefined if type is not recognized
     */
    PDFDocument.prototype.createAnnotationInstance = function (annotation) {
        var _a;
        var annotationInstance;
        // Convert each annotation based on its type
        switch (annotation.type) {
            case 'pspdfkit/comment-marker':
            case 'comment-marker':
                annotationInstance = new AnnotationModels_1.CommentMarkerAnnotation(annotation);
                break;
            case 'pspdfkit/shape/ellipse':
            case 'shape/ellipse':
            case 'ellipse':
                annotationInstance = new AnnotationModels_1.EllipseShapeAnnotation(annotation);
                break;
            case 'pspdfkit/markup/highlight':
            case 'markup/highlight':
            case 'highlight':
                annotationInstance = new AnnotationModels_1.HighlightMarkupAnnotation(annotation);
                break;
            case 'pspdfkit/image':
            case 'image':
                annotationInstance = new AnnotationModels_1.ImageAnnotation(annotation);
                break;
            case 'pspdfkit/ink':
            case 'ink':
                annotationInstance = new AnnotationModels_1.InkAnnotation(annotation);
                break;
            case 'pspdfkit/shape/line':
            case 'shape/line':
            case 'line':
                annotationInstance = new AnnotationModels_1.LineShapeAnnotation(annotation);
                break;
            case 'pspdfkit/link':
            case 'link':
                annotationInstance = new AnnotationModels_1.LinkAnnotation(annotation);
                break;
            case 'pspdfkit/media':
            case 'media':
                annotationInstance = new AnnotationModels_1.MediaAnnotation(annotation);
                break;
            case 'pspdfkit/note':
            case 'note':
                annotationInstance = new AnnotationModels_1.NoteAnnotation(annotation);
                break;
            case 'pspdfkit/shape/polygon':
            case 'shape/polygon':
            case 'polygon':
                annotationInstance = new AnnotationModels_1.PolygonShapeAnnotation(annotation);
                break;
            case 'pspdfkit/shape/polyline':
            case 'shape/polyline':
            case 'polyline':
                annotationInstance = new AnnotationModels_1.PolylineShapeAnnotation(annotation);
                break;
            case 'pspdfkit/shape/rectangle':
            case 'shape/rectangle':
            case 'rectangle':
                annotationInstance = new AnnotationModels_1.RectangleShapeAnnotation(annotation);
                break;
            case 'pspdfkit/markup/redaction':
            case 'markup/redaction':
            case 'redaction':
                annotationInstance = new AnnotationModels_1.RedactionMarkupAnnotation(annotation);
                break;
            case 'pspdfkit/markup/squiggly':
            case 'markup/squiggly':
            case 'squiggly':
                annotationInstance = new AnnotationModels_1.SquigglyMarkupAnnotation(annotation);
                break;
            case 'pspdfkit/stamp':
            case 'stamp':
                annotationInstance = new AnnotationModels_1.StampAnnotation(annotation);
                break;
            case 'pspdfkit/markup/strikeout':
            case 'markup/strikeout':
            case 'strikeout':
                annotationInstance = new AnnotationModels_1.StrikeOutMarkupAnnotation(annotation);
                break;
            case 'pspdfkit/text':
            case 'text':
                annotationInstance = new AnnotationModels_1.TextAnnotation(annotation);
                break;
            case 'pspdfkit/markup/underline':
            case 'markup/underline':
            case 'underline':
                annotationInstance = new AnnotationModels_1.UnderlineMarkupAnnotation(annotation);
                break;
            case 'pspdfkit/widget':
            case 'widget':
                annotationInstance = new AnnotationModels_1.WidgetAnnotation(annotation);
                var formElement = annotation.formElement;
                if (formElement) {
                    var formType = (_a = formElement.formTypeName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    var formElementInstance = void 0;
                    var formFieldInstance = void 0;
                    switch (formType) {
                        case 'button':
                            formElementInstance = new FormElement_1.ButtonFormElement(formElement);
                            if (formElement.formField) {
                                formFieldInstance = new FormField_1.ButtonFormField(formElement.formField);
                            }
                            break;
                        case 'choice':
                            formElementInstance = new FormElement_1.ChoiceFormElement(formElement);
                            if (formElement.formField) {
                                formFieldInstance = new FormField_1.ChoiceFormField(formElement.formField);
                            }
                            break;
                        case 'signature':
                            formElementInstance = new FormElement_1.SignatureFormElement(formElement);
                            formElementInstance.pdfViewRef = (0, react_native_1.findNodeHandle)(this.pdfViewRef);
                            if (formElement.formField) {
                                formFieldInstance = new FormField_1.SignatureFormField(formElement.formField);
                            }
                            break;
                        case 'textfield':
                            formElementInstance = new FormElement_1.TextFieldFormElement(formElement);
                            if (formElement.formField) {
                                formFieldInstance = new FormField_1.TextFormField(formElement.formField);
                            }
                            break;
                        default:
                            formElementInstance = new FormElement_1.FormElement(formElement);
                            if (formElement.formField) {
                                formFieldInstance = new FormField_1.FormField(formElement.formField);
                            }
                            break;
                    }
                    formElementInstance.pdfViewRef = (0, react_native_1.findNodeHandle)(this.pdfViewRef);
                    if (formFieldInstance) {
                        formElementInstance.formField = formFieldInstance;
                    }
                    annotationInstance.formElement = formElementInstance;
                }
                break;
            default:
                return undefined;
        }
        return annotationInstance;
    };
    /**
     * @private
     * @method wrapAnnotationWithChangeTracking
     * @description Wraps an annotation object with a Proxy to track property changes.
     * Stores original values and tracks which properties have been modified.
     * @param {any} annotation The annotation object to wrap
     * @returns {any} The wrapped annotation with change tracking
     */
    PDFDocument.prototype.wrapAnnotationWithChangeTracking = function (annotation) {
        // Store original values by deep cloning (only serializable properties)
        var originalValues = {};
        try {
            var cloned = JSON.parse(JSON.stringify(annotation));
            // Copy all enumerable properties to originalValues
            for (var key in cloned) {
                if (cloned.hasOwnProperty(key) && !key.startsWith('_')) {
                    originalValues[key] = cloned[key];
                }
            }
        }
        catch (e) {
            // If cloning fails, fall back to shallow copy of enumerable properties
            for (var key in annotation) {
                if (annotation.hasOwnProperty(key) && !key.startsWith('_')) {
                    originalValues[key] = annotation[key];
                }
            }
        }
        // Track changed properties
        var changedProperties = new Set();
        // Helper to compare values with proper deep equality (order-independent)
        var valuesEqual = function (a, b) {
            // Primitive comparison
            if (a === b)
                return true;
            if (a == null || b == null)
                return a === b;
            if (typeof a !== typeof b)
                return false;
            // Handle arrays
            if (Array.isArray(a) && Array.isArray(b)) {
                if (a.length !== b.length)
                    return false;
                for (var i = 0; i < a.length; i++) {
                    if (!valuesEqual(a[i], b[i]))
                        return false;
                }
                return true;
            }
            // Handle objects (but not arrays, Date, RegExp, etc.)
            if (typeof a === 'object' && typeof b === 'object') {
                var keysA = Object.keys(a);
                var keysB = Object.keys(b);
                if (keysA.length !== keysB.length)
                    return false;
                // Check all keys in a are in b and values match (order-independent)
                for (var _i = 0, keysA_1 = keysA; _i < keysA_1.length; _i++) {
                    var key = keysA_1[_i];
                    if (!keysB.includes(key))
                        return false;
                    if (!valuesEqual(a[key], b[key]))
                        return false;
                }
                return true;
            }
            return false;
        };
        // Store the original constructor and prototype for instanceof checks
        var OriginalConstructor = annotation.constructor;
        var OriginalPrototype = (OriginalConstructor === null || OriginalConstructor === void 0 ? void 0 : OriginalConstructor.prototype) || Object.getPrototypeOf(annotation);
        // Fix for module mismatch: User imports from package, we import from source
        // Try to get the user's class from the package to ensure instanceof works
        // We check if the constructor name matches a known annotation class
        if (OriginalConstructor === null || OriginalConstructor === void 0 ? void 0 : OriginalConstructor.name) {
            try {
                var packageModule = require('@nutrient-sdk/react-native');
                var userClass = packageModule[OriginalConstructor.name];
                if (userClass && userClass.prototype) {
                    // Use the user's class prototype instead of the local one
                    OriginalPrototype = userClass.prototype;
                }
            }
            catch (e) {
                // If we can't get the package module, fall back to local prototype
            }
        }
        // Create a new object that inherits from the constructor's prototype
        // This ensures instanceof works correctly with the actual class prototype
        var wrapped = Object.create(OriginalPrototype);
        // Ensure the constructor is set correctly on the wrapped object
        // This is important for instanceof checks
        if (OriginalConstructor) {
            try {
                Object.defineProperty(wrapped, 'constructor', {
                    value: OriginalConstructor,
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            }
            catch (e) {
                // If we can't set constructor, try simple assignment
                try {
                    wrapped.constructor = OriginalConstructor;
                }
                catch (e2) {
                    // Ignore if we can't set constructor
                }
            }
        }
        // Copy all properties from annotation to wrapped object
        // Get all own property names (including non-enumerable)
        var ownNames = Object.getOwnPropertyNames(annotation);
        // Get all own symbol properties
        var ownSymbols = Object.getOwnPropertySymbols(annotation);
        // Copy all own property names
        for (var _i = 0, ownNames_1 = ownNames; _i < ownNames_1.length; _i++) {
            var key = ownNames_1[_i];
            try {
                var descriptor = Object.getOwnPropertyDescriptor(annotation, key);
                if (descriptor) {
                    Object.defineProperty(wrapped, key, {
                        value: descriptor.value,
                        writable: descriptor.writable !== false,
                        enumerable: descriptor.enumerable !== false,
                        configurable: descriptor.configurable !== false,
                        get: descriptor.get,
                        set: descriptor.set
                    });
                }
            }
            catch (e) {
                // If descriptor copy fails, try simple assignment
                try {
                    wrapped[key] = annotation[key];
                }
                catch (e2) {
                    // Ignore if we can't copy
                }
            }
        }
        // Copy all symbol properties
        for (var _a = 0, ownSymbols_1 = ownSymbols; _a < ownSymbols_1.length; _a++) {
            var key = ownSymbols_1[_a];
            try {
                var descriptor = Object.getOwnPropertyDescriptor(annotation, key);
                if (descriptor) {
                    Object.defineProperty(wrapped, key, {
                        value: descriptor.value,
                        writable: descriptor.writable !== false,
                        enumerable: descriptor.enumerable !== false,
                        configurable: descriptor.configurable !== false,
                        get: descriptor.get,
                        set: descriptor.set
                    });
                }
            }
            catch (e) {
                // If descriptor copy fails, try simple assignment
                try {
                    wrapped[key] = annotation[key];
                }
                catch (e2) {
                    // Ignore if we can't copy
                }
            }
        }
        // Now create Proxy on the wrapped object (which has correct prototype)
        var proxy = new Proxy(wrapped, {
            getPrototypeOf: function (target) {
                return OriginalPrototype;
            },
            set: function (target, property, value) {
                var prop = String(property);
                // Skip tracking internal properties and methods
                if (prop.startsWith('_') || prop === 'constructor' || typeof target[property] === 'function') {
                    target[property] = value;
                    return true;
                }
                // Get original value
                var originalValue = originalValues[prop];
                // Check if value has changed
                var hasChanged = !valuesEqual(originalValue, value);
                if (hasChanged) {
                    changedProperties.add(prop);
                }
                else {
                    // If value matches original, remove from changed set
                    changedProperties.delete(prop);
                }
                // Set the property
                target[property] = value;
                return true;
            },
            get: function (target, property) {
                var prop = String(property);
                // Expose change tracking metadata
                if (prop === '_changeTracking') {
                    return {
                        originalValues: originalValues,
                        changedProperties: changedProperties,
                        getChangedProperties: function () { return Array.from(changedProperties); },
                        hasChanges: function () { return changedProperties.size > 0; },
                        getChangedObject: function () {
                            var changed = {};
                            changedProperties.forEach(function (prop) {
                                changed[prop] = target[prop];
                            });
                            return changed;
                        }
                    };
                }
                // Preserve constructor access
                if (prop === 'constructor') {
                    return OriginalConstructor;
                }
                return target[property];
            }
        });
        // Try to set Proxy's prototype - this is what instanceof checks
        // If this fails, the wrapped object already has the correct prototype
        // so instanceof should still work via getPrototypeOf trap
        try {
            Object.setPrototypeOf(proxy, OriginalPrototype);
        }
        catch (e) {
            // If setPrototypeOf fails, the getPrototypeOf trap should handle it
            // But some engines might not use the trap for instanceof
        }
        return proxy;
    };
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
        return react_native_1.NativeModules.PDFDocumentManager.getDocumentId(this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.getPageCount(this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.isEncrypted(this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.invalidateCacheForPage(this.getRef(), pageIndex);
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
        return react_native_1.NativeModules.PDFDocumentManager.invalidateCache(this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.save(this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.getAllUnsavedAnnotations(this.getRef());
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
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_1.NativeModules.PDFDocumentManager.getAnnotations(this.getRef(), type)];
                    case 1:
                        annotations = _a.sent();
                        // For backwards compatibility, return raw results if type is not an Annotation.Type value
                        if (type && !Object.values(Annotation_1.Annotation.Type).includes(type)) {
                            return [2 /*return*/, annotations];
                        }
                        return [2 /*return*/, annotations.map(function (annotation) {
                                var annotationInstance = _this.createAnnotationInstance(annotation);
                                // Wrap with change tracking if annotation was created
                                return annotationInstance ? _this.wrapAnnotationWithChangeTracking(annotationInstance) : undefined;
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
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, react_native_1.NativeModules.PDFDocumentManager.getAnnotationsForPage(this.getRef(), pageIndex, type)];
                    case 1:
                        annotations = _a.sent();
                        // For backwards compatibility, return raw results if type is not an Annotation.Type value
                        if (type && !Object.values(Annotation_1.Annotation.Type).includes(type)) {
                            return [2 /*return*/, annotations];
                        }
                        return [2 /*return*/, annotations.map(function (annotation) {
                                var annotationInstance = _this.createAnnotationInstance(annotation);
                                // Wrap with change tracking if annotation was created
                                return annotationInstance ? _this.wrapAnnotationWithChangeTracking(annotationInstance) : undefined;
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
        return react_native_1.NativeModules.PDFDocumentManager.removeAnnotations(this.getRef(), annotations);
    };
    /**
     * @method updateAnnotations
     * @memberof PDFDocument
     * @param {Array<any> | Array<AnnotationType>} annotations An array of annotation objects that have been modified.
     * @description Updates the specified annotations in the document. Only properties that have been modified since the annotation was retrieved will be updated.
     * @example
     * const annotations = await this.pdfRef.current?.getDocument().getAnnotations();
     * annotations[0].color = '#FF0000';
     * annotations[0].opacity = 0.5;
     * const result = await this.pdfRef.current?.getDocument().updateAnnotations(annotations);
     * @returns { Promise<boolean> } A promise containing the result of the operation. An exception will be thrown if an error occurred.
     */
    PDFDocument.prototype.updateAnnotations = function (annotations) {
        // Extract only changed properties from each annotation
        var updatePayload = annotations.map(function (annotation) {
            // Check if annotation has change tracking
            var changeTracking = annotation._changeTracking;
            if (!changeTracking || !changeTracking.hasChanges()) {
                // If no change tracking or no changes, return minimal payload with just identifier
                return {
                    uuid: annotation.uuid,
                    name: annotation.name
                };
            }
            // Get changed properties
            var changedProps = changeTracking.getChangedObject();
            // Always include uuid/name for matching on native side
            return __assign({ uuid: annotation.uuid, name: annotation.name }, changedProps);
        }).filter(function (payload) {
            // Filter out annotations that have no identifier
            return payload.uuid || payload.name;
        });
        if (updatePayload.length === 0) {
            return Promise.resolve(true); // No changes to apply
        }
        return react_native_1.NativeModules.PDFDocumentManager.updateAnnotations(this.getRef(), updatePayload);
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
        return react_native_1.NativeModules.PDFDocumentManager.addAnnotations(this.getRef(), annotations, attachments);
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
        return react_native_1.NativeModules.PDFDocumentManager.applyInstantJSON(this.getRef(), documentJSON);
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
        return react_native_1.NativeModules.PDFDocumentManager.importXFDF(this.getRef(), filePath);
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
        return react_native_1.NativeModules.PDFDocumentManager.exportXFDF(this.getRef(), filePath);
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
            var _a, _b, NativeNutrientViewTurboModule, ref, reference, _1, ref, nodeHandle, viewManagerConfig, command;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = pageIndex < 0;
                        if (_a) return [3 /*break*/, 2];
                        _b = pageIndex;
                        return [4 /*yield*/, this.getPageCount()];
                    case 1:
                        _a = _b >= (_d.sent());
                        _d.label = 2;
                    case 2:
                        if (_a) {
                            return [2 /*return*/, Promise.reject(new Error('Page index out of bounds'))];
                        }
                        if (!(0, ArchitectureDetector_1.isNewArchitectureEnabled)()) return [3 /*break*/, 6];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        NativeNutrientViewTurboModule = require('../specs/NativeNutrientViewTurboModule').default;
                        ref = this.getRef();
                        reference = String(ref);
                        return [4 /*yield*/, NativeNutrientViewTurboModule.setPageIndex(reference, pageIndex, true)];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                    case 5:
                        _1 = _d.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        if (react_native_1.Platform.OS === 'android') {
                            ref = this.getRef();
                            if (ref == null) {
                                return [2 /*return*/, Promise.reject(new Error('PDF view reference is not available'))];
                            }
                            nodeHandle = typeof ref === 'number' ? ref : (0, react_native_1.findNodeHandle)(this.pdfViewRef);
                            if (nodeHandle == null) {
                                return [2 /*return*/, Promise.reject(new Error('PDF view reference is not available'))];
                            }
                            viewManagerConfig = react_native_1.UIManager.getViewManagerConfig('RCTPSPDFKitView');
                            command = (_c = viewManagerConfig === null || viewManagerConfig === void 0 ? void 0 : viewManagerConfig.Commands) === null || _c === void 0 ? void 0 : _c.setPageIndex;
                            if (command == null) {
                                return [2 /*return*/, Promise.reject(new Error('setPageIndex command is not available'))];
                            }
                            react_native_1.UIManager.dispatchViewManagerCommand(nodeHandle, command, [pageIndex]);
                            return [2 /*return*/, Promise.resolve()];
                        }
                        else if (react_native_1.Platform.OS === 'ios') {
                            if (react_native_1.NativeModules.RCTPSPDFKitViewManager != null) {
                                react_native_1.NativeModules.RCTPSPDFKitViewManager.setPageIndex(pageIndex, this.getRef());
                            }
                            else {
                                react_native_1.NativeModules.PSPDFKitViewManager.setPageIndex(pageIndex, this.getRef());
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
        return react_native_1.NativeModules.PDFDocumentManager.getPageInfo(this.getRef(), pageIndex);
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
        return react_native_1.NativeModules.PDFDocumentManager.addBookmarks(this.getRef(), bookmarks);
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
        return react_native_1.NativeModules.PDFDocumentManager.removeBookmarks(this.getRef(), bookmarks);
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
        return react_native_1.NativeModules.PDFDocumentManager.getBookmarks(this.getRef());
    };
    /**
     * Sets the flags of the specified annotation.
     *
     * @method setAnnotationFlags
     * @memberof PDFDocument
     * @param { string } uuid The UUID of the annotation to update.
     * @param { Annotation.Flags[] } flags The flags to apply to the annotation.
     * @example
     * const result = await this.pdfRef.current?.getDocument().setAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a', ['locked', 'hidden']);
     * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotations were added successfully, and ```false``` if an error occurred.
     */
    PDFDocument.prototype.setAnnotationFlags = function (uuid, flags) {
        return react_native_1.NativeModules.PDFDocumentManager.setAnnotationFlags(this.getRef(), uuid, flags);
    };
    /**
     * Gets the flags for the specified annotation.
     *
     * @method getAnnotationFlags
     * @memberof PDFDocument
     * @param { string } uuid The UUID of the annotation to query.
     * @example
     * const flags = await this.pdfRef.current?.getDocument().getAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a');
     * @returns { Promise<Annotation.Flags[]> } A promise containing the flags of the specified annotation.
     */
    PDFDocument.prototype.getAnnotationFlags = function (uuid) {
        return react_native_1.NativeModules.PDFDocumentManager.getAnnotationFlags(this.getRef(), uuid);
    };
    /**
     * Gets the text positions (word rects) for a specific page.
     *
     * @method getPageTextRects
     * @memberof PDFDocument
     * @param { number } pageIndex The page index to get the text rects for. Starts at 0.
     * @example
     * const textRects = await this.pdfRef.current?.getDocument().getPageTextRects(0);
     * @returns { Promise<Array<TextRect>> } A promise containing an array of text rects, each containing the word text and its bounding frame in PDF coordinates.
     */
    PDFDocument.prototype.getPageTextRects = function (pageIndex) {
        return react_native_1.NativeModules.PDFDocumentManager.getPageTextRects(this.getRef(), pageIndex);
    };
    return PDFDocument;
}());
exports.PDFDocument = PDFDocument;
