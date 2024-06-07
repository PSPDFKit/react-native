import {
  findNodeHandle,
  NativeModules,
  // @ts-ignore
} from 'react-native';

/**
 * @class PDFDocument
 * @description The current document object loaded in the PSPDFKitView.
 *
 */
export class PDFDocument {

  pdfViewRef: any;

   /**
    * @ignore
    */
    constructor(pdfViewRef: any) {
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
    getDocumentId(): Promise<string> {
      return NativeModules.PDFDocumentManager.getDocumentId(findNodeHandle(this.pdfViewRef));
    } 

   /**
    * @method invalidateCacheForPage
    * @memberof PDFDocument
    * @param {number} pageIndex Zero-based page index of the page to refresh.
    * @description Invalidates the rendered cache of the given pageIndex for this document.
    * Use this method if a single page of the document is not updated after a change, or changed externally, and needs to be re-rendered.
    * @example
    * const result = await this.pdfRef.current?.getDocument().invalidateCacheForPage(0);
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
    */
    invalidateCache(): Promise<boolean> {
      return NativeModules.PDFDocumentManager.invalidateCache(findNodeHandle(this.pdfViewRef));
    }
}