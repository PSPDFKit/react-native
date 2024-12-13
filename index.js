//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import PropTypes from 'prop-types';
import * as React from 'react';
import {
  findNodeHandle,
  NativeModules,
  Platform,
  requireNativeComponent,
  UIManager,
} from 'react-native';

/**
 * PSPDFKitView is a React Native component used to view PDF documents on iOS and Android.
 * @augments {React.Component<Props, *>}
 * @hideconstructor
 * @example
 * <PSPDFKitView
 *      document={DOCUMENT_PATH}
 *      configuration={{
 *        showThumbnailBar: PDFConfiguration.ShowThumbnailBar.SCROLLABLE,
 *        pageTransition: PDFConfiguration.PageTransition.SCROLL_CONTINUOUS,
 *        scrollDirection: PDFConfiguration.ScrollDirection.VERTICAL,
 *      }}
 *      ref={this.pdfRef}
 *      fragmentTag="PDF1"
 *      style={{ flex: 1 }}
 *    />
 */
class PSPDFKitView extends React.Component {
  /**
   * @ignore
   */
  _nextRequestId = 1;
  /**
   * @ignore
   */
  _requestMap = new Map();
  /**
   * @ignore
   */
  _pdfDocument = null;
  /**
   * @ignore
   */
  _notificationCenter = null;
  /**
   * @ignore
   */
  _componentRef = React.createRef(this);

