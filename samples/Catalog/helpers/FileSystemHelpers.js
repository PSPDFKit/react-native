import fileSystem from 'react-native-fs';

export function extractFromAssetsIfMissing(assetFile, callback) {
  const path = fileSystem.DocumentDirectoryPath + '/' + assetFile;
  var src = fileSystem.MainBundlePath + '/PDFs/' + assetFile;

  if (Platform.OS === 'android') {
    src = assetFile;
  }

  const copy =
    Platform.OS === 'ios' ? fileSystem.copyFile : fileSystem.copyFileAssets;

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
