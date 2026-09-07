import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';
import { purchasePro } from '../services/purchases';
import { useAppStore } from '../state/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const BENEFITS = [
  'No ads, ever',
  'Remove the watermark on saved & shared photos',
  'Unlock every premium glasses, earring & necklace style',
  'Full-resolution exports',
];

export function PaywallScreen({ navigation }: Props) {
  const setPro = useAppStore((s) => s.setPro);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const result = await purchasePro();
    setLoading(false);
    if (result.success) {
      setPro(true);
      Alert.alert('Welcome to Pro!', 'Enjoy the full experience.', [{ text: 'Great', onPress: () => navigation.goBack() }]);
    } else if (result.message) {
      Alert.alert('Pro subscription', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton} hitSlop={12}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Go Pro</Text>
      <Text style={styles.subtitle}>Unlock the complete try-on experience</Text>

      <View style={styles.benefits}>
        {BENEFITS.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.subscribeButton} onPress={handleSubscribe} disabled={loading}>
        <Text style={styles.subscribeText}>{loading ? 'Please wait…' : 'Subscribe - $4.99/month'}</Text>
      </Pressable>
      <Text style={styles.finePrint}>Cancel anytime. Payment configured via RevenueCat.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, alignItems: 'center' },
  closeButton: { alignSelf: 'flex-end' },
  closeText: { color: colors.textMuted, fontSize: fontSizes.lg },
  emoji: { fontSize: 56, marginTop: spacing.lg },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', marginTop: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.md, marginTop: spacing.xs, textAlign: 'center' },
  benefits: { marginTop: spacing.xl, width: '100%', gap: spacing.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkmark: { color: colors.success, fontSize: fontSizes.md, fontWeight: '800' },
  benefitText: { color: colors.text, fontSize: fontSizes.sm, flex: 1 },
  subscribeButton: {
    marginTop: spacing.xxl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    width: '100%',
    alignItems: 'center',
  },
  subscribeText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.md },
  finePrint: { color: colors.textMuted, fontSize: fontSizes.xs, marginTop: spacing.sm, textAlign: 'center' },
});
