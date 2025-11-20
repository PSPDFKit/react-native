"use strict";
/**
 * Detects whether React Native New Architecture (Fabric/TurboModules) is enabled
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFabricEnabled = isFabricEnabled;
exports.areTurboModulesEnabled = areTurboModulesEnabled;
exports.isBridgelessEnabled = isBridgelessEnabled;
exports.isNewArchitectureEnabled = isNewArchitectureEnabled;
exports.getArchitectureName = getArchitectureName;
exports.logArchitectureInfo = logArchitectureInfo;
// Check for Fabric (new rendering system)
function isFabricEnabled() {
    // @ts-ignore
    return global.nativeFabricUIManager != null;
}
// Check for TurboModules (new native module system)
function areTurboModulesEnabled() {
    // @ts-ignore
    return global.__turboModuleProxy != null;
}
// Check for Bridgeless mode (experimental)
function isBridgelessEnabled() {
    // @ts-ignore
    return global.RN$Bridgeless === true;
}
// Main function to check if New Architecture is enabled
function isNewArchitectureEnabled() {
    return isFabricEnabled() || areTurboModulesEnabled() || isBridgelessEnabled();
}
// Get descriptive name of current architecture
function getArchitectureName() {
    if (isBridgelessEnabled()) {
        return 'Bridgeless';
    }
    else if (isFabricEnabled() && areTurboModulesEnabled()) {
        return 'New Architecture (Fabric + TurboModules)';
    }
    else if (isFabricEnabled()) {
        return 'Fabric Only';
    }
    else if (areTurboModulesEnabled()) {
        return 'TurboModules Only';
    }
    else {
        return 'Legacy (Paper)';
    }
}
// Debug logging function
function logArchitectureInfo() {
    var architecture = getArchitectureName();
    var details = {
        fabric: isFabricEnabled(),
        turboModules: areTurboModulesEnabled(),
        bridgeless: isBridgelessEnabled(),
    };
    console.log("[PSPDFKit] Architecture: ".concat(architecture), details);
}
// CommonJS compatibility
// @ts-ignore - module is available in CommonJS environments
module.exports = {
    isNewArchitectureEnabled: isNewArchitectureEnabled,
    isFabricEnabled: isFabricEnabled,
    areTurboModulesEnabled: areTurboModulesEnabled,
    isBridgelessEnabled: isBridgelessEnabled,
    getArchitectureName: getArchitectureName,
    logArchitectureInfo: logArchitectureInfo,
};
