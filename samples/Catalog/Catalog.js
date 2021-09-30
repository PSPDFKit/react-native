//  Copyright © 2016-2021 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

// Imports
import React, {Component} from 'react';
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
  Dimensions,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import PSPDFKitView from 'react-native-pspdfkit';

// Constants
const PSPDFKit = NativeModules.PSPDFKit;
const fileSystem = require('react-native-fs');
const pspdfkitColor = '#267AD4';

// By default, this example doesn't set a license key, but instead runs in trial mode (which is the default, and which requires no
// specific initialization). If you want to use a different license key for evaluation (e.g. a production license), you can uncomment
// the next line and set the license key.
//
// To set the license key for both platforms, use:
// PSPDFKit.setLicenseKeys("YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE", "YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE");
//
// To set the license key for the currently running platform, use:
// PSPDFKit.setLicenseKey("YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE");

// Document names
const exampleDocumentName = 'PSPDFKit_Quickstart_Guide.pdf';
const formDocumentName = 'Form_Example.pdf';
const tiffImageName = 'PSPDFKit_Image_Example.tiff';

// Document paths
const exampleDocumentPath =
  Platform.OS === 'ios'
    ? 'PDFs/' + exampleDocumentName
    : 'file:///android_asset/' + exampleDocumentName;
const formDocumentPath =
  Platform.OS === 'ios'
    ? 'PDFs/' + formDocumentName
    : 'file:///android_asset/' + formDocumentName;
const tiffImagePath =
  Platform.OS === 'ios'
    ? 'PDFs/' + tiffImageName
    : 'file:///android_asset/' + tiffImageName;
const writableDocumentPath = fileSystem.DocumentDirectoryPath + '/' + exampleDocumentName;

// Configurations
const exampleConfiguration = {
  // This is the page that the document will start on.
  startPage: 0,
  backgroundColor: processColor('white'),
  showPageNumberOverlay: true,
  grayScale: false,
  showPageLabels: false,
  showDocumentLabel: true,
  inlineSearch: true,
  scrollContinuously: true,
  pageTransition: 'scrollContinuous',
  pageScrollDirection: 'vertical',
  showThumbnailBar: 'scrollable',
  // Settings this to false will disable all annotation editing
  enableAnnotationEditing: true,
  // Only stamps and square annotations will be editable, others can not be selected or otherwise modified.
  editableAnnotationTypes: ['Stamp', 'Square'],
};

const tiffImageConfiguration = {
  showPageNumberOverlay: false,
  showPageLabels: false,
  showThumbnailBar: 'none',
};

