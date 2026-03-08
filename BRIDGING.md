# Bridging a Native API to the TypeScript Layer

**AI assistants:** When adding or changing any native API exposed to TypeScript/JS, you **MUST** follow this entire document step by step. Do not summarize or skip steps. Use the checklist at the end before submitting.

This document is the **single source of truth** for exposing a native API to the TypeScript/JavaScript layer in this React Native library. The library supports **both Legacy (Paper) and New Architecture (Fabric + TurboModules)**. Any new or changed native API **MUST** follow this recipe exactly so both architectures keep working.

**If you are an AI assistant:** You **MUST** follow every step below. Do not skip steps. Do not use only Legacy or only New Architecture. Do not invent a different pattern.

---

## Rule summary (MUST follow)

1. **Dual path**: Every public API that talks to native code **MUST** branch on `isNewArchitectureEnabled()`: New Architecture uses the TurboModule (or Fabric ref), Legacy uses `NativeModules` / `UIManager` / `requireNativeComponent`.
2. **Spec-first for New Architecture**: New Architecture APIs **MUST** be declared in a spec under `src/specs/` and implemented in native (Android `newarch`, iOS `Turbo/` or `Fabric/`).
3. **One public surface**: The public API (e.g. `index.js` or a class method) **MUST** be the only place callers use; internally it delegates to either the TurboModule/Fabric path or the Legacy path.

---

## Recipe: Adding or changing a native-backed API

### Step 0: Gather requirements (do not skip)

**If the user has not already provided answers to the questions below, you MUST ask them and wait for their answers before proceeding to Step 1. Do not assume or guess answers. Do not write any code until you have the answers.**

Ask the user:

1. **API / feature:** What exactly should be bridged? (e.g. "a new TurboModule method getDocumentMetadata that returns title and page count")
2. **Platform:** iOS only, Android only, or both?
3. **Module type:** App-level TurboModule (no view ref), View-backed TurboModule (operates on a specific view), or Fabric component (props/events)?
4. **Method name(s) and signatures:** Exact names and TypeScript signatures (e.g. `getDocumentMetadata(): Promise<{ title: string, pageCount: number }>`).
5. **Links to iOS/Android APIs or guides:** URLs to the native API docs or guides that describe the APIs being bridged (e.g. iOS Swift/Obj-C reference, Android Kotlin/Java reference, or SDK guides). Use these to understand the native APIs when implementing.
6. **Extra context:** Is the native API already implemented elsewhere? Different name on one platform? Any constraints?

**Do not proceed to Step 1 until the user has answered.** If the user's initial message already contains these answers (e.g. they used the prompt template and filled it in), you may skip asking and go to Step 1.

### Special rule for `PDFDocument` APIs (document-centric operations)

When you add or change methods on the **`PDFDocument`** TypeScript class (`src/document/PDFDocument.ts`), you **MUST**:

- **Prefer the document-native modules over view modules:**
  - **iOS:** Call into the existing `PDFDocumentManager` native module (`ios/PDFDocumentManager.swift` + `PDFDocumentManager.m`) whenever possible, instead of adding new APIs to `NutrientViewTurboModule` / view managers for document-centric behavior.
  - **Android:** Mirror the behavior via the existing document module on Android (`android/src/main/java/com/pspdfkit/react/PDFDocumentModule.kt`), again avoiding view modules for operations that conceptually belong to the document.
- **Pattern:**
  - JS/TS (`PDFDocument.ts`) should invoke `NativeModules.PDFDocumentManager.*` / `NativeModules.PDFDocumentModule.*` style methods for document operations (page metadata, rotation, annotations, bookmarks, etc.).
  - Only use `NutrientView`/view-backed TurboModules when the API truly acts on the **view** (UI state, toolbar, selection, visibility), not on the document model itself.
- **Rationale:** This keeps all document logic consolidated in the document managers on each platform, preserves parity between iOS (`PDFDocumentManager`) and Android (`PDFDocumentModule`), and prevents leaking view-specific details into the `PDFDocument` abstraction.
 - **Note (iOS reload behavior):** `PDFDocumentManager.swift` can trigger a reload of the active `PDFViewController` via its delegate hook `delegate?.reloadControllerData?()`. When you add document-centric behavior that changes what’s shown (like page rotation), prefer using this delegate path from `PDFDocumentManager` instead of reaching for the view controller directly.

### Step 1: Decide the API shape

