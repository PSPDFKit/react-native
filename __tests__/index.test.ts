import NutrientView from '../index';

jest.mock('../lib/ArchitectureDetector', () => ({
  isNewArchitectureEnabled: jest.fn(() => false), // Default to Paper
  logArchitectureInfo: jest.fn(),
}));

describe('NutrientView (index.js) - Static methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset static cache
    (NutrientView as any)._isNewArchitecture = null;
    (NutrientView as any)._FabricComponent = null;
  });

  test('architecture detection is cached after first call', () => {
    const { isNewArchitectureEnabled } = require('../lib/ArchitectureDetector');
    const mockFn = isNewArchitectureEnabled as jest.Mock;
    mockFn.mockReturnValue(false);

    // First call
    NutrientView._getArchitectureInfo();
    const firstCallCount = mockFn.mock.calls.length;

    // Second call - should use cache
    NutrientView._getArchitectureInfo();
    const secondCallCount = mockFn.mock.calls.length;

    // Architecture detection should only be called once (cached)
    expect(secondCallCount).toBe(firstCallCount);
  });

  test('_getArchitectureInfo returns correct structure', () => {
    const { isNewArchitectureEnabled } = require('../lib/ArchitectureDetector');
    (isNewArchitectureEnabled as jest.Mock).mockReturnValue(false);

    const result = NutrientView._getArchitectureInfo();
    
    expect(result).toHaveProperty('isNewArchitecture');
    expect(result).toHaveProperty('FabricComponent');
    expect(result.isNewArchitecture).toBe(false);
    expect(result.FabricComponent).toBeNull();
  });

  test('_getArchitectureInfo handles Fabric component load failure gracefully', () => {
    const { isNewArchitectureEnabled } = require('../lib/ArchitectureDetector');
    (isNewArchitectureEnabled as jest.Mock).mockReturnValue(true);
    
    // Mock console.error to avoid noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the require to throw when loading Fabric component
    jest.doMock('../src/NutrientViewFabric', () => {
      throw new Error('Module not found');
    }, { virtual: true });

    // Reset cache first
    (NutrientView as any)._isNewArchitecture = null;
    (NutrientView as any)._FabricComponent = null;
    
    const result = NutrientView._getArchitectureInfo();
    
    expect(result.isNewArchitecture).toBe(false); // Should fallback to Paper
    expect(result.FabricComponent).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Nutrient] Failed to load Fabric component'),
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });
});

