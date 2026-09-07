import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ENV } from '../config/env';

function loadAdsModule() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module, not always linked yet
    return require('react-native-google-mobile-ads');
  } catch {
    return null;
  }
}

/**
 * Renders a Google AdMob banner on the free tier. Falls back to an empty
 * view if the native ads module isn't available yet (e.g. before running
 * `expo prebuild`), so it never crashes local development.
 */
export function AdBanner({ visible }: { visible: boolean }) {
  const [AdComponents] = useState(loadAdsModule);

  if (!visible || !AdComponents) return <View style={styles.placeholder} />;

  const { BannerAd, BannerAdSize } = AdComponents;
  const unitId = Platform.OS === 'ios' ? ENV.adMob.iosBannerId : ENV.adMob.androidBannerId;

  return (
    <View style={styles.container}>
      <BannerAd unitId={unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    height: 0,
  },
});
