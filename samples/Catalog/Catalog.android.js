//   Copyright © 2018-2019 PSPDFKit GmbH. All rights reserved.
//
//   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//   This notice may not be removed from this file.
//

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  FlatList,
  NativeModules,
  processColor,
  PermissionsAndroid,
  Dimensions
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import QRCodeScanner from "react-native-qrcode-scanner";

import PSPDFKitView from "react-native-pspdfkit";

const PSPDFKit = NativeModules.PSPDFKit;
const RNFS = require("react-native-fs");

const pspdfkitColor = "#267AD4";

const DOCUMENT = "file:///sdcard/Annual Report.pdf";
const IMAGE_DOCUMENT = "file:///sdcard/android.png";
const CONFIGURATION_IMAGE_DOCUMENT = {
  showPageNumberOverlay: false,
  showPageLabels: false,
  showThumbnailBar: "none"
};

const CONFIGURATION = {
  startPage: 3,
  scrollContinuously: false,
  showPageNumberOverlay: true,
  grayScale: true,
  showPageLabels: false,
  pageScrollDirection: "vertical",
  showThumbnailBar: "scrollable",
  // Settings this to false will disable all annotation editing
  enableAnnotationEditing: true,
  // Only stamps and square annotations will be editable, others can not be selected or otherwise modified.
  editableAnnotationTypes: ['Stamp', 'Square']
};

const examples = [
  {
    key: "item1",
    name: "Open assets document",
    description: "Open document from your project assets folder",
    action: () => {
      PSPDFKit.present("file:///android_asset/Annual Report.pdf", {});
      PSPDFKit.setPageIndex(3, false);
    }
  },
  {
    key: "item2",
    name: "Open local document",
    description: "Open document from external storage directory.",
    action: () => {
      requestExternalStoragePermission(function() {
        extractFromAssetsIfMissing("Annual Report.pdf", function() {
          PSPDFKit.present(DOCUMENT, {});
        });
      });
    }
  },
  {
    key: "item3",
    name: "Open local image document",
    description: "Open image image document from external storage directory.",
    action: () => {
      requestExternalStoragePermission(function() {
        extractFromAssetsIfMissing("android.png", function() {
          PSPDFKit.presentImage(IMAGE_DOCUMENT, CONFIGURATION_IMAGE_DOCUMENT);
        });
      });
    }
  },
  {
    key: "item4",
    name: "Configuration Builder",
    description:
      "You can configure the builder with dictionary representation of the PSPDFConfiguration object.",
    action: () => {
      requestExternalStoragePermission(function() {
        PSPDFKit.present(DOCUMENT, CONFIGURATION);
      });
    }
  },
  {
    key: "item5",
    name: "PDF View Component",
    description:
      "Show how to use the PSPDFKitView component with react-navigation.",
    action: component => {
      component.props.navigation.navigate("PdfView");
    }
  },
  {
    key: "item6",
    name: "Event Listeners",
    description:
      "Show how to use the listeners exposed by PSPDFKitView component.",
    action: component => {
      component.props.navigation.navigate("PdfViewListenersScreen");
    }
  },
  {
    key: "item7",
    name: "Programmatic Annotations",
    description: "Shows how to get and add new annotations using Instant JSON.",
    action: component => {
      component.props.navigation.navigate("PdfViewInstantJsonScreen");
    }
  },
  {
    key: "item8",
    name: "Programmatic Form Filling",
    description: "Shows how to programatically read and write PDF form values.",
    action: component => {
      component.props.navigation.navigate("PdfViewFormFillingScreen");
    }
  },
  {
    key: "item9",
    name: "Split PDF",
    description: "Show two PDFs side by side by using PSPDFKitView components.",
    action: component => {
      component.props.navigation.navigate("PdfViewSplitScreen");
    }
  },
  {
    key: "item10",
    name: "Instant Example",
    description: "Shows how to open an instant document.",
    action: component => {
      component.props.navigation.navigate("InstantExampleScreen");
    }
  },
  {
    key: "item11",
    name: "Debug Log",
    description:
      "Action used for printing stuff during development and debugging.",
    action: () => {
      console.log(PSPDFKit);
      console.log(PSPDFKit.versionString);
      // console.log(NativeModules)
    }
  }
];

