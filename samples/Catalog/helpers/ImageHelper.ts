import RNFS from 'react-native-fs';

const getMainBundlePath = (image: string) => {
  return `${RNFS.MainBundlePath}/${image}`;
};
export { getMainBundlePath };
