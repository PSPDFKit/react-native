import {
  findNodeHandle,
  NativeModules,
  UIManager,
  Platform
  // @ts-ignore
} from 'react-native';
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
import { FormField } from '../forms/FormField';
import { FormElement } from '../forms/FormElement';
import { Forms } from '../forms/Forms';
import { PDFPageInfo } from './PDFPageInfo';
import { Bookmark } from './Bookmark';

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
      return NativeModules.PDFDocumentManager.getDocumentId(findNodeHandle(this.pdfViewRef));
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
      return NativeModules.PDFDocumentManager.getPageCount(findNodeHandle(this.pdfViewRef));
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
      return NativeModules.PDFDocumentManager.isEncrypted(findNodeHandle(this.pdfViewRef));
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
      return NativeModules.PDFDocumentManager.invalidateCacheForPage(findNodeHandle(this.pdfViewRef), pageIndex);
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
      return NativeModules.PDFDocumentManager.invalidateCache(findNodeHandle(this.pdfViewRef));
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
      return NativeModules.PDFDocumentManager.save(findNodeHandle(this.pdfViewRef));
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
      return NativeModules.PDFDocumentManager.getAllUnsavedAnnotations(findNodeHandle(this.pdfViewRef));
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
      const annotations = await NativeModules.PDFDocumentManager.getAnnotations(findNodeHandle(this.pdfViewRef), type);
      
      // For backwards compatibility, return raw results if type is not an Annotation.Type value
      if (type && !Object.values(Annotation.Type).includes(type as Annotation.Type)) {
          return annotations;
      }
      
      return annotations.map((annotation: any) => {
          // Convert each annotation based on its type
          switch (annotation.type) {
              case 'pspdfkit/comment-marker':
              case 'comment-marker':
                  return new CommentMarkerAnnotation(annotation);
              case 'pspdfkit/shape/ellipse':
              case 'shape/ellipse':
              case 'ellipse':
                  return new EllipseShapeAnnotation(annotation);
              case 'pspdfkit/markup/highlight':
              case 'markup/highlight':
              case 'highlight':
                  return new HighlightMarkupAnnotation(annotation);
              case 'pspdfkit/image':
              case 'image':
                  return new ImageAnnotation(annotation);
              case 'pspdfkit/ink':
              case 'ink':
                  return new InkAnnotation(annotation);
              case 'pspdfkit/shape/line':
              case 'shape/line':
              case 'line':
                  return new LineShapeAnnotation(annotation);
              case 'pspdfkit/link':
              case 'link':
                  return new LinkAnnotation(annotation);
              case 'pspdfkit/media':
              case 'media':
                  return new MediaAnnotation(annotation);
              case 'pspdfkit/note':
              case 'note':
                  return new NoteAnnotation(annotation);
              case 'pspdfkit/shape/polygon':
              case 'shape/polygon':
              case 'polygon':
                  return new PolygonShapeAnnotation(annotation);
              case 'pspdfkit/shape/polyline':
              case 'shape/polyline':
              case 'polyline':
                  return new PolylineShapeAnnotation(annotation);
              case 'pspdfkit/shape/rectangle':
              case 'shape/rectangle':
              case 'rectangle':
                  return new RectangleShapeAnnotation(annotation);
              case 'pspdfkit/markup/redaction':
              case 'markup/redaction':
              case 'redaction':
                  return new RedactionMarkupAnnotation(annotation);
              case 'pspdfkit/markup/squiggly':
              case 'markup/squiggly':
              case 'squiggly':
                  return new SquigglyMarkupAnnotation(annotation);
              case 'pspdfkit/stamp':
              case 'stamp':
                  return new StampAnnotation(annotation);
              case 'pspdfkit/markup/strikeout':
              case 'markup/strikeout':
              case 'strikeout':
                  return new StrikeOutMarkupAnnotation(annotation);
              case 'pspdfkit/text':
              case 'text':
                  return new TextAnnotation(annotation);
              case 'pspdfkit/markup/underline':
              case 'markup/underline':
              case 'underline':
                  return new UnderlineMarkupAnnotation(annotation);
              case 'pspdfkit/widget':
              case 'widget':
                  const widgetAnnotation = new WidgetAnnotation(annotation);
                  if (annotation.formElement) {
                      widgetAnnotation.formElement = new FormElement(annotation.formElement);
                      if (annotation.formElement.formField) {
                        widgetAnnotation.formElement.formField = new FormField(annotation.formElement.formField);
                    }
                  }
                  return widgetAnnotation;
              default:
                  return undefined;
          }
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
        const annotations = await NativeModules.PDFDocumentManager.getAnnotationsForPage(findNodeHandle(this.pdfViewRef), pageIndex, type);
        
        // For backwards compatibility, return raw results if type is not an Annotation.Type value
        if (type && !Object.values(Annotation.Type).includes(type as Annotation.Type)) {
            return annotations;
        }
        
        return annotations.map((annotation: any) => {
            // Convert each annotation based on its type
            switch (annotation.type) {
                case 'pspdfkit/comment-marker':
                case 'comment-marker':
                    return new CommentMarkerAnnotation(annotation);
                case 'pspdfkit/shape/ellipse':
                case 'shape/ellipse':
                case 'ellipse':
                    return new EllipseShapeAnnotation(annotation);
                case 'pspdfkit/markup/highlight':
                case 'markup/highlight':
                case 'highlight':
                    return new HighlightMarkupAnnotation(annotation);
                case 'pspdfkit/image':
                case 'image':
                    return new ImageAnnotation(annotation);
                case 'pspdfkit/ink':
                case 'ink':
                    return new InkAnnotation(annotation);
                case 'pspdfkit/shape/line':
                case 'shape/line':
                case 'line':
                    return new LineShapeAnnotation(annotation);
                case 'pspdfkit/link':
                case 'link':
                    return new LinkAnnotation(annotation);
                case 'pspdfkit/media':
                case 'media':
                    return new MediaAnnotation(annotation);
                case 'pspdfkit/note':
                case 'note':
                    return new NoteAnnotation(annotation);
                case 'pspdfkit/shape/polygon':
                case 'shape/polygon':
                case 'polygon':
                    return new PolygonShapeAnnotation(annotation);
                case 'pspdfkit/shape/polyline':
                case 'shape/polyline':
                case 'polyline':
                    return new PolylineShapeAnnotation(annotation);
                case 'pspdfkit/shape/rectangle':
                case 'shape/rectangle':
                case 'rectangle':
                    return new RectangleShapeAnnotation(annotation);
                case 'pspdfkit/markup/redaction':
                case 'markup/redaction':
                case 'redaction':
                    return new RedactionMarkupAnnotation(annotation);
                case 'pspdfkit/markup/squiggly':
                case 'markup/squiggly':
                case 'squiggly':
                    return new SquigglyMarkupAnnotation(annotation);
                case 'pspdfkit/stamp':
                case 'stamp':
                    return new StampAnnotation(annotation);
                case 'pspdfkit/markup/strikeout':
                case 'markup/strikeout':
                case 'strikeout':
                    return new StrikeOutMarkupAnnotation(annotation);
                case 'pspdfkit/text':
                case 'text':
                    return new TextAnnotation(annotation);
                case 'pspdfkit/markup/underline':
                case 'markup/underline':
                case 'underline':
                    return new UnderlineMarkupAnnotation(annotation);
                case 'pspdfkit/widget':
                case 'widget':
                    const widgetAnnotation = new WidgetAnnotation(annotation);
                    if (annotation.formElement) {
                        widgetAnnotation.formElement = new FormElement(annotation.formElement);
                        if (annotation.formElement.formField) {
                            widgetAnnotation.formElement.formField = new FormField(annotation.formElement.formField);
                        }
                    }
                    return widgetAnnotation;
                default:
                  return undefined;
            }
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
      return NativeModules.PDFDocumentManager.removeAnnotations(findNodeHandle(this.pdfViewRef), annotations);
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
        return NativeModules.PDFDocumentManager.addAnnotations(findNodeHandle(this.pdfViewRef), annotations, attachments);
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
      return NativeModules.PDFDocumentManager.applyInstantJSON(findNodeHandle(this.pdfViewRef), documentJSON);
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
      return NativeModules.PDFDocumentManager.importXFDF(findNodeHandle(this.pdfViewRef), filePath);
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
      return NativeModules.PDFDocumentManager.exportXFDF(findNodeHandle(this.pdfViewRef), filePath);
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
        if (Platform.OS === 'android') {
            UIManager.dispatchViewManagerCommand(findNodeHandle(this.pdfViewRef),
            UIManager.getViewManagerConfig('RCTPSPDFKitView').Commands.setPageIndex,
            [pageIndex],
        );
        return Promise.resolve();
        } else if (Platform.OS === 'ios') {
            if (NativeModules.RCTPSPDFKitViewManager != null) {
                NativeModules.RCTPSPDFKitViewManager.setPageIndex(
                    pageIndex,
                    findNodeHandle(this.pdfViewRef),
                );
            } else {
                NativeModules.PSPDFKitViewManager.setPageIndex(
                pageIndex,
                findNodeHandle(this.pdfViewRef),
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
        return NativeModules.PDFDocumentManager.getPageInfo(findNodeHandle(this.pdfViewRef), pageIndex);
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
        return NativeModules.PDFDocumentManager.addBookmarks(findNodeHandle(this.pdfViewRef), bookmarks);
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
        return NativeModules.PDFDocumentManager.removeBookmarks(findNodeHandle(this.pdfViewRef), bookmarks);
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
        return NativeModules.PDFDocumentManager.getBookmarks(findNodeHandle(this.pdfViewRef));
    }
}