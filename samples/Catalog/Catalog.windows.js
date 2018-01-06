//  Copyright (c) 2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    NativeModules,
    processColor,
    Button
} from 'react-native';

var PSPDFKitView = require('react-native-pspdfkit');
var PSPDFKit = NativeModules.ReactPSPDFKit;

export default class Catalog extends Component<{}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.page}>
                <PSPDFKitView style={styles.pdfView}/>
                <View style={styles.footer}>
                    <View style={styles.button}>
                        <Button onPress={() => PSPDFKit.OpenFile()} title="Open"/>
                    </View>
                    <Image source={require('./assets/logo-flat.png')} style={styles.logo}/>
                    <Text style={styles.version}>SDK Version : {PSPDFKit.versionString}</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({

    page: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#eee'
    },
    pdfView: {
        flex: 1,
    },
    button: {
        width: 100,
        margin: 20
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    version: {
        color: '#666666',
        margin: 20
    },
    logo: {
        height: 50,
        width: 50,
        margin: 10
    },
});