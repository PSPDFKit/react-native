//  Copyright © 2016-2019 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
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
  Modal,
  Dimensions
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
const RNFS = require("react-native-fs");

import PSPDFKitView from "react-native-pspdfkit";
const PSPDFKit = NativeModules.PSPDFKit;

PSPDFKit.setLicenseKey("YOUR_LICENSE_KEY_GOES_HERE");

const pspdfkitColor = "#267AD4";
const pspdfkitColorAlpha = "#267AD450";

const examples = [
  {
    key: "item1",
    name: "Open document using resource path",
    description: "Open document from your resource bundle with relative path.",
    action: () => {
      PSPDFKit.present("PDFs/Annual Report.pdf", {});
    }
  },
  {
    key: "item2",
    name: "Open document with absolute path",
    description:
      "Opens document from application Documents directory by passing the absolute path.",
    action: () => {
      const filename = "Annual Report.pdf";

      const path = RNFS.DocumentDirectoryPath + "/" + filename;
      const src = RNFS.MainBundlePath + "/PDFs/" + filename;

      RNFS.exists(path)
        .then(exists => {
          if (!exists) {
            return RNFS.copyFile(src, path);
          }
        })
        .then(() => {
          PSPDFKit.present(path, {});
          PSPDFKit.setPageIndex(3, false);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }
  },
  {
    key: "item3",
    name: "Configured Controller",
    description:
      "You can configure the controller with dictionary representation of the PSPDFConfiguration object.",
    action: () => {
      PSPDFKit.present("PDFs/Annual Report.pdf", {
        pageScrollDirection: "horizontal",
        backgroundColor: processColor("white"),
        showThumbnailBar: "scrollable",
        pageTransition: "scrollContinuous",
        showPageLabels: false,
        showDocumentLabel: true,
        inlineSearch: true
      });
    }
  },
  {
    key: "item4",
    name: "PDF View Component",
    description: "Show how to use the PSPDFKitView component with Navigator.",
    action: component => {
      component.props.navigation.push("ConfiguredPDFViewComponent");
    }
  },
  {
    key: "item5",
    name: "Event Listeners",
    description:
      "Show how to use the listeners exposed by PSPDFKitView component.",
    action: component => {
      component.props.navigation.push("EventListeners");
    }
  },
  {
    key: "item6",
    name: "Change Pages Buttons",
    description: "Adds a toolbar at the bottom with buttons to change pages.",
    action: component => {
      component.props.navigation.push("ChangePages");
    }
  },
  {
    key: "item7",
    name: "Enter and Exit the Annotation Creation Mode",
    description:
      "Adds a toolbar at the bottom with a button to toggle the annotation toolbar.",
    action: component => {
      component.props.navigation.push("AnnotationCreationMode");
    }
  },
  {
    key: "item8",
    name: "Manual Save",
    description:
      "Adds a toolbar at the bottom with a Save button and disables automatic saving.",
    action: component => {
      component.props.navigation.push("ManualSave");
    }
  },
  {
    key: "item9",
    name: "Split PDF",
    description: "Show two PDFs side by side by using PSPDFKitView components.",
    action: component => {
      component.props.navigation.navigate("SplitPDF");
    }
  },
  {
    key: "item10",
    name: "Programmatic Annotations",
    description: "Shows how to get and add new annotations using Instant JSON.",
    action: component => {
      component.props.navigation.push("ProgrammaticAnnotations");
    }
  },
  {
    key: "item11",
    name: "Programmatic Form Filling",
    description:
      "Shows how to get the value of a form element and how to programmatically fill forms.",
    action: component => {
      component.props.navigation.push("ProgrammaticFormFilling");
    }
  },
  {
    key: "item12",
    name: "Debug Log",
    description:
      "Action used for printing stuff during development and debugging.",
    action: () => {
      console.log(PSPDFKit);
      console.log(PSPDFKit.versionString);
    }
  },
  {
    key: "item13",
    name: "Custom Sharing Options",
    description: "Customize the sharing options for a document.",
    action: () => {
      PSPDFKit.present("PDFs/Annual Report.pdf", {
        backgroundColor: processColor("white"),
        showThumbnailBar: "scrollable",
        pageTransition: "scrollContinuous",
        pageScrollDirection: "vertical",
        sharingConfigurations: [
          {
            annotationOptions: ["flatten"],
            pageSelectionOptions: ["all", "annotated"]
          }
        ]
      });
    }
  },
  {
    key: "item14",
    name: "Customize the Toolbar",
    description: "Shows how to customize the buttons in the toolbar.",
    action: component => {
      component.props.navigation.push("ToolbarCustomization");
    }
  }
];

class SplitPDF extends Component {
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
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          pageIndex={4}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <PSPDFKitView
          document={"PDFs/Business Report.pdf"}
          configuration={{
            pageTransition: "scrollContinuous",
            pageScrollDirection: "vertical",
            pageMode: "single"
          }}
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

class ConfiguredPDFViewComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrubberBar",
            showDocumentLabel: false,
            useParentNavigationBar: false,
            allowToolbarTitleChange: false
          }}
          toolbarTitle={"Custom Title"}
          style={{ flex: 1, color: pspdfkitColor }}
        />
      </View>
    );
  }
}

