import {BaseExampleAutoHidingHeaderComponent} from '../helpers/BaseExampleAutoHidingHeaderComponent';
import {Button, processColor, View} from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import {
  exampleDocumentPath,
  pspdfkitColor,
} from '../configuration/Constants';
import React from 'react';

export class ProgrammaticAnnotations extends BaseExampleAutoHidingHeaderComponent {
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
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}>
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
            }}>
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
            }}>
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
