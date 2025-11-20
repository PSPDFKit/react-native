// @ts-ignore
import {TurboModule, TurboModuleRegistry} from 'react-native';
// @ts-ignore
import type {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  // Methods
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  present(document: string, configuration: Object): Promise<void>;
  presentInstant(documentData: Object, configuration: Object): Promise<void>;
  setPageIndex(pageIndex: number, animated: boolean): void;
  setLicenseKey(licenseKey: string | null): boolean;
  getDocumentProperties(documentPath: string | null): Object;
  setLicenseKeys(androidLicenseKey: string | null, iOSLicenseKey: string | null): boolean;
  processAnnotations(annotationChange: string, annotationTypes: string[] | null, sourceDocumentPath: string, processedDocumentPath: string, password: string | null): Promise<void>;
  dismiss(): Promise<void>;
  handleListenerAdded(event: string, componentId: number): Promise<void>;
  handleListenerRemoved(event: string, componentId: number): Promise<void>;

  // Constants as methods
  versionString(): string;

  // EventEmitter declarations (all events carry a string payload)
  readonly documentLoaded?: EventEmitter<Object>;
  readonly documentLoadFailed?: EventEmitter<Object>;
  readonly documentPageChanged?: EventEmitter<Object>;
  readonly documentScrolled?: EventEmitter<Object>;
  readonly documentTapped?: EventEmitter<Object>;
  readonly annotationsAdded?: EventEmitter<Object>;
  readonly annotationChanged?: EventEmitter<Object>;
  readonly annotationsRemoved?: EventEmitter<Object>;
  readonly annotationsSelected?: EventEmitter<Object>;
  readonly annotationsDeselected?: EventEmitter<Object>;
  readonly annotationTapped?: EventEmitter<Object>;
  readonly textSelected?: EventEmitter<Object>;
  readonly formFieldValuesUpdated?: EventEmitter<Object>;
  readonly formFieldSelected?: EventEmitter<Object>;
  readonly formFieldDeselected?: EventEmitter<Object>;
  readonly analytics?: EventEmitter<Object>;
  readonly bookmarksChanged?: EventEmitter<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Nutrient');
