/**
 * @format
 */

import { AppRegistry } from 'react-native';
import NativeCatalog from './NativeCatalog';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => NativeCatalog);
