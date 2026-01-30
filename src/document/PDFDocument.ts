import {
  findNodeHandle,
  NativeModules,
  UIManager,
  Platform
  // @ts-ignore
} from 'react-native';
import { isNewArchitectureEnabled } from '../ArchitectureDetector';
import {
  DocumentJSON,
  AnnotationType,
  CommentMarkerAnnotation,
  EllipseShapeAnnotation,
  HighlightMarkupAnnotation,
  ImageAnnotation,
  InkAnnotation,
  LineShapeAnnotation,
  LinkAnnotation,
  MediaAnnotation,
  NoteAnnotation,
  PolygonShapeAnnotation,
  PolylineShapeAnnotation,
  RectangleShapeAnnotation,
  RedactionMarkupAnnotation,
  SquigglyMarkupAnnotation,
  StampAnnotation,
  StrikeOutMarkupAnnotation,
  TextAnnotation,
  UnderlineMarkupAnnotation,
  WidgetAnnotation,
  AnnotationAttachment} from '../annotations/AnnotationModels';
import { Annotation } from '../annotations/Annotation';
import { ButtonFormField, ChoiceFormField, FormField, SignatureFormField, TextFormField } from '../forms/FormField';
import { ButtonFormElement, ChoiceFormElement, FormElement, SignatureFormElement, TextFieldFormElement } from '../forms/FormElement';
import { Forms } from '../forms/Forms';
import { PDFPageInfo } from './PDFPageInfo';
import { Bookmark } from './Bookmark';
import { TextRect } from './TextRect';

/**
 * @class PDFDocument
 * @description The current document object loaded in the NutrientView.
 * @hideconstructor
 */
export class PDFDocument {

  pdfViewRef: any;
   /** 
    * @property { Forms }
    * @description  The Forms class provides methods for managing form fields in the document.
    * @memberof PDFDocument
    */
  public forms: Forms;

   /**
    * @ignore
    */
    constructor(pdfViewRef: any) {
      this.pdfViewRef = pdfViewRef;
      this.forms = new Forms(pdfViewRef);
    }

   /**
    * @private
    * @method getRef
    * @description Helper method to get the appropriate ref for native module calls.
    * In Paper architecture, this uses findNodeHandle. In Fabric, this uses the pdfViewRef directly.
    * @returns {any} The ref to use for native module calls
    */
    private getRef(): any {
      var ref = findNodeHandle(this.pdfViewRef);
      if (ref == null) {
        // In fabric the pdfViewRef is a generated number and should be used directly
        ref = this.pdfViewRef;
      }
      return ref;
    }