- **TurboModule (no view ref)**: App-level APIs (e.g. license key, `present()`, `dismiss()`).  
  Spec: `src/specs/NativeNutrientModule.ts`  
  Native: Android `src/newarch/java/`, iOS `ios/Turbo/NutrientTurboModule.mm` (or equivalent).
- **View-backed TurboModule (needs a view ref)**: APIs that operate on a specific `NutrientView` instance (e.g. `setPageIndex`, `saveCurrentDocument`).  
  Spec: `src/specs/NativeNutrientViewTurboModule.ts`  
  Native: Android `src/newarch/java/`, iOS `ios/Turbo/NutrientViewTurboModule.mm`.
- **Fabric component**: Rendering and props/events for the view.  
  Spec: `src/specs/NutrientViewNativeComponent.ts`  
  Native: Android Fabric component, iOS `ios/Fabric/`.

You **MUST** implement **both**:

- The **Legacy** path: `NativeModules.<ModuleName>` (and where applicable `UIManager.dispatchViewManagerCommand` / `findNodeHandle`).
- The **New Architecture** path: TurboModule or Fabric component, as above.

### Step 2: New Architecture – TypeScript spec

1. **File**:  
   - App-level module: `pspdfkit-react-native/src/specs/NativeNutrientModule.ts`  
   - View-backed module: `pspdfkit-react-native/src/specs/NativeNutrientViewTurboModule.ts`

2. **In the spec file**:
   - Add or update the `Spec` interface (extends `TurboModule`).
   - Use exact method names and types that match what the native side will implement.
   - For events, use `EventEmitter<Payload>` from `react-native/Libraries/Types/CodegenTypes`.
   - Export the spec and use `TurboModuleRegistry.getEnforcing<Spec>('NativeModuleName')` (the string **MUST** match the name registered on native).

3. **Do NOT**:
   - Call `TurboModuleRegistry.getEnforcing` from the public API layer; the public API must branch on `isNewArchitectureEnabled()` and then call into the TurboModule **or** Legacy `NativeModules`.
   - Add a new TurboModule without adding the same API to the Legacy path (or vice versa).

### Step 3: New Architecture – Native implementation

1. **Android**  
   - Implement the method in the appropriate TurboModule/ViewManager under `android/src/newarch/java/`.  
   - Ensure the module/view is registered so the name passed to `TurboModuleRegistry.getEnforcing` resolves.

2. **iOS**  
   - Implement the method in `ios/Turbo/` (e.g. `NutrientTurboModule.mm` or `NutrientViewTurboModule.mm`).  
   - For view-backed APIs, use the view registry (e.g. `NutrientViewRegistry`) to resolve the view by identifier when required.

3. **MUST**: Keep method signatures (names, argument types, return types) in sync with the TypeScript spec and with the Legacy implementation behavior.

### Step 4: Legacy – Native implementation

1. **Android**  
   - Implement or update the method in the appropriate module under `android/src/main/java/` (Legacy).  
   - Ensure it is exposed via the same module name used by `NativeModules.<ModuleName>` on the JS side.

2. **iOS**  
   - Implement or update the method in the appropriate Legacy module (e.g. `RCTPSPDFKitViewManager`, `RCTNutrientModule`).  
   - Ensure the module is registered so `NativeModules.<ModuleName>` resolves.
   - **Keep headers and implementations in sync**: any selector you call from a view manager macro (e.g. `RCT_CUSTOM_VIEW_PROPERTY`) or from Fabric **must** be declared in the corresponding `*.h` (e.g. `RCTPSPDFKitView.h`) and implemented in `*.m`. Missing header declarations will surface as “No visible @interface…” compile errors in the app.

### Step 5: Public API layer – Dual branch

1. **Where**:  
   - For `NutrientView` ref methods: `pspdfkit-react-native/index.js` (the class that wraps the view and its ref).  
   - For app-level APIs: `pspdfkit-react-native/index.js` or the relevant export (e.g. `Nutrient` singleton).

2. **Pattern** (you **MUST** follow this structure):

   ```javascript
   methodName = function (arg1, arg2) {
     const { isNewArchitectureEnabled } = require('./lib/ArchitectureDetector');
     if (isNewArchitectureEnabled()) {
       // New Architecture: TurboModule or Fabric ref
       return this._fabricRef.current?.methodName(arg1, arg2);
       // OR for app-level: return NativeNutrientModule.methodName(arg1, arg2);
     }
     // Legacy: NativeModules / UIManager
     if (Platform.OS === 'android') {
       // Android Legacy implementation
       return NativeModules.ModuleName.methodName(/* ... */);
     } else if (Platform.OS === 'ios') {
       return NativeModules.ModuleName.methodName(/* ... */);
     }
   };
   ```

