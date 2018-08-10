import React, { Component } from "react";

import {
    View,
    Button,
    NativeModules
} from "react-native"

import PSPDFKitView from "react-native-pspdfkit";

export default class GetAnnotationsScreen extends Component<{}> {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "PDF"
        };
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <PSPDFKitView
                    ref="pdfView"
                    document="file:///android_asset/Annual Report.pdf"
                    configuration={{
                    }}
                    fragmentTag="PDF1"
                    annotationAuthorName="Author"
                    style={{ flex: 1 }}
                />
                <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', padding: 10 }}>
                    <Button onPress={() => {
                        this.refs.pdfView.getAnnotations(0, null).then(annotations => {
                            NativeModules.TestingModule.setValue("annotations", JSON.stringify(annotations));
                        })
                    }} title="Get" />
                </View>
            </View>
        );
    }
}