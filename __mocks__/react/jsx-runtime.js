// Mock react/jsx-runtime for JSX transform
module.exports = {
  jsx: jest.fn((type, props, key) => ({ type, props, key })),
  jsxs: jest.fn((type, props, key) => ({ type, props, key })),
  Fragment: Symbol.for('react.fragment'),
};

