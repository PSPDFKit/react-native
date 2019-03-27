//  Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React, {Component} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableHighlight,
  NativeModules,
  Button
} from "react-native";
import {StackNavigator} from "react-navigation";
import PSPDFKitView from "react-native-pspdfkit";

const PSPDFKit = NativeModules.ReactPSPDFKit;
const PSPDFKitLibrary = NativeModules.ReactPSPDFKitLibrary;
const RNFS = require("react-native-fs");

import {YellowBox} from "react-native";

YellowBox.ignoreWarnings([
  "Warning: Invalid argument supplied to oneOf" // React native windows bug.
]);


const complexSearchConfiguration = {
  searchString: "the",
  excludeAnnotations: false,
  excludeDocumentText: false,
  matchExactPhrases: false,
  maximumSearchResultsPerDocument: 0,
  maximumSearchResultsTotal: 500,
  maximumPreviewResultsPerDocument: 0,
  maximumPreviewResultsTotal: 500,
  generateTextPreviews: true,
  previewRange: {position: 20, length: 120}
};

const annotationToAdd = {
  bbox: [
    89.58633422851562,
    98.5791015625,
    143.12948608398438,
    207.1583251953125
  ],
  blendMode: "normal",
  createdAt: "2018-07-03T13:53:03Z",
  isDrawnNaturally: false,
  lineWidth: 5,
  lines: {
    intensities: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]],
    points: [
      [
        [92.08633422851562, 101.07916259765625],
        [92.08633422851562, 202.15826416015625],
        [138.12950134277344, 303.2374267578125]
      ],
      [
        [184.17266845703125, 101.07916259765625],
        [184.17266845703125, 202.15826416015625],
        [230.2158203125, 303.2374267578125]
      ]
    ]
  },
  opacity: 1,
  pageIndex: 0,
  strokeColor: "#AA47BE",
  type: "pspdfkit/ink",
  updatedAt: "2018-07-03T13:53:03Z",
  v: 1
};

const simpleSearch = {
  searchString: "the"
};

const examples = [
  {
    key: "item1",
    name: "Open assets document",
    description: "Opens a document from your project assets folder",
    action: component => {
      component.props.navigation.navigate("PdfView");
    }
  },
  {
    key: "item2",
    name: "Present a file from source",
    description: "Opens a document from assets with Present",
    action: component => {
      component.props.navigation.navigate("PdfView");
      // Present can only take files loaded in the Visual studio Project's Assets. Please use RNFS.
      // See https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions
      const path = RNFS.MainBundlePath + "\\Assets\\pdf\\Business Report.pdf";
      PSPDFKit.Present(path)
        .then(() => {
          alert("File Opened successfully");
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  {
    key: "item3",
    name: "Event Listeners",
    description:
      "Show how to use the listeners exposed by PSPDFKitView component.",
    action: component => {
      component.props.navigation.navigate("PdfViewListenersScreen");
    }
  },
  {
    key: "item4",
    name: "Programmatic Annotations",
    description: "Shows how to get and add new annotations using Instant JSON.",
    action: component => {
      component.props.navigation.navigate("PdfViewInstantJsonScreen");
    }
  },
  {
    key: "item5",
    name: "Index Full Text Search From Picker",
    description: "A simple full text search over a folder of the users choice.",
    action: async () => {
      await PSPDFKitLibrary.OpenLibrary("MyLibrary");
      await PSPDFKitLibrary.EnqueueDocumentsInFolderPicker("MyLibrary");
      alert(
        'Searching Library for "' +
        simpleSearch.searchString +
        '". Please wait.'
      );
      PSPDFKitLibrary.SearchLibrary("MyLibrary", simpleSearch)
        .then(result => {
          alert("Search : \n" + JSON.stringify(result));
        })
        .finally(() => PSPDFKitLibrary.DeleteAllLibraries());
    }
  },
  {
    key: "item6",
    name: "Index Full Text Search From Assets",
    description: "A simple full text search over the assets folder.",
    action: async () => {
      const path = RNFS.MainBundlePath + "\\Assets\\pdf";

      await PSPDFKitLibrary.OpenLibrary("AssetsLibrary");
      await PSPDFKitLibrary.EnqueueDocumentsInFolder("AssetsLibrary", path);
      alert(
        'Searching Library for "' +
        complexSearchConfiguration.searchString +
        '". Please wait.'
      );
      PSPDFKitLibrary.SearchLibrary("AssetsLibrary", complexSearchConfiguration)
        .then(result => {
          alert("Search : \n" + JSON.stringify(result));
        })
        .finally(() => PSPDFKitLibrary.DeleteAllLibraries());
    }
  },
  {
    key: "item7",
    name: "Customize the toolbar",
    description: "An example to show how to customize the toolbar UI.",
    action: async component => {
      component.props.navigation.navigate("PdfViewToolbarCustomization");
    }
  },
  {
    key: "item8",
    name: "Custom colors",
    description: "Supplies different colors for Pdf View Toolbar.",
    action: component => {
      component.props.navigation.navigate("PdfViewStyle");
    }
  }
];

const pdfStyle = {
  flex: 1,
  highlightColor: "#61D800", /* Highlight or hover color. */
  primaryColor: "red", /* Color for the main toolbar */
  primaryDarkColor: "rgb(255, 0, 255)" /* Color for the second toolbar */
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#eee"
  },
  pdfView: {
    flex: 1
  },
  button: {
    width: 100,
    margin: 20
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  version: {
    color: "#666666",
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
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

class CatalogScreen extends Component<{}> {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      dataSource: examples
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
        <FlatList
          data={this.state.dataSource}
          renderItem={this._renderRow}
          ItemSeparatorComponent={CatalogScreen._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}/>
      </View>
    );
  }

  static _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator}/>;
  }

  _renderRow = ({item, separators}) => {
    return (
      <TouchableHighlight
        onPress={() => {
          item.action(this);
        }}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}>
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    )
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
            <Button onPress={() => PSPDFKit.OpenFilePicker()} title="Open"/>
          </View>
          <Image
            source={require("./assets/logo-flat.png")}
            style={styles.logo}
          />
          <Text style={styles.version}>
            SDK Version : {PSPDFKit.versionString}
          </Text>
        </View>
      </View>
    );
  }
}

