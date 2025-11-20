// Basic mocks for global objects that tests rely on
global.__DEV__ = true;

// Silence console noise in tests; comment out if debugging
const origError = console.error;
console.error = (...args) => {
  const msg = args[0] || '';
  if (typeof msg === 'string' && (
    msg.includes('Warning:') ||
    msg.includes('React does not recognize')
  )) {
    return;
  }
  origError(...args);
};

