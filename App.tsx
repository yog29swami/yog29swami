import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAppStore } from './src/state/store';
import { initPurchases, fetchIsProEntitled } from './src/services/purchases';

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const setPro = useAppStore((s) => s.setPro);

  useEffect(() => {
    hydrate();
    initPurchases().then(() => {
      fetchIsProEntitled().then((isPro) => {
        if (isPro) setPro(true);
      });
    });
  }, [hydrate, setPro]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