class PdfViewListenersScreen extends Component<{}> {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      title: "Event Listeners",
      headerRight: (
        <Button onPress={() => params.handleSaveButtonPress()} title="Save"/>
      )
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({
      handleSaveButtonPress: () => this.refs.pdfView.saveCurrentDocument().then(() => {
        alert("Document was saved!");
      }).catch(error => {
        alert(error);
      })
    });
  }

  render() {
    return (
      <View style={styles.page}>
        <PSPDFKitView
          ref="pdfView"
          style={styles.pdfView}
          // The default file to open.
          document="ms-appx:///Assets/pdf/annualReport.pdf"
          onAnnotationsChanged={e => {
            alert("Annotations changed\n" + JSON.stringify(e));
          }}
        />
      </View>
    );
  }
}

class PdfViewInstantJsonScreen extends Component<{}> {
  static navigationOptions = () => {
    return {
      title: "Programmatic Annotations"
    };
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          style={styles.pdfView}
          // The default file to open.
          document="ms-appx:///Assets/pdf/annualReport.pdf"
        />
        <View
          style={{
            flexDirection: "row",
            height: 50,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // This gets all annotations on the first page.
                this.refs.pdfView.getAnnotations(0).then(annotations => {
                  alert(JSON.stringify(annotations));
                });
              }}
              title="Get annotations"
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={() => {
                // This adds a new ink annotation to the first page.
                this.refs.pdfView.addAnnotation(annotationToAdd).then(() => {
                  alert("Annotation Creation was successful.");
                }).catch(error => {
                  alert(error);
                });
              }}
              title="Add annotation"
            />
          </View>
        </View>
      </View>
    );
  }
}

class PdfViewToolbarCustomizationScreen extends Component<{}> {
  render() {
    return (
      <View style={styles.page}>
        <PSPDFKitView
          ref="pdfView"
          style={styles.pdfView}
          // The default file to open.
          document="ms-appx:///Assets/pdf/annualReport.pdf"
        />
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.button}>
              <Button onPress={() =>
                this.refs.pdfView.getToolbarItems().then(toolbarItems => {
                  alert(JSON.stringify(toolbarItems));
                })} title="Get Toolbar Items"/>
            </View>
            <View style={styles.button}>
              <Button onPress={() =>
                this.refs.pdfView.setToolbarItems([{type: "ink"}])} title="Set Toolbar Items"/>
            </View>
          </View>
          <Image
            source={require("./assets/logo-flat.png")}
            style={styles.logo}
          />
          <Text style={styles.version}>
            SDK Version : {PSPDFKit.versionString}
          </Text>
        </View>
      </View>
    );
  }
}

class PdfViewStyleScreen extends Component<{}> {
  render() {
    return (
      <View style={styles.page}>
        <PSPDFKitView
          ref="pdfView"
          style={pdfStyle}
          // The default file to open.
          document="ms-appx:///Assets/pdf/annualReport.pdf"/>
        <View style={styles.footer}>
          <Image
            source={require("./assets/logo-flat.png")}
            style={styles.logo}
          />
          <Text style={styles.version}>
            SDK Version : {PSPDFKit.versionString}
          </Text>
        </View>
      </View>
    );
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
    PdfViewInstantJsonScreen: {
      screen: PdfViewInstantJsonScreen
    },
    PdfViewToolbarCustomization: {
      screen: PdfViewToolbarCustomizationScreen
    },
    PdfViewStyle: {
      screen: PdfViewStyleScreen
    },
  },
  {
    initialRouteName: "Catalog"
  }
);
