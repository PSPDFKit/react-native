/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import Catalog from './Catalog';

AppRegistry.registerComponent(appName, () => Catalog);
