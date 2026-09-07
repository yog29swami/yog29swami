import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';
import { useAppStore } from '../state/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const isPro = useAppStore((s) => s.isPro);

  const rows: { label: string; onPress: () => void }[] = [
    { label: isPro ? 'Manage subscription' : 'Upgrade to Pro', onPress: () => navigation.navigate('Paywall') },
    { label: 'Restore purchases', onPress: () => {} },
    { label: 'Privacy Policy', onPress: () => Linking.openURL('https://example.com/privacy') },
    { label: 'Terms of Service', onPress: () => Linking.openURL('https://example.com/terms') },
    { label: 'Contact support', onPress: () => Linking.openURL('mailto:support@example.com') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.status}>
        <Text style={styles.statusLabel}>Plan</Text>
        <Text style={styles.statusValue}>{isPro ? 'Pro' : 'Free'}</Text>
      </View>

      {rows.map((row) => (
        <Pressable key={row.label} style={styles.row} onPress={row.onPress}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  back: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
  title: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700' },
  status: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusLabel: { color: colors.textMuted },
  statusValue: { color: colors.accent, fontWeight: '800' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.text, fontSize: fontSizes.sm },
  chevron: { color: colors.textMuted, fontSize: 20 },
});
