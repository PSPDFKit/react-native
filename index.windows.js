//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
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
    NativeModules,
    UIManager
} from "react-native";

class PSPDFKitView extends React.Component {
    render() {
        return (
            <RCTPSPDFKitView
                ref = "pdfView"
                {...this.props}/>
        );
    }

    /**
     * Enters the annotation creation mode, showing the annotation creation toolbar.
     *
     */
    enterAnnotationCreationMode = function () {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.enterAnnotationCreationMode,
           []
        );
    };

    /**
     * Exits the currently active mode, hiding all toolbars.
     */
    exitCurrentlyActiveMode = function () {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.exitCurrentlyActiveMode,
            []
        );
    };

    /**
     * Saves the currently opened document.
     */
    saveCurrentDocument = function () {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.saveCurrentDocument,
            []
        );
    }

    /**
     * Gets all annotations of the given type from the page.
     * 
     * @param pageIndex The page to get the annotations for.
     * @param type The type of annotations to get (See here for types https://pspdfkit.com/guides/server/current/api/json-format/) or null to get all annotations.
     * 
     * Returns a promise resolving an array with the following structure:
     * {'annotations' : [instantJson]}
     */
    getAnnotations = function (pageIndex, type) {
        let requestId = this._nextRequestId++
        let requestMap = this._requestMap;

        // We create a promise here that will be resolved once onDataReturned is called.
        let promise = new Promise(function (resolve, reject) {
            requestMap[requestId] = { 'resolve': resolve, 'reject': reject }
        })

        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.getAnnotations,
            []
        );

        return promise
    }

    /**
     * Adds a new annotation to the current document.
     * 
     * @param annotation InstantJson of the annotation to add.
     */
    addAnnotation = function (annotation) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.addAnnotation,
            []
        );
    }

    /**
     * Gets all unsaved changes to annotations.
     * 
     * Returns a promise resolving to document instant json (https://pspdfkit.com/guides/android/current/importing-exporting/instant-json/#instant-document-json-api-a56628).
     */
    getAllUnsavedAnnotations = function () {
        let requestId = this._nextRequestId++
        let requestMap = this._requestMap;

        // We create a promise here that will be resolved once onDataReturned is called.
        let promise = new Promise(function (resolve, reject) {
            requestMap[requestId] = { 'resolve': resolve, 'reject': reject }
        })

        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.getAllUnsavedAnnotations,
            []
        );

        return promise;
    }

    /**
     * Applies the passed in document instant json.
     * 
     * @param annotations The document instant json to apply.
     */
    addAnnotations = function (annotations) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.addAnnotations,
            []
        );
    }

    /**
     * Gets the value of the form element of the fully qualified name.
     * 
     * @param fullyQualifiedName The fully qualified name of the form element.
     *
     * Returns a promise resolving a dictionary with the following structure:
     * {'formElement' : value} or {'error' : 'Failed to get the form field value.'}
     */
    getFormFieldValue = function (fullyQualifiedName) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.getFormFieldValue,
            []
        );
    }

    /**
     * Set the value of the form element of the fully qualified name.
     * 
     * @param fullyQualifiedName The fully qualified name of the form element.
     * @param value The string value form element. For button form elements pass 'selected' or 'deselected'. For choice form elements, pass the index of the choice to select, for example '1'.
     */
    setFormFieldValue = function (fullyQualifiedName, value) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            NativeModules.RCTPSPDFKitView.Commands.setFormFieldValue,
            []
        );
    }
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
     * Controls wheter a navigation bar is created and shown or not. Defaults to showing a navigation bar (false).
     */
    hideNavigationBar: PropTypes.bool,
    ...ViewPropTypes
};

var RCTPSPDFKitView = requireNativeComponent(
    "RCTPSPDFKitView",
    PSPDFKitView,
    {}
);
module.exports = PSPDFKitView;