3. **Do NOT**:
   - Expose only the Legacy path or only the New Architecture path.
   - Use the TurboModule directly in the public API without branching; the public API **MUST** branch first, then call either TurboModule or `NativeModules`.

### Step 6: Architecture detection

- **MUST** use the existing helper: `isNewArchitectureEnabled()` from `./lib/ArchitectureDetector` (in `index.js`) or from `../ArchitectureDetector` (in `src/`).
- **Do NOT** replace this with a different check (e.g. `__turboModuleProxy` only) or hardcode one architecture.

### Step 7: Types and exports

- If the public API is documented in `index.js`, run `npm run generate-types` so `types/index.d.ts` stays in sync.
- Export any new types or constants from the appropriate entry (e.g. `index.js` or `src/`) so they are part of the public API.

---

## Checklist before submitting

Use this list to verify the recipe was followed. **Every item MUST be true.**

- [ ] The new or changed API is available on **both** Legacy and New Architecture.
- [ ] New Architecture path: TypeScript spec updated under `src/specs/` and native implementation updated under Android `newarch` and iOS `Turbo/` (or `Fabric/` for view props/events).
- [ ] Legacy path: Native implementation updated under Android `src/main/java/` and iOS Legacy modules.
- [ ] Public API (e.g. `index.js`) branches on `isNewArchitectureEnabled()` and then calls either the TurboModule/Fabric path or the Legacy path.
- [ ] No direct use of `TurboModuleRegistry.getEnforcing` in the public API layer; it is only used inside spec modules or Fabric wrappers.
- [ ] `ArchitectureDetector` is used for the check; no ad-hoc or different detection.
- [ ] Types/docs: `generate-types` (and any docs step) has been run if the public surface changed.
- [ ] For iOS, any new selectors used from `RCTPSPDFKitViewManager` (`RCT_CUSTOM_VIEW_PROPERTY`, exported methods) or Fabric (`NutrientView.mm`) are declared in `RCTPSPDFKitView.h` and implemented in `RCTPSPDFKitView.m`, and these changes are mirrored into the app’s `node_modules/@nutrient-sdk/react-native/ios` copy.
- [ ] **Copy native files into node_modules:** After editing native code, you have copied every modified iOS file into `samples/Catalog/node_modules/@nutrient-sdk/react-native/ios/` and every modified Android file into `samples/Catalog/node_modules/@nutrient-sdk/react-native/android/`. Without this, the Catalog app will not see your changes. Use `cp` or equivalent; do not skip this step.
- [ ] **Native builds run and pass:** You have run the iOS build (xcodebuild) and the Android build (gradlew assembleDebug) yourself via the Shell tool, read the output, fixed any errors, and re-run until both succeed. You do not consider the bridge complete until both builds pass.

### Copying native files into node_modules (MUST do before building)

After implementing native changes in the SDK root (`pspdfkit-react-native/ios/` and/or `android/`), you **MUST** copy those changed files into the Catalog app’s copy of the SDK so the build uses your code:

- **iOS:** Copy each modified file under `pspdfkit-react-native/ios/` (e.g. `RCTPSPDFKitView.m`, `RCTPSPDFKitViewManager.m`, `Turbo/NutrientViewTurboModule.mm`, etc.) to `pspdfkit-react-native/samples/Catalog/node_modules/@nutrient-sdk/react-native/ios/`, preserving path (e.g. `ios/Turbo/NutrientViewTurboModule.mm` → `node_modules/.../ios/Turbo/NutrientViewTurboModule.mm`).
- **Android:** Copy each modified file under `pspdfkit-react-native/android/` to `pspdfkit-react-native/samples/Catalog/node_modules/@nutrient-sdk/react-native/android/`, preserving path.

Use `cp` (or a script) from the Shell tool. `npm run dev-build` does **not** copy native sources; it only syncs JS/TS. The Catalog build reads from `node_modules`, so this copy is required.

### Validating changes: run iOS and Android builds (MUST run; fix errors)

After the checklist passes and **after you have copied native edits into** `samples/Catalog/node_modules/@nutrient-sdk/react-native/`, you **MUST** run the Catalog builds yourself to verify compilation:

