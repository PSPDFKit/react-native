//  Copyright © 2018 PSPDFKit GmbH. All rights reserved.
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
    ListView,
    Image,
    TouchableHighlight,
    NativeModules,
    processColor,
    Button
} from 'react-native';
import { StackNavigator } from "react-navigation";
import PSPDFKitView from "react-native-pspdfkit";

var PSPDFKit = NativeModules.ReactPSPDFKit;

var examples = [
    {
        name: "Open assets document",
        description: "Open document from your project assets folder",
        action: component => {
            component.props.navigation.navigate("PdfView");
        }
    },
    {
        name: "Present a file from source",
        description: "Open document from source",
        action: component => {
            component.props.navigation.navigate("PdfView");
            // Present can only take files loaded in the Visual studio Project's Assets.
            // See https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions
            PSPDFKit.Present("ms-appx:///Assets/pdf/Business Report.pdf");
        }
    },
    {
        name: "Event Listeners",
        description:
            "Show how to use the listeners exposed by PSPDFKitView component.",
        action: component => {
            component.props.navigation.navigate("PdfViewListenersScreen");
        }
    },
];

class CatalogScreen extends Component<{}> {
    // Initialize the hardcoded data
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(examples)
        };
    }

    render() {
        return (
        <View style={styles.page}>
            <View style={styles.header}>
            <Image
                source={require("./assets/logo-flat.png")}
                style={styles.logo}
            />
            <Text style={styles.version}>{PSPDFKit.versionString}</Text>
            </View>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeparator}
                contentContainerStyle={styles.listContainer}
                style={styles.list}
            />
        </View>
    );
    }

    _renderSeparator(sectionId, rowId) {
        return <View key={rowId} style={styles.separator} />;
    }

    _renderRow = example => {
        return (
            <TouchableHighlight
                onPress={() => {
                    example.action(this);
                }}
                style={styles.row}
                underlayColor="#209cca50"
            >
                <View style={styles.rowContent}>
                    <Text style={styles.name}>{example.name}</Text>
                    <Text style={styles.description}>{example.description}</Text>
                </View>
            </TouchableHighlight>
        );
    };
}

class PdfViewScreen extends Component<{}> {
    render() {
        return (
            <View style={styles.page}>
                <PSPDFKitView
                    ref="pdfView"
                    style={styles.pdfView}
                    // The default file to open.
                    document="ms-appx:///Assets/pdf/annualReport.pdf"/>
                <View style={styles.footer}>
                <View style={styles.button}>
                    <Button onPress={() => PSPDFKit.OpenFilePicker()} title="Open" />
                </View>
                    <Image source={require('./assets/logo-flat.png')} style={styles.logo} />
                    <Text style={styles.version}>SDK Version : {PSPDFKit.versionString}</Text>
                </View>
            </View>
        );
    }
}

class PdfViewListenersScreen extends Component<{}> {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            title: "Event Listeners",
        headerRight: (<Button onPress={() => params.handleSaveButtonPress()} title="Save" />)
        };
    };

    componentWillMount() {
        this.props.navigation.setParams({ handleSaveButtonPress: () => this.refs.pdfView.saveCurrentDocument() });
    }

    render() {
        return (
            <View style={styles.page}>
                <PSPDFKitView
                    ref="pdfView"
                    style={styles.pdfView}
                    // The default file to open.
                    document="ms-appx:///Assets/pdf/annualReport.pdf"
                    onDocumentSaved={e => {
                        alert("Document was saved!")
                    }}
                    onDocumentSaveFailed={e => {
                        alert("Document couldn't be saved: " + e.error)
                    }}
                    onAnnotationTapped={e => {
                        alert("Annotation was tapped\n" + JSON.stringify(e))
                    }}
                    onAnnotationsChanged={e => {
                        alert("Annotations changed\n" + JSON.stringify(e))
                    }}
                />
            </View>
        )
    }
}

export default StackNavigator(
    {
        Catalog: {
            screen: CatalogScreen
        },
        PdfView: {
            screen: PdfViewScreen
        },
        PdfViewListenersScreen: {
            screen: PdfViewListenersScreen
        },
    },
    {
        initialRouteName: "Catalog"
    }
);

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
    separator: {
        height: 0.5,
        backgroundColor: "#ccc",
        marginLeft: 10
    },
    header: {
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderColor: "#ccc"
    },
    listContainer: {
        backgroundColor: "white"
    },
    list: {},
    name: {
        color: "#209cca",
        fontWeight: "700",
        fontSize: 14,
        marginBottom: 4
    },
    description: {
        color: "#666666",
        fontSize: 12
    },
    rowContent: {
        padding: 10
    }
});