   /**
    * @private
    * @method createAnnotationInstance
    * @description Creates an annotation instance from a raw annotation object based on its type.
    * @param {any} annotation The raw annotation object from native
    * @returns {any | undefined} The created annotation instance, or undefined if type is not recognized
    */
    private createAnnotationInstance(annotation: any): any | undefined {
      let annotationInstance: any;
      
      // Convert each annotation based on its type
      switch (annotation.type) {
        case 'pspdfkit/comment-marker':
        case 'comment-marker':
          annotationInstance = new CommentMarkerAnnotation(annotation);
          break;
        case 'pspdfkit/shape/ellipse':
        case 'shape/ellipse':
        case 'ellipse':
          annotationInstance = new EllipseShapeAnnotation(annotation);
          break;
        case 'pspdfkit/markup/highlight':
        case 'markup/highlight':
        case 'highlight':
          annotationInstance = new HighlightMarkupAnnotation(annotation);
          break;
        case 'pspdfkit/image':
        case 'image':
          annotationInstance = new ImageAnnotation(annotation);
          break;
        case 'pspdfkit/ink':
        case 'ink':
          annotationInstance = new InkAnnotation(annotation);
          break;
        case 'pspdfkit/shape/line':
        case 'shape/line':
        case 'line':
          annotationInstance = new LineShapeAnnotation(annotation);
          break;
        case 'pspdfkit/link':
        case 'link':
          annotationInstance = new LinkAnnotation(annotation);
          break;
        case 'pspdfkit/media':
        case 'media':
          annotationInstance = new MediaAnnotation(annotation);
          break;
        case 'pspdfkit/note':
        case 'note':
          annotationInstance = new NoteAnnotation(annotation);
          break;
        case 'pspdfkit/shape/polygon':
        case 'shape/polygon':
        case 'polygon':
          annotationInstance = new PolygonShapeAnnotation(annotation);
          break;
        case 'pspdfkit/shape/polyline':
        case 'shape/polyline':
        case 'polyline':
          annotationInstance = new PolylineShapeAnnotation(annotation);
          break;
        case 'pspdfkit/shape/rectangle':
        case 'shape/rectangle':
        case 'rectangle':
          annotationInstance = new RectangleShapeAnnotation(annotation);
          break;
        case 'pspdfkit/markup/redaction':
        case 'markup/redaction':
        case 'redaction':
          annotationInstance = new RedactionMarkupAnnotation(annotation);
          break;
        case 'pspdfkit/markup/squiggly':
        case 'markup/squiggly':
        case 'squiggly':
          annotationInstance = new SquigglyMarkupAnnotation(annotation);
          break;
        case 'pspdfkit/stamp':
        case 'stamp':
          annotationInstance = new StampAnnotation(annotation);
          break;
        case 'pspdfkit/markup/strikeout':
        case 'markup/strikeout':
        case 'strikeout':
          annotationInstance = new StrikeOutMarkupAnnotation(annotation);
          break;
        case 'pspdfkit/text':
        case 'text':
          annotationInstance = new TextAnnotation(annotation);
          break;
        case 'pspdfkit/markup/underline':
        case 'markup/underline':
        case 'underline':
          annotationInstance = new UnderlineMarkupAnnotation(annotation);
          break;
        case 'pspdfkit/widget':
        case 'widget':

          annotationInstance = new WidgetAnnotation(annotation);
          const formElement = annotation.formElement;
          if (formElement) {
              const formType = formElement.formTypeName?.toLowerCase();
              let formElementInstance;
              let formFieldInstance;

              switch (formType) {
                  case 'button':
                      formElementInstance = new ButtonFormElement(formElement);
                      if (formElement.formField) {
                          formFieldInstance = new ButtonFormField(
                              formElement.formField,
                          );
                      }
                      break;
                  case 'choice':
                      formElementInstance = new ChoiceFormElement(formElement);
                      if (formElement.formField) {
                          formFieldInstance = new ChoiceFormField(
                              formElement.formField,
                          );
                      }
                      break;
                  case 'signature':
                      formElementInstance = new SignatureFormElement(formElement);
                      if (formElement.formField) {
                          formFieldInstance = new SignatureFormField(
                              formElement.formField,
                          );
                      }
                      break;
                  case 'textfield':
                      formElementInstance = new TextFieldFormElement(formElement);
                      if (formElement.formField) {
                          formFieldInstance = new TextFormField(
                              formElement.formField,
                          );
                      }
                      break;
                  default:
                      formElementInstance = new FormElement(formElement);
                      if (formElement.formField) {
                          formFieldInstance = new FormField(formElement.formField);
                      }
                      break;
              }

              formElementInstance.pdfViewRef = findNodeHandle(this.pdfViewRef);
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
    }

   /**
    * @private
    * @method wrapAnnotationWithChangeTracking
    * @description Wraps an annotation object with a Proxy to track property changes.
    * Stores original values and tracks which properties have been modified.
    * @param {any} annotation The annotation object to wrap
    * @returns {any} The wrapped annotation with change tracking
    */
    private wrapAnnotationWithChangeTracking(annotation: any): any {
      // Store original values by deep cloning (only serializable properties)
      const originalValues: any = {};
      try {
        const cloned = JSON.parse(JSON.stringify(annotation));
        // Copy all enumerable properties to originalValues
        for (const key in cloned) {
          if (cloned.hasOwnProperty(key) && !key.startsWith('_')) {
            originalValues[key] = cloned[key];
          }
        }
      } catch (e) {
        // If cloning fails, fall back to shallow copy of enumerable properties
        for (const key in annotation) {
          if (annotation.hasOwnProperty(key) && !key.startsWith('_')) {
            originalValues[key] = annotation[key];
          }
        }
      }
      
      // Track changed properties
      const changedProperties = new Set<string>();
      
      // Helper to compare values with proper deep equality (order-independent)
      const valuesEqual = (a: any, b: any): boolean => {
        // Primitive comparison
        if (a === b) return true;
        if (a == null || b == null) return a === b;
        if (typeof a !== typeof b) return false;
        
        // Handle arrays
        if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!valuesEqual(a[i], b[i])) return false;
          }
          return true;
        }
        
        // Handle objects (but not arrays, Date, RegExp, etc.)
        if (typeof a === 'object' && typeof b === 'object') {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          
          if (keysA.length !== keysB.length) return false;
          
          // Check all keys in a are in b and values match (order-independent)
          for (const key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!valuesEqual(a[key], b[key])) return false;
          }
          
          return true;
        }
        
