# Keep rules applied to apps that use this module when they build with R8. Keep only what is reached
# by name rather than by a normal Java/Kotlin reference. React Native's own rules already keep every
# NativeModule (including turbo modules and view managers) and @ReactMethod/@ReactProp members.

# PSPDFKitPackage creates these with Class.forName, reading NAME and calling their constructors, so
# the old architecture can run without the new-architecture classes on the classpath.
-keep class io.nutrient.react.turbo.NutrientTurboModule { public static final java.lang.String NAME; <init>(...); }
-keep class io.nutrient.react.turbo.NutrientViewTurboModule { public static final java.lang.String NAME; <init>(...); }
-keep class io.nutrient.react.turbo.NutrientInstantViewTurboModule { public static final java.lang.String NAME; <init>(...); }
-keep class io.nutrient.react.fabric.ReactPdfViewManagerFabric { <init>(); }
-keep class io.nutrient.react.fabric.ReactInstantPdfViewManagerFabric { <init>(); }

# The Nutrient Android SDK detects React Native with Class.forName on these names (HybridLicenseHelper).
-keepnames class com.pspdfkit.react.PSPDFKitPackage
-keepnames class com.pspdfkit.react.PSPDFKitModule
