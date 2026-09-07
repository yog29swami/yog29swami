/**
 * Central place for keys that differ between local development and production.
 * Replace the placeholder values before submitting to the App Store / Play Store.
 * None of these are secrets that need to stay out of the client bundle -
 * RevenueCat and AdMob public SDK keys are meant to ship inside the app.
 */
export const ENV = {
  revenueCat: {
    iosApiKey: 'REVENUECAT_IOS_API_KEY',
    androidApiKey: 'REVENUECAT_ANDROID_API_KEY',
    proEntitlementId: 'pro',
  },
  adMob: {
    // Google's official public test unit IDs. Swap for your own before release.
    androidBannerId: 'ca-app-pub-3940256099942544/6300978111',
    iosBannerId: 'ca-app-pub-3940256099942544/2934735716',
  },
  // Privacy Policy / Terms of Service, required by both the Play Console and App
  // Store Connect. Fill in your own support email inside the page before you rely
  // on it, then swap this for your own hosted URL whenever you're ready to.
  legalUrl: 'https://claude.ai/code/artifact/30f2045f-ca04-4fe8-b64e-b9dd42d84778',
};

export const isPlaceholderKey = (value: string) => value.includes('REVENUECAT') || value.length === 0;