1. **Run the builds** using the Shell tool. Request `required_permissions: ["all"]` and a long timeout (e.g. 300000–600000 ms). The user may need to approve the command; do not only provide the commands for the user to copy-paste—you must execute them and read the output.
2. **iOS:** `cd pspdfkit-react-native/samples/Catalog/ios && pod install && xcodebuild -workspace Catalog.xcworkspace -scheme Catalog -configuration Debug -sdk iphonesimulator build`
3. **Android:** `cd pspdfkit-react-native/samples/Catalog/android && ./gradlew assembleDebug`
4. If a build fails, read the error output, fix the issue in the SDK root and in `node_modules/@nutrient-sdk/react-native` (keep them in sync), then re-run the failed build until it succeeds. Do not consider the bridge work complete until both iOS and Android builds succeed.

---

## Wrong vs correct (examples)

**Wrong:** Only implementing the Legacy path.

```javascript
// WRONG: No New Architecture branch
saveDocument = function () {
  return NativeModules.PSPDFKitViewManager.saveCurrentDocument(findNodeHandle(this._componentRef.current));
};
```

**Correct:** Both paths.

```javascript
// CORRECT: Branch, then Legacy or TurboModule/Fabric
saveCurrentDocument = function () {
  const { isNewArchitectureEnabled } = require('./lib/ArchitectureDetector');
  if (isNewArchitectureEnabled()) {
    return this._fabricRef.current?.saveCurrentDocument();
  }
  if (Platform.OS === 'ios') {
    return NativeModules.PSPDFKitViewManager.saveCurrentDocument(findNodeHandle(this._componentRef.current));
  }
  // ... Android Legacy
};
```

**Wrong:** Calling the TurboModule directly from the public API without branching.

```javascript
// WRONG: Public API must not assume New Architecture only
import NativeNutrientViewTurboModule from './src/specs/NativeNutrientViewTurboModule';
// ...
return NativeNutrientViewTurboModule.setPageIndex(pageIndex, animated);
```

**Correct:** Public API branches, then delegates to TurboModule or Legacy.

```javascript
// CORRECT: index.js or view wrapper branches first
const { isNewArchitectureEnabled } = require('./lib/ArchitectureDetector');
if (isNewArchitectureEnabled()) {
  return this._fabricRef.current?.setPageIndex(pageIndex, animated);
}
return NativeModules.PSPDFKitViewManager.setPageIndex(pageIndex, animated, findNodeHandle(this._componentRef.current));
```

---

## Native API references for bridging

- When you need exact native API signatures or behavior and the user hasn’t provided them:
  - For **iOS**, start with the LLMS guide index: `https://www.nutrient.io/guides/ios/llms.txt`
  - For **Android**, start with the LLMS guide index: `https://www.nutrient.io/guides/android/llms.txt`
- Use these LLMS documents to discover the relevant **API reference pages** and **feature guides** **before guessing any native method names, selectors, parameters, or semantics**.
- When reading these LLMS reference files, **do not stop at the first plausible API you find**. Instead:
  - Continue scanning for **all APIs and guides related to the feature you’re implementing**
  - Only after you’ve seen the full set of relevant options, choose the API whose semantics best match the user’s requirements.
- When you need the **precise method signatures and selectors**, consult the official API references:
  - iOS Objective‑C API reference: `https://www.nutrient.io/api/ios/documentation/overview?language=objc`
  - iOS Swift API reference: `https://www.nutrient.io/api/ios/documentation/overview`
  - Android Kotlin/Java API reference: `https://www.nutrient.io/api/android/`

## Reference: Key files

| Purpose                         | Location |
|---------------------------------|----------|
| Architecture detection          | `src/ArchitectureDetector.ts` |
| App-level TurboModule spec      | `src/specs/NativeNutrientModule.ts` |
| View TurboModule spec           | `src/specs/NativeNutrientViewTurboModule.ts` |
| Fabric component spec           | `src/specs/NutrientViewNativeComponent.ts` |
| Public API (view + app methods) | `index.js` |
| Codegen config                  | `package.json` → `codegenConfig` |
| Legacy Android                  | `android/src/main/java/` |
| New Arch Android                | `android/src/newarch/java/` |
| Legacy iOS                      | `ios/` (e.g. ViewManagers, RCT* modules) |
| New Arch iOS                    | `ios/Turbo/`, `ios/Fabric/` |

---

## After implementation: creating a patch with patch-package

Once the customer has tested the changes and is happy with the result, the AI agent **MUST** help them create a **patch** so they can commit it to source control and reliably reapply it to the standard `@nutrient-sdk/react-native` package (e.g. after `npm install`).

