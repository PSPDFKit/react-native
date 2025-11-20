describe('ArchitectureDetector', () => {
  const original = { ...global } as any;

  afterEach(() => {
    (global as any).nativeFabricUIManager = undefined;
    (global as any).__turboModuleProxy = undefined;
    (global as any).RN$Bridgeless = undefined;
    jest.resetModules();
  });

  test('detects Fabric', () => {
    (global as any).nativeFabricUIManager = {};
    const det = require('../src/ArchitectureDetector');
    expect(det.isFabricEnabled()).toBe(true);
    expect(det.isNewArchitectureEnabled()).toBe(true);
  });

  test('detects Turbo', () => {
    (global as any).__turboModuleProxy = {};
    const det = require('../src/ArchitectureDetector');
    expect(det.areTurboModulesEnabled()).toBe(true);
    expect(det.isNewArchitectureEnabled()).toBe(true);
  });

  test('detects bridgeless', () => {
    (global as any).RN$Bridgeless = true;
    const det = require('../src/ArchitectureDetector');
    expect(det.isBridgelessEnabled()).toBe(true);
    expect(det.isNewArchitectureEnabled()).toBe(true);
  });

  test('legacy Paper', () => {
    const det = require('../src/ArchitectureDetector');
    expect(det.isNewArchitectureEnabled()).toBe(false);
  });
});


