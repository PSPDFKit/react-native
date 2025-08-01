# Nutrient React Native SDK Project Context

## Project Overview
This is the official Nutrient React Native SDK repository. It provides React Native components and native modules for viewing, annotating, and manipulating PDF documents on iOS and Android platforms.

## Tech Stack
- **React Native**: 0.73+ (supports both Legacy and New Architecture)
- **Nutrient React Native SDK**: Native PDF viewing and annotation library
- **TypeScript**: Primary language for JavaScript/TypeScript code
- **iOS**: Swift/Objective-C native modules
- **Android**: Kotlin/Java native modules
- **Metro**: React Native bundler

## Architecture
- **Architecture Support**: Legacy Bridge. New Architecture (Fabric/TurboModules) coming soon.
- **Native Modules**: Custom Nutrient integration for both platforms
- **View Components**: NutrientView component with native view implementations
- **Event System**: Cross-platform event handling for document and annotation events

## Key Directories
- `/pspdfkit-react-native/`: Main SDK source code
- `/pspdfkit-react-native/src/`: TypeScript source files
- `/pspdfkit-react-native/android/`: Android native implementation
- `/pspdfkit-react-native/ios/`: iOS native implementation
- `/pspdfkit-react-native/samples/Catalog/`: Example app
- `/pspdfkit-react-native/types/`: TypeScript type definitions

## Important Files
- `/pspdfkit-react-native/index.js`: Main SDK entry point and NutrientView component
- `/pspdfkit-react-native/src/configuration/PDFConfiguration.ts`: Configuration options
- `/pspdfkit-react-native/android/src/main/java/com/pspdfkit/react/`: Android native modules
- `/pspdfkit-react-native/ios/RCTPSPDFKit/`: iOS native modules

## Development Conventions
- **TypeScript First**: All new code should use TypeScript
- **Dual Architecture**: Support both Legacy and New Architecture simultaneously
- **Platform Parity**: Ensure iOS and Android implementations are feature-equivalent
- **Event Consistency**: Use consistent event naming across platforms
- **Configuration Objects**: Use strongly-typed configuration objects

## Key Components
- **NutrientView**: Main React Native component for PDF viewing
- **Nutrient**: Native module for document operations
- **PDFConfiguration**: Configuration options for PDF behavior
- **Toolbar**: Customization options for the PDF toolbar
- **Annotation**: Annotation creation and management

## Migration Context
- **Legacy Architecture**: Current bridge-based system
- **New Architecture**: Fabric (rendering) + TurboModules (native modules)
- **Dual Support**: Must maintain compatibility with both architectures
- **Gradual Migration**: Users can opt into New Architecture when ready

## Common Patterns
- **Event Handling**: Use consistent event naming (`onDocumentLoaded`, `onAnnotationTapped`)
- **Configuration**: Pass configuration objects to customize behavior
- **Native Modules**: Use platform-specific implementations with shared interfaces
- **Error Handling**: Consistent error handling across platforms

## Important Notes
- Nutrient is a commercial SDK requiring license keys
- Support both trial mode (with watermarks) and licensed mode
- Maintain backward compatibility during architecture migrations
- Follow Nutrient's native SDK conventions for consistency 