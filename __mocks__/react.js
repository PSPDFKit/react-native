// Mock React for tests that import index.js
module.exports = {
  Component: class Component {},
  createRef: jest.fn(() => ({ current: null })),
  createElement: jest.fn((type, props, ...children) => {
    return { type, props, children };
  }),
  createContext: jest.fn((defaultValue) => {
    const context = {
      _currentValue: defaultValue,
      Provider: ({ value, children }) => {
        context._currentValue = value;
        return children;
      },
      Consumer: ({ children }) =>
        typeof children === 'function' ? children(context._currentValue) : children,
    };
    return context;
  }),
  forwardRef: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
  useImperativeHandle: jest.fn(),
  useContext: jest.fn((context) => context && context._currentValue),
  useEffect: jest.fn(),
  useRef: jest.fn((initialValue) => ({ current: initialValue ?? null })),
  useState: jest.fn((initialValue) => [
    typeof initialValue === 'function' ? initialValue() : initialValue,
    jest.fn(),
  ]),
};

