import React from 'react';
import {
  Alert,
  processColor,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PSPDFKitView, { Measurements, MeasurementScale, MeasurementValueConfiguration } from 'react-native-pspdfkit';

import {
  measurementsDocument,
  pspdfkitColor,
} from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

class Measurement extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
  }

  onChangeMeasurement = async () => {
     const scale: MeasurementScale = {
      unitFrom: Measurements.ScaleUnitFrom.INCH,
      valueFrom: 1.0,
      unitTo: Measurements.ScaleUnitTo.CM,
      valueTo: 2.54
     };
     
     const measurementValueConfig: MeasurementValueConfiguration = {
      name: 'Custom Scale 3',
      scale: scale,
      precision: Measurements.Precision.FOUR_DP,
      isSelected: true
     };
     
     const configs = [measurementValueConfig];
     await this.pdfRef.current?.setMeasurementValueConfigurations(configs);
     Alert.alert('PSPDFKit', 'New Measurement Config Added!');
  };

  onGetMeasurementConfigs = async () => {
    const result = await this.pdfRef.current?.getMeasurementValueConfigurations();
    Alert.alert('PSPDFKit', 'Measurement Configs: ' + JSON.stringify(result));
    console.log(JSON.stringify(result));
 };

  override render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={measurementsDocument}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            pageMode: 'single',
            measurementValueConfigurations: [
              {
                name: 'Custom Scale 1',
                scale: {
                  unitFrom: Measurements.ScaleUnitFrom.INCH,
                  valueFrom: 1.0,
                  unitTo: Measurements.ScaleUnitTo.CM,
                  valueTo: 3.0,
                },
                precision: Measurements.Precision.TWO_DP,
                isSelected: true, 
              },
              {
                name: 'Custom Scale 2',
                scale: {
                  unitFrom: Measurements.ScaleUnitFrom.INCH,
                  valueFrom: 3.0,
                  unitTo: Measurements.ScaleUnitTo.FT,
                  valueTo: 6.54,
                },
                precision: Measurements.Precision.THREE_DP,
              },
            ]
          }}
          fragmentTag="PDF1"
          style={styles.pdfColor}
        />
        {this.renderWithSafeArea(insets => (
          <View style={[styles.column, { paddingBottom: insets.bottom }]}>
            <View>
              <View style={styles.horizontalContainer}>
                <TouchableOpacity onPress={this.onChangeMeasurement}>
                  <Text style={styles.button}>{'Change Measurements'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onGetMeasurementConfigs}>
                  <Text style={styles.button}>{'Get Measurements'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

export default Measurement;

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    height: 50,
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    flex: 1,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
  },
};
