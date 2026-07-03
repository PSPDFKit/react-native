---
name: react-native-bridge-recipe
description: |
  Recipe for bridging native iOS and Android APIs to TypeScript in this React Native SDK.
  Use when the user asks to add or change a native API exposed to TypeScript/JS, to bridge
  a feature from iOS or Android to the JS layer, or to implement a TurboModule, Fabric
  component, or Legacy native module. Keywords: bridge, native API, TurboModule, Fabric,
  Legacy, New Architecture, NativeNutrientModule, NativeNutrientViewTurboModule, index.js,
  specs, Android, iOS, dual path, ArchitectureDetector.
compatibility: React Native SDK with Legacy and New Architecture (Fabric + TurboModules). Node, npm/yarn.
metadata:
  source: BRIDGING.md
  applyTo: "**"
---

# React Native bridge recipe (native → TypeScript)

When **adding or changing any native API exposed to the TypeScript/JavaScript layer** in this repo, you **MUST** follow the full recipe in:

**`BRIDGING.md`**

Read that file first. Do not summarize or skip steps. Do not use only Legacy or only New Architecture. Do not invent a different pattern.

## When to use this skill

- The user asks to "bridge" a native API, method, or feature to TypeScript/React Native.
- The user wants to add or change something that touches: `NativeModules`, a TurboModule, Fabric, `index.js`, `src/specs/`, or native iOS/Android code exposed to JS.
- The user mentions: TurboModule, Fabric, Legacy, New Architecture, view ref methods, or app-level module methods.

## Rule summary (from BRIDGING.md)

1. **Dual path**: Every public API that talks to native code **MUST** branch on `isNewArchitectureEnabled()`: New Architecture uses TurboModule/Fabric ref; Legacy uses `NativeModules` / `UIManager` / `requireNativeComponent`.
2. **Spec-first for New Architecture**: New Architecture APIs **MUST** be declared in a spec under `src/specs/` and implemented in native (Android `newarch`, iOS `Turbo/` or `Fabric/`).
3. **One public surface**: The public API (e.g. `index.js`) is the only place callers use; it delegates to either the TurboModule/Fabric path or the Legacy path.

## Before coding: gather requirements (Step 0)

If the user has not provided these, **ask and wait** before Step 1:

1. **API / feature:** What exactly should be bridged?
2. **Platform:** iOS only, Android only, or both?
3. **Module type:** App-level TurboModule, View-backed TurboModule, or Fabric component?
4. **Method name(s) and signatures:** Exact names and TypeScript signatures.
5. **Links to iOS/Android APIs or guides:** So you can implement correctly.
6. **Extra context:** Already implemented elsewhere? Different name on one platform?

## After implementation

- Use the **Checklist before submitting** in `BRIDGING.md` and confirm each item.
- **Edit in two places:** For local development, native changes are typically applied in both the SDK root (`ios/` or `android/`) and in the app that consumes the SDK (for example, under its `node_modules/@nutrient-sdk/react-native/ios/` or `.../android/`) so that builds use the modified sources.
- When working with the included Catalog sample app, you can:
  - Implement native changes in `ios/` and `android/`.
  - Ensure the Catalog app runs against those changes, either via `npm run dev-build` or by mirroring edits into the Catalog app’s `node_modules/@nutrient-sdk/react-native` copy as described in `BRIDGING.md`.
- After the user confirms they are happy, run the create-bridge-patch script (see `BRIDGING.md`) so they can persist the changes with `patch-package`.

## Self-verifying with native builds

- You **should** run the iOS and Android builds for the app that consumes this SDK (for example, the included Catalog sample app) to verify the code compiles after your bridge changes.
- Typical order when using the Catalog sample:
  1. Run `npm run dev-build` from the SDK root.
  2. Ensure the sample app’s `node_modules/@nutrient-sdk/react-native` reflects your native changes (either via `dev-build` or by copying native files as described in `BRIDGING.md`).
  3. Run the iOS build (e.g. via `xcodebuild`) and the Android build (e.g. `./gradlew assembleDebug`) from the sample app directories.
- If a build fails, fix the code and re-run until it succeeds.

## Native API references for bridging

- When you need exact native API signatures or behavior and the user hasn’t provided them:
  - For **iOS**, start with the LLMS guide index: `https://www.nutrient.io/guides/ios/llms.txt`
  - For **Android**, start with the LLMS guide index: `https://www.nutrient.io/guides/android/llms.txt`
- Use these LLMS documents to find the relevant **API reference pages** and **feature guides** **before guessing any native method names, parameters, or semantics**.
- When reading these LLMS reference files, **do not stop at the first plausible API you find**. Instead:
  - Continue scanning the document for **all APIs and guides related to the feature you’re implementing**.
  - Only after you’ve seen the full set of relevant options, choose the API whose semantics best match the user’s requirements.
- When you need the **precise method signatures and selectors** for the native SDKs, consult the official API references:
  - iOS Objective‑C API reference: `https://www.nutrient.io/api/ios/documentation/overview?language=objc`
  - iOS Swift API reference: `https://www.nutrient.io/api/ios/documentation/overview`
  - Android Kotlin/Java API reference: `https://www.nutrient.io/api/android/`

## Reference: key files (within this package)

| Purpose                | Location |
|------------------------|----------|
| Full recipe            | `BRIDGING.md` |
| Architecture detection | `src/ArchitectureDetector.ts` |
| App-level TurboModule  | `src/specs/NativeNutrientModule.ts` |
| View TurboModule       | `src/specs/NativeNutrientViewTurboModule.ts` |
| Fabric component       | `src/specs/NutrientViewNativeComponent.ts` |
| Public API             | `index.js` |
| Legacy Android         | `android/src/main/java/` |
| New Arch Android       | `android/src/newarch/java/` |
| Legacy iOS             | `ios/` (ViewManagers, RCT* modules) |
| New Arch iOS           | `ios/Turbo/`, `ios/Fabric/` |

