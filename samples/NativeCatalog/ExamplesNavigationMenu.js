import { NativeModules, Platform } from 'react-native';
import {
  documentName,
  extractAsset,
  getOutputPath,
  fileExists,
} from './helpers/FileHelper';
import { getMainBundlePath } from './helpers/ImageHelper';
import { exampleImagePath } from './configuration/Constants';

const { RNProcessor: Processor, PSPDFKit } = NativeModules;

const examples = [
  {
    key: 'item2',
    name: 'Watermark',
    description: 'Show how to watermark a PDF that is loaded in CustomPdfView.',
    action: component => {
      component.props.navigation.navigate('Watermark');
    },
  },
  {
    key: 'item3',
    name: 'Watermark on Startup',
    description:
      'Show how to watermark a PDF as soon as it is loaded in CustomPdfView.',
    action: component => {
      component.props.navigation.navigate('WatermarkStartup');
    },
  },
  Platform.OS === 'android'
    ? {
        key: 'item4',
        name: 'Default Annotation Settings',
        description: 'Show how to configure default annotations settings.',
        action: component => {
          component.props.navigation.navigate('DefaultAnnotationSettings');
        },
      }
    : null,
  Platform.OS === 'ios'
    ? {
        key: 'item5',
        name: 'Instant Example',
        description: 'Show the native Instant example.',
        action: component => {
          component.props.navigation.push('InstantExample');
        },
      }
    : null,
  {
    key: 'item6',
    name: 'Generate PDF',
    description: 'Generate a PDF from a template',
    action: component => {
      component.props.navigation.push('GeneratePDFMenu', {
        title: 'Generate PDF from html, template and more',
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
      const fileName = 'newBlankPDF.pdf';
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
          PSPDFKit.present(fileURL, { title: 'Generate PDF from HTML' });
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
    description: 'Generate blank PDF from link.',
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

        if (Platform.OS === 'android') {
          PSPDFKit.present(outputURL, { title: 'Generate PDF from URL' });
          return;
        }

        // Do something with new file
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
            size: { width: 540, height: 846 },
            backgroundColor: 'rgba(0.871, 0.188, 0.643, 0.5)',
            template: 'lines7mm',
            rotation: 90,
            pageMargins: { top: 10, left: 10, right: 10, bottom: 10 },
          },
          {
            size: { width: 540, height: 846 },
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
          component.props.navigation.push('GeneratePDF', {
            documentPath: `PDFs/${documentName(fileName)}`,
            fullPath: outputFileURL,
            title: 'Generate PDF from URL',
          });
          return;
        }

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
      // For images from assets, you'll need to use provide global path for images in iOS.
      // In case you took image from the camera, you can use local path, instead.
      // Remote images from web URL will need to be downloaded first and then used as local path.
      let globalPath = getMainBundlePath(exampleImagePath.toString());
      const configuration = {
        name: fileName,
        images: [
          {
            imageUri: Platform.OS === 'ios' ? globalPath : exampleImagePath,
            position: 'center',
            // pageSize: { width: 540, height: 846 },
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
];

const filteredExamples = examples.filter(item => item !== null);
export { filteredExamples, generatePDFMenu };

export default filteredExamples;
