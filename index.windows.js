//  Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//
import PropTypes from "prop-types";
import React from "react";
import {
  requireNativeComponent,
  ViewPropTypes,
  findNodeHandle,
  UIManager
} from "react-native";

class PSPDFKitView extends React.Component {
  _nextRequestId = 1;
  _requestMap = new Map();

  render() {
    return (
      <RCTPSPDFKitView
        ref="pdfView"
        {...this.props}
        onAnnotationsChanged={this._onAnnotationsChanged}
        onDocumentSaved={this._onDocumentSaved}
        onDocumentSaveFailed={this._onDocumentSaveFailed}
        onDataReturned={this._onDataReturned}
      />
    );
  }

  _onAnnotationsChanged = event => {
    if (this.props.onAnnotationsChanged) {
      this.props.onAnnotationsChanged(event.nativeEvent);
    }
  };

  _onDocumentSaved = event => {
    if (this.props.onDocumentSaved) {
      this.props.onDocumentSaved(event.nativeEvent);
    }
  };

  _onDocumentSaveFailed = event => {
    if (this.props.onDocumentSaveFailed) {
      this.props.onDocumentSaveFailed(event.nativeEvent);
    }
  };

  _onDataReturned = event => {
    let { requestId, result, error } = event.nativeEvent;
    let promise = this._requestMap[requestId];
    if (result) {
      promise.resolve(result);
    } else {
      promise.reject(error);
    }
    this._requestMap.delete(requestId);
  };

  /**
   * Enters the annotation creation mode, showing the annotation creation toolbar.
   */
  enterAnnotationCreationMode = function () {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.enterAnnotationCreationMode,
      []
    );
  };

  /**
   * Exits the currently active mode, hiding all active sub-toolbars.
   */
  exitCurrentlyActiveMode = function () {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.exitCurrentlyActiveMode,
      []
    );
  };

  /**
   * Saves the currently opened document.
   */
  saveCurrentDocument = function () {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.saveCurrentDocument,
      []
    );
  };

  /**
   * Gets all annotations from a specific page.
   *
   * @param pageIndex The page to get the annotations for.
   *
   * @returns a promise resolving an array with the following structure:
   * {'annotations' : [instantJson]}
   */
  getAnnotations = function (pageIndex) {
    let requestId = this._nextRequestId++;
    let requestMap = this._requestMap;

    // We create a promise here that will be resolved once onDataReturned is called.
    let promise = new Promise(function (resolve, reject) {
      requestMap[requestId] = { resolve: resolve, reject: reject };
    });

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.getAnnotations,
      [requestId, pageIndex]
    );

    return promise;
  };

  /**
   * Adds a new annotation to the current document.
   *
   * @param annotation InstantJson of the annotation to add with the format of
   * https://pspdfkit.com/guides/windows/current/importing-exporting/instant-json/#instant-annotation-json-api
   */
  addAnnotation = function (annotation) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.addAnnotation,
      [annotation]
    );
  };

  /**
   * Gets toolbar items currently shown.
   *
   * @return Receives an array of https://pspdfkit.com/api/web/PSPDFKit.ToolbarItem.html.
   */
  getToolbarItems = function () {
    let requestId = this._nextRequestId++;
    let requestMap = this._requestMap;

    // We create a promise here that will be resolved once onDataReturned is called.
    let promise = new Promise(function (resolve, reject) {
      requestMap[requestId] = { resolve: resolve, reject: reject };
    });

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.getToolbarItems,
      [requestId]
    );

    return promise;
  };

  /**
   * Set toolbar items currently shown.
   *
   * Receives an array of https://pspdfkit.com/api/web/PSPDFKit.ToolbarItem.html.
   * Default toolbar items are provided for simple usage
   * https://pspdfkit.com/api/web/PSPDFKit.html#.defaultToolbarItems.
   * For more advance features please refer to
   * https://pspdfkit.com/guides/web/current/customizing-the-interface/customizing-the-toolbar/.
   */
  setToolbarItems = function (toolbarItems) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.pdfView),
      UIManager.RCTPSPDFKitView.Commands.setToolbarItems,
      [toolbarItems]
    );
  };
}

PSPDFKitView.propTypes = {
  /**
   * Path to the PDF file that should be displayed.
   */
  document: PropTypes.string,
  /**
   * Page index of the document that will be shown.
   */
  pageIndex: PropTypes.number,
  /**
   * Controls whether a navigation bar is created and shown or not. Defaults to showing a navigation bar (false).
   */
  hideNavigationBar: PropTypes.bool,
  /**
   * Callback that is called when an annotation is added, changed, or removed.
   * Returns an object with the following structure:
   * {
   *    change: "changed"|"added"|"removed",
   *    annotations: [instantJson]
   * }
   */
  onAnnotationsChanged: PropTypes.func,
  ...ViewPropTypes
};

const RCTPSPDFKitView = requireNativeComponent(
  "RCTPSPDFKitView",
  PSPDFKitView,
  {}
);
module.exports = PSPDFKitView;
