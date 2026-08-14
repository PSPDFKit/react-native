/**
 * `index.js` sets `module.exports = NutrientView`, which replaces the exports
 * object and discards the ESM `export ... from` bindings, so every public name
 * has to be re-attached explicitly as `module.exports.X = X`. Adding only the
 * `export ... from` line leaves the name type-checking fine (types/index.d.ts
 * declares it) while being `undefined` at runtime, which surfaces as
 * "Element type is invalid ... got: undefined" the first time it is rendered.
 */
const SDK = require('../index');

describe('package root exports', () => {
  test('exposes the overlay components', () => {
    expect(typeof SDK.NutrientOverlay).toBe('function');
    expect(typeof SDK.NutrientOverlayItem).toBe('function');
  });

  test('exposes the notification center alongside them', () => {
    expect(SDK.NotificationCenter).toBeDefined();
  });
});