        return false;
      };
      
      // Store the original constructor and prototype for instanceof checks
      const OriginalConstructor = annotation.constructor;
      let OriginalPrototype = OriginalConstructor?.prototype || Object.getPrototypeOf(annotation);
      
      // Fix for module mismatch: User imports from package, we import from source
      // Try to get the user's class from the package to ensure instanceof works
      // We check if the constructor name matches a known annotation class
      if (OriginalConstructor?.name) {
        try {
          const packageModule = require('@nutrient-sdk/react-native');
          const userClass = packageModule[OriginalConstructor.name];
          if (userClass && userClass.prototype) {
            // Use the user's class prototype instead of the local one
            OriginalPrototype = userClass.prototype;
          }
        } catch (e) {
          // If we can't get the package module, fall back to local prototype
        }
      }
      
      // Create a new object that inherits from the constructor's prototype
      // This ensures instanceof works correctly with the actual class prototype
      const wrapped = Object.create(OriginalPrototype);
      
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
        } catch (e) {
          // If we can't set constructor, try simple assignment
          try {
            wrapped.constructor = OriginalConstructor;
          } catch (e2) {
            // Ignore if we can't set constructor
          }
        }
      }
      
      // Copy all properties from annotation to wrapped object
      // Get all own property names (including non-enumerable)
      const ownNames = Object.getOwnPropertyNames(annotation);
      // Get all own symbol properties
      const ownSymbols = Object.getOwnPropertySymbols(annotation);
      
      // Copy all own property names
      for (const key of ownNames) {
        try {
          const descriptor = Object.getOwnPropertyDescriptor(annotation, key);
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
        } catch (e) {
          // If descriptor copy fails, try simple assignment
          try {
            wrapped[key] = annotation[key];
          } catch (e2) {
            // Ignore if we can't copy
          }
        }
      }
      
      // Copy all symbol properties
      for (const key of ownSymbols) {
        try {
          const descriptor = Object.getOwnPropertyDescriptor(annotation, key);
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
        } catch (e) {
          // If descriptor copy fails, try simple assignment
          try {
            wrapped[key] = annotation[key];
          } catch (e2) {
            // Ignore if we can't copy
          }
        }
      }
      
      // Now create Proxy on the wrapped object (which has correct prototype)
      const proxy = new Proxy(wrapped, {
        getPrototypeOf(target: any): object | null {
          return OriginalPrototype;
        },
        
        set(target: any, property: string | symbol, value: any): boolean {
          const prop = String(property);
          
          // Skip tracking internal properties and methods
          if (prop.startsWith('_') || prop === 'constructor' || typeof target[property] === 'function') {
            target[property] = value;
            return true;
          }
          
          // Get original value
          const originalValue = originalValues[prop];
          
          // Check if value has changed
          const hasChanged = !valuesEqual(originalValue, value);
          
          if (hasChanged) {
            changedProperties.add(prop);
          } else {
            // If value matches original, remove from changed set
            changedProperties.delete(prop);
          }
          
          // Set the property
          target[property] = value;
          
          return true;
        },
        
        get(target: any, property: string | symbol): any {
          const prop = String(property);
          
          // Expose change tracking metadata
          if (prop === '_changeTracking') {
            return {
              originalValues: originalValues,
              changedProperties: changedProperties,
              getChangedProperties: () => Array.from(changedProperties),
              hasChanges: () => changedProperties.size > 0,
              getChangedObject: () => {
                const changed: any = {};
                changedProperties.forEach(prop => {
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
      } catch (e) {
        // If setPrototypeOf fails, the getPrototypeOf trap should handle it
        // But some engines might not use the trap for instanceof
      }
      
      return proxy;
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
    getDocumentId(): Promise<string> {
      return NativeModules.PDFDocumentManager.getDocumentId(this.getRef());
    }

   /**
    * @method getPageCount
    * @memberof PDFDocument
    * @description Returns the number of pages in the document.
    * @example
    * const pageCount = await this.pdfRef.current?.getDocument().getPageCount();
    * @returns { Promise<number> } A promise containing the document page count.
    */
    getPageCount(): Promise<number> {
      return NativeModules.PDFDocumentManager.getPageCount(this.getRef());
    }

   /**
    * @method isEncrypted
    * @memberof PDFDocument
    * @description Indicates if the PDF document is encrypted (password protected).
    * @example
    * const isEncrypted = await this.pdfRef.current?.getDocument().isEncrypted();
    * @returns { Promise<boolean> } A promise containing whether the document is encrypted.
    */
    isEncrypted(): Promise<boolean> {
      return NativeModules.PDFDocumentManager.isEncrypted(this.getRef());
    }

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
    invalidateCacheForPage(pageIndex: number): Promise<boolean> {
      return NativeModules.PDFDocumentManager.invalidateCacheForPage(this.getRef(), pageIndex);
    }

   /**
    * @method invalidateCache
    * @memberof PDFDocument
    * @description Invalidates the rendered cache of all the pages for this document.
    * Use this method if the document is not updated after a change, or changed externally, and needs to be re-rendered.
    * @example
    * const result = await this.pdfRef.current?.getDocument().invalidateCache();
    * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the cache was invalidated, ```false``` otherwise.
    */
    invalidateCache(): Promise<boolean> {
      return NativeModules.PDFDocumentManager.invalidateCache(this.getRef());
    }

   /**
    * @method save
    * @memberof PDFDocument
    * @description Saves the document asynchronously.
    * @example
    * const result = await this.pdfRef.current?.getDocument().save();
    * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the document was saved, ```false``` otherwise.
    */
    save(): Promise<boolean> {
      return NativeModules.PDFDocumentManager.save(this.getRef());
    }

   /**
    * @method getAllUnsavedAnnotations
    * @memberof PDFDocument
    * @description Gets all the unsaved changes to annotations in the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().getAllUnsavedAnnotations();
    * @returns { Promise<Record<string, any> | DocumentJSON> } A promise containing the unsaved annotations as an array, wrapped in a DocumentJSON object.
    */
    getAllUnsavedAnnotations(): Promise<DocumentJSON> {
      return NativeModules.PDFDocumentManager.getAllUnsavedAnnotations(this.getRef());
    }

   /**
    * @method getAnnotations
    * @memberof PDFDocument
    * @param {string | Annotation.Type} [type] The type of annotation to get. If not specified, all annotation types are returned.
    * @description Gets all the annotations in the document for a specified type.
    * @example
    * const result = await this.pdfRef.current?.getDocument().getAnnotations(Annotation.Type.INK);
    * @returns { Promise<Array<AnnotationType | any>> } A promise containing the annotations of the document as an array of Annotation objects.
    */
    async getAnnotations(type?: string | Annotation.Type): Promise<Array<AnnotationType | any>> {
      const annotations = await NativeModules.PDFDocumentManager.getAnnotations(this.getRef(), type);
      
      // For backwards compatibility, return raw results if type is not an Annotation.Type value
      if (type && !Object.values(Annotation.Type).includes(type as Annotation.Type)) {
          return annotations;
      }
      
      return annotations.map((annotation: any) => {
          const annotationInstance = this.createAnnotationInstance(annotation);
          // Wrap with change tracking if annotation was created
          return annotationInstance ? this.wrapAnnotationWithChangeTracking(annotationInstance) : undefined;
      }).filter(Boolean); // Filter out undefined values
  }

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
    async getAnnotationsForPage(pageIndex: number, type?: string | Annotation.Type): Promise<Array<AnnotationType | any>> {
        const annotations = await NativeModules.PDFDocumentManager.getAnnotationsForPage(this.getRef(), pageIndex, type);
        
        // For backwards compatibility, return raw results if type is not an Annotation.Type value
        if (type && !Object.values(Annotation.Type).includes(type as Annotation.Type)) {
            return annotations;
        }
        
        return annotations.map((annotation: any) => {
            const annotationInstance = this.createAnnotationInstance(annotation);
            // Wrap with change tracking if annotation was created
            return annotationInstance ? this.wrapAnnotationWithChangeTracking(annotationInstance) : undefined;
          }).filter(Boolean); // Filter out undefined values
    }

   /**
    * @method removeAnnotations
    * @memberof PDFDocument
    * @param {Array<any> | Array<AnnotationType>} annotations An array of the annotations to remove in InstantJSON format. Should not include the "annotations" key as used in the ```addAnnotations``` API.
    * @description Removes all the specified annotations from the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().removeAnnotations(annotations);
    * @returns { Promise<boolean> } A promise containing the result of the operation.
    */
    removeAnnotations(annotations: Array<any> | Array<AnnotationType>): Promise<boolean> {
      return NativeModules.PDFDocumentManager.removeAnnotations(this.getRef(), annotations);
    }

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
    updateAnnotations(annotations: Array<any> | Array<AnnotationType>): Promise<boolean> {
      // Extract only changed properties from each annotation
      const updatePayload = annotations.map((annotation: any) => {
        // Check if annotation has change tracking
        const changeTracking = annotation._changeTracking;
        
        if (!changeTracking || !changeTracking.hasChanges()) {
          // If no change tracking or no changes, return minimal payload with just identifier
          return {
            uuid: annotation.uuid,
            name: annotation.name
          };
        }
        
        // Get changed properties
        const changedProps = changeTracking.getChangedObject();
        
        // Always include uuid/name for matching on native side
        return {
          uuid: annotation.uuid,
          name: annotation.name,
          ...changedProps
        };
      }).filter((payload: any) => {
        // Filter out annotations that have no identifier
        return payload.uuid || payload.name;
      });
      
      if (updatePayload.length === 0) {
        return Promise.resolve(true); // No changes to apply
      }
      
      return NativeModules.PDFDocumentManager.updateAnnotations(this.getRef(), updatePayload);
    }

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
    addAnnotations(annotations: Array<any> | Array<AnnotationType> | Record<string, any>, attachments?: Record<string, AnnotationAttachment>): Promise<boolean> {
        if (attachments == null) {
            attachments = {};
        }
        return NativeModules.PDFDocumentManager.addAnnotations(this.getRef(), annotations, attachments);
    }

   /**
    * @method applyInstantJSON
    * @memberof PDFDocument
    * @param {Annotation.DocumentJSON} documentJSON The full Instant JSON object to add to the document as a ```DocumentJSON``` object.
    * @description Adds the specified Document JSON data to the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().applyInstantJSON(documentJSON);
    * @returns { Promise<boolean> } A promise containing the result of the operation. ```true``` if the document JSON was applied, and ```false``` if an error occurred.
    */
    applyInstantJSON(documentJSON: DocumentJSON): Promise<boolean> {
      return NativeModules.PDFDocumentManager.applyInstantJSON(this.getRef(), documentJSON);
    }

   /**
    * @method importXFDF
    * @memberof PDFDocument
    * @param {string} filePath The path to the XFDF file to import.
    * @description Imports the supplied XFDF file into the current document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().importXFDF('path/to/XFDF.xfdf');
    * @returns { Promise<any> } A promise containing an object with the result. ```true``` if the xfdf file was imported successfully, and ```false``` if an error occurred.
    */
    importXFDF(filePath: string): Promise<boolean> {
      return NativeModules.PDFDocumentManager.importXFDF(this.getRef(), filePath);
    }

   /**
    * @method exportXFDF
    * @memberof PDFDocument
    * @param {string} filePath The path where the XFDF file should be exported to.
    * @description Exports the annotations from the current document to a XFDF file.
    * @example
    * const result = await this.pdfRef.current?.getDocument().exportXFDF('path/to/XFDF.xfdf');
    * @returns { Promise<any> } A promise containing an object with the exported file path and result. ```true``` if the xfdf file was exported successfully, and ```false``` if an error occurred.
    */
    exportXFDF(filePath: string): Promise<any> {
      return NativeModules.PDFDocumentManager.exportXFDF(this.getRef(), filePath);
    }

   /**
    * @method setPageIndex
    * @memberof PDFDocument
    * @param {number} pageIndex Zero-based page index of the page index to set the document to.
    * @description Used to set the current page of the document. Starts at 0.
    * @example
    * await this.pdfRef.current?.getDocument().setPageIndex(5);
  * @returns { Promise<void> } A promise returning when done.
    */
  async setPageIndex(pageIndex: number): Promise<void> {
        if (pageIndex < 0 || pageIndex >= (await this.getPageCount())) {
            return Promise.reject(new Error('Page index out of bounds'));
        }
    // New Architecture (Fabric): call TurboModule API for iOS/Android
    if (isNewArchitectureEnabled()) {
      try {
        // @ts-ignore - dynamically require to avoid import errors in Paper architecture
        const NativeNutrientViewTurboModule = require('../specs/NativeNutrientViewTurboModule').default;
        const ref = this.getRef();
        const reference = String(ref);
        await NativeNutrientViewTurboModule.setPageIndex(reference, pageIndex, true);
        return;
      } catch (_) {
        // Fallback to legacy flow below if TurboModule fails
      }
    }

    if (Platform.OS === 'android') {
            const ref = this.getRef();
            if (ref == null) {
                return Promise.reject(new Error('PDF view reference is not available'));
            }
            // getRef() returns number in both old and new architecture for Android
            const nodeHandle = typeof ref === 'number' ? ref : findNodeHandle(this.pdfViewRef);
            if (nodeHandle == null) {
                return Promise.reject(new Error('PDF view reference is not available'));
            }
            const viewManagerConfig = UIManager.getViewManagerConfig('RCTPSPDFKitView');
            const command = viewManagerConfig?.Commands?.setPageIndex;
            if (command == null) {
                return Promise.reject(new Error('setPageIndex command is not available'));
            }
            UIManager.dispatchViewManagerCommand(nodeHandle, command, [pageIndex]);
        return Promise.resolve();
        } else if (Platform.OS === 'ios') {
            if (NativeModules.RCTPSPDFKitViewManager != null) {
                NativeModules.RCTPSPDFKitViewManager.setPageIndex(
                    pageIndex,
                    this.getRef(),
                );
            } else {
                NativeModules.PSPDFKitViewManager.setPageIndex(
                pageIndex,
                this.getRef(),
                );
            }
            return Promise.resolve();
        }
    }

   /**
    * @method getPageInfo
    * @memberof PDFDocument
    * @param {number} pageIndex Page index of the page info to get.
    * @description Returns cached rotation and aspect ratio data for specific page.
    * @example
    * const pageInfo = await this.pdfRef.current?.getDocument().getPageInfo(0);
    * @returns { Promise<PDFPageInfo> } A promise containing the page info.
    */
    getPageInfo(pageIndex: number): Promise<PDFPageInfo> {
        return NativeModules.PDFDocumentManager.getPageInfo(this.getRef(), pageIndex);
    }

   /**
    * @method addBookmarks
    * @memberof PDFDocument
    * @param {Array<Bookmark>} bookmarks The array of bookmarks to add.
    * @description Used to add bookmarks to the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().addBookmarks(bookmarks);
    * @returns { Promise<boolean> } Returns a promise containing the result of the operation. ```true``` if the bookmarks were added, and ```false``` if an error occurred.
    */
    addBookmarks(bookmarks: Array<Bookmark>): Promise<boolean> {
        return NativeModules.PDFDocumentManager.addBookmarks(this.getRef(), bookmarks);
    }

   /**
    * @method removeBookmarks
    * @memberof PDFDocument
    * @param {Array<Bookmark>} bookmarks The array of bookmarks to remove.
    * @description Used to remove bookmarks from the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().removeBookmarks(bookmarks);
    * @returns { Promise<boolean> } Returns a promise containing the result of the operation. ```true``` if the bookmarks were removed, and ```false``` if an error occurred.
    */
    removeBookmarks(bookmarks: Array<Bookmark>): Promise<boolean> {
        return NativeModules.PDFDocumentManager.removeBookmarks(this.getRef(), bookmarks);
    }

   /**
    * @method getBookmarks
    * @memberof PDFDocument
    * @description Used to get all bookmarks from the document.
    * @example
    * const result = await this.pdfRef.current?.getDocument().getBookmarks();
    * @returns { Promise<Array<Bookmark>> } Returns a promise containing an array of bookmarks.
    */
    getBookmarks(): Promise<Array<Bookmark>> {
        return NativeModules.PDFDocumentManager.getBookmarks(this.getRef());
    }

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
  setAnnotationFlags(uuid: string, flags: Annotation.Flags[]): Promise<boolean> {
    return NativeModules.PDFDocumentManager.setAnnotationFlags(this.getRef(), uuid, flags);
  }
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
  getAnnotationFlags(uuid: string): Promise<Annotation.Flags[]> {
    return NativeModules.PDFDocumentManager.getAnnotationFlags(this.getRef(), uuid);
  }
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
    getPageTextRects(pageIndex: number): Promise<Array<TextRect>> {
      return NativeModules.PDFDocumentManager.getPageTextRects(this.getRef(), pageIndex);
  }
}