### Development and testing setup

- Implement changes in the **local SDK** (e.g. the cloned `pspdfkit-react-native/` directory).
- For testing, the app (e.g. Catalog or the customer's app) must run against the modified code. Do that by either:
  - Running `npm run dev-build` from the SDK root so the built files are copied into the app's `node_modules/@nutrient-sdk/react-native`, or
  - Applying the same edits under the app's `node_modules/@nutrient-sdk/react-native` so the app uses the patched code.
- The customer tests; when they confirm they are happy, proceed to creating the patch.

### Creating the patch: run the script

A script does the same steps every time. **Do not** have the agent run patch-package steps manually—have it run this script instead.

**From the app root** (e.g. your app or `samples/Catalog`):

```bash
node node_modules/@nutrient-sdk/react-native/scripts/create-bridge-patch.js
```

**From the SDK repo** (e.g. after testing with Catalog):

```bash
npm run create-bridge-patch -- samples/Catalog
# or
node scripts/create-bridge-patch.js samples/Catalog
```

The script will:

1. Ensure the app has `patch-package` in devDependencies and `"postinstall": "patch-package"` in scripts (and run `npm install` if it added them).
2. Run `patch-package` for `@nutrient-sdk/react-native`, creating or updating `patches/@nutrient-sdk+react-native+X.Y.Z.patch` in the app repo.
3. Tell the user to commit the `patches/` directory.

**MUST:** Run the script only after the user has confirmed they are happy with the implementation. The agent should run the script only after the user says they want to save the changes for source control.

---

## Suggested prompt for AI assistants (for customers)

To avoid the AI inventing its own approach or skipping steps, **give the AI this exact prompt** and only fill in the bracketed parts. Do not let the AI work from a free-form description of what you want.

**Why point the prompt at this .md file?** The prompt is designed to **point explicitly at this file** (and, on Cursor, to include it via `@` so it is in context). That way the agent is **instructed to follow this recipe** and has the full text available. We do not rely on the agent "listening to everything" in a long doc on its own—the prompt says "MUST follow the recipe in … BRIDGING.md" and "Read that file first," so the agent loads and follows this document.

**1. Always load the recipe first (Cursor: use @ to include the file in context):**

- Cursor: Start your message with `@pspdfkit-react-native/BRIDGING.md` so the recipe is in context.
- Other tools: Paste the instruction below and ensure the AI has access to this repo; tell it to read `pspdfkit-react-native/BRIDGING.md` before doing anything.

**2. Copy this prompt and fill in every `[ ]`:**

```
You MUST follow the recipe in pspdfkit-react-native/BRIDGING.md step by step. Do not skip steps or use a different pattern. Read that file first. The user has already provided the requirements below; do not ask again—proceed to Step 1 of the recipe.

Requirements:

- **API / feature:** [e.g. "a new TurboModule method getDocumentMetadata that returns title and page count"]
- **Platform:** [iOS only / Android only / both]
- **Module:** [App-level TurboModule (NativeNutrientModule) / View-backed TurboModule (NativeNutrientViewTurboModule) / Fabric component]
- **Method name(s) and signatures:** [e.g. getDocumentMetadata(): Promise<{ title: string, pageCount: number }>]
- **Links to iOS/Android APIs or guides:** [e.g. "https://developer.apple.com/documentation/...", "https://developer.android.com/reference/...", or SDK guide URLs—use these to understand the native APIs when implementing]
- **Extra context:** [e.g. "already implemented in iOS in MyCustomModule.mm" or "none"]

After implementing:
1. Use the "Checklist before submitting" in BRIDGING.md and confirm each item.
2. Ensure changes exist both in the local SDK and (for testing) in the app's node_modules/@nutrient-sdk/react-native (e.g. via npm run dev-build from the SDK, or by applying the same edits under node_modules).
3. After the user confirms they are happy with the result, run the create-bridge-patch script so they can commit the patch. From the app root run: `node node_modules/@nutrient-sdk/react-native/scripts/create-bridge-patch.js` (or from SDK repo: `node scripts/create-bridge-patch.js samples/Catalog`). Then tell the user to commit the `patches/` directory to source control. Do not run patch-package steps manually—use the script.
```

Using this prompt (and including BRIDGING.md when possible) makes the AI follow the recipe instead of improvising.

---

This recipe ensures that customers who fork or clone the repo can add their own native APIs in a consistent way and keep Legacy and New Architecture working. Deviations lead to runtime errors or missing features on one architecture.