const examples = [
  {
    key: 'item1',
    name: 'PSPDFKitView Component',
    description:
      'Show how to use the PSPDFKitView component with react-navigation.',
    action: component => {
      component.props.navigation.push('PSPDFKitViewComponent');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item2',
    name: 'Open an Image in a PSPDFKitView Component',
    description:
      'Show how to open and annotate an image document inside a PSPDFKitView component.',
    action: component => {
      component.props.navigation.push('OpenImageDocument');
    },
  },
  {
    key: 'item3',
    name: 'Manual Save',
    description:
      'Add a toolbar at the bottom with a Save button and disable automatic saving.',
    action: component => {
      extractFromAssetsIfMissing(exampleDocumentName, function () {
        component.props.navigation.push('ManualSave');
      });
    },
  },
  {
    key: 'item4',
    name: 'Event Listeners',
    description:
      'Show how to use the listeners exposed by the PSPDFKitView component.',
    action: component => {
      component.props.navigation.push('EventListeners');
    },
  },
  {
    key: 'item5',
    name: 'Changing the State',
    description:
      'Add a toolbar at the bottom with buttons to toggle the annotation toolbar, and to programmatically change pages.',
    action: component => {
      component.props.navigation.push('StateChange');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item6',
    name: 'Annotation Processing',
    description:
      'Show how to embed, flatten, remove, and print annotations; then present the newly processed document.',
    action: component => {
      extractFromAssetsIfMissing(exampleDocumentName, function () {
        component.props.navigation.push('AnnotationProcessing');
      });
    },
  },
  {
    key: 'item7',
    name: 'Programmatic Annotations',
    description: 'Show how to get and add new annotations using Instant JSON.',
    action: component => {
      component.props.navigation.push('ProgrammaticAnnotations');
    },
  },
  {
    key: 'item8',
    name: 'Programmatic Form Filling',
    description:
      'Show how to get the value of a form element and how to programmatically fill forms.',
    action: component => {
      component.props.navigation.push('ProgrammaticFormFilling');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item9',
    name: 'Split PDF',
    description:
      'Show two PDFs side by side by using multiple PSPDFKitView components.',
    action: component => {
      component.props.navigation.navigate('SplitPDF');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item10',
    name: 'Customize the Toolbar',
    description: 'Show how to customize buttons in the toolbar.',
    action: component => {
      component.props.navigation.push('ToolbarCustomization');
    },
  },
  {
    key: 'item11',
    name: 'Hidden Toolbar',
    description:
      'Hide the main toolbar while keeping the thumbnail bar visible.',
    action: component => {
      component.props.navigation.push('HiddenToolbar');
    },
  },
  {
    key: 'item12',
    name: 'Custom Font Picker',
    description:
      'Show how to customize the font picker for free text annotations.',
    action: component => {
      component.props.navigation.push('CustomFontPicker');
    },
  },
  /// Present examples.
  {
    key: 'item13',
    name: 'Open a Document Using the Native Module API',
    description:
      'Open a document using the Native Module API by passing its path.',
    action: () => {
      PSPDFKit.present(exampleDocumentPath, {})
        .then(loaded => {
          console.log('Document was loaded successfully.');
        })
        .catch(error => {
          console.log(error);
        });
      // This opens the document on the fourth page.
      PSPDFKit.setPageIndex(3, false);
    },
  },
  {
    key: 'item14',
    name: 'Customize Document Configuration',
    description:
      'Customize various aspects of the document by passing a configuration dictionary.',
    action: () => {
      PSPDFKit.present(exampleDocumentPath, exampleConfiguration);
    },
  },
  {
    key: 'item15',
    name: 'Open an Image Document Using the Native Module API',
    description:
      'Open an image document using the Native Module API. Supported filetypes are PNG, JPEG and TIFF.',
    action: () => {
      // PSPDFKit can open PNG, JPEG and TIFF image files directly.
      if (Platform.OS === 'ios') {
        PSPDFKit.present(tiffImagePath, tiffImageConfiguration);
      }
      if (Platform.OS === 'android') {
        PSPDFKit.presentImage(tiffImagePath, tiffImageConfiguration);
      }
    },
  },
];

class Catalog extends Component {
  static navigationOptions = {
    title: 'Catalog',
  };

  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      dataSource: examples.filter(element => {
        return element != null && element != [];
      }),
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Image
            source={require('./assets/logo-flat.png')}
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
          contentInset={{bottom: 22}}
        />
      </View>
    );
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />;
  }

  _renderRow = ({item}) => {
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
class AutoHidingHeaderComponent extends Component {
  static navigationOptions = ({navigation}) => {
    if (Platform.OS === 'android') {
      return {
        // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
        headerShown: false,
      };
    }
  };
}

class PSPDFKitViewComponent extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            toolbarTitle: 'My Awesome Report',
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={event => {
            this.props.navigation.goBack();
          }}
          menuItemGrouping={[
            'freetext',
            {key: 'markup', items: ['highlight', 'underline']},
            'ink',
            'image',
          ]}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}

class OpenImageDocument extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          document={tiffImagePath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showPageLabels: false,
            useParentNavigationBar: false,
            allowToolbarTitleChange: false,
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}

class ManualSave extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={{flex: 1}}>
            <Button
              onPress={() => {
                // Manual Save
                this.refs.pdfView
                  .saveCurrentDocument()
                  .then(saved => {
                    if (saved) {
                      alert('Successfully saved current document.');
                    } else {
                      alert('Document was not saved as it was not modified.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="Save"
            />
          </View>
        </View>
      </View>
    );
  }
}

class EventListeners extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
          // Event Listeners
          onAnnotationsChanged={event => {
            if (event['error']) {
              alert(event['error']);
            } else {
              alert(
                'Annotations ' +
                  event['change'] +
                  ': ' +
                  JSON.stringify(event['annotations']),
              );
            }
          }}
          onAnnotationTapped={event => {
            if (event['error']) {
              alert(event['error']);
            } else {
              alert('Tapped on Annotation: ' + JSON.stringify(event));
            }
          }}
          onDocumentSaved={event => {
            if (event['error']) {
              alert(event['error']);
            } else {
              alert('Document Saved!');
            }
          }}
        />
      </View>
    );
  }
}
class StateChange extends AutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
      pageCount: 0,
      annotationCreationActive: false,
      annotationEditingActive: false,
    };
  }

  render() {
    let buttonTitle = '';
    if (this.state.annotationCreationActive) {
      buttonTitle = 'Exit Annotation Creation Mode';
    } else if (this.state.annotationEditingActive) {
      buttonTitle = 'Exit Annotation Editing Mode';
    } else {
      buttonTitle = 'Enter Annotation Creation Mode';
    }
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={[
            'freetext',
            {key: 'markup', items: ['highlight', 'underline']},
            'ink',
            'image',
          ]}
          pageIndex={this.state.currentPageIndex}
          style={{flex: 1, color: pspdfkitColor}}
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
              currentPageIndex: event.currentPageIndex,
              pageCount: event.pageCount,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Text style={{flex: 1}}>
              {'Page ' +
                (this.state.currentPageIndex + 1) +
                ' of ' +
                this.state.pageCount}
            </Text>
            <Button
              onPress={() => {
                this.setState(previousState => {
                  return {
                    currentPageIndex: previousState.currentPageIndex - 1,
                  };
                });
              }}
              disabled={this.state.currentPageIndex == 0}
              title="Previous Page"
            />
            <View style={{marginLeft: 10}}>
              <Button
                onPress={() => {
                  this.setState(previousState => {
                    return {
                      currentPageIndex: previousState.currentPageIndex + 1,
                    };
                  });
                }}
                disabled={
                  this.state.currentPageIndex == this.state.pageCount - 1
                }
                title="Next Page"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

class AnnotationProcessing extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <View>
              <Button
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/embedded.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    // First, save all annotations in the current document.
                    .then(() => {
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, embed all the annotations
                          PSPDFKit.processAnnotations(
                            'embed',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with embedded annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to embed annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
                        });
                    });
                }}
                title="Embed Annotations"
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Button
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/flattened.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, flatten all the annotations
                          PSPDFKit.processAnnotations(
                            'flatten',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with flattened annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to embed annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
                        });
                    });
                }}
                title="Flatten Annotations"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <View>
              <Button
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/removed.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(saved => {
                          // Then, remove all the annotations
                          PSPDFKit.processAnnotations(
                            'remove',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with removed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to remove annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
                        });
                    });
                }}
                title="Remove Annotations"
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Button
                onPress={async () => {
                  const processedDocumentPath =
                    fileSystem.DocumentDirectoryPath + '/printed.pdf';
                  // Delete the processed document if it already exists.
                  fileSystem
                    .exists(processedDocumentPath)
                    .then(exists => {
                      if (exists) {
                        fileSystem.unlink(processedDocumentPath);
                      }
                    })
                    .then(() => {
                      // First, save all annotations in the current document.
                      this.refs.pdfView
                        .saveCurrentDocument()
                        .then(success => {
                          // Then, print all the annotations
                          PSPDFKit.processAnnotations(
                            'print',
                            'all',
                            writableDocumentPath,
                            processedDocumentPath,
                          )
                            .then(success => {
                              if (success) {
                                // And finally, present the newly processed document with printed annotations.
                                PSPDFKit.present(processedDocumentPath, {});
                              } else {
                                alert('Failed to print annotations.');
                              }
                            })
                            .catch(error => {
                              alert(JSON.stringify(error));
                            });
                        })
                        .catch(error => {
                          alert(JSON.stringify(error));
                        });
                    });
                }}
                title="Print Annotations"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

