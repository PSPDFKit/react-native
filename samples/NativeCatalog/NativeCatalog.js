//  Copyright © 2016-2025 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React from 'react';
import { BaseExampleAutoHidingHeaderComponent } from './helpers/BaseExampleAutoHidingHeaderComponent';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './examples/HomeScreen';
import examples from './ExamplesNavigationMenu';
import GeneratePDF from './examples/GeneratePDF';
import GeneratePDFMenu from './examples/GeneratePDFMenu';
import { ManualSigning } from './examples/ManualSigning';
import { Watermark } from './examples/Watermark';
import { WatermarkStartup } from './examples/WatermarkStartup';
import { InstantExample } from './examples/InstantExample';
import { DefaultAnnotationSettings } from './examples/DefaultAnnotationSettings';
import { NativeModules } from 'react-native';

// By default, this example doesn't set a license key, but instead runs in trial mode (which is the default,
// and requires SDK initialization with a null key)
// If you want to use a different license key for evaluation (e.g. a production license), you can set the license key using below methods:
//
// To set the license key for both platforms, use:
// PSPDFKit.setLicenseKeys("YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE", "YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE");
//
// To set the license key for the currently running platform, use:
// PSPDFKit.setLicenseKey("YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE");

class NativeCatalog extends BaseExampleAutoHidingHeaderComponent {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    this.state = {
      dataSource: examples.filter(element => {
        return element != null && element !== [];
      }),
    };
  }

  componentDidMount() {
    const PSPDFKit = NativeModules.PSPDFKit;
    PSPDFKit.setLicenseKey(null);
  }

  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Native Catalog Examples"
            component={HomeScreen}
            initial={true}
          />
          <Stack.Screen name="Watermark" component={Watermark} initial={true} />
          <Stack.Screen
            name="WatermarkStartup"
            component={WatermarkStartup}
            initial={true}
            options={{ title: 'Watermark on Startup' }}
          />
          <Stack.Screen
            name="InstantExample"
            component={InstantExample}
            initial={true}
            options={{ title: 'Instant Example' }}
          />
          <Stack.Screen
            name="DefaultAnnotationSettings"
            component={DefaultAnnotationSettings}
            initial={true}
            options={{ title: 'Default Annotation Settings' }}
          />
          <Stack.Screen
            name="GeneratePDFMenu"
            component={GeneratePDFMenu}
            initial={true}
            options={{ title: 'Generate PDF' }}
          />
          <Stack.Screen
            name="GeneratePDF"
            component={GeneratePDF}
            options={{ title: 'Generate PDF' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default NativeCatalog;
