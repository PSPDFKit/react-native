//  Copyright © 2016-2023 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

// Imports
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { PSPDFKitViewComponent } from './examples/PSPDFKitViewComponent';
import { OpenImageDocument } from './examples/OpenImageDocument';
import { SaveAs } from './examples/SaveAs';
import { ManualSave } from './examples/ManualSave';
import { EventListeners } from './examples/EventListeners';
import { StateChange } from './examples/StateChange';
import { AnnotationProcessing } from './examples/AnnotationProcessing';
import { ProgrammaticAnnotations } from './examples/ProgrammaticAnnotations';
import { ProgrammaticFormFilling } from './examples/ProgrammaticFormFilling';
import { SplitPDF } from './examples/SplitPDF';
import { ToolbarCustomization } from './examples/ToolbarCustomization';
import { HiddenToolbar } from './examples/HiddenToolbar';
import { CustomFontPicker } from './examples/CustomFontPicker';
import { GeneratePDF } from './examples/GeneratePDF';
import HomeScreen from './examples/HomeScreen';
import GeneratePDFMenu from './examples/GeneratePDFMenu';

// By default, this example doesn't set a license key, but instead runs in trial mode (which is the default, and which requires no
// specific initialization). If you want to use a different license key for evaluation (e.g. a production license), you can uncomment
// the next line and set the license key.
//
// To set the license key for both platforms, use:
// PSPDFKit.setLicenseKeys("YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE", "YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE");
//
// To set the license key for the currently running platform, use:
// PSPDFKit.setLicenseKey("YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE");

class Catalog extends Component {
  static navigationOptions = {
    title: 'Catalog',
  };

  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} initial={true} />
          <Stack.Screen
            name="PSPDFKitViewComponent"
            component={PSPDFKitViewComponent}
          />
          <Stack.Screen
            name="OpenImageDocument"
            component={OpenImageDocument}
          />
          <Stack.Screen name="ManualSave" component={ManualSave} />
          <Stack.Screen name="SaveAs" component={SaveAs} />
          <Stack.Screen name="EventListeners" component={EventListeners} />
          <Stack.Screen name="StateChange" component={StateChange} />
          <Stack.Screen
            name="AnnotationProcessing"
            component={AnnotationProcessing}
          />
          <Stack.Screen
            name="ProgrammaticAnnotations"
            component={ProgrammaticAnnotations}
          />
          <Stack.Screen
            name="ProgrammaticFormFilling"
            component={ProgrammaticFormFilling}
          />
          <Stack.Screen name="SplitPDF" component={SplitPDF} />
          <Stack.Screen
            name="ToolbarCustomization"
            component={ToolbarCustomization}
          />
          <Stack.Screen name="HiddenToolbar" component={HiddenToolbar} />
          <Stack.Screen name="CustomFontPicker" component={CustomFontPicker} />
          <Stack.Screen name="GeneratePDFMenu" component={GeneratePDFMenu} />
          <Stack.Screen name="GeneratePDF" component={GeneratePDF} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Catalog;
