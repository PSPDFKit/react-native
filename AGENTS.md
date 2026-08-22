# Nutrient React Native SDK – AI Agent Guide

This file provides guidance to AI agents (Cursor, Claude, GitHub Copilot Chat, etc.) when working in this repository. Paths in this guide are relative to the repository root (e.g. `BRIDGING.md`, `ios/`, `src/`).

It is designed so that customers who clone or fork this repository can safely let AI agents help them extend or customize the React Native SDK, especially when bridging new native APIs.

If you are an AI assistant reading this file, you **MUST** follow the rules in this document when changing code in this repo.

## Scope

- This repo is the **Nutrient React Native SDK** package:
  - Public npm package: `@nutrient-sdk/react-native`
  - Public GitHub repo: `PSPDFKit/react-native`
- It exposes native iOS and Android SDKs to React Native via:
  - Legacy Architecture (bridge-based)
  - New Architecture (Fabric + TurboModules)

Whenever you add or change a native-backed API that is visible from TypeScript/JavaScript, you **MUST** follow the bridging recipe in:

- `BRIDGING.md`

## When to use the bridging recipe

Use `BRIDGING.md` (and the corresponding `skills/react-native-bridge-recipe/SKILL.md` if your tool supports skills) whenever:

- **You touch native-backed APIs exposed to JS/TS**, including:
  - `index.js` public methods that call into native code
  - `src/specs/` (TurboModule/Fabric specs)
  - `android/src/**` or `ios/**` native implementations that are used from JS
- The user asks to:
  - "Bridge" an iOS/Android feature to React Native
  - Add/change a TurboModule or Fabric component
  - Add/change a method on `PDFDocument`, `NutrientView`, or any other class that calls into native code

If you are not sure whether a change is native-backed, **assume it is** and follow `BRIDGING.md`.

## Core rules (must follow)

These are summaries; the **full source of truth is `BRIDGING.md`**.

- **Dual architecture support is mandatory**
  - Every public API that talks to native **MUST** work in both:
    - Legacy Architecture (bridge-based: `NativeModules`, `UIManager`, `requireNativeComponent`)
    - New Architecture (Fabric + TurboModules)
  - Do **not** add an API that works only on one architecture.

- **Single public surface**
  - Callers use only the public API (usually `index.js` and the exported classes/components).
  - The public API **branches on** `isNewArchitectureEnabled()` and then delegates to:
    - TurboModule / Fabric implementation (New Architecture), or
    - Legacy bridge implementation (`NativeModules`, `UIManager`, etc.).
  - Do **not** expose TurboModules or Legacy-only modules directly to consumers.

- **Spec‑first for New Architecture**
  - All New Architecture APIs must be declared in `src/specs/` and implemented under:
    - Android: `android/src/newarch/java/`
    - iOS: `ios/Turbo/` and/or `ios/Fabric/`

## File layout (within this package)

- `src/`
  - TypeScript source, including:
    - `annotations/`, `configuration/`, `document/`, `forms/`, `measurements/`
    - `notification-center/`, `toolbar/`
    - `specs/` (TurboModule/Fabric specs)
- `lib/`
  - Compiled JavaScript from `src/`
- `types/`
  - Generated `.d.ts` definitions
- `android/`
  - `src/main/java/`: Legacy implementation
  - `src/newarch/java/`: New Architecture implementation
- `ios/`
  - `Common/`, `Converters/`, `Fabric/`, `Turbo/`, `Helpers/`
- `samples/Catalog/`
  - Example app used for development and testing

## Safe changes vs risky changes

- **Generally safe (no native changes):**
  - Pure TypeScript changes under `src/` that do **not** call native
  - Documentation in `README.md`, `CHANGELOG.md`, comments
  - Sample app JS/TS changes in `samples/Catalog` that do not alter native APIs

- **Risky (must follow `BRIDGING.md`):**
  - Any changes to:
    - `index.js` methods that call native code
    - `src/specs/**`
    - `android/src/**` or `ios/**` that are called from JS
    - `PDFDocument` methods that interact with the document on native
    - `NutrientView` props, commands, or events

If in doubt, treat the change as **native-backed** and follow the bridging recipe.

## Native API references

When implementing or modifying native-backed APIs:

- **iOS**
  - LLMS guide index: `https://www.nutrient.io/guides/ios/llms.txt`
  - Objective‑C API reference: `https://www.nutrient.io/api/ios/documentation/overview?language=objc`
  - Swift API reference: `https://www.nutrient.io/api/ios/documentation/overview`

- **Android**
  - LLMS guide index: `https://www.nutrient.io/guides/android/llms.txt`
  - Kotlin/Java API reference: `https://www.nutrient.io/api/android/`

You should **scan all relevant APIs and guides** before choosing which native API to use, rather than stopping at the first plausible match.

## Testing expectations (for agents and humans)

- For non-trivial changes, especially native-backed ones, you should:
  - Run the Catalog app on iOS and/or Android
  - Run unit tests (`npm test`) and linters (`npm run lint`) when applicable
  - For native bridge changes, follow the build and validation steps in `BRIDGING.md`

This ensures that custom bridges and extensions added by customers remain robust across both architectures.

