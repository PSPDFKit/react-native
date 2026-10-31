/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated and will be removed in a future release',
  // Debug builds with a bundled JS file (as on CI) have no packager to reach.
  'Packager status check returned unexpected result',
]);

import { name as appName } from './app.json';
import Catalog from './Catalog';

AppRegistry.registerComponent(appName, () => Catalog);
