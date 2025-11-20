// Mock React for tests that import index.js
module.exports = {
  Component: class Component {},
  createRef: jest.fn(() => ({ current: null })),
  createElement: jest.fn((type, props, ...children) => {
    return { type, props, children };
  }),
  forwardRef: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
  useImperativeHandle: jest.fn(),
};

