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

export default styles = StyleSheet.create({
    separator: {
        height: 0.5,
        backgroundColor: "#ccc",
        marginLeft: 10
    },
    page: {
        flex: 1,
        alignItems: "stretch",
        backgroundColor: "#eee"
    },
    header: {
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderColor: "#ccc"
    },
    version: {
        color: "#666666",
        marginTop: 10,
        marginBottom: 20
    },
    logo: {
        marginTop: 40
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