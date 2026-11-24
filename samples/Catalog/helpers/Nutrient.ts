// Constants
import { NativeModules } from 'react-native';
import type { Nutrient as NutrientModule } from '@nutrient-sdk/react-native';

export const Nutrient: NutrientModule = NativeModules.Nutrient;
