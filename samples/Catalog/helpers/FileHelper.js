import { NativeModules, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const { RNProcessor: Processor } = NativeModules;

const downloadFile = async filePath => {
  return await RNFS.moveFile(filePath, 'PDFs/').catch(err => {
    console.log(err.message, err.code);
  });
};

const rootDir =
  Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;

export const readFile = async path => {
  return await RNFS.readDir(path);
};

const getOutputPath = async filename => {
  const { tempDir } = await Processor.getTemporaryDirectory();
  return `${tempDir}/${filename}`;
};

const extractAsset = async (fileURL, fileName, callBack) => {
  try {
    await RNFS.readFile(fileURL, 'base64').then(document => {
      let mainPath = `${rootDir}/PDFs/${documentName(fileName)}`;

      RNFS.writeFile(mainPath, document, 'base64').then(success => {
        callBack(mainPath);
      });
    });
  } catch (error) {
    console.log('Error copying file', error);
  }
};

const documentName = fileName => {
  if (fileName.toLowerCase().substring(fileName.length - 4) !== '.pdf') {
    return `${fileName}.pdf`;
  }
  return fileName;
};

const fileExists = async filePath => {
  return await RNFS.exists(filePath);
};

export { downloadFile, getOutputPath, extractAsset, documentName, fileExists };
