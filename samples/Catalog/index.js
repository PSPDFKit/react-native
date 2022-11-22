/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Catalog from './Catalog';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => Catalog);