  render() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const onCloseButtonPressedHandler = this.props.onCloseButtonPressed
        ? event => {
            this.props.onCloseButtonPressed(event.nativeEvent);
          }
        : null;
      return (
        <RCTPSPDFKitView
          ref={this._componentRef}
          fragmentTag="PSPDFKitView.FragmentTag"
          {...this.props}
          onCloseButtonPressed={onCloseButtonPressedHandler}
          onStateChanged={this._onStateChanged}
          onDocumentSaved={this._onDocumentSaved}
          onDocumentLoaded={this._onDocumentLoaded}
          onDocumentSaveFailed={this._onDocumentSaveFailed}
          onDocumentLoadFailed={this._onDocumentLoadFailed}
          onAnnotationTapped={this._onAnnotationTapped}
          onAnnotationsChanged={this._onAnnotationsChanged}
          onNavigationButtonClicked={this._onNavigationButtonClicked}
          onDataReturned={this._onDataReturned}
          onCustomToolbarButtonTapped={this._onCustomToolbarButtonTapped}
          onCustomAnnotationContextualMenuItemTapped={
            this._onCustomAnnotationContextualMenuItemTapped
          }
        />
      );
    } else {
      return null;
    }
  }

  /**
   * @ignore
   */
  _onStateChanged = event => {
    if (this.props.onStateChanged) {
      this.props.onStateChanged(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onDocumentLoaded = event => {
    if (this.props.onDocumentLoaded) {
      this.props.onDocumentLoaded(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onDocumentSaved = event => {
    if (this.props.onDocumentSaved) {
      this.props.onDocumentSaved(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onDocumentSaveFailed = event => {
    if (this.props.onDocumentSaveFailed) {
      this.props.onDocumentSaveFailed(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onDocumentLoadFailed = event => {
    if (this.props.onDocumentLoadFailed) {
      this.props.onDocumentLoadFailed(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onAnnotationTapped = event => {
    if (this.props.onAnnotationTapped) {
      this.props.onAnnotationTapped(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onAnnotationsChanged = event => {
    if (this.props.onAnnotationsChanged) {
      this.props.onAnnotationsChanged(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onNavigationButtonClicked = event => {
    if (this.props.onNavigationButtonClicked) {
      this.props.onNavigationButtonClicked(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onDataReturned = event => {
    let { requestId, result, error } = event.nativeEvent;
    let promise = this._requestMap[requestId];
    if (result !== undefined) {
      promise.resolve(result);
    } else {
      promise.reject(error);
    }
    this._requestMap.delete(requestId);
  };

  /**
   * @ignore
   */
  _onCustomToolbarButtonTapped = event => {
    if (this.props.onCustomToolbarButtonTapped) {
      this.props.onCustomToolbarButtonTapped(event.nativeEvent);
    }
  };

  /**
   * @ignore
   */
  _onCustomAnnotationContextualMenuItemTapped = event => {
    if (this.props.onCustomAnnotationContextualMenuItemTapped) {
      this.props.onCustomAnnotationContextualMenuItemTapped(event.nativeEvent);
    }
  };

  /**
   * Enters annotation creation mode, showing the annotation creation toolbar.
   * @method enterAnnotationCreationMode
   * @example
   * this.pdfRef.current.enterAnnotationCreationMode();
   * @memberof PSPDFKitView
   */
  enterAnnotationCreationMode = function () {
    if (Platform.OS === 'android') {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .enterAnnotationCreationMode,
        [],
      );
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.enterAnnotationCreationMode(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Exits the currently active mode, hiding all toolbars.
   * @method exitCurrentlyActiveMode
   * @example
   * this.pdfRef.current.exitCurrentlyActiveMode();
   * @memberof PSPDFKitView
   */
  exitCurrentlyActiveMode = function () {
    if (Platform.OS === 'android') {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .exitCurrentlyActiveMode,
        [],
      );
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.exitCurrentlyActiveMode(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Saves the document that’s currently open.
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().save()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.save|save()}.
   * @method saveCurrentDocument
   * @memberof PSPDFKitView
   * @example
   * const result = await this.pdfRef.current.saveCurrentDocument();
   *
   * @returns { Promise<boolean> } A promise resolving to ```true``` if the document was saved, and ```false``` if not.
   */
  saveCurrentDocument = function () {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .saveCurrentDocument,
        [requestId],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.saveCurrentDocument(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Get the current PDF document.
   * @method getDocument
   * @example
   * const document = this.pdfRef.current?.getDocument();
   * @see {@link https://pspdfkit.com/api/react-native/PDFDocument.html} for available methods.
   * @memberof PSPDFKitView
   * @returns { PDFDocument } A reference to the document that is currently loaded in the PSPDFKitView component.
   */
  getDocument () {
    if (this._pdfDocument == null) {
      this._pdfDocument = new PDFDocument(this._componentRef.current);
      return this._pdfDocument;
    } else {
      return this._pdfDocument;
    }
  };

  /**
   * Get the current Notification Center.
   * @method getNotificationCenter
   * @example
   * const document = this.pdfRef.current?.getNotificationCenter();
   * @see {@link https://pspdfkit.com/api/react-native/NotificationCenter.html} for available methods.
   * @memberof PSPDFKitView
   * @returns { NotificationCenter } A reference to the Notification Center that can be used to subscribe and unsubscribe from events.
   */
  getNotificationCenter () {
    if (this._notificationCenter == null) {
      this._notificationCenter = new NotificationCenter(this._componentRef.current);
      return this._notificationCenter;
    } else {
      return this._notificationCenter;
    }
  };

  /**
   * @method clearSelectedAnnotations
   * @memberof PSPDFKitView
   * @description Clears all currently selected Annotations.
   * @example
   * const result = await this.pdfRef.current?.clearSelectedAnnotations();
   * @returns { Promise<any> } A promise containing the result of the operation. ```true``` if the annotations selection were cleared, ```false``` otherwise.
   */
  clearSelectedAnnotations = function () {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .clearSelectedAnnotations,
        [requestId],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.clearSelectedAnnotations(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * @method selectAnnotations
   * @memberof PSPDFKitView
   * @param { object } annotations An array of the annotations to select in Instant JSON format.
   * @description Select one or more annotations.
   * @example
   * const result = await this.pdfRef.current?.selectAnnotations(annotations);
   * @returns { Promise<any> } A promise containing the result of the operation. ```true``` if the annotations were selected, ```false``` otherwise.
   */
  selectAnnotations = function (annotations) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .selectAnnotations,
        [requestId, annotations],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.selectAnnotations(
        annotations,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets all annotations of the given type from the specified page.
   *
   * @method getAnnotations
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().getAnnotations()``` or ```getAnnotationsForPage()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotations|getAnnotations()} and {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotationsForPage|getAnnotationsForPage()}.
   * @memberof PSPDFKitView
   * @param { number } pageIndex The page index to get the annotations for, starting at 0.
   * @param { string } [type] The type of annotations to get. If not specified or ```null```, all annotation types will be returned.
   * @example
   * const result = await this.pdfRef.current.getAnnotations(3, 'pspdfkit/ink');
   * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for supported types.
   *
   * @returns { Promise } A promise containing an object with an array of InstantJSON objects.
   */
  getAnnotations = function (pageIndex, type) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.getAnnotations,
        [requestId, pageIndex, type],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getAnnotations(
        pageIndex,
        type,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Adds a new annotation to the current document.
   *
   * @method addAnnotation
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().addAnnotations()``` instead.
   * @memberof PSPDFKitView
   * @param { object } annotation The InstantJSON of the annotation to add.
   * @example
   * const result = await this.pdfRef.current.addAnnotation(annotationJSON);
   * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for document JSON structure.
   *
   * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotation was added successfully, and ```false``` if an error occurred.
   */
  addAnnotation = function (annotation) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.addAnnotation,
        [requestId, annotation],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.addAnnotation(
        annotation,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Removes an existing annotation from the current document.
   *
   * @method removeAnnotation
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().removeAnnotations()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.removeAnnotations|removeAnnotations()}.
   * @memberof PSPDFKitView
   * @param { object } annotation The InstantJSON of the annotation to remove.
   * @example
   * const result = await this.pdfRef.current.removeAnnotation(instantJSON);
   *
   * @returns { Promise } A promise resolving to ```true``` if the annotation was removed successfully, and ```false``` if the annotation couldn’t be found or an error occurred.
   */
  removeAnnotation = function (annotation) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.removeAnnotation,
        [requestId, annotation],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.removeAnnotation(
        annotation,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Removes the supplied document InstantJSON from the current document.
   *
   * @method removeAnnotations
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().removeAnnotations()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.removeAnnotations|removeAnnotations()}.
   * @memberof PSPDFKitView
   * @param { object } annotation The InstantJSON of the annotations to remove.
   * @example
   * const result = await this.pdfRef.current.removeAnnotations(instantJSON);
   *
   * @returns { Promise } A promise resolving to ```true``` if the annotations were removed successfully, and ```false``` if the annotations couldn’t be found or an error occurred.
   */
  removeAnnotations = function (annotations) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;
      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .removeAnnotations,
        [requestId, annotations],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.removeAnnotations(
        annotations,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets all unsaved changes to annotations.
   *
   * @method getAllUnsavedAnnotations
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().getAllUnsavedAnnotations()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAllUnsavedAnnotations|getAllUnsavedAnnotations()}.
   * @memberof PSPDFKitView
   * @returns { Promise } A promise containing document InstantJSON.
   * @see {@link https://pspdfkit.com/guides/android/current/importing-exporting/instant-json/#instant-document-json-api-a56628} for more information.
   */
  getAllUnsavedAnnotations = function () {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .getAllUnsavedAnnotations,
        [requestId],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getAllUnsavedAnnotations(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets all annotations of the given type.
   *
   * @method getAllAnnotations
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().getAnnotations()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.getAnnotations|getAnnotations()}.
   * @memberof PSPDFKitView
   * @param { string } [type] The type of annotations to get. If not specified or ```null```, all annotation types will be returned.
   * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for supported types.
   * @example
   * const result = await this.pdfRef.current.getAllAnnotations('all');
   * // result: {'annotations' : [instantJson]}
   *
   * @returns { Promise } A promise containing an object with an array of InstantJSON objects.
   */
  getAllAnnotations = function (type) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .getAllAnnotations,
        [requestId, type],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getAllAnnotations(
        type,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Applies the supplied document InstantJSON to the current document.
   *
   * @method addAnnotations
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().addAnnotations()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.addAnnotations|addAnnotations()}.
   * @memberof PSPDFKitView
   * @param { object } annotations The document InstantJSON to apply to the current document.
   * @example
   * const result = await this.pdfRef.current.addAnnotations(annotationsJSON);
   * @see {@link https://pspdfkit.com/guides/web/json/schema/annotations/} for document JSON structure.
   *
   * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotations were added successfully, and ```false``` if an error occurred.
   */
  addAnnotations = function (annotations) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.addAnnotations,
        [requestId, annotations],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.addAnnotations(
        annotations,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the flags of the specified annotation.
   *
   * @method setAnnotationFlags
   * @memberof PSPDFKitView
   * @param { string } uuid The UUID of the annotation to update.
   * @param { Annotation.Flags[] } flags The flags to apply to the annotation.
   * @example
   * const result = await this.pdfRef.current.setAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a', ['locked', 'hidden']);
   *
   * @returns { Promise<boolean> } A promise resolving to ```true``` if the annotations were added successfully, and ```false``` if an error occurred.
   */
  setAnnotationFlags = function (uuid, flags) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .setAnnotationFlags,
        [requestId, uuid, flags],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.setAnnotationFlags(
        uuid,
        flags,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets the flags for the specified annotation.
   *
   * @method getAnnotationFlags
   * @memberof PSPDFKitView
   * @param { string } uuid The UUID of the annotation to query.
   * @example
   * const flags = await this.pdfRef.current.getAnnotationFlags('bb61b1bf-eacd-4227-a5bf-db205e591f5a');
   *
   * @returns { Promise<Annotation.Flags[]> } A promise containing the flags of the specified annotation.
   */
  getAnnotationFlags = function (uuid) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .getAnnotationFlags,
        [requestId, uuid],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getAnnotationFlags(
        uuid,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Imports the supplied XFDF file into the current document.
   *
   * @method importXFDF
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().importXFDF()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.importXFDF|importXFDF()}.
   * @memberof PSPDFKitView
   * @param { string } filePath The path to the XFDF file to import.
   * @example
   * const result = await this.pdfRef.current.importXFDF('path/to/XFDF.xfdf');
   *
   * @returns { Promise<any> } A promise containing an object with the result. ```true``` if the xfdf file was imported successfully, and ```false``` if an error occurred.
   */
  importXFDF = function (filePath) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.importXFDF,
        [requestId, filePath],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.importXFDF(
        filePath,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Exports the annotations from the current document to a XFDF file.
   *
   * @method exportXFDF
   * @deprecated Since PSPDFKit for React Native 2.12. Use ```this.pdfRef.current?.getDocument().exportXFDF()``` instead.
   * See {@link https://pspdfkit.com/api/react-native/PDFDocument.html#.exportXFDF|exportXFDF()}.
   * @memberof PSPDFKitView
   * @param { string } filePath The path where the XFDF file should be exported to.
   * @example
   * const result = await this.pdfRef.current.exportXFDF('path/to/XFDF.xfdf');
   *
   * @returns { Promise<any> } A promise containing an object with the exported file path and result. ```true``` if the xfdf file was exported successfully, and ```false``` if an error occurred.
   */
  exportXFDF = function (filePath) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.exportXFDF,
        [requestId, filePath],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.exportXFDF(
        filePath,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * @typedef FormFieldResult
   * @property { string } [formElement] The form field value
   * @property { string } [error] The error description
   */

  /**
   * Gets the form field value of the supplied form field name.
   *
   * @method getFormFieldValue
   * @memberof PSPDFKitView
   * @param { string } fullyQualifiedName The fully qualified name of the form element.
   * @example
   * const result = await this.pdfRef.current.getFormFieldValue('myFormElement');
   * // result: {'myFormElement' : value}
   * // or
   * // {'error' : 'Failed to get the form field value.'}
   *
   * @returns { Promise<FormFieldResult> } A promise containing an object with the value, or an error if the form field could not be found.
   */
  getFormFieldValue = function (fullyQualifiedName) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .getFormFieldValue,
        [requestId, fullyQualifiedName],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getFormFieldValue(
        fullyQualifiedName,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the form field value of the supplied form field name.
   *
   * @method setFormFieldValue
   * @memberof PSPDFKitView
   * @param { string } fullyQualifiedName The fully qualified name of the form element. When using form elements such as radio buttons, the individual elements can be accessed by appending the index to the fully qualified name, for example ```choiceElement.0``` and ```choiceElement.1```.
   * @param { string } value The new string value of the form element. For button form elements, pass ```selected``` or ```deselected```. For choice form elements, pass the index of the choice to select, for example ```1```.
   * @example
   * const result = await this.pdfRef.current.setFormFieldValue('Name_Last', 'Appleseed');
   *
   * @returns { Promise<boolean> } A promise resolving to ```true``` if the value was set successfully, and ```false``` if an error occurred.
   */
  setFormFieldValue = function (fullyQualifiedName, value) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .setFormFieldValue,
        [requestId, fullyQualifiedName, value],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.setFormFieldValue(
        value,
        fullyQualifiedName,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the left bar button items for the specified view mode.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   *
   * @method setLeftBarButtonItems
   * @memberof PSPDFKitView
   * @param { Array<string> } items The list of bar button items.
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
   * @param { string } [viewMode] The view mode for which the bar buttons should be set. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for all the view modes are set.
   * @param { boolean } [animated] Specifies whether changing the bar buttons should be animated.
   * @example
   * const result = await this.pdfRef.current.setLeftBarButtonItems(
   *    ['searchButtonItem', 'thumbnailsButtonItem'],
   *    'document',
   *    true);
   *
   */
  setLeftBarButtonItems = function (items, viewMode, animated) {
    if (Platform.OS === 'ios') {
      NativeModules.PSPDFKitViewManager.setLeftBarButtonItems(
        items,
        viewMode,
        animated,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets the left bar button items for the specified view mode.
   *
   * @method getLeftBarButtonItemsForViewMode
   * @memberof PSPDFKitView
   * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for the current view mode are returned.
   *
   * @returns { Promise<Array<string>> } A promise containing an array of bar button items, or an error if the items couldn’t be retrieved.
   * @example
   * const leftBarButtonItems = await this.pdfRef.current.getLeftBarButtonItemsForViewMode('document');
   * // leftBarButtonItems: ['outlineButtonItem', 'searchButtonItem']
   * // or
   * // {'error' : 'Failed to get the left bar button items.'}
   *
   */
  getLeftBarButtonItemsForViewMode = function (viewMode) {
    if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getLeftBarButtonItemsForViewMode(
        viewMode,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the right bar button items for the specified view mode.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   *
   * @method setRightBarButtonItems
   * @memberof PSPDFKitView
   * @param { Array<string> } items The list of bar button items.
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
   * @param { string } [viewMode] The view mode for which the bar buttons should be set. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for all the view modes are set.
   * @param { boolean } [animated] Specifies whether changing the bar buttons should be animated.
   * @example
   * const result = await this.pdfRef.current.setRightBarButtonItems(
   *    ['searchButtonItem', 'thumbnailsButtonItem'],
   *    'document',
   *    true);
   *
   */
  setRightBarButtonItems = function (items, viewMode, animated) {
    if (Platform.OS === 'ios') {
      NativeModules.PSPDFKitViewManager.setRightBarButtonItems(
        items,
        viewMode,
        animated,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Gets the right bar button items for the specified view mode.
   *
   * @method getRightBarButtonItemsForViewMode
   * @memberof PSPDFKitView
   * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the bar button items for the current view mode are returned.
   *
   * @returns { Promise<Array<string>> } A promise containing an array of bar button items, or an error if the items couldn’t be retrieved.
   * @example
   * const rightBarButtonItems = await this.pdfRef.current.getRightBarButtonItemsForViewMode('document');
   * // rightBarButtonItems: ['outlineButtonItem', 'searchButtonItem']
   * // or
   * // {'error' : 'Failed to get the right bar button items.'}
   *
   */
  getRightBarButtonItemsForViewMode = function (viewMode) {
    if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getRightBarButtonItemsForViewMode(
        viewMode,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the Toolbar object to customize the toolbar appearance and behaviour.
   *
   * @method setToolbar
   * @memberof PSPDFKitView
   * @param { Toolbar } toolbar The toolbar object.
   * @example
   * const toolbar = {
   *		// iOS
   *		rightBarButtonItems: {
   *		  viewMode: Toolbar.PDFViewMode.VIEW_MODE_DOCUMENT,
   *		  animated: true,
   *		  buttons: ['searchButtonItem', 'readerViewButtonItem']
   *		},
   *		// Android
   *		toolbarMenuItems: {
   *		  buttons: ['searchButtonItem', 'readerViewButtonItem']
   *	  },
   *	}
   *	this.pdfRef.current.setToolbar(toolbar);
   *
   */
  setToolbar = function (toolbar) {
    if (Platform.OS === 'ios') {
      NativeModules.PSPDFKitViewManager.setToolbar(
        toolbar,
        findNodeHandle(this._componentRef.current),
      );
    } else if (Platform.OS === 'android') {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.setToolbar,
        [toolbar],
      );
    }
  };

  /**
   * Gets the toolbar for the specified view mode.
   *
   * @method getToolbar
   * @memberof PSPDFKitView
   * @param { string } [viewMode] The view mode to query. Options are: ```document```, ```thumbnails```, ```documentEditor```, or ```null```. If ```null``` is passed, the toolbar buttons for the current view mode are returned.
   *
   * @returns { Promise<Array<string>> } A promise containing the toolbar object, or an error if it couldn’t be retrieved.
   * @example
   * const toolbar = await this.pdfRef.current.getToolbar('document');
   *
   */
  getToolbar = function (viewMode) {
    if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getToolbar(
        viewMode,
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Sets the measurement value configurations for the ```PSPDFKitView```.
   *
   * @method setMeasurementValueConfigurations
   * @memberof PSPDFKitView
   * @param { MeasurementValueConfiguration[] } configurations The array of ```MeasurementValueConfiguration``` objects that should be applied to the document.
   * @example
   * const scale: MeasurementScale = {
   *    unitFrom: Measurements.ScaleUnitFrom.INCH,
   *    valueFrom: 1.0,
   *    unitTo: Measurements.ScaleUnitTo.INCH,
   *    valueTo: 2.54
   *  };
   *
   *  const measurementValueConfig: MeasurementValueConfiguration = {
   *    name: 'Custom Scale',
   *    scale: scale,
   *    precision: Measurements.Precision.FOUR_DP
   *  };
   *
   *  const configs = [measurementValueConfig];
   *  await this.pdfRef.current?.setMeasurementValueConfigurations(configs);
   */
  setMeasurementValueConfigurations = function (configurations) {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .setMeasurementValueConfigurations,
        [requestId, configurations],
      );

      return promise;
    }

    NativeModules.PSPDFKitViewManager.setMeasurementValueConfigurations(
      configurations,
      findNodeHandle(this._componentRef.current),
    );
  };

  /**
   * Gets the current PSPDFKitView MeasurementValueConfigurations.
   *
   * @method getMeasurementValueConfigurations
   * @memberof PSPDFKitView
   *
   * @returns { Promise<MeasurementValueConfiguration[]> } A promise containing an array of ```MeasurementValueConfiguration``` objects.
   * @example
   * const configurations = await this.pdfRef.current.getMeasurementValueConfigurations();
   */
  getMeasurementValueConfigurations = function () {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .getMeasurementValueConfigurations,
        [requestId],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getMeasurementValueConfigurations(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Customizes the visible toolbar menu items for Android.
   *
   * @method setToolbarMenuItems
   * @memberof PSPDFKitView
   * @param { Array<string> } toolbarMenuItems The list of bar button items.
   * @see {@link https://pspdfkit.com/guides/react-native/user-interface/toolbars/main-toolbar/} for supported button items.
   * @example
   * const result = await this.pdfRef.current.setToolbarMenuItems(['searchButtonItem', 'readerViewButtonItem']);
   *
   */
  setToolbarMenuItems = function (toolbarMenuItems) {
    if (Platform.OS === 'android') {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands
          .setToolbarMenuItems,
        [toolbarMenuItems],
      );
    }
  };

  /**
   * Gets the current PSPDFKitView configuration.
   *
   * @method getConfiguration
   * @memberof PSPDFKitView
   *
   * @returns { Promise<PDFConfiguration> } A promise containing a ```PDFConfiguration``` object with the document configuration.
   * @example
   * const configuration = await this.pdfRef.current.getConfiguration();
   */
  getConfiguration = function () {
    if (Platform.OS === 'android') {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.getConfiguration,
        [requestId],
      );

      return promise;
    } else if (Platform.OS === 'ios') {
      return NativeModules.PSPDFKitViewManager.getConfiguration(
        findNodeHandle(this._componentRef.current),
      );
    }
  };

  /**
   * Removes the currently displayed Android Native ```PdfUiFragment```.
   * This function should only be used as a workaround for a bug in ```react-native-screen``` that causes a crash when
   * ```navigation.goBack()``` is called or a hardware back button is used to navigate back on Android. Calling this
   * function will prevent the crash by removing the fragment from the ```PdfView``` before the navigation takes place.
   *
   * @method destroyView
   * @memberof PSPDFKitView
   *
   */
  destroyView = function () {
    if (Platform.OS === 'android') {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._componentRef.current),
        this._getViewManagerConfig('RCTPSPDFKitView').Commands.removeFragment,
        [],
      );
    }
  };

  _getViewManagerConfig = viewManagerName => {
    const version = NativeModules.PlatformConstants.reactNativeVersion.minor;
    if (version >= 58) {
      return UIManager.getViewManagerConfig(viewManagerName);
    } else {
      return UIManager[viewManagerName];
    }
  };
}

if (Platform.OS === 'ios' || Platform.OS === 'android') {
  var RCTPSPDFKitView = requireNativeComponent(
    'RCTPSPDFKitView',
    PSPDFKitView,
    {
      nativeOnly: {
        testID: true,
        accessibilityComponentType: true,
        renderToHardwareTextureAndroid: true,
        accessibilityLabel: true,
        accessibilityLiveRegion: true,
        importantForAccessibility: true,
        onLayout: true,
        nativeID: true,
      },
    },
  );
  module.exports = PSPDFKitView;
}

/**
 * @ignore
 * @typedef {object} Props
 * @property {string} document The path to the PDF file that should be displayed.
 * @property {PDFConfiguration} [configuration] Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options.
 * @property {Toolbar} [toolbar] Toolbar object to customize the toolbar appearance and behaviour.
 * @property {AnnotationContextualMenu} [annotationContextualMenu] Object to customize the menu shown when selecting an annotation.
 * @property {number} [pageIndex] Page index of the document that will be shown. Starts at 0.
 * @property {boolean} [hideNavigationBar] Controls whether a navigation bar is created and shown or not. Navigation bar is shown by default (```false```).
 * @property {boolean} [showCloseButton] Specifies whether the close button should be shown in the navigation bar. Disabled by default (```false```). Only applies when the ```PSPDFKitView``` is presented modally. Will call ```onCloseButtonPressed``` when tapped if a callback was provided. If ```onCloseButtonPressed``` wasn’t provided, ```PSPDFKitView``` will automatically be dismissed when modally presented.
 * @property {boolean} [disableDefaultActionForTappedAnnotations] Controls whether or not the default action for tapped annotations is processed. Defaults to processing the action (```false```).
 * @property {boolean} [disableAutomaticSaving] Controls whether or not the document will automatically be saved. Defaults to automatically saving (```false```).
 * @property {string} [annotationAuthorName] Controls the author name that’s set for new annotations. If not set and the user hasn’t specified it before, the user will be asked and the result will be saved. The value set here will be persisted and the user won’t be asked, even if this isn’t set the next time.
 * @property {string} [imageSaveMode] Specifies what is written back to the original image URL when the receiver is saved. If this property is ```flattenAndEmbed```, then this allows for changes made to the image to be saved as metadata in the original file. If the same file is reopened, all previous changes made will remain editable. If this property is ```flatten```, the changes are simply written to the image, and will not be editable when reopened. Available options are: ```flatten``` or ```flattenAndEmbed```.
 * @property {function} [onCloseButtonPressed] Callback that’s called when the user tapped the close button. If you provide this function, you need to handle dismissal yourself. If you don't provide this function, ```PSPDFKitView``` will be automatically dismissed. Only applies when the ```PSPDFKitView``` is presented modally.
 * @property {function} [onDocumentLoaded] Callback that’s called when the document is loaded in the ```PSPDFKitView```.
 * @property {function} [onDocumentLoadFailed] Callback that’s called when the document failed to load.
 * @property {function} [onDocumentSaved] Callback that’s called when the document is saved.
 * @property {function} [onDocumentSaveFailed] Callback that’s called when the document fails to save.
 * @property {function} [onAnnotationTapped] Callback that’s called when an annotation is tapped.
 * @property {function} [onAnnotationsChanged] Callback that’s called when an annotation is added, changed, or removed.
 * @property {function} [onStateChanged] Callback that’s called when the state of the ```PSPDFKitView``` changes.
 * @property {function} [onCustomToolbarButtonTapped] Callback that’s called when a custom toolbar button is tapped.
 * @property {function} [onCustomAnnotationContextualMenuItemTapped] Callback that’s called when a custom annotation menu item is tapped.
 * @property {string} [fragmentTag] The tag used to identify a single PdfFragment in the view hierarchy. This needs to be unique in the view hierarchy.
 * @property {Array} [menuItemGrouping] Used to specify a custom grouping for the menu items in the annotation creation toolbar.
 * @property {Array<string>} [leftBarButtonItems] Sets the left bar button items. Note: The same button item cannot be added to both the left and right bar button items simultaneously. See {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
 * @property {Array<string>} [rightBarButtonItems] Sets the right bar button items. Note: The same button item cannot be added to both the left and right bar button items simultaneously. See {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
 * @property {string} [toolbarTitle] Used to specify a custom toolbar title on iOS by setting the ```title``` property of the ```PSPDFViewController```. Note: You need to set ```documentLabelEnabled```, ```useParentNavigationBar```, and ```allowToolbarTitleChange``` to ```false``` in your configuration before setting the custom title.
 * @property {Array<string>} [toolbarMenuItems] Used to customize the toolbar menu items for Android. See {@link https://github.com/PSPDFKit/react-native/blob/master/android/src/main/java/com/pspdfkit/react/ToolbarMenuItemsAdapter.java} for supported toolbar menu items.
 * @property {boolean} [showNavigationButtonInToolbar] When set to ```true```, the toolbar integrated into the ```PSPDFKitView``` will display a back button in the top-left corner.
 * @property {function} [onNavigationButtonClicked] If ```showNavigationButtonInToolbar``` is set to ```true```, this callback will notify you when the back button is tapped.
 * @property {Array<string>} [availableFontNames] Used to specify the available font names in the font picker. Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
 * @property {string} [selectedFontName] Used to specify the current selected font in the font picker. Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
 * @property {boolean} [showDownloadableFonts] Used to show or hide the downloadable fonts section in the font picker. Defaults to ```true```, showing the downloadable fonts. See {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information. See {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
 * @property {AnnotationPresetConfiguration} [annotationPresets] The annotation preset configuration. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.AnnotationPresetConfiguration} for available options.
 * @property {boolean} [hideDefaultToolbar] Used to show or hide the main toolbar on Android.
 * @property {any} [style] Used to style the React Native component.
 *
 * @extends {Component<Props>}
 */

PSPDFKitView.propTypes = {
  /**
   * The path to the PDF file that should be displayed.
   * @type {string}
   * @memberof PSPDFKitView
   */
  document: PropTypes.string.isRequired,
  /**
   * Configuration object to customize the appearance and behavior of PSPDFKit.
   * @type {PDFConfiguration}
   * @memberof PSPDFKitView
   * @see {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options.
   * Note: On iOS, set the ```useParentNavigationBar``` configuration option to ```true``` if you're using a navigation plugin such as
   * ```NavigatorIOS``` or ```react-native-navigation```. This is because the plugin will manage the navigation bar.
   */
  configuration: PropTypes.object,
  /**
   * Toolbar object to customize the toolbar appearance and behaviour.
   * @type {Toolbar}
   * @memberof PSPDFKitView
   */
  toolbar: PropTypes.object,
  /**
   * Object to customize the menu shown when selecting an annotation.
   * @type {AnnotationContextualMenu}
   * @memberof PSPDFKitView
   */
  annotationContextualMenu: PropTypes.object,
  /**
   * Page index of the document that will be shown. Starts at 0.
   * @type {number}
   * @memberof PSPDFKitView
   */
  pageIndex: PropTypes.number,
  /**
   * Controls whether a navigation bar is created and shown or not. Navigation bar is shown by default (```false```).
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  hideNavigationBar: PropTypes.bool,
  /**
   * Specifies whether the close button should be shown in the navigation bar. Disabled by default (```false```).
   * Only applies when the ```PSPDFKitView``` is presented modally.
   * Will call ```onCloseButtonPressed``` when tapped if a callback was provided.
   * If ```onCloseButtonPressed``` wasn’t provided, ```PSPDFKitView``` will automatically be dismissed when modally presented.
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  showCloseButton: PropTypes.bool,
  /**
   * Controls whether or not the default action for tapped annotations is processed. Defaults to processing the action (```false```).
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  disableDefaultActionForTappedAnnotations: PropTypes.bool,
  /**
   * Controls whether or not the document will automatically be saved. Defaults to automatically saving (```false```).
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  disableAutomaticSaving: PropTypes.bool,
  /**
   * Controls the author name that’s set for new annotations.
   * If not set and the user hasn’t specified it before, the user will be asked and the result will be saved.
   * The value set here will be persisted and the user won’t be asked, even if this isn’t set the next time.
   * @type {string}
   * @memberof PSPDFKitView
   */
  annotationAuthorName: PropTypes.string,
  /**
   * Specifies what is written back to the original image URL when the receiver is saved.
   * If this property is ```flattenAndEmbed```, then this allows for changes made to the image to be saved as metadata in the original file.
   * If the same file is reopened, all previous changes made will remain editable.
   * If this property is ```flatten```, the changes are simply written to the image, and will not be editable when reopened.
   * Available options are: ```flatten``` or ```flattenAndEmbed```.
   * @type {string}
   * @memberof PSPDFKitView
   */
  imageSaveMode: PropTypes.string,
  /**
   * Callback that’s called when the user tapped the close button.
   * If you provide this function, you need to handle dismissal yourself.
   * If you don't provide this function, ```PSPDFKitView``` will be automatically dismissed.
   * Only applies when the ```PSPDFKitView``` is presented modally.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onCloseButtonPressed={() => {
   *     // Optionally perform operations and close the modal window.
   * }}
   */
  onCloseButtonPressed: PropTypes.func,
  /**
   * Callback that’s called when the document is loaded in the ```PSPDFKitView```.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onDocumentLoaded={() => {
   *     // Document loaded event.
   * }}
   */
  onDocumentLoaded: PropTypes.func,
  /**
   * Callback that’s called when the document failed to load.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onDocumentLoadFailed={() => {
   *     // Document load failed event.
   * }}
   */
  onDocumentLoadFailed: PropTypes.func,
  /**
   * Callback that’s called when the document is saved.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onDocumentSaved={() => {
   *     // Document saved event.
   * }}
   */
  onDocumentSaved: PropTypes.func,
  /**
   * Callback that’s called when the document fails to save.
   * @returns { object } An object containing the error message.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onDocumentSaveFailed={result => {
   *    alert('Document Save Failed: ' + JSON.stringify(result));
   *    // { error: "Error message" }
   * }}
   */
  onDocumentSaveFailed: PropTypes.func,
  /**
   * Callback that’s called when an annotation is tapped. The result contains the InstantJSON of the annotation that was tapped.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onAnnotationTapped={result => {
   *     if (result.error) {
   *         alert(result.error);
   *     } else {
   *         alert('Tapped on Annotation: ' + JSON.stringify(result));
   *     }
   * }}
   */
  onAnnotationTapped: PropTypes.func,
  /**
   * Callback that’s called when an annotation is added, changed, or removed.
   * The result contains the type of change, as well as an array of the InstantJSON annotations.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onAnnotationsChanged={result => {
   *     if (result.error) {
   *         alert(result.error);
   *     } else {
   *         alert('Annotations ' + result.change + ': ' + JSON.stringify(result.annotations));
   *     }
   *  }}
   */
  onAnnotationsChanged: PropTypes.func,
  /**
   * Callback that’s called when the state of the ```PSPDFKitView``` changes.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onStateChanged={result => {
   *     if (result.error) {
   *         alert(result.error);
   *     } else {
   *         alert('Document State Changed: ' + JSON.stringify(result));
   *         // {"currentPageIndex":0,
   *         //  "textSelectionActive":false,
   *         //  "affectedPageIndex":0,
   *         //  "target":1013,
   *         //  "pageCount":21,
   *         //  "formEditingActive":false,
   *         //  "annotationCreationActive":false,
   *         //  "annotationEditingActive":false,
   *         //  "documentLoaded":true}
   *     }
   *  }}
   */
  onStateChanged: PropTypes.func,
  /**
   * Callback that’s called when a custom toolbar button is tapped.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onCustomToolbarButtonTapped={result => {
   *     if (result.error) {
   *         alert(result.error);
   *     } else {
   *         alert('Custom bar button item tapped: ' + JSON.stringify(result));
   *     }
   *  }}
   */
  onCustomToolbarButtonTapped: PropTypes.func,
  /**
   * Callback that’s called when a custom annotation menu item is tapped.
   * @type {function}
   * @memberof PSPDFKitView
   * @example
   * onCustomAnnotationContextualMenuItemTapped={result => {
   *     if (result.error) {
   *         alert(result.error);
   *     } else {
   *         alert('Custom annotation contextual menu item tapped: ' + JSON.stringify(result));
   *     }
   *  }}
   */
  onCustomAnnotationContextualMenuItemTapped: PropTypes.func,
  /**
   * The tag used to identify a single ```PdfFragment``` in the view hierarchy.
   * This needs to be unique in the view hierarchy.
   * @type {string}
   * @memberof PSPDFKitView
   */
  fragmentTag: PropTypes.string,
  /**
   * On iOS, you can specify a custom grouping for the annotation creation toolbar items.
   * @type {Array}
   * @memberof PSPDFKitView
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+PSPDFAnnotationToolbarConfiguration.m} for the complete list of toolbar items.
   * @example
   * menuItemGrouping={[
   *   'pen',
   *   'freetext',
   *   { key: 'markup', items: ['highlight', 'underline'] },
   *   'image',
   * ]}
   */
  menuItemGrouping: PropTypes.array,
  /**
   * Sets the left bar button items.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   * @type {Array<string>}
   * @memberof PSPDFKitView
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
   */
  leftBarButtonItems: PropTypes.array,
  /**
   * Sets the right bar button items.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   * @type {Array<string>}
   * @memberof PSPDFKitView
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/ios/RCTPSPDFKit/Converters/RCTConvert+UIBarButtonItem.m} for supported button items.
   */
  rightBarButtonItems: PropTypes.array,
  /**
   * Used to specify a custom toolbar title on iOS by setting the ```title``` property of the ```PSPDFViewController```.
   * Note: You need to set ```documentLabelEnabled```, ```useParentNavigationBar```, and ```allowToolbarTitleChange``` to ```false``` in your configuration before setting the custom title.
   * @type {string}
   * @memberof PSPDFKitView
   */
  toolbarTitle: PropTypes.string,
  /**
   * Used to customize the toolbar menu items for Android.
   * @type {Array<string>}
   * @memberof PSPDFKitView
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/android/src/main/java/com/pspdfkit/react/ToolbarMenuItemsAdapter.java} for supported toolbar menu items.
   */
  toolbarMenuItems: PropTypes.array,
  /**
   * When set to ```true```, the toolbar integrated into the ```PSPDFKitView``` will display a back button in the top-left corner.
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  showNavigationButtonInToolbar: PropTypes.bool,
  /**
   * If ```showNavigationButtonInToolbar``` is set to ```true```, this callback will notify you when the back button is tapped.
   * @type {function}
   * @memberof PSPDFKitView
   */
  onNavigationButtonClicked: PropTypes.func,
  /**
   * Used to specify the available font names in the font picker.
   * Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```.
   * @type {Array<string>}
   * @memberof PSPDFKitView
   * @see {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information.
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
   */
  availableFontNames: PropTypes.array,
  /**
   * Used to specify the current selected font in the font picker.
   * Note on iOS: You need to set the desired font family names as ```UIFontDescriptor```.
   * @type {string}
   * @memberof PSPDFKitView
   * @see {@link https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc} for more information.
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
   *
   * Note on Android: This is the default font that’s selected. If the user changes the font, it’ll become the new default.
   */
  selectedFontName: PropTypes.string,
  /**
   * Used to show or hide the downloadable fonts section in the font picker.
   * Defaults to ```true```, showing the downloadable fonts.
   * @type {boolean}
   * @memberof PSPDFKitView
   * @see {@link https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/examples/CustomFontPicker.tsx}
   */
  showDownloadableFonts: PropTypes.bool,
  /**
   * Used to style the React Native component.
   * @type {any}
   * @memberof PSPDFKitView
   */
  style: PropTypes.any,
  /**
   * The annotation preset configuration.
   * @type {AnnotationPresetConfiguration}
   * @memberof PSPDFKitView
   * @see {@link https://pspdfkit.com/api/react-native/Annotation.html#.AnnotationPresetConfiguration} for available options.
   * @example
   * annotationPresets={{
   *   inkPen: {
   *     defaultThickness: 50,
   *     minimumThickness: 1,
   *     maximumThickness: 60,
   *     defaultColor: '#99cc00',
   *   },
   *   freeText: {
   *     defaultTextSize: 20,
   *     defaultColor: '#FF0000',
   *   },
   * }}
   */
  annotationPresets: PropTypes.object,
  /**
   * Used to show or hide the main toolbar on Android.
   * Defaults to ```true```, showing the toolbar.
   * @type {boolean}
   * @memberof PSPDFKitView
   */
  hideDefaultToolbar: PropTypes.bool,
};

export default PSPDFKitView;

/**
 * @typedef InstantDocumentData
 * @property { string } jwt The JWT received as part of the web response.
 * @property { string } serverUrl The server URL received as part of the web response.
 */

/**
 * @typedef InstantConfiguration
 * @property { boolean } enableInstantComments Specifies whether adding comment annotations is allowed.
 * @property { boolean } listenToServerChanges Automatically listen for and sync changes from the server.
 * @property { number } delay Delay in seconds before kicking off automatic sync after local changes are made to the ```editableDocument```’s annotations.
 * @property { boolean } syncAnnotations Specifies whether added annotations are automatically synced to the server.
 */

/**
 * PSPDFKit is a React Native {@link https://reactnative.dev/docs/native-modules-intro|Native Module} implementation used to call iOS and Android methods directly.
 * @hideconstructor
 * @example
 * const PSPDFKit = NativeModules.PSPDFKit;
 */
export class PSPDFKit {
  /**
   * Used to get the current version of the underlying PSPDFKit SDK.
   * @member versionString
   * @memberof PSPDFKit
   * @type { string }
   * @example
   * const version = PSPDFKit.versionString
   */
  versionString;

  /**
   * Used to set your PSPDFKit license key for the active platform only, either iOS or Android.
   * PSPDFKit is commercial software.
   * Each PSPDFKit license is bound to a specific app bundle ID.
   * Visit {@link https://customers.pspdfkit.com} to get your demo or commercial license key.
   * @method setLicenseKey
   * @memberof PSPDFKit
   * @param { string | null } [key] Your PSPDFKit for React Native iOS or PSPDFKit for React Native Android license key.
   * @returns { Promise<boolean> } A promise returning ```true``` if the license key was set, and ```false``` if not.
   * @example
   * PSPDFKit.setLicenseKey('YOUR_LICENSE_KEY');
   */
  setLicenseKey = function (key) {};

  /**
   * Used to set the your PSPDFKit license keys for both platforms.
   * PSPDFKit is commercial software.
   * Each PSPDFKit license is bound to a specific app bundle ID.
   * Visit {@link https://customers.pspdfkit.com} to get your demo or commercial license key.
   * @method setLicenseKeys
   * @memberof PSPDFKit
   * @param { string | null } [androidKey] Your PSPDFKit for React Native Android license key.
   * @param { string | null } [iosKey] Your PSPDFKit for React Native iOS license key.
   * @returns { Promise<boolean> } A promise returning ```true``` if the license keys were set, and ```false``` if not.
   * @example
   * PSPDFKit.setLicenseKeys('YOUR_ANDROID_LICENSE_KEY', 'YOUR_IOS_LICENSE_KEY');
   */
  setLicenseKeys = function (androidKey, iosKey) {};

  /**
   * Used to present a PDF document.
   * @method present
   * @memberof PSPDFKit
   * @param { string } documentPath The path to the PDF document to be presented.
   * @param { PDFConfiguration } configuration Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options.
   * @returns { Promise<boolean> } A promise returning ```true``` if the document was successfully presented, and ```false``` if not.
   * @example
   * const fileName = 'document.pdf';
   * const exampleDocumentPath =
   * Platform.OS === 'ios' ? 'PDFs/' + fileName
   * : 'file:///android_asset/' + fileName;
   *
   * const configuration: PDFConfiguration = {
   *    pageMode: PDFConfiguration.PageMode.AUTOMATIC,
   *    scrollDirection: PDFConfiguration.ScrollDirection.HORIZONTAL,
   *    enableAnnotationEditing: PDFConfiguration.BooleanType.TRUE,
   *    pageTransition: PDFConfiguration.PageTransition.SCROLL_CONTINUOUS
   * };
   *
   * PSPDFKit.present(exampleDocumentPath, configuration);
   */
  present = function (documentPath, configuration) {};

  /**
   * Used to dismiss the ```PSPDFKitView```.
   * @method dismiss
   * @memberof PSPDFKit
   * @returns { Promise<boolean> } A promise returning ```true``` if the view was successfully dismissed, and ```false``` if not.
   * @example
   * PSPDFKit.dismiss();
   */
  dismiss = function () {};

  /**
   * Used to set the current page of the document. Starts at 0.
   * @method setPageIndex
   * @memberof PSPDFKit
   * @param { number } pageIndex The page to transition to.
   * @param { boolean } animated ```true``` if the transition should be animated, and ```false``` otherwise.
   * @returns { Promise<boolean> } A promise returning ```true``` if the page was successfully set, and ```false``` if not.
   * @example
   * PSPDFKit.setPageIndex(3, false);
   */
  setPageIndex = function (pageIndex, animated) {};

  /**
   * Used to create a new document with processed annotations, allowing a password to unlock the source document.
   * @method processAnnotations
   * @memberof PSPDFKit
   * @param { Annotation.Change } annotationChange Specifies how an annotation should be included in the resulting document. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.Change} for supported options.
   * @param { Array<Annotation.Type> } annotationTypes Specifies the annotation types that should be flattened. See {@link https://pspdfkit.com/api/react-native/Annotation.html#.Type} for supported types. Use ```Annotation.Type.ALL``` to include all annotation types.
   * @param { string } sourceDocumentPath The source document to use as input.
   * @param { string } processedDocumentPath The path where the output document should be written to.
   * @param { string | null } [password] The password to unlock the source document, if required.
   * @returns { Promise<boolean> } A promise returning ```true``` if the document annotations were successfully flattened, and ```false``` if not.
   * @example
   * const result = await PSPDFKit.processAnnotations(
   *                      'flatten',
   *                      'all',
   *                      sourceDocumentPath,
   *                      processedDocumentPath,
   *                      password);
   */
  processAnnotations = function (
    annotationChange,
    annotationTypes,
    sourceDocumentPath,
    processedDocumentPath,
    password,
  ) {};

  /**
   * Used to present an Instant PDF document for collaboration.
   * @method presentInstant
   * @memberof PSPDFKit
   * @param { InstantDocumentData } documentData The Instant document data received entirely from the web response.
   * @param { PDFConfiguration } configuration Configuration object to customize the appearance and behavior of PSPDFKit. See {@link https://pspdfkit.com/api/react-native/PDFConfiguration.html} for available options. Also see {@link InstantConfiguration} for additional Instant configuration options.
   * @returns { Promise<boolean> } A promise returning ```true``` if the document was successfully presented, and ```false``` if not.
   * @see {@link https://github.com/PSPDFKit/react-native/blob/5b2716a3f3cd3732c0e5845cc39e28d19b618aa4/samples/Catalog/examples/InstantSynchronization.js#L85C7-L85C7} for an example implementation.
   * @example
   * // Data received from your backend service.
   * const serverResult = await fetch('your-backend-server-url');
   * const documentData = {
   *     jwt: serverResult.jwt,
   *     serverUrl: Constants.InstantServerURL
   * };
   * const configuration: PDFConfiguration = {
   *    enableInstantComments: PDFConfiguration.BooleanType.FALSE,
   *    listenToServerChanges: PDFConfiguration.BooleanType.TRUE,
   *    delay: 1,
   *    syncAnnotations: PDFConfiguration.BooleanType.TRUE,
   * };
   *
   * PSPDFKit.presentInstant(documentData, configuration);
   */
  presentInstant = function (documentData, configuration) {};

  /**
   * Delay in seconds before kicking off automatic sync after local changes are made to the ```editableDocument```’s annotations.
   * @method setDelayForSyncingLocalChanges
   * @memberof PSPDFKit
   * @param { number } delay The delay in seconds.
   */
  setDelayForSyncingLocalChanges = function (delay) {};

  /**
   * Automatically listen for and sync changes from the server.
   * @method setListenToServerChanges
   * @memberof PSPDFKit
   * @param { boolean } listenToServerChanges ```true``` if server changes should be synced automatically, and false ```false``` otherwise.
   */
  setListenToServerChanges = function (listenToServerChanges) {};

  /**
   * Method used by React Native Native Modules
   * @ignore
   */
  addListener = function (eventName) {};

  /**
   * Method used by React Native Native Modules
   * @ignore
   */
  removeListeners = function () {};
}

/**
 * @typedef BlankPDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { number } width The width of the new document.
 * @property { number } height The height of the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */

/**
 * @typedef PDFTemplatePageSize
 * @property { number } width The width of the page.
 * @property { number } height The height of the page.
 */

/**
 * @typedef PDFTemplatePageMargins
 * @property { number } top The top margin.
 * @property { number } left The left margin.
 * @property { number } right The right margin.
 * @property { number } bottom The bottom margin.
 */

/**
 * @typedef PDFTemplate
 * @property { PDFTemplatePageSize } pageSize The size of the page.
 * @property { string } [backgroundColor] The background color of the page. Can be either a rgba string, for example: rgba(0.871, 0.188, 0.643, 0.5), or standard colors such as ```blue``` or ```yellow```.
 * @property { string } [template] Which template to use. Options are: ```blank```, ```dot5mm```, ```grid5mm```, ```lines5mm``` and ```lines7mm```.
 * @property { number } [rotation] The page rotation, in degrees.
 * @property { PDFTemplatePageMargins } [pageMargins] The page margins.
 */

/**
 * @typedef TemplatePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFTemplate> } templates An array of the templates that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */

/**
 * @typedef PDFImage
 * @property { string } imageUri The URI to the image file.
 * @property { string } [position] The image position on the PDF page. Options are: ```top```, ```bottom```, ```left```, ```right```, ```center```.
 * @property { number } [rotation] The page rotation, in degrees.
 * @property { PDFTemplatePageMargins } [pageMargins] The page margins.
 */

/**
 * @typedef ImagePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFImage> } images An array of the images that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */

/**
 * @typedef PDFDocumentConfiguration
 * @property { string } documentPath The URI to the existing document.
 * @property { number } pageIndex The index of the page that should be used from the document. Starts at 0.
 */

/**
 * @typedef DocumentPDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { Array<PDFDocumentConfiguration> } documents An array of the documents that should be used to construct the new document.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */

/**
 * @typedef GeneratePDFConfiguration
 * @property { string } [name] The name of the new document.
 * @property { string } [filePath] The directory where the new document should be stored.
 * @property { boolean } override If ```true```, will override existing document with the same name.
 */

/**
 * @typedef GeneratePDFResult
 * @property { string } fileURL The path on the filesystem where the new document is stored.
 */

/**
 * Processor is a React Native {@link https://reactnative.dev/docs/native-modules-intro|Native Module} implementation used to call iOS and Android methods directly.
 * @hideconstructor
 * @example
 * const Processor = NativeModules.RNProcessor;
 */
export class Processor {
  /**
   * Used to generate a new blank PDF document.
   * @method generateBlankPDF
   * @memberof Processor
   * @param { BlankPDFConfiguration } configuration The configuration to generate a new blank PDF document.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * const configuration = {
   *    name: 'newDocument.pdf',
   *    width: 595,
   *    height: 842,
   *    override: true,
   *  };
   * const { fileURL } = await Processor.generateBlankPDF(configuration);
   */
  generateBlankPDF = function (configuration) {};

  /**
   * Used to generate a new PDF document from an HTML string.
   * @method generatePDFFromHtmlString
   * @memberof Processor
   * @param { GeneratePDFConfiguration } configuration The configuration to generate a new PDF document.
   * @param { string } html The HTML string from which the document should be generated.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * const fileName = 'newDocument.pdf';
   * const { tempDir } = await Processor.getTemporaryDirectory();
   * const documentPath = `${tempDir}/${fileName}`;
   *
   * const htmlString = `<html lang="en"><head></head><body><h1>PDF generated from HTML</h1></body></html>`;
   * const configuration = {
   *    filePath: documentPath,
   *    override: true,
   *  };
   * const { fileURL } = await Processor.generatePDFFromHtmlString(configuration, htmlString);
   */
  generatePDFFromHtmlString = function (configuration, html) {};

  /**
   * Used to generate a new PDF document from an HTML URL.
   * @method generatePDFFromHtmlURL
   * @memberof Processor
   * @param { GeneratePDFConfiguration } configuration The configuration to generate a new PDF document.
   * @param { string } url The origin URL from which the document should be generated.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * const fileName = 'newDocument.pdf';
   * const { tempDir } = await Processor.getTemporaryDirectory();
   * const documentPath = `${tempDir}/${fileName}`;

   * const url = `https://www.pspdfkit.com`;
   * const configuration = {
   *    documentPath: documentPath,
   *    override: true,
   *  };
   * const { fileURL } = await Processor.generatePDFFromHtmlURL(configuration, url);
   */
  generatePDFFromHtmlURL = function (configuration, url) {};

  /**
   * Used to generate a new PDF document from a template.
   * @method generatePDFFromTemplate
   * @memberof Processor
   * @param { TemplatePDFConfiguration } configuration The configuration to generate a new PDF document.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * const configuration = {
   *    filePath: fileURL,
   *    override: true,
   *     templates: [
   *       {
   *         pageSize: { width: 540, height: 846 },
   *         backgroundColor: 'rgba(0.871, 0.188, 0.643, 0.5)',
   *         template: 'lines7mm',
   *         rotation: 90,
   *         pageMargins: { top: 10, left: 10, right: 10, bottom: 10 },
   *       },
   *       {
   *         pageSize: { width: 540, height: 846 },
   *         backgroundColor: 'yellow',
   *         template: 'dot5mm',
   *       },
   *     ],
   *   };
   * const { fileURL } = await Processor.generatePDFFromTemplate(configuration);
   */
  generatePDFFromTemplate = function (configuration) {};

  /**
   * Used to generate a new PDF document from images.
   * @method generatePDFFromImages
   * @memberof Processor
   * @param { ImagePDFConfiguration } configuration The configuration to generate a new PDF document.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * export const exampleImage = 'PSPDFKit_Image_Example.jpg';
   * export const exampleImagePath =
   * Platform.OS === 'ios' ? 'PDFs/' + exampleImage : 'file:///android_asset/' + exampleImage;
   *
   * // Helper method to get iOS bundlePath
   * let globalPath = getMainBundlePath(exampleImagePath.toString());
   * const configuration = {
   *     name: 'newDocument.pdf',
   *     images: [
   *       {
   *         imageUri: Platform.OS === 'ios' ? globalPath : exampleImagePath,
   *         position: 'center',
   *       },
   *     ],
   *     override: true,
   *   };
   * const { fileURL } = await Processor.generatePDFFromImages(configuration);
   */
  generatePDFFromImages = function (configuration) {};

  /**
   * Used to generate a new PDF document from existing PDF documents.
   * @method generatePDFFromDocuments
   * @memberof Processor
   * @param { DocumentPDFConfiguration } configuration The configuration to generate a new PDF document.
   * @returns { Promise<GeneratePDFResult> } A promise containing the path to the newly generated document.
   * @example
   * const fileName = 'newDocument.pdf';
   * const { tempDir } = await Processor.getTemporaryDirectory();
   * const documentPath = `${tempDir}/${fileName}`;
   *
   * const exampleDocument = 'PSPDFKit_Image_Example.jpg';
   * const exampleDocumentPath =
   * Platform.OS === 'ios' ? 'PDFs/' + exampleImage : 'file:///android_asset/' + exampleDocument;
   *
   * // Helper method to get iOS bundlePath
   * let globalPath = getMainBundlePath(exampleDocumentPath.toString());
   *
   * const configuration = {
   *     filePath: documentPath,
   *     name: fileName,
   *     documents: [
   *       {
   *         documentPath:
   *           Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
   *         pageIndex: 5,
   *       },
   *       {
   *         documentPath:
   *           Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
   *         pageIndex: 8,
   *       },
   *     ],
   *     override: true,
   *   };
   * const { fileURL } = await Processor.generatePDFFromDocuments(configuration);
   */
  generatePDFFromDocuments = function (configuration) {};

  /**
   * A helper method to get a temporary directory where the document can be written to.
   * @method getTemporaryDirectory
   * @memberof Processor
   * @returns { Promise<any> } A promise containing the path to the temporary directory that can be used for output.
   * @example
   * const { fileURL } = await Processor.getTemporaryDirectory();
   */
  getTemporaryDirectory = function () {};
}

import { PDFConfiguration } from './lib/configuration/PDFConfiguration';
export { PDFConfiguration } from './lib/configuration/PDFConfiguration';

import { RemoteDocumentConfiguration } from './lib/configuration/PDFConfiguration';
export { RemoteDocumentConfiguration } from './lib/configuration/PDFConfiguration';

import { Toolbar } from './lib/toolbar/Toolbar';
export { Toolbar } from './lib/toolbar/Toolbar';

import { Measurements } from './lib/measurements/Measurements';
export { Measurements } from './lib/measurements/Measurements';

import { MeasurementScale } from './lib/measurements/Measurements';
export { MeasurementScale } from './lib/measurements/Measurements';

import { MeasurementValueConfiguration } from './lib/measurements/Measurements';
export { MeasurementValueConfiguration } from './lib/measurements/Measurements';

import { Annotation } from './lib/annotations/Annotation';
export { Annotation } from './lib/annotations/Annotation';

import { AnnotationContextualMenu } from './lib/annotations/Annotation';
export { AnnotationContextualMenu } from './lib/annotations/Annotation';

import { AnnotationContextualMenuItem } from './lib/annotations/Annotation';
export { AnnotationContextualMenuItem } from './lib/annotations/Annotation';

import { AnnotationPresetConfiguration } from './lib/annotations/Annotation';
export { AnnotationPresetConfiguration } from './lib/annotations/Annotation';

import {
  AnnotationPresetEraser,
  AnnotationPresetFile,
  AnnotationPresetFreeText,
  AnnotationPresetInk,
  AnnotationPresetLine,
  AnnotationPresetMarkup,
  AnnotationPresetMeasurementArea,
  AnnotationPresetMeasurementDistance,
  AnnotationPresetMeasurementPerimeter,
  AnnotationPresetNote,
  AnnotationPresetRedact,
  AnnotationPresetShape,
  AnnotationPresetSound,
  AnnotationPresetStamp,
} from './lib/annotations/Annotation';
export {
  AnnotationPresetInk,
  AnnotationPresetFreeText,
  AnnotationPresetStamp,
  AnnotationPresetNote,
  AnnotationPresetMarkup,
  AnnotationPresetShape,
  AnnotationPresetLine,
  AnnotationPresetEraser,
  AnnotationPresetFile,
  AnnotationPresetSound,
  AnnotationPresetRedact,
  AnnotationPresetMeasurementArea,
  AnnotationPresetMeasurementPerimeter,
  AnnotationPresetMeasurementDistance,
} from './lib/annotations/Annotation';

import { PDFDocument } from './lib/document/PDFDocument';
export { PDFDocument } from './lib/document/PDFDocument';

import { NotificationCenter } from './lib/notification-center/NotificationCenter';
export { NotificationCenter } from './lib/notification-center/NotificationCenter';

module.exports.PDFConfiguration = PDFConfiguration;
module.exports.RemoteDocumentConfiguration = RemoteDocumentConfiguration;
module.exports.Toolbar = Toolbar;
module.exports.Measurements = Measurements;
module.exports.MeasurementScale = MeasurementScale;
module.exports.MeasurementValueConfiguration = MeasurementValueConfiguration;
module.exports.Annotation = Annotation;
module.exports.AnnotationContextualMenu = AnnotationContextualMenu;
module.exports.AnnotationContextualMenuItem = AnnotationContextualMenuItem;
module.exports.AnnotationPresetConfiguration = AnnotationPresetConfiguration;

module.exports.AnnotationPresetInk = AnnotationPresetInk;
module.exports.AnnotationPresetFreeText = AnnotationPresetFreeText;
module.exports.AnnotationPresetStamp = AnnotationPresetStamp;
module.exports.AnnotationPresetNote = AnnotationPresetNote;
module.exports.AnnotationPresetMarkup = AnnotationPresetMarkup;
module.exports.AnnotationPresetShape = AnnotationPresetShape;
module.exports.AnnotationPresetLine = AnnotationPresetLine;
module.exports.AnnotationPresetEraser = AnnotationPresetEraser;
module.exports.AnnotationPresetFile = AnnotationPresetFile;
module.exports.AnnotationPresetSound = AnnotationPresetSound;
module.exports.AnnotationPresetRedact = AnnotationPresetRedact;
module.exports.AnnotationPresetMeasurementArea =
  AnnotationPresetMeasurementArea;
module.exports.AnnotationPresetMeasurementPerimeter =
  AnnotationPresetMeasurementPerimeter;
module.exports.AnnotationPresetMeasurementDistance =
  AnnotationPresetMeasurementDistance;

module.exports.NotificationCenter = NotificationCenter;
module.exports.NotificationCenter = NotificationCenter;
