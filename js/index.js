//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import PropTypes from 'prop-types'
import React from 'react'
import { requireNativeComponent, Platform } from 'react-native'

class PSPDFKitView extends React.Component {
  render() {
    if (Platform.OS === 'ios') {
      const onCloseButtonPressedHandler = this.props.onCloseButtonPressed
        ? event => {
          this.props.onCloseButtonPressed(event.nativeEvent)
        }
        : null
      return <RCTPSPDFKitView {...this.props} onCloseButtonPressed={onCloseButtonPressedHandler} />
    } else {
      return null
    }
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
   */
  hideNavigationBar: PropTypes.bool,
  /**
   * Wheter the close button should be shown in the navigation bar. Disabled by default.
   * Will call `onCloseButtonPressed` if it was provided, when tapped.
   * If `onCloseButtonPressed` was not provided, PSPDFKitView will be automatically dismissed.
   *
   * @platform ios
   */
  showCloseButton: PropTypes.bool,
  /**
   * Callback that is called when the user tapped the close button.
   * If you provide this function, you need to handle dismissal yourself.
   * If you don't provide this function, PSPDFKitView will be automatically dismissed.
   *
   * @platform ios
   */
  onCloseButtonPressed: PropTypes.func,
  /**
   * style: {color} allows customizing the tint color of the view.
   *
   * @platform ios
   */
}

if (Platform.OS === 'ios') {
  var RCTPSPDFKitView = requireNativeComponent('RCTPSPDFKitView', PSPDFKitView)
  module.exports = PSPDFKitView
} else if (Platform.OS === 'windows') {
  module.exports = requireNativeComponent('ReactPSPDFKitView', null);
}
