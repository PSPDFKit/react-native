module.exports = {
  Platform: { OS: 'ios' },
  UIManager: {
    getViewManagerConfig: () => ({ Commands: {} }),
    dispatchViewManagerCommand: jest.fn(),
  },
  NativeModules: {
    PDFDocumentManager: {
      getPageCount: jest.fn().mockResolvedValue(10),
      getDocumentId: jest.fn().mockResolvedValue('doc-id'),
    },
    PSPDFKitViewManager: {},
    Nutrient: {
      handleListenerAdded: jest.fn(),
      handleListenerRemoved: jest.fn(),
    },
  },
  findNodeHandle: jest.fn(() => 1011),
  requireNativeComponent: jest.fn((name) => {
    // Return a simple mock function (no React needed for remaining tests)
    return jest.fn(() => null);
  }),
  TurboModuleRegistry: {
    getEnforcing: jest.fn((name) => {
      // Return a mock TurboModule
      return {
        enterAnnotationCreationMode: jest.fn().mockResolvedValue(true),
        exitCurrentlyActiveMode: jest.fn().mockResolvedValue(true),
        saveCurrentDocument: jest.fn().mockResolvedValue(true),
        setToolbar: jest.fn(),
        getToolbar: jest.fn().mockResolvedValue({}),
        clearSelectedAnnotations: jest.fn().mockResolvedValue(true),
        selectAnnotations: jest.fn().mockResolvedValue(true),
        setPageIndex: jest.fn().mockResolvedValue(true),
        setMeasurementValueConfigurations: jest.fn().mockResolvedValue(true),
        getMeasurementValueConfigurations: jest.fn().mockResolvedValue([]),
        getConfiguration: jest.fn().mockResolvedValue({}),
        setExcludedAnnotations: jest.fn(),
        destroyView: jest.fn(),
      };
    }),
  },
};

