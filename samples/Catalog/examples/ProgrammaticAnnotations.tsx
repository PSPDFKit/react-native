import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView, { Annotation } from 'react-native-pspdfkit';
import fileSystem from 'react-native-fs';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class ProgrammaticAnnotations extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;
  lastAddedAnnotationUUID: string | undefined;

  static inkAnnotation = {"annotations" : [{
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
  }],
    "format": "https://pspdfkit.com/instant-json/v1"
  };

  static multipleAnnotations = {
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

  static complexAnnotation = {
    "annotations":
    [
        {
            "bbox":
            [
                170.8818359375,
                346.06939697265625,
                127.72146606445312,
                8.38861083984375
            ],
            "borderStyle": "solid",
            "borderWidth": 1,
            "createdAt": "2024-04-03T07:32:25Z",
            "creatorName": "TEXT_WIDGET_01HTHDZ57HSPHCN98TSR07E5M0",
            "font": "Helvetica",
            "fontSize": 12,
            "formFieldName": "First Name",
            "horizontalAlign": "left",
            "id": "01HTHDZ57H9YR7CJCPT3G02NA0",
            "lineHeightFactor": 1.186000108718872,
            "name": "01HTHDZ57KCSGH2T6XRCC9JKME",
            "opacity": 1,
            "pageIndex": 0,
            "rotation": 0,
            "type": "pspdfkit/widget",
            "updatedAt": "2024-04-03T07:32:27Z",
            "v": 2,
            "verticalAlign": "center"
        }
    ],
    "formFields":
    [
        {
            "annotationIds":
            [
                "01HTHDZ57H9YR7CJCPT3G02NA0"
            ],
            "comb": false,
            "defaultValue": "",
            "doNotScroll": false,
            "doNotSpellCheck": false,
            "id": "01HTHE2F868R89KS139KFF19F4",
            "label": "First Name",
            "multiLine": false,
            "name": "First Name",
            "password": false,
            "pdfObjectId": 92,
            "richText": false,
            "type": "pspdfkit/form-field/text",
            "v": 1
        }
    ],
    "format": "https://pspdfkit.com/instant-json/v1",
};

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();

    hideToolbar(navigation);

    this.state = {
      currentPageIndex: 0,
    };
  }

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={exampleDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            editableAnnotationTypes: ['ink', 'freeText', 'eraser', 'signature'],
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={['ink', 'freetext', 'eraser', 'signature']}
          style={styles.pdfColor}
          onAnnotationsChanged={(event: {
            error: any;
            change: string;
            annotations: any;
          }) => {
            console.log(JSON.stringify(event));
            this.lastAddedAnnotationUUID = event.annotations[0]?.uuid;
          }}
        />
        <View style={styles.column}>
          <View style={styles.wrapper}>
            <View>
              <Button
                onPress={() => {

                  // Programmatically add an ink annotation.
                  this.pdfRef.current?.getDocument().addAnnotations(ProgrammaticAnnotations.inkAnnotation)
                    .then(result => {
                      if (result) {
                        Alert.alert(
                          'PSPDFKit',
                          'Annotation was successfully added.',
                          [
                            {
                              text: 'Set readOnly flag',
                              onPress: async () => {

                                // Get the existing annotation flags
                                const flags = await this.pdfRef.current?.getAnnotationFlags(
                                  this.lastAddedAnnotationUUID!);
                                
                                // Add the READ_ONLY flag
                                flags?.push(Annotation.Flags.READ_ONLY);

                                // Set the new flags
                                await this.pdfRef.current?.setAnnotationFlags(
                                  this.lastAddedAnnotationUUID!,
                                  flags!,
                                );
                                this.pdfRef.current?.getAnnotationFlags(
                                  this.lastAddedAnnotationUUID!).then((flags: Annotation.Flags[]): any => {
                                  Alert.alert('PSPDFKit', `New annotation flags: ${JSON.stringify(flags)}`);
                                });
                              },
                            },
                            {text: 'OK'},
                          ]
                        );
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to add annotation.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
                title="Add Ink Annotation"
                accessibilityLabel="Add Ink Annotation"
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
                onPress={async () => {
                  
                  // For certain type of widget annotations, the document cache needs to be cleared before adding them.
                  await this.pdfRef.current?.getDocument().invalidateCache();
                  // Programmatically add multiple annotations.
                  this.pdfRef.current?.getDocument().addAnnotations(ProgrammaticAnnotations.complexAnnotation)
                    .then(result => {
                      if (result) {
                        Alert.alert(
                          'PSPDFKit',
                          'Annotations were successfully added.',
                        );
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to add annotations.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
                title="Add Complex Annotation"
                accessibilityLabel="Add Complex Annotation"
              />
            </View>
          </View>
          <View style={styles.wrapper}>
            <View>
              <Button
                onPress={() => {

                  // Programmatically add multiple annotations.
                  this.pdfRef.current?.getDocument().addAnnotations(ProgrammaticAnnotations.multipleAnnotations)
                    .then(result => {
                      if (result) {
                        Alert.alert(
                          'PSPDFKit',
                          'Annotations were successfully added.',
                        );
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to add annotations.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
                title="Add Multiple Annotations"
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
                onPress={async () => {

                  // Programmatically add a downloaded image annotation.
                  const filePath = fileSystem.DocumentDirectoryPath + '/pspdfkit.png';
                  fileSystem.downloadFile({
                    fromUrl:'https://github.com/PSPDFKit/react-native/blob/master/samples/Catalog/assets/logo-flat.png?raw=true', 
                    toFile: filePath
                  }).promise.then(async (_result) => {
                    const base64ImageData = await fileSystem.readFile(filePath, 'base64');
                    const imageAnnotationJSON = {
                    "annotations":[
                      {
                          "bbox":[
                            229,
                            426,
                            125,
                            125
                          ],
                          "contentType":"image/png",
                          "createdAt":"2023-08-30T17:15:13Z",
                          "creatorName":"Test User",
                          "description":"Test",
                          "id":"455f261c88f94294a05ebeb494c96cb9",
                          "imageAttachmentId":"492adff9842bff7dcb81a20950870be8a0bb665c8d48175680c1e5e1070243ff",
                          "name":"my-custom-image-annotation",
                          "opacity":1,
                          "pageIndex":0,
                          "rotation":0,
                          "subject":"Test",
                          "type":"pspdfkit/image",
                          "updatedAt":"2024-05-07T17:15:13Z",
                          "v":2
                      }
                    ],
                    "format":"https://pspdfkit.com/instant-json/v1",
                    "attachments": {
                      "492adff9842bff7dcb81a20950870be8a0bb665c8d48175680c1e5e1070243ff": {
                          "binary" : "" + base64ImageData + "",
                          "contentType" : "image/png"
                      }
                    },
                  };
                  this.pdfRef.current?.getDocument().addAnnotations(imageAnnotationJSON)
                    .then(result => {
                      if (result) {
                        Alert.alert(
                          'PSPDFKit',
                          'Annotation was successfully added.',
                        );
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to add annotations.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                  });
                }}
                title="Add Image Annotation"
              />            
            </View>
          </View>
          <View style={styles.wrapper}>
            <View>
              <Button
                onPress={() => {

                  // Get ink annotations from the current page.
                  this.pdfRef.current?.getDocument().getAnnotationsForPage(
                      this.state.currentPageIndex,
                      'pspdfkit/ink',
                    )
                    .then(result => {
                      if (result) {
                        Alert.alert('PSPDFKit', JSON.stringify(result));
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to get annotations.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
                title="Get Ink Annotations"
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
                onPress={() => {

                  // Get stamp annotations from the current page.
                  this.pdfRef.current?.getDocument().getAnnotationsForPage(
                      this.state.currentPageIndex,
                      'pspdfkit/stamp',
                    )
                    .then(result => {
                      if (result) {
                        Alert.alert('PSPDFKit', JSON.stringify(result));
                      } else {
                        Alert.alert('PSPDFKit', 'Failed to get annotations.');
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
                title="Get Image Annotations"
              />
            </View>
          </View>
          <View style={styles.wrapper}>
            <View>
              <Button
                title={'Remove annotations'}
                onPress={() => {

                  const document = this.pdfRef.current?.getDocument();
                  document?.getAnnotations() // No parameter returns all annotations
                    .then( annotations => {
                      document?.removeAnnotations(annotations);
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
                    });
                }}
              />
            </View>
            <View style={styles.marginLeft}>
              <Button
                onPress={() => {

                  // Get all annotations annotations from the document.
                  this.pdfRef.current?.getDocument().getAnnotations()
                    .then(result => {
                      if (result) {
                        Alert.alert('PSPDFKit', JSON.stringify(result));
                      } else {
                        Alert.alert(
                          'PSPDFKit',
                          'Failed to get all annotations.',
                        );
                      }
                    })
                    .catch(error => {
                      Alert.alert('PSPDFKit', JSON.stringify(error));
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

const styles = {
  flex: { flex: 1 },
  marginLeft: { marginLeft: 5 },
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 5,
  },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
};
