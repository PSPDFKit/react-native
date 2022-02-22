//  Copyright © 2018-2022 PSPDFKit GmbH. All rights reserved.
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
  NativeModules,
  UIManager,
} from "react-native";

class PSPDFKitView extends React.Component {
  _nextRequestId = 1;
  _requestMap = new Map();

  render() {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const onCloseButtonPressedHandler = this.props.onCloseButtonPressed
        ? (event) => {
            this.props.onCloseButtonPressed(event.nativeEvent);
          }
        : null;
      return (
        <RCTPSPDFKitView
          ref="pdfView"
          fragmentTag="PSPDFKitView.FragmentTag"
          {...this.props}
          onCloseButtonPressed={onCloseButtonPressedHandler}
          onStateChanged={this._onStateChanged}
          onDocumentSaved={this._onDocumentSaved}
          onDocumentSaveFailed={this._onDocumentSaveFailed}
          onDocumentLoadFailed={this._onDocumentLoadFailed}
          onAnnotationTapped={this._onAnnotationTapped}
          onAnnotationsChanged={this._onAnnotationsChanged}
          onNavigationButtonClicked={this._onNavigationButtonClicked}
          onDataReturned={this._onDataReturned}
        />
      );
    } else {
      return null;
    }
  }

  _onStateChanged = (event) => {
    if (this.props.onStateChanged) {
      this.props.onStateChanged(event.nativeEvent);
    }
  };

  _onDocumentSaved = (event) => {
    if (this.props.onDocumentSaved) {
      this.props.onDocumentSaved(event.nativeEvent);
    }
  };

  _onDocumentSaveFailed = (event) => {
    if (this.props.onDocumentSaveFailed) {
      this.props.onDocumentSaveFailed(event.nativeEvent);
    }
  };

  _onDocumentLoadFailed = (event) => {
    if (this.props.onDocumentLoadFailed) {
      this.props.onDocumentLoadFailed(event.nativeEvent);
    }
  };

  _onAnnotationTapped = (event) => {
    if (this.props.onAnnotationTapped) {
      this.props.onAnnotationTapped(event.nativeEvent);
    }
  };

  _onAnnotationsChanged = (event) => {
    if (this.props.onAnnotationsChanged) {
      this.props.onAnnotationsChanged(event.nativeEvent);
    }
  };

  _onNavigationButtonClicked = (event) => {
    if (this.props.onNavigationButtonClicked) {
      this.props.onNavigationButtonClicked(event.nativeEvent);
    }
  };

  _onDataReturned = (event) => {
    let { requestId, result, error } = event.nativeEvent;
    let promise = this._requestMap[requestId];
    if (result != undefined) {
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
    if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .enterAnnotationCreationMode,
        []
      );
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.enterAnnotationCreationMode(
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Exits the currently active mode, hiding all toolbars.
   */
  exitCurrentlyActiveMode = function () {
    if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .exitCurrentlyActiveMode,
        []
      );
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.exitCurrentlyActiveMode(
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Saves the currently opened document.
   *
   * Returns a promise resolving to true if the document was saved, and false otherwise.
   */
  saveCurrentDocument = function () {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .saveCurrentDocument,
        [requestId]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.saveCurrentDocument(
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

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
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands.getAnnotations,
        [requestId, pageIndex, type]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getAnnotations(
        pageIndex,
        type,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Adds a new annotation to the current document.
   *
   * @param annotation InstantJson of the annotation to add.
   *
   * Returns a promise resolving to true if the annotation was added. Otherwise, returns false if an error has occurred.
   */
  addAnnotation = function (annotation) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands.addAnnotation,
        [requestId, annotation]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.addAnnotation(
        annotation,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Removes an existing annotation from the current document.
   *
   * @param annotation InstantJson of the annotation to remove.
   *
   * Returns a promise resolving to true if the annotation was removed. Otherwise, returns false if the annotation couldn't be found.
   */
  removeAnnotation = function (annotation) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands.removeAnnotation,
        [requestId, annotation]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.removeAnnotation(
        annotation,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Gets all unsaved changes to annotations.
   *
   * Returns a promise resolving to document instant json (https://pspdfkit.com/guides/android/current/importing-exporting/instant-json/#instant-document-json-api-a56628).
   */
  getAllUnsavedAnnotations = function () {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .getAllUnsavedAnnotations,
        [requestId]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getAllUnsavedAnnotations(
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Gets all annotations of the given type.
   *
   * @param type The type of annotations to get (See here for types https://pspdfkit.com/guides/server/current/api/json-format/) or null to get all annotations.
   *
   * Returns a promise resolving an array with the following structure:
   * {'annotations' : [instantJson]}
   */
  getAllAnnotations = function (type) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .getAllAnnotations,
        [requestId, type]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getAllAnnotations(
        type,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Applies the passed in document instant json.
   *
   * @param annotations The document instant json to apply.
   *
   * Returns a promise resolving to true if the annotation was added.
   */
  addAnnotations = function (annotations) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands.addAnnotations,
        [requestId, annotations]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.addAnnotations(
        annotations,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Gets the value of the form element of the fully qualified name.
   *
   * @param fullyQualifiedName The fully qualified name of the form element.
   *
   * Returns a promise resolving a dictionary with the following structure:
   * {'formElement' : value} or {'error' : 'Failed to get the form field value.'}
   */
  getFormFieldValue = function (fullyQualifiedName) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .getFormFieldValue,
        [requestId, fullyQualifiedName]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getFormFieldValue(
        fullyQualifiedName,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Set the value of the form element of the fully qualified name.
   *
   * @param fullyQualifiedName The fully qualified name of the form element.
   * @param value The string value form element. For button form elements pass 'selected' or 'deselected'. For choice form elements, pass the index of the choice to select, for example '1'.
   *
   * Returns a promise resolving to true if the value was set, and false otherwise.
   */
  setFormFieldValue = function (fullyQualifiedName, value) {
    if (Platform.OS === "android") {
      let requestId = this._nextRequestId++;
      let requestMap = this._requestMap;

      // We create a promise here that will be resolved once onDataReturned is called.
      let promise = new Promise(function (resolve, reject) {
        requestMap[requestId] = { resolve: resolve, reject: reject };
      });

      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .setFormFieldValue,
        [requestId, fullyQualifiedName, value]
      );

      return promise;
    } else if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.setFormFieldValue(
        value,
        fullyQualifiedName,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };
  /**
   * Set the left bar button items for the specified view mode.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   *
   * @param items The list of bar button items. See the full list of button items here: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html#/Toolbar%20button%20items
   * @param viewMode The optional view mode. Can be 'document', 'thumbnails', 'documentEditor' or `null`. If `null` is passed, bar button items for all view modes are set.
   * @param animated The animated flag.
   *
   * @platform ios
   */
  setLeftBarButtonItems = function (items, viewMode, animated) {
    if (Platform.OS === "ios") {
      NativeModules.PSPDFKitViewManager.setLeftBarButtonItems(
        items,
        viewMode,
        animated,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };
  /**
   * Get the left bar button items for the specified view mode.
   *
   * @param viewMode The optional view mode. Can be 'document', 'thumbnails', 'documentEditor' or `null`. If `null` is passed, bar button items for the current view mode are returned.
   *
   * Returns a promise resolving an array with the following structure:
   * ['outlineButtonItem', 'searchButtonItem'] or a dictionary with the following error {'error' : 'Failed to get the left bar button items.'}
   * @platform ios
   */
  getLeftBarButtonItemsForViewMode = function (viewMode) {
    if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getLeftBarButtonItemsForViewMode(
        viewMode,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };
  /**
   * Set the right bar button items for the specified view mode.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   *
   * @param items The list of bar button items. See the full list of button items here: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html#/Toolbar%20button%20items
   * @param viewMode The optional view mode. Can be 'document', 'thumbnails', 'documentEditor' or `null`. If `null` is passed, bar button items for all view modes are set.
   * @param animated The animated flag.
   *
   * @platform ios
   */
  setRightBarButtonItems = function (items, viewMode, animated) {
    if (Platform.OS === "ios") {
      NativeModules.PSPDFKitViewManager.setRightBarButtonItems(
        items,
        viewMode,
        animated,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };
  /**
   * Get the right bar button items for the specified view mode.
   *
   * @param viewMode The optional view mode. Can be 'document', 'thumbnails', 'documentEditor' or `null`. If `null` is passed, bar button items for the current view mode are returned.
   *
   * Returns a promise resolving an array with the following structure:
   * ['annotationButtonItem', 'documentEditorButtonItem'] or a dictionary with the following error {'error' : 'Failed to get the right bar button items.'}
   * @platform ios
   */
  getRightBarButtonItemsForViewMode = function (viewMode) {
    if (Platform.OS === "ios") {
      return NativeModules.PSPDFKitViewManager.getRightBarButtonItemsForViewMode(
        viewMode,
        findNodeHandle(this.refs.pdfView)
      );
    }
  };

  /**
   * Removes the currently displayed Android Native PdfUiFragment.
   * 
   * This function should only be used as a workaround for a bug in `react-native-screen` that causes a crash when
   * `navigation.goBack()` is called or a hardware back button is used to navigate back on Android. Calling this 
   * function will prevent the crash by removing the fragment from the `PdfView` before the navigation takes place.
   * 
   * <b>Note:</> this function is available for Android only, it will have no effect on iOS.
   */
   destroyView = function () {
    if (Platform.OS === "android") {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.refs.pdfView),
        this._getViewManagerConfig("RCTPSPDFKitView").Commands
          .removeFragment,
        []
      );
    } 
  };

  _getViewManagerConfig = (viewManagerName) => {
    const version = NativeModules.PlatformConstants.reactNativeVersion.minor;
    if (version >= 58) {
      return UIManager.getViewManagerConfig(viewManagerName);
    } else {
      return UIManager[viewManagerName];
    }
  };
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
   * Controls whether or not the document will be automatically saved. Defaults to automatically saving (false).
   */
  disableAutomaticSaving: PropTypes.bool,
  /**
   * Controls the author name that is set for new annotations.
   * If not set and the user hasn't specified it before the user will be asked and the result will be saved.
   * The value set here will be persisted and the user will not be asked even if this is not set the next time.
   */
  annotationAuthorName: PropTypes.string,
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
   * Callback that is called when the document fails to save.
   * Returns a string error with the error message.
   * {
   *    error: "Error message",
   * }
   */
  onDocumentSaveFailed: PropTypes.func,
  /**
   * Callback that is called when an annotation is added, changed, or removed.
   * Returns an object with the following structure:
   * {
   *    change: "changed"|"added"|"removed",
   *    annotations: [instantJson]
   * }
   */
  onAnnotationTapped: PropTypes.func,
  /**
   * Callback that is called when an annotation is added, changed, or removed.
   * Returns an object with the following structure:
   * {
   *    change: "changed"|"added"|"removed",
   *    annotations: [instantJson]
   * }
   */
  onAnnotationsChanged: PropTypes.func,
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
   */
  onStateChanged: PropTypes.func,
  /**
   * fragmentTag: A tag used to identify a single PdfFragment in the view hierarchy.
   * This needs to be unique in the view hierarchy.
   *
   * @platform android
   */
  fragmentTag: PropTypes.string,
  /**
   * menuItemGrouping: Can be used to specfiy a custom grouping for the menu items in the annotation creation toolbar.
   */
  menuItemGrouping: PropTypes.array,
  /**
   * leftBarButtonItems: Can be used to specfiy an array of the left button items.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   * The full list of button items: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html#/Toolbar%20button%20items
   *
   * @platform ios
   */
  leftBarButtonItems: PropTypes.array,
  /**
   * rightBarButtonItems: Can be used to specfiy an array of the right button items.
   * Note: The same button item cannot be added to both the left and right bar button items simultaneously.
   * The full list of button items: https://pspdfkit.com/api/ios/Classes/PSPDFViewController.html#/Toolbar%20button%20items
   *
   * @platform ios
   */
  rightBarButtonItems: PropTypes.array,
  /**
   * toolbarTitle: Can be used to specfiy a custom toolbar title on iOS by setting the `title` property of the `PSPDFViewController`.
   * Note: You need to set `documentLabelEnabled`, `useParentNavigationBar`, and `allowToolbarTitleChange` to false in your Configuration before setting the custom title.
   * See `ConfiguredPDFViewComponent` in https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/Catalog.js
   *
   * @platform ios
   */
  toolbarTitle: PropTypes.string,
  /**
   * showNavigationButtonInToolbar: When set to true the toolbar integrated into the PSPDFKitView will display a back button in the top left corner.
   *
   * @platform android
   */
  showNavigationButtonInToolbar: PropTypes.bool,
  /**
   * onNavigationButtonClicked: When showNavigationButtonInToolbar is set to true this will notify you when the back button is clicked.
   *
   * @platform android
   */
  onNavigationButtonClicked: PropTypes.func,
  /**
   * availableFontNames: Can be used to specfiy the available font names in the font picker.
   *
   * Note on iOS: You need to set the desired font family names as `UIFontDescriptor`. See https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc
   * See `CustomFontPicker` in https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/Catalog.js
   *
   */
  availableFontNames: PropTypes.array,
  /**
   * selectedFontName: Can be used to specfiy the current selected font in the font picker.
   *
   * Note on iOS: You need to set the desired font family name as `UIFontDescriptor`. See https://developer.apple.com/documentation/uikit/uifontdescriptor?language=objc
   * See `CustomFontPicker` in https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/Catalog.js
   *
   * Note on Android: This is the default font that is selected, if the users changes the font that will become the new default.
   */
  selectedFontName: PropTypes.string,
  /**
   * showDownloadableFonts: Can be used to show or hide the downloadable fonts section in the font picker. Defaults to showing a the downloadable fonts (true).
   * See `CustomFontPicker` in https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/Catalog.js
   *
   * @platform ios
   */
  showDownloadableFonts: PropTypes.bool,
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
        nativeID: true,
      },
    }
  );
  module.exports = PSPDFKitView;
}
