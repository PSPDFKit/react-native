/**
 * Detects whether React Native New Architecture (Fabric/TurboModules) is enabled
 */

// Check for Fabric (new rendering system)
export function isFabricEnabled(): boolean {
    // @ts-ignore
    return global.nativeFabricUIManager != null;
}

// Check for TurboModules (new native module system)
export function areTurboModulesEnabled(): boolean {
    // @ts-ignore
    return global.__turboModuleProxy != null;
}

// Check for Bridgeless mode (experimental)
export function isBridgelessEnabled(): boolean {
    // @ts-ignore
    return global.RN$Bridgeless === true;
}

// Main function to check if New Architecture is enabled
export function isNewArchitectureEnabled(): boolean {
  return isFabricEnabled() || areTurboModulesEnabled() || isBridgelessEnabled();
}

// Get descriptive name of current architecture
export function getArchitectureName(): string {
  if (isBridgelessEnabled()) {
    return 'Bridgeless';
  } else if (isFabricEnabled() && areTurboModulesEnabled()) {
    return 'New Architecture (Fabric + TurboModules)';
  } else if (isFabricEnabled()) {
    return 'Fabric Only';
  } else if (areTurboModulesEnabled()) {
    return 'TurboModules Only';
  } else {
    return 'Legacy (Paper)';
  }
}

// Debug logging function
export function logArchitectureInfo(): void {
  const architecture = getArchitectureName();
  const details = {
    fabric: isFabricEnabled(),
    turboModules: areTurboModulesEnabled(),
    bridgeless: isBridgelessEnabled(),
  };
  
  console.log(`[PSPDFKit] Architecture: ${architecture}`, details);
}

// CommonJS compatibility
// @ts-ignore - module is available in CommonJS environments
module.exports = {
  isNewArchitectureEnabled,
  isFabricEnabled,
  areTurboModulesEnabled,
  isBridgelessEnabled,
  getArchitectureName,
  logArchitectureInfo,
};
