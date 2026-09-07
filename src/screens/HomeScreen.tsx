import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, fontSizes } from '../theme/tokens';
import { CATEGORY_LABELS, PRODUCTS, getProductsByCategory } from '../data/products';
import { ProductCategory } from '../types';
import { AdBanner } from '../components/AdBanner';
import { useAppStore } from '../state/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  glasses: '🕶️',
  earrings: '💎',
  necklace: '📿',
};

export function HomeScreen({ navigation }: Props) {
  const isPro = useAppStore((s) => s.isPro);
  const categories = Object.keys(CATEGORY_LABELS) as ProductCategory[];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Virtual Try-On</Text>
          <Text style={styles.subtitle}>See it on you before you buy it</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </Pressable>
      </View>

      {!isPro && (
        <Pressable style={styles.upsell} onPress={() => navigation.navigate('Paywall')}>
          <Text style={styles.upsellTitle}>Go Pro ✨</Text>
          <Text style={styles.upsellBody}>Unlock every color, every item, and watermark-free exports.</Text>
        </Pressable>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}
        renderItem={({ item }) => {
          const count = getProductsByCategory(item).length;
          return (
            <Pressable style={styles.categoryRow} onPress={() => navigation.navigate('Catalog', { category: item })}>
              <Text style={styles.categoryEmoji}>{CATEGORY_EMOJI[item]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryLabel}>{CATEGORY_LABELS[item]}</Text>
                <Text style={styles.categoryCount}>{count} styles to try on</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <Text style={styles.footerNote}>{PRODUCTS.length} items across glasses, earrings & necklaces</Text>
        }
      />

      <AdBanner visible={!isPro} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsell: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  upsellTitle: { color: colors.white, fontWeight: '800', fontSize: fontSizes.md },
  upsellBody: { color: '#EDE8FF', marginTop: 4, fontSize: fontSizes.sm },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryEmoji: { fontSize: 28, marginRight: spacing.md },
  categoryLabel: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700' },
  categoryCount: { color: colors.textMuted, fontSize: fontSizes.xs, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 24 },
  footerNote: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, fontSize: fontSizes.xs },
});
