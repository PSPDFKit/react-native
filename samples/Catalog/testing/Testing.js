import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    TouchableHighlight,
    ListView,
    NativeModules,
    processColor,
    PermissionsAndroid,
    Dimensions
} from "react-native";
import { StackNavigator } from "react-navigation";

import styles from './styles'
import AuthorNameScreen from './AuthorNameScreen'
import AnnotationToolbarScreen from './AnnotationToolbarScreen'
import GetAnnotationsScreen from './GetAnnotationsScreen'
import FormsScreen from './FormsScreen'

import PSPDFKitView from "react-native-pspdfkit";

var examples = [
    {
        name: "AuthorName",
        action: component => {
            component.props.navigation.navigate("AuthorName");
        },
    }, {
        name: "AnnotationToolbar",
        action: component => {
            component.props.navigation.navigate("AnnotationToolbar");
        }
    }, {
        name: "GetAnnotations",
        action: component => {
            component.props.navigation.navigate("GetAnnotations");
        }
    },
    {
        name: "Forms",
        action: component => {
            component.props.navigation.navigate("Forms");
        }
    }
]

class CatalogScreen extends Component<{}> {
    static navigationOptions = {
        title: "Test Cases"
    };

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
                </View>
            </TouchableHighlight>
        );
    };
}

export default StackNavigator(
    {
        Catalog: {
            screen: CatalogScreen
        },
        AuthorName: {
            screen: AuthorNameScreen
        },
        AnnotationToolbar: {
            screen: AnnotationToolbarScreen
        },
        GetAnnotations: {
            screen: GetAnnotationsScreen
        },
        Forms: {
            screen: FormsScreen
        }
    },
    {
        initialRouteName: "Catalog"
    }
);