class EventListeners extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          style={{ flex: 1, color: pspdfkitColor }}
          // Event Listeners
          onAnnotationsChanged={event => {
            if (event["error"]) {
              alert(event["error"]);
            } else {
              alert(
                "Annotations " +
                  event["change"] +
                  ": " +
                  JSON.stringify(event["annotations"])
              );
            }
          }}
          onAnnotationTapped={event => {
            if (event["error"]) {
              alert(event["error"]);
            } else {
              alert("Tapped on Annotation: " + JSON.stringify(event));
            }
          }}
          onDocumentSaved={event => {
            if (event["error"]) {
              alert(event["error"]);
            } else {
              alert("Document Saved!");
            }
          }}
        />
      </View>
    );
  }
}

class ChangePages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      pageCount: 0
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          pageIndex={this.state.currentPageIndex}
          style={{ flex: 1, color: pspdfkitColor }}
          onStateChanged={event => {
            this.setState({
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount
            });
          }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <Text>
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

class AnnotationCreationMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false
    };
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
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          menuItemGrouping={[
            "freetext",
            { key: "markup", items: ["highlight", "underline"] },
            "ink",
            "image"
          ]}
          pageIndex={this.state.currentPageIndex}
          style={{ flex: 1, color: pspdfkitColor }}
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive
            });
          }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                if (
                  this.state.annotationCreationActive ||
                  this.state.annotationEditingActive
                ) {
                  this.refs.pdfView.exitCurrentlyActiveMode();
                } else {
                  this.refs.pdfView.enterAnnotationCreationMode();
                }
              }}
              title={buttonTitle}
            />
          </View>
        </View>
      </View>
    );
  }
}

class ManualSave extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document={"PDFs/Annual Report.pdf"}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // Manual Save
                this.refs.pdfView.saveCurrentDocument();
              }}
              title="Save"
            />
          </View>
        </View>
      </View>
    );
  }
}

class ProgrammaticAnnotations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0
    };
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document={"PDFs/Annual Report.pdf"}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          style={{ flex: 1, color: pspdfkitColor }}
          onStateChanged={event => {
            this.setState({
              currentPageIndex: event.currentPageIndex
            });
          }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // Programmatically add an ink annotation.
                const annotationJSON = {
                  bbox: [
                    89.586334228515625,
                    98.5791015625,
                    143.12948608398438,
                    207.1583251953125
                  ],
                  isDrawnNaturally: false,
                  lineWidth: 5,
                  lines: {
                    intensities: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]],
                    points: [
                      [
                        [92.086334228515625, 101.07916259765625],
                        [92.086334228515625, 202.15826416015625],
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
                  name: "A167811E-6D10-4546-A147-B7AD775FE8AC",
                  strokeColor: "#AA47BE",
                  type: "pspdfkit/ink",
                  v: 1
                };
                this.refs.pdfView
                  .addAnnotation(annotationJSON)
                  .then(result => {
                    if (result) {
                      alert("Annotation was successfully added.");
                    } else {
                      alert("Failed to add annotation.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="addAnnotation"
            />
          </View>
          <View>
            <Button
              onPress={async () => {
                // Programmatically remove an existing ink annotation.
                const inkAnnotations = await this.refs.pdfView.getAnnotations(
                  this.state.currentPageIndex,
                  "pspdfkit/ink"
                );
                const firstInkAnnotation = inkAnnotations["annotations"][0];
                this.refs.pdfView
                  .removeAnnotation(firstInkAnnotation)
                  .then(result => {
                    if (result) {
                      alert("Annotation was successfully removed.");
                    } else {
                      alert("Failed to remove annotation.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="removeAnnotation"
            />
          </View>
          <View>
            <Button
              onPress={() => {
                // Programmatically add multiple annotations.
                const annotationsJSON = {
                  annotations: [
                    {
                      v: 1,
                      createdAt: "2018-07-30T15:34:48Z",
                      bbox: [
                        89.58633422851562,
                        98.5791015625,
                        143.12948608398438,
                        207.1583251953125
                      ],
                      type: "pspdfkit/ink",
                      lines: {
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
                        ],
                        intensities: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]]
                      },
                      isDrawnNaturally: false,
                      strokeColor: "#AA47BE",
                      name: "A167811E-6D10-4546-A147-B7AD775FE8AC",
                      updatedAt: "2018-07-30T15:34:48Z",
                      pageIndex: 0,
                      opacity: 1,
                      lineWidth: 5,
                      blendMode: "normal",
                      id: "01CKNX7TVEGWMJDPTS9BN3RH9M"
                    },
                    {
                      v: 1,
                      createdAt: "2018-07-30T15:29:54Z",
                      creatorName: "radazzouz",
                      lines: {
                        points: [
                          [
                            [243.78179931640625, 510.1141357421875],
                            [244.36361694335938, 510.1141357421875],
                            [258.9090881347656, 506.033203125],
                            [295.5636291503906, 496.7054443359375],
                            [349.6726989746094, 489.1265869140625],
                            [365.3818054199219, 489.1265869140625],
                            [393.8908996582031, 489.1265869140625],
                            [406.10906982421875, 489.1265869140625],
                            [411.92724609375, 496.7054443359375],
                            [411.92724609375, 526.4378051757812],
                            [389.236328125, 578.3236694335938],
                            [375.272705078125, 602.2261962890625],
                            [364.2181701660156, 618.5498046875],
                            [354.3272399902344, 631.95849609375],
                            [349.09088134765625, 639.537353515625],
                            [351.9999694824219, 645.9501953125],
                            [392.7272644042969, 661.10791015625],
                            [477.09088134765625, 672.7677001953125],
                            [557.3817749023438, 673.93359375],
                            [591.1272583007812, 673.3506469726562],
                            [616.7272338867188, 669.8527221679688],
                            [635.92724609375, 665.7718505859375],
                            [642.9090576171875, 661.10791015625],
                            [642.9090576171875, 657.6099853515625],
                            [638.8363037109375, 654.695068359375],
                            [632.4363403320312, 652.3630981445312],
                            [625.4545288085938, 652.3630981445312]
                          ]
                        ],
                        intensities: [
                          [
                            1,
                            1,
                            0.7831191420555115,
                            0.43985339999198914,
                            0.1946841925382614,
                            0.7731151580810547,
                            0.5821600556373596,
                            0.8237775564193726,
                            0.8645909428596497,
                            0.5631009936332703,
                            0.16183285415172577,
                            0.5931986570358276,
                            0.7281508445739746,
                            0.7529339790344238,
                            0.8639607429504395,
                            0.90201336145401,
                            0.38276368379592896,
                            0,
                            0,
                            0.5024968385696411,
                            0.6254040002822876,
                            0.7100088000297546,
                            0.8816311359405518,
                            0.9544336199760437,
                            0.932301938533783,
                            0.905599057674408,
                            0.9035883545875549
                          ]
                        ]
                      },
                      isDrawnNaturally: true,
                      strokeColor: "#1E59FF",
                      updatedAt: "2018-07-30T15:29:54Z",
                      pageIndex: 0,
                      name: "1F291E11-0696-436B-A8E5-0386371E07B7",
                      opacity: 1,
                      note: "",
                      lineWidth: 4,
                      blendMode: "normal",
                      type: "pspdfkit/ink",
                      bbox: [
                        243.78179931640625,
                        486.64892578125,
                        397.9429931640625,
                        188.1041259765625
                      ],
                      id: "01CKNX7TVF7ESF8Z4FR5Q4APEJ"
                    }
                  ],
                  format: "https://pspdfkit.com/instant-json/v1"
                };
                this.refs.pdfView
                  .addAnnotations(annotationsJSON)
                  .then(result => {
                    if (result) {
                      alert("Annotations were successfully added.");
                    } else {
                      alert("Failed to add annotations.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="addAnnotations"
            />
          </View>
          <View>
            <Button
              onPress={async () => {
                // Get ink annotations from the current page.
                await this.refs.pdfView
                  .getAnnotations(this.state.currentPageIndex, "pspdfkit/ink")
                  .then(result => {
                    if (result) {
                      alert(JSON.stringify(result));
                    } else {
                      alert("Failed to get annotations.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="getAnnotations"
            />
          </View>
          <View>
            <Button
              onPress={async () => {
                // Get all unsaved annotations from the document.
                await this.refs.pdfView
                  .getAllUnsavedAnnotations()
                  .then(result => {
                    if (result) {
                      alert(JSON.stringify(result));
                    } else {
                      alert("Failed to get unsaved annotations.");
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="getAllUnsavedAnnotations"
            />
          </View>
        </View>
      </View>
    );
  }
}

class ProgrammaticFormFilling extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document={"PDFs/Form_example.pdf"}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable"
          }}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={() => {
                // Fill Text Form Fields.
                this.refs.pdfView.setFormFieldValue("Name_Last", "Appleseed");
                this.refs.pdfView.setFormFieldValue("Name_First", "John");
                this.refs.pdfView.setFormFieldValue(
                  "Address_1",
                  "1 Infinite Loop"
                );
                this.refs.pdfView.setFormFieldValue("City", "Cupertino");
                this.refs.pdfView.setFormFieldValue("STATE", "CA");
                this.refs.pdfView.setFormFieldValue("SSN", "123456789");
                this.refs.pdfView.setFormFieldValue(
                  "Telephone_Home",
                  "(123) 456-7890"
                );
                this.refs.pdfView.setFormFieldValue("Birthdate", "1/1/1983");

                // Select a button form elements.
                this.refs.pdfView.setFormFieldValue("Sex.0", "selected");
                this.refs.pdfView.setFormFieldValue("PHD", "selected");
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

class ToolbarCustomization extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document={"PDFs/Annual Report.pdf"}
          configuration={{
            backgroundColor: processColor("lightgrey"),
            showThumbnailBar: "scrollable",
            useParentNavigationBar: false
          }}
          leftBarButtonItems={["settingsButtonItem"]}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            padding: 10
          }}
        >
          <View>
            <Button
              onPress={async () => {
                // Update the right bar buttons.
                await this.refs.pdfView.setRightBarButtonItems(
                  [
                    "thumbnailsButtonItem",
                    "searchButtonItem",
                    "annotationButtonItem"
                  ],
                  "document",
                  false
                );
              }}
              title="Set right bar button items"
            />
          </View>

          <View>
            <Button
              onPress={async () => {
                // Get the right bar buttons.
                const rightBarButtonItems = await this.refs.pdfView.getRightBarButtonItemsForViewMode(
                  "document"
                );
                alert(JSON.stringify(rightBarButtonItems));
              }}
              title="Get right bar button items"
            />
          </View>
        </View>
      </View>
    );
  }
}

class Catalog extends Component<{}> {
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
      <View style={{ flex: 1 }}>
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
          contentInset={{ bottom: 22 }}
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
        underlayColor={pspdfkitColor}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  };
}

export default createAppContainer(
  createStackNavigator(
    {
      Catalog: {
        screen: Catalog
      },
      ConfiguredPDFViewComponent: {
        screen: ConfiguredPDFViewComponent
      },
      EventListeners: {
        screen: EventListeners
      },
      ChangePages: {
        screen: ChangePages
      },
      AnnotationCreationMode: {
        screen: AnnotationCreationMode
      },
      ManualSave: {
        screen: ManualSave
      },
      SplitPDF: {
        screen: SplitPDF
      },
      ProgrammaticAnnotations: {
        screen: ProgrammaticAnnotations
      },
      ProgrammaticFormFilling: {
        screen: ProgrammaticFormFilling
      },
      ToolbarCustomization: {
        screen: ToolbarCustomization
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
  header: {
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#eee"
  },
  version: {
    color: "#666666",
    marginTop: 10,
    marginBottom: 20
  },
  logo: {
    marginTop: 20
  },
  listContainer: {
    backgroundColor: "white"
  },
  list: {
    backgroundColor: "#eee"
  },
  name: {
    color: pspdfkitColor,
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
