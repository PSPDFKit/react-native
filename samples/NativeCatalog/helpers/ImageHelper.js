import RNFS from 'react-native-fs';

const getMainBundlePath = image => {
  return `${RNFS.MainBundlePath}/${image}`;
};
export { getMainBundlePath };
