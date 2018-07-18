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
    Platform,
    findNodeHandle,
    UIManager
} from "react-native";

class PSPDFKitView extends React.Component {
    render() {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            const onCloseButtonPressedHandler = this.props.onCloseButtonPressed
                ? event => {
                    this.props.onCloseButtonPressed(event.nativeEvent);
                }
                : null;
            return (
                <RCTPSPDFKitView
                    ref="pdfView"
                    {...this.props}
                    onCloseButtonPressed={onCloseButtonPressedHandler}
                    onStateChanged={this._onStateChanged}
                    onDocumentSaved={this._onDocumentSaved}
                    onAnnotationTapped={this._onAnnotationTapped}
                    onAnnotationChanged={this._onAnnotationChanged}
                />
            );
        } else {
            return null;
        }
    }

    _onStateChanged = event => {
        if (this.props.onStateChanged) {
            this.props.onStateChanged(event.nativeEvent);
        }
    };
    
    _onDocumentSaved = (event) => {
        if (this.props.onDocumentSaved) {
            this.props.onDocumentSaved(event.nativeEvent);
        }
    };
    
    _onAnnotationTapped = (event) => {
        if (this.props.onAnnotationTapped) {
            this.props.onAnnotationTapped(event.nativeEvent);
        }
    };

    _onAnnotationChanged = event => {
        if (this.props.onAnnotationChanged) {
            this.props.onAnnotationChanged(event.nativeEvent)
        }
    }

    /**
     * Enters the annotation creation mode, showing the annotation creation toolbar.
     *
     * @platform android
     */
    enterAnnotationCreationMode = function () {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.pdfView),
            UIManager.RCTPSPDFKitView.Commands.enterAnnotationCreationMode,
            []
        );
    };

    /**
     * Exits the currently active mode, hiding all toolbars.
     *
     * @platform android
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
        )
    }
}

PSPDFKitView.propTypes = {
    /**
     * Path to the PDF file that should be displayed.
     */
    document: PropTypes.string,
    /**
     * Configuration object, to customize the appearance and behavior of PSPDFKit.
     * See https://pspdfkit.com/guides/ios/current/getting-started/pspdfconfiguration/ for more information.
     *
     * Note: On iOS, set `useParentNavigationBar` to `true`, to use the parent navigation bar instead of creating its own,
     * if the view is already contained in a navigation controller (like when using NavigatorIOS, react-native-navigation, ...).
     */
    configuration: PropTypes.object,
    /**
     * Page index of the document that will be shown.
     */
    pageIndex: PropTypes.number,
    /**
     * Controls wheter a navigation bar is created and shown or not. Defaults to showing a navigation bar (false).
     *
     * @platform ios
     */
    hideNavigationBar: PropTypes.bool,
    /**
     * Whether the close button should be shown in the navigation bar. Disabled by default.
     * Will call `onCloseButtonPressed` if it was provided, when tapped.
     * If `onCloseButtonPressed` was not provided, PSPDFKitView will be automatically dismissed.
     *
     * @platform ios
     */
    showCloseButton: PropTypes.bool,
    /**
     * Controls wheter or not the default action for tapped annotations is processed. Defaults to processing the action (false).
     */
    disableDefaultActionForTappedAnnotations: PropTypes.bool, 
    /**
     * Callback that is called when the user tapped the close button.
     * If you provide this function, you need to handle dismissal yourself.
     * If you don't provide this function, PSPDFKitView will be automatically dismissed.
     *
     * @platform ios
     */
    onCloseButtonPressed: PropTypes.func,
    /**
     * Callback that is called when the document is saved.
     */
    onDocumentSaved: PropTypes.func,
    /**
     * Callback that is called when the user taps on an annotation.
     * Returns the annotation data as instant json.
     */
    onAnnotationTapped: PropTypes.func,
    /**
     * Callback that is called when an annotation is added, changed, or removed.
     * Returns an object with the following structure:
     * {
     *    change: "changed"|"added"|"removed",
     *    annotation: instantJson
     * }
     */
    onAnnotationChanged: PropTypes.func,  
    /**
     * Callback that is called when the state of the PSPDFKitView changes.
     * Returns an object with the following structure:
     * {
     *    documentLoaded: bool,
     *    currentPageIndex: int,
     *    pageCount: int,
     *    annotationCreationActive: bool,
     *    annotationEditingActive: bool,
     *    textSelectionActive: bool,
     *    formEditingActive: bool,
     * }
     *
     * @platform android
     */
    onStateChanged: PropTypes.func,
    /**
     * fragmentTag: A tag used to identify a single PdfFragment in the view hierarchy.
     * This needs to be unique in the view hierarchy.
     *
     * @platform android
     */
    fragmentTag: PropTypes.string
};

if (Platform.OS === "ios" || Platform.OS === "android") {
    var RCTPSPDFKitView = requireNativeComponent(
        "RCTPSPDFKitView",
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
                nativeID: true
            }
        }
    );
    module.exports = PSPDFKitView;
}