function extractFromAssetsIfMissing(assetFile, callback) {
  RNFS.exists("/sdcard/" + assetFile)
    .then(exist => {
      if (exist) {
        console.log(assetFile + " exists in the external storage directory.");
        callback();
      } else {
        console.log(
          assetFile +
            " does not exist, extracting it from assets folder to the external storage directory."
        );
        RNFS.existsAssets(assetFile)
          .then(exist => {
            // Check if the file is present in the assets folder.
            if (exist) {
              // File exists so it can be extracted to the external storage directory.
              RNFS.copyFileAssets(assetFile, "/sdcard/" + assetFile)
                .then(() => {
                  // File copied successfully from assets folder to external storage directory.
                  callback();
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              // File does not exist, it should never happen.
              throw new Error(
                assetFile +
                  " couldn't be extracted as it was not found in the project assets folder."
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(error => {
      console.log(error);
    });
}

async function requestExternalStoragePermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Write external storage permission granted");
      callback();
    } else {
      console.log("Write external storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

class CatalogScreen extends Component<{}> {
  static navigationOptions = {
    title: "Catalog"
  };

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
          ItemSeparatorComponent={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </View>
    );
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  _renderRow = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => {
          item.action(this);
        }}
        style={styles.row}
        underlayColor="#209cca50"
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

class PdfViewScreen extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "PDF",
      headerRight: (
        <Button
          onPress={() => params.handleAnnotationButtonPress()}
          title="Annotations"
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      pageCount: 0,
      annotationCreationActive: false,
      annotationEditingActive: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleAnnotationButtonPress: () => {
        if (
          this.state.annotationCreationActive ||
          this.state.annotationEditingActive
        ) {
          this.refs.pdfView.exitCurrentlyActiveMode();
        } else {
          this.refs.pdfView.enterAnnotationCreationMode();
        }
      }
    });
  }

  render() {
    let buttonTitle = "";
    if (this.state.annotationCreationActive) {
      buttonTitle = "Exit Annotation Creation Mode";
    } else if (this.state.annotationEditingActive) {
      buttonTitle = "Exit Annotation Editing Mode";
    } else {
      buttonTitle = "Enter Annotation Creation Mode";
    }

    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document="file:///android_asset/Annual Report.pdf"
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          pageIndex={this.state.currentPageIndex}
          fragmentTag="PDF1"
          menuItemGrouping={[
            "freetext",
            { key: "markup", items: ["highlight", "underline"] },
            "ink",
            "image"
          ]}
          onStateChanged={event => {
            this.setState({
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount,
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive
            });
          }}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            padding: 10
          }}
        >
          <Text style={{ flex: 1 }}>
            {"Page " +
              (this.state.currentPageIndex + 1) +
              " of " +
              this.state.pageCount}
          </Text>
          <View>
            <Button
              onPress={() => {
                this.setState(previousState => {
                  return {
                    currentPageIndex: previousState.currentPageIndex - 1
                  };
                });
              }}
              disabled={this.state.currentPageIndex == 0}
              title="Previous Page"
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => {
                this.setState(previousState => {
                  return {
                    currentPageIndex: previousState.currentPageIndex + 1
                  };
                });
              }}
              disabled={this.state.currentPageIndex == this.state.pageCount - 1}
              title="Next Page"
            />
          </View>
        </View>
      </View>
    );
  }
}

class PdfViewSplitScreen extends Component<{}> {
  static navigationOptions = {
    title: "PDF"
  };

  constructor(props) {
    super(props);
    this.state = { dimensions: undefined };
  }

  render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View
        style={{
          flex: 1,
          flexDirection: layoutDirection,
          justifyContent: "center"
        }}
        onLayout={this._onLayout}
      >
        <PSPDFKitView
          document="file:///android_asset/Annual Report.pdf"
          configuration={{
            backgroundColor: processColor("lightgrey")
          }}
          pageIndex={4}
          fragmentTag="PDF1"
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <PSPDFKitView
          document="file:///android_asset/Business Report.pdf"
          configuration={{
            scrollContinuously: true,
            pageScrollDirection: "vertical",
            showThumbnailBar: "none"
          }}
          fragmentTag="PDF2"
          style={{ flex: 1, color: "#9932CC" }}
        />
      </View>
    );
  }

  _getOptimalLayoutDirection = () => {
    const width = this.state.dimensions
      ? this.state.dimensions.width
      : Dimensions.get("window").width;
    return width > 450 ? "row" : "column";
  };

  _onLayout = event => {
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };
}

class PdfViewListenersScreen extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Event Listeners",
      headerRight: (
        <Button
          onPress={() => params.handleAnnotationButtonPress()}
          title="Annotations"
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleAnnotationButtonPress: () => {
        if (
          this.state.annotationCreationActive ||
          this.state.annotationEditingActive
        ) {
          this.refs.pdfView.exitCurrentlyActiveMode();
        } else {
          this.refs.pdfView.enterAnnotationCreationMode();
        }
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          // If you want saving to work point this to a file on the sdcard.
          document="file:///android_asset/Annual Report.pdf"
          configuration={{}}
          fragmentTag="PDF1"
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive
            });
          }}
          onDocumentSaved={e => {
            alert("Document was saved!");
          }}
          onDocumentSaveFailed={e => {
            alert("Document couldn't be saved: " + e.error);
          }}
          onAnnotationTapped={e => {
            alert("Annotation was tapped\n" + JSON.stringify(e));
          }}
          onAnnotationsChanged={e => {
            alert("Annotations changed\n" + JSON.stringify(e));
          }}
          style={{ flex: 1, color: pspdfkitColor }}
        />
      </View>
    );
  }
}

