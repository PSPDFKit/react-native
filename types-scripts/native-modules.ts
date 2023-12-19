//@ts-ignore
declare module 'react-native' {
  export interface NativeModulesStatic {
      //@ts-ignore
      RNProcessor: Processor;
      //@ts-ignore
      PSPDFKit: PSPDFKit;
   }
}