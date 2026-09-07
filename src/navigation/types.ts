import { ProductCategory } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Catalog: { category: ProductCategory };
  TryOn: { productId: string };
  Paywall: undefined;
  Settings: undefined;
};
