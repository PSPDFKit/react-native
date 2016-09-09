'use strict'

const { NativeModules } = require('react-native');
const { PSPDFKitManager } = NativeModules;

module.exports = {
  ...PSPDFKitManager
}
