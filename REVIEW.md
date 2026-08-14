# React Native Review Guide

## Cross-Platform Contract

- Review JavaScript, iOS, and Android behavior together, including supported
  legacy and new architectures. A fix on one bridge or platform is incomplete
  unless divergence is intentional and documented.
- Trace coordinate systems and transformed values across JavaScript and native
  APIs. Unit-level arithmetic alone does not prove bridge parity.
- Challenge additions to the native public surface and keep platform-specific
  details behind the narrowest stable cross-platform contract.

## Lifecycles and Bridge Cost

- Trace promises, events, callbacks, and native work through rerender, reload,
  view replacement, and teardown. Check stale closures, duplicate subscriptions,
  late results, and cleanup on partial initialization.
- Do not block either UI thread while waiting across the bridge. Batch repeated
  calls and review payload size when work scales by page, annotation, or event.

## Evidence

- Inspect tests and CI coverage for every affected platform and architecture.
  Verify assertions cover event ordering and final state, not merely that a
  callback fired.
