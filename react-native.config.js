module.exports = {
  dependencies: {
    '@nutrient-sdk/react-native': {
      platforms: {
        android: {
          libraryName: 'nutrient_sdk_react_native_codegen',
          componentDescriptors: [
            'NutrientViewComponentDescriptor',
          ],
          cmakeListsPath: 'src/main/jni/CMakeLists.txt',
        },
      },
    },
  },
}; 