class PdfViewInstantJsonScreen extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Programmatic Annotations",
      headerRight: (
        <Button
          onPress={() => params.handleAnnotationButtonPress()}
          title="Annotations"
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleAnnotationButtonPress: () => {
        if (
          this.state.annotationCreationActive ||
          this.state.annotationEditingActive
        ) {
          this.refs.pdfView.exitCurrentlyActiveMode();
        } else {
          this.refs.pdfView.enterAnnotationCreationMode();
        }
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document="file:///android_asset/Annual Report.pdf"
          configuration={{ showThumbnailBar: "pinned" }}
          fragmentTag="PDF1"
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive
            });
          }}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // This gets all annotations in the document.
                this.refs.pdfView.getAllAnnotations().then(annotations => {
                  alert(JSON.stringify(annotations));
                });
              }}
              title="Get annotations"
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => {
                // This adds a new ink annotation to the first page.
                this.refs.pdfView
                  .addAnnotation({
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
                    name: "my annotation",
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
                  })
                  .then(result => {
                    if (result) {
                      alert("Annotation was added.");
                    } else {
                      alert("Annotation was not added.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="Add annotation"
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Button
              onPress={() => {
                // This removes the first annotation on the first page.
                this.refs.pdfView.getAnnotations(0, null).then(results => {
                  const annotations = results.annotations;
                  if (annotations.length >= 1) {
                    const annotation = annotations[0];
                    this.refs.pdfView
                      .removeAnnotation(annotation)
                      .then(result => {
                        if (result) {
                          alert("Annotation was removed.");
                        } else {
                          alert("Annotation was not removed.");
                        }
                      })
                      .catch(error => {
                        alert(JSON.stringify(error));
                      });
                  }
                });
              }}
              title="Remove annotation"
            />
          </View>
        </View>
      </View>
    );
  }
}

class PdfViewFormFillingScreen extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Programmatic Form Filling"
    };
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document="file:///android_asset/Form_example.pdf"
          configuration={{}}
          fragmentTag="PDF1"
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // Fill Text Form Fields.
                Promise.all(
                  this.refs.pdfView.setFormFieldValue("Name_Last", "Appleseed"),
                  this.refs.pdfView.setFormFieldValue("Name_First", "John"),
                  this.refs.pdfView.setFormFieldValue(
                    "Address_1",
                    "1 Infinite Loop"
                  ),
                  this.refs.pdfView.setFormFieldValue("City", "Cupertino"),
                  this.refs.pdfView.setFormFieldValue("STATE", "CA"),
                  this.refs.pdfView.setFormFieldValue("SSN", "123456789"),
                  this.refs.pdfView.setFormFieldValue(
                    "Telephone_Home",
                    "(123) 456-7890"
                  ),
                  this.refs.pdfView.setFormFieldValue("Birthdate", "1/1/1983"),

                  // Select a button form elements.
                  this.refs.pdfView.setFormFieldValue("Sex.0", "selected"),
                  this.refs.pdfView.setFormFieldValue("PHD", "selected")
                ).then(result => {
                  // Called when all form field values were set.
                  // If you want to fill forms then save the document this is the place to do it.
                  alert("All forms filled!");
                });
              }}
              title="Fill Forms"
            />
          </View>
          <View>
            <Button
              onPress={async () => {
                // Get the First Name Value.
                const firstNameValue = await this.refs.pdfView.getFormFieldValue(
                  "Name_Last"
                );
                alert(JSON.stringify(firstNameValue));
              }}
              title="Get Last Name Value"
            />
          </View>
        </View>
      </View>
    );
  }
}

class InstantExampleScreen extends Component<{}> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "PSPDFKit Instant"
    };
  };

  onSuccess = qrData => {
    const documentInfoUrl = qrData.data;
    fetch(documentInfoUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error message.");
      })
      .then(data => {
        this.props.navigation.popToTop();
        PSPDFKit.presentInstant(data.serverUrl, data.jwt, {});
      })
      .catch(e => {
        console.log("failed to load ", url, e.message);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.navigation.isFocused && (
          <QRCodeScanner
            onRead={this.onSuccess}
            topContent={
              <Text style={styles.centerText}>
                Scan the QR code from{" "}
                <Text style={styles.textBold}>pspdfkit.com/instant/demo</Text>{" "}
                to connect to the document shown in your browser.
              </Text>
            }
          />
        )}
      </View>
    );
  }
}

export default createAppContainer(
  createStackNavigator(
    {
      Catalog: {
        screen: CatalogScreen
      },
      PdfView: {
        screen: PdfViewScreen
      },
      PdfViewSplitScreen: {
        screen: PdfViewSplitScreen
      },
      PdfViewListenersScreen: {
        screen: PdfViewListenersScreen
      },
      PdfViewInstantJsonScreen: {
        screen: PdfViewInstantJsonScreen
      },
      PdfViewFormFillingScreen: {
        screen: PdfViewFormFillingScreen
      },
      InstantExampleScreen: {
        screen: InstantExampleScreen
      }
    },
    {
      initialRouteName: "Catalog"
    }
  )
);

var styles = StyleSheet.create({
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
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  }
});
