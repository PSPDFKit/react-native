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