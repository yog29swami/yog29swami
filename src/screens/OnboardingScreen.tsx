import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';
import { saveOnboarded } from '../services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const handleContinue = async () => {
    await saveOnboarded();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.emoji}>🕶️💎📿</Text>
        <Text style={styles.title}>See it on you{'\n'}before you buy it</Text>
        <Text style={styles.subtitle}>
          Try on glasses, earrings and necklaces in seconds using your camera - pick a color, fine-tune the fit, and
          share the look.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  emoji: { fontSize: 48, marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.md, textAlign: 'center', marginTop: spacing.md, lineHeight: 22 },
  button: { backgroundColor: colors.primary, borderRadius: radii.lg, paddingVertical: spacing.md, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.md },
});
