# PSPDFKit Fabric Component Implementation

This directory contains the Fabric (New Architecture) implementation for the PSPDFKit React Native component.

## Overview

The Fabric implementation provides a bridge between React Native's new architecture and the existing PSPDFKit view implementation. It allows the library to work with both the legacy Paper architecture and the new Fabric architecture.

## Files

- `NutrientView.h` / `NutrientView.mm` — The main Fabric component view that wraps the existing `RCTPSPDFKitView`. This is the component registered with React Native's codegen system.
- `../Common/NutrientViewRegistry.h` / `../Common/NutrientViewRegistry.m` — Registry used to map Fabric `nativeID` values to `RCTPSPDFKitView` instances so TurboModules can look up the correct view.
- `../Turbo/NutrientViewTurboModule.h` / `../Turbo/NutrientViewTurboModule.mm` — TurboModule exposing imperative commands (e.g. enter/exit modes, get/set configuration) that operate on a specific Fabric view via the registry.

## How It Works

1. **Component Registration**: The component is automatically registered via React Native's codegen system based on the `codegenConfig` in `package.json`.
2. **Props Handling**: Props are provided as C++ types in `updateProps:`. JSON passthrough props (like `configurationJSONString`, `toolbarJSONString`) are parsed and applied via helper classes.
3. **View Rendering**: The Fabric component view creates and manages an instance of `RCTPSPDFKitView`, which handles all PDF rendering.
4. **Event Handling**: Events are emitted through the codegen-generated `EventEmitter` interface and forwarded to JS.

## Architecture Compatibility

- **Paper (Legacy)**: Uses `RCTPSPDFKitView` via the legacy ViewManager.
- **Fabric (New)**: Uses the `NutrientView` codegen component, which wraps `RCTPSPDFKitView` while providing Fabric-compatible props/events.

## Usage

The component is available automatically when the New Architecture is enabled. The component name `NutrientView` is defined by codegen and matches the TypeScript interface in `src/specs/NutrientViewNativeComponent.ts`.

## Development Notes

- The Fabric implementation reuses most of the existing `RCTPSPDFKitView` logic.
- Props are mapped by React Native's codegen system; JSON passthrough props are parsed in Objective‑C++.
- The `NutrientViewRegistry` enables TurboModule methods to identify and act on a specific view instance by `nativeID`.
- Component registration is handled automatically by React Native's codegen system.

## Future Enhancements

- Add more prop mappings as needed
- Implement custom event handling if required
- Add performance optimizations specific to Fabric
- Consider adding state management for complex interactions 