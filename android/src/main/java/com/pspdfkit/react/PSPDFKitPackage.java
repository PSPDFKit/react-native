/*
 * PSPDFKitPackage.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2026 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

package com.pspdfkit.react;

import android.app.Application;

import androidx.annotation.NonNull;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.HashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;

public class PSPDFKitPackage extends BaseReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {

        // Check if we're in New Architecture by trying to load TurboModule classes
        boolean isNewArch = false;
        try {
            Class.forName("io.nutrient.react.turbo.NutrientViewTurboModule");
            isNewArch = true;
        } catch (ClassNotFoundException e) {
            // Old Architecture - handle regular modules via getModule()
            android.util.Log.d("PSPDFKitPackage", "Old Architecture detected in getModule for: " + name);
        }

        // Handle New Architecture TurboModules
        if (isNewArch) {
            try {
                Class<?> viewTurboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientViewTurboModule");
                Object viewTurboModuleConstant = viewTurboModuleClass.getField("NAME").get(null);
                if (viewTurboModuleConstant.equals(name)) {
                    return (NativeModule) viewTurboModuleClass.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
                }
            } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException | InstantiationException | java.lang.reflect.InvocationTargetException | NoSuchMethodException e) {
                // TurboModule not available
            }

            try {
                Class<?> turboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientTurboModule");
                Object turboModuleConstant = turboModuleClass.getField("NAME").get(null);
                if (turboModuleConstant.equals(name)) {
                    return (NativeModule) turboModuleClass.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
                }
            } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException | InstantiationException | java.lang.reflect.InvocationTargetException | NoSuchMethodException e) {
                // TurboModule not available
            }

            try {
                Class<?> instantViewTurboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientInstantViewTurboModule");
                Object instantViewTurboModuleConstant = instantViewTurboModuleClass.getField("NAME").get(null);
                if (instantViewTurboModuleConstant.equals(name)) {
                    return (NativeModule) instantViewTurboModuleClass.getConstructor(ReactApplicationContext.class).newInstance(reactContext);
                }
            } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException | InstantiationException | java.lang.reflect.InvocationTargetException | NoSuchMethodException e) {
                // TurboModule not available
            }
        }

        // Handle regular NativeModules in both Old and New Architecture
        // In Old Architecture, BaseReactPackage will call getModule() for all modules
        // In New Architecture, getModule() is also called for regular modules
        if ("PSPDFKitModule".equals(name)) {
            return new PSPDFKitModule(reactContext);
        }
        if ("TestingModule".equals(name)) {
            return new TestingModule(reactContext);
        }
        if ("PDFDocumentManager".equals(name)) {
            return new PDFDocumentModule(reactContext);
        }
        if ("RNProcessor".equals(name)) {
            return new RNProcessor(reactContext);
        }

        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();

            // Check if we're running in New Architecture by checking if TurboModules exist
            boolean isNewArch = false;
            try {
                Class.forName("io.nutrient.react.turbo.NutrientViewTurboModule");
                isNewArch = true;
            } catch (ClassNotFoundException e) {
                // Old Architecture - register regular modules as non-TurboModules
                android.util.Log.d("PSPDFKitPackage", "Old Architecture - registering regular modules");
            }

            // Always register these as NativeModules
            moduleInfos.put(
                    "PDFDocumentManager",
                    new ReactModuleInfo(
                            "PDFDocumentManager",
                            "PDFDocumentModule",
                            false, // canOverrideExistingModule
                            false, // needsEagerInit
                            false, // hasConstants
                            false, // isCxxModule
                            false  // isTurboModule
                    )
            );
            moduleInfos.put(
                    "RNProcessor",
                    new ReactModuleInfo(
                            "RNProcessor",
                            "RNProcessor",
                            false, // canOverrideExistingModule
                            false, // needsEagerInit
                            false, // hasConstants
                            false, // isCxxModule
                            false  // isTurboModule
                    )
            );

            // Register New Architecture TurboModules only when New Architecture is enabled
            if (isNewArch) {
                try {
                    Class<?> viewTurboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientViewTurboModule");
                    String viewTurboModuleName = (String) viewTurboModuleClass.getField("NAME").get(null);
                    moduleInfos.put(
                            viewTurboModuleName,
                            new ReactModuleInfo(
                                    viewTurboModuleName,
                                    viewTurboModuleName,
                                    false, // canOverrideExistingModule
                                    false, // needsEagerInit
                                    true,  // hasConstants
                                    false, // isCxxModule
                                    true   // isTurboModule
                            )
                    );
                } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException e) {
                    // Should not happen if isNewArch is true
                }

                try {
                    Class<?> turboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientTurboModule");
                    String turboModuleName = (String) turboModuleClass.getField("NAME").get(null);
                    moduleInfos.put(
                            turboModuleName,
                            new ReactModuleInfo(
                                    turboModuleName,
                                    turboModuleName,
                                    false, // canOverrideExistingModule
                                    false, // needsEagerInit
                                    true,  // hasConstants
                                    false, // isCxxModule
                                    true   // isTurboModule
                            )
                    );
                } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException e) {
                    // Should not happen if isNewArch is true
                }

                try {
                    Class<?> instantViewTurboModuleClass = Class.forName("io.nutrient.react.turbo.NutrientInstantViewTurboModule");
                    String instantViewTurboModuleName = (String) instantViewTurboModuleClass.getField("NAME").get(null);
                    moduleInfos.put(
                            instantViewTurboModuleName,
                            new ReactModuleInfo(
                                    instantViewTurboModuleName,
                                    instantViewTurboModuleName,
                                    false, // canOverrideExistingModule
                                    false, // needsEagerInit
                                    true,  // hasConstants
                                    false, // isCxxModule
                                    true   // isTurboModule
                            )
                    );
                } catch (ClassNotFoundException | NoSuchFieldException | IllegalAccessException e) {
                    // Should not happen if isNewArch is true
                }
            } else {
                moduleInfos.put(
                        "PSPDFKitModule",
                        new ReactModuleInfo(
                                "Nutrient",
                                "PSPDFKitModule",
                                false, // canOverrideExistingModule
                                false, // needsEagerInit
                                false, // hasConstants
                                false, // isCxxModule
                                false  // isTurboModule (always false for regular modules)
                        )
                );

                moduleInfos.put(
                        "TestingModule",
                        new ReactModuleInfo(
                                "TestingModule",
                                "TestingModule",
                                false, // canOverrideExistingModule
                                false, // needsEagerInit
                                false, // hasConstants
                                false, // isCxxModule
                                false  // isTurboModule
                        )
                );
            }

            return moduleInfos;
        };
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new ReactPdfViewManager());

        // Only add Fabric ViewManagers if New Architecture is enabled
        try {
            Class<?> fabricManagerClass = Class.forName("io.nutrient.react.fabric.ReactPdfViewManagerFabric");
            ViewManager fabricManager = (ViewManager) fabricManagerClass.getDeclaredConstructor().newInstance();
            viewManagers.add(fabricManager);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | java.lang.reflect.InvocationTargetException | NoSuchMethodException e) {
            // Fabric ViewManager not available (Legacy Architecture)
            logIfNewArchSourcesMissing(e);
        }
        try {
            Class<?> instantFabricManagerClass = Class.forName("io.nutrient.react.fabric.ReactInstantPdfViewManagerFabric");
            ViewManager instantFabricManager = (ViewManager) instantFabricManagerClass.getDeclaredConstructor().newInstance();
            viewManagers.add(instantFabricManager);
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | java.lang.reflect.InvocationTargetException | NoSuchMethodException e) {
            // Instant Fabric ViewManager not available (Legacy Architecture)
            logIfNewArchSourcesMissing(e);
        }

        return viewManagers;
    }

    /**
     * The TurboModules (Java) and the Fabric view managers (Kotlin) are both New Architecture
     * sources. If only the TurboModules made it into the build, the Kotlin ones were dropped by the
     * build setup, and every NutrientView would fail with "Can't find ViewManager".
     */
    private static void logIfNewArchSourcesMissing(Exception e) {
        try {
            Class.forName("io.nutrient.react.turbo.NutrientTurboModule");
        } catch (ClassNotFoundException legacyArchitecture) {
            return;
        }
        android.util.Log.e("PSPDFKitPackage", "The New Architecture is enabled, but the Fabric view manager couldn't be created.", e);
    }

}