class ProgrammaticAnnotations extends AutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPageIndex: 0,
    };
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
          onStateChanged={event => {
            this.setState({
              currentPageIndex: event.currentPageIndex,
            });
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <View>
              <Button
                onPress={() => {
                  // Programmatically add an ink annotation.
                  const annotationJSON = {
                    bbox: [
                      89.586334228515625, 98.5791015625, 143.12948608398438,
                      207.1583251953125,
                    ],
                    isDrawnNaturally: false,
                    lineWidth: 5,
                    lines: {
                      intensities: [
                        [0.5, 0.5, 0.5],
                        [0.5, 0.5, 0.5],
                      ],
                      points: [
                        [
                          [92.086334228515625, 101.07916259765625],
                          [92.086334228515625, 202.15826416015625],
                          [138.12950134277344, 303.2374267578125],
                        ],
                        [
                          [184.17266845703125, 101.07916259765625],
                          [184.17266845703125, 202.15826416015625],
                          [230.2158203125, 303.2374267578125],
                        ],
                      ],
                    },
                    opacity: 1,
                    pageIndex: 0,
                    name: 'A167811E-6D10-4546-A147-B7AD775FE8AC',
                    strokeColor: '#AA47BE',
                    type: 'pspdfkit/ink',
                    v: 1,
                  };
                  this.refs.pdfView
                    .addAnnotation(annotationJSON)
                    .then(result => {
                      if (result) {
                        alert('Annotation was successfully added.');
                      } else {
                        alert('Failed to add annotation.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Add Ink Annotation"
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Button
                onPress={async () => {
                  // Programmatically remove an existing ink annotation.
                  const inkAnnotations = await this.refs.pdfView.getAnnotations(
                    this.state.currentPageIndex,
                    'pspdfkit/ink',
                  );
                  const firstInkAnnotation = inkAnnotations['annotations'][0];
                  this.refs.pdfView
                    .removeAnnotation(firstInkAnnotation)
                    .then(result => {
                      if (result) {
                        alert('Annotation was successfully removed.');
                      } else {
                        alert('Failed to remove annotation.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Remove Ink Annotation"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}
          >
            <View>
              <Button
                onPress={() => {
                  // Programmatically add multiple annotations.
                  const annotationsJSON = {
                    annotations: [
                      {
                        v: 1,
                        createdAt: '2018-07-30T15:34:48Z',
                        bbox: [
                          89.58633422851562, 98.5791015625, 143.12948608398438,
                          207.1583251953125,
                        ],
                        type: 'pspdfkit/ink',
                        lines: {
                          points: [
                            [
                              [92.08633422851562, 101.07916259765625],
                              [92.08633422851562, 202.15826416015625],
                              [138.12950134277344, 303.2374267578125],
                            ],
                            [
                              [184.17266845703125, 101.07916259765625],
                              [184.17266845703125, 202.15826416015625],
                              [230.2158203125, 303.2374267578125],
                            ],
                          ],
                          intensities: [
                            [0.5, 0.5, 0.5],
                            [0.5, 0.5, 0.5],
                          ],
                        },
                        isDrawnNaturally: false,
                        strokeColor: '#AA47BE',
                        name: 'A167811E-6D10-4546-A147-B7AD775FE8AC',
                        updatedAt: '2018-07-30T15:34:48Z',
                        pageIndex: 0,
                        opacity: 1,
                        lineWidth: 5,
                        blendMode: 'normal',
                        id: '01CKNX7TVEGWMJDPTS9BN3RH9M',
                      },
                      {
                        v: 1,
                        createdAt: '2018-07-30T15:29:54Z',
                        creatorName: 'radazzouz',
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
                              [625.4545288085938, 652.3630981445312],
                            ],
                          ],
                          intensities: [
                            [
                              1, 1, 0.7831191420555115, 0.43985339999198914,
                              0.1946841925382614, 0.7731151580810547,
                              0.5821600556373596, 0.8237775564193726,
                              0.8645909428596497, 0.5631009936332703,
                              0.16183285415172577, 0.5931986570358276,
                              0.7281508445739746, 0.7529339790344238,
                              0.8639607429504395, 0.90201336145401,
                              0.38276368379592896, 0, 0, 0.5024968385696411,
                              0.6254040002822876, 0.7100088000297546,
                              0.8816311359405518, 0.9544336199760437,
                              0.932301938533783, 0.905599057674408,
                              0.9035883545875549,
                            ],
                          ],
                        },
                        isDrawnNaturally: true,
                        strokeColor: '#1E59FF',
                        updatedAt: '2018-07-30T15:29:54Z',
                        pageIndex: 0,
                        name: '1F291E11-0696-436B-A8E5-0386371E07B7',
                        opacity: 1,
                        note: '',
                        lineWidth: 4,
                        blendMode: 'normal',
                        type: 'pspdfkit/ink',
                        bbox: [
                          243.78179931640625, 486.64892578125,
                          397.9429931640625, 188.1041259765625,
                        ],
                        id: '01CKNX7TVF7ESF8Z4FR5Q4APEJ',
                      },
                    ],
                    format: 'https://pspdfkit.com/instant-json/v1',
                  };
                  this.refs.pdfView
                    .addAnnotations(annotationsJSON)
                    .then(result => {
                      if (result) {
                        alert('Annotations were successfully added.');
                      } else {
                        alert('Failed to add annotations.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Add Multiple Annotations"
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Button
                onPress={async () => {
                  // Get ink annotations from the current page.
                  await this.refs.pdfView
                    .getAnnotations(this.state.currentPageIndex, 'pspdfkit/ink')
                    .then(result => {
                      if (result) {
                        alert(JSON.stringify(result));
                      } else {
                        alert('Failed to get annotations.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Get Ink Annotations"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}
          >
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
                        alert('Failed to get unsaved annotations.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Get Unsaved Annotations"
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Button
                onPress={async () => {
                  // Get all annotations annotations from the document.
                  await this.refs.pdfView
                    .getAllAnnotations()
                    .then(result => {
                      if (result) {
                        alert(JSON.stringify(result));
                      } else {
                        alert('Failed to get all annotations.');
                      }
                    })
                    .catch(error => {
                      alert(JSON.stringify(error));
                    });
                }}
                title="Get All Annotations"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

class ProgrammaticFormFilling extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={formDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={{marginLeft: 10}}>
            <Button
              onPress={() => {
                // Fill Text Form Fields.
                this.refs.pdfView
                  .setFormFieldValue('Name_Last', 'Appleseed')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Name_First', 'John')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Address_1', '1 Infinite Loop')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('City', 'Cupertino')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('STATE', 'CA')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('SSN', '123456789')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Telephone_Home', '(123) 456-7890')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('Birthdate', '1/1/1983')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });

                // Select a button form elements.
                this.refs.pdfView
                  .setFormFieldValue('Sex.0', 'selected')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
                this.refs.pdfView
                  .setFormFieldValue('PHD', 'selected')
                  .then(result => {
                    if (result) {
                      console.log('Successfully set the form field value.');
                    } else {
                      alert('Failed to set form field value.');
                    }
                  })
                  .catch(error => {
                    alert(JSON.stringify(error));
                  });
              }}
              title="Fill Form"
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Get the First Name Value.
                const firstNameValue =
                  await this.refs.pdfView.getFormFieldValue('Name_Last');
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

class SplitPDF extends AutoHidingHeaderComponent {
  constructor(props) {
    super(props);
    this.state = {dimensions: undefined};
  }

  render() {
    const layoutDirection = this._getOptimalLayoutDirection();
    return (
      <View
        style={{
          flex: 1,
          flexDirection: layoutDirection,
          justifyContent: 'center',
        }}
        onLayout={this._onLayout}
      >
        <PSPDFKitView
          ref="pdfView1"
          document={formDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <PSPDFKitView
          ref="pdfView2"
          document={exampleDocumentPath}
          configuration={{
            pageTransition: 'scrollContinuous',
            pageScrollDirection: 'vertical',
            pageMode: 'single',
          }}
          style={{flex: 1, color: '#9932CC'}}
        />
      </View>
    );
  }

  _getOptimalLayoutDirection = () => {
    const width = this.state.dimensions
      ? this.state.dimensions.width
      : Dimensions.get('window').width;
    return width > 450 ? 'row' : 'column';
  };

  _onLayout = event => {
    let {width, height} = event.nativeEvent.layout;
    this.setState({dimensions: {width, height}});
  };
}

class ToolbarCustomization extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            useParentNavigationBar: false,
          }}
          leftBarButtonItems={['settingsButtonItem']}
          style={{flex: 1, color: pspdfkitColor}}
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            padding: 10,
          }}
        >
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Update the right bar buttons.
                await this.refs.pdfView.setRightBarButtonItems(
                  [
                    'thumbnailsButtonItem',
                    'searchButtonItem',
                    'annotationButtonItem',
                    'readerViewButtonItem',
                  ],
                  'document',
                  false,
                );
              }}
              title="Set Bar Button Items"
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Button
              onPress={async () => {
                // Get the right bar buttons.
                const rightBarButtonItems =
                  await this.refs.pdfView.getRightBarButtonItemsForViewMode(
                    'document',
                  );
                alert(JSON.stringify(rightBarButtonItems));
              }}
              title="Get Bar Button Items"
            />
          </View>
        </View>
      </View>
    );
  }
}

class HiddenToolbar extends Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    return {
      title: 'HiddenToolbar',
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <Button
            onPress={() => params.handleAnnotationButtonPress()}
            title="Annotations"
          />
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      annotationCreationActive: false,
      annotationEditingActive: false,
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
      },
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          ref="pdfView"
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            // If you want to hide the toolbar it's essential to also hide the document label overlay.
            documentLabelEnabled: false,
            // We want to keep the thumbnail bar always visible, but the automatic mode is also supported with hideDefaultToolbar.
            userInterfaceViewMode: 'alwaysVisible',
            useParentNavigationBar: true,
          }}
          // This will just hide the toolbar, keeping the thumbnail bar visible.
          hideDefaultToolbar={true}
          disableAutomaticSaving={true}
          fragmentTag="PDF1"
          onStateChanged={event => {
            this.setState({
              annotationCreationActive: event.annotationCreationActive,
              annotationEditingActive: event.annotationEditingActive,
            });
          }}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}

class CustomFontPicker extends AutoHidingHeaderComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <PSPDFKitView
          document={exampleDocumentPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showThumbnailBar: 'scrubberBar',
            useParentNavigationBar: false,
          }}
          availableFontNames={[
            'Arial',
            'Calibri',
            'Times New Roman',
            'Courier New',
            'Helvetica',
            'Comic Sans MS',
          ]}
          selectedFontName={'Courier New'}
          showDownloadableFonts={false}
          style={{flex: 1, color: pspdfkitColor}}
        />
      </View>
    );
  }
}

export default createAppContainer(
  createStackNavigator(
    {
      Catalog: {
        screen: Catalog,
      },
      PSPDFKitViewComponent: {
        screen: PSPDFKitViewComponent,
      },
      OpenImageDocument: {
        screen: OpenImageDocument,
      },
      ManualSave: {
        screen: ManualSave,
      },
      EventListeners: {
        screen: EventListeners,
      },
      StateChange: {
        screen: StateChange,
      },
      AnnotationProcessing: {
        screen: AnnotationProcessing,
      },
      ProgrammaticAnnotations: {
        screen: ProgrammaticAnnotations,
      },
      ProgrammaticFormFilling: {
        screen: ProgrammaticFormFilling,
      },
      SplitPDF: {
        screen: SplitPDF,
      },
      ToolbarCustomization: {
        screen: ToolbarCustomization,
      },
      HiddenToolbar: {
        screen: HiddenToolbar,
      },
      CustomFontPicker: {
        screen: CustomFontPicker,
      },
    },
    {
      initialRouteName: 'Catalog',
    },
  ),
);

var styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  version: {
    color: '#666666',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    marginTop: 20,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  list: {
    backgroundColor: '#eee',
  },
  name: {
    color: pspdfkitColor,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    color: '#666666',
    fontSize: 12,
  },
  rowContent: {
    padding: 10,
  },
});

function extractFromAssetsIfMissing(assetFile, callback) {
  const path = fileSystem.DocumentDirectoryPath + '/' + assetFile;
  var src = fileSystem.MainBundlePath + '/PDFs/' + assetFile;

  if (Platform.OS === 'android') {
    src = assetFile
  }

  const copy = (Platform.OS === 'ios') ? fileSystem.copyFile : fileSystem.copyFileAssets;

  fileSystem
    .exists(path)
    .then(exists => {
      if (exists) {
        console.log(assetFile + ' exists in the document directory path.');
        callback();
      } else {
        console.log(
          assetFile +
            ' does not exist, extracting it from the main bundle to the documents directory path.',
        );
        // File exists so it can be extracted to the document directory path.
        copy(src, path)
        .then(() => {
          // File copied successfully from assets folder to document directory path.
          callback();
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
