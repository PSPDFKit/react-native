import { NativeModules, Platform } from 'react-native';

import {
  exampleDocumentName,
  exampleDocumentPath,
  exampleImagePath,
  tiffImagePath,
} from './configuration/Constants';
import exampleDocumentConfiguration, {
  tiffImageConfiguration,
} from './helpers/ExampleDocumentConfiguration';
import {
  documentName,
  extractAsset,
  fileExists,
  getOutputPath,
} from './helpers/FileHelper';
import { extractFromAssetsIfMissing } from './helpers/FileSystemHelpers';
import { getMainBundlePath } from './helpers/ImageHelper';
import { PSPDFKit } from './helpers/PSPDFKit';

const Processor = NativeModules.RNProcessor;

export default [
  {
    key: 'item1',
    name: 'PSPDFKitView Component',
    description:
      'Show how to use the PSPDFKitView component with react-navigation.',
    action: component => {
      component.props.navigation.push('PSPDFKitViewComponent');
    },
  },
  Platform.OS === 'ios'
    ? {
        key: 'item2',
        name: 'Open an Image in a PSPDFKitView Component',
        description:
          'Show how to open and annotate an image document inside a PSPDFKitView component.',
        action: component => {
          component.props.navigation.push('OpenImageDocument');
        },
      }
    : null,
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
  {
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
  {
    key: 'item17',
    name: 'Generate PDF',
    description: 'Generate a PDF from a template, images or html',
    action: component => {
      component.props.navigation.push('GeneratePDFMenu', {
        title: 'Generate PDF from html, template and more',
      });
    },
  },
  {
    key: 'item18',
    name: 'PSPDFKit Instant',
    description: 'PSPDFKit Instant synchronisation example',
    action: component => {
      component.props.navigation.push('InstantSynchronization', {
        title: 'Instant Synchronization',
      });
    },
  },
  {
    key: 'item19',
    name: 'PSPDFKit Measurement',
    description: 'PSPDFKit measurement tools example',
    action: component => {
      component.props.navigation.push('Measurement', {
        title: 'PSPDFKit Measurement',
      });
    },
  },
  {
    key: 'item20',
    name: 'Annotation Preset customization',
    description: 'Customize default annotation presets',
    action: component => {
      component.props.navigation.push('AnnotationPresetCustomization', {
        title: 'PSPDFKit preset customization',
      });
    },
  },
];

const generatePDFMenu = [
  {
    key: 'item1',
    name: 'Generate Blank PDF',
    description: 'Generate blank PDF from configuration.',
    action: async component => {
      const fileName = 'newBlankPDF';
      const configuration = {
        name: fileName,
        width: 595,
        height: 842,
        override: true, // true|false - if true, will overwrite existing file with the same name
      };
      try {
        const { fileURL } = await Processor.generateBlankPDF(configuration);

        if (Platform.OS === 'android') {
          PSPDFKit.present(fileURL, { title: 'Generate blank PDF' });
          return;
        }

        // Do something with new file
        console.log('Your new file is stored in: ', fileURL);
        await extractAsset(fileURL, documentName(fileName), async mainPath => {
          if (await fileExists(mainPath)) {
            component.props.navigation.push('GeneratePDF', {
              documentPath: `PDFs/${documentName(fileName)}`,
              fullPath: mainPath,
              title: 'Generate blank PDF',
            });
          }
        });
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
  {
    key: 'item2',
    name: 'Generate PDF from HTML string',
    description: 'Generate blank PDF from HTML string.',
    action: async component => {
      const fileName = 'newPDFFromHTML';
      const configuration = {
        name: fileName,
        documentPath: `PDFs/${documentName(fileName)}`,
        override: true, // true|false - if true, will override existing file with the same name
      };
      let htmlString = `
<html lang="en">
<head>
<style>
body {
    font-family: sans-serif;
}
</style><title>Demo HTML Document</title>
</head>
<body>
  <br/>
  <h1>PDF generated from HTML</h1>
  <p>Hello HTML</p>
  <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
  </ul>
  <p><span style="color: #ff0000;"><strong>&nbsp;Add some style</strong></span></p>
  <p>&nbsp;</p>
  </body>
</html>`;

      try {
        let { fileURL } = await Processor.generatePDFFromHtmlString(
          configuration,
          htmlString,
        );

        // Do something with new file
        // In this example, we will open it in PSPDFKit view component from the same location where other pdf documents resides, PDFs folder in the root of the RN app
        // Do something with new file
        console.log('Your new file is stored in: ', fileURL);

        if (Platform.OS === 'android') {
          PSPDFKit.present(fileURL, {
            title: 'Generate PDF from HTML string.',
          });
          return;
        }

        // making the PDF document accessible to RN component in iOS
        await extractAsset(fileURL, documentName(fileName), async mainPath => {
          if (await fileExists(mainPath)) {
            component.props.navigation.push('GeneratePDF', {
              documentPath: `PDFs/${documentName(fileName)}`,
              fullPath: mainPath,
              title: 'Generate PDF from HTML string',
            });
          }
        });
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
  {
    key: 'item3',
    name: 'Generate PDF from URL',
    description: 'Generate PDF from internet link.',
    action: async component => {
      let fileURL = null;
      const fileName = 'newPDFFromURL';
      try {
        fileURL = await getOutputPath(fileName);
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }

      const configuration = {
        filePath: fileURL,
        override: true,
      };
      let originURL = 'https://pspdfkit.com';

      try {
        let { fileURL: outputURL } = await Processor.generatePDFFromHtmlURL(
          configuration,
          originURL,
        );
        // Do something with new file

        if (Platform.OS === 'android') {
          PSPDFKit.present(outputURL, { title: 'Generate PDF from URL' });
          return;
        }

        // In this example, we will open it in PSPDFKit view component from the same location where other pdf documents resides, PDFs folder in the root of the RN app
        await extractAsset(
          outputURL,
          documentName(fileName),
          async mainPath => {
            if (await fileExists(mainPath)) {
              component.props.navigation.push('GeneratePDF', {
                documentPath: `PDFs/${documentName(fileName)}`,
                fullPath: mainPath,
                title: 'Generate PDF from URL',
              });
            }
          },
        );
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
  {
    key: 'item4',
    name: 'Generate PDF from Template multiple configurations',
    description:
      'Generate PDF from template with custom configuration for each page separately',
    action: async component => {
      let fileURL = null;
      const fileName = 'newPDFFromTemplate';
      try {
        fileURL = await getOutputPath(fileName);
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }

      const configuration = {
        filePath: fileURL,
        override: true,
        templates: [
          {
            pageSize: { width: 540, height: 846 },
            backgroundColor: 'rgba(0.871, 0.188, 0.643, 0.5)',
            template: 'lines7mm',
            rotation: 90,
            pageMargins: { top: 10, left: 10, right: 10, bottom: 10 },
          },
          {
            pageSize: { width: 540, height: 846 },
            backgroundColor: 'yellow',
            template: 'dot5mm',
          },
        ],
      };
      try {
        let { fileURL: outputFileURL } =
          await Processor.generatePDFFromTemplate(configuration);
        // Do something with new file
        // In this example, we will open it in PSPDFKit view component from the same location where other pdf documents resides, PDFs folder in the root of the RN app
        if (Platform.OS === 'android') {
          PSPDFKit.present(outputFileURL, {
            title: 'Generate PDF from template',
          });
          return;
        }

        // Making the PDF document accessible to RN component in iOS.
        await extractAsset(
          outputFileURL,
          documentName(fileName),
          async mainPath => {
            if (await fileExists(mainPath)) {
              component.props.navigation.push('GeneratePDF', {
                documentPath: `PDFs/${documentName(fileName)}`,
                fullPath: mainPath,
                title: 'Generate PDF from Template',
              });
            }
          },
        );
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
  {
    key: 'item5',
    name: 'Generate PDF from image(s)',
    description: 'Generate PDF document from array of images.',
    action: async component => {
      let fileName = 'PDFFromImages';
      // For images from assets, you'll need to provide the global path for images in iOS.
      // In case you took image from the camera, you can use local path, instead.
      // Remote images from web URL will need to be downloaded first and then used as local path.
      let globalPath = getMainBundlePath(exampleImagePath.toString());
      const configuration = {
        name: fileName,
        images: [
          {
            imageUri: Platform.OS === 'ios' ? globalPath : exampleImagePath,
            position: 'center',
            pageSize: { width: 540, height: 846 },
          },
        ],
        override: true, // true|false - if true, will override existing file with the same name
      };
      try {
        const { fileURL } = await Processor.generatePDFFromImages(
          configuration,
        );

        if (Platform.OS === 'android') {
          PSPDFKit.present(fileURL, { title: 'Generate PDF from images' });
          return;
        }

        // Do something with new file
        console.log('Your new file is stored in: ', fileURL);
        // In this example, we will open it in PSPDFKit view component from the same location where other pdf documents resides, PDFs folder in the root of the RN app
        await extractAsset(fileURL, documentName(fileName), async mainPath => {
          if (await fileExists(mainPath)) {
            component.props.navigation.push('GeneratePDF', {
              documentPath: `PDFs/${documentName(fileName)}`,
              fullPath: mainPath,
              title: 'Generate PDF from images',
            });
          }
        });
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
  {
    key: 'item6',
    name: 'Generate PDF from PDF documents',
    description: 'Generate PDF document from existing PDF documents.',
    action: async component => {
      let fileName = 'PDFromDocuments';
      let outputFile = null;
      // For images from assets, you'll need to provide the global path for images in iOS.
      // In case you took image from the camera, you can use local path, instead.
      // Remote images from web URL will need to be downloaded first and then used as local path.
      let globalPath = getMainBundlePath(exampleDocumentPath.toString());
      try {
        outputFile = await getOutputPath(fileName);
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }

      const configuration = {
        filePath: outputFile,
        name: fileName,
        documents: [
          {
            documentPath:
              Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
            pageIndex: 5,
          },
          {
            documentPath:
              Platform.OS === 'ios' ? globalPath : exampleDocumentPath,
            pageIndex: 8,
          },
        ],
        override: true,
      };

      try {
        const { fileURL } = await Processor.generatePDFFromDocuments(
          configuration,
        );

        if (Platform.OS === 'android') {
          PSPDFKit.present(fileURL, { title: 'Generate PDF from images' });
          return;
        }

        // Do something with new file
        console.log('Your new file is stored in: ', fileURL);
        // In this example, we will open it in PSPDFKit view component from the same location where other pdf documents resides, PDFs folder in the root of the RN app
        await extractAsset(fileURL, documentName(fileName), async mainPath => {
          if (await fileExists(mainPath)) {
            component.props.navigation.push('GeneratePDF', {
              documentPath: `PDFs/${documentName(fileName)}`,
              fullPath: mainPath,
              title: 'Generate PDF from PDF documents',
            });
          }
        });
      } catch (e) {
        console.log(e.message, e.code);
        alert(e.message);
      }
    },
  },
];

export { generatePDFMenu };
