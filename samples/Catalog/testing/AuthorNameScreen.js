//
// AuthorNameScreen.js
//
// PSPDFKit
//
// Copyright © 2021 PSPDFKit GmbH. All rights reserved.
//
// THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
// AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
// UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
// This notice may not be removed from this file.
//

import React, { Component } from "react";
import {
    NativeModules
} from "react-native"
import PSPDFKitView from "react-native-pspdfkit";

export default class AuthorNameScreen extends Component<{}> {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "PDF"
        };
    };

    componentDidMount() {
        NativeModules.TestingModule.setValue("did_load", "true");
    }

    render() {
        return (
            <PSPDFKitView
                ref="pdfView"
                document="file:///android_asset/Annual Report.pdf"
                configuration={{
                }}
                fragmentTag="PDF1"
                annotationAuthorName="Author"
                style={{ flex: 1 }}
            />
        );
    }
}