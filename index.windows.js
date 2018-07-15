//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//
import { requireNativeComponent, ViewPropTypes } from "react-native";
import PropTypes from 'prop-types';

var iface = {
    name: 'PSPDFKitView',
    propTypes: {
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
    },
};

module.exports = requireNativeComponent("ReactPSPDFKitView", iface);
