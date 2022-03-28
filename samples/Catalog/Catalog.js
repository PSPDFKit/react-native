//  Copyright © 2016-2022 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

// Imports
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  processColor,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import {
  exampleDocumentName,
  exampleDocumentPath,
  pspdfkitColor,
  tiffImagePath,
} from './configuration/Constants';
import {extractFromAssetsIfMissing} from './helpers/FileSystemHelpers';
import {PSPDFKitViewComponent} from './examples/PSPDFKitViewComponent';
import {OpenImageDocument} from './examples/OpenImageDocument';
import {SaveAs} from './examples/SaveAs';
import {ManualSave} from './examples/ManualSave';
import {EventListeners} from './examples/EventListeners';
import {StateChange} from './examples/StateChange';
import {PSPDFKit} from './helpers/PSPDFKit';
import {AnnotationProcessing} from './examples/AnnotationProcessing';
import {ProgrammaticAnnotations} from './examples/ProgrammaticAnnotations';
import {ProgrammaticFormFilling} from './examples/ProgrammaticFormFilling';
import {SplitPDF} from './examples/SplitPDF';
import {ToolbarCustomization} from './examples/ToolbarCustomization';
import {HiddenToolbar} from './examples/HiddenToolbar';
import {CustomFontPicker} from './examples/CustomFontPicker';

const fileSystem = require('react-native-fs');

// By default, this example doesn't set a license key, but instead runs in trial mode (which is the default, and which requires no
// specific initialization). If you want to use a different license key for evaluation (e.g. a production license), you can uncomment
// the next line and set the license key.
//
// To set the license key for both platforms, use:
// PSPDFKit.setLicenseKeys("YOUR_REACT_NATIVE_ANDROID_LICENSE_KEY_GOES_HERE", "YOUR_REACT_NATIVE_IOS_LICENSE_KEY_GOES_HERE");
//
// To set the license key for the currently running platform, use:
// PSPDFKit.setLicenseKey("YOUR_REACT_NATIVE_LICENSE_KEY_GOES_HERE");

// Configurations
const exampleDocumentConfiguration = {
  iOSBackgroundColor: processColor('white'),
  showPageNumberOverlay: true,
  grayScale: false,
  showPageLabels: false,
  documentLabelEnabled: true,
  inlineSearch: true,
  pageTransition: 'scrollContinuous',
  scrollDirection: 'vertical',
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
    name: 'Save As',
    description: 'Save changes to the PDF in a separate file',
    action: component => {
      extractFromAssetsIfMissing(exampleDocumentName, function () {
        component.props.navigation.push('SaveAs');
      });
    },
  },
  {
    key: 'item5',
    name: 'Event Listeners',
    description:
      'Show how to use the listeners exposed by the PSPDFKitView component.',
    action: component => {
      component.props.navigation.push('EventListeners');
    },
  },
  {
    key: 'item6',
    name: 'Changing the State',
    description:
      'Add a toolbar at the bottom with buttons to toggle the annotation toolbar, and to programmatically change pages.',
    action: component => {
      component.props.navigation.push('StateChange');
    },
  },
  {
    key: 'item7',
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
    key: 'item8',
    name: 'Programmatic Annotations',
    description: 'Show how to get and add new annotations using Instant JSON.',
    action: component => {
      component.props.navigation.push('ProgrammaticAnnotations');
    },
  },
  {
    key: 'item9',
    name: 'Programmatic Form Filling',
    description:
      'Show how to get the value of a form element and how to programmatically fill forms.',
    action: component => {
      component.props.navigation.push('ProgrammaticFormFilling');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item10',
    name: 'Split PDF',
    description:
      'Show two PDFs side by side by using multiple PSPDFKitView components.',
    action: component => {
      component.props.navigation.navigate('SplitPDF');
    },
  },
  Platform.OS === 'ios' && {
    key: 'item11',
    name: 'Customize the Toolbar',
    description: 'Show how to customize buttons in the toolbar.',
    action: component => {
      component.props.navigation.push('ToolbarCustomization');
    },
  },
  {
    key: 'item12',
    name: 'Hidden Toolbar',
    description:
      'Hide the main toolbar while keeping the thumbnail bar visible.',
    action: component => {
      component.props.navigation.push('HiddenToolbar');
    },
  },
  {
    key: 'item13',
    name: 'Custom Font Picker',
    description:
      'Show how to customize the font picker for free text annotations.',
    action: component => {
      component.props.navigation.push('CustomFontPicker');
    },
  },
  /// Present examples.
  {
    key: 'item14',
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
    key: 'item15',
    name: 'Customize Document Configuration',
    description:
      'Customize various aspects of the document by passing a configuration dictionary.',
    action: () => {
      PSPDFKit.present(exampleDocumentPath, exampleDocumentConfiguration);
    },
  },
  {
    key: 'item16',
    name: 'Open an Image Document Using the Native Module API',
    description:
      'Open an image document using the Native Module API. Supported filetypes are PNG, JPEG and TIFF.',
    action: () => {
      // PSPDFKit can open PNG, JPEG and TIFF image files directly.
      PSPDFKit.present(tiffImagePath, tiffImageConfiguration);
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
        underlayColor={pspdfkitColor}>
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
      SaveAs: {
        screen: SaveAs,
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
