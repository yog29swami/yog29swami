import { Platform } from 'react-native';
import { ENV, isPlaceholderKey } from '../config/env';

function getPurchasesModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module, only present after a dev/production build
  return require('react-native-purchases').default;
}

/**
 * Thin wrapper around RevenueCat so the rest of the app never touches the
 * native SDK directly. Safe to call even before real API keys are configured -
 * it simply no-ops and leaves the user on the free tier.
 */
export async function initPurchases(): Promise<void> {
  const apiKey = Platform.OS === 'ios' ? ENV.revenueCat.iosApiKey : ENV.revenueCat.androidApiKey;
  if (isPlaceholderKey(apiKey)) {
    console.log('[purchases] RevenueCat API key not configured yet - running in free-tier only mode.');
    return;
  }

  try {
    const Purchases = getPurchasesModule();
    Purchases.configure({ apiKey });
  } catch (error) {
    console.warn('[purchases] Failed to initialize RevenueCat', error);
  }
}

export async function fetchIsProEntitled(): Promise<boolean> {
  const apiKey = Platform.OS === 'ios' ? ENV.revenueCat.iosApiKey : ENV.revenueCat.androidApiKey;
  if (isPlaceholderKey(apiKey)) return false;

  try {
    const Purchases = getPurchasesModule();
    const info = await Purchases.getCustomerInfo();
    return Boolean(info?.entitlements?.active?.[ENV.revenueCat.proEntitlementId]);
  } catch (error) {
    console.warn('[purchases] Failed to fetch entitlements', error);
    return false;
  }
}

export async function purchasePro(): Promise<{ success: boolean; message?: string }> {
  const apiKey = Platform.OS === 'ios' ? ENV.revenueCat.iosApiKey : ENV.revenueCat.androidApiKey;
  if (isPlaceholderKey(apiKey)) {
    return {
      success: false,
      message: 'In-app purchases are not configured yet. Add your RevenueCat keys in src/config/env.ts.',
    };
  }

  try {
    const Purchases = getPurchasesModule();
    const offerings = await Purchases.getOfferings();
    const packageToBuy = offerings?.current?.availablePackages?.[0];
    if (!packageToBuy) {
      return { success: false, message: 'No subscription packages are configured in RevenueCat yet.' };
    }
    const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
    const isPro = Boolean(customerInfo?.entitlements?.active?.[ENV.revenueCat.proEntitlementId]);
    return { success: isPro };
  } catch (error: any) {
    if (error?.userCancelled) return { success: false };
    return { success: false, message: error?.message ?? 'Purchase failed. Please try again.' };
  }
}
