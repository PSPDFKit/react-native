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

# PSPDFKitPackage installs an RxJava error handler by reflection when RxJava 3 is on the classpath.
# Nothing calls setErrorHandler directly, so -keepnames would let R8 remove it. -keepclassmembers keeps
# the members only while their class is kept, so R8 can still remove RxJava if the app doesn't use it.
-keepclassmembers class io.reactivex.rxjava3.plugins.RxJavaPlugins { public static void setErrorHandler(io.reactivex.rxjava3.functions.Consumer); }
-keepclassmembers interface io.reactivex.rxjava3.functions.Consumer { void accept(java.lang.Object); }
