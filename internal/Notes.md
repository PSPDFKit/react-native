##### TODO

- [x] configuration convert method
- [ ] basic view controller configuration (?) - e.g. for navigation bar items
- [ ] configure for testing license
- [ ] fix copyright comments
- [ ] add missing metadata in `package.json`
- [ ] publish package (?)
- [ ] use CocoaPods to install PSPDFKit for Example project

### Notes

##### Development workflow tips

Use `npm link` to avoid constant `npm install` when you change the library. In Catalog app run:
```
npm link ../../
```

##### Headers in library's Xcode project

The main project has to be able to find React headers. In normal react-native app it's added automatically: `$(SRCROOT)/../node_modules/react-native/React`, but this is often missing when you just want to run sample project and you haven't done `npm install` in main catalog. Moreover if you do run `npm install` in main dir and then try to run Catalog, react complains about naming collisions - looks like it loads content from both `node_modules` directories.
Few existing OSS component just add sample project `node_modules` path to Headers Search Paths to solve that. Mess.

##### RCT prefix

React removes `RCT` prefix in ModuleRegistry::normalizeName.

##### View Controllers in React Native

https://github.com/wix/react-native-controllers - good summary of how view controllers don't really fit into react native world. Would be nice to support this in the future.

##### Xcode 8

Xcode 8 need version `0.33.0-rc.0`.

##### Temporary PSPDFKit.framework integration

Manually add framework to react project and modify Framework Search Paths.

##### Building a wrapper

Looks like all components start as a react app.

##### Integrating with the PSPDFKit.framework

I've checked some existing wrappers (Stripe, Twilio) and they all have additional manual step of adding SDK library dependency to your project. So I will start with the same approach for PSPDFKit.

This [image picker wrapper](https://github.com/marcshilling/react-native-image-picker) points to [rnpm](https://github.com/rnpm/rnpm) which links the library automatically. I don't know how it would work with the external framework though.

##### Updating React Native

`npm install --save react-native@VERSION